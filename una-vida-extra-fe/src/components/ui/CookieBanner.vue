<template>
  <div class="row">
    <div class="banner col">
      <div class="row">
        <div class="col">
          <p>
            We use tracking cookies as part of the basic functionality of our
            site. Please accept them to keep enjoying the site. More info in our
            <RouterLink :to="{ name: 'cookies' }">cookie policy</RouterLink>.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center" style="gap: 2rem">
          <button type="button" @click="acceptCookies">Accept cookies</button>
          <button type="button" @click="declineCookies">Decline cookies</button>
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
