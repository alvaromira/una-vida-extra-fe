<script setup>
import UserProfileForm from "../../components/user/UserProfileForm.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";

onMounted(async () => {});
</script>
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
