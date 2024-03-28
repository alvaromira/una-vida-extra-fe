<template>
  <div v-if="isDataLoaded">
    <h2>My Products</h2>
    <div id="user-product-list">
      <section class="product-card-container">
        <div v-for="product in userProducts">
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
  </div>
  <div v-else class="loading">
    <base-spinner></base-spinner>
  </div>
  <div id="user-product-addition">
    <section>
      <BaseButton :to="{ name: 'addProduct' }" link="true"
        >Add New Product
      </BaseButton>
    </section>
  </div>
</template>

<script setup>
import BaseButton from "../../components/ui/BaseButton.vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import AddNewProduct from "./AddNewProduct.vue";
import { ref, defineProps, computed, reactive } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";

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

const loggedInUser = computed(() => {
  return store.state.user.id;
});

//fetch product requests from the public api
const getUserProducts = async () => {
  try {
    const resp = await axios.get(
      `http://localhost:8000/api1/users/${loggedInUser.value}/products`
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
};

getUserProducts();

const userProducts = ref([]);

const numberOfUserProducts = computed(() => {
  return userProducts.value.length;
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
</style>
