<!--Componente formulario para ver el perfil del usuario y sus datos y actualizarlo si se quiere. Tiene varios campos, que se validan. Los datos y el formularios estan vinculados dinamicamente con v-model. En caso de exito o de error al actualizar, se muestra un toast. -->
<template>
  <form @submit.prevent="submitForm" class="rounded">
    <div class="row">
      <div class="form-left-side form-side col-md-6">
        <div class="form-field row text-center">
          <div class="col-3 form-label">
            <label for="firstname">Firstname</label>
          </div>
          <div class="col-9">
            <input
              :class="{ invalid: !data.firstName.isValid }"
              class="form-control"
              type="text"
              id="firstname"
              v-model.trim="data.firstName.val"
              @blur="clearValidity('firstName')"
            />
          </div>
        </div>
        <div v-if="!data.firstName.isValid" class="validation-error-container">
          <p>Firstname must not be empty.</p>
        </div>

        <div class="form-field row text-center">
          <div class="col-3 form-label">
            <label for="lastname">Lastname</label>
          </div>
          <div class="col-9">
            <input
              :class="{ invalid: !data.lastName.isValid }"
              class="form-control"
              type="text"
              id="lastname"
              v-model.trim="data.lastName.val"
              @blur="clearValidity('lastName')"
            />
          </div>
        </div>
        <div v-if="!data.lastName.isValid" class="validation-error-container">
          <p>Lastname must not be empty.</p>
        </div>

        <div class="form-field row text-center">
          <div class="col-3 form-label"><label for="email">Email</label></div>
          <div class="col-9">
            <input
              :class="{ invalid: !data.email.isValid }"
              class="form-control"
              type="email"
              id="email"
              v-model.trim="data.email.val"
              @blur="clearValidity('email')"
            />
          </div>
        </div>
        <div v-if="!data.email.isValid" class="validation-error-container">
          <p>Email must not be empty.</p>
        </div>

        <div class="form-field row text-center">
          <div class="col-3 form-label"><label for="phone">Phone</label></div>
          <div class="col-9">
            <input
              :class="{ invalid: !data.phone.isValid }"
              class="form-control"
              type="text"
              id="phone"
              v-model.trim="data.phone.val"
              @blur="clearValidity('phone')"
            />
          </div>
        </div>
        <div v-if="!data.phone.isValid" class="validation-error-container">
          <p>Phone must not be empty.</p>
        </div>
        <p v-if="formIsValid.value === false">
          Please fix the above errors and submit again.
        </p>
        <div class="row">
          <div class="col-sm-8 col-md-12">
            <div id="forgot-password">
              <!--{or si las moscas, el reset de password se hace como un forgot, para tener la verificacion de correo, etc.}-->
              <p class="note">
                Do you want to reset your password? No probs! You can reset it

                <RouterLink :to="{ name: 'forgot-password' }">here</RouterLink>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="form-right-side form-side col-md-6">
        <div class="form-field row">
          <div id="image-upload">
            <div>
              <ProfileImage :userEmail="activeUserEmail" :mode="'large'" />
            </div>
          </div>
        </div>
        <div id="coords-details">
          <div class="form-field row text-center">
            <div class="col-3 form-label">
              <label for="longitude">Longitude</label>
            </div>
            <div class="col-9">
              <input
                class="form-control"
                type="text"
                id="longitude"
                v-model.trim="data.longitude.val"
                disabled
              />
            </div>
          </div>
          <div
            v-if="!data.longitude.isValid"
            class="validation-error-container"
          >
            <p>Longitude must not be empty.</p>
          </div>

          <div class="form-field row text-center">
            <div class="col-3 form-label">
              <label for="latitude">Latitude</label>
            </div>
            <div class="col-9">
              <input
                class="form-control"
                type="text"
                id="latitude"
                v-model.trim="data.latitude.val"
                disabled
              />
            </div>
          </div>
          <div v-if="!data.latitude.isValid" class="validation-error-container">
            <p>Latitude must not be empty.</p>
          </div>
          <div id="user-city" class="row" v-if="userCity !== ''">
            <div class="col text-end">
              <p>You are based around {{ userCity }}.</p>
            </div>
          </div>
          <div class="row">
            <div class="col text-end">
              <BaseButton @click.prevent="getLocationCoords" mode="outline"
                >Get my Location</BaseButton
              >
              <p class="note">
                We need your location to make sure that proximity is considered
                when donating products.Thanks!
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="co">
            <div class="form-submit-button">
              <BaseButton>Update</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="request-status row">
      <div class="loading col text-center" v-show="isLoading">
        <base-spinner></base-spinner>
      </div>
      <transition name="request-errors">
        <div class="request-errors col" v-show="requestError">
          <!--solo se muestran si hay errores en la llamada a la API-->
          <p>
            There was an error when trying to perform the registration. Please
            try again.
          </p>
          <div v-if="apiErrorsFound">
            <p>Details:</p>
            <ul v-if="apiErrorsCaptured">
              <li v-for="e in errorDetails.errors">{{ e }}</li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import ProfileImage from "../ui/ProfileImage.vue";
import axios from "axios";
import BaseSpinner from "../ui/BaseSpinner.vue";
import { useStore } from "vuex";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//Variables de control para el formulario
const formIsValid = ref(true);
const requestError = ref(false);
const isLoading = ref(false); //variable para gestionar el estado de carga local
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});
//Variables para la gestion de la ubicacion
const locationUpdated = ref(false); //se usa para solo tratar de actualizar la ubicacion si se ha actualizado realmente
const userCity = ref("");
const userCountry = ref("");

//computed para el correo, el id y la ubicacion, que se toman del state de Vuex
const activeUserEmail = computed(() => {
  return store.state.user.email;
});
const activeUserId = computed(() => {
  return store.state.user.id;
});
const activeUserLocation = computed(() => {
  return store.state.user.user_location;
});
const apiErrorsFound = computed(() => {
  return errorDetails.message.length;
});

// Helper function para comprobar valores nules o cadenas vacias
const isValidValue = (value) => value !== null && value !== "";

onMounted(() => {
  // Deconstruccion de los valores del usuario en el store state. Se recogen los valores del usuario logeado para luego rellenar los datos del perfil del usuario en el formulario
  const { name, surname, phone, email, user_location } = store.state.user;

  // Se asignan las propiedades y se validan para usarlas en el formulario si son validos
  data.firstName.val = isValidValue(name) ? name : "";
  data.lastName.val = isValidValue(surname) ? surname : "";
  data.phone.val = isValidValue(phone) ? phone : "";
  data.email.val = isValidValue(email) ? email : "";

  // Comprobando si la ubicación_usuario existe y sus propiedades son válidas
  if (user_location && typeof user_location === "object") {
    const { latitude, longitude } = user_location;
    data.latitude.val = isValidValue(latitude) ? latitude : "";
    data.longitude.val = isValidValue(longitude) ? longitude : "";
  } else {
    // Establecer latitud y longitud en cadenas vacías si la ubicación_usuario no es válida
    data.latitude.val = "";
    data.longitude.val = "";
  }
});

//datos del formulario, vinculados con un v-model
const data = reactive({
  firstName: {
    val: null,
    isValid: true,
  },
  lastName: {
    val: null,
    isValid: true,
  },
  phone: {
    val: null,
    isValid: true,
  },
  email: {
    val: null,
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
  location_id: {
    val: null,
    isValid: true,
  },
});

//obtiene las coordenadas de ubicación del usuario usando los controles de navegación predeterminados
const getLocationCoords = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords.latitude);
      data.latitude.val = position.coords.latitude;
      data.latitude.isValid = true;
      console.log(position.coords.longitude);
      data.longitude.val = position.coords.longitude;
      data.longitude.isValid = true;

      /* Como se ha actualizado la ubicación, se indica con la variable que lo registra */
      locationUpdated.value = true;

      const cityName = getCityNameFromCoords(
        position.coords.longitude,
        position.coords.latitude
      );
    },
    (error) => {
      console.log(
        `There was an error fetching the geo coords ${error.message}`
      );
    }
  );
};

//Funcion para obtener el nombre de la ciudad desde la coordenadas usando Open Street Map y su api para busqueda invertida
const getCityNameFromCoords = async (lon, lat) => {
  //url de la api de OSM
  let OSMReverseURL =
    "https://nominatim.openstreetmap.org/reverse?lat=" +
    lat +
    "&lon=" +
    lon +
    "&format=json";

  try {
    const response = await axios.get(OSMReverseURL, { withCredentials: false }); //es necesario no usar credenciales en la llamada. El resultado se guarda en los valores de ciudad y pais
    userCity.value = response.data.address.city;
    userCountry.value = response.data.address.country;
  } catch (error) {
    throw error; // vuelve a lanzar el error que se manejará en el componente
  }
};
//funcion para poner a true los valores tras salir del campo del formulario
const clearValidity = (input) => {
  data[input].isValid = true;
};

//validación específica de cada uno de los campos del formulario
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

  //lat y long se validan juntas porque no tienen sentido por separado
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

//envio del formulario. Si es valido, se create un formulario con todos los datos y se manda a la funcion de registro
const submitForm = async () => {
  validateForm();
  if (!formIsValid.value) {
    return;
  }
  const locationFormData = {
    country: userCountry.value,
    city: userCity.value,
    latitude: data.latitude.val,
    longitude: data.longitude.val,
  };
  /* En primer lugar, se actualiza la ubicación de usuario, si es que se ha obtenido de nuevo la ubicación*/
  if (locationUpdated.value == true) {
    const locationId = await createUserLocation(locationFormData);
    data.location_id.val = locationId;
    data.location_id.isValid = true;
  } else {
    data.location_id.val = activeUserLocation.value.id;
  }

  //Ahora ya están disponible todos los detalles para actualizar el perfil completo.
  const formData = {
    first: data.firstName.val,
    last: data.lastName.val,
    email: data.email.val,
    phone: data.phone.val,
    location_id: data.location_id.val,
  };

  //Se lanza la llamada y en función del resultado se lanza un toast
  await updateUser(activeUserId.value, formData);
};

//Funcion para actualizar el usuario, que recibe el id y los datos de usuario
async function updateUser(userID, data) {
  try {
    //se llama la funcion almacenada en el state de Vuex
    await store.dispatch("updateUserDetails", {
      id: userID,
      payload: data,
    });
    // Mostrar toast de exito
    store.commit("addToast", {
      title: "User Updated",
      type: "success",
      message: `Your user profile details have been updated.`,
    });
  } catch (error) {
    // Mostrar toast de error
    store.commit("addToast", {
      title: "User Not Updated",
      type: "error",
      message: `Your user profile could not be updated. Please try again later.`,
    });
  }
}

/** Funcion para crear o actualizar una ubicacion de usuario
 *
 * @param locationFormData formulario con los datos para crear o actualizar una ubicacion
 * @returns id de la ubicacion nueva o actualizada
 */
const createUserLocation = async (locationFormData) => {
  try {
    //Comprobamos si se ha podido recuperar correctamente el ID de ubicacion para actualizarlo
    let activeUserLocationID = activeUserLocation.value.id;
    if (isValidValue(activeUserLocationID)) {
      const resp = await axios.put(
        `${baseApiUrl}/locations/${activeUserLocationID}`,
        locationFormData
      );
      console.log(`Location id ${activeUserLocationID} updated successfully.`);
      handleSuccessfulResponse(resp);
    } else {
      const resp = await axios.post(
        `${baseApiUrl}/locations`,
        locationFormData
      );
      console.log(`Newly created Location ID: ${resp.data.data.id}`);
      handleSuccessfulResponse(resp);
    }
  } catch (error) {
    handleErrorResponse(error);
  }
};

/** Helpers para la gestion de los errores. Se aceptan 201 para la creacion desde 0 y 201 para la actualizacion */
const handleSuccessfulResponse = (resp) => {
  if (resp.status === 201 || resp.status === 200) {
    requestError.value = false;
    return resp.data.data.id;
  }
};

const handleErrorResponse = (error) => {
  requestError.value = true; //se pone a true para que se muestren en el formulario
  if (error.response) {
    console.error("Error data", error.response.data);
    console.error("Error status", error.response.status);
    errorDetails.code = error.response.status;
    errorDetails.message = error.message;
    if (error.response.data.errors) {
      const requestReceivedErrors = error.response.data.errors;
      for (const property in requestReceivedErrors) {
        errorDetails.errors.push(requestReceivedErrors[property].toString());
      }
    }
  } else {
    console.error("Error message", error.message);
    console.error("Error code", error.code);
    errorDetails.code = error.code;
    errorDetails.message = error.message;
  }
};
</script>

<style scoped>
.form-component-container {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
}
form {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
  padding: 0;
  /* display: block; */
  padding: 2rem;
}
/*.form-side {
  flex: 1;
  padding: 2rem;
}
.form-control {
  margin: 1.5rem 0;
  display: flex;
}
*/
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
  /*display: block;
  margin-bottom: 0.5rem;*/
  color: #edb421;
}

input[type="checkbox"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}
div.form-field {
  padding-bottom: 2rem;
}
div.form-field.submit {
  padding-bottom: 0rem;
}
.form-label {
  align-items: center;
  display: flex;
  justify-content: center;
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

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type="checkbox"] {
  /* display: inline;
  width: auto;
  border: none;
  box-shadow: none;*/
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
  left: 50%;
  top: -10px;
  border-bottom: 10px solid red;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
#public-details {
  margin-left: 0.5rem;
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
  justify-content: center;
}
.note {
  color: rgb(139, 138, 138);
  padding-top: 1rem;
}

.form-submit-button {
  text-align: right;
}
.request-errors {
  color: red;
  opacity: 0.7;
  padding: 1rem;
  background-color: rgba(237, 219, 219, 0.5);
  border: red solid 2px;
}
.request-errors pre {
  display: inline-block;
}

.request-errors-enter-active,
.request-errors-leave-active {
  transition: opacity 0.5s;
}
.request-errors-enter,
.request-errors-leave-to {
  opacity: 0;
}

.request-status {
}
.request-status p {
  margin: 0;
}
.request-status ul {
  line-height: 1rem;
}
.request-status ul li {
  line-height: 1rem;
}
.visibility-icon {
  border: #edb421 solid thin;
  cursor: pointer;
}
</style>
