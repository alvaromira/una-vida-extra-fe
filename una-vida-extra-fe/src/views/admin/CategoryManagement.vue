<!--Componente donde se cargan todas las categorias para poder editarlas. Ademas, como administrador se debe poder añadir nuevas categorias. Para editar y crear, se usan formularios en modales-->
<template>
  <div>
    <div v-if="isDataLoaded">
      <div id="new-category-container">
        <BaseButton @click="confirmAddition">Crear nueva categoría</BaseButton>
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in productCategories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
              <button @click="confirmEdition(category)">
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
              <button @click="confirmDeletion(category.id)">
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
    id="delete-category-modal"
  >
    <template #header>Confirmar eliminación de categoría</template>
    <template #body
      ><p>
        ¿Estás seguro de que deseas eliminar esta categoría? La categoría se
        eliminará de los productos donde se utiliza ahora.
      </p>
      <p>Esta acción no se puede deshacer.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-category-modal"
  >
    <template #header>Edición de categorías</template>
    <template #body>
      <div class="container">
        <h2>Editar categoría</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editCategoryFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="editCategoryFormData.name"
            ></textarea>
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isCreateModalVisible"
    @modal-confirmed="onCreateModalConfirm"
    @modal-close="onCreateModalClose"
    id="create-category-modal"
  >
    <template #header>Creación de categorías</template>
    <template #body>
      <div class="container">
        <h2>Crear categoria</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="newCategory"
            ></textarea>
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

// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Se usa una computada para obtener las categorias directamente desde el store. Como se se esperan centenas de ellas, se carga directamente desde la api por la paginacion de esta en lugar de en local
const productCategories = computed(() => store.state.productCategories);

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

const newCategory = ref();

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
//Variable para guardar la categoria que se borra
const categoryForDeletion = ref();
const setCategoryForDeletion = (value) => {
  categoryForDeletion.value = value;
};
//Variable para guardar la categoria que se edita
const categoryForEdition = ref();
const setCategoryForEdition = (value) => {
  categoryForEdition.value = value;
};

// Función para buscar todas las categorías
const getAllCategories = async () => {
  try {
    isDataLoaded.value = false;
    // Recupera todas las categorías para almacenarlas y poder usarlas
    await store.dispatch("getProductCategories");
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true;
    // Gestionar error
    handleRequestError(error);
  }
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

// Recupera todas las etiquetas en el montaje del componente
onMounted(async () => {
  await getAllCategories();
});

// Borrar las categorias en el store de Vuex a una matriz vacía al desmontar el componente
onUnmounted(() => {
  store.commit("setProductCategories", []);
});

//Funcion que se ejecuta al confirmar el modal de borrado
async function confirmDeletion(category) {
  setCategoryForDeletion(category);
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
async function confirmEdition(category) {
  //poner todos los datos en el formulario que se abrirá en el modal
  for (const key in editCategoryFormData) {
    if (category.hasOwnProperty(key)) {
      editCategoryFormData[key] = category[key];
    }
  }
  setCategoryForEdition(category);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
  setIsCreateModalVisible(false);
}

//Funcion que se encarga de eliminar el elemento y gestionar el resultado
async function deleteCategory(categoryId) {
  try {
    //Borar por ID
    await store.dispatch("deleteCategory", categoryId);

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Categoría eliminada",
      type: "success",
      message: `Se ha eliminado la categoría ${categoryId}. La lista se recargará.`,
    });

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para crear elemento llamando a la API del backend
async function createCategory(categoryName) {
  try {
    await store.dispatch("createCategory", {
      name: categoryName,
    });

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Categoría creada",
      type: "success",
      message: `La categoría ha sido creada. La lista se recargará.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}
//Funcion para editar por el ID via la API del backend. Se usan los datos del formulario del edicion mostrado en el modal
async function editCategory(category) {
  try {
    await store.dispatch("updateCategory", {
      id: editCategoryFormData.id,
      newname: editCategoryFormData.name,
    });

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Categoría actualizada",
      type: "success",
      message: `La categoría ha sido actualizada. La lista se recargará.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion

    closeAllModals(); //se cierran todos los modales al terminar
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para gestionar el resultado del cierre sin accion del modal de borrado
const onDeleteModalClose = () => {
  setCategoryForDeletion(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de edicion
const onEditModalClose = async () => {
  await resetEditCategoryFormData();
  setCategoryForEdition(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de creacion
const onCreateModalClose = () => {
  newCategory.value = null;
  closeAllModals();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onEditModalConfirm = async () => {
  await editCategory(categoryForEdition);
  setCategoryForEdition(null);
  resetEditCategoryFormData();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onCreateModalConfirm = async () => {
  await createCategory(newCategory.value);
  newCategory.value = null;
};

//Funcion para gestionar la confirmacion del modal de borrrado. Con esto se pasa a la accion con la API del backend.
const onDeleteModalConfirm = async () => {
  await deleteCategory(categoryForDeletion.value);
  setCategoryForEdition(null);
  closeAllModals();
};

//Objecto que se vincula al formulario de edicion para eventualmente mandarlo como payload de la llamada  ala API
const editCategoryFormData = {
  id: null,
  name: "",
};

//Funcion para resetear el formulario de edicion
const resetEditCategoryFormData = async () => {
  editCategoryFormData.id = null;
  editCategoryFormData.name = "";
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
#new-category-container {
  text-align: right;
  padding-bottom: 2rem;
}
</style>
