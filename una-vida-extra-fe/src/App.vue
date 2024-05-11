<script setup>
import { RouterLink, RouterView } from "vue-router";
import TheFooter from "./components/Layout/TheFooter/TheFooter.vue";
import TheHeader from "./components/Layout/TheHeader/TheHeader.vue";
import Toasts from "./components/ui/Toasts.vue";
import "bootstrap/dist/css/bootstrap.css";

import "bootstrap/dist/js/bootstrap.js";
</script>
<!--Esta es la estructura general de la aplicación, donde se colocan las diferentes vistas. Es un contenedor para las vistas que se cargan con las rutas del router-->
<template>
  <Toasts />
  <!--Ubicación para los posibles mensajes toasts-->
  <TheHeader></TheHeader>
  <!--Cabecera con los menus de navegacion-->
  <div id="content" class="container">
    <!--Zona principal de contenidos donde se muestra el contenido de las diversas vistas-->
    <RouterView />
  </div>
  <TheFooter></TheFooter>
  <!--Pie de pagina-->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    /* display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
 */
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  #content {
    padding: 2rem 0;
    max-width: 80%;
    width: auto;
    margin: 0 auto;
  }
}
</style>
