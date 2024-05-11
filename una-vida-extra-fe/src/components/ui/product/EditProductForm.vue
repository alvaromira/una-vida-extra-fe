<script setup>
import { ref, reactive, toRefs, onMounted, watch, computed } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseSpinner from "../BaseSpinner.vue";
import { useStore } from "vuex";
import ModalConfirmationDialog from "../ModalConfirmationDialog.vue";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const baseImgURL = import.meta.env.VITE_BASE_IMG_URL; // ruta para las imagenes, que se hospedan en un S3 bucket de amazon

const router = useRouter(); // inicializacion para acceso al router
const store = useStore(); // inicializacion para acceso al state en el store de Vuex

//Variables para el componente Modal
const isDeleteModalVisible = ref(false);
// Setter for isDeleteModalVisible
const setIsDeleteModalVisible = (value) => {
  isDeleteModalVisible.value = value;
};

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
const imageURL = ref("");
const isLoading = ref(false); //variable para gestionar el estado de carga local

const apiErrorsFound = computed(() => {
  return errorDetails.message.length;
});

const props = defineProps({
  initialProductName: {
    type: String,
    required: false,
  },
  initialDescription: {
    type: String,
    required: false,
  },
  initialTags: {
    type: Array,
    required: false,
  },
  initialCategory: {
    type: Number,
    required: false,
  },
  initialImage: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
});

// Create a reactive reference to the props object
const { initialProductName } = toRefs(props);
const { initialCategory } = toRefs(props);
const { initialTags } = toRefs(props);
const { initialDescription } = toRefs(props);
const { initialImage } = toRefs(props);

//data
const data = reactive({
  productName: {
    val: props.initialProductName,
    isValid: true,
  },
  description: {
    val: props.initialDescription,
    isValid: true,
  },
  tags: {
    val: props.initialTags,
    isValid: true,
  },
  category: {
    val: props.initialCategory,
    isValid: true,
  },
  image: {
    val: props.initialImage,
    isValid: true,
    isUpdated: false, //es necesario saber si la imagen se actualiza con una nueva, o no. Si es el caso, habrá que mandar la información para subir una nueva imagen
  },
});

const formIsValid = ref(true);

//methods

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

  /*
 No se hace validacion de las etiquetas hasta que no se implemente toda la funcionalidad
  if (data.tags.val === "") {
    data.tags.isValid = false;
    formIsValid.value = false;
  }*/

  if (data.category.val === "" || data.category.val === null) {
    data.category.isValid = false;
    formIsValid.value = false;
  }
};

const submitForm = async () => {
  await validateForm();
  //Si no supera la validación no se sigue
  if (!formIsValid.value) {
    return;
  }
  // Se crea un form Data en JS para mandarlo como http request con multipart
  const formData = new FormData();
  formData.append("title", data.productName.val);
  formData.append("description", data.description.val);
  //formData.append('tags', data.tags.val);
  formData.append("category_id", data.category.val);
  //solo poner la imagen si se ha actualizado desde que se mando por ultima vez
  if (data.image.isUpdated === true) {
    formData.append("image", data.image.val);
  }
  //por las limitaciones de php y Laravel para gestionar formularios con multipart con verbos que no sean POST, se usa el campo _method para poder mandar la http request con post pero que realmente salga como put para que la acepte el endpoint de la api
  formData.append("_method", "PUT");

  try {
    isLoading.value = true;
    const responseData = await updateProduct(formData);
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

  // Update image.isUpdated if product is successfully updated
  data.image.isUpdated = false;

  // Show success toast
  store.commit("addToast", {
    title: "Product updated",
    type: "success",
    message: "You have successfully updated the product",
  });
};

// Método para gestionar la respuesta de error
const handleError = (error) => {
  // Poner isLoading a false
  isLoading.value = false;

  // Inicializa las variables errorStatus y errorMessage
  let errorStatus = null;
  let errorMessage = null;

  if (error.response) {
    // Capturar el codigo de error
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
    // Otros errores
    console.error("Error message", error.message);
    console.error("Error code", error.code);
    errorStatus = error.code;
    errorMessage = error.message;
  }

  // Construir el mensaje de error final
  const finalMessage = `The product could not be updated. Error code: ${errorStatus}. Error message: ${errorMessage}`;

  //Mostrar el toast con el error
  store.commit("addToast", {
    title: "Product Not Updated",
    type: "error",
    message: finalMessage,
  });
};

//categories
const errorDetails = reactive({
  code: "",
  message: "",
  errors: [],
});
const requestError = ref(false);
const prodCategories = ref([]);
//fetch product requests from the public api
const getProductCategories = async () => {
  try {
    const resp = await axios.get(`${baseApiUrl}/categories`);
    prodCategories.value = resp.data.data;
    requestError.value = false;
  } catch (error) {
    requestError.value = true;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
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
      // Something happened in setting up the request that triggered an Error
      console.error("Error message", error.message);
      console.error("Error code", error.code);
      errorDetails.code = error.code;
      errorDetails.message = error.message;
    }
  }
};

getProductCategories();

// Watch for changes in the initial props and update the data properties
const watchInitialProp = (initialProp, dataProp) => {
  watch(initialProp, (newVal) => {
    data[dataProp].val = newVal;
  });
};

// Update productName when the prop changes
onMounted(() => {
  watchInitialProp(initialProductName, "productName");
  watchInitialProp(initialCategory, "category");
  watchInitialProp(initialTags, "tags");
  watchInitialProp(initialDescription, "description");
  watchInitialProp(initialImage, "image");
});

const updateProduct = async (payload) => {
  try {
    //se usa post en la llamada porque con el multipart/form-data no se puede usar put, pero se pone campo _method: PUT para realmente usar el endpoint adecuado de la API
    const response = await axios.post(
      `${baseApiUrl}/products/${props.id}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error; // rethrow the error to be handled in the component
  }
};

/** Funcion para mostrar vista previa de las imagenes a subir */
const onImageChange = (e) => {
  if (e.target.files[0]) {
    data.image.val = e.target.files[0];
    imageURL.value = URL.createObjectURL(e.target.files[0]);
    data.image.isUpdated = true; //ponemos que se ha cambiado el archivo de imagen y hay que mandarlo
  }
};

const confirmDeletion = async () => {
  setIsDeleteModalVisible(true);
};

const onDeleteModalClose = () => {
  setIsDeleteModalVisible(false);
};
const onDeleteModalConfirm = async () => {
  await deleteProduct(props.id);
  setIsDeleteModalVisible(false);
};

async function deleteProduct(productId) {
  try {
    //Borrar por ID
    await store.dispatch("deleteProduct", productId);

    //Se muestra el success
    store.commit("addToast", {
      title: "Product Deleted",
      type: "success",
      message: `Product ${productId} has been deleted. You are not taken to your rest of products`,
    });
    router.push({ name: "userProducts" });
  } catch (error) {
    store.commit("addToast", {
      title: "Product Not Deleted",
      type: "error",
      message: `Your product could not be deleted. Please try again later`,
    });
  }
}
</script>

<template>
  <div class="row justify-content-md-center">
    <div class="col-md-10">
      <div class="form-wrapper">
        <form @submit.prevent="submitForm" class="rounded">
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
                <p>productName must not be empty.</p>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>

                <textarea
                  class="form-control"
                  :class="{ invalid: !data.description.isValid }"
                  id="description"
                  rows="5"
                  v-model.trim="data.description.val"
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
                  <img :src="imagePath" class="profile-pic" />
                  <div>
                    <label for="profile-pic" class="form-label"
                      >Product image</label
                    >
                    <input
                      type="file"
                      id="profile-pic"
                      name="profile-pic"
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
                  disabled
                  readonly
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
                <BaseButton @submit.prevent="submitForm">Update</BaseButton>
                <BaseButton @click.prevent="confirmDeletion()"
                  >Delete</BaseButton
                >
              </div>
            </div>
          </div>

          <div class="request-status row">
            <div class="loading col text-center" v-show="isLoading">
              <base-spinner></base-spinner>
            </div>
            <transition name="request-errors">
              <div class="request-errors col" v-show="requestError">
                <p>
                  There was an error when trying to perform the registration.
                  Please try again.
                </p>
                <div v-if="apiErrorsFound">
                  <p>Details:</p>
                  <ul v-if="apiErrorsCaptured">
                    <li v-for="e in errorDetails.errors">{{ e }}</li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </form>
      </div>
    </div>
  </div>
  <ModalConfirmationDialog
    v-if="isDeleteModalVisible"
    @modal-confirmed="onDeleteModalConfirm"
    @modal-close="onDeleteModalClose"
    id="delete-user-modal"
  >
    <template #header>Confirm Product Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this product? The product will no longer
        be listed or visible to anybody. Any requests it may have will be
        deleted as well.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
</template>

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
/*form {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
   padding: 0;
  display: flex;
  margin-top: 1rem;
}*/
/*.form-side {
  flex: 1;
  padding: 2rem;
}
.form-control {
  margin: 1.5rem 0;
}*/

.profile-pic {
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
/*.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}*/
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
