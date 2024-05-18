<template>
  <div>
    <div class="row title">
      <div class="col"><h2>Mis solicitudes</h2></div>
    </div>

    <div class="loading" v-show="isLoading">
      <base-spinner></base-spinner>
    </div>
    <section v-if="!isLoading">
      <div v-if="!numberOfRequests">
        <div class="row">
          <div class="no-requests-found text-center">
            <p>No tienes ninguna solicitud activa.</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="request-card-wrapper">
          <div class="request-product-id request-card-item">Id producto</div>
          <div class="request-message request-card-item">Mensaje</div>
          <div class="request-date request-card-item">Fecha</div>
          <div class="request-distance request-card-item">Ubicación</div>
          <div class="request-status request-card-item">Disponibilidad</div>
          <div class="request-cancel-button">Cancelar</div>
        </div>
        <transition-group name="list" tag="div">
          <div v-for="request in prodRequests" :key="request.id">
            <RequestCard
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

      <ModalConfirmationDialog
        v-if="isModalVisible"
        @modal-confirmed="onModalConfirm"
        @modal-close="onModalClose"
      >
        <template #header>Eliminar solicitud</template>
        <template #body
          ><p>
            ¿Está seguro de que desea eliminar la solicitud
            {{ requestIdToBeRemoved }}?
          </p></template
        ></ModalConfirmationDialog
      >
    </section>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from "vue";
import RequestCard from "../../components/ui/request/RequestCard.vue";
import axios from "axios";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//Variables para el componente Modal
const isModalVisible = ref(false); // variable para controlar la visibilidad del modal
// Setter para isModalVisible
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

const isLoading = ref(false); //variable para gestionar el estado de carga local
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
      `${baseApiUrl}/users/${loggedInUser.value}/requests`
    );
    //console.log(resp);
    prodRequests.value = resp.data.data;
    requestCurrentPage.value = resp.data.current_page;

    //console.log(resp.data.data);

    //console.log(prodRequests);
    isLoading.value = false;
    requestError.value = false;
    //router.push({ name: "products", query: { registration: "success" } });
  } catch (error) {
    // Handle Error Here
    console.error(error); //como es un error, se saca como tal por consola tambien
    isLoading.value = false;
    requestError.value = true;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Datos del error", error.response.data);
      console.error("Código de error", error.response.status);
      errorDetails.code = error.response.status;
      errorDetails.message = error.message;
      if (error.response.data.errors) {
        let requestRecivedErrors = error.response.data.errors;
        for (const property in requestRecivedErrors) {
          errorDetails.errors.push(requestRecivedErrors[property].toString());
        }
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Mensaje de error", error.message);
      console.error("Código de error", error.code);
      errorDetails.code = error.code;
      errorDetails.message = error.message;
    }
  }
};

const prodRequests = ref([]);

const numberOfRequests = computed(() => {
  return prodRequests.value.length;
});

getProductRequests();

const deleteProductRequests = async (deletionRequestID) => {
  try {
    const resp = await axios.delete(
      `${baseApiUrl}/requests/${deletionRequestID}`
    );
    if (resp.status === 200 || resp.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Se produjo un error al eliminar la solicitud:", error);
    if (error.response) {
      // Se realizó la solicitud y el servidor respondió con un código de estado
      //fuera del rango de 2xx
      console.error(
        "Datos de error: solicitud de eliminación",
        error.response.data
      );
      console.error(
        "Estado de error: solicitud de eliminación",
        error.response.status
      );
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error(
        "Mensaje de error: solicitud de eliminación",
        error.message
      );
      console.error("Código de error: solicitud de eliminación", error.code);
    }
    return false;
  }
};

const removeChildComponentById = (id) => {
  const index = prodRequests.value.findIndex((child) => child.id === id);
  if (index !== -1) {
    prodRequests.value.splice(index, 1);
  }
};

//behaviour for modal
const onModalConfirm = async () => {
  setIsModalVisible(false);
  //Remove with api request, if all good, reload list and show toast
  const deletionResult = await deleteProductRequests(
    requestIdToBeRemoved.value
  );
  if (deletionResult === true) {
    store.commit("addToast", {
      title: "Solicitud eliminada",
      type: "success",
      message: "Has eliminado la solicitud.",
    });
    await getProductRequests();
  } else {
    store.commit("addToast", {
      title: "Solicitud eliminada",
      type: "error",
      message:
        "Hubo un error al eliminar la solicitud. Inténtalo nuevamente. Si el error persiste, ponte en contacto.",
    });
  }
  //removeChildComponentById(reqId);
  setRequestDeletionConfirmed(true);
};
const onModalClose = () => {
  setIsModalVisible(false);
  setRequestDeletionConfirmed(false);
};

//when removing a request, received from a request card
const removeCancelledRequest = async (userId, reqId, prodId) => {
  setRequestIdToBeRemoved(reqId);

  setIsModalVisible(true);
  //todo, do it with a modal
  //TO DO show toast with result
};
</script>

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

.row.title {
  padding-bottom: 2rem;
  text-align: center;
}
</style>
