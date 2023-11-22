<template>
  <div class="profile-picture">
    <img :src="gravatarUrl" alt="Profile" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import md5 from "md5";

const props = defineProps(["userEmail"]);
const isGravatarValid = ref(false);
const gravatarUrl = ref("");

onMounted(() => {
  gravatarUrl.value = generateGravatarUrl(props.userEmail);
});

const generateGravatarUrl = async (email) => {
  const hash = md5(email.toLowerCase().trim());
  console.log(hash);

  try {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Gravatar exists
          isGravatarValid.value = true;
          gravatarUrl.value = `https://gravatar.com/avatar/${hash}?d=identicon`;
          // document.getElementById('result').innerText = 'Gravatar exists!';
        } else {
          isGravatarValid.value = false;
          gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
          // Gravatar does not exist
          //document.getElementById('result').innerText = 'Gravatar does not exist.';
        }
      }
    };
    xhr.open("GET", `https://gravatar.com/avatar/${hash}?d=404`, true);
    xhr.send();

    /*  const response = await axios.get(
      `https://gravatar.com/avatar/${hash}?d=404`,
      {
        withCredentials: false,
      }
    );

    if (response.status === 200) {
      // Gravatar exists
      isGravatarValid.value = true;
      gravatarUrl.value = `https://gravatar.com/avatar/${hash}?d=identicon`;
    } else {
      // Gravatar does not exist
      isGravatarValid.value = false;
      gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
    }*/
  } catch (error) {
    // Handle errors
    console.error("Error checking the Gravatar:", error.message);
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
