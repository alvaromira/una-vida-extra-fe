<script setup>
import { ref, defineProps, computed, defineEmits } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import IconAvailable from "../../icons/IconAvailable.vue";
import IconNotAvailable from "../../icons/IconNotAvailable.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import ModalWithMap from "../ModalWithMap.vue";

const store = useStore();
const activeUserId = computed(() => {
  return store.state.user.id;
});
const activeUserLocation = computed(() => {
  return store.state.user.user_location;
});
const isModalVisible = ref(false);

//Aceppted properties for the card items
const props = defineProps({
  message: String,
  date: String,
  distance: String,
  id: Number,
  isActive: Boolean,
  productId: Number,
});

const emit = defineEmits(["removed-request"]);

//function
const cancelMyRequest = () => {
  //TODO:
  //modal for confirmation
  //place request to cancel
  //if success, emit event to parent with ID, remove it
  // $emit('removedRequest', props.id)
  emit("removed-request", activeUserId.value, props.id);
  //console.log(
  //  `User ${activeUserId.value} is cancelling request with id ${props.id}`
  //);
};

const showLocation = () => {
  console.log("Displaying location");
  showModal();
};
//modal
const showModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  console.log("modal emit received, closing modal visibilty");
  isModalVisible.value = false;
};
</script>

<template>
  <div class="request-card-wrapper" :id="id">
    <div class="request-product-id request-card-item">{{ productId }}</div>
    <div class="request-message request-card-item">{{ message }}</div>
    <div class="request-date request-card-item">{{ date }}</div>
    <div class="request-distance request-card-item">
      <IconLocation @click="showLocation" />{{ distance }}
    </div>
    <div class="request-status request-card-item">
      <span v-if="isActive"><IconAvailable /></span>
      <span v-else><IconNotAvailable /></span>
    </div>
    <div class="request-cancel-button">
      <BaseButton @click="cancelMyRequest">Cancel</BaseButton>
    </div>
  </div>

  <ModalWithMap
    :productId="productId"
    :userLat="activeUserLocation.latitude"
    :userLong="activeUserLocation.longitude"
    v-if="isModalVisible"
    @close="closeModal"
  >
    <!--<template #header>Location of product {{ productId }} with map</template>
    <template #body
      >Lat: {{ activeUserLocation.latitude }}, long:
      {{ activeUserLocation.longitude }}
    </template>
    <template #footer>Passed footer</template>-->
  </ModalWithMap>
</template>

<style scoped>
.request-card-wrapper {
  display: flex;
  padding: 1.5rem;
  border: #edb421 solid thin;
  background-color: #fff;
  margin-bottom: 1.5rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.request-card-item {
  flex: 1;
  text-align: center;
}

.request-message {
  color: gray;
}
</style>
