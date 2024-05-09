<script setup>
import UserLoginForm from "../../components/user/UserLoginForm.vue";
import UserRedirectionView from "./UserRedirectionView.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const isAuthenticated = computed(() => store.getters.authenticated);
</script>

<template>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>Login</h2></div>
    </div>
    <UserLoginForm />
  </div>
  <!--<div v-else>
    <UserRedirectionView></UserRedirectionView>
  </div>-->
</template>

<style scoped>
.form-wrapper {
}
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
</style>
