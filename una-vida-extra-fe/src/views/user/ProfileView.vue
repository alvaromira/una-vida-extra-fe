<script setup>
import UserProfileForm from "../../components/user/UserProfileForm.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const store = useStore();

  try {
    const cookie = await axios.get("http://localhost:8000/sanctum/csrf-cookie");
    const call = await axios.get("http://localhost:8000/api1/user");
    console.log(call);
    store.commit("logUserIn");
  } catch (error) {
    console.log(error);
  }

  const userCheck = async () => {
    await checkIfAuthenticated();
  };
  console.log(userCheck);
  store.commit("logUserIn");
  // const router = useRouter();
  //using replace to avoid potential issues with back and forth logging in and out
  //  router.replace({ name: "login" });
});
</script>
<template>
  <div class="form-wrapper">
    <user-profile-form />
  </div>
</template>

<style scoped></style>
