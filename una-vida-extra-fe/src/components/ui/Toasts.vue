<template>
  <div class="toasts-wrapper" v-if="toasts.length">
    <Toast v-for="(toast, index) of toasts" :key="index" :toast="toast" />
  </div>
</template>

<script setup>
// Import the necessary functions from Vue
import { computed } from "vue";
import { useStore } from "vuex";

// Import the Toast component
import Toast from "./Toast.vue";

const store = useStore();

const toasts = computed(() => {
  // Access the toasts array from the store
  return store.state.toasts;
});
</script>

<style scoped>
.toasts-wrapper {
  width: 600px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  right: 2rem;
  bottom: 1rem;
}
</style>
