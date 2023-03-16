<script setup>
import { ref, reactive } from "vue";
import BaseButton from "../ui/BaseButton.vue";

//to do: read data from logged in user to populate values
//data
const data = reactive({
  firstName: {
    val: "John",
    isValid: true,
  },
  lastName: {
    val: "Martin",
    isValid: true,
  },
  phone: {
    val: "676 33 44 00",
    isValid: true,
  },
  email: {
    val: "foo@gmail.com",
    isValid: true,
  },
  publicDetails: {
    val: true,
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
};

const submitForm = () => {
  console.log("Submitting form");
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    first: data.firstName.val,
    last: data.lastName.val,
    email: data.email.val,
    phone: data.phone.val,
    publicDetails: data.publicDetails.val,
    longitude: data.longitude.val,
    latitude: data.latitude.val,
  };
  console.log("Form submitted");
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
    <div class="form-left-side form-side">
      <div>
        <div class="form-control" :class="{ invalid: !data.firstName.isValid }">
          <label for="firstname">Firstname</label>
          <input
            type="text"
            id="firstname"
            v-model.trim="data.firstName.val"
            @blur="clearValidity('firstName')"
          />
        </div>
        <div v-if="!data.firstName.isValid" class="validation-error-container">
          <p>Firstname must not be empty.</p>
        </div>

        <div class="form-control" :class="{ invalid: !data.lastName.isValid }">
          <label for="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            v-model.trim="data.lastName.val"
            @blur="clearValidity('lastName')"
          />
        </div>
        <div v-if="!data.lastName.isValid" class="validation-error-container">
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
        <img src="" class="profile-pic" />
        <div>
          <label for="profile-pic">Profile picture</label>
          <input
            type="file"
            id="profile-pic"
            name="profile-pic"
            accept="image/png, image/jpeg"
          />
        </div>
      </div>
      <div id="coords-details">
        <div class="form-control">
          <label for="longitude">Longitude</label>
          <input type="text" id="longitude" v-model.trim="data.longitude.val" />
        </div>
        <div v-if="!data.longitude.isValid" class="validation-error-container">
          <p>Longitude must not be empty.</p>
        </div>
        <div class="form-control">
          <label for="latitude">Latitude</label>
          <input type="text" id="latitude" v-model.trim="data.latitude.val" />
        </div>
        <div v-if="!data.latitude.isValid" class="validation-error-container">
          <p>Latitude must not be empty.</p>
        </div>
        <BaseButton @click.prevent="getLocationCoords" mode="outline"
          >Get my Location</BaseButton
        >
        <p class="note">
          We need your location to make sure that proximity is considered when
          donating products.Thanks!
        </p>
      </div>
      <div class="form-submit-button">
        <BaseButton>Update</BaseButton>
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
}

.note {
  color: rgb(139, 138, 138);
}

.form-submit-button {
  text-align: right;
}
</style>
