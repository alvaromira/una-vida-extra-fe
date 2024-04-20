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
      <BaseButton
        @submit.prevent="submitForm"
        :isDisabled="isProductedAlreadyRequestedByUser"
        >Submit Request</BaseButton
      >
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, defineProps, onBeforeMount } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const props = defineProps({
  id: String,
});

//to store the productIDs already requested by the user
const userActiveRequests = ref([]);
const isProductedAlreadyRequestedByUser = ref(false);

//data
const data = reactive({
  message: {
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
  console.log("Running validation on request form");

  formIsValid.value = true;

  if (data.message.val === "" || data.message.val.length > 400) {
    data.message.isValid = false;
    formIsValid.value = false;
  }
};

const activeUserId = computed(() => {
  return store.state.user.id;
});

const submitForm = async () => {
  console.log("Submitting form");
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    message: data.message.val,
    request_date: "2023-11-11 16:12:49",
    is_active: true,
    product_id: props.id,
    user_id: activeUserId.value,
  };
  console.log("Form submitted");
  //logUserIn();
  const r = await sendProdRequest(formData);

  //router.push({ name: "requests" });

  //console.log(formData);

  // this.$emit("save-data", formData);
};

//to do handle pagination
async function getUserRequestedProducts(user_id) {
  const resp = await axios.get(`${baseApiUrl}/users/${user_id}/requests`);
  return resp.data;
}

async function sendProdRequest(requestData) {
  // this.processing = true
  console.log("sending...", requestData);

  try {
    const resp = await axios.post(`${baseApiUrl}/requests`, {
      ...requestData,
    });

    console.log("Request response", resp);

    //TODO Show toast
    router.push({ name: "requests" });

    //TO DO handle errors properly
    /*store.dispatch("login").then(() => {
      if (route.query.from != undefined && route.query.from.length > 0) {
        router.replace(route.query.from);
      } else {
        router.push("/products");
      }
    });*/
  } catch (err) {
    if (err.status === 422) {
      //this.validationErrors = err.data.errors
      console.log(err.data.errors);
    } else {
      //this.validationErrors = {}
      //alert(err.data.message)
      console.log(err);
    }
  } finally {
    console.log("request creation function over.");
  }
}

//the list of products already requested
onBeforeMount(async () => {
  console.log(
    "Component is about to be mounted. Checking products for " +
      activeUserId.value
  );
  const requestedProds = await getUserRequestedProducts(activeUserId.value);
  console.log(requestedProds.data);

  if (requestedProds.data) {
    const filteredData = requestedProds.data.filter(
      (item) =>
        item.product_id == props.id && item.user_id == activeUserId.value
    );
    if (filteredData.length) {
      isProductedAlreadyRequestedByUser.value = true;
    }

    console.log(
      `Is this already requested? ${isProductedAlreadyRequestedByUser.value}`
    );
  }

  // You can perform additional setup or actions here
});
</script>

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
