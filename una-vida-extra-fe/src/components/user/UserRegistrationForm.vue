<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";
import ProfileImage from "../ui/ProfileImage.vue";
const store = useStore();
import { useStore } from "vuex";

const activeUserEmail = computed(() => {
  return data.email.val;
});

//data
const data = reactive({
  firstName: {
    val: "",
    isValid: true,
  },
  lastName: {
    val: "",
    isValid: true,
  },
  phone: {
    val: "",
    isValid: true,
  },
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
  publicDetails: {
    val: false,
    isValid: true,
  },
  longitude: {
    val: null,
    isValid: true,
  },
  latitude: {
    val: null,
    isValid: true,
  },
});

const router = useRouter();
const formIsValid = ref(true);
const isLoading = ref(false);
const requestError = ref(false);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

//computed
const apiErrorsFound = computed(() => {
  return errorDetails.message.length;
});

const apiErrorsCaptured = computed(() => {
  return errorDetails.errors.length > 0;
});

//methods

//get the user location coords using the default nav controls
const getLocationCoords = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords.latitude);
      data.latitude.val = position.coords.latitude;
      data.latitude.isValid = true;
      console.log(position.coords.longitude);
      data.longitude.val = position.coords.longitude;
      data.longitude.isValid = true;
    },
    (error) => {
      console.log(
        `There was an error fetching the geo coords ${error.message}`
      );
    }
  );
};

const clearValidity = (input) => {
  console.log(`Setting valid to true: ${input}`);
  data[input].isValid = true;
};

//specific validation of each of the registration forms included
const validateForm = () => {
  console.log("Running validation on registration form");

  formIsValid.value = true;

  if (data.firstName.val === "") {
    data.firstName.isValid = false;
    formIsValid.value = false;
  }

  if (data.lastName.val === "") {
    data.lastName.isValid = false;
    formIsValid.value = false;
  }

  if (data.email.val === "") {
    data.email.isValid = false;
    formIsValid.value = false;
  }

  if (data.phone.val === "") {
    data.phone.isValid = false;
    formIsValid.value = false;
  }

  if (data.password.val === "" || data.password.val.length < 8) {
    data.password.isValid = false;
    formIsValid.value = false;
  }

  if (
    data.passwordConfirmation.val === "" ||
    data.passwordConfirmation.val !== data.password.val
  ) {
    data.passwordConfirmation.isValid = false;
    formIsValid.value = false;
  }

  if (data.publicDetails.val === "") {
    data.publicDetails.isValid = false;
    formIsValid.value = false;
  }

  //validate long and lat together
  if (
    !data.longitude.val ||
    !data.latitude.val ||
    typeof data.longitude.val === "undefined" ||
    typeof data.latitude.val === "undefined"
  ) {
    data.longitude.isValid = false;
    data.latitude.isValid = false;
    formIsValid.value = false;
  }

  /*
    last: data.lastName.val,
    phone: data.phone.val,
    password: data.password.val,
    publicDetails: data.publicDetails.val,
    longitude: data.longitude.val,
    latitude: data.latitude.val, */
};

const submitForm = () => {
  console.log("Submitting form");

  validateForm();

  if (!formIsValid.value) {
    return;
  }

  requestError.value = false;
  isLoading.value = true;
  errorDetails.errors.length = 0;
  const formData = {
    name: data.firstName.val,
    surname: data.lastName.val,
    email: data.email.val,
    phone: data.phone.val,
    password: data.password.val,
    password_confirmation: data.passwordConfirmation.val,
    // publicDetails: data.publicDetails.val,
    // longitude: data.longitude.val,
    // latitude: data.latitude.val,
  };
  console.log("Form submitted");
  // console.log(formData);

  //axios request

  const sendRegistrationRequest = async () => {
    try {
      const cookie = await axios.get(
        "http://localhost:8000/sanctum/csrf-cookie"
      );
      const resp = await axios.post(
        "http://localhost:8000/api1/register",
        formData
      );
      //console.log(resp);

      if (resp.status === 201) {
        isLoading.value = false;
        requestError.value = false;

        store.commit("addToast", {
          title: "User registered",
          type: "success",
          message: "You have successfully registered. You can now log in.",
        });

        router.push({ name: "products" });
      }
    } catch (error) {
      // Handle Error Here
      //console.error(error);
      isLoading.value = false;
      requestError.value = true;

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data", error.response.data);
        console.error("Error status", error.response.status);
        errorDetails.code = error.response.status;
        errorDetails.message = error.message;
        if (error.response.data.errors) {
          let requestRecivedErrors = error.response.data.errors;
          for (const property in requestRecivedErrors) {
            // console.log(`${property}: ${requestRecivedErrors[property]}`);
            errorDetails.errors.push(requestRecivedErrors[property].toString());
          }
        }
        //console.log(error.response.headers);
        // } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        //   console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message", error.message);
        console.error("Error code", error.code);
        errorDetails.code = error.code;
        errorDetails.message = error.message;
      }
    }
  };

  sendRegistrationRequest();

  // this.$emit("save-data", formData);
};

/*
export default {
  // emits: ["save-data"],
};*/
</script>

<template>
  <div class="form-component-container">
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="form-left-side form-side">
          <div>
            <div
              class="form-control"
              :class="{ invalid: !data.firstName.isValid }"
            >
              <label for="firstname">Firstname</label>
              <input
                type="text"
                id="firstname"
                v-model.trim="data.firstName.val"
                @blur="clearValidity('firstName')"
              />
            </div>
            <div
              v-if="!data.firstName.isValid"
              class="validation-error-container"
            >
              <p>Firstname must not be empty.</p>
            </div>

            <div
              class="form-control"
              :class="{ invalid: !data.lastName.isValid }"
            >
              <label for="lastname">Lastname</label>
              <input
                type="text"
                id="lastname"
                v-model.trim="data.lastName.val"
                @blur="clearValidity('lastName')"
              />
            </div>
            <div
              v-if="!data.lastName.isValid"
              class="validation-error-container"
            >
              <p>Lastname must not be empty.</p>
            </div>

            <div class="form-control" :class="{ invalid: !data.email.isValid }">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model.trim="data.email.val"
                @blur="clearValidity('email')"
              />
            </div>
            <div v-if="!data.email.isValid" class="validation-error-container">
              <p>Email must not be empty.</p>
            </div>

            <div class="form-control" :class="{ invalid: !data.phone.isValid }">
              <label for="phone">Phone</label>
              <input
                type="text"
                id="phone"
                v-model.trim="data.phone.val"
                @blur="clearValidity('phone')"
              />
            </div>
            <div v-if="!data.phone.isValid" class="validation-error-container">
              <p>Phone must not be empty.</p>
            </div>

            <div
              class="form-control"
              :class="{ invalid: !data.password.isValid }"
            >
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model.trim="data.password.val"
                @blur="clearValidity('password')"
              />
            </div>
            <div
              v-if="!data.password.isValid"
              class="validation-error-container"
            >
              <p>
                Password must not be empty and it must be 8 characters in
                length.
              </p>
            </div>

            <div
              class="form-control"
              :class="{ invalid: !data.passwordConfirmation.isValid }"
            >
              <label for="password-confirmation">Password confirmation</label>
              <input
                type="password"
                id="password-confirmation"
                v-model.trim="data.passwordConfirmation.val"
                @blur="clearValidity('passwordConfirmation')"
              />
            </div>
            <div
              v-if="!data.passwordConfirmation.isValid"
              class="validation-error-container"
            >
              <p>
                Password confirmation must not be empty and must be at least 8
                characters.
              </p>
            </div>
            <div
              class="form-control"
              :class="{ invalid: !data.publicDetails.isValid }"
            >
              <label for="public-details">Public details</label>
              <input
                type="checkbox"
                checked
                id="public-details"
                v-model.trim="data.publicDetails.val"
                @blur="clearValidity('publicDetails')"
              />
              <p v-if="!data.publicDetails.isValid">
                public-details must not be empty.
              </p>
            </div>

            <p v-if="formIsValid.value === false">
              Please fix the above errors and submit again.
            </p>
          </div>
        </div>
        <div class="form-right-side form-side">
          <div id="image-upload">
            <div>
              <ProfileImage :userEmail="activeUserEmail" :mode="'large'" />
            </div>
          </div>
          <div id="coords-details">
            <div class="form-control">
              <label for="longitude">Longitude</label>
              <input
                type="text"
                id="longitude"
                v-model.trim="data.longitude.val"
              />
            </div>
            <div
              v-if="!data.longitude.isValid"
              class="validation-error-container"
            >
              <p>Longitude must not be empty.</p>
            </div>
            <div class="form-control">
              <label for="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                v-model.trim="data.latitude.val"
              />
            </div>
            <div
              v-if="!data.latitude.isValid"
              class="validation-error-container"
            >
              <p>Latitude must not be empty.</p>
            </div>
            <BaseButton @click.prevent="getLocationCoords" mode="outline"
              >Get my Location</BaseButton
            >
            <p class="note">
              We need your location to make sure that proximity is considered
              when donating products.Thanks!
            </p>
          </div>
          <div class="form-submit-button">
            <BaseButton>Register</BaseButton>
          </div>
        </div>
      </form>
    </div>
    <div class="request-status">
      <div class="loading" v-show="isLoading">
        <base-spinner></base-spinner>
      </div>
      <div class="request-errors" v-show="requestError">
        <p>
          There was an error when trying to perform the registration. Please try
          again.
        </p>
        <div v-if="apiErrorsFound">
          <p>Details:</p>
          <ul>
            <li>
              Code:
              <pre>{{ errorDetails.code }}</pre>
            </li>
            <li>
              Message:
              <pre>{{ errorDetails.message }}</pre>
            </li>
            <li v-if="apiErrorsCaptured">
              Errors:
              <ul>
                <li v-for="e in errorDetails.errors">{{ e }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-component-container {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
}
form {
  padding: 0;
  display: flex;
}
.form-side {
  flex: 1;
  padding: 2rem;
}
.form-control {
  margin: 1.5rem 0;
  display: flex;
}

.profile-pic {
  background-color: gray;
  width: 125px;
  height: 125px;

  margin-right: 1rem;
  margin-bottom: 1rem;
}
#image-upload input {
  margin: 0;
  border: none;
  box-shadow: none;
}

label {
  font-weight: bold;
  display: block;
  /*margin-bottom: 0.5rem;*/
  color: #edb421;
}

input[type="checkbox"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  margin-inline-start: 1.5rem;
  color: gray;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type="checkbox"] {
  display: inline;
  width: auto;
  border: none;
  box-shadow: none;
}

input[type="checkbox"]:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.validation-error-container p {
  color: rgb(110 105 105);
  background-color: rgba(237, 219, 219, 0.5);
  border: red solid 2px;
  border-radius: 3px;
  padding: 0.5rem;
  position: relative;
}
.validation-error-container p:before {
  content: "";
  display: block;
  position: absolute;
  left: 25%;
  top: -10px;
  border-bottom: 10px solid red;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
/*.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}*/
#image-upload {
  display: flex;
  justify-content: center;
}
.note {
  color: rgb(139, 138, 138);
}

.form-submit-button {
  text-align: right;
}
.request-errors {
  color: red;
  opacity: 0.7;
  padding: 1rem;
  background-color: rgba(237, 219, 219, 0.5);
  border: red solid 2px;
}
.request-errors pre {
  display: inline-block;
}

.request-status {
  padding: 2rem;
}
.request-status p {
  margin: 0;
}
.request-status ul {
  line-height: 1rem;
}
.request-status ul li {
  line-height: 1rem;
}
</style>
