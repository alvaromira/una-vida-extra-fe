<template>
  <div class="row justify-content-md-center">
    <div class="col-md-8">
      <div
        class="product-detail-card-wrapper row"
        :id="props.id"
        :key="props.key"
        :class="{ taken: productIsTaken, 'prod-unavailable': !props.available }"
      >
        <div class="top row">
          <section
            class="product-detail-card-left product-detail-card-side col-6"
          >
            <div class="product-detail-card-image row">
              <div class="col-md-12">
                <img
                  :src="props.image"
                  class="img-fluid"
                  :class="{ active: !isLocationDisplayed }"
                  v-show="!isLocationDisplayed"
                />
                <div
                  class="product-detail-card-map"
                  :class="{ active: isLocationDisplayed }"
                  v-show="isLocationDisplayed"
                >
                  <Map
                    :-requested-product-coords="[
                      location.latitude,
                      location.longitude,
                    ]"
                  ></Map>
                </div>
              </div>
            </div>
          </section>
          <section
            class="product-detail-card-right product-detail-card-side col-6"
          >
            <div class="product-card-product-location row">
              <div class="location-icon col-md-12">
                <span class="location-toggle" @click="showLocation">
                  <span v-if="!isLocationDisplayed"
                    ><IconLocation /> View Location</span
                  >
                  <span v-else
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-image"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
                      />
                      <path
                        d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"
                      /></svg
                    >&nbsp;View Image</span
                  >
                </span>
              </div>
            </div>
            <div class="product-card-info row">
              <div class="col-md-12">
                <div class="product-card-product-title">
                  <h2>{{ props.title }}</h2>
                </div>
                <div class="product-card-detail-publication-details">
                  <p v-if="!loggedUserIsOwner">
                    Published by
                    <span class="publication-details-owner">
                      {{ props.owner }}</span
                    >
                    on
                    <span class="product-card-product-actual-date">{{
                      userFriendlyDate
                    }}</span
                    >.
                  </p>
                  <p v-else>
                    You published this item on
                    <span class="product-card-product-actual-date">{{
                      userFriendlyDate
                    }}</span
                    >.
                  </p>
                </div>
                <div class="product-detail-description">
                  <p>{{ props.description }}</p>
                </div>

                <div class="product-detail-availability">
                  <div v-if="loggedUserIsOwner">
                    <p>
                      You have accepted a request for this product. Please mark
                      the product as taken when you have donated it.
                    </p>
                  </div>

                  <div v-else>
                    <!--Para no dueÑos del producto, en esta sección solo hay dos casos: donado y por tanto se borrará en breve, o bien, con solicitud aceptada y no disponible pero no donado. El resto de casos, no pueden existir {ejemplo: disponible y donado al mismo tiempo}-->
                    <p v-if="!props.available && !productIsTaken">
                      This product has an accepted request and it only needs to
                      be collected. So you can't request it at the moment.
                    </p>
                    <p v-else-if="!props.available && productIsTaken">
                      This product has been donated already. It will be unlisted
                      soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="bottom">
          <section class="row">
            <div class="col-md-12 product-detail-buttons">
              <!--Si se trata del dueño del producto, se muestran botones para gestionarlo -->
              <div v-if="loggedUserIsOwner" class="product-magement-buttons">
                <BaseButton
                  v-if="props.available && !productIsTaken"
                  :to="{
                    name: 'editProduct',
                    params: {
                      id: id,
                    },
                  }"
                  link="true"
                  >Edit</BaseButton
                >
                <BaseButton v-else @click="setIsModalVisible(true)"
                  >Mark as Taken</BaseButton
                >
                <BaseButton
                  :to="{
                    name: 'productRequests',
                    params: {
                      id: id,
                    },
                  }"
                  link="true"
                  >Requests</BaseButton
                >
              </div>
              <div v-else>
                <!-- Caso uno, el producto esta donado, no se muestra nada
                <span v-if="productIsTaken"></span>-->
                <!--Caso dos, el producto no está donado y está disponible, se puede solicitar y se muestra botón -->
                <span v-if="!productIsTaken && props.available">
                  <BaseButton
                    :to="{
                      name: 'requestProduct',
                      params: {
                        id: id,
                      },
                    }"
                    link="true"
                    >Request it!</BaseButton
                  >
                </span>
                <!--Caso tres, el product no está donado y NO está disponible, no se puede solicitar. En este caso el usuario dueño debería marcarlo como tomado                <span v-else-if="!productIsTaken && !props.available"></span>-->
              </div>
            </div>
          </section>
        </div>
      </div>

      <ModalConfirmationDialog
        v-if="isModalVisible"
        @modal-confirmed="onModalConfirm"
        @modal-close="onModalClose"
      >
        <template #header>Mark Product As Taken</template>
        <template #body
          ><p>
            Are you sure you want to mark this product as taken? By doing so you
            confirm the product has been donated and it will no longer be edited
            nor listed to other users.
          </p>
          <p>This action cannot be undone.</p></template
        ></ModalConfirmationDialog
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import ModalConfirmationDialog from "../ModalConfirmationDialog.vue";
import Map from "../Map.vue";

const locationAvailable = computed(() => {
  if (props.location == null || props.location === undefined) {
    return false;
  } else {
    return true;
  }
});

const userFriendlyDate = computed(() => {
  return formatDate(props.date);
});

let isLocationDisplayed = ref(false);

const showLocation = () => {
  console.log(
    `Displaying location: ${props.location.latitude}, ${props.location.longitude}`
  );
  isLocationDisplayed.value = !isLocationDisplayed.value;
};

//Modal related
const isModalVisible = ref(false);
// Setter for isModalVisible
const setIsModalVisible = (value) => {
  isModalVisible.value = value;
};

//Aceppted properties for the card items
const props = defineProps({
  id: String,
  image: String,
  title: String,
  date: String,
  location: Object,
  owner: Number,
  description: String,
  category: Number,
  available: Boolean,
  isTaken: Boolean,
});

const store = useStore();
//methods or functionality

const productIsTaken = ref(props.isTaken);
const setProductIsTaken = (value) => {
  productIsTaken.value = value;
};

onMounted(() => {
  // Code to execute once the DOM of ChildComponent is fully loaded
  console.log("ChildComponent is fully loaded");
  console.log("VAlue of productIsTaken: " + productIsTaken.value);
});

// Watch for changes in props.isTaken
watch(
  () => props.isTaken,
  (newValue, oldValue) => {
    setProductIsTaken(newValue);
    console.log("isTaken prop changed from", oldValue, "to", newValue);
  }
);

//a product is only editable if the user is authenticated and the product owner matches the logged-in user id

const loggedUserIsOwner = computed(() => {
  if (store.state.user.id === props.owner) {
    return true;
  } else {
    return false;
  }
});

const onModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setProductIsTaken(false);
  setIsModalVisible(false);
  //setRequestAccepted(false);
};
const onModalConfirm = async () => {
  console.log("Modal closed, nothing confirmed...");

  try {
    const data = await store.dispatch("updateProductData", {
      id: props.id,
      payload: {
        is_taken: 1,
      },
    });

    console.log(data);
    //check if the product is really marked as taken
    if (data.is_taken === true) {
      setProductIsTaken(true);
      store.commit("addToast", {
        title: "Product Donated",
        type: "success",
        message: "You have correctly marked the product as donated.",
      });
    } else {
      setProductIsTaken(false);
      store.commit("addToast", {
        title: "Error",
        type: "error",
        message:
          "There was an error marking the product as taken. Please try again. If it does not work, please contact support.",
      });
    }
  } catch (error) {
    console.log(error);
    store.commit("addToast", {
      title: "Error",
      type: "error",
      message:
        "There was an error marking the product as taken. Please try again.",
    });
  }

  setIsModalVisible(false);
};

const formatDate = (dateTimeStamp) => {
  const date = new Date(dateTimeStamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.location-toggle {
  cursor: pointer;
}
/*
p {
  margin-block-start: 0;
  margin-block-end: 0;
}*/
.product-detail-card-wrapper {
  /*border: 2px solid #7ab370;*/
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
  /* max-width: 60%;
  width: auto;
  margin: 0 auto;
  display: flex;*/
}
.product-detail-card-image img {
  border-radius: 5px;
  padding: 0;
  width: 100%;
}
.product-detail-card-map,
.img-fluid {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.product-detail-card-map.active,
.img-fluid.active {
  opacity: 1;
}
.product-detail-buttons {
  display: flex;
  justify-content: flex-end;
}
.product-card-button {
}

.taken p,
.taken h2,
.taken .location-icon,
.prod-unavailable p,
.prod-unavailable h2,
.prod-unavailable .location-icon {
  color: lightgray !important;
}
.taken .product-detail-card-image img,
.taken .product-detail-card-map,
.prod-unavailable .product-detail-card-image img,
.prod-unavailable .product-detail-card-map {
  opacity: 0.5 !important;
}
.taken .product-detail-availability p,
.prod-unavailable .product-detail-availability p {
  color: rgba(0, 0, 0, 0.65) !important;
}
/*
.product-detail-card-side {
  position: relative;
  flex: 1;
}

.product-detail-card-right {
}
.product-card-detail-publication-details p {
  margin-top: 0;
}


.product-detail-card-image {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  position: relative;
}
.product-detail-card-image img {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.product-detail-description,
.product-detail-location {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.product-card-product-title h5 {
  margin: 0;
  padding: 0;
  color: #edb421;
  text-transform: uppercase;
}

.taken h5 {
  color: lightgray;
}
.product-card-product-actual-date,
.publication-details-owner,
.product-detail-location-city {
  font-weight: bold;
}
/*.product-detail-card-bottom {
  display: flex;
}
.product-card-button {
  text-align: right;
  padding-top: 1rem;
}
.product-card-button button {
  background-color: #edb421;
  color: #fff;
  border: none;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  cursor: pointer;
}*/
/*
.hidden {
  display: none;
}
*/
.product-card-info {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.product-card-product-title h2 {
  color: black;
  text-transform: capitalize;
}
.product-card-product-location {
  padding-bottom: 1rem;
}
.location-icon {
  color: #edb421;
  font-weight: bold;
  text-align: right;
}
.product-magement-buttons {
  display: flex;
  gap: 1rem;
}
.product-detail-availability {
  font-weight: bold;
}
</style>
