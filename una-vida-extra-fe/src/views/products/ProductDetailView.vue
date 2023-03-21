<template>
  <div>
    <product-detail-card
      :id="productId"
      :key="products.id"
      :image="products.image"
      :title="products.title"
      :date="products.date"
      :location="products.location"
      :userId="products.userId"
      :description="products.description"
      :editable="editableProduct"
    />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import { ref } from "vue";
import ProductDetailCard from "../../components/ui/product/ProductDetailCard.vue";

const router = useRouter();
const route = useRoute();

//computed
const productId = computed(() => {
  return route.params.id;
});

const editableProduct = computed(() => {
  return true;
});

//test data
const products = ref({
  id: 1,
  image: "https://via.placeholder.com/250x250/cccccc/969696",
  title: "Used pans",
  date: "01/01/2023",
  description:
    "Est numquam ut asperiores enim laboriosam inventor. Est numquam ut asperiores enim laboriosam inventor.",
  location: {
    lat: 36.72,
    long: -4.42,
  },
  userId: 12,
});

//Aceppted properties for the card items

//TO DO
//Check if user is logged in
//Check if user is the owner of the product
</script>
