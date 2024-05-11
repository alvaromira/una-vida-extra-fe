<template>
  <div class="row row justify-content-md-center">
    <div class="back-to-products-button col-md-10">
      <a :href="$router.resolve({ name: 'userProducts' }).href"
        >Back to your products</a
      >
    </div>
  </div>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>Edit Product</h2></div>
    </div>
  </div>
  <div class="product-editing" :id="route.params.id">
    <edit-product-form
      :id="route.params.id"
      :initialProductName="prodDetail.title"
      :initialDescription="prodDetail.description"
      :initialCategory="prodDetail.category"
      :initialTags="prodDetail.product_tags"
      :initialImage="prodDetail.image"
    />
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, defineProps } from "vue";
import EditProductForm from "../../components/ui/product/EditProductForm.vue";
import axios from "axios";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const router = useRouter();
const route = useRoute();

defineProps({
  id: String,
});

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
<style scoped>
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
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
