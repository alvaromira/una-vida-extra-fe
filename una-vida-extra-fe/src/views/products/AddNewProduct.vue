<script setup>
import ProductForm from "../../components/ui/product/ProductForm.vue";
</script>
<template>
  <div class="row row justify-content-md-center">
    <div class="back-to-products-button col-md-10">
      <a :href="$router.resolve({ name: 'userProducts' }).href"
        >Back to your products</a
      >
    </div>
  </div>
  <div class="row">
    <div class="col"><h2>Add a New Product</h2></div>
  </div>
  <product-form></product-form>
</template>

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
