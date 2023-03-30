<template>
  <div class="request-detail-card-wrapper" :id="id">
    <section class="request-detail-card-left request-detail-card-side">
      <div class="request-detail-card-image">
        <img :src="image" />
      </div>
    </section>
    <section class="request-detail-card-right request-detail-card-side">
      <div class="request-detail-card-top">
        <div class="product-card-product-title">
          <h2>{{ title }}</h2>
        </div>
      </div>
      <div class="request-detail-card-bottom">
        <request-form :id="id" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

import BaseButton from "../BaseButton.vue";
import RequestForm from "./RequestForm.vue";

//Aceppted properties for the card items
const props = defineProps({
  image: String,
  title: String,
  id: String,
});
</script>

<style scoped>
p {
  margin-block-start: 0;
  margin-block-end: 0;
}
.request-detail-card-wrapper {
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

.request-detail-card-side {
  flex: 1;
}

.request-detail-card-right {
}
.product-card-detail-publication-details p {
  margin-top: 0;
}

.request-detail-card-image {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  position: relative;
}
.request-detail-card-image img {
  width: 100%;
  max-width: 300px;
  height: auto;
}
.request-detail-description,
.request-detail-location {
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
.request-detail-location-city {
  font-weight: bold;
}
/*.request-detail-card-bottom {
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
