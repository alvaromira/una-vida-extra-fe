<script setup>
import { ref, computed, reactive, onBeforeMount } from "vue";
import ProductRequestCard from "../../components/ui/request/ProductRequestCard.vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";

const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const route = useRoute();
//Variables para el componente Modal
const isModalVisible = ref(false); // variable para controlar la visibilidad del modal
// Setter para isModalVisible
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

const isLoading = ref(false); //variable para gestionar el estado de carga local
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

const numberOfRequests = computed(() => {
  return prodRequests.length;
});

//behaviour for modal
//To do
//Check all requests, set all of them as not available but the one acceptes
//reload
const onModalConfirm = async () => {
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
  setRequestAccepted(true);
};
const onModalClose = () => {
  setIsModalVisible(false);
  setRequestAccepted(false);
};

//when removing a request, received from a request card
const processRequestAcceptance = (userId, requestId, productId) => {
  setAcceptedRequestId(requestId);
  setIsModalVisible(true);
};

//get product info to get name before loading component
onBeforeMount(async () => {
  //fetch product requests from the public api
  try {
    setRequestAccepted(false);
    isLoading.value = true;
    // Dispatch getProductData action with the product id
    const data = await store.dispatch("getProductRequests", productId.value);
    // Update the product variable with the returned data

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
  console.error(error); //como es un error, se saca como tal por consola tambien
  isLoading.value = false;
  requestError.value = true;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Datos del error", error.response.data);
    console.error("Código de error", error.response.status);
    store.commit("addToast", {
      title: "Error al procesar la solicitud",
      type: "error",
      message: `Hubo un error al procesar las solicitudes. (Código: ${error.response.status})`,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Mensaje de error", error.message);
    console.error("Código de error", error.code);
    store.commit("addToast", {
      title: "Error al procesar la solicitud",
      type: "error",
      message: `Hubo un error al procesar las solicitudes. (Código: ${error.code})`,
    });
  }
};
</script>

<template>
  <div class="row justify-content-md-center">
    <div class="back-to-products-button col">
      <a :href="$router.resolve({ name: 'userProducts' }).href"
        >Volver a tus productos</a
      >
    </div>
  </div>

  <div class="row" v-if="isLoading">
    <div class="col">
      <div class="loading">
        <base-spinner></base-spinner>
      </div>
    </div>
  </div>
  <section v-if="!isLoading">
    <div
      class="row d-flex justify-content-center"
      v-if="prodRequests.length < 1"
    >
      <div class="col-md-8 no-requests-found text-center">
        <p>
          ¡Ups! No tienes ninguna solicitud activa para este artículo (aún).
        </p>
        <p>
          Haz clic
          <RouterLink v-if="!isUserAdmin" :to="{ name: 'userProducts' }"
            >aquí</RouterLink
          >
          para volver a tus productos.
        </p>
      </div>
    </div>
    <div v-else class="row">
      <div class="row">
        <div class="col">
          <h2>
            Solicitudes recibidas para <em>{{ productTitle }}</em>
          </h2>
        </div>
      </div>
      <!-- <div class="request-card-wrapper">
        </div>-->
      <transition-group name="list">
        <div v-for="request in sortedRequests" :key="request.id">
          <ProductRequestCard
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
          />
        </div>
      </transition-group>
    </div>
  </section>

  <ModalConfirmationDialog
    v-if="isModalVisible"
    @modal-confirmed="onModalConfirm"
    @modal-close="onModalClose"
  >
    <template #header>Aceptar solicitud de producto</template>
    <template #body
      ><p>
        ¿Está seguro de que desea aceptar esta solicitud para su producto? Esto
        marcará el resto de las solicitudes como inactivas y su artículo ya no
        aparecerá en el listado.
      </p>
      <p>Esta acción no se puede deshacer.</p></template
    ></ModalConfirmationDialog
  >
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
.no-requests-found {
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
}
.no-requests-found p {
  margin: 0;
  color: var(--bs-nav-link-color);
}
.no-requests-found p a {
  text-decoration: none;
  color: #edb421;
}
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
.back-to-products-button {
  padding-bottom: 2rem;
}
.back-to-products-button a {
  text-decoration: none;
  color: #edb421;
  cursor: pointer;
}
.back-to-products-button a:hover {
  text-decoration: underline;
  color: #edb421;
}
</style>
