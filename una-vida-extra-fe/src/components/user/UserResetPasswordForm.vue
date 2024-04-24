<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";

const route = useRoute();

// Define a ref to track if data is loaded
const isProcessing = ref(false);

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const resetError = ref(false);
const errorCode = ref(null);

//data
const data = reactive({
  email: {
    val: "",
    isValid: true,
  },
  password: {
    val: "",
    isValid: true,
  },
  passwordConfirmation: {
    val: "",
    isValid: true,
  },
  matchingPasswords: {
    val: false,
    isValid: true,
  },
});

const formIsValid = ref(true);

//vuex
const store = useStore();
const router = useRouter();

//methods
const clearValidity = (input) => {
  console.log(`Setting valid to true: ${input}`);
  data[input].isValid = true;
};
const validatePassword = (password) => {
  // Check if the password is at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check if the password contains at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Check if the password contains at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  // If all conditions are met, return true
  return true;
};

//specific validation of each of the registration forms included
const validateForm = async () => {
  console.log("Running validation on reset form");

  formIsValid.value = true;

  if (data.email.val === "") {
    data.email.isValid = false;
    formIsValid.value = false;
  }
  if (
    data.password.val === "" ||
    validatePassword(data.password.val) == false
  ) {
    data.password.isValid = false;
    formIsValid.value = false;
  }

  if (
    data.passwordConfirmation.val === "" ||
    validatePassword(data.passwordConfirmation.val) == false
  ) {
    data.passwordConfirmation.isValid = false;
    formIsValid.value = false;
  }

  if (data.passwordConfirmation.val !== data.password.val) {
    data.matchingPasswords.val = false;
    data.matchingPasswords.isValid = false;
    formIsValid.value = false;
  } else {
    data.matchingPasswords.val = true;
    data.matchingPasswords.isValid = true;
  }

  resetError.value = false;
};

const submitForm = async () => {
  await validateForm();
  if (!formIsValid.value) {
    return;
  }
  await resetPassword();
};

const resetPassword = async () => {
  console.log("resetting password");
  //isProcessing.value = true; // Set data loaded to true once data is fetched
  try {
    /* await store.dispatch("login", {
      payload: { email: data.email.val, password: data.password.val },
    });
    isProcessing.value = false; // Set data loaded to true once data is fetched
    handleSuccessfulReset();*/
  } catch (error) {
    /*isProcessing.value = false; // Set data loaded to true once data is fetched
    resetError.value = true;
    if (error.response.status) {
      if (error.response.status && error.response.status === 422) {
        errorCode.value = 422;
      } else {
        errorCode.value = error.response.status;
      }
    } else {
      errorCode.value = 0;
      console.error(error.message);
    }*/
  }
};

const handleSuccessfulReset = () => {
  //toast
  store.commit("addToast", {
    title: "Password Correctly Reset",
    type: "success",
    message:
      "You have correctly updated your password. You can now login to the site.",
  });
  router.push("/login");
};
</script>

<template>
  <form @submit.prevent="submitForm" class="rounded">
    <div class="container">
      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="email">Email</label>
        </div>
        <div class="col-9">
          <input
            class="form-control col-8"
            :class="{ invalid: !data.email.isValid }"
            type="email"
            id="email"
            v-model.trim="data.email.val"
            @blur="clearValidity('email')"
          />
        </div>
      </div>
      <div
        v-if="!data.email.isValid"
        class="validation-error-container pointer-up row"
        :class="{ active: !data.email.isValid }"
      >
        <div class="col">
          <p>Email must not be empty.</p>
        </div>
      </div>

      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="password">Password</label>
        </div>
        <div class="col-9">
          <input
            class="form-control col-8"
            :class="{ invalid: !data.password.isValid }"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model.trim="data.password.val"
            @blur="clearValidity('password')"
          />
        </div>
      </div>
      <div
        v-if="!data.password.isValid"
        class="validation-error-container pointer-up row"
        :class="{ active: !data.password.isValid }"
      >
        <div class="col">
          <p>
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, one number, and one special
            character."
          </p>
        </div>
      </div>

      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="passwordConfirmation">Password Confirmation</label>
        </div>
        <div class="col-9">
          <input
            class="form-control col-8"
            :class="{ invalid: !data.passwordConfirmation.isValid }"
            :type="showPassword ? 'text' : 'password'"
            id="passwordConfirmation"
            v-model.trim="data.passwordConfirmation.val"
            @blur="clearValidity('passwordConfirmation')"
          />
        </div>
      </div>
      <div
        v-if="!data.passwordConfirmation.isValid"
        class="validation-error-container pointer-up row"
        :class="{ active: !data.passwordConfirmation.isValid }"
      >
        <div class="col">
          <p>The password confirmation must match the password.</p>
        </div>
      </div>

      <div>
        <div
          v-if="formIsValid.value === false"
          class="form-field row text-center"
        >
          <p>Please fix the above errors and submit again.</p>
        </div>
      </div>

      <div class="form-field row submit">
        <div class="col-md-6">
          <BaseButton @click.prevent="togglePasswordVisibility" mode="outline">
            {{ showPassword ? "Hide" : "Show" }} Password
          </BaseButton>
        </div>
        <div class="form-submit-button col-md-6">
          <BaseButton :disabled="isProcessing">Reset Password</BaseButton>
        </div>
      </div>
      <div v-if="!isProcessing">
        <div
          id="login-errors"
          class="validation-error-container"
          :class="{ active: resetError }"
          v-if="resetError"
        >
          <p v-if="errorCode === 422" class="validation-error">
            Wrong credentials provided. Please check your email and password.
          </p>
          <p v-else>
            There was an error while logging you in. Please try again later.
          </p>
        </div>
      </div>
      <div v-else class="loading">
        <base-spinner></base-spinner>
      </div>
    </div>
  </form>
</template>

<style scoped>
form {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
  padding: 0;
  /* display: block; */
  padding: 2rem;
}

div.form-field {
  padding-bottom: 2rem;
}
div.form-field.submit {
  padding-bottom: 0rem;
}

.form-control {
  /* margin: 1.5rem 0;
   display: flex;
  border: none;*/
}

label {
  /* font-weight: bold;
  display: block; */
  /*margin-bottom: 0.5rem;*/
  color: #edb421;
  /*min-width: 75px;*/
}

input[type="checkbox"] + label {
  font-weight: normal;
  /*display: inline;
  margin: 0 0 0 0.5rem;*/
}

input,
textarea {
  /*display: block;
  width: 100%;*/
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  /*margin-inline-start: 1.5rem;*/
  color: gray;
  /*padding: 0.5rem;*/
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}
.validation-error-container {
  opacity: 0;
  transition: opacity 0.5s;
  padding-bottom: 2rem;
}

.validation-error-container.active {
  opacity: 1;
}

.validation-error {
  color: red;
}
.validation-error-container p {
  color: rgb(110 105 105);
  background-color: rgba(237, 219, 219, 0.5);
  border: red solid 2px;
  border-radius: 3px;
  padding: 0.5rem;
  position: relative;
  margin-bottom: 0;
}

.validation-error-container.pointer-up p:before {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  top: -10px;
  border-bottom: 10px solid red;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.form-label {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.form-submit-button {
  text-align: right;
}

#forgot-password {
  padding-top: 1.5rem;
  text-align: right;
}

#forgot-password a:link,
#forgot-password a:visited {
  color: #edb421;
}
#forgot-password a:hover {
  color: edb421;
  opacity: 0.7;
}
#forgot-password a:active {
  color: #edb421;
}
</style>
