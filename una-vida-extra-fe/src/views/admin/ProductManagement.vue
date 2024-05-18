<!--Componente para la gestion de los productos de todos los usuarios. Se pagina directamente desde el servidor, dada la cantidad. Se usan modales para la edicion y el borrado. El administrador no crea productos desde el panel. Si lo necesita, lo hace como usuario. -->
<template>
  <div>
    <div v-if="isDataLoaded">
      <table class="table table-striped table-hover table-sm product-table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Imagen</th>
            <th scope="col">Descripción</th>
            <th scope="col">Nombre</th>
            <th scope="col">Disponibilidad</th>
            <th scope="col">Donado</th>
            <th scope="col">Categoría</th>
            <th scope="col">Creación</th>
            <th scope="col">Dueño</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productResults.data" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <img
                class="mini"
                :src="baseUrlImg + product.image"
                :alt="product.title"
              />
            </td>
            <td>{{ product.description }}</td>
            <td>{{ product.title }}</td>
            <td>{{ product.available }}</td>
            <td>{{ product.is_taken }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.created_at }}</td>
            <td>{{ product.owner_id }}</td>
            <td>
              <button @click="confirmEdition(product)">
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
              <button @click="confirmDeletion(product.id)">
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
    id="delete-user-modal"
  >
    <template #header>Confirmar eliminación del producto</template>
    <template #body
      ><p>
        ¿Estás seguro de que deseas eliminar este producto? El producto ya no
        aparecerá en la lista ni será visible para nadie. Cualquier solicitud
        que pueda tener también será eliminada.
      </p>
      <p>Esta acción no se puede deshacer.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-user-modal"
  >
    <template #header>Edición de productos</template>
    <template #body>
      <div class="container">
        <h2>Editar Producto</h2>
        <form
          @submit.prevent="subitEditProductForm"
          class="product-edition-form"
        >
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editProductFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Image Field -->
          <div class="mb-3">
            <img
              class="mini"
              :src="baseUrlImg + editProductFormData.image"
              :alt="editProductFormData.title"
            /><span>(no editable)</span>
          </div>

          <!-- Description Field -->
          <div class="mb-3">
            <label for="description" class="form-label">Descripción</label>
            <textarea
              class="form-control"
              id="description"
              rows="3"
              v-model="editProductFormData.description"
            ></textarea>
          </div>

          <!-- Title Field -->
          <div class="mb-3">
            <label for="title" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="editProductFormData.title"
            />
          </div>

          <!-- Availability Field -->
          <div class="mb-3">
            <label for="availability" class="form-label"
              >¿Esta disponible?</label
            >
            <input
              type="checkbox"
              class="form-check-input"
              id="availability"
              v-model="editProductFormData.available"
            />
          </div>

          <!-- Taken Field -->
          <div class="mb-3">
            <label for="taken" class="form-label">¿Se ha donado ya?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="taken"
              v-model="editProductFormData.is_taken"
            />
          </div>

          <!-- Category Field -->
          <div class="mb-3">
            <label for="category" class="form-label">Categoría</label>
            <select
              class="form-select"
              id="category"
              v-model="editProductFormData.category"
            >
              <option value="">Selecciona una categoría...</option>
              <option
                v-for="category in productCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Created At Field -->
          <div class="mb-3">
            <label for="created_at" class="form-label">Creación</label>
            <input
              type="datetime-local"
              class="form-control"
              id="created_at"
              :value="editProductFormData.created_at"
              readonly
              disabled
            />
          </div>

          <!-- Owner Field -->
          <div class="mb-3">
            <label for="owner-id" class="form-label">Dueño</label>
            <input
              type="number"
              class="form-control"
              id="owner-id"
              v-model="editProductFormData.owner_id"
            />
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

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const baseUrlImg = import.meta.env.VITE_BASE_IMG_URL;

// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Computed property to access product results state from the store
const productResults = computed(() => store.state.productResults);
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
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    if ((newValue = true)) {
      setIsEditModalVisible(false);
    }
  }
);

//Variable y setter para el producto a borrar
const productForDeletion = ref();
const setproductForDeletion = (value) => {
  productForDeletion.value = value;
};
//Variable y setter para el producto a editar
const productForEdition = ref();
const setProductForEdition = (value) => {
  productForEdition.value = value;
};

//Variables usadas en la paginacion
const currentPage = ref(1);
const pageSize = 10; // Numero de elementos por pagina
const totalPages = computed(() => productResults.value.meta.last_page);

//Cargar elementos para la pagina actual
const loadProducts = async () => {
  await getProductRequests(currentPage.value);
};

//Gestor del evento onclick para cargar la pagina anterior
const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadProducts();
  }
};

//Gestor del evento onclick para cargar la pagina siguiente
const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadProducts();
  }
};

// Funcion para obtener los productos desde el estado de la app en Vuex
const getProductRequests = async (page) => {
  try {
    isDataLoaded.value = false;
    await store.dispatch("getProducts", page);

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
    ? `Hubo un error al procesar las solicitudes. (Código: ${error.response.status})`
    : `Hubo un error al procesar las solicitudes. (Código: ${error.code})`;

  // Enviar toast al estado de Vuex para notificación de error
  store.commit("addToast", {
    title: "Error al procesar la solicitud",
    type: "error",
    message: errorMessage,
  });
};

// Fetch products on component mount
onMounted(async () => {
  //get tags and categories
  await store.dispatch("getProductTags");
  await store.dispatch("getProductCategories");
  //and then the products
  await getProductRequests(currentPage);
});

// Al salir del componente se ponen a cero en el estado para aligerar
onUnmounted(() => {
  store.commit("setProductResults", []);
});

//Funcion que se ejecuta al confirmar el modal de borrado
async function confirmDeletion(productId) {
  setproductForDeletion(productId);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
//Funcion que se ejecuta al confirmar el modal de edicion
async function confirmEdition(prod) {
  //convertir valores booleanos potenciales a números enteros para pasarlos a la api en el formato correcto
  const castedObject = {
    ...prod,
    available: prod.available ? 1 : 0,
    is_taken: prod.is_taken ? 1 : 0,
  };
  //poner todos los datos en el formulario que se abrirá en el modal
  for (const key in editProductFormData) {
    if (castedObject.hasOwnProperty(key)) {
      editProductFormData[key] = castedObject[key];
    }
  }

  setProductForEdition(castedObject); //se envia el objecto actualizado y convertido para la llamada a la api
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
}

//Funcion que se encarga de eliminar el elemento y gestionar el resultado
async function deleteProduct(productId) {
  try {
    //Borar por ID
    await store.dispatch("deleteProduct", productId);

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Producto eliminado",
      type: "success",
      message: `El producto ${productId} ha sido eliminado. La lista de productos se recargará.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion
    currentPage.value = 1;
    closeAllModals(); //se cierran todos los modales al terminar
    await loadProducts();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}
//Funcion para editar por el ID via la API del backend. Se usan los datos del formulario del edicion mostrado en el modal
async function editProduct(productId) {
  try {
    await store.dispatch("updateProductData", {
      id: editProductFormData.id,
      payload: editProductFormData,
    });

    //Enviar toast al store de Vuex para mostrar la notificacion de exito
    store.commit("addToast", {
      title: "Producto actualizado",
      type: "success",
      message: `El producto ${productId} ha sido actualizado. La lista de productos se recargará.`,
    });

    //se hace una recarga para obtener datos actualizados del servidor tras la accion
    currentPage.value = 1;
    closeAllModals(); //se cierran todos los modales al terminar
    await loadProducts();
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  }
}

//Funcion para gestionar el resultado del cierre sin accion del modal de borrado
const onDeleteModalClose = () => {
  setproductForDeletion(null);
  closeAllModals();
};
//Funcion para gestionar el resultado del cierre sin accion del modal de edicion
const onEditModalClose = async () => {
  await resetEditProductFormData();
  setProductForEdition(null);
  closeAllModals();
};

//Funcion para gestionar la confirmacion del modal de edicion. Con esto se pasa a la accion con la API del backend.
const onEditModalConfirm = async () => {
  await editProduct(productForEdition);
  setProductForEdition(null);
  resetEditProductFormData();
};

//Funcion para gestionar la confirmacion del modal de borrrado. Con esto se pasa a la accion con la API del backend.
const onDeleteModalConfirm = async () => {
  await deleteProduct(productForDeletion.value);
  setProductForEdition(null);
  closeAllModals();
};

//Objecto que se vincula al formulario de edicion para eventualmente mandarlo como payload de la llamada  ala API
const editProductFormData = {
  id: null,
  image: null,
  description: "",
  title: "",
  available: null,
  is_taken: null,
  category: "",
  created_at: "",
  owner_id: null,
};

//Funcion para resetear el formulario de edicion
const resetEditProductFormData = async () => {
  editProductFormData.id = null;
  editProductFormData.image = null;
  editProductFormData.description = "";
  editProductFormData.title = "";
  editProductFormData.available = null;
  editProductFormData.is_taken = null;
  editProductFormData.category = "";
  editProductFormData.created_at = "";
  editProductFormData.owner_id = null;
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
.product-edition-form {
  overflow-y: scroll;
  max-height: 400px;
}
.product-table tbody td {
  font-size: 0.8rem;
}
.product-table thead th {
  font-size: 0.9rem;
  text-align: center;
}
</style>
