<template>
  <div class="product-editing" id="productId">
    <edit-product-form :id="productId.toString()" />
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, defineProps } from "vue";
import EditProductForm from "../../components/ui/product/EditProductForm.vue";

const router = useRouter();
const route = useRoute();

//computed
const productId = computed(() => {
  return route.params.id;
});
</script>
