<script setup>
import { ref, reactive } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();
//data
const data = reactive({
  message: {
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

  if (data.message.val === "" || data.message.val.length > 400) {
    data.message.isValid = false;
    formIsValid.value = false;
  }
};

const clearForm = () => {
  console.log("Clearing form");

  data.message.val === "";
  data.message.isValid = true;

  formIsValid.value = true;
};

const submitForm = () => {
  console.log("Submitting form");
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    message: data.message.val,
  };
  console.log("Form submitted");
  router.push({ name: "requests" });
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
      <div class="form-control" :class="{ invalid: !data.message.isValid }">
        <label for="message" hidden="hidden">Message</label>
        <textarea
          type="text"
          id="message"
          rows="7"
          v-model.trim="data.message.val"
          @blur="clearValidity('message')"
          maxlength="400"
          placeholder="Enter the message the onwer of the product you are requesting to read (max 400 characters)"
        ></textarea>
      </div>
      <div v-if="!data.message.isValid" class="validation-error-container">
        <p>
          The message must not be empty and must a maximum of 400 characters.
        </p>
      </div>
    </div>

    <div class="form-submit-button">
      <BaseButton @submit.prevent="submitForm">Submit Request</BaseButton>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: #fff;
  padding: 0;
  display: block;
}

.form-control {
  margin: 1.5rem 0;
}

label {
  font-weight: bold;

  /*margin-bottom: 0.5rem;*/
  color: #edb421;
}

input,
textarea {
  display: block;
  width: 100%;
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  color: gray;
  padding: 0.5rem;
  box-sizing: border-box;
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
select#category {
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  color: gray;
  margin-inline-start: 1.5rem;
}
</style>
