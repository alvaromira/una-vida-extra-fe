<template>
  <div
    class="toasts-wrapper toast-container position-absolute top-0 end-0 p-3"
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

const store = useStore();

const toasts = computed(() => {
  // Access the toasts array from the store
  return store.state.toasts;
});
</script>

<style scoped>
/*
.toasts-wrapper {
  width: 600px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: end;
  position: fixed;
  right: 2rem;
  top: 2rem;
  z-index: 10000;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}*/
</style>
