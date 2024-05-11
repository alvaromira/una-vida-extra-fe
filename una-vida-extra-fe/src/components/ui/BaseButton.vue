<script setup>
import { defineProps } from "vue";
/*
const props = defineProps({
  mode: {
    type: String,
    required: false,
    default: null,
  },
  link: {
    type: Boolean,
    required: false,
    default: false,
  },
  to: {
    type: String,
    required: false,
    default: "/",
  },
});*/
//Propiedades aceptadas por el componente
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false, // Set the default value to false
  },
  mode: String,
  link: String,
  to: Object,
});
</script>

<template>
  <button
    v-if="!link"
    :class="mode"
    :disabled="props.isDisabled"
    :title="props.isDisabled ? 'You have already requested this product' : ''"
  >
    <slot></slot>
  </button>
  <RouterLink v-else :to="to" :class="mode" :disabled="props.isDisabled">
    <slot></slot>
  </RouterLink>
</template>

<style scoped>
button,
a {
  text-decoration: none;
  font: inherit;
  border: 1px solid #edb421;
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #edb421;
  border-radius: 5px;
  min-width: 100px;
  display: inline-block;
  text-align: center;
  transition: 0.3s;
}
button:disabled {
  background-color: #c0c0c0;
  color: #f9f5f5;
  cursor: not-allowed; /* Show not-allowed cursor for disabled state */
  border: 1px solid #808080;
}
a:hover,
a:active,
button:hover,
button:active {
  opacity: 0.7;
}
.router-link-active {
  border: #fff solid 1px;
}

.outline {
  color: #edb421 !important;
  border: #edb421 solid 1px !important;
  background-color: #fff !important;
}

.outline-green {
  color: #fff !important;
  border: #fff solid 1px !important;
  background-color: #7ab370 !important;
}
.outline:active {
  border: #fff solid 1px;
}
</style>
