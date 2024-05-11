<script setup>
import UserLoginForm from "../../components/user/UserLoginForm.vue";
import UserRedirectionView from "./UserRedirectionView.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore(); // inicializacion para acceso al state en el store de Vuex
</script>
<!--Vista donde mostrar el componente del formulario de usuario para hacer login-->
<template>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>Login</h2></div>
    </div>
    <UserLoginForm />
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
</style>
