<template>
  <div class="toast">
    <div class="header" :class="[toast.type, { 'fade-out': isFadingOut }]">
      <h3>{{ toast.title }}</h3>
      <button @click="dismissToast(toast.title)">X</button>
    </div>
    <div class="content">
      <p>{{ toast.message }}</p>
    </div>
  </div>
</template>

<script setup>
// Import the necessary functions from Vue
import { ref, onMounted, defineProps } from "vue";
import { useStore } from "vuex";

// Define the props using the `defineProps` function
const { props } = defineProps(["toast"]);
const isFadingOut = ref(false);

const store = useStore();
const dismissToast = (m) => {
  isFadingOut.value = true;
  store.commit("clearToast", m);
};

// Lifecycle hook using `onMounted`
onMounted(() => {
  // Logic to execute on component mount
  // Automatically dismiss toast after 5 seconds
  setTimeout(() => {
    dismissToast();
  }, 5000);
});
</script>

<style scoped>
/* Removed CSS variables and used literals directly */

.success,
.info,
.error {
  color: #ffffff;
}

.success {
  background-color: #009900;
}

.info {
  background-color: #009999;
}

.error {
  background-color: #990000;
}

.toast {
  width: 500px;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #faf8f7;
  justify-content: center;
  border-top-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  border-top-right-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #cccccc;
  opacity: 1;
  transition: opacity 0.5s ease-out; /* Added transition for fading-out effect */
}

.toast.fade-out {
  opacity: 0;
}
.toast p {
  font-weight: 100;
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
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  box-sizing: border-box;
}

.toast .header,
.toast .text {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
}

.toast .header {
  height: 25px;
  margin-bottom: 1rem;
}

.toast .header button {
  margin-left: auto;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 1rem;
}

.toast .header button:hover {
  background: #e7e7e7;
}

.toast .content {
  flex-grow: 1;
}
</style>
