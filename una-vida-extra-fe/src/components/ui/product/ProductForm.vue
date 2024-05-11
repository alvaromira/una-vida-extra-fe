<!--Componente para la creacion de productos. Se usa un formulario de Bootstrap con validaciones sencillas en el propio formulario y depues en la llamada a la API-->
<template>
  <div class="row justify-content-md-center">
    <div class="col-md-10">
      <div class="form-wrapper">
        <form @submit.prevent="submitForm" class="rounded row">
          <div class="row edit-card-top">
            <div class="form-left-side form-side col-md-6">
              <div class="mb-3">
                <label for="productName" class="form-label">Name</label>
                <input
                  :class="{ invalid: !data.productName.isValid }"
                  class="form-control"
                  type="text"
                  id="productName"
                  v-model.trim="data.productName.val"
                  @blur="clearValidity('productName')"
                  placeholder="Name of your product"
                />
              </div>
              <div
                v-if="!data.productName.isValid"
                class="validation-error-container"
              >
                <p>The name must not be empty.</p>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>

                <textarea
                  class="form-control"
                  :class="{ invalid: !data.description.isValid }"
                  id="description"
                  rows="5"
                  v-model.trim="data.description.val"
                  placeholder="Description of your product"
                  @blur="clearValidity('description')"
                ></textarea>
              </div>
              <div
                v-if="!data.description.isValid"
                class="validation-error-container"
              >
                <p>Description must not be empty.</p>
              </div>
            </div>
            <div class="form-right-side form-side col-md-6">
              <div class="form-field row">
                <div id="image-upload">
                  <img :src="imagePath" class="product-image" />
                  <div>
                    <label for="product-image" class="form-label"
                      >Product image</label
                    >
                    <input
                      type="file"
                      id="product-image"
                      name="product-image"
                      accept="image/png, image/jpeg"
                      v-on:change="onImageChange"
                      enctype="multipart/form-data"
                    />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="tags" class="form-label">Tags:</label>

                <input
                  class="form-control"
                  type="text"
                  id="tags"
                  v-model.trim="data.tags.val"
                  placeholder="Insert the tags for your product, separate them with commmas"
                />
                <div id="emailHelp" class="form-text">
                  Tag editing is not available at the moment.
                </div>
              </div>
              <div v-if="!data.tags.isValid" class="validation-error-container">
                <p>tags must not be empty.</p>
              </div>

              <div class="form-field row">
                <div class="mb-3">
                  <label for="category" class="form-label">Category:</label>
                  <select
                    class="form-select"
                    aria-label="Select category"
                    name="categories"
                    id="category"
                    @blur="clearValidity('category')"
                    v-model="data.category.val"
                  >
                    <option
                      v-for="category in prodCategories"
                      :key="category.id"
                      :id="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div
                v-if="!data.category.isValid"
                class="validation-error-container"
              >
                <p>Category must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row edit-card-bottom">
            <div class="col">
              <div class="form-submit-button">
                <BaseButton @submit.prevent="submitForm">Add</BaseButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "vuex";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend

const router = useRouter();
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
//data
//Datos vinculados al formulario para irlos actualizando automáticamente (tienen un v-model)
const data = reactive({
  productName: {
    val: "",
    isValid: true,
  },
  description: {
    val: "",
    isValid: true,
  },
  tags: {
    val: "",
    isValid: true,
  },
  category: {
    val: null,
    isValid: true,
  },
  image: {
    val: null,
    isValid: true,
  },
});

//Se lee el estado para tomar los datos de ID del usuario y se usan
const loggedInUser = ref(store.state.user.id);
onMounted(() => {
  loggedInUser.value = store.state.user.id;
});
const formIsValid = ref(true);
const imageURL = ref();

//Funcion para volver a poner un campo del formulario como valido
const clearValidity = (input) => {
  data[input].isValid = true;
};

//validación específica de cada uno de los campos del formulario
const validateForm = async () => {
  formIsValid.value = true;

  if (data.productName.val === "") {
    data.productName.isValid = false;
    formIsValid.value = false;
  }

  if (data.description.val === "") {
    data.description.isValid = false;
    formIsValid.value = false;
  }

  if (data.tags.val === "") {
    data.tags.isValid = false;
    formIsValid.value = false;
  }

  if (data.category.val === "" || data.category.val === null) {
    data.category.isValid = false;
    formIsValid.value = false;
  }
};

//Funcion para resetar el formulario y opner todo a OK de entrada
const clearForm = () => {
  data.productName.val === "";
  data.productName.isValid = true;

  data.description.val === "";
  data.description.isValid = true;

  data.tags.val === "";
  data.tags.isValid = false;

  data.category.val === "";
  data.category.isValid = true;

  formIsValid.value = true;
};

const submitForm = async () => {
  await validateForm();
  if (!formIsValid.value) {
    return;
  }

  //Se usa un formData para mandar los datos del formulario. Hay campos que no se cogen del formulario sino que se generan con datos de la sesión actual
  const formData = new FormData();
  formData.append("image", data.image.val);
  formData.append("title", data.productName.val);
  formData.append("description", data.description.val);
  //formData.append('tags', data.tags.val);
  formData.append("category_id", data.category.val);
  formData.append("user_id", loggedInUser.value);
  formData.append("available", 1);
  formData.append("is_taken", 0);
  formData.append("end_date", "2024-12-08 16:12:49");

  try {
    isLoading.value = true;
    const responseData = await createProduct(formData);
    handleSuccess();
  } catch (error) {
    handleError(error);
  } finally {
    // Al terminar, poner la carga a falso
    isLoading.value = false;
  }
};

// Método para manejar la respuesta correcta de la API
const handleSuccess = () => {
  // Poner isLoading a false
  isLoading.value = false;

  // Actualiza image.isUpdated si el producto se actualiza correctamente
  data.image.isUpdated = false;

  store.commit("addToast", {
    title: "Product added",
    type: "success",
    message: "You have successfully added a new product",
  });

  router.push({ name: "userProducts" });
};

// Método para gestionar la respuesta de error
const handleError = (error) => {
  // Poner isLoading a false
  isLoading.value = false;

  // Inicializa las variables errorStatus y errorMessage
  let errorStatus = null;
  let errorMessage = null;

  if (error.response) {
    // capturar el codigo de error
    errorStatus = error.response.status;
    console.error("Error status", error.response.status);

    // Extraer mensaje de error, solo el primero, de forma que si hay varios se solucinan uno a uno.
    const errors = error.response.data.errors;
    if (errors && Object.keys(errors).length > 0) {
      const firstChildKey = Object.keys(errors)[0];
      const firstChildErrors = errors[firstChildKey];
      if (Array.isArray(firstChildErrors) && firstChildErrors.length > 0) {
        errorMessage = firstChildErrors[0];
      }
    }
  } else {
    // OTros errores
    console.error("Error message", error.message);
    console.error("Error code", error.code);
    errorStatus = error.code;
    errorMessage = error.message;
  }

  // Mensaje de erorr final
  const finalMessage = `The product could not be created. Error code: ${errorStatus}. Error message: ${errorMessage}`;

  // Toast de error
  store.commit("addToast", {
    title: "Product Not Created",
    type: "error",
    message: finalMessage,
  });
};

const createProduct = async (payload) => {
  try {
    const response = await axios.post(`${baseApiUrl}/products`, payload, {
      headers: {
        "Content-Type": "multipart/form-data", //Muy importante: para poder enviar la imagen en binario al backend
      },
    });
    return response.data;
  } catch (error) {
    throw error; // vuelve a lanzar el error que se manejará en el componente
  }
};
const requestError = ref(false);
const prodCategories = ref([]);
//pillar product requests de la api
const getProductCategories = async () => {
  try {
    const resp = await axios.get(`${baseApiUrl}/categories`);

    prodCategories.value = resp.data.data;
    console.log(prodCategories);
    requestError.value = false;
  } catch (error) {
    requestError.value = true;

    if (error.response) {
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
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error("Error message", error.message);
      console.error("Error code", error.code);
      errorDetails.code = error.code;
      errorDetails.message = error.message;
    }
  }
};

//Al cargarse el componente, gestionar categorías para mostrar las adecuadas
getProductCategories();

const imagePath = computed(() => {
  if (
    data.image.val == null ||
    (data.image.val === undefined && imageURL.value === "")
  ) {
    return "https://via.placeholder.com/250x250/cccccc/969696";
  } else if (imageURL.value !== "") {
    return imageURL.value;
  } else {
    return baseImgURL + data.image.val;
  }
});
const isLoading = ref(false); //variable para gestionar el estado de carga local

/** Funcion para mostrar vista previa de las imagenes a subir */
const onImageChange = (e) => {
  if (e.target.files[0]) {
    data.image.val = e.target.files[0];
    imageURL.value = URL.createObjectURL(e.target.files[0]);
  }
};
</script>

<style scoped>
.edit-card-bottom {
  padding-top: 1rem;
}
.form-submit-button {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.form-wrapper {
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
}

.product-image {
  background-color: gray;
  width: 125px;
  height: 125px;

  margin-right: 1rem;
  margin-bottom: 1rem;
}
#image-upload input {
  margin: 0;
  border: none;
  box-shadow: none;
}

label {
  font-weight: bold;
  display: block;
  /*margin-bottom: 0.5rem;*/
  color: #edb421;
}

input[type="checkbox"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;

  color: gray;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type="checkbox"] {
  display: inline;
  width: auto;
  border: none;
  box-shadow: none;
}

input[type="checkbox"]:focus {
  outline: #3d008d solid 1px;
}

.validation-error-container p {
  color: rgb(110 105 105);
  background-color: rgba(237, 219, 219, 0.5);
  border: red solid 2px;
  border-radius: 3px;
  padding: 0.5rem;
  position: relative;
}
.validation-error-container p:before {
  content: "";
  display: block;
  position: absolute;
  left: 25%;
  top: -10px;
  border-bottom: 10px solid red;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
#image-upload {
  display: flex;
}

.note {
  color: rgb(139, 138, 138);
}

.form-submit-button {
  text-align: right;
}
select#category {
  border: thin solid #edb421;
  border-radius: 3px;
  font: inherit;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  color: gray;
}
</style>
