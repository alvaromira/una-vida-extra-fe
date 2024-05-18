<!--Componente para cuando se reciben 404 en las llamadas a rutas. Es realmente una vista con el error estilizado y una invitación a seguir navegando para encontrar lo que se busca-->
<template>
  <div class="row not-found-wrapper">
    <div class="col">
      <p class="top-page-not-found">Página no encontrada</p>
      <section class="wrapper">
        <div class="top">404</div>
        <div class="bottom" aria-hidden="true">404</div>
      </section>
      <p class="message">
        <span class="oops">¡Vaya!</span> No podemos encontrar la página que
        buscas, pero ¿por qué no revisas todos los productos disponibles para
        ver si encuentras lo que buscas?
      </p>
      <div class="cta-button">
        <BaseButton :to="{ name: 'products' }" mode="outline-green" link="true"
          >Todos los productos</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";
</script>
<style scoped>
.not-found-wrapper {
  text-align: center;
  color: rgb(89 88 86);
}
.wrapper {
  display: grid;
  place-content: center;
  font-size: clamp(1.5rem, 1rem + 12vw, 8rem);
  font-weight: 700;
  text-transform: uppercase;
  color: #7ab370;
}
p.message {
  font-size: 1.5rem !important;
}
.wrapper > div {
  grid-area: 1/1/-1/-1;
}
.top {
  clip-path: polygon(0% 0%, 100% 0%, 100% 48%, 0% 58%);
}
.bottom {
  clip-path: polygon(0% 60%, 100% 50%, 100% 100%, 0% 100%);
  color: transparent;
  background: -webkit-linear-gradient(177deg, rgb(89 88 86) 53%, #7ab370 65%);
  background: linear-gradient(177deg, rgb(89 88 86) 53%, #7ab370 65%);
  background-clip: text;
  -webkit-background-clip: text;
  transform: translateX(-0.02em);
}

.oops {
  font-size: 1.75rem;
}
p.top-page-not-found {
  font-size: 2.25rem !important;

  letter-spacing: -0.25rem;
}

.code {
  font-size: 6rem !important;
  letter-spacing: -0.25rem;
  padding: 0;
  margin: 0;
}
.not-found p {
  text-align: center;
  color: rgb(89 88 86);
  margin: 0;
  font-size: 1.5rem;
}
.cta-button {
  padding-top: 2rem;
  text-align: center;
}
</style>
