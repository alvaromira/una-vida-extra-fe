<template>
  <div class="profile-picture" :class="mode">
    <img :src="gravatarUrl" alt="Profile" />
  </div>
  <!--to do, show only when registering not, when logged in-->
  <div v-if="props.gravatarInfo">
    <p>
      Since we are about re-using, we use the
      <a href="https://gravatar.com/" target="_blank">gravatar</a> linked to
      your email address once you register. &#128522;
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import md5 from "md5";

const message = ref("");

// Watch for changes in the inputValue
watch(message, (newValue, oldValue) => {
  console.log(`userEmail value changed from ${oldValue} to ${newValue}`);
  // You can perform additional actions based on the input value change
  //updateMessage(newValue);
});

const props = defineProps({
  userEmail: String,
  mode: {
    type: String,
    default: "small", // Default value for the isEnabled prop
  },
  gravatarInfo: {
    type: Boolean,
    default: true,
  },
});
const isGravatarValid = ref(false);
const gravatarUrl = ref("");

onMounted(() => {
  message.value = props.userEmail;
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
  border-radius: 50%;
  overflow: hidden;
  margin-inline-end: 3px;
}

.small {
  width: 35px; /* Adjust the size as needed */
  height: 35px; /* Adjust the size as needed */
}

.medium {
  width: 75px; /* Adjust the size as needed */
  height: 75px; /* Adjust the size as needed */
}

.large {
  width: 125px; /* Adjust the size as needed */
  height: 125px; /* Adjust the size as needed */
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
