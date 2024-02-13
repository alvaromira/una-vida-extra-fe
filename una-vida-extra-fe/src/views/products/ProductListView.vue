<template>
  <div>
    <div v-if="registrationRedirection">
      <p>User successfully registered!</p>
    </div>
    <h2>Check the latest additions!</h2>
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
    <section id="products-data-summary">
      <ProductsSummary></ProductsSummary>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import ProductsSummary from "../../components/ui/product/ProductsSummary.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();
//computed
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});

const isLoading = ref(false);
const requestError = ref(false);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

//fetch products from the public api
const getProductRequests = async () => {
  try {
    const resp = await axios.get("http://localhost:8000/api1/products");
    //console.log(resp);
    prods.value = resp.data.data;
    console.log(resp.data.data);

    console.log(prods);
    //isLoading.value = false;
    requestError.value = false;
    //router.push({ name: "products", query: { registration: "success" } });
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
    }
  }
};
getProductRequests();
const prods = ref([]);

// Lifecycle hook using `onMounted`
onMounted(() => {
  //Testing toasts
  /* store.commit("addToast", {
    title: "Hello Vuex!",
    type: "success",
    message: "It looks like you have successfully set up Vuex.",
  });

  store.commit("addToast", {
    title: "System Error",
    type: "error",
    message:
      "Our API is currently experiencing issues - please try again in a couple minutes.",
  });

  store.commit("addToast", {
    title: "New Mention in Post",
    type: "info",
    message:
      "One of your followers mentioned you in a new post. Click here to see it.",
  });*/
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
