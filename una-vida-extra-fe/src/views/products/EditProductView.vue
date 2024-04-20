<template>
  <div class="product-editing" id="productId">
    <edit-product-form
      :id="productId.toString()"
      :initialProductName="prodDetail.title"
      :initialDescription="prodDetail.description"
      :initialCategory="prodDetail.category"
      :initialTags="prodDetail.product_tags"
    />
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, defineProps } from "vue";
import EditProductForm from "../../components/ui/product/EditProductForm.vue";
import axios from "axios";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const router = useRouter();
const route = useRoute();

//computed
const productId = computed(() => {
  return route.params.id;
});

const prodDetail = ref([]);

//paramId.value = router.params.id;

const getProductData = async () => {
  try {
    const targetURL = `${baseApiUrl}/products/${route.params.id}?include_tags=true`;
    const response = await axios.get(targetURL);
    prodDetail.value = response.data.data;
  } catch (err) {
    console.log(err);
  }
};
getProductData();
</script>
