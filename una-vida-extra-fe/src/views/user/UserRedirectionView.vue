<!--Vista donde forzar una redirección, no se usa actualmente-->
<template>
  <div>
    <p>
      You are logged in already. Redirecting you to prodcuts in
      {{ countdown }} seconds...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const countdown = ref(5);
const router = useRouter(); // inicializacion para acceso al router

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(timer);
      router.push({ name: "products" }); // Redirección forzada a productos
    }
  }, 1000);
});
</script>
