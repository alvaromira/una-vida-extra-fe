<script setup>
import UserRegistrationForm from "../../components/user/UserRegistrationForm.vue";
import UserRedirectionView from "./UserRedirectionView.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

const isAuthenticated = computed(() => store.getters.authenticated);
</script>
<template>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>Register</h2></div>
    </div>
    <p>
      Use the form below to become part of our community and start contributing.
      Thanks!
    </p>
    <user-registration-form />
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
</style>
