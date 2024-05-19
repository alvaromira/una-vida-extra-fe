<!--Componente para la gestion de los solicitudes de todos los usuarios y productos. Se pagina directamente en local, por lo que la carga inicial es un poco lenta. Se usan modales para la edicion y el borrado. El administrador no crea solicitudes desde el panel. -->
<template>
  <div>
    <div v-if="isDataLoaded">
      <table class="table table-striped table-hover table-sm request-table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Fecha sol.</th>
            <th scope="col">Está activo</th>
            <th scope="col">Mensaje</th>
            <th scope="col">id usuario</th>
            <th scope="col">id prod.</th>
            <th scope="col">está aceptada</th>
            <th scope="col">creación</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in paginatedRequests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ formatDate(request.request_date) }}</td>
            <td>{{ request.is_active }}</td>
            <td>{{ request.message }}</td>
            <td>{{ request.user_id }}</td>
            <td>{{ request.product_id }}</td>
            <td>{{ request.is_accepted }}</td>

            <td>{{ formatDate(request.created_at) }}</td>
            <td>
              <button @click="confirmEdition(request)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                  />
                </svg>
              </button>
            </td>
            <td>
              <button @click="confirmDeletion(request.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination controls -->
      <div class="pagination-controls">
        <BaseButton @click="loadPreviousPage" :disabled="currentPage === 1">
          Anterior
        </BaseButton>
        <span class="pagination-information"
          >Página {{ currentPage }} de {{ totalPages }}</span
        >
        <BaseButton
          @click="loadNextPage"
          :disabled="currentPage === totalPages"
        >
          Siguiente
        </BaseButton>
      </div>
    </div>

    <div v-else class="loading">
      <base-spinner></base-spinner>
    </div>
  </div>
  <ModalConfirmationDialog
    v-if="isDeleteModalVisible"
    @modal-confirmed="onDeleteModalConfirm"
    @modal-close="onDeleteModalClose"
    id="delete-request-modal"
  >
    <template #header>Confirmar la eliminación de la solicitud</template>
    <template #body
      ><p>
        ¿Está seguro de que desea eliminar esta solicitud? La solicitud ya no
        aparecerá en la lista ni será visible para nadie. Todos los usuarios y
        productos relacionados con esta solicitud pueden verse afectados por
        esta acción.
      </p>
      <p>Esta acción no se puede deshacer.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-request-modal"
  >
    <template #header>Edición de solicitud</template>
    <template #body>
      <div class="container">
        <h2>Editar solicitud</h2>
        <form
          @submit.prevent="submitEditRequestForm"
          class="request-edition-form"
        >
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editRequestFormData.id"
              readonly
              disabled
              aria-describedby="idHelp"
            />
            <p id="idHelp" class="form-text">
              Este es el ID de la solicitud y no debe actualizarse.
            </p>
          </div>

          <!-- MEssage Field -->
          <div class="mb-3">
            <label for="message" class="form-label">Mensaje</label>
            <textarea
              rows="5"
              class="form-control"
              id="message"
              v-model="editRequestFormData.message"
            ></textarea>
          </div>

          <!-- user ID Field -->
          <div class="mb-3">
            <label for="user-id" class="form-label">id usuario</label>
            <input
              type="number"
              class="form-control"
              id="user-id"
              v-model="editRequestFormData.user_id"
            />
          </div>

          <!-- product ID Field -->
          <div class="mb-3">
            <label for="product-id" class="form-label">id producto</label>
            <input
              type="number"
              class="form-control"
              id="product-id"
              v-model="editRequestFormData.product_id"
            />
          </div>

          <!-- Admin Field -->
          <div class="mb-3">
            <label for="is-accepted" class="form-label">¿Está aceptada?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="is-accepted"
              v-model="editRequestFormData.is_accepted"
            />
          </div>

          <!-- Admin Field -->
          <div class="mb-3">
            <label for="is-active" class="form-label">¿Esta activa?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="is-active"
              v-model="editRequestFormData.is_active"
            />
          </div>

          <!-- Created At Field -->
          <div class="mb-3">
            <label for="created_at" class="form-label">Creación</label>
            <input
              type="text"
              class="form-control"
              id="created_at"
              :value="editRequestFormData.created_at"
              readonly
              disabled
              aria-describedby="dateHelp"
            />
            <p id="dateHelp" class="form-text">
              Esta es la fecha de creación de la solicitud y no debe
              actualizarse.
            </p>
          </div>
        </form>
      </div></template
    >
  </ModalConfirmationDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
//import RequestCard from "../../components/ui/request/RequestCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";
import axios from "axios";
import { useUserFriendlyTimeStamp } from "../../composables/userFriendlyTimeStamp";

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const baseUrlImg = import.meta.env.VITE_BASE_IMG_URL;
const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const { formatDate } = useUserFriendlyTimeStamp(); //funcion para poner la fecha en bonito

// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Computed property to access request results state from the store
const requestResults = ref(null);

// Referencia para saber si los datos estan cargados
const isDataLoaded = ref(false);

//Variables para el componente Modal
const isDeleteModalVisible = ref(false);
// Setter para isDeleteModalVisible
const setIsDeleteModalVisible = (value) => {
  isDeleteModalVisible.value = value;
};

//Variables para el componente Modal
const isEditModalVisible = ref(false);
// Setter para isEditModalVisible
const setIsEditModalVisible = (value) => {
  isEditModalVisible.value = value;
};

//Funcion para cerrar todos los modales a la vez
const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
};

// Watchs que monitoriza y se utilizará como protección para garantizar que los modales nunca puedan ser visibles al mismo tiempo
watch(
  () => isEditModalVisible.value,
  (newValue, oldValue) => {
    if ((newValue = true)) {
      setIsDeleteModalVisible(false);
      //setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      //setIsCreateModalVisible(false);
    }
  }
);
//Variable y setter para la solicitud a borrar
const requestForDeletion = ref();
const setrequestForDeletion = (value) => {
  requestForDeletion.value = value;
};
//Variable y setter para la solicitud a editar

const requestForEdition = ref();
const setRequestForEdition = (value) => {
  requestForEdition.value = value;
};

//Total de solicitudes
const totalRequest = ref(0);

//Variables usadas en la paginacion
const currentPage = ref(1);
const itemsPerPage = ref(10); // Numero de elementos por pagina
const totalPages = computed(() => {
  return Math.ceil(requestResults.value.length / itemsPerPage.value);
});

//indice de inicio de la pagina
const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});
//indice de fin de una pagina
const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value;
});

//computada para los resultados paginados en local. Se usa el indica de inicio y de fin para cortar los elementos necesarios de los resultados originales recuperados de la api
const paginatedRequests = computed(() => {
  // Cortar la matriz requestResults para obtener los datos de la página actual
  return requestResults.value.slice(startIndex.value, endIndex.value);
});

// Manejador de eventos para cargar la página anterior de solicitudes
const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Manejador de eventos para cargar la siguiente página de solicitudes
const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Función para obtener todas las solicitudes y gestionar el resultado en el componente
const getAllRequests = async () => {
  try {
    isDataLoaded.value = false;
    //Buscar todos los usuarios y almacenarlos localmente sólo en los componentes
    requestResults.value = await fetchAllRequests(); //Al actualizarse el valor de requestResults, se muestran los datos en la UI
  } catch (error) {
    // gestionar error
    handleRequestError(error);
  } finally {
    isDataLoaded.value = true; // Establece los datos cargados en verdadero una vez que se obtienen los datos o hay error
  }
};
//Funcion para recuperar todas las solicitudes en local, sin usar el estado. Se paginan todos los resultados de la api
const fetchAllRequests = async () => {
  const allRequests = []; // Array para almacenar usuarios
  let page = 1; // Página actual inicializada en 1

  while (true) {
    try {
      // URL de destino para obtener las solicitudes de usuario de la página actual
      let targetURL = `${baseApiUrl}/requests?page=${page}`;

      // Realiza la solicitud para obtener las solicitudes de usuario de la página actual
      const data = await axios.get(targetURL);

      // Obtiene los objetos de solicitud de la respuesta y los agrega al array de solicitudes de usuario
      const requestObjects = data.data.data;
      allRequests.push(...requestObjects);

      // Si no hay una página siguiente, se sale del bucle
      if (!data.data.links.next) {
        break;
      }

      if (!totalRequest.value > 0) {
        totalRequest.value = data.data.meta.total;
      }
      // Incrementa la página actual para obtener los siguientes usuarios
      page++;
    } catch (error) {
      // Registra cualquier error que ocurra al recuperar usuarios
      console.error("Error al recuperar solicitudes:", error);
      throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
    }
  }

  //Después de completar el bucle, devuelve el array de solicitudes de usuario
  return allRequests;
};

// Método para manejar la respuesta correcta de la API
const handleSuccess = async () => {
  isDataLoaded.value = true;

  // Show success toast
  store.commit("addToast", {
    title: "Solicitud actualizada",
    type: "success",
    message: "Ha actualizado correctamente la solicitud.",
  });
  closeAllModals();
  await getAllRequests();
};

const handleRequestError = (error) => {
  isDataLoaded.value = true;

  // Inicializa las variables errorStatus y errorMessage
  let errorStatus = null;
  let errorMessage = null;

  if (error.response) {
    // Capturar el codigo de error
    errorStatus = error.response.status;
    console.error("Código de error", error.response.status);

    // Extraer mensaje de error, solo el primero, de forma que si hay varios se solucinan uno a uno.
    const errors = error.response.data.errors;
    if (errors && Object.keys(errors).length > 0) {
      const firstChildKey = Object.keys(errors)[0];
      const firstChildErrors = errors[firstChildKey];
      if (Array.isArray(firstChildErrors) && firstChildErrors.length > 0) {
        errorMessage = firstChildErrors[0];
      }
    }
  } else {
    console.error("Se produjo un error inesperado al procesar la solicitud.");
  }

  // Construir el mensaje de error final
  const finalMessage = `El producto no se pudo actualizar. Código de error: ${errorStatus}. Mensaje de error: ${errorMessage}`;

  //Mostrar el toast con el error
  store.commit("addToast", {
    title: "Solicitud no actualizada",
    type: "error",
    message: finalMessage,
  });
};

// Recuperar solicitudes en el montaje de componentes
onMounted(async () => {
  await getAllRequests();
});

//Funcion que se ejecuta al confirmar el modal de borrado
async function confirmDeletion(requestId) {
  setrequestForDeletion(requestId);
  setIsEditModalVisible(false);
  //setIsCreateModalVisible(false);
  setIsDeleteModalVisible(true);
}
//Funcion que se ejecuta al confirmar el modal de edicion
async function confirmEdition(request) {
  // Convertir los posibles booleanos a enteros en un nuevo objeto clonado
  const castedObject = { ...request };

  // Asignar propiedades al objeto de datos del formulario de edición del usuario
  for (const key in editRequestFormData) {
    if (castedObject.hasOwnProperty(key)) {
      editRequestFormData[key] = castedObject[key];
    }
  }

  // Establecer el usuario para la edición y controlar la visibilidad de los modales
  setRequestForEdition(castedObject); //se envia el objecto actualizado y convertido para la llamada a la api
  setIsDeleteModalVisible(false);
  //setIsCreateModalVisible(false);
  setIsEditModalVisible(true);
}

//Funcion que se encarga de eliminar el elemento y gestionar el resultado
async function deleteRequest(requestId) {
  try {
    //Delete the request by ID
    const resp = await axios.delete(`${baseApiUrl}/requests/${requestId}`);

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Solicitud eliminada",
      type: "success",
      message: `La solicitud ${requestId} ha sido eliminada. La lista de solicitudes se recargará.`,
    });

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllRequests(); //se recargan todas las solicitudes
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

function transformEditRequestFormData(editRequestFormData) {
  // Crear una copia del objeto editRequestFormData
  const copyEditRequestFormData = { ...editRequestFormData };

  // Eliminar las claves que no hacen falta
  delete copyEditRequestFormData.id;
  delete copyEditRequestFormData.created_at;

  // Renombrar la clave 'request_date' a 'is_admin' y convertir a número
  copyEditRequestFormData.is_admin = copyEditRequestFormData.request_date
    ? 1
    : 0;

  // Convertir la claves 'is_active' e is_accepted a número
  copyEditRequestFormData.is_active = copyEditRequestFormData.is_active ? 1 : 0;
  copyEditRequestFormData.is_accepted = copyEditRequestFormData.is_accepted
    ? 1
    : 0;

  return copyEditRequestFormData;
}

//Funcion para editar por el ID via la API del backend. Se usan los datos del formulario del edicion mostrado en el modal
async function editRequest(requestForEdition) {
  let requestId = requestForEdition.value.id;
  try {
    // Crear una copia del objeto editRequestFormData
    const copyEditRequestFormData =
      transformEditRequestFormData(editRequestFormData);

    const resp = await axios.put(
      `${baseApiUrl}/requests/${requestId}`,
      copyEditRequestFormData
    );

    await handleSuccess();

    return true;
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
    return false;
  }
}

//Funcion para gestionar el resultado del cierre sin accion del modal de borrado
const onDeleteModalClose = () => {
  setrequestForDeletion(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de edicion
const onEditModalClose = async () => {
  await resetEditRequestFormData();
  setRequestForEdition(null);
  closeAllModals();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onEditModalConfirm = async () => {
  const response = await editRequest(requestForEdition);
  if (response === true) {
    setRequestForEdition(null);
    resetEditRequestFormData();
  }
};

//Funcion para gestionar la confirmacion del modal de borrrado. Con esto se pasa a la accion con la API del backend.
const onDeleteModalConfirm = async () => {
  await deleteRequest(requestForDeletion.value);
  setRequestForEdition(null);
  closeAllModals();
};

//Objecto que se vincula al formulario de edicion para eventualmente mandarlo como payload de la llamada  ala API
const editRequestFormData = {
  id: null, //id no se actualiza nunca, solo se lee
  request_date: null,
  is_active: null,
  message: "",
  user_id: null,
  product_id: null,
  is_accepted: null,
  created_at: "", //solo se lee
};

//Funcion para resetear el formulario de edicion
const resetEditRequestFormData = async () => {
  editRequestFormData.id = null;
  editRequestFormData.request_date = null;
  editRequestFormData.is_active = null;
  editRequestFormData.message = "";
  editRequestFormData.user_id = null;
  editRequestFormData.product_id = null;
  editRequestFormData.is_accepted = null;
  editRequestFormData.created_at = "";
};
</script>
<style scoped>
.pagination-controls {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}
.pagination-information {
  padding-left: 1rem;
  padding-right: 1rem;
}
.request-card-container {
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
img.mini {
  width: 50px;
  height: auto;
}
.request-edition-form {
  overflow-y: scroll;
  max-height: 400px;
}
.request-table tbody td {
  font-size: 0.8rem;
}
.request-table thead th {
  font-size: 0.9rem;
  text-align: center;
}
</style>
