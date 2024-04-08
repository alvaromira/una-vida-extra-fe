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

const route = useRoute();
const store = useStore();
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});
// Map the productResults state to a local computed property
const productResults = computed(() => store.state.productResults);
const isDataLoaded = ref(false);
//const requestError = ref(false);

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
    getProductRequests(props.sText);
  }
);

const getProductRequests = async (s) => {
  try {
    isDataLoaded.value = false;
    //fetch products or perform product search depending on route params
    if (s) {
      const resp = await store.dispatch("searchProducts", s);
    } else {
      const resp = await store.dispatch("getProducts");
    }
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    //requestError.value = false;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    handleRequestError(error);
  }
};

const handleRequestError = (error) => {
  console.error(error);
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `There was an error while processing the requests. (Code: ${error.response.status})`
    : `There was an error while processing the requests. (Code: ${error.code})`;

  store.commit("addToast", {
    title: "Error Processing Requests",
    type: "error",
    message: errorMessage,
  });
};

onMounted(async () => {
  await getProductRequests(props.sText);
  console.log(props.sText);
});
onUnmounted(() => {
  // Call the mutation to set productResults to an empty array
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
