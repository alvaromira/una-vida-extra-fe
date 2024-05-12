<template>
  <div>
    <div v-if="isDataLoaded">
      <table class="table table-striped table-hover table-sm user-table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">is_admin</th>
            <th scope="col">is_disabled</th>
            <th scope="col">name</th>
            <th scope="col">surname</th>
            <!-- <th scope="col">image</th>-->
            <th scope="col">email</th>
            <th scope="col">phone</th>
            <!-- <th scope="col">public_details</th>
            <th scope="col">email_verified_at</th>-->
            <th scope="col">location_id</th>
            <!--  <th scope="col">password</th>
            <th scope="col">two_factor_secret</th>
            <th scope="col">two_factor_recovery_codes</th>
            <th scope="col">two_factor_confirmed_at</th>
            <th scope="col">remember_token</th>-->
            <th scope="col">created_at</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.user_is_admin }}</td>
            <td>{{ user.user_is_disabled }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.surname }}</td>
            <!--            <td>{{ user.image }}</td>-->
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <!--<td>{{ user.public_details }}</td>
            <td>{{ user.email_verified_at }}</td>-->
            <td>{{ user.user_location.id }}</td>
            <!-- <td>{{ user.password }}</td>
             <td>{{ user.two_factor_secret }}</td>
            <td>{{ user.two_factor_recovery_codes }}</td>
            <td>{{ user.two_factor_confirmed_at }}</td>
            <td>{{ user.remember_token }}</td> -->
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <button @click="confirmEdition(user)">
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
              <button @click="confirmDeletion(user.id)">
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

      <!--<section class="user-card-container">
        <div v-for="user in userResults.data">
          <user-card
            :key="user.id"
            :id="user.id"
            :image="user.image"
            :title="user.title"
            :date="user.created_at"
            :location="user.location"
          />
        </div>
      </section>-->
      <!-- Pagination controls -->
      <div class="pagination-controls">
        <BaseButton @click="loadPreviousPage" :disabled="currentPage === 1">
          Previous
        </BaseButton>
        <span class="pagination-information"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <BaseButton
          @click="loadNextPage"
          :disabled="currentPage === totalPages"
        >
          Next
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
    id="delete-user-modal"
  >
    <template #header>Confirm User Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this user? The user will no longer be
        listed or visible to anybody. Any requests and products related to this
        user may be affected by this action. Please consider
        <strong>disabling</strong> the user instead.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-user-modal"
  >
    <template #header>User Editing</template>
    <template #body>
      <div class="container">
        <h2>Edit User</h2>
        <form @submit.prevent="submitEditUserForm" class="user-edition-form">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editUserFormData.id"
              readonly
              disabled
              aria-describedby="idHelp"
            />
            <p id="idHelp" class="form-text">
              This is the user ID and it must not be updated.
            </p>
          </div>

          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="editUserFormData.name"
            />
          </div>

          <!-- Title Field -->
          <div class="mb-3">
            <label for="surname" class="form-label">surname</label>
            <input
              type="text"
              class="form-control"
              id="surname"
              v-model="editUserFormData.surname"
            />
          </div>

          <!-- Email Field -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="email"
              v-model="editUserFormData.email"
              readonly
              disabled
              aria-describedby="emailHelp"
            />
            <p id="emailHelp" class="form-text">
              This is the login username and it must not be updated.
            </p>
          </div>

          <!-- Title Field -->
          <div class="mb-3">
            <label for="phone" class="form-label">phone</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              v-model="editUserFormData.phone"
            />
          </div>

          <!-- Admin Field -->
          <div class="mb-3">
            <label for="is-admin" class="form-label">Is Admin?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="is-admin"
              v-model="editUserFormData.user_is_admin"
            />
          </div>

          <!-- is disabled Field -->
          <div class="mb-3">
            <label for="is-disabled" class="form-label"
              >Is the user account disabled?</label
            >
            <input
              type="checkbox"
              class="form-check-input"
              id="is-disabled"
              v-model="editUserFormData.user_is_disabled"
            />
          </div>

          <!-- Created At Field -->
          <div class="mb-3">
            <label for="created_at" class="form-label">Created At</label>
            <input
              type="text"
              class="form-control"
              id="created_at"
              :value="editUserFormData.created_at"
              readonly
              disabled
              aria-describedby="dateHelp"
            />
            <p id="dateHelp" class="form-text">
              This is the user creation date and it must not be updated.
            </p>
          </div>

          <!-- location id Field -->
          <div class="mb-3">
            <label for="location-id" class="form-label">Location id</label>
            <input
              type="number"
              class="form-control"
              id="location-id"
              v-model="editUserFormData.location_id"
            />
          </div>

          <!--<button type="submit" class="btn btn-primary">Submit</button>-->
        </form>
      </div></template
    >
  </ModalConfirmationDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
//import UserCard from "../../components/ui/user/UserCard.vue";
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

const { formatDate } = useUserFriendlyTimeStamp(); //fucion para validar passwords

// Access current route
const route = useRoute();
// Access Vuex store
const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Computed property to access user results state from the store
const userResults = ref(null);

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

const isCreateModalVisible = ref(false);
const setIsCreateModalVisible = (value) => {
  isCreateModalVisible.value = value;
};

const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
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
      setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isCreateModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsDeleteModalVisible(false);
    }
  }
);

const userForDeletion = ref();
const setuserForDeletion = (value) => {
  userForDeletion.value = value;
};
const userForEdition = ref();
const setUserForEdition = (value) => {
  userForEdition.value = value;
};

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = ref(10); // Number of users per page
const totalPages = computed(() => {
  return Math.ceil(userResults.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});
const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value;
});

const paginatedUsers = computed(() => {
  // Slice userResults array to get the current page's data
  return userResults.value.slice(startIndex.value, endIndex.value);
});

// Load users for the current page
/*
const loadUsers = async () => {
  await getUserRequests(currentPage.value);
};*/

// Event handler to load the previous page of users
const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Event handler to load the next page of users
const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Función para buscar usuarios según el texto de búsqueda
const getAllUsers = async () => {
  try {
    isDataLoaded.value = false;
    //Buscar todos los usuarios y almacenarlos localmente sólo en los componentes
    userResults.value = await fetchAllUsers(); //Al actualizarse el valor de userResults, se muestran los datos en la UI
  } catch (error) {
    // gestionar error
    handleRequestError(error);
  } finally {
    isDataLoaded.value = true; // Establece los datos cargados en verdadero una vez que se obtienen los datos o hay error
  }
};

const fetchAllUsers = async () => {
  const allUsers = []; // Array para almacenar usuarios
  let page = 1; // Página actual inicializada en 1

  while (true) {
    try {
      // URL de destino para obtener las solicitudes de usuario de la página actual
      let targetURL = `${baseApiUrl}/users?page=${page}`;

      // Realiza la solicitud para obtener las solicitudes de usuario de la página actual
      const data = await axios.get(targetURL);

      // Obtiene los objetos de solicitud de la respuesta y los agrega al array de solicitudes de usuario
      const requestObjects = data.data.data;
      allUsers.push(...requestObjects);

      // Si no hay una página siguiente, se sale del bucle
      if (!data.data.links.next) {
        break;
      }

      // Incrementa la página actual para obtener los siguientes usuarios
      page++;
    } catch (error) {
      // Registra cualquier error que ocurra al recuperar usuarios
      console.error("Error fetching users:", error);
      throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
    }
  }

  //Después de completar el bucle, devuelve el array de solicitudes de usuario
  return allUsers;
};

// Método para manejar la respuesta correcta de la API
const handleSuccess = async () => {
  isDataLoaded.value = true;

  // Show success toast
  store.commit("addToast", {
    title: "User updated",
    type: "success",
    message: "You have successfully updated the user.",
  });
  closeAllModals();
  await getAllUsers();
};

const handleRequestError = (error) => {
  isDataLoaded.value = true;

  // Inicializa las variables errorStatus y errorMessage
  let errorStatus = null;
  let errorMessage = null;

  if (error.response) {
    // Capturar el codigo de error
    errorStatus = error.response.status;
    console.error("Error status", error.response.status);

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
    // Otros errores
    console.error("There was an unexpected error processing the request.");
    //console.error("Error code", error.code);
    // errorStatus = error.code;
    // errorMessage = error.message;
  }

  // Construir el mensaje de error final
  const finalMessage = `The product could not be updated. Error code: ${errorStatus}. Error message: ${errorMessage}`;

  //Mostrar el toast con el error
  store.commit("addToast", {
    title: "Product Not Updated",
    type: "error",
    message: finalMessage,
  });
};

/*
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
};*/

// Fetch users on component mount
onMounted(async () => {
  await getAllUsers();
});

async function confirmDeletion(userId) {
  setuserForDeletion(userId);
  setIsEditModalVisible(false);
  setIsCreateModalVisible(false);
  setIsDeleteModalVisible(true);
}
async function confirmEdition(user) {
  // Alimentar todos los detalles del usuario al formulario que se abrirá en el modal

  // Convertir los posibles booleanos a enteros en un nuevo objeto clonado
  const castedObject = { ...user };

  // Asignar el valor correcto de location_id a partir del objeto de usuario
  castedObject["location_id"] = castedObject["user_location"]["id"];

  // Asignar propiedades al objeto de datos del formulario de edición del usuario
  for (const key in editUserFormData) {
    if (castedObject.hasOwnProperty(key)) {
      editUserFormData[key] = castedObject[key];
    }
  }

  // Establecer el usuario para la edición y controlar la visibilidad de los modales
  setUserForEdition(castedObject);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(false);
  setIsEditModalVisible(true);
}

async function deleteUser(userId) {
  try {
    //Delete the user by ID
    const resp = await axios.delete(`${baseApiUrl}/users/${userId}`);
    //let message = `User ${userId} has been deleted`;
    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "User Deleted",
      type: "success",
      message: `User ${userId} has been deleted. The user list will be reloaded.`,
    });

    //reload all users, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllUsers();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

function transformEditUserFormData(editUserFormData) {
  // Crear una copia del objeto editUserFormData
  const copyEditUserFormData = { ...editUserFormData };

  // Eliminar las claves que no hacen falta
  delete copyEditUserFormData.public_details;
  delete copyEditUserFormData.id;
  delete copyEditUserFormData.created_at;
  delete copyEditUserFormData.image;
  delete copyEditUserFormData.email;

  // Renombrar la clave 'user_is_admin' a 'is_admin' y convertir a número
  copyEditUserFormData.is_admin = copyEditUserFormData.user_is_admin ? 1 : 0;
  delete copyEditUserFormData.user_is_admin;

  // Renombrar la clave 'user_is_disabled' a 'is_disabled' y convertir a número
  copyEditUserFormData.is_disabled = copyEditUserFormData.user_is_disabled
    ? 1
    : 0;
  delete copyEditUserFormData.user_is_disabled;

  return copyEditUserFormData;
}

async function editUser(userForEdition) {
  let userId = userForEdition.value.id;
  try {
    // Crear una copia del objeto editUserFormData
    const copyEditUserFormData = transformEditUserFormData(editUserFormData);

    //Edit the user by ID
    await store.dispatch("updateUserDetails", {
      id: userId,
      payload: copyEditUserFormData,
    });

    // Dispatch toast message to Vuex store for success notification
    /*store.commit("addToast", {
      title: "User Updated",
      type: "success",
      message: `User ${userId} has been updated. The user list will be reloaded.`,
    });*/
    await handleSuccess();

    return true;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
    return false;
  }
}

const onDeleteModalClose = () => {
  setuserForDeletion(null);
  closeAllModals();
};
const onEditModalClose = async () => {
  await resetEditUserFormData();
  setUserForEdition(null);
  closeAllModals();
};

const onEditModalConfirm = async () => {
  const response = await editUser(userForEdition);
  if (response === true) {
    setUserForEdition(null);
    resetEditUserFormData();
  }
};

const onDeleteModalConfirm = async () => {
  await deleteUser(userForDeletion.value);
  setUserForEdition(null);
  closeAllModals();
};

const editUserFormData = {
  id: null, //id no se actualiza nunca, solo se lee
  user_is_admin: null,
  user_is_disabled: null,
  name: "",
  surname: "",
  image: null,
  email: "",
  phone: "",
  public_details: null,
  location_id: null,
  created_at: "", //solo se lee
  //  password nunca se manda para actualizar. Los administradores deben recomendar el forgot-password para los usuarios
  //created_at nunca se actualiza solo se lee,
};

const resetEditUserFormData = async () => {
  editUserFormData.id = null;
  editUserFormData.user_is_admin = null;
  editUserFormData.user_is_disabled = null;
  editUserFormData.name = "";
  editUserFormData.surname = "";
  editUserFormData.image = null;
  editUserFormData.email = "";
  editUserFormData.phone = "";
  editUserFormData.public_details = null;
  editUserFormData.location_id = null;
  editUserFormData.created_at = null;
};

const submitEditUserForm = () => {
  // Submit form logic goes here
  console.log(editUserFormData);
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
.user-card-container {
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
.user-edition-form {
  overflow-y: scroll;
  max-height: 400px;
}
.user-table tbody td {
  font-size: 0.8rem;
}
.user-table thead th {
  font-size: 0.9rem;
  text-align: center;
}
</style>
