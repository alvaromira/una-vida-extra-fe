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
    </section>
    <section class="product-detail-card-right product-detail-card-side">
      <div class="product-detail-card-top">
        <div class="product-card-product-title">
          <h2>{{ props.title }}</h2>
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
          v-if="!props.available && !takenProduct && productIsTaken"
        >
          You have accepted a request for this product. Please mark the product
          as taken when you have donated it.
        </div>
      </div>
      <div
        v-if="!takenProduct"
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
            v-if="props.available && !takenProduct"
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
import { defineProps, ref, computed, onMounted } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import BaseButton from "../BaseButton.vue";
import { useStore } from "vuex";
import ModalConfirmationDialog from "../ModalConfirmationDialog.vue";

//Modal related
const isModalVisible = ref(false);
// Setter for isModalVisible
const setIsModalVisible = (value) => {
  isModalVisible.value = value;
};

//Aceppted properties for the card items
const props = defineProps({
  id: String,
  key: String,
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

const productIsTaken = ref(false);
const setProductIsTaken = (value) => {
  productIsTaken.value = value;
};

//Use the props to set the product as taken appropriately
setProductIsTaken(props.isTaken);

//a product is only editable if the user is authenticated and the product owner matches the logged-in user id

const loggedUserIsOwner = computed(() => {
  if (store.state.user.id === props.owner) {
    return true;
  } else {
    return false;
  }
});
const takenProduct = computed(() => {
  return props.isTaken;
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

.product-card-product-title h2 {
  margin: 0;
  padding: 0;
  color: #edb421;
  text-transform: uppercase;
}

.taken h2 {
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
  top: 0.5rem;
  left: 0.5rem;
}
</style>
