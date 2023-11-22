<template>
  <div class="profile-picture">
    <img :src="gravatarUrl" alt="Profile" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import md5 from "md5";
import axios from "axios";

const props = defineProps(["userEmail"]);
const isGravatarValid = ref(false);

const checkGravatar = async () => {};
const gravatarUrl = ref("");

onMounted(() => {
  gravatarUrl.value = generateGravatarUrl(props.userEmail);
  //gravatarUrl.value = generateGravatarUrl("alvaromira83@gmail.com");
  console.log("Loading user image");
});

const generateGravatarUrl = async (email) => {
  const hash = md5(email.toLowerCase().trim());
  console.log(hash);

  try {
    const response = await axios.get(
      `https://gravatar.com/avatar/${hash}?d=404`
    );

    if (response.status === 200) {
      // Gravatar exists
      isGravatarValid.value = true;
      gravatarUrl.value = `https://gravatar.com/avatar/${hash}?d=identicon`;
    } else {
      // Gravatar does not exist
      isGravatarValid.value = false;
      gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
    }
  } catch (error) {
    // Handle errors
    console.error("Error checking Gravatar:", error.message);
    isGravatarValid.value = false;
    gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
  }
};
</script>

<style scoped>
.profile-picture {
  width: 35px; /* Adjust the size as needed */
  height: 35px; /* Adjust the size as needed */
  border-radius: 50%;
  overflow: hidden;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
