<!--Componente toast para usar en el toasts wrapper. Acepta duración y modo. La duración se pasa al subcomponente countdownbar, que por defecto usa 15000 milisegundos-->
<template>
  <div
    class="toast show"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    :class="[toast.type, { 'fade-out': isFadingOut }]"
  >
    <div class="header toast-header">
      <h3>{{ toast.title }}</h3>
      <button @click="dismissToast(toast.title)">X</button>
    </div>
    <div class="content toast-body">
      <p role="status">{{ toast.message }}</p>
    </div>
    <CountdownBar :duration="toastDuration" :mode="toast.type"></CountdownBar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import CountdownBar from "./CountdownBar.vue";

//Como propiedad acepta un aarray toast donde se manda todo lo necesario: el tipo, el mensaje y la duracion
const { props } = defineProps(["toast"]);
const isFadingOut = ref(false);

const toastDuration = ref(15000); //duracion predeterminada

const store = useStore(); // inicializacion para acceso al state en el store de Vuex
//Funcion para cerrar el toast desde la UI antes de que cumpla el tiempo
const dismissToast = (m) => {
  isFadingOut.value = true;
  store.commit("clearToast", m); // esta es una llamada la funcion clearToast del store de Vuex. Los toasts se guardan en el state, asi que con esta llamada se eliminan formalmente
};

onMounted(() => {
  // De forma automatica, cerrar el toast tras los milisegundos en toastDuration
  setTimeout(() => {
    dismissToast();
  }, toastDuration.value);
});
</script>

<style scoped>
.toast-header,
.toast-body {
  padding: 1.5rem;
}

/**Se han creado clases para pintar los elementos de los toasts en funcion del tipo de mensaje: error, success o info. Se usa enfoque de semaforo con verde, amarillo y rojo */
div.toast.success,
.toast.success .header button,
div.toast.error .toast-header h3 {
  color: #4caf50 !important;
}

div.toast.info,
.toast.info .header button,
div.toast.info .toast-header h3 {
  color: #ffc107 !important;
}

div.toast.error,
.toast.error .header button,
div.toast.error .toast-header h3 {
  color: #ff5252 !important;
}

.toast {
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
  opacity: 1;
  background-color: #ffffff;
  transition: opacity 0.5s ease-out;
}

.toast.fade-out {
  opacity: 0;
}
.toast p {
  font-weight: 300;
  font-size: 1rem;
}

.toast .sidebar {
  width: 0.5rem;
}

.toast .content,
.toast .header,
.toast .text {
  width: 100%;
  display: flex;
}

.toast .content {
  flex-direction: column;
  align-items: start;
  justify-content: center;
  box-sizing: border-box;
}
.toast .header,
.toast .text {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
}
.toast .header {
  /*height: 25px;
  margin-bottom: 1rem;*/
  background-color: unset;
}
.toast .header button {
  color: #ffffff;
  background: transparent;
  margin-left: auto;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 1rem;
  opacity: 0.3;
}

.toast .content {
  flex-grow: 1;
}
</style>
