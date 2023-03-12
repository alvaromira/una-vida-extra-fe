<script setup>
import { ref, reactive } from "vue";

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
});

const formIsValid = ref(true);

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
  if (data.password.val === "") {
    data.password.isValid = false;
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
    password: data.password.val,
  };
  console.log("Form submitted");
  console.log(formData);
  // this.$emit("save-data", formData);
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <div class="form-control" :class="{ invalid: !data.email.isValid }">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model.trim="data.email.val"
          @blur="clearValidity('email')"
        />
        <p v-if="!data.email.isValid">email must not be empty.</p>
      </div>

      <div class="form-control" :class="{ invalid: !data.password.isValid }">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model.trim="data.password.val"
          @blur="clearValidity('password')"
        />
        <p v-if="!data.password.isValid">password must not be empty.</p>
      </div>

      <p v-if="formIsValid.value === false">
        Please fix the above errors and submit again.
      </p>
    </div>

    <button>Login</button>
  </form>
</template>

<style scoped>
form {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
  padding: 0;
  display: block;
  padding: 2rem;
}

.form-control {
  margin: 1.5rem 0;
  display: flex;
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
#image-upload {
  display: flex;
}
</style>
