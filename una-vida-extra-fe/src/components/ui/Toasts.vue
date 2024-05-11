<template>
  <div
    class="toasts-wrapper toast-container top-0 end-0 p-3"
    v-if="toasts.length"
  >
    <!--  <TransitionGroup name="list" tag="div"
      >-->
    <Toast v-for="(toast, index) of toasts" :key="index" :toast="toast" />
    <!--</TransitionGroup>-->
  </div>
</template>

<script setup>
// Import the necessary functions from Vue
import { computed } from "vue";
import { useStore } from "vuex";

// Import the Toast component
import Toast from "./Toast.vue";

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

const toasts = computed(() => {
  // Access the toasts array from the store
  return store.state.toasts;
});
</script>

<style scoped>
.toasts-wrapper.toast-container {
  position: fixed;
}
/*.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}*/
</style>
