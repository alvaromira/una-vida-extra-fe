<script setup>
import { ref, computed, defineEmits, onBeforeMount } from "vue";
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

onBeforeMount(() => {
  if (props.isAccepted === true) {
    console.log("this one is accepted");
  }
});
</script>

<template>
  <div
    class="request-card-wrapper row"
    :id="id"
    :class="{ accepted: props.isAccepted, inactive: !props.isActive }"
  >
    <div class="request-user-details request-card-item col-md-2 d-flex">
      <div class="row flex-column">
        <div class="col item">
          <span>
            <ProfileImage
              :userEmail="props.userEmail"
              :mode="'small'"
              :gravatarInfo="false"
            />
          </span>
          <span :data-user-id="userId">{{ props.userName }}</span>
        </div>
        <div v-if="props.isAccepted" class="col item">
          <span class="note"
            >You can now contact the requester:
            <a :href="'mailto:' + props.userEmail"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-envelope"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"
                /></svg></a
          ></span>
        </div>
      </div>
    </div>
    <div class="request-distance request-card-item col-md-2">
      <IconLocation @click="showLocation" />&nbsp;{{ distance }}&nbsp;km
    </div>
    <div class="request-message request-card-item col-md-6">{{ message }}</div>
    <div class="request-accept-button col-md-2">
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
.note {
  color: rgb(139, 138, 138);
  font-size: 0.9rem;
}
.request-card-wrapper {
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
  margin-bottom: 1.5rem;
}
.request-card-wrapper.accepted {
  border: #7ab370 solid thin;
}
.request-card-wrapper.inactive {
  border: #c0c0c0 solid thin;
  opacity: 0.5;
}
.request-card-item,
.request-accept-button {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.request-user-details .item {
  padding: 0;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
} /*

.request-message {
  color: gray;
  text-align: left;
  padding-right: 0.25rem;
}*/
</style>
