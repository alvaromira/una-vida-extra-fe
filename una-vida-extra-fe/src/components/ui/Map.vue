<!--Componente que se usa como contenedor para albergar mapas generados con la libreri leaflet. Mas info sobre leaflet en https://leafletjs.com/. Realmente se usa OpenStreetMaps para los mapas, que es totalmente libre. Leaftlet es un 'facilitador'-->
<template>
  <div id="mapContainer"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import leaflet, { map } from "leaflet";
import { ref, computed, onMounted, onBeforeMount, onUnmounted } from "vue";

//Propiedades aceptadas, las coordinadas de lat y long del producto (heredadas del dueño) y las de quien las solicita
const props = defineProps({
  RequestedProductCoords: Array,
  UserCoords: Array,
});

//Validacion con computed para saber si las propiedades que se envian son validas, o no.
const isUserCoordsValid = computed(() => {
  return props.UserCoords !== undefined && props.UserCoords.length > 1;
});
const isRequestedProductCoordsValid = computed(() => {
  return (
    props.RequestedProductCoords !== undefined &&
    props.RequestedProductCoords.length > 1
  );
});

//Variable para centrar el map.
let center = ref(null);

/*
//Se se dan las coordinadas del usuario y son validas, se usan para centrar el mapa. Si no se dan las del usuario, se usan las del producto, si son validas
if (isUserCoordsValid.value) {
  center.value = ref([props.UserCoords[0], props.UserCoords[1]]);
} else if (isRequestedProductCoordsValid.value) {
  center.value = [
    props.RequestedProductCoords[0],
    props.RequestedProductCoords[1],
  ];
} else {
  // Si ni UserCoords ni RequestedProductCoords son válidos, se saca un error
  console.error("No se han dado coordinadas validas.");
}*/
//variable para poner el div donde se monta el mapa
let mapDiv = null;
//variable para crear el icono marcador de color verde para el mapa
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

//Funcion para calcular el centro del mapa
const setMapCenter = async () => {
  if (isUserCoordsValid.value) {
    center.value = [props.UserCoords[0], props.UserCoords[1]];
  } else if (isRequestedProductCoordsValid.value) {
    center.value = [
      props.RequestedProductCoords[0],
      props.RequestedProductCoords[1],
    ];
  } else {
    // Si ni UserCoords ni RequestedProductCoords son válidos, se saca un error
    console.error("No se han dado coordenadas válidas.");
  }
};

//Funcion de preparacion del mapa
const setupLeafletMap = async () => {
  //El nombre de map debe ser el id de un div
  mapDiv = leaflet
    .map("mapContainer")
    .setView([center.value[0], center.value[1]], 5);
  //Tras especificar el div para montar, se crea  mapa y se da la atribucion para finalmente agnadirlo al div del mapa
  leaflet
    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(mapDiv);

  //se añade el marcado del usuario si las coordenadas son validas
  if (isUserCoordsValid.value) {
    let userMarker = L.marker([props.UserCoords[0], props.UserCoords[1]]).addTo(
      mapDiv
    );
    userMarker.bindPopup("Ubicación del usuario");
  }

  //Se añade el marcador del producto, si las coordenadas son validas. Se usa el icono verde creado para diferenciarlo
  if (isRequestedProductCoordsValid.value) {
    let prodMarker = L.marker(
      [props.RequestedProductCoords[0], props.RequestedProductCoords[1]],
      { icon: greenIcon }
    ).addTo(mapDiv);
    prodMarker.bindPopup("Ubicación del producto");
  }
};

const removeLeafletMap = () => {};

onBeforeMount(() => {
  //Antes de montar, como precaucion, se borra cualquier instancia previa del mapa
  if (mapDiv) {
    mapDiv.remove();
  }
});

//Al montar el componente, se configura el centro y carga el mapa
onMounted(async () => {
  await setMapCenter();
  await setupLeafletMap();
});

//onUnmounted(() => console.log("Unmounting Map component"));
</script>
<style scoped>
#mapContainer {
  width: 100%;
  height: 300px;
}
</style>
