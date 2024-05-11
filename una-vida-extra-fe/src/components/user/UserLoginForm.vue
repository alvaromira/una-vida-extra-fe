<!--Componente formulario para logear a un usuario. Solo hay un par de campos, que se validan. En caso de exito, se redirije a los productos, en caso de error, se muestra el error en el formulario. -->
<template>
  <div class="row justify-content-md-center">
    <div class="col-md-8">
      <form @submit.prevent="submitForm" class="rounded">
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

          <div class="form-field row text-center">
            <div class="col-3 form-label">
              <label for="password">Password</label>
            </div>
            <div class="col-9">
              <input
                class="form-control col-8"
                :class="{ invalid: !data.password.isValid }"
                type="password"
                id="password"
                v-model.trim="data.password.val"
                @blur="clearValidity('password')"
              />
            </div>
          </div>
          <div
            v-if="!data.password.isValid"
            class="validation-error-container pointer-up row"
            :class="{ active: !data.password.isValid }"
          >
            <div class="col">
              <p>Password must not be empty.</p>
            </div>
          </div>

          <div>
            <div
              v-if="formIsValid.value === false"
              class="form-field row text-center"
            >
              <p>Please fix the above errors and submit again.</p>
            </div>
          </div>

          <div class="form-field row submit">
            <div class="form-submit-button">
              <BaseButton :disabled="isProcessing">Login</BaseButton>
            </div>
          </div>
          <div v-if="!isProcessing">
            <!--Si hay errores se muestran a continuacion. La variable de control de los errores se gestiona tras la llamada al login endpoint de la api-->
            <div
              id="login-errors"
              class="validation-error-container"
              :class="{ active: loginError }"
              v-if="loginError"
            >
              <p v-if="errorCode === 422" class="validation-error">
                Wrong credentials provided. Please check your email and
                password.
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

      <div class="container">
        <div class="row">
          <div class="col-sm-8 col-md-12">
            <div id="forgot-password">
              <RouterLink :to="{ name: 'forgot-password' }"
                >Forgot your password?</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseSpinner from "../ui/BaseSpinner.vue";

const route = useRoute();

//Variable para gestionar la carga
const isProcessing = ref(false);

const loginError = ref(false);
const errorCode = ref(null);

//datos del formulario, reactivos y vinculados a los campos del formulario
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
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const router = useRouter(); // inicializacion para acceso al router

//Para poner los campos en true al modificarlos y salir de ellos, asi que puede revalidar
const clearValidity = (input) => {
  console.log(`Setting valid to true: ${input}`);
  data[input].isValid = true;
};

//validación específica de cada uno de los campos del formulario
const validateForm = async () => {
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
  loginError.value = false;
};
//Envio del formulario. Se valida y si es valido, se llama a login() para logear al usuario frente al servidor
const submitForm = async () => {
  await validateForm();
  if (!formIsValid.value) {
    return;
  }
  await login();
};

//Funcion para logear al usuario
const login = async () => {
  isProcessing.value = true; // se activa la carga
  try {
    //se llama a la funcion de login del store de Vuex con los datos espearado, de forma async
    await store.dispatch("login", {
      payload: { email: data.email.val, password: data.password.val },
    });
    isProcessing.value = false; // se desactiva la carga
    handleSuccessfulLogin(); //si todo va ok se gestiona el exito
  } catch (error) {
    isProcessing.value = false; // se desactiva la carga
    loginError.value = true; //si hay errores se activa esta variable para mostrarlos en pantalla y se asignan corespondientemente el resto de variables de error
    if (error.response.status) {
      if (error.response.status && error.response.status === 422) {
        errorCode.value = 422;
      } else {
        errorCode.value = error.response.status;
      }
    } else {
      errorCode.value = 0;
      console.error(error.message);
    }
  }
};
//funcion para gestionar el exito de la llamada. Redireccion bien a productos bien a la ruta anterior
const handleSuccessfulLogin = () => {
  if (route.query.from != undefined && route.query.from.length > 0) {
    router.replace(route.query.from);
  } else {
    router.push("/products");
  }
};
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
  padding-top: 1rem;
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
