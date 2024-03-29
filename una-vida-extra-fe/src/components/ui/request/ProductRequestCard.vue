<script setup>
import { ref, computed, defineEmits } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import IconAvailable from "../../icons/IconAvailable.vue";
import IconNotAvailable from "../../icons/IconNotAvailable.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import ModalWithMap from "../ModalWithMap.vue";
import ProfileImage from "../ProfileImage.vue";
import IconInfo from "../../icons/IconInfo.vue";

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
  isAccepted: Boolean,
  userId: Number,
  userName: String,
  userEmail: String,
  userCoords: Object,
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
  <div
    class="request-card-wrapper"
    :id="id"
    :class="{ accepted: props.isAccepted, inactive: !props.isActive }"
  >
    <div class="request-user-details request-card-item">
      <span>
        <ProfileImage
          :userEmail="props.userEmail"
          :mode="'small'"
          :gravatarInfo="false"
        />
      </span>
      <span :data-user-id="userId">{{ props.userName }}</span>
      <IconInfo v-if="props.isAccepted"></IconInfo>
    </div>
    <div class="request-distance request-card-item">
      <IconLocation @click="showLocation" />&nbsp;{{ distance }}&nbsp;km
    </div>
    <div class="request-message request-card-item">{{ message }}</div>
    <div class="request-accept-button">
      <BaseButton
        v-if="!props.isAccepted"
        @click="acceptRequest"
        :isDisabled="!props.isActive"
        >Accept</BaseButton
      >
      <BaseButton
        v-else
        :to="{ name: 'product', params: { id: props.productId } }"
        link="true"
        >Go to Product</BaseButton
      >
    </div>
  </div>

  <ModalWithMap
    :userLat="activeUserLocation.latitude"
    :userLong="activeUserLocation.longitude"
    :prodLat="userCoords.latitude"
    :prodLong="userCoords.longitude"
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
.request-card-wrapper.accepted {
  border: #7ab370 solid thin;
}
.request-card-wrapper.inactive {
  border: #c0c0c0 solid thin;
  opacity: 0.5;
}
.request-card-item {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
}
.request-accept-button {
  text-align: center;
  display: flex;
  align-items: center;
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
