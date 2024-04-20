<script setup>
import { ref, reactive, toRefs, onMounted, watch, computed } from "vue";
import BaseButton from "../BaseButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const router = useRouter();

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
});

const formIsValid = ref(true);

//methods

const clearValidity = (input) => {
  console.log(`Setting valid to true: ${input}`);
  data[input].isValid = true;
};

//specific validation of each of the registration forms included
const validateForm = async () => {
  console.log("Running validation on registration form");

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

const clearForm = () => {
  console.log("Clearing form");

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
  console.log("Submitting form");
  await validateForm();

  if (!formIsValid.value) {
    return;
  }

  const formData = {
    title: data.productName.val,
    description: data.description.val,
    //tags: data.tags.val,
    category_id: data.category.val,
  };

  try {
    const responseData = await updateProduct(formData);
    console.log(responseData);
    //TO DO, show loader
    console.log("Form submitted, redirecting to userProducts");
    //TO DO show toast
    router.push({ name: "userProducts" });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data", error.response.data);
      console.error("Error status", error.response.status);
      //errorDetails.code = error.response.status;
      //errorDetails.message = error.message;
      if (error.response.data.errors) {
        let requestRecivedErrors = error.response.data.errors;
        for (const property in requestRecivedErrors) {
          //errorDetails.errors.push(requestRecivedErrors[property].toString());
          console.log(requestRecivedErrors[property].toString());
        }
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message", error.message);
      console.error("Error code", error.code);
      //errorDetails.code = error.code;
      //errorDetails.message = error.message;
    }
  }
};

/*
export default {
  // emits: ["save-data"],
};*/

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
    //console.log(resp);
    prodCategories.value = resp.data.data;
    console.log(prodCategories);
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
    console.log(`New value for ${dataProp} is ${newVal}`);
  });
};

// Update productName when the prop changes
onMounted(() => {
  watchInitialProp(initialProductName, "productName");
  watchInitialProp(initialCategory, "category");
  watchInitialProp(initialTags, "tags");
  watchInitialProp(initialDescription, "description");

  /*
  // Watch for changes in the initialProductName prop
  watch(initialProductName, (newVal) => {
    // Update the productName value in the reactive data object
    data.productName.val = newVal;
  });
  watch(initialCategory, (newVal) => {
    // Update the productName value in the reactive data object
    console.log(`newval is ${newVal}`);
    data.category.val = newVal;

    // computed property to get the category name by ID
    /* const activeCategory = computed(() => {
      const item = prodCategories.value.find(
        (item) => item.id === props.initialCategory
      );
      return item ? item.name : "Not found";
    });
  });
  watch(initialTags, (newVal) => {
    // Update the productName value in the reactive data object
    console.log(`newval is ${newVal}`);
    data.tags.val = newVal;
  });
  watch(initialDescription, (newVal) => {
    // Update the productName value in the reactive data object
    console.log(`newval is ${newVal}`);
    data.description.val = newVal;
  });*/
});

const updateProduct = async (payload) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.put(
      `${baseApiUrl}/products/${props.id}`,
      payload,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    throw error; // rethrow the error to be handled in the component
  }
};
</script>

<template>
  <div>
    <h2>Edit your Product</h2>
    <form @submit.prevent="submitForm">
      <div class="form-left-side form-side">
        <div>
          <div
            class="form-control"
            :class="{ invalid: !data.productName.isValid }"
          >
            <label for="productName">Name:</label>
            <input
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

          <div
            class="form-control"
            :class="{ invalid: !data.description.isValid }"
          >
            <label for="description">Description</label>
            <textarea
              type="text"
              id="description"
              rows="5"
              v-model.trim="data.description.val"
              @blur="clearValidity('description')"
              placeholder="Description of your product"
            ></textarea>
          </div>
          <div
            v-if="!data.description.isValid"
            class="validation-error-container"
          >
            <p>Description must not be empty.</p>
          </div>
        </div>
      </div>
      <div class="form-right-side form-side">
        <div id="image-upload">
          <img src="" class="profile-pic" />
          <div>
            <label for="profile-pic">Product image</label>
            <input
              type="file"
              id="profile-pic"
              name="profile-pic"
              accept="image/png, image/jpeg"
            />
          </div>
        </div>

        <div class="form-control" :class="{ invalid: !data.tags.isValid }">
          <label for="tags">Tags:</label>
          <input
            type="text"
            id="tags"
            v-model.trim="data.tags.val"
            @blur="clearValidity('tags')"
            placeholder="Insert the tags for your product, separate them with commmas"
          />
        </div>
        <div v-if="!data.tags.isValid" class="validation-error-container">
          <p>tags must not be empty.</p>
        </div>

        <div class="form-control" :class="{ invalid: !data.category.isValid }">
          <label for="categories">Category:</label><br />

          <select
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
            <!--</option>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>-->
          </select>
        </div>
        <div v-if="!data.category.isValid" class="validation-error-container">
          <p>Category must not be empty.</p>
        </div>

        <div class="form-submit-button">
          <!-- <BaseButton mode="outline" @click="clearForm">Clear</BaseButton>-->
          <BaseButton @submit.prevent="submitForm">Save</BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  border: #edb421 solid thin;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  background-color: #fff;
  padding: 0;
  display: flex;
  margin-top: 1rem;
}
.form-side {
  flex: 1;
  padding: 2rem;
}
.form-control {
  margin: 1.5rem 0;
}

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

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
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
