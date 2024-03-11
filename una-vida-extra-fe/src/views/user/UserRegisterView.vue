<script setup>
import UserRegistrationForm from "../../components/user/UserRegistrationForm.vue";
import UserRedirectionView from "./UserRedirectionView.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const isAuthenticated = computed(() => store.getters.authenticated);
</script>
<template>
  <div class="form-wrapper">
    <p>
      Use the form below to become part of our community and start contributing.
      Thanks!
    </p>
    <user-registration-form />
  </div>
</template>

<style scoped></style>
