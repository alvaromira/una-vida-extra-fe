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

const router = useRouter();
const route = useRoute();

//No props because of https://router.vuejs.org/guide/essentials/passing-props.html#boolean-mode

//test data
const testData = ref({
  image: "https://via.placeholder.com/250x250/cccccc/969696",
  title: "Used pans",
});

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
getProductData();

const imagePath = computed(() => {
  if (prodDetail.image == null || prodDetail.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  }
});
</script>
