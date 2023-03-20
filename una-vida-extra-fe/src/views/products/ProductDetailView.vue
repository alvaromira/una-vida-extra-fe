<template>
  <div>
    <h1>This is the products detail page for product {{ productId }}</h1>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

//computed
const productId = computed(() => {
  return route.params.id;
});
</script>
