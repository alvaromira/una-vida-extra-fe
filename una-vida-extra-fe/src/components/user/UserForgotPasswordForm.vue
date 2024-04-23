<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";
import axios from "axios";

const route = useRoute();

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;

const isProcessing = ref(false);
const loginError = ref(false);
const errorCode = ref(null);

//data
const data = reactive({
  email: {
    val: "",
    isValid: true,
  },
});

const formIsValid = ref(true);

//vuex
const store = useStore();
const router = useRouter();

//using computed property derived from Vuex
const getUserStatus = computed(() => {
  return store.state.authenticated;
});

//methods
const clearValidity = (input) => {
  console.log(`Setting valid to true: ${input}`);
  data[input].isValid = true;
};

//specific validation of each of the registration forms included
const validateForm = () => {
  console.log("Running validation on registration form");

  formIsValid.value = true;

  if (data.email.val === "") {
    data.email.isValid = false;
    formIsValid.value = false;
  }
};

const submitForm = () => {
  console.log("Submitting form");
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    email: data.email.val,
  };
  console.log("Form submitted");
  forgotPassword();
};

async function forgotPassword() {
  // this.processing = true

  try {
    // const csrfCookie = await axios.get(`${baseUrl}/sanctum/csrf-cookie`);
    // console.log(csrfCookie);
    /*   const response = await axios.post(`${baseApiUrl}/login`, {
      email: data.email.val,
      password: data.password.val,
    });
    //console.log(call);
    console.log("Login response", response);
    store.dispatch("login").then(() => {
      if (route.query.from != undefined && route.query.from.length > 0) {
        router.replace(route.query.from);
      } else {
        router.push("/products");
      }
    });*/
  } catch (response) {
    /*if (response.response.status === 422) {
      //this.validationErrors = response.data.errors
      console.log(response.response.data.errors);
      //show toast with error message
      store.commit("addToast", {
        title: "Login Error",
        type: "error",
        message:
          "Wrong credentials provided. Please check your email and password.",
      });
    } else {
      //this.validationErrors = {}
      //alert(response.data.message)
      //console.log(response);
      //show toast with error message
      store.commit("addToast", {
        title: "Login Error",
        type: "error",
        message:
          "There was en error while logging you in. Please check your email and password and try again.",
      });
    }*/
  } finally {
    console.log("password reset function over.");
  }
}
</script>

<template>
  <form @submit.prevent="submitForm">
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

      <div class="form-field row submit">
        <div class="form-submit-button">
          <BaseButton :disabled="isProcessing">Reset Password</BaseButton>
        </div>
      </div>
      <div v-if="!isProcessing">
        <div
          id="login-errors"
          class="validation-error-container"
          :class="{ active: loginError }"
          v-if="loginError"
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
