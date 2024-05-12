<!--Componente para mostrar datos minimos de un producto e invitar al usuario a obtener mas informacion. Se usa una estructura de tarjeta con altura limitada en la imagen y el titulo para garantizar el mismo tamaño-->
<template>
  <div class="card product-card-wrapper" style="width: 15rem">
    <img
      :src="imagePath"
      class="card-img-top"
      :alt="title"
      style="height: 200px; width: auto"
    />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <!-- <p class="card-text">{{ description }}</p> -->
    </div>
    <div class="card-footer">
      <BaseButton :to="{ name: 'product', params: { id: id } }" link="true"
        >More info</BaseButton
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseButton from "../BaseButton.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const baseUrl = import.meta.env.VITE_BASE_URL; //ruta base para el cliente de la aplicacion
const baseImgURL = import.meta.env.VITE_BASE_IMG_URL; // ruta para las imagenes, que se hospedan en un S3 bucket de amazon

//propiedades que acepta la tarjeta
const props = defineProps({
  image: String,
  key: String,
  title: String,
  date: String,
  location: Object,
  category: Number,
  description: String,
  tags: Object,
  id: Number,
});

//methods or functionality
const imagePath = computed(() => {
  if (props.image == null || props.image === undefined) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else {
    return baseImgURL + props.image;
  }
});
</script>

<style scoped>
/* Se corta el titulo con elipsis para que evitar que haya demasiado contenido */
.card-title {
  height: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.card-img-top {
  height: 200px;
  width: auto;
  object-fit: cover;
}
.card-text {
  height: 50px;
  text-overflow: ellipsis;
  overflow-y: hidden;
  overflow-x: hidden;
  word-break: break-all;
}
.card-footer {
  background-color: #fff;
  border: none;
  text-align: end;
}
.product-card-wrapper {
  border: thin solid #fff;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
  padding: 0.25rem;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}
.product-card-wrapper:hover {
  border: thin solid lightgray;
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
