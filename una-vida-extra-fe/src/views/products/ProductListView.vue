<template>
  <div>
    <div v-if="registrationRedirection">
      <p>User successfully registered!</p>
    </div>
    <h2 v-if="sText">Results for: {{ sText }}.</h2>

    <h2 v-else>Check the latest additions!</h2>
    <div v-if="isDataLoaded">
      <section class="product-card-container">
        <div v-for="product in prods">
          <product-card
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :date="product.created_at"
            :location="product.location"
          />
        </div>
      </section>
    </div>
    <div v-else class="loading">
      <base-spinner></base-spinner>
    </div>
    <section id="products-data-summary">
      <ProductsSummary></ProductsSummary>
    </section>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  onBeforeMount,
  onUpdated,
  watch,
} from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import ProductsSummary from "../../components/ui/product/ProductsSummary.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";

const route = useRoute();
const store = useStore();
//computed
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});

//computed
/*const searchText = computed(() => {
  return route.query.q;
});*/

//This the props from the router
//const searchText = ref("");

const props = defineProps({
  sText: {
    type: String,
    default: "",
  },
});

watch(
  () => props.sText,
  (newValue, oldValue) => {
    console.log("sText prop changed:", newValue);
    isDataLoaded.value = false;
    getProductRequests(props.sText);

    // Do something with the new value or old value
  }
);

// Define a ref to track if data is loaded
const isDataLoaded = ref(false);
const requestError = ref(false);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

const getProductRequests = async (s) => {
  try {
    //fetch products or perform product search depending on route params
    if (s) {
      const resp = await store.dispatch("searchProducts", s);
      prods.value = resp.data;
    } else {
      const resp = await store.dispatch("getProducts");
      // You can also pass a page number if needed
      // await store.dispatch('getProducts', 1);
      prods.value = resp.data;
    }
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    //requestError.value = false;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    handleRequestError(error);
  }
};

// Define a function to handle errors
const handleRequestError = (error) => {
  // Handle Error Here
  console.error(error);
  isDataLoaded.value = true; // Set data loaded to true once data is fetched
  requestError.value = true;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Error data", error.response.data);
    console.error("Error status", error.response.status);
    store.commit("addToast", {
      title: "Error Processing Requests",
      type: "error",
      message: `There was an error while processing the requests. (Code: ${error.response.status})`,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error message", error.message);
    console.error("Error code", error.code);
    store.commit("addToast", {
      title: "Error Processing Requests",
      type: "error",
      message: `There was an error while processing the requests. (Code: ${error.code})`,
    });
  }
};

const prods = ref([]);
onMounted(async () => {
  console.log("onmounted");
  isDataLoaded.value = false;

  await getProductRequests(props.sText);
  console.log(props.sText);
});
onBeforeMount(async () => {
  console.log("Before mount");
  // await getProductRequests();
});
onUnmounted(() => {
  console.log(`Unmounting component and clearing store products`);
});
onUpdated(async () => {
  console.log(`onUpdated`);
  // await getProductRequests();
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
