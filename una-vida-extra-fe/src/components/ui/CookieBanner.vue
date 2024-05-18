<template>
  <div class="row">
    <div class="banner col">
      <div class="row">
        <div class="col">
          <p>
            Utilizamos cookies de seguimiento como parte de la funcionalidad
            básica de nuestro sitio. Por favor acéptelos para seguir disfrutando
            del sitio. Más información en nuestro
            <RouterLink :to="{ name: 'cookies' }"
              >política de cookies</RouterLink
            >.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center" style="gap: 2rem">
          <button type="button" @click="acceptCookies">Aceptar cookies</button>
          <button type="button" @click="declineCookies">Denegar cookies</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["hide-banner"]);

const unaVidaExtraCookiesAccepted = ref(
  localStorage.getItem("unaVidaExtraCookiesAccepted") === "true"
);

const acceptCookies = () => {
  localStorage.setItem("unaVidaExtraCookiesAccepted", "true");
  unaVidaExtraCookiesAccepted.value = true;
  emit("hide-banner");
};

const declineCookies = () => {
  localStorage.setItem("unaVidaExtraCookiesAccepted", "false");
  unaVidaExtraCookiesAccepted.value = false;
  emit("hide-banner");
};
</script>

<style scoped>
.banner {
  background-color: #fff;
  padding: 2rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: #7ab370 solid thin;
}

button {
  color: #7ab370;
  border: #7ab370 solid thin;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: #fff;
}
</style>
