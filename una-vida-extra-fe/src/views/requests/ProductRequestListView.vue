<script setup>
import { ref, computed, reactive, onBeforeMount } from "vue";
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

const productId = computed(() => {
  return route.params.id;
});

const productTitle = ref();
const setIsproductTitle = (value) => {
  productTitle.value = value;
};

const requestDeletionConfirmed = ref(false);
// Getter for requestDeletionConfirmed
const getRequestDeletionConfirmed = computed(() => {
  return requestDeletionConfirmed.value;
});

// Setter for requestDeletionConfirmed
const setRequestAccepted = (value) => {
  requestDeletionConfirmed.value = value;
};

const acceptedRequestId = ref(null);
const setAcceptedRequestId = (value) => {
  acceptedRequestId.value = value;
};
const getAcceptedRequestId = computed(() => {
  return acceptedRequestId.value;
});

const isLoading = ref(false);
const requestError = ref(false);
const requestCurrentPage = ref(1);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

const prodRequests = ref([]);
// Computed property to sort the prodRequests array by distance
const sortedRequests = computed(() => {
  // Make a copy of the array before sorting to avoid mutating the original array
  const sortedArray = [...prodRequests.value];
  // Sort the array based on the distance property
  sortedArray.sort((a, b) => a.distance - b.distance);
  return sortedArray;
});

/*const getIdsExceptGivenOne = (id) => {
  return sortedRequests.value
    .filter((request) => request.id !== id)
    .map((request) => request.id);
};*/

const numberOfRequests = computed(() => {
  return prodRequests.length;
});

/*
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
*/
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
  console.log("Requested confirmed...");
  setIsModalVisible(false);
  try {
    setRequestAccepted(false);
    isLoading.value = true;
    //const idsForDeactivation = getIdsExceptGivenOne(acceptedRequestId.value);
    const payload = {
      request_id: acceptedRequestId.value,
      product_id: productId.value,
    };
    // Dispatch getProductData action with the product id and the IDs to be deactivated
    const data = await store.dispatch("acceptProductRequest", { payload });

    //if there is no error, get the products again to get up to date information
    const updatedProdRequestData = await store.dispatch(
      "getProductRequests",
      productId.value
    );
    // Update the product variable with the returned data
    prodRequests.value = updatedProdRequestData.product_request;

    isLoading.value = false;
    requestError.value = false;
  } catch (error) {
    handleRequestError(error);
  }
  //Remove with api request, if all good, reload list and show toast
  /* const deletionResult = await deleteProductRequests(
    requestIdToBeRemoved.value
  );*/
  /*if (deletionResult === true) {
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
  }*/
  //removeChildComponentById(reqId);
  setRequestAccepted(true);
};
const onModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setIsModalVisible(false);
  setRequestAccepted(false);
};

//when removing a request, received from a request card
const processRequestAcceptance = (userId, requestId, productId) => {
  console.log(`Accepted request id ${requestId}`);
  setAcceptedRequestId(requestId);
  setIsModalVisible(true);
};

//get product info to get name before loading component
onBeforeMount(async () => {
  console.log("Before the component mounts");
  //fetch product requests from the public api
  try {
    setRequestAccepted(false);
    isLoading.value = true;
    // Dispatch getProductData action with the product id
    const data = await store.dispatch("getProductRequests", productId.value);
    // Update the product variable with the returned data
    console.log(data);
    setIsproductTitle(data.title);
    prodRequests.value = data.product_request;
    isLoading.value = false;
    requestError.value = false;
  } catch (error) {
    handleRequestError(error);
  }
});

// Define a function to handle errors
const handleRequestError = (error) => {
  // Handle Error Here
  console.error(error);
  isLoading.value = false;
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
</script>

<template>
  <div>
    <div class="loading" v-show="isLoading">
      <base-spinner></base-spinner>
    </div>
    <section v-if="!isLoading">
      <div v-if="prodRequests.length < 1">
        <p>You don't have any active requests for {{ productTitle }}.</p>
      </div>

      <div v-else>
        <h2>Requests received for product {{ productTitle }}</h2>
        <div class="request-card-wrapper">
          <!--<div class="request-product-id request-card-item">User Id</div>
          <div class="request-message request-card-item">Message</div>
          <div class="request-date request-card-item">Date</div>
          <div class="request-distance request-card-item">Location</div>
          <div class="request-status request-card-item">Availability</div>
          <div class="request-cancel-button">x</div>-->
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
              :isAccepted="request.is_accepted"
              :productId="request.product_id"
              :userId="request.user_id"
              :userEmail="request.user_details.email"
              :userName="request.user_details.name"
              :user-coords="request.user_details.coords[0]"
              @accepted-request="processRequestAcceptance"
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
            will mark the rest of requests as inactive and your item will no
            longer be listed.
          </p>
          <p>This action cannot be undone.</p></template
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
