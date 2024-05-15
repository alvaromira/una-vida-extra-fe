<!--Componente para mostrar el icono de gravatar en un círculo y con diferentes tamaños y configuraciones-->
<template>
  <div class="profile-picture" :class="mode">
    <img v-show="isDataLoaded" :src="gravatarUrl" alt="Profile" />
  </div>
  <div v-if="props.gravatarInfo">
    <p>
      Since we are about re-using, we use the
      <a href="https://gravatar.com/" target="_blank">gravatar</a> linked to
      your email address once you register. &#128522;
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import md5 from "md5";

//variable para ver la carga esta completa o no
const isDataLoaded = ref(false);

//Watch para monitorizar cuando cambia la propiedad recibida y capturar el gravatar. Se usa en el registro de usuarios a medida que el usuario teclea el email
watch(
  () => props.userEmail,
  (newValue, oldValue) => {
    gravatarUrl.value = generateGravatarUrl(newValue);
  }
);

const props = defineProps({
  userEmail: String,
  mode: {
    type: String,
    default: "small", // Se aceptan small,medium y large. El predefenido es small
  },
  gravatarInfo: {
    type: Boolean,
    default: true,
  },
});
const isGravatarValid = ref(false);
const gravatarUrl = ref("");

//Al crearse elcomponente, se usa la direccion email del usuario para capturar su gravatar
onMounted(() => {
  gravatarUrl.value = generateGravatarUrl(props.userEmail);
});

//Funcion para obtener el gravatar del usuario desde Gravatar usando la API y el email del usuario.
const generateGravatarUrl = async (email) => {
  if (!email || email.trim() === "") {
    return null;
  }
  //se crea el hash necesario para la llamada a api de Gravatar
  const hash = md5(email.toLowerCase().trim());

  //Se hace una llamada http sin axios porque en Axios por defecto se usa el valor withCredentials = true y ahora no hace falta
  try {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Hay gravatar disponible, se usa
          isGravatarValid.value = true;
          gravatarUrl.value = `https://gravatar.com/avatar/${hash}?d=identicon`;
          isDataLoaded.value = true; // carga completada
        } else {
          //si no hay gravatar para el correo, se genera una imagen aleatoria a partir del correo.
          isGravatarValid.value = false;
          gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
          isDataLoaded.value = true;
        }
      }
    };
    xhr.open("GET", `https://gravatar.com/avatar/${hash}?d=robohash`, true); //con la opcion robohash, se genera una imagen aleatoria si no hay correo registrado
    xhr.send();
  } catch (error) {
    //errorores
    isGravatarValid.value = false;
    gravatarUrl.value = "https://ui-avatars.com/api/?name=" + email;
    isDataLoaded.value = true; //Establece la carga a verdadero una vez que se obtienen los datos
  }
};
</script>

<style scoped>
.profile-picture {
  border-radius: 50%; /** se usa el border radius al 50% para hacer un circulo */
  overflow: hidden;
  margin-inline-end: 3px;
  background-color: #e9ecef;
  margin: 0 auto;
  margin-bottom: 1rem;
}

.small {
  width: 35px;
  height: 35px;
}

.medium {
  width: 75px;
  height: 75px;
}

.large {
  width: 125px;
  height: 125px;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: white;
}
</style>
