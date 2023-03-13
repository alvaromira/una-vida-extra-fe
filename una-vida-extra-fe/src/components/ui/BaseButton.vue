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
//Aceppted properties for the card items
const props = defineProps({
  mode: String,
  link: String,
  to: String,
});
</script>

<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <RouterLink v-else :to="to" :class="mode">
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
  color: #edb421;
  border: #edb421 solid 1px;
  background-color: #fff;
}
.outline:active {
  border: #fff solid 1px;
}
</style>
