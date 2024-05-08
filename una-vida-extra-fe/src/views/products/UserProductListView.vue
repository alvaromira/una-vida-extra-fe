<template>
  <div class="row">
    <div class="col">
      <h2>My Products</h2>
    </div>
  </div>

  <div class="row" id="user-product-addition">
    <section class="col d-flex justify-content-end">
      <BaseButton :to="{ name: 'addProduct' }" link="true"
        >Add New Product
      </BaseButton>
    </section>
  </div>
  <div v-if="isDataLoaded" class="row">
    <div id="user-product-list" class="row">
      <section class="product-card-container">
        <div v-for="product in userProducts.data">
          <product-card
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :date="product.date"
            :location="product.location"
            :category="product.category"
            :description="product.description"
          />
        </div>
      </section>
    </div>
    <!-- Pagination controls -->
    <div class="row">
      <div class="pagination-controls" v-if="totalPages > 1">
        <BaseButton
          @click="loadPreviousPage"
          mode="outline"
          :disabled="currentPage === 1"
        >
          <span class="sr-only">Previous</span>
          <span aria-hidden="true">&lt;</span>
        </BaseButton>
        <span class="pagination-information"
          >{{ currentPage }}/{{ totalPages }}</span
        >
        <BaseButton
          mode="outline"
          @click="loadNextPage"
          :disabled="currentPage === totalPages"
        >
          <span class="sr-only">Next</span>
          <span aria-hidden="true">&gt;</span>
        </BaseButton>
      </div>
    </div>
  </div>
  <div v-else class="loading row">
    <base-spinner></base-spinner>
  </div>
</template>

<script setup>
import BaseButton from "../../components/ui/BaseButton.vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import AddNewProduct from "./AddNewProduct.vue";
import { ref, defineProps, computed, reactive, onMounted } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const route = useRoute();
const store = useStore();

// Define a ref to track if data is loaded
const isDataLoaded = ref(false);

const isLoading = ref(false);
const requestError = ref(false);
const requestCurrentPage = ref(1);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

const userProducts = ref([]);

/*const numberOfUserProducts = computed(() => {
  if (
    userProducts.meta.total !== undefined &&
    userProducts.meta.total !== null
  ) {
    return userProducts.meta.total;
  } else {
    return 0;
  }
});*/
const loggedInUser = computed(() => {
  return store.state.user.id;
});

// Pagination variables
const currentPage = ref(1);
const pageSize = 10; // Number of products per page
const totalPages = computed(() => userProducts.value.meta.last_page);

// Load products for the current page
const loadProducts = async () => {
  await getUserProducts(loggedInUser.value, currentPage.value);
};

// Event handler to load the previous page of products
const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadProducts();
  }
};

// Event handler to load the next page of products
const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadProducts();
  }
};

const getUserProducts = async (userId, page) => {
  try {
    isDataLoaded.value = false;
    const fetchedUserProducts = await store.dispatch("getUserProducts", {
      userId,
      page,
    });
    userProducts.value = fetchedUserProducts;
  } catch (error) {
    // Handle request error
    handleRequestError(error);
  } finally {
    isDataLoaded.value = true;
  }
};

// Function to handle request errors
const handleRequestError = (error) => {
  console.error(error);
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `There was an error while processing the requests. (Code: ${error.response.status})`
    : `There was an error while processing the requests. (Code: ${error.code})`;

  // Dispatch toast message to Vuex store for error notification
  store.commit("addToast", {
    title: "Error Processing Your Products",
    type: "error",
    message: errorMessage,
  });
};

//fetch product requests from the public api
/*const getUserProducts = async () => {
  try {
    const resp = await axios.get(
      `${baseApiUrl}/users/${loggedInUser.value}/products`
    );
    //console.log(resp);
    userProducts.value = resp.data.data;
    requestCurrentPage.value = resp.data.current_page;
    //isLoading.value = false;
    requestError.value = false;
    //router.push({ name: "products", query: { registration: "success" } });
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
  } catch (error) {
    // Handle Error Here
    console.error(error);
    //isLoading.value = false;
    requestError.value = true;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data", error.response.data);
      console.error("Error status", error.response.status);
      errorDetails.code = error.response.status;
      errorDetails.message = error.message;
      if (error.response.data.errors) {
        let requestRecivedErrors = error.response.data.errors;
        for (const property in requestRecivedErrors) {
          errorDetails.errors.push(requestRecivedErrors[property].toString());
        }
      }
      isDataLoaded.value = true; // Set data loaded to true once data is fetched

      //console.log(error.response.headers);
      // } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      //   console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message", error.message);
      console.error("Error code", error.code);
      errorDetails.code = error.code;
      errorDetails.message = error.message;
      isDataLoaded.value = true; // Set data loaded to true once data is fetched
    }
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
  }
};*/

// Fetch products on component mount
onMounted(async () => {
  await getUserProducts(loggedInUser.value, currentPage);
});
</script>

<style scoped>
.product-card-container {
  display: flex;

  align-items: flex-start;
  flex-flow: row wrap;
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  gap: 3rem;
}

h2 {
  text-transform: uppercase;
  text-align: center;
  color: #7ab370;
  padding: 1rem 1rem 1.5rem 1rem;
}

#user-product-addition {
  padding: 2rem;
}
.pagination-controls {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}
.pagination-information {
  padding-left: 1rem;
  padding-right: 1rem;
}
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
