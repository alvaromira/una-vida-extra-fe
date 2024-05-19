<template>
  <div class="row">
    <div class="col">
      <h2>Mis productos</h2>
    </div>
  </div>

  <div class="row" id="user-product-addition">
    <section class="col d-flex justify-content-end">
      <BaseButton :to="{ name: 'addProduct' }" link="true"
        >Añadir nuevo producto
      </BaseButton>
    </section>
  </div>
  <div v-if="isDataLoaded" class="row">
    <div
      id="user-product-list"
      class="row"
      v-if="userProducts.data && userProducts.data.length > 0"
    >
      <section class="product-card-container">
        <div v-for="product in userProducts.data">
          <product-card
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :date="product.date"
            :location="product.location"
            :category="product.category"
            :description="product.description"
          />
        </div>
      </section>
    </div>
    <div v-else class="row justify-content-md-center">
      <div class="col no-requests-found text-center">
        <p>No tienes ningún producto.</p>
      </div>
    </div>
    <!-- Pagination controls -->
    <div class="row">
      <div class="pagination-controls" v-if="totalPages > 1">
        <BaseButton
          @click="loadPreviousPage"
          mode="outline"
          :disabled="currentPage === 1"
        >
          <span class="sr-only">Anterior</span>
          <span aria-hidden="true">&lt;</span>
        </BaseButton>
        <span class="pagination-information"
          >{{ currentPage }}/{{ totalPages }}</span
        >
        <BaseButton
          mode="outline"
          @click="loadNextPage"
          :disabled="currentPage === totalPages"
        >
          <span class="sr-only">Siguiente</span>
          <span aria-hidden="true">&gt;</span>
        </BaseButton>
      </div>
    </div>
  </div>
  <div v-else class="loading row">
    <base-spinner></base-spinner>
  </div>
</template>

<script setup>
import BaseButton from "../../components/ui/BaseButton.vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import { ref, computed, reactive, onMounted } from "vue";

import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Define a ref to track if data is loaded
const isDataLoaded = ref(false);

const userProducts = ref([]);

const loggedInUser = computed(() => {
  return store.state.user.id;
});

//Variables usadas en la paginacion
const currentPage = ref(1);
const pageSize = 10; // Numero de elementos por pagina
const totalPages = computed(() => userProducts.value.meta.last_page);

//Cargar elementos para la pagina actual
const loadProducts = async () => {
  await getUserProducts(loggedInUser.value, currentPage.value);
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

const getUserProducts = async (userId, page) => {
  try {
    isDataLoaded.value = false;
    const fetchedUserProducts = await store.dispatch("getUserProducts", {
      userId,
      page,
    });
    userProducts.value = fetchedUserProducts;
  } catch (error) {
    // Se gestiona el error en la solicitud
    handleRequestError(error);
  } finally {
    isDataLoaded.value = true;
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
    title: "Error al procesar sus productos",
    type: "error",
    message: errorMessage,
  });
};

// Fetch products on component mount
onMounted(async () => {
  await getUserProducts(loggedInUser.value, currentPage);
});
</script>

<style scoped>
.product-card-container {
  display: flex;

  align-items: flex-start;
  flex-flow: row wrap;
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  gap: 3rem;
}

h2 {
  text-align: center;
  color: #7ab370;
  padding: 1rem 1rem 1.5rem 1rem;
}

#user-product-addition {
  padding: 2rem;
}
.pagination-controls {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}
.pagination-information {
  padding-left: 1rem;
  padding-right: 1rem;
}
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
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
</style>
