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
              <li>User location latitutde: {{ userLat }}</li>
              <li>User location longitude: {{ userLong }}</li>
            </ul>
          </div>
          <div v-if="prodReqDetailReady">
            <Map
              :-user-coords="[userLat, userLong]"
              :-requested-product-coords="[
                prodReqDetails.location.latitude,
                prodReqDetails.location.longitude,
              ]"
            ></Map>
          </div>
          <div v-else>
            <p>Loading map details...</p>
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
const prodReqDetailReady = ref(false);
const requestError = ref(false);
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});

//get the details for the Product in the request
const getProductDetails = async () => {
  try {
    const resp = await axios.get(
      "http://localhost:8000/api1/products/" + props.productId
    );

    prodReqDetails.value = resp.data.data;
    prodReqDetailReady.value = true;
    console.log(prodReqDetails.value);
    console.log(prodReqDetailReady.value);

    //isLoading.value = false;
    requestError.value = false;
    //router.push({ name: "products", query: { registration: "success" } });
  } catch (error) {
    // Handle Error Here
    console.error(error);
    //isLoading.value = false;
    requestError.value = true;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data", error.response.data);
      console.error("Error status", error.response.status);
      errorDetails.code = error.response.status;
      errorDetails.message = error.message;
      if (error.response.data.errors) {
        let requestRecivedErrors = error.response.data.errors;
        for (const property in requestRecivedErrors) {
          errorDetails.errors.push(requestRecivedErrors[property].toString());
        }
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message", error.message);
      console.error("Error code", error.code);
      errorDetails.code = error.code;
      errorDetails.message = error.message;
    }
  }
};

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
  if (event.key === "Escape") {
    //emit("close");
    //$emit('close')
  } else {
    console.log(`Key pressed ${event.key}`);
  }
};

onBeforeMount(() => {
  getProductDetails();
}),
  onMounted(() => {
    console.log("Adding the keyup listener");
    document.addEventListener("keyup", handleKeyUp);
  });
onUnmounted(() => {
  console.log("Removing the keyup listener");
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
