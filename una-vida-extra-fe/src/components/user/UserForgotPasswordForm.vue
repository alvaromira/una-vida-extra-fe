<!--Componente formulario para resetar el password. Solo hay un campo, que se valida. En caso de exito, se redirije al login, en caso de error, se muestra el error en el formulario. -->
<template>
  <form @submit.prevent="submitForm" class="rounded">
    <div class="container">
      <div class="row instructions">
        <div class="col">
          <p>
            Enter your email and we will email you a link to reset your
            password.
          </p>
        </div>
      </div>
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
      <div v-if="anyError">
        <!--Si hay algun error se muestra. El unico que se espera es 422, otro tipo de error seria un fallo general tipo 500-->
        <div
          class="validation-error-container pointer-up row"
          :class="{ active: anyError }"
        >
          <div class="col" v-if="!data.email.isValid">
            <p>Email must not be empty.</p>
          </div>
          <div class="col" v-if="resetError">
            <div id="login-errors">
              <p v-if="errorCode === 422" class="validation-error">
                Wrong credentials provided. Please check your email and
                password.
              </p>
              <p v-else>
                There was an error while logging you in. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--Mostrar el icono de progreso mientras se carga-->
      <div v-if="isProcessing" class="loading">
        <base-spinner></base-spinner>
      </div>
      <div class="form-field row submit">
        <div class="form-submit-button">
          <BaseButton :disabled="isProcessing">Send Link to Email</BaseButton>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";

const route = useRoute();

const isProcessing = ref(false);
const resetError = ref(false);
const errorCode = ref(null);

//Datos del formulario
const data = reactive({
  email: {
    val: "",
    isValid: true,
  },
});

const formIsValid = ref(true);

//vuex
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const router = useRouter(); // inicializacion para acceso al router

//comprobacion de si hay algun error
const anyError = computed(() => {
  if (data.email.isValid === false || resetError.value === true) {
    return true;
  }
  return false;
});

//funcion para poner al true si hace falta tras actualizar un campo, para que al validar compruebe si esta mal
const clearValidity = (input) => {
  data[input].isValid = true;
};

//VAlidacion del formulario, solo el correo
const validateForm = () => {
  formIsValid.value = true;

  if (data.email.val === "") {
    data.email.isValid = false;
    formIsValid.value = false;
  }
};

//envio del formulario. Si se pasa la validacion, se llama a la funcion para resetear el password
const submitForm = () => {
  resetError.value = false;
  validateForm();
  if (!formIsValid.value) {
    return;
  }
  forgotPassword();
};

//Funcion para gestionar el resultado de la solicitud de reseteo correcto
const handleSuccessfulReset = () => {
  isProcessing.value = false;
  //se muestra un toast de exito
  store.commit("addToast", {
    title: "Password Reset Requested",
    type: "success",
    message:
      "You have requested a password reset. You will receive an email to process your password reset in a few minutes.",
  });
  //se redirije a la ruta login
  router.push("/login");
};

//Funcion para solicitar al servidor el reseteo via API endpoint
async function forgotPassword() {
  isProcessing.value = true; //se muestra la carga
  try {
    await store.dispatch("forgotPassword", {
      email: data.email.val,
    });
    handleSuccessfulReset();
  } catch (response) {
    //Si hay error, se guarda el mensaje de error y se muestra directamente en el formulario. Realmente el resultado de la llamada a la API es bien correcto o bien incorrecto, no hay muchos detalles que dar
    isProcessing.value = false;
    resetError.value = true;
    errorCode.value = response.response.status;
  } finally {
    isProcessing.value = false; //se termina la carga
  }
}
</script>

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
.instructions {
  padding-bottom: 2rem;
  text-align: center;
}
</style>
