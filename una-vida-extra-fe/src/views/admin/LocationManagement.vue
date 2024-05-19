<!--Componente para la gestion de ubicacion. No se pueden crear ubicaciones, eso es la responsabilidad del usuario final.-->
<template>
  <div>
    <div v-if="isDataLoaded">
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Latitud</th>
            <th scope="col">Longitud</th>
            <th scope="col">Ciudad</th>
            <th scope="col">País</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in productLocations" :key="location.id">
            <td>{{ location.id }}</td>
            <td>{{ location.latitude }}</td>
            <td>{{ location.longitude }}</td>
            <td>{{ location.city }}</td>
            <td>{{ location.country }}</td>
            <td>
              <button @click="confirmEdition(location)">
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
              <button @click="confirmDeletion(location.id)">
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
    </div>
    <div v-else class="loading">
      <base-spinner></base-spinner>
    </div>
  </div>
  <ModalConfirmationDialog
    v-if="isDeleteModalVisible"
    @modal-confirmed="onDeleteModalConfirm"
    @modal-close="onDeleteModalClose"
    id="delete-location-modal"
  >
    <template #header>Confirmar eliminación de ubicación</template>
    <template #body
      ><p>
        ¿Estás seguro de que deseas eliminar esta ubicación? Eliminar una
        ubicación utilizada por un usuario podría tener un gran impacto en el
        usuario, sus productos y solicitudes.
      </p>
      <p>Esta acción no se puede deshacer.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-location-modal"
  >
    <template #header>Edición de ubicación</template>
    <template #body>
      <div class="container">
        <h2>Edit Location</h2>
        <form @submit.prevent="submitEditLocationForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editLocationFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Lat Field -->
          <div class="mb-3">
            <label for="latitude" class="form-label">Latitud</label>
            <input
              type="number"
              class="form-control"
              id="latitude"
              :value="editLocationFormData.latitude"
            />
          </div>
          <!-- Long Field -->
          <div class="mb-3">
            <label for="longitude" class="form-label">Longitud</label>
            <input
              type="number"
              class="form-control"
              id="longitude"
              :value="editLocationFormData.longitude"
            />
          </div>

          <!-- City -->
          <div class="mb-3">
            <label for="city" class="form-label">Ciudad</label>
            <input
              type="text"
              class="form-control"
              id="city"
              v-model="editLocationFormData.city"
            />
          </div>
          <!-- Country -->
          <div class="mb-3">
            <label for="country" class="form-label">País</label>
            <input
              type="text"
              class="form-control"
              id="country"
              v-model="editLocationFormData.country"
            />
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";
import axios from "axios";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//todas las ubicaciones
const productLocations = ref(null);

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
  //setIsCreateModalVisible(false);
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
      //   setIsCreateModalVisible(false);
    }
  }
);

const locationForDeletion = ref();
const setLocationForDeletion = (value) => {
  locationForDeletion.value = value;
};
const locationForEdition = ref();
const setLocationForEdition = (value) => {
  locationForEdition.value = value;
};

// Función para buscar todas las ubicaciones.
const getAllLocations = async () => {
  try {
    isDataLoaded.value = false;
    // Obtener todas las ubicaciones para almacenar para que puedan usarse
    productLocations.value = await fetchAllLocations();
    //Establece la carga a verdadero una vez que se obtienen los datos
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
};

//Funcion para hacer la llamada a la API y obtener las ubicaciones. Se hace desde el componente y no desde el store porque no se va a usar en ninguna parte mas. Se pagina directamente en la llamada y se guardan todas las ubicaciones en local
const fetchAllLocations = async () => {
  const allLoc = []; // Array para almacenar las solicitudes de usuario
  let currentPage = 1; // Página actual inicializada en 1

  while (true) {
    try {
      // URL de destino para obtener las solicitudes de usuario de la página actual
      let targetURL = `${baseApiUrl}/locations?page=${currentPage}`;

      // Realiza la solicitud para obtener las solicitudes de usuario de la página actual
      const data = await axios.get(targetURL);

      // Obtiene los objetos de solicitud de la respuesta y los agrega al array de solicitudes de usuario
      const requestObjects = data.data.data;
      allLoc.push(...requestObjects);

      // Si no hay una página siguiente, se sale del bucle
      if (!data.data.links.next) {
        break;
      }

      // Incrementa la página actual para obtener las siguientes solicitudes
      currentPage++;
    } catch (error) {
      // Registra cualquier error que ocurra al recuperar las solicitudes de usuario
      console.error("Error al obtener ubicaciones:", error);
      throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
    }
  }

  //Después de completar el bucle, devuelve el array de solicitudes de usuario
  return allLoc;
};

// Función para manejar errores de solicitud
const handleRequestError = (error) => {
  console.error(error); //como es un error, se saca como tal por consola tambien
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `Hubo un error al procesar las solicitudes. (Código: ${error.response.status})`
    : `Hubo un error al procesar las solicitudes. (Código: ${error.code})`;

  // Enviar toast al estado de Vuex para notificación de error
  store.commit("addToast", {
    title: "Error al procesar la solicitud",
    type: "error",
    message: errorMessage,
  });
};

// Obtener todas las ubicaciones en el montaje del componente
onMounted(async () => {
  await getAllLocations();
});

//Funcion que se ejecuta al confirmar el modal de borrado
async function confirmDeletion(location) {
  setLocationForDeletion(location);
  // setIsCreateModalVisible(false);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}

//Funcion que se ejecuta al confirmar el modal de edicion
async function confirmEdition(location) {
  //poner todos los datos en el formulario que se abrirá en el modal
  for (const key in editLocationFormData) {
    if (location.hasOwnProperty(key)) {
      editLocationFormData[key] = location[key];
    }
  }
  setLocationForEdition(location);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
  //setIsCreateModalVisible(false);
}

//Funcion que se encarga de eliminar el elemento y gestionar el resultado
async function deleteLocation(locationId) {
  try {
    //Borar por ID

    const resp = await axios.delete(`${baseApiUrl}/locations/${locationId}`);
    store.commit("addToast", {
      title: "Ubicación eliminada",
      type: "success",
      message: `La ubicación ha sido eliminada. La lista se recargará.`,
    });
    closeAllModals(); //se cierran todos los modales al terminar
    await getAllLocations();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para editar por el ID via la API del backend. Se usan los datos del formulario del edicion mostrado en el modal
async function editLocation() {
  try {
    const resp = await axios.put(
      `${baseApiUrl}/locations/${editLocationFormData.id}`,
      {
        latitude: editLocationFormData.latitude,
        longitude: editLocationFormData.longitude,
        country: editLocationFormData.country,
        city: editLocationFormData.city,
      }
    );
    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Ubicación actualizada",
      type: "success",
      message: `La ubicación ha sido actualizada. La lista se recargará.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllLocations();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para gestionar el resultado del cierre sin accion del modal de borrado
const onDeleteModalClose = () => {
  setLocationForDeletion(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de edicion
const onEditModalClose = async () => {
  await resetEditLocationFormData();
  setLocationForEdition(null);
  closeAllModals();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onEditModalConfirm = async () => {
  await editLocation();
  setLocationForEdition(null);
  resetEditLocationFormData();
};

//Funcion para gestionar la confirmacion del modal de borrrado. Con esto se pasa a la accion con la API del backend.
const onDeleteModalConfirm = async () => {
  await deleteLocation(locationForDeletion.value);
  setLocationForEdition(null);
  closeAllModals();
};

//Objecto que se vincula al formulario de edicion para eventualmente mandarlo como payload de la llamada  ala API
const editLocationFormData = {
  id: null,
  city: "",
  country: "",
  latitude: null,
  longitude: null,
};

//Funcion para resetear el formulario de edicion
const resetEditLocationFormData = async () => {
  editLocationFormData.id = null;
  editLocationFormData.city = "";
  editLocationFormData.country = "";
  editLocationFormData.latitude = null;
  editLocationFormData.longitude = null;
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
img.mini {
  width: 50px;
  height: auto;
}
#new-location-container {
  text-align: right;
  padding-bottom: 2rem;
}
</style>
