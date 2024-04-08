<template>
  <div>
    <div v-if="registrationRedirection">
      <p>User successfully registered!</p>
    </div>
    <div v-if="isDataLoaded">
      <h2 v-if="sText">
        {{ productResults.meta.total }} result(s) for found for {{ sText }}.
      </h2>

      <h2 v-else>Check the latest additions!</h2>

      <section class="product-card-container">
        <div v-for="product in productResults.data">
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import ProductsSummary from "../../components/ui/product/ProductsSummary.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
// Access current route
const route = useRoute();
// Access Vuex store
const store = useStore();
// Computed property to check if there's a registration redirection query parameter
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});
// Computed property to access product results state from the store
const productResults = computed(() => store.state.productResults);
// Reference to track if data is loaded
const isDataLoaded = ref(false);
// Props definition for search text
const props = defineProps({
  sText: {
    type: String,
    default: "",
  },
});

// Watch for changes in search text prop
watch(
  () => props.sText,
  (newValue, oldValue) => {
    console.log("sText prop changed:", newValue);
    // Fetch products based on new search text
    getProductRequests(props.sText);
  }
);

// Function to fetch products based on search text
const getProductRequests = async (s) => {
  try {
    isDataLoaded.value = false;
    // Fetch products or perform product search depending on route params
    if (s) {
      await store.dispatch("searchProducts", s);
    } else {
      await store.dispatch("getProducts");
    }
    // Set data loaded to true once data is fetched
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
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
    title: "Error Processing Requests",
    type: "error",
    message: errorMessage,
  });
};

// Fetch products on component mount
onMounted(async () => {
  await getProductRequests(props.sText);
  console.log(props.sText);
});

// Reset productResults to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductResults", []);
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
