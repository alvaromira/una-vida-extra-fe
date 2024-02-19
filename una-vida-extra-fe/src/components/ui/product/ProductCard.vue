<template>
  <div class="product-card-wrapper" :id="id">
    <section class="product-top">
      <div class="product-card-image">
        <img :src="imagePath" />
      </div>
      <div class="location-icon" v-if="locationAvailable">
        <IconLocation @click="showLocation" />
        <span class="lat hidden">{{ location.latitude }}</span>
        <span class="long hidden">{{ location.longitude }}</span>
      </div>
    </section>
    <section class="product-bottom">
      <div class="product-card-product-title">
        <h3>{{ title }}</h3>
      </div>
      <div class="product-card-product-date">
        <span>Publication date: </span
        ><span class="product-card-product-actual-date">{{ date }}</span>
      </div>
      <div class="product-card-button">
        <BaseButton :to="{ name: 'product', params: { id: id } }" link="true"
          >More info</BaseButton
        >
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import BaseButton from "../BaseButton.vue";

//Aceppted properties for the card items
const props = defineProps({
  image: String,
  key: String,
  title: String,
  date: String,
  location: Object,
  category: String,
  description: String,
  tags: Object,
  id: Number,
});

//methods or functionality

const imagePath = computed(() => {
  if (props.image == null || props.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return "http://127.0.0.1:8000/storage/" + props.image;
  }
});

const locationAvailable = computed(() => {
  if (props.location == null || props.location === undefined) {
    return false;
  } else {
    return true;
  }
});

const moreInfo = () => {
  console.log("You just clicked on the product card");
};

const showLocation = () => {
  console.log("Displaying location");
};
</script>

<style scoped>
.product-card-wrapper {
  border: 2px solid #7ab370;
  border-radius: 2px;
  max-width: 250px;
  width: 100%;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
}
.product-top {
  text-align: center;
}
.product-card-image img {
  margin-right: auto;
  margin-left: auto;
  max-width: 100%;
  height: auto;
}
.product-bottom {
  padding-top: 0.5rem;
}
.product-card-product-title h3 {
  margin: 0;
  padding: 0;
  color: #edb421;
  text-transform: uppercase;
}
.product-card-product-actual-date {
  font-weight: bold;
}
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
.product-top {
  position: relative;
}
.location-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
