<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

onMounted(() => {
  axios.post("http://localhost:8000/api1/logout");

  const router = useRouter();
  //using replace to avoid potential issues with back and forth logging in and out
  router.replace({ name: "login" });
});

/*
async function logout() {
// this.processing = true

try {
  const cookie = await axios.get("http://localhost:8000/sanctum/csrf-cookie");

  const resp = await axios.post("http://localhost:8000/api1/login", {
    email: data.email.val,
    password: data.password.val,
  });
  console.log(resp);
  //store.commit("logUserIn");
  //router.push("/products");
} catch (response) {
  if (response.status === 422) {
    //this.validationErrors = response.data.errors
    console.log(response.data.errors);
  } else {
    //this.validationErrors = {}
    //alert(response.data.message)
    console.log(response);
  }
} finally {
  console.log("login function over.");
}
}*/
</script>

<template>
  <div class="form-wrapper">
    <div><p class="loggingOut">Logging Out</p></div>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 50%;
}
.loggingOut {
  font-size: 1rem;
  color: gray;
  text-align: center;
}

.loggingOut:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 900ms infinite;
  animation: ellipsis steps(4, end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
