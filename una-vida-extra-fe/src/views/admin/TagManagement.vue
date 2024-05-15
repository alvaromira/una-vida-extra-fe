<!--Componente para gestionar todas las etiquetas disponibles. Se pueden crear nuevas, editar y borrar. Se usa el estado del store de Vuex y se pagina directamente para ponerlas todas a la vez. Se usan modales para estas acciones-->
<template>
  <div>
    <div v-if="isDataLoaded">
      <div id="new-tag-container">
        <BaseButton @click="confirmAddition">Create new Tag</BaseButton>
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in productTags" :key="tag.id">
            <td>{{ tag.id }}</td>
            <td>{{ tag.name }}</td>
            <td>
              <button @click="confirmEdition(tag)">
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
              <button @click="confirmDeletion(tag.id)">
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
    id="delete-tag-modal"
  >
    <template #header>Confirm Tag Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this tag? The tag will be removed from
        products where it is now used.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-tag-modal"
  >
    <template #header>Tag Editing</template>
    <template #body>
      <div class="container">
        <h2>Edit Tag</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editTagFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="editTagFormData.name"
            ></textarea>
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isCreateModalVisible"
    @modal-confirmed="onCreateModalConfirm"
    @modal-close="onCreateModalClose"
    id="create-tag-modal"
  >
    <template #header>Tag Creation</template>
    <template #body>
      <div class="container">
        <h2>Create Tag</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="newTag"
            ></textarea>
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";

// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Computed property to access product results state from the store

const productTags = computed(() => store.state.productTags);

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

const isCreateModalVisible = ref(false);
//Setter paraisCreateModalVisible
const setIsCreateModalVisible = (value) => {
  isCreateModalVisible.value = value;
};

const newTag = ref();

//Funcion para cerrar todos los modales a la vez
const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(false);
};

// Watchs que monitoriza y se utilizará como protección para garantizar que los modales nunca puedan ser visibles al mismo tiempo
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
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isCreateModalVisible.value,
  (newValue, oldValue) => {
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsDeleteModalVisible(false);
    }
  }
);

const tagForDeletion = ref();
const setTagForDeletion = (value) => {
  tagForDeletion.value = value;
};
const tagForEdition = ref();
const setTagForEdition = (value) => {
  tagForEdition.value = value;
};

// Function to fetch products based on search text
const getAllTags = async () => {
  try {
    isDataLoaded.value = false;
    // Fetch all tags to store so they can be used
    await store.dispatch("getProductTags");
    //Establece la carga a verdadero una vez que se obtienen los datos
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
};

// Función para manejar errores de solicitud
const handleRequestError = (error) => {
  console.error(error); //como es un error, se saca como tal por consola tambien
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `There was an error while processing the requests. (Code: ${error.response.status})`
    : `There was an error while processing the requests. (Code: ${error.code})`;

  // Enviar toast al estado de Vuex para notificación de error
  store.commit("addToast", {
    title: "Error Processing Requests",
    type: "error",
    message: errorMessage,
  });
};

// Fetch all tags on component mount
onMounted(async () => {
  await getAllTags();
});

// Reset tags in store to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductTags", []);
});

//Funcion que se ejecuta al confirmar el modal de borrado
async function confirmDeletion(tag) {
  setTagForDeletion(tag);
  setIsCreateModalVisible(false);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
//Funcion que se ejecuta al confirmar el modal de creacion
async function confirmAddition() {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(true);
}

//Funcion que se ejecuta al confirmar el modal de edicion
async function confirmEdition(tag) {
  //feed all the tags details to the form to be opened in the modal
  for (const key in editTagFormData) {
    if (tag.hasOwnProperty(key)) {
      editTagFormData[key] = tag[key];
    }
  }
  setTagForEdition(tag);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
  setIsCreateModalVisible(false);
}

//Funcion que se encarga de eliminar el elemento y gestionar el resultado
async function deleteTag(tagId) {
  try {
    //Borar por ID
    await store.dispatch("deleteTag", tagId);

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Tag Deleted",
      type: "success",
      message: `Tag ${tagId} has been deleted. The tag list will be reloaded.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para crear elemento llamando a la API del backend
async function createTag(tagName) {
  try {
    await store.dispatch("createTag", {
      name: tagName,
    });

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Tag Created",
      type: "success",
      message: `The tag has been created. The tag list will be reloaded.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}
//Funcion para editar por el ID via la API del backend. Se usan los datos del formulario del edicion mostrado en el modal
async function editTag(tag) {
  try {
    await store.dispatch("updateTag", {
      id: editTagFormData.id,
      newname: editTagFormData.name,
    });

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Tag Updated",
      type: "success",
      message: `The tag has been updated. The tag list will be reloaded.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para gestionar el resultado del cierre sin accion del modal de borrado
const onDeleteModalClose = () => {
  setTagForDeletion(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de edicion
const onEditModalClose = async () => {
  await resetEditTagFormData();
  setTagForEdition(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de creacion
const onCreateModalClose = () => {
  newTag.value = null;
  closeAllModals();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onEditModalConfirm = async () => {
  await editTag(tagForEdition);
  setTagForEdition(null);
  resetEditTagFormData();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onCreateModalConfirm = async () => {
  await createTag(newTag.value);
  newTag.value = null;
};

//Funcion para gestionar la confirmacion del modal de borrrado. Con esto se pasa a la accion con la API del backend.
const onDeleteModalConfirm = async () => {
  await deleteTag(tagForDeletion.value);
  setTagForEdition(null);
  closeAllModals();
};

//Objecto que se vincula al formulario de edicion para eventualmente mandarlo como payload de la llamada  ala API
const editTagFormData = {
  id: null,
  name: "",
};

//Funcion para resetear el formulario de edicion
const resetEditTagFormData = async () => {
  editTagFormData.id = null;
  editTagFormData.name = "";
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
#new-tag-container {
  text-align: right;
  padding-bottom: 2rem;
}
</style>
