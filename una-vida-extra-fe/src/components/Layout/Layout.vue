<!--Plantilla principal donde colocar todo el contenido de la app de forma consistente-->
<template>
  <Header />
  <slot />
  <Footer />
</template>

<script setup>
import Header from "./TheHeader/TheHeader.vue";
import Footer from "./TheFooter/TheFooter.vue";
</script>
