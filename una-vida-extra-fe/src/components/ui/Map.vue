<template>
  <div id="container">
    <div id="mapContainer"></div>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import leaflet, { map } from "leaflet";
import {
  ref,
  defineProps,
  computed,
  reactive,
  onMounted,
  onBeforeMount,
  onUnmounted,
} from "vue";

const props = defineProps({
  RequestedProductCoords: Array,
  UserCoords: Array,
});

const center = ref([props.UserCoords[0], props.UserCoords[1]]);
let mapDiv = null;
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
const setupLeafletMap = () => {
  console.log("Preparing map...");

  mapDiv = leaflet.map("mapContainer").setView(center.value, 5);
  leaflet
    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(mapDiv);
  //user marker
  let userMarker = L.marker([props.UserCoords[0], props.UserCoords[1]]).addTo(
    mapDiv
  );
  userMarker.bindPopup("User location.");
  //prod marker
  let prodMarker = L.marker(
    [props.RequestedProductCoords[0], props.RequestedProductCoords[1]],
    { icon: greenIcon }
  ).addTo(mapDiv);
  prodMarker.bindPopup("Product location.");
};

const removeLeafletMap = () => {};

onBeforeMount(() => {
  console.log("onBeforeMount");
  if (mapDiv) {
    console.log("onBeforeMount map found. Clearing map");
    mapDiv.remove();
  } else {
    console.log("onBeforeMount Map div NOT found");
  }
});

onMounted(() => {
  if (mapDiv) {
    console.log(" On mounted Map div found");
    // TO DO update the map
  } else {
    console.log("On mounted Map div NOT found");
  }
  setupLeafletMap();
});

onUnmounted(() => console.log("Unmounting Map component"));
</script>
<style scoped>
#mapContainer {
  width: auto;
  height: 300px;
}
</style>
