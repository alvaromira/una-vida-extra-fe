<template>
  <div v-if="isDataLoaded">
    <div v-if="productFetched">
      <div class="row row justify-content-md-center">
        <div class="back-to-products-button col-md-8">
          <a :href="$router.resolve({ name: 'products' }).href"
            >Volver a tus productos</a
          >
        </div>
      </div>
      <product-detail-card
        :id="productId"
        :key="productId"
        :image="imagePath"
        :title="prodDetail.title"
        :date="prodDetail.created_at"
        :location="prodDetail.location"
        :owner="prodDetail.owner_id"
        :description="prodDetail.description"
        :category="prodDetail.category"
        :available="prodDetail.available"
        :isTaken="prodDetail.is_taken"
      />
    </div>
    <div v-else class="row row justify-content-md-center not-found">
      <div class="back-to-products-button col-md-8">
        <NotFound404Page></NotFound404Page>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <base-spinner></base-spinner>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, onBeforeMount } from "vue";
import axios from "axios";
import { computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import ProductDetailCard from "../../components/ui/product/ProductDetailCard.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import NotFound404Page from "../../components/ui/NotFound404Page.vue";

const baseUrl = import.meta.env.VITE_BASE_URL; //ruta base para el cliente de la aplicacion
const baseUrlImg = import.meta.env.VITE_BASE_IMG_URL;

const router = useRouter(); // inicializacion para acceso al router
const route = useRoute();
const store = useStore(); // inicializacion para acceso al state en el store de Vuex

// Define a ref to track if data is loaded
const isDataLoaded = ref(false);
const productFetched = ref(false);

//computed
const productId = computed(() => {
  return route.params.id;
});

const prodDetail = ref([]);

const getProductData = async () => {
  try {
    prodDetail.value = await store.dispatch("getProductData", route.params.id);
    productFetched.value = true;
  } catch (err) {
    console.log(err);
  } finally {
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
  }
};

const imagePath = computed(() => {
  if (prodDetail.value.image == null || prodDetail.value.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return baseUrlImg + prodDetail.value.image;
  }
});

onBeforeMount(() => {
  getProductData();
});
</script>
<style scoped>
.back-to-products-button {
  padding-bottom: 2rem;
}
.back-to-products-button a {
  text-decoration: none;
  color: #edb421;
  cursor: pointer;
}
.back-to-products-button a:hover {
  text-decoration: underline;
  color: #edb421;
}
</style>
