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
    <user-profile-form />
  </div>
</template>

<style scoped></style>
