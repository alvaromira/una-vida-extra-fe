<!--Se trata de un componente tipo wrapper para encapsular los mensajes tipo toast mostrados en la UI. Se carga a nivel de la App para que siempre pueda estar presnte en cualquier sitio.-->
<template>
  <div
    class="toasts-wrapper toast-container top-0 end-0 p-3"
    v-if="toasts.length"
  >
    <Toast v-for="(toast, index) of toasts" :key="index" :toast="toast" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Toast from "./Toast.vue";

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//Los mensajes toast se añaden al store de Vuex y desde alli se leen dinamicamente
const toasts = computed(() => {
  return store.state.toasts;
});
</script>

<style scoped>
.toasts-wrapper.toast-container {
  position: fixed;
} /** El wrapper siempre será en posición fija */
</style>
