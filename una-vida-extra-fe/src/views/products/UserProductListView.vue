<template>
  <div>
    <div id="user-product-list">
      <section class="product-card-container">
        <div v-for="product in products">
          <product-card
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :date="product.date"
            :location="product.location"
          />
        </div>
      </section>
    </div>
  </div>
  <div id="user-product-addition">
    <section>
      <BaseButton :to="{ name: 'addProduct' }" link="true"
        >Add New Product
      </BaseButton>
    </section>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import AddNewProduct from "./AddNewProduct.vue";

const products = ref([
  {
    id: 1,
    image: "https://via.placeholder.com/250x250/cccccc/969696",
    title: "My product",
    date: "01/01/2023",
    location: {
      lat: 36.72,
      long: -4.42,
    },
  },
  {
    id: 2,
    image: "https://via.placeholder.com/250x250/cccccc/969696",
    title: "My product Two",
    date: "01/02/2023",
    location: {
      lat: 36.72,
      long: -4.42,
    },
  },
  {
    id: 3,
    image: "https://via.placeholder.com/250x250/cccccc/969696",
    title: "My product Three",
    date: "02/02/2023",
    location: {
      lat: 36.72,
      long: -4.42,
    },
  },
]);

//Computed
const total = computed(() => {
  return "foo";
});
</script>

<style scoped>
.product-card-container {
  display: flex;

  align-items: flex-start;
  flex-flow: row wrap;
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  gap: 3rem;
}

h2 {
  text-transform: uppercase;
  text-align: center;
  color: #7ab370;
  padding: 1rem 1rem 1.5rem 1rem;
}
</style>
