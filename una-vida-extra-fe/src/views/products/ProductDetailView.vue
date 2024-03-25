<template>
  <div>
    <product-detail-card
      v-if="prodDetail"
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
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted } from "vue";
import axios from "axios";
import { computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";

import ProductDetailCard from "../../components/ui/product/ProductDetailCard.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

//computed
const productId = computed(() => {
  return route.params.id;
});

const prodDetail = ref([]);

//paramId.value = router.params.id;

const getProductData = async () => {
  try {
    const targetURL = `http://127.0.0.1:8000/api1/products/${route.params.id}`;
    const response = await axios.get(targetURL);
    prodDetail.value = response.data.data;
  } catch (err) {
    console.log(err);
  }
};

const imagePath = computed(() => {
  if (prodDetail.value.image == null || prodDetail.value.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return "http://127.0.0.1:8000/storage/" + prodDetail.value.image;
  }
});

onMounted(() => {
  getProductData();
});

//Aceppted properties for the card items

//TO DO
//Check if user is logged in
//Check if user is the owner of the product
</script>
