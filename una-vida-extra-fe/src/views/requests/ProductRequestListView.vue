<script setup>
import { ref, computed, reactive } from "vue";
import ProductRequestCard from "../../components/ui/request/ProductRequestCard.vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";

const store = useStore();
const route = useRoute();
//Modal related
const isModalVisible = ref(false);
// Setter for isModalVisible
const setIsModalVisible = (value) => {
  isModalVisible.value = value;
};

const requestDeletionConfirmed = ref(false);
// Getter for requestDeletionConfirmed
const getRequestDeletionConfirmed = computed(() => {
  return requestDeletionConfirmed.value;
});

// Setter for requestDeletionConfirmed
const setRequestDeletionConfirmed = (value) => {
  requestDeletionConfirmed.value = value;
};

const requestIdToBeRemoved = ref(null);
const setRequestIdToBeRemoved = (value) => {
  requestIdToBeRemoved.value = value;
};
const getRequestIdToBeRemoved = computed(() => {
  return requestIdToBeRemoved.value;
});

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
  setRequestDeletionConfirmed(false);
  isLoading.value = true;
  try {
    const resp = await axios.get(
      `http://localhost:8000/api1/products/${route.params.id}/?include_tags=true&include_requests=true`
    );
    console.log(resp.data.data.product_request);
    prodRequests.value = resp.data.data.product_request;

    const frutas = ["guindas", "manzanas", "bananas"];
    frutas.sort(); // ['bananas', 'guindas', 'manzanas']
    console.log(frutas);

    //Sort the received data by the distance
    /*prodRequests.value = prodRequests.value.sort((a, b) => {
      // Convert distance to numeric values for comparison
      const distanceA = parseFloat(a.distance.value);
      const distanceB = parseFloat(b.distance.value);

      // Compare distances
      if (distanceA < distanceB) {
        return -1; // a should come before b
      } else if (distanceA > distanceB) {
        return 1; // b should come before a
      } else {
        return 0; // distances are equal
      }
    });
*/
    isLoading.value = false;
    requestError.value = false;
    //router.push({ name: "products", query: { registration: "success" } });
  } catch (error) {
    // Handle Error Here
    console.error(error);
    isLoading.value = false;
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

const prodRequests = ref([]);
// Computed property to sort the prodRequests array by distance
const sortedRequests = computed(() => {
  // Make a copy of the array before sorting to avoid mutating the original array
  const sortedArray = [...prodRequests.value];
  // Sort the array based on the distance property
  sortedArray.sort((a, b) => a.distance - b.distance);
  return sortedArray;
});

const numberOfRequests = computed(() => {
  return prodRequests.length;
});

getProductRequests();

const deleteProductRequests = async (deletionRequestID) => {
  try {
    const resp = await axios.delete(
      `http://localhost:8000/api1/requests/${deletionRequestID}`
    );
    console.log(resp);
    if (resp.status === 200 || resp.status === 204) {
      console.log("Data successfully deleted");
      return true;
    }
  } catch (error) {
    // Handle Error Here
    console.error("An error occurred while deleting the request:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data  - request deletion", error.response.data);
      console.error("Error status - request deletion", error.response.status);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message - request deletion", error.message);
      console.error("Error code - request deletion", error.code);
    }
    return false;
  }
};

/*const removeChildComponentById = (id) => {
  const index = prodRequests.value.findIndex((child) => child.id === id);
  if (index !== -1) {
    prodRequests.value.splice(index, 1);
  }
};*/

//behaviour for modal
//To do
//Check all requests, set all of them as not available but the one acceptes
//reload
const onModalConfirm = async () => {
  console.log("Deletion confirmed...");
  setIsModalVisible(false);
  //Remove with api request, if all good, reload list and show toast
  const deletionResult = await deleteProductRequests(
    requestIdToBeRemoved.value
  );
  if (deletionResult === true) {
    store.commit("addToast", {
      title: "Request deleted",
      type: "success",
      message: "You have successfully deleted the request.",
    });
    await getProductRequests();
  } else {
    store.commit("addToast", {
      title: "Request deleted",
      type: "error",
      message:
        "There was an error deleting the request. Try again. If the error persists, get in touch.",
    });
  }
  //removeChildComponentById(reqId);
  setRequestDeletionConfirmed(true);
};
const onModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setIsModalVisible(false);
  setRequestDeletionConfirmed(false);
};

//when removing a request, received from a request card
const removeCancelledRequest = async (userId, reqId, prodId) => {
  setRequestIdToBeRemoved(reqId);

  console.log(
    `Parent removing card for request ID ${reqId} from the list of requests. Action triggered by ${userId}`
  );
  setIsModalVisible(true);
  //todo, do it with a modal
  //TO DO show toast with result
};
</script>

<template>
  <div>
    <h2>Requests received for product</h2>

    <div class="loading" v-show="isLoading">
      <base-spinner></base-spinner>
    </div>
    <section v-if="!isLoading">
      <div v-if="prodRequests.length < 1">
        <p>You don't not have any active requests.</p>
      </div>

      <div v-else>
        <div class="request-card-wrapper">
          <div class="request-product-id request-card-item">User Id</div>
          <div class="request-message request-card-item">Message</div>
          <div class="request-date request-card-item">Date</div>
          <div class="request-distance request-card-item">Location</div>
          <div class="request-status request-card-item">Availability</div>
          <div class="request-cancel-button">x</div>
        </div>
        <transition-group name="list" tag="div">
          <div v-for="request in sortedRequests" :key="request.id">
            <ProductRequestCard
              :key="request.id"
              :id="request.id"
              :message="request.message"
              :distance="request.distance"
              :date="request.request_date"
              :isActive="request.is_active"
              :productId="request.product_id"
              :userId="request.user_id"
              @accepted-request="removeCancelledRequest"
            /></div
        ></transition-group>
      </div>

      <ModalConfirmationDialog
        v-if="isModalVisible"
        @modal-confirmed="onModalConfirm"
        @modal-close="onModalClose"
      >
        <template #header>Accept Product Request</template>
        <template #body
          ><p>
            Are you sure you want to Accept this request for your product? This
            will mark the rest as inactive.
          </p></template
        ></ModalConfirmationDialog
      >
    </section>
  </div>
</template>

<style scoped>
.request-card-wrapper {
  display: flex;
  padding: 1.5rem;
  padding-bottom: 0.25rem;
  margin-top: 2rem;
  margin-bottom: 0rem;
}
.request-card-item {
  flex: 1;
  text-align: center;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
