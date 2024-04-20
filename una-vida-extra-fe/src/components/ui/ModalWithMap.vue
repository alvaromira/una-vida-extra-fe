<!--https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component-->
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal-container"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <div name="header">Location Data</div>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </header>

        <section class="modal-body" id="modalDescription">
          <div name="body"></div>
          <div v-if="prodReqDetailReady">
            <Map
              :-user-coords="[userLat, userLong]"
              :-requested-product-coords="[prodLat, prodLong]"
            ></Map>
            <div class="map-legend">
              <div class="active-user-legend">Your location</div>
              <div class="other-user-legend">User location</div>
            </div>
          </div>
          <div v-else>
            <p>Loading map details...</p>
          </div>
        </section>

        <section class="modal-map" id="modalMap">
          <div name="product-map"></div>
        </section>

        <footer class="modal-footer">
          <div name="footer"></div>
          <button
            type="button"
            class="btn-green"
            @click="$emit('close')"
            aria-label="Close"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  onBeforeMount,
  onMounted,
  onUnmounted,
  defineEmits,
  defineProps,
  ref,
  reactive,
} from "vue";
import Map from "./Map.vue";
import axios from "axios";

const prodReqDetails = ref();
const prodReqDetailReady = ref(true); //use emit from Map itself to handle this

const close = defineEmits(["close"]);
//const close = () => {
//  defineEmits(["close"]);
//};

//Aceppted properties for the card items
const props = defineProps({
  userLat: String,
  userLong: String,
  prodLat: String,
  prodLong: String,
});
const handleKeyUp = (event) => {
  if (event.key === "Escape") {
    //handle closure
  }
};

onMounted(() => {
  document.addEventListener("keyup", handleKeyUp);
});
onUnmounted(() => {
  document.addEventListener("keyup", handleKeyUp);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: #ffffff;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
  /*box-shadow: 2px 2px 20px 1px;*/
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 100%;
  border-radius: 5px;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #7ab370;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  color: #7ab370;
}

.btn-green {
  color: white;
  background: #7ab370;
  border: 1px solid #7ab370;
  border-radius: 2px;
  cursor: pointer;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.active-user-legend:before,
.other-user-legend:before {
  content: "";
  display: inline-block;
  width: 20px; /* Adjust length of the line as needed */
  height: 2px; /* Adjust thickness of the line as needed */
  margin-right: 10px; /* Adjust spacing between line and text as needed */
}

.active-user-legend:before {
  background-color: #2e84cb;
}

.other-user-legend:before {
  background-color: #25ac21;
}
</style>
