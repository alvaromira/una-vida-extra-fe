<template>
  <div>
    <div v-if="isDataLoaded">
      <!--<div id="new-location-container">
        <BaseButton @click="confirmAddition">Create new location</BaseButton>
      </div>-->
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col">City</th>
            <th scope="col">Country</th>
            <th scope="col">edit</th>
            <th scope="col">delete</th>
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
    <template #header>Confirm Location Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this location? Deleting a location used
        by a user could have a big impact on the user, their products and
        requests.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-location-modal"
  >
    <template #header>Location Editing</template>
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
            <label for="latitude" class="form-label">Latitude</label>
            <input
              type="number"
              class="form-control"
              id="latitude"
              :value="editLocationFormData.latitude"
            />
          </div>
          <!-- Long Field -->
          <div class="mb-3">
            <label for="longitude" class="form-label">longitude</label>
            <input
              type="number"
              class="form-control"
              id="longitude"
              :value="editLocationFormData.longitude"
            />
          </div>

          <!-- City -->
          <div class="mb-3">
            <label for="city" class="form-label">City</label>
            <input
              type="text"
              class="form-control"
              id="city"
              v-model="editLocationFormData.city"
            />
          </div>
          <!-- Country -->
          <div class="mb-3">
            <label for="country" class="form-label">Country</label>
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
  <!--<ModalConfirmationDialog
    v-if="isCreateModalVisible"
    @modal-confirmed="onCreateModalConfirm"
    @modal-close="onCreateModalClose"
    id="create-location-modal"
  >
    <template #header>Location Creation</template>
    <template #body>
      <div class="container">
        <h2>Create Location</h2>
        <form @submit.prevent="subitEditProductForm">
        
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="newLocation"
            ></textarea>
          </div>
        </form></div
    >

    </template>
  </ModalConfirmationDialog>  -->
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

// Access current route
const route = useRoute();
// Access Vuex store
const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//todas las ubicaciones
const productLocations = ref(null);

// Reference to track if data is loaded
const isDataLoaded = ref(false);

//Variables para el componente Modal
const isDeleteModalVisible = ref(false);
// Setter for isDeleteModalVisible
const setIsDeleteModalVisible = (value) => {
  isDeleteModalVisible.value = value;
};

//Variables para el componente Modal
const isEditModalVisible = ref(false);
// Setter for isEditModalVisible
const setIsEditModalVisible = (value) => {
  isEditModalVisible.value = value;
};

//const isCreateModalVisible = ref(false);
//const setIsCreateModalVisible = (value) => {
//  isCreateModalVisible.value = value;
//};

//const newLocation = ref();

const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  //setIsCreateModalVisible(false);
};

// Watch to be used as safeguard to make sure both modals can never be visible at the same time
watch(
  () => isEditModalVisible.value,
  (newValue, oldValue) => {
    console.log(
      "isEditModalVisible prop changed from",
      oldValue,
      "to",
      newValue
    );
    if ((newValue = true)) {
      setIsDeleteModalVisible(false);
      //setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      //   setIsCreateModalVisible(false);
    }
  }
);
/*watch(
  () => isCreateModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsDeleteModalVisible(false);
    }
  }
);*/

const locationForDeletion = ref();
const setLocationForDeletion = (value) => {
  locationForDeletion.value = value;
};
const locationForEdition = ref();
const setLocationForEdition = (value) => {
  locationForEdition.value = value;
};

// Function to fetch all locations
const getAllLocations = async () => {
  try {
    isDataLoaded.value = false;
    // Fetch all locations to store so they can be used
    productLocations.value = await fetchAllLocations();
    // Set data loaded to true once data is fetched
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
};

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
      console.error("Error fetching locations:", error);
      throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
    }
  }

  //Después de completar el bucle, devuelve el array de solicitudes de usuario
  return allLoc;
};

// Function to handle request errors
const handleRequestError = (error) => {
  console.error(error);
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `There was an error while processing the requests. (Code: ${error.response.status})`
    : `There was an error while processing the requests. (Code: ${error.code})`;

  // Dispatch toast message to Vuex store for error notification
  store.commit("addToast", {
    title: "Error Processing Requests",
    type: "error",
    message: errorMessage,
  });
};

// Fetch all tags on component mount
onMounted(async () => {
  await getAllLocations();
});

async function confirmDeletion(location) {
  setLocationForDeletion(location);
  // setIsCreateModalVisible(false);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
/*async function confirmAddition() {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
 // setIsCreateModalVisible(true);
}*/

async function confirmEdition(location) {
  //feed all the categoriy details to the form to be opened in the modal
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

async function deleteLocation(locationId) {
  try {
    //Delete the product by ID
    await store.dispatch("deleteLocation", locationId);
    const resp = await axios.delete(`${baseApiUrl}/locations/${locationId}`);
    store.commit("addToast", {
      title: "Location Deleted",
      type: "success",
      message: `The location has been deleted. The list will be reloaded.`,
    });
    closeAllModals();
    await getAllLocations();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}
/*
async function createLocation(locationName) {
  try {
    //Edit the product by ID
    await store.dispatch("createLocation", {
      name: locationName,
    });

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Location Created",
      type: "success",
      message: `The location has been created. The list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllLocations();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}*/
async function editLocation(locID) {
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
    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Location Updated",
      type: "success",
      message: `The location has been updated. The list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllLocations();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

const onDeleteModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setLocationForDeletion(null);
  closeAllModals();
};
const onEditModalClose = async () => {
  console.log("Edit Modal closed, nothing confirmed...");
  await reseteditLocationFormData();
  setLocationForEdition(null);
  closeAllModals();
};
/*const onCreateModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  newLocation.value = null;
  closeAllModals();
};*/

const onEditModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await editLocation(locationForEdition);
  setLocationForEdition(null);
  reseteditLocationFormData();
};

/*const onCreateModalConfirm = async () => {
  await createLocation(newLocation.value);
  newLocation.value = null;
};*/

const onDeleteModalConfirm = async () => {
  await deleteLocation(locationForDeletion.value);
  setLocationForEdition(null);
  closeAllModals();
};

const editLocationFormData = {
  id: null,
  city: "",
  country: "",
  latitude: null,
  longitude: null,
};

const reseteditLocationFormData = async () => {
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
