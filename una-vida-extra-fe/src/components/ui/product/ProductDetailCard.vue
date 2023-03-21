<template>
  <div class="product-detail-card-wrapper" :id="id">
    <section class="product-detail-card-left product-detail-card-side">
      <div class="product-detail-card-image">
        <img :src="image" />
        <div class="location-icon">
          <IconLocation @click="showLocation" />
          <span class="lat hidden">{{ location.lat }}</span>
          <span class="long hidden">{{ location.long }}</span>
        </div>
      </div>
    </section>
    <section class="product-detail-card-right product-detail-card-side">
      <div class="product-detail-card-top">
        <div class="product-card-product-title">
          <h2>{{ title }}</h2>
        </div>
        <div class="product-card-detail-publication-details">
          <p>
            Published by
            <span class="publication-details-owner"> {{ userId }}</span> on
            <span class="product-card-product-actual-date">{{ date }}</span
            >.
          </p>
        </div>
        <div class="product-detail-description">
          <p>{{ description }}</p>
        </div>
        <div class="product-detail-location">
          <p>
            Localidad: <span class="product-detail-location-city">Malaga</span>
          </p>
        </div>
      </div>
      <div class="product-card-button product-detail-card-bottom">
        <BaseButton
          v-if="!editable"
          :to="{ name: 'requestProduct', params: { id: id } }"
          link="true"
          >Request it!</BaseButton
        >
        <BaseButton
          v-else
          :to="{ name: 'editProduct', params: { id: id } }"
          link="true"
          >Edit</BaseButton
        >
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import IconLocation from "../../icons/iconLocation.vue";
import BaseButton from "../BaseButton.vue";

//Aceppted properties for the card items
const props = defineProps({
  image: String,
  title: String,
  description: String,
  date: String,
  location: Object,
  id: String,
  userId: Number,
  editable: Boolean,
});

//methods or functionality
const showLocation = () => {
  console.log("Displaying location");
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

.product-detail-card-side {
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

.product-card-product-title h2 {
  margin: 0;
  padding: 0;
  color: #edb421;
  text-transform: uppercase;
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
