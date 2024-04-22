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
import { ref, computed, defineProps, onBeforeMount } from "vue";
import RequestProductCard from "../../components/ui/request/RequestProductCard.vue";
import axios from "axios";
import { useStore } from "vuex";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;
const baseUrlImg = import.meta.VITE_BASE_IMG_URL;

const router = useRouter();
const route = useRoute();
const store = useStore();

//computed
const productId = computed(() => {
  return route.params.id;
});

onBeforeMount(async () => {
  await getProductData();
});

const prodDetail = ref([]);

//paramId.value = router.params.id;

const getProductData = async () => {
  try {
    prodDetail.value = await store.dispatch("getProductData", route.params.id);
    //    isDataLoaded.value = true; // Set data loaded to true once data is fetched
  } catch (err) {
    console.log(err);
  }
};

const imagePath = computed(() => {
  if (prodDetail.value.image == null || prodDetail.value.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return `${baseUrlImg}${prodDetail.value.image}`;
  }
});
</script>
