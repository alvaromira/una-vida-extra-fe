<template>
  <div v-if="isDataLoaded">
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

const baseUrl = import.meta.env.VITE_BASE_URL;

const router = useRouter();
const route = useRoute();
const store = useStore();

// Define a ref to track if data is loaded
const isDataLoaded = ref(false);

//computed
const productId = computed(() => {
  return route.params.id;
});

const prodDetail = ref([]);

//paramId.value = router.params.id;

const getProductData = async () => {
  try {
    //const targetURL = `${baseApiUrl}/products/${route.params.id}`;
    //const response = await axios.get(targetURL);
    prodDetail.value = await store.dispatch("getProductData", route.params.id);
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
  } catch (err) {
    console.log(err);
  }
};

const imagePath = computed(() => {
  if (prodDetail.value.image == null || prodDetail.value.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return `${baseUrl}/storage/${prodDetail.value.image}`;
  }
});

onBeforeMount(() => {
  getProductData();
});

//Aceppted properties for the card items

//TO DO
//Check if user is logged in
//Check if user is the owner of the product
</script>
