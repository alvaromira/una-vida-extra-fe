<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();

//computed
const loginRedirection = computed(() => {
  return route.query.from;
});

console.log("LoginRedirection", route.query.from);

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
  //logUserIn();
  login();

  //console.log(formData);

  // this.$emit("save-data", formData);
};

async function login() {
  // this.processing = true

  try {
    /*const csrfCookie = await axios.get(
      "http://localhost:8000/sanctum/csrf-cookie"
    );

    console.log(csrfCookie);

    const response = await axios.post("http://localhost:8000/api1/login", {
      email: data.email.val,
      password: data.password.val,
    });*/
    //const call = await axios.get("http://localhost:8000/api1/user");
    //console.log(call);
    //console.log("Login response", response);
    store
      .dispatch("login", {
        payload: { email: data.email.val, password: data.password.val },
      })
      .then(() => {
        if (route.query.from != undefined && route.query.from.length > 0) {
          router.replace(route.query.from);
        } else {
          router.push("/products");
        }
      });
  } catch (response) {
    if (response.response.status === 422) {
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
    }
  } finally {
    console.log("login function over.");
  }
}
/*
  const cookie = await axios.get("http://localhost:8000/sanctum/csrf-cookie");
  await axios
    .post("http://localhost:8000/api1/login", {
      email: data.email.val,
      password: data.password.val,
    })
    .then(({ data }) => {
      // this.signIn()
      console.log(data);
      store.commit("logUserIn");
      router.push("/products");
    })
    .catch(({ response }) => {
      if (response.status === 422) {
        //this.validationErrors = response.data.errors
        console.log(response.data.errors);
      } else {
        //this.validationErrors = {}
        //alert(response.data.message)
        console.log(response.data.message);
      }
    })
    .finally(() => {
      // this.processing = false
    });
}*/
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <div class="form-field">
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
      </div>

      <div class="form-field">
        <div class="form-control" :class="{ invalid: !data.password.isValid }">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model.trim="data.password.val"
            @blur="clearValidity('password')"
          />
        </div>

        <div v-if="!data.password.isValid" class="validation-error-container">
          <p>Password must not be empty.</p>
        </div>

        <p v-if="formIsValid.value === false">
          Please fix the above errors and submit again.
        </p>
      </div>
    </div>

    <div class="form-submit-button">
      <BaseButton>Login</BaseButton>
    </div>
  </form>
  <div id="forgot-password">
    <RouterLink :to="{ name: 'forgot-password' }"
      >Forgot your password?</RouterLink
    >
  </div>
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
  min-width: 75px;
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

/*
.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
  opacity: 0.7;
}*/

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
