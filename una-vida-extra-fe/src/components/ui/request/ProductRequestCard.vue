<script setup>
import { ref, computed, defineEmits } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import IconAvailable from "../../icons/IconAvailable.vue";
import IconNotAvailable from "../../icons/IconNotAvailable.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import ModalWithMap from "../ModalWithMap.vue";
import ProfileImage from "../ProfileImage.vue";

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
  distance: Number,
  id: Number,
  isActive: Boolean,
  userId: Number,
  productId: Number,
});

const emit = defineEmits(["accepted-request"]);

//function
const acceptRequest = () => {
  emit("accepted-request", activeUserId.value, props.id, props.productId);
};
const showLocation = () => {
  showModal();
};
//modal
const showModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<template>
  <div class="request-card-wrapper" :id="id">
    <div class="request-user-details request-card-item">
      <span>
        <ProfileImage
          userEmail="alvaromira83@gmail.com"
          :mode="'small'"
          :gravatarInfo="false"
        />
      </span>
      <span :data-user-id="userId">username</span>
    </div>
    <!--<div class="request-message request-card-item">{{ message }}</div>
    <div class="request-date request-card-item">{{ date }}</div>-->
    <div class="request-distance request-card-item">
      <IconLocation @click="showLocation" />{{ distance }}&nbsp;km
    </div>
    <div class="request-message request-card-item">{{ message }}</div>
    <!--<div class="request-status request-card-item">
      <span v-if="isActive"><IconAvailable /></span>
      <span v-else><IconNotAvailable /></span>
    </div>-->
    <div class="request-accept-button">
      <BaseButton @click="acceptRequest">Accept</BaseButton>
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
  max-width: 75%;
}
.request-card-item {
  flex: 1;
  text-align: center;
}
.request-user-details {
  display: flex;
  align-items: center;
}

.request-message {
  color: gray;
  text-align: left;
  padding-right: 0.25rem;
}
</style>
