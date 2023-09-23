<!--https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component-->
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <div name="header">Information for {{ productId }}</div>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close modal"
          >
            x
          </button>
        </header>

        <section class="modal-body" id="modalDescription">
          <div name="body">
            <ul>
              <li>Latitutde: {{ userLat }}</li>
              <li>Longitude: {{ userLong }}</li>
            </ul>
          </div>
          <div>
            <Map></Map>
          </div>
        </section>

        <section class="modal-map" id="modalMap">
          <div name="product-map"></div>
        </section>

        <footer class="modal-footer">
          <div name="footer">This is the default footer!</div>
          <button
            type="button"
            class="btn-green"
            @click="$emit('close')"
            aria-label="Close modal"
          >
            Close Modal
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, defineEmits, defineProps } from "vue";
import Map from "./Map.vue";

const close = defineEmits(["close"]);
//const close = () => {
//  defineEmits(["close"]);
//};

//Aceppted properties for the card items
const props = defineProps({
  productId: Number,
  userLat: String,
  userLong: String,
});
const handleKeyUp = (event) => {
  if (event.keycode === 27) {
    close();
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

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 35%;
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
  color: #4aae9b;
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
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
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
</style>
