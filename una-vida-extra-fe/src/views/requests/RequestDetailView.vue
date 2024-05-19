<!--Componente tipo vista donde se usan los subcomponentes para mostrar un formulario donde solicitar el producto-->
<template>
  <div class="row">
    <div class="col justify-content-md-center d-flex request-title">
      <h2>
        Solicitar <em>{{ prodDetail.title }}</em>
      </h2>
    </div>
  </div>

  <request-product-card
    :image="imagePath"
    :title="prodDetail.title"
    :id="productId"
  />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onBeforeMount } from "vue";
import RequestProductCard from "../../components/ui/request/RequestProductCard.vue";
import { useStore } from "vuex";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const baseUrl = import.meta.env.VITE_BASE_URL; //ruta base para el cliente de la aplicacion
const baseUrlImg = import.meta.env.VITE_BASE_IMG_URL; // ruta para las imagenes, que se hospedan en un S3 bucket de amazon

const router = useRouter(); // inicializacion para acceso al router
const route = useRoute();
const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//se computa el id del producto para usarlo y pasarlo al subcomponente
const productId = computed(() => {
  return route.params.id;
});

onBeforeMount(async () => {
  await getProductData();
});

const prodDetail = ref([]); //variable para los detalles del producto

//funcion para obtener los datos del producto
const getProductData = async () => {
  try {
    prodDetail.value = await store.dispatch("getProductData", route.params.id);
    //    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
  } catch (err) {
    console.err(err);
  }
};

//funcion para poner la imagen del producto si esta disponible
const imagePath = computed(() => {
  if (prodDetail.value.image == null || prodDetail.value.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return `${baseUrlImg}${prodDetail.value.image}`;
  }
});
</script>
<style scoped>
.request-title {
  padding-bottom: 2rem;
}
</style>
