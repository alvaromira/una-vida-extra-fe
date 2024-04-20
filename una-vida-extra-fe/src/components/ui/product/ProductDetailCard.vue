<template>
  <div
    class="product-detail-card-wrapper"
    :id="props.id"
    :key="props.key"
    :class="{ taken: productIsTaken }"
  >
    <section class="product-detail-card-left product-detail-card-side">
      <div class="product-detail-card-image">
        <img :src="props.image" />
      </div>
      <div class="product-detail-card-map" v-show="isLocationDisplayed">
        <Map
          :-user-coords="[location.latitude, location.longitude]"
          :-requested-product-coords="[location.latitude, location.longitude]"
        ></Map>
      </div>
    </section>
    <section class="product-detail-card-right product-detail-card-side">
      <div class="location-icon">
        <IconLocation @click="showLocation" />
        <span class="lat hidden">{{ location.latitude }}</span>
        <span class="long hidden">{{ location.longitude }}</span>
      </div>
      <div class="product-detail-card-top">
        <div class="product-card-product-title">
          <h5>{{ props.title }}</h5>
        </div>
        <div class="product-card-detail-publication-details">
          <p v-if="!loggedUserIsOwner">
            Published by
            <span class="publication-details-owner"> {{ props.owner }}</span>
            on
            <span class="product-card-product-actual-date">{{
              props.date
            }}</span
            >.
          </p>
          <p v-else>
            You published this item on
            <span class="product-card-product-actual-date">{{
              props.date
            }}</span
            >.
          </p>
        </div>
        <div class="product-detail-description">
          <p>{{ props.description }}</p>
        </div>

        <div
          class="product-detail-availability"
          v-if="!props.available && !productIsTaken"
        >
          You have accepted a request for this product. Please mark the product
          as taken when you have donated it.
        </div>
      </div>
      <div
        v-if="!productIsTaken"
        class="product-card-button product-detail-card-bottom"
      >
        <BaseButton
          v-if="!loggedUserIsOwner"
          :to="{
            name: 'requestProduct',
            params: {
              id: id,
              //state: { title: props.title, image: props.image },
            },
          }"
          link="true"
          >Request it!</BaseButton
        >
        <div v-else>
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
                // state: { title: props.title, image: props.image },
              },
            }"
            link="true"
            >Check Requests</BaseButton
          >
        </div>
      </div>
      <div v-else>This product has already been donated.</div>
    </section>
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
        confirm the product has been donated and it will no longer be edited nor
        listed to other users.
      </p>
      <p>This action cannot be undone.</p></template
    ></ModalConfirmationDialog
  >
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
</script>

<style scoped>
p {
  margin-block-start: 0;
  margin-block-end: 0;
}
.product-detail-card-wrapper {
  border: 2px solid #7ab370;
  border-radius: 2px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
  max-width: 60%;
  width: auto;
  margin: 0 auto;
  display: flex;
}
.product-detail-card-wrapper.taken {
  border: 2px solid lightgray;
}

.product-detail-card-side {
  position: relative;
  flex: 1;
}

.product-detail-card-right {
}
.product-card-detail-publication-details p {
  margin-top: 0;
}
.taken p {
  color: lightgray;
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
.taken .product-detail-card-image img {
  opacity: 0.5;
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
}*/
.product-card-button {
  text-align: right;
  padding-top: 1rem;
}
/*.product-card-button button {
  background-color: #edb421;
  color: #fff;
  border: none;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  cursor: pointer;
}*/
.hidden {
  display: none;
}

.location-icon {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
}
</style>
