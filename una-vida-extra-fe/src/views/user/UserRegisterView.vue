<script setup>
import UserRegistrationForm from "../../components/user/UserRegistrationForm.vue";
</script>
<!--Vista donde se muestra el componente de registor de usuario con su formulario-->

<template>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>Registro</h2></div>
    </div>
    <p>
      Usa el siguiente formulario para formar parte de nuestra comunidad y
      comenzar a contribuir. ¡Gracias!
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
