<!--Componente formulario para que los usuarios puedan solicitar un producto que está disponible. Solo se requiere el mensaje para mandarlo y listo.-->
<template>
  <div v-if="isProductedAlreadyRequestedByUser" class="already-requested">
    <!--Si ya se ha solicitado, se indica y no se muestra el formulario-->
    <p>Parece que ya has solicitado este producto.</p>
    <p>
      Haz clic
      <RouterLink v-if="!isUserAdmin" :to="{ name: 'requests' }"
        >aquí</RouterLink
      >
      para ver tus solicitudes.
    </p>
  </div>
  <form v-else @submit.prevent="submitForm">
    <div class="row">
      <div class="col">
        <div class="mb-3">
          <div class="form-control" :class="{ invalid: !data.message.isValid }">
            <label for="message" hidden="hidden" class="form-label"
              >Mensaje</label
            >
            <textarea
              class="form-control"
              type="text"
              id="message"
              rows="7"
              v-model.trim="data.message.val"
              @blur="clearValidity('message')"
              maxlength="400"
              placeholder="Mensaje que el propietario del producto recibirá con tu solicitud (máximo 400 caracteres)"
            ></textarea>
          </div>
        </div>
      </div>
      <div v-if="!data.message.isValid" class="validation-error-container">
        <p>
          El mensaje no debe estar vacío y debe tener un máximo de 400
          caracteres.
        </p>
      </div>
    </div>

    <div class="form-submit-button">
      <BaseButton
        @submit.prevent="submitForm"
        :isDisabled="isProductedAlreadyRequestedByUser"
        >Enviar solicitud</BaseButton
      ><!--Si el usuario ya lo ha solicitado, el botón estará desactivado-->
    </div>
    <div class="loading col text-center" v-show="isLoading">
      <base-spinner></base-spinner>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import BaseSpinner from "../BaseSpinner.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const props = defineProps({
  id: String,
});

const isLoading = ref(false); //variable para gestionar el estado de carga local

//variable para saber si el usuario ya ha pedido este producto, o no, y mostrar u ocultar el formulario
const isProductedAlreadyRequestedByUser = ref(false);

//datos
const data = reactive({
  message: {
    val: "",
    isValid: true,
  },
});

const formIsValid = ref(true);
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const router = useRouter(); // inicializacion para acceso al router

//Metodo para poner a true tras salir
const clearValidity = (input) => {
  data[input].isValid = true;
};

//validación específica de cada uno de los campos del formulario
const validateForm = () => {
  formIsValid.value = true;

  if (data.message.val === "" || data.message.val.length > 400) {
    data.message.isValid = false;
    formIsValid.value = false;
  }
};

//se computa el usuario activo desde el store de Vuex
const activeUserId = computed(() => {
  return store.state.user.id;
});

//funcion para el envio del formulario
const submitForm = async () => {
  validateForm();

  if (!formIsValid.value) {
    return false;
  } //si hay fallos, no se sigue con el envio

  //se crea los datos para mandar al endpoint
  const formData = {
    message: data.message.val,
    is_active: true,
    product_id: props.id,
    user_id: activeUserId.value,
  };

  const r = await sendProdRequest(formData);
};

//Funcion para obtener todos los productos
async function getUserRequestedProducts() {
  const fetchedUserRequest = await store.dispatch(
    "getAllUserRequestedProducts",
    activeUserId.value
  );
  return fetchedUserRequest;
}

//Funcion para mandar la solicitud para el producto
async function sendProdRequest(requestData) {
  try {
    // Poner isLoading a true
    isLoading.value = true;
    const resp = await axios.post(`${baseApiUrl}/requests`, {
      ...requestData,
    });
    handleSuccess();
  } catch (err) {
    handleError();
  } finally {
    // Poner isLoading a false
    isLoading.value = false;
  }
}

//Function para cuando todo OK
const handleSuccess = () => {
  // Poner isLoading a false
  isLoading.value = false;
  //toast
  store.commit("addToast", {
    title: "Solicitud enviada",
    type: "success",
    message: "Ha solicitado el producto. ¡Buena suerte!",
  });
  router.push({ name: "requests" });
};

// Método para gestionar la respuesta de error
const handleError = (error) => {
  // Poner isLoading a false
  isLoading.value = false;

  // Inicializa las variables errorStatus y errorMessage
  let errorStatus = null;
  let errorMessage = null;

  if (error.response) {
    // Capturar el codigo de error
    errorStatus = error.response.status;
    console.error("Código de error", error.response.status);

    // Extraer mensaje de error, solo el primero, de forma que si hay varios se solucinan uno a uno.
    const errors = error.response.data.errors;
    if (errors && Object.keys(errors).length > 0) {
      const firstChildKey = Object.keys(errors)[0];
      const firstChildErrors = errors[firstChildKey];
      if (Array.isArray(firstChildErrors) && firstChildErrors.length > 0) {
        errorMessage = firstChildErrors[0];
      }
    }
  } else {
    // Otros errores
    console.error("Mensaje de error", error.message);
    console.error("Código de error", error.code);
    errorStatus = error.code;
    errorMessage = error.message;
  }

  // Construir el mensaje de error final
  const finalMessage = `No se pudo realizar la solicitud. Código de error: ${errorStatus}. Mensaje de error: ${errorMessage}`;

  //Mostrar el toast con el error
  store.commit("addToast", {
    title: "Solicitud no enviada",
    type: "error",
    message: finalMessage,
  });
};

//Antes de cargar el componente, obtener los productos del usuario
onBeforeMount(async () => {
  const requestedProds = await getUserRequestedProducts(activeUserId.value);
  //Si hay productos solicitados, se filtran para ver si existe ya el que se está visitando para solicitar

  if (requestedProds) {
    let filteredData = [];
    for (let i = 0; i < requestedProds.length; i++) {
      if (requestedProds[i].product_id == props.id) {
        filteredData.push(requestedProds[i]);
      }
    }
    if (filteredData.length) {
      isProductedAlreadyRequestedByUser.value = true;
    }
  }
});
</script>

<style scoped>
.form-control {
  padding: 0;
}
form {
  background-color: #fff;
  padding: 0;
  display: block;
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

.note {
  color: rgb(139, 138, 138);
}

.form-submit-button {
  text-align: right;
}

.already-requested {
  padding-top: 1rem;
}
.already-requested p {
  color: gray;
}
</style>
