<template>
  <div>
    <request-product-card
      :image="imagePath"
      :title="prodDetail.title"
      :id="productId"
    />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, defineProps } from "vue";
import RequestProductCard from "../../components/ui/request/RequestProductCard.vue";
import axios from "axios";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const router = useRouter();
const route = useRoute();/

//computed
const productId = computed(() => {
  return route.params.id;
});

const prodDetail = ref([]);

//paramId.value = router.params.id;

const getProductData = async () => {
  try {
    const targetURL = `${baseApiUrl}/products/${route.params.id}`;
    const response = await axios.get(targetURL);
    prodDetail.value = response.data.data;
  } catch (err) {
    console.log(err);
  }
};
getProductData();

const imagePath = computed(() => {
  if (prodDetail.image == null || prodDetail.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  }
});
</script>
