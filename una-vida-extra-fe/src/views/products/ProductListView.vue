<template>
  <div>
    <h1>This is the products page</h1>
  </div>
  <main>
    <section>
      <h2>Check the latest additions!</h2>
      <div v-for="product in products">
        <ProductCard
          :image="product.image"
          :title="product.title"
          :date="product.date"
          :location="product.location"
        />
      </div>
    </section>
  </main>
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
]);

//Computed
const total = computed(() => {
  return "foo";
});
//export default {
//  name: "Produts",
//};
</script>
