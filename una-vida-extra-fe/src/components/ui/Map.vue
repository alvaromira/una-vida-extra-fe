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

const center = ref([36.72, 4.42]);
let mapDiv = null;

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
  width: 80vw;
  height: 100vh;
}
</style>
