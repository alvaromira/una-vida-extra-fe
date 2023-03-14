<template>
  <div class="product-card-wrapper" :id="id">
    <section class="product-top">
      <div class="product-card-image">
        <img :src="image" />
      </div>
      <div class="location-icon">
        <IconLocation @click="showLocation" />
        <span class="lat hidden">{{ location.lat }}</span>
        <span class="long hidden">{{ location.long }}</span>
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
        <BaseButton @click="moreInfo">More info</BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import BaseButton from "../BaseButton.vue";

//Aceppted properties for the card items
const props = defineProps({
  image: String,
  title: String,
  date: String,
  location: Object,
  id: String,
});

//methods or functionality

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
