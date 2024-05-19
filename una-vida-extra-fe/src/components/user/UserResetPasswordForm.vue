<template>
  <form @submit.prevent="submitForm" class="rounded">
    <div class="container">
      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="email">Correo</label>
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
          <p>El correo electrónico no debe estar vacío.</p>
        </div>
      </div>

      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="password">Contraseña</label>
        </div>
        <div class="col-9">
          <div class="input-group">
            <input
              class="form-control"
              :class="{ invalid: !data.password.isValid }"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model.trim="data.password.val"
              @blur="clearValidity('password')"
            />
            <span
              class="input-group-text visibility-icon"
              id="input-password-visibility"
              data-target="password"
              @click.prevent="togglePasswordVisibility"
              >@</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="!data.password.isValid"
        class="validation-error-container pointer-up row"
        :class="{ active: !data.password.isValid }"
      >
        <div class="col">
          <p>
            La contraseña debe tener al menos 8 caracteres y contener al menos
            una letra mayúscula, una letra minúscula, un número y un carácter
            especial.
          </p>
        </div>
      </div>

      <div class="form-field row text-center">
        <div class="col-3 form-label">
          <label for="password-confirmation">Confirmación de contraseña</label>
        </div>
        <div class="col-9">
          <div class="input-group">
            <input
              class="form-control col-8"
              :class="{ invalid: !data.passwordConfirmation.isValid }"
              :type="showPassword ? 'text' : 'password'"
              id="password-confirmation"
              v-model.trim="data.passwordConfirmation.val"
              @blur="clearValidity('passwordConfirmation')"
            />
            <span
              class="input-group-text visibility-icon"
              id="input-password-confirmation-visibility"
              data-target="password-confirmation"
              @click.prevent="togglePasswordVisibility"
              >@</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="!data.passwordConfirmation.isValid"
        class="validation-error-container pointer-up row"
        :class="{ active: !data.passwordConfirmation.isValid }"
      >
        <div class="col">
          <p>
            La confirmación de la contraseña debe coincidir con la contraseña.
          </p>
        </div>
      </div>

      <div>
        <div
          v-if="formIsValid.value === false"
          class="form-field row text-center"
        >
          <p>Corrije los errores anteriores y envíalo nuevamente.</p>
        </div>
      </div>
      <div v-if="!isProcessing">
        <div
          id="login-errors"
          class="validation-error-container row"
          :class="{ active: resetError }"
          v-if="resetError"
        >
          <p class="validation-error col">
            {{ errorString }}
          </p>
        </div>
      </div>
      <div v-else class="loading">
        <base-spinner></base-spinner>
      </div>
      <div class="form-field row submit">
        <div class="col-md-6"></div>
        <div class="form-submit-button col-md-6">
          <BaseButton :disabled="isProcessing"
            >Restablecer contraseña</BaseButton
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";

// Define a ref to track if data is loaded
const isProcessing = ref(false);
const showPassword = ref(false);

/*const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};*/

const togglePasswordVisibility = (event) => {
  const inputId = event.target.dataset.target;
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
};

const resetError = ref(false);
const errorCode = ref(null);
const errorString = ref(
  "Se proporcionaron credenciales incorrectas. Por favor revisa tu correo electrónico y contraseña."
);

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
  token: {
    val: "",
    isValid: true,
  },
});

const formIsValid = ref(true);

//vuex
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const router = useRouter(); // inicializacion para acceso al router
const route = useRoute();

//received from the route
// Accessing query parameters
const email = route.query.email;
const token = route.params.token; // Assuming 'token' is a route parameter, not a query parameter

//computed
const emailParam = computed(() => {
  return route.query.email;
});
//computed
const tokenParam = computed(() => {
  return route.params.token;
});

onMounted(() => {
  data.email.val = emailParam.value;
  data.token.val = tokenParam;
});

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

//validación específica de cada uno de los campos del formulario
const validateForm = async () => {
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
  resetError.value = false;
  await resetPassword();
};

const resetPassword = async () => {
  isProcessing.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
  try {
    const formData = {
      email: data.email.val,
      password: data.password.val,
      password_confirmation: data.passwordConfirmation.val,
      token: data.token.val,
    };

    await store.dispatch("resetPassword", {
      payload: formData,
    });
    isProcessing.value = false; //Establece la carga a verdadero una vez que se obtienen los datos
    handleSuccessfulReset();
  } catch (error) {
    console.log(error);
    isProcessing.value = false; //Establece la carga a verdadero una vez que se obtienen los datos

    if (error.response.status) {
      if (error.response.status && error.response.status === 422) {
        if (error.response.data.errors.email[0]) {
          errorString.value = error.response.data.errors.email[0];
        }
        errorCode.value = 422;
      } else {
        errorCode.value = error.response.status;
      }
    } else {
      errorCode.value = 0;
    }
    resetError.value = true;
  }
};

const handleSuccessfulReset = () => {
  isProcessing.value = false;
  //toast
  store.commit("addToast", {
    title: "Contraseña actualizada",
    type: "success",
    message:
      "Has actualizado tu contraseña. Ahora puedes iniciar sesión en el sitio.",
  });
  router.push("/login");
};
</script>

<style scoped>
.visibility-icon {
  border: #edb421 solid thin;
  cursor: pointer;
}
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
