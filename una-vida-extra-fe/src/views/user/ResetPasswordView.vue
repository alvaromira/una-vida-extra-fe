<script setup>
import UserResetPasswordForm from "../../components/user/UserResetPasswordForm.vue";
</script>

<template>
  <div class="form-wrapper container">
    <div class="row">
      <div class="col"><h2>Password Reset</h2></div>
    </div>
    <UserResetPasswordForm></UserResetPasswordForm>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 50%;
}
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
</style>
