<script setup>
import UserProfileForm from "../../components/user/UserProfileForm.vue";
import { onMounted } from "vue";

onMounted(async () => {});
</script>

<!--Vista donde se muestra el perfil de usuario y su formulario-->
<template>
  <div class="form-wrapper">
    <div class="row">
      <div class="col"><h2>My Profile</h2></div>
    </div>
    <user-profile-form />
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  padding-bottom: 2rem;
}
</style>
