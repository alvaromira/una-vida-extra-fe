<script setup>
import { ref, computed, reactive } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";

const route = useRoute();
const store = useStore();

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

    //console.log(resp.data.data);

    //console.log(prodRequests);
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

const numberOfRequests = computed(() => {
  return prodRequests.value.length;
});

const removeChildComponentById = (id) => {
  const index = prodRequests.value.findIndex((child) => child.id === id);
  if (index !== -1) {
    prodRequests.value.splice(index, 1);
  }
};

//when removing a request, received from a request card
const removeCancelledRequest = (userId, reqId, prodId) => {
  console.log(
    `Parent removing card ${reqId} from the list of requests. Action triggered by ${userId}`
  );
  //todo, do it with a modal
  if (
    confirm(
      `Are you sure you want to deleted your request for product with ID ${prodId}`
    ) == true
  ) {
    removeChildComponentById(reqId);
  }

  /*
  if (getRequestDeletionConfirmed.value) {
    console.log("Modal confirmed, removing...");
    removeChildComponentById(reqId);
  } else {
    console.log("Modal cancelled");
  }*/

  //TO DO show toast with result
};

/*
function onConfirm() {
  setIsModalVisible(false);
  console.log("Deleting requests");
  //TO do, remove with api request, if all good, then remove component
  removeChildComponentById(reqId);
  setRequestDeletionConfirmed(true);
}

function onModalClose() {
  setIsModalVisible(false);
  setRequestDeletionConfirmed(false);
}*/
</script>

<template>
  <div>
    <h2>My requests</h2>
    <p>This is is the list of requests you have placed.</p>
    <section>
      <div v-if="!numberOfRequests">
        <p>You don't not have any active requests.</p>
      </div>

      <div v-else>
        <div class="request-card-wrapper">
          <div class="request-product-id request-card-item">Product Id</div>
          <div class="request-message request-card-item">Message</div>
          <div class="request-date request-card-item">Date</div>
          <div class="request-distance request-card-item">Location</div>
          <div class="request-status request-card-item">Availability</div>
          <div class="request-cancel-button">Cancel</div>
        </div>
        <transition-group name="list" tag="div">
          <div v-for="request in prodRequests">
            <RequestCard
              :key="request.id"
              :id="request.id"
              :message="request.message"
              :distance="request.distance"
              :date="request.request_date"
              :isActive="request.is_active"
              :productId="request.product_id"
              @removed-request="removeCancelledRequest"
            /></div
        ></transition-group>
      </div>

      <!--<ModalConfirmationDialog
        v-if="isModalVisible"
        @confirmed="onConfirm"
        @close="onModalClose"
        >asdasdfas</ModalConfirmationDialog
      >-->
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
