<script setup>
import { ref, defineProps, computed } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import IconAvailable from "../../icons/IconAvailable.vue";
import IconNotAvailable from "../../icons/IconNotAvailable.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import Modal from "../Modal.vue";
import ModalWithMap from "../ModalWithMap.vue";
import Map from "../Map.vue";

//call proudct api endpoint to get location

//call user api endpoint to get location

//place call to open map

//Aceppted properties for the card items
const props = defineProps({
  productId: Number,
  userLat: String,
  userLong: String,
});
</script>

<template>
  <ModalWithMap>
    <template #header>Location of product {{ productId }} with map</template>
    <template #body>Lat: {{ userLat }}, long: {{ userLong }} </template>
    <template #product-map><Map></Map></template>
    <template #footer>Passed footer</template>
  </ModalWithMap>
</template>
<style scoped></style>
