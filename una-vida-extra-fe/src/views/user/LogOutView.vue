<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import store from "../../store";

onMounted(async () => {
  const router = useRouter(); // inicializacion para acceso al router
  await store.dispatch("logout");

  //uso de reemplazo para evitar posibles problemas al iniciar y cerrar sesión de ida y vuelta
  router.replace({ name: "login" });
});
</script>
<!--Vista donde se muestra el progreso del cierre de sesión y se redirije-->

<template>
  <div class="form-wrapper">
    <div><p class="loggingOut">Saliendo</p></div>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 50%;
}
.loggingOut {
  font-size: 1rem;
  color: gray;
  text-align: center;
}

.loggingOut:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 900ms infinite;
  animation: ellipsis steps(4, end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
