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
const router = useRouter();

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(timer);
      router.push({ name: "products" }); // Redirect to the products route
    }
  }, 1000);
});
</script>
