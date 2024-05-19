<script setup>
import UserForgotPasswordForm from "../../components/user/UserForgotPasswordForm.vue";
</script>
<!--Vista donde mostrar el componente del formulario de usuario para resetear el password-->
<template>
  <div class="form-wrapper container">
    <div class="row">
      <div class="col"><h2>Restablecimiento de contraseña</h2></div>
    </div>

    <UserForgotPasswordForm />
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
