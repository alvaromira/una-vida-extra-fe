<template>
  <div>
    <h2>Check the latest additions!</h2>
    <section class="product-card-container">
      <div v-for="product in products">
        <ProductCard
          :image="product.image"
          :title="product.title"
          :date="product.date"
          :location="product.location"
        />
      </div>
    </section>
    <section id="products-data-summary">
      <ProductsSummary></ProductsSummary>
    </section>
  </div>
  <!--
    Header
    Main
      Section (products)
        Title
        3 latest products
      Section (meta) 
        Product consumption summary
    Footer
  -->
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import ProductsSummary from "../../components/ui/product/ProductsSummary.vue";

//Data attributes
//ref for accessing anything through .value, or reactive for accessing Objects only with the var name but without the value
const products = ref([
  {
    image: "https://via.placeholder.com/250x250/cccccc/969696",
    title: "My product",
    date: "01/01/2023",
    location: {
      lat: 36.72,
      long: -4.42,
    },
  },
  {
    image: "https://via.placeholder.com/250x250/cccccc/969696",
    title: "My product Two",
    date: "01/02/2023",
    location: {
      lat: 36.72,
      long: -4.42,
    },
  },
  {
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
//export default {
//  name: "Produts",
//};
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
