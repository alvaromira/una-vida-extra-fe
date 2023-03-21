<template>
  <div>
    <request-product-card
      :image="testData.image"
      :title="testData.title"
      :id="productId"
    />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, defineProps } from "vue";
import RequestProductCard from "../../components/ui/request/RequestProductCard.vue";

const router = useRouter();
const route = useRoute();

//test data
const testData = ref({
  image: "https://via.placeholder.com/250x250/cccccc/969696",
  title: "Used pans",
});

//computed
const productId = computed(() => {
  return route.params.id;
});
</script>
