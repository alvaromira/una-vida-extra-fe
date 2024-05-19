<!--Tarjeta para mostrar la imagen y el titulo del producto e incluir el formulario de solicitud. Layout a dos columnas con el formulario como componente en la derecha-->
<template>
  <div class="row justify-content-md-center">
    <div class="col-md-8">
      <div class="request-detail-card-wrapper row" :id="id">
        <section
          class="request-detail-card-left request-detail-card-side col-md-6"
        >
          <div class="request-detail-card-image">
            <img :src="image" />
          </div>
        </section>
        <section
          class="request-detail-card-right request-detail-card-side col-md-6"
        >
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
    </div>
  </div>
</template>

<script setup>
import RequestForm from "./RequestForm.vue";

//Propiedades aceptadas por el componente
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
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
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
  padding-bottom: 1rem;
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

.hidden {
  display: none;
}
</style>
