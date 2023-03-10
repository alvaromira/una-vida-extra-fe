<script setup>
import { ref, reactive } from "vue";

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
    val: null,
    isValid: true,
  },
  passwordConfirmation: {
    val: null,
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

const formIsValid = ref(true);

//methods

//
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
  data[input].isValid = true;
};

//specific validation of each of the registration forms included
const validateForm = () => {
  formIsValid.value = true;
  if (data.firstName.val === "") {
    data.firstName.isValid = false;
    formIsValid.value = false;
  }
  if (data.lastName.val === "") {
    data.lastName.isValid = false;
    formIsValid.value = false;
  }
};

const submitForm = () => {
  console.log("Submitting");
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    first: data.firstName.val,
    last: data.lastName.val,
    phone: data.phone.val,
    password: data.password.val,
    publicDetails: data.publicDetails.val,
    longitude: data.longitude.val,
    latitude: data.latitude.val,
  };

  console.log(formData);
  // this.$emit("save-data", formData);
};

/*
export default {
  // emits: ["save-data"],
};*/
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <div class="form-control" :class="{ invalid: !data.firstName.isValid }">
        <label for="firstname">Firstname</label>
        <input
          type="text"
          id="firstname"
          required
          v-model.trim="data.firstName.val"
          @blur="clearValidity('firstName')"
        />
        <p v-if="!data.firstName.isValid">Firstname must not be empty.</p>
      </div>
      <div class="form-control" :class="{ invalid: !data.lastName.isValid }">
        <label for="lastname">Lastname</label>
        <input
          type="text"
          id="lastname"
          required
          v-model.trim="data.lastName.val"
          @blur="clearValidity('lastName')"
        />
        <p v-if="!data.lastName.isValid">Lastname must not be empty.</p>
      </div>
      <div class="form-control" :class="{ invalid: !data.email.isValid }">
        <label for="email">email</label>
        <input
          type="email"
          id="email"
          required
          v-model.trim="data.email.val"
          @blur="clearValidity('email')"
        />
        <p v-if="!data.email.isValid">email must not be empty.</p>
      </div>
      <div class="form-control" :class="{ invalid: !data.phone.isValid }">
        <label for="phone">phone</label>
        <input
          type="text"
          id="phone"
          required
          v-model.trim="data.phone.val"
          @blur="clearValidity('phone')"
        />
        <p v-if="!data.phone.isValid">phone must not be empty.</p>
      </div>
      <div class="form-control" :class="{ invalid: !data.password.isValid }">
        <label for="password">password</label>
        <input
          type="password"
          id="password"
          required
          v-model.trim="data.password.val"
          @blur="clearValidity('password')"
        />
        <p v-if="!data.password.isValid">password must not be empty.</p>
      </div>
      <div
        class="form-control"
        :class="{ invalid: !data.passwordConfirmation.isValid }"
      >
        <label for="password-confirmation">password-confirmation</label>
        <input
          type="password"
          id="password-confirmation"
          required
          v-model.trim="data.passwordConfirmation.val"
          @blur="clearValidity('passwordConfirmation')"
        />
        <p v-if="!data.passwordConfirmation.isValid">
          password-confirmation must not be empty.
        </p>
      </div>
      <div
        class="form-control"
        :class="{ invalid: !data.publicDetails.isValid }"
      >
        <label for="public-details">public-details</label>
        <input
          type="checkbox"
          id="public-details"
          v-model.trim="data.publicDetails.val"
          @blur="clearValidity('publicDetails')"
        />
        <p v-if="!data.publicDetails.isValid">
          public-details must not be empty.
        </p>
      </div>

      <p v-if="!formIsValid.value">
        Please fix the above errors and submit again.
      </p>
    </div>

    <div id="coords-details">
      <p>
        We need your location to make sure that proximity is considered when
        donating products.Thanks!
      </p>
      <div class="form-control">
        <label for="longitude">Longitude</label>
        <input type="number" id="longitude" v-model.trim="data.longitude.val" />
        <p v-if="!data.longitude.isValid">longitude must not be empty.</p>
      </div>
      <div class="form-control">
        <label for="latitude">latitude</label>
        <input type="number" id="latitude" v-model.trim="data.latitude.val" />
        <p v-if="!data.latitude.isValid">latitude must not be empty.</p>
      </div>
      <button @click="getLocationCoords">Get my Location</button>
    </div>

    <div id="image-upload">
      <label for="profile-pic">Choose a profile picture:</label>

      <input
        type="file"
        id="profile-pic"
        name="profile-pic"
        accept="image/png, image/jpeg"
      />
    </div>

    <button>Register</button>
  </form>
</template>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
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
  border: 1px solid #ccc;
  font: inherit;
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
}

input[type="checkbox"]:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
