<template>
  <div>
    <div class="row justify-content-md-center">
      <div class="col-md-8 welcome-wrapper">
        <div class="row">
          <div class="col welcome-title dark-side">
            <p>Bienvenido a <strong>Una vida extra</strong></p>
            <!-- <span class="triangle-up">&nbsp;</span>-->
          </div>
        </div>
        <div class="row">
          <div class="col welcome-message light-side">
            <!--<span class="triangle-down">&nbsp;</span>-->
            <p>
              ¿Buscas un lugar donde
              <strong>donar, reutilizar, reciclar y reutilizar</strong> cosas?
              ¡Nos encontraste! Somos una comunidad en línea para la
              reutilización. Todo <strong>gratis</strong>, no se aceptan dinero
              ni tarjetas. Sólo buena voluntad 😁. ¡Protege el planeta
              consumiendo menos y reutilizando más con nosotros! ¿A qué esperas
              para
              <RouterLink :to="{ name: 'register' }">registrarte</RouterLink>?
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDataLoaded">
      <h2 v-if="sText">
        <!--Para cuando haya busquedas-->
        {{ productResults.meta.total }} resultado(s) encontrado(s) para
        {{ sText }}.
      </h2>

      <h2 v-else>Lo más reciente</h2>

      <!--Solo se muestran los productos si la base de datos y el backend están disponible y por tanto hay productos recuperados. REalment esto es para posibles codigos 500 y errores de red-->
      <section
        class="product-card-container"
        v-if="productResults.data && productResults.data.length > 0"
      >
        <product-card
          v-for="product in productResults.data"
          :key="product.id"
          :id="product.id"
          :image="product.image"
          :description="product.description"
          :title="product.title"
          :date="product.created_at"
          :location="product.location"
        />
      </section>
      <section v-else class="row">
        <div class="col text-center">
          <p>
            Vaya, parece que hay un problema al cargar elementos. Si persiste,
            por favor contáctanos.
          </p>
        </div>
      </section>
      <!-- Pagination controls -->
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
      <!--<section id="products-data-summary">
        <ProductsSummary></ProductsSummary>
      </section>-->
    </div>

    <div v-else class="loading">
      <base-spinner></base-spinner>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import ProductsSummary from "../../components/ui/product/ProductsSummary.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
// Acceso a la ruta actual
const route = useRoute();

const store = useStore(); // inicializacion para acceso al state en el store de Vuex
// Computed property to check if there's a registration redirection query parameter
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});
// Computed property to access product results state from the store
const productResults = computed(() => store.state.productResults);
// Referencia para saber si los datos estan cargados
const isDataLoaded = ref(false);
// Props definition for search text
const props = defineProps({
  sText: {
    type: String,
    default: "",
  },
});

//Variables usadas en la paginacion
const currentPage = ref(1);
const pageSize = 10; // Numero de elementos por pagina
const totalPages = computed(() => productResults.value?.meta?.last_page || 0); // Si productResults, meta o last_page es undefined, totalPages se establecerá en 0

//Cargar elementos para la pagina actual
const loadProducts = async () => {
  await getProductRequests("", currentPage.value);
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

// Watch for changes in search text prop
watch(
  () => props.sText,
  (newValue, oldValue) => {
    console.log("sText prop changed:", newValue);
    // Obtener productos según el nuevo texto de búsqueda
    getProductRequests(props.sText);
  }
);

// Función para buscar productos según el texto de búsqueda
const getProductRequests = async (search, page) => {
  try {
    isDataLoaded.value = false;
    // Obtener productos o realizar una búsqueda de productos según los parámetros de ruta
    if (search) {
      await store.dispatch("searchProducts", search);
    } else {
      await store.dispatch("getProducts", page);
    }
    //Establece la carga a verdadero una vez que se obtienen los datos
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
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
    title: "Error al procesar la solicitud",
    type: "error",
    message: errorMessage,
  });
};

// Obtener productos en el montaje de componentes
onMounted(async () => {
  await getProductRequests(props.sText, currentPage);
});

// Restablecer productResults a una matriz vacía al desmontar el componente
onUnmounted(() => {
  store.commit("setProductResults", []);
});
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
.light-side {
  color: black;
  background-color: white;
}

.dark-side {
  background-color: #7ab370;
  color: white;
}

.welcome-title {
  font-size: 2rem;
  position: relative;
}
.welcome-message {
  position: relative;
}
.welcome-title,
.welcome-message {
  padding: 1rem;
}
.welcome-title p,
.welcome-message p {
  padding: 0;
  margin: 0;
  font-weight: 300;
  text-align: center;
}
.welcome-message p a {
  text-decoration: none;
  color: #edb421;
}
.welcome-message p a:hover {
  text-decoration: underline;
}
.welcome-wrapper {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-bottom: 2rem;
}

.triangle-up {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 13px 20px 13px;
  border-color: transparent transparent #ffffff transparent;
  transform: rotate(0deg);
  display: block;
  position: absolute;
  right: 1rem;
}
.triangle-down {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 13px 20px 13px;
  border-color: transparent transparent #7ab370 transparent;
  transform: rotate(180deg);
  display: block;
  position: absolute;
  left: 1rem;
  top: 0rem;
}
</style>
