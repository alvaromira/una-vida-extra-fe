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
// Import the necessary functions from Vue
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import CountdownBar from "./CountdownBar.vue";

// Define the props using the `defineProps` function
const { props } = defineProps(["toast"]);
const isFadingOut = ref(false);

const toastDuration = ref(10000);

const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const dismissToast = (m) => {
  isFadingOut.value = true;
  store.commit("clearToast", m);
};

// Lifecycle hook using `onMounted`
onMounted(() => {
  // Logic to execute on component mount
  // Automatically dismiss toast after x seconds
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
/* Removed CSS variables and used literals directly */

.success,
.info,
.error {
  /*color: #ffffff;*/
}

h3 {
  /* color: #ffffff;*/
}

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
  /* width: 500px;
  min-height: 50px;
  display: block;

  margin-bottom: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 8px;*/
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
.toast .header button:hover {
  /* background: #e7e7e7;
  opacity: 0.75;*/
}

.toast .content {
  flex-grow: 1;
}
</style>
