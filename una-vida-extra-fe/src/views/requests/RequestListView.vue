<script setup>
import { ref, defineProps, computed, reactive } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

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
const getProductRequests = async () => {
  try {
    const resp = await axios.get(
      `http://localhost:8000/api1/users/${loggedInUser.value}/requests`
    );
    //console.log(resp);
    prodRequests.value = resp.data.data;
    requestCurrentPage.value = resp.data.current_page;

    console.log(resp.data.data);

    console.log(prodRequests);
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

const prodRequests = ref([]);

const requests = ref([
  {
    id: 1,
    date: "01/01/2023",
    message: "Voluptas sed qui et aut consectetur esse facilis o.",
    distance: "34 km",
    isActive: true,
    productId: 13,
  },
  {
    id: 2,
    date: "02/02/2023",
    message: "Ut et vel quasi quia et assumenda.",
    distance: "450 m",
    isActive: false,
    productId: 8,
  },
]);

const numberOfRequests = computed(() => {
  return prodRequests.value.length;
});
</script>

<template>
  <div>
    <h2>My requests</h2>
    <section>
      <div v-if="!numberOfRequests">
        <p>You don't not have any active requests.</p>
      </div>

      <div v-else v-for="request in prodRequests">
        <RequestCard
          :key="request.id"
          :id="request.id"
          :message="request.message"
          :distance="request.distance"
          :date="request.request_date"
          :isActive="request.is_active"
          :productId="request.product_id"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
