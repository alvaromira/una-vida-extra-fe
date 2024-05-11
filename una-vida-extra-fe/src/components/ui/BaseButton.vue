<!--Componente boton que puede actuar como boton o enlace para rutas del router. Por defecto, es boton sin enlace. En todos los casos, el texto de boton o enlace va en el slot-->
<template>
  <button
    v-if="!link"
    :class="mode"
    :disabled="props.isDisabled"
    :title="props.isDisabled ? 'This functionality is disabled for now' : ''"
  >
    <slot></slot>
  </button>
  <RouterLink v-else :to="to" :class="mode" :disabled="props.isDisabled">
    <slot></slot>
  </RouterLink>
</template>

<script setup>
//Propiedades aceptadas por el componente
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false, // Por defecto, false, no es enlace
  },
  mode: String, //realmente se soporta normal y outline, con las clases correspondientes
  link: String,
  to: Object, //se trata del destino en los enlaces
});
</script>

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
