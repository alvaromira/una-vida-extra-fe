<template>
  <div>
    <div v-if="isDataLoaded">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Image</th>
            <th scope="col">Description</th>
            <th scope="col">Title</th>
            <th scope="col">Availability</th>
            <th scope="col">Taken</th>
            <th scope="col">Category</th>
            <th scope="col">Creation</th>
            <th scope="col">Owner id</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productResults.data" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <img
                class="mini"
                :src="`http://127.0.0.1:8000/storage/` + product.image"
                :alt="product.title"
              />
            </td>
            <td>{{ product.description }}</td>
            <td>{{ product.title }}</td>
            <td>{{ product.available }}</td>
            <td>{{ product.is_taken }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.created_at }}</td>
            <td>{{ product.owner_id }}</td>
            <td>
              <button @click="confirmEdition(product)">Edit</button>
            </td>
            <td>
              <button @click="confirmDeletion(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!--<section class="product-card-container">
        <div v-for="product in productResults.data">
          <product-card
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :date="product.created_at"
            :location="product.location"
          />
        </div>
      </section>-->
      <!-- Pagination controls -->
      <div class="pagination-controls">
        <BaseButton @click="loadPreviousPage" :disabled="currentPage === 1">
          Previous
        </BaseButton>
        <span class="pagination-information"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <BaseButton
          @click="loadNextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </BaseButton>
      </div>
    </div>

    <div v-else class="loading">
      <base-spinner></base-spinner>
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
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-user-modal"
  >
    <template #header>Product Editing</template>
    <template #body>
      <div class="container">
        <h2>Edit Product</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editProductFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Image Field -->
          <div class="mb-3">
            <!--<label for="image" class="form-label">Image</label>
            <input type="file" class="form-control" id="image" />-->
            <img
              class="mini"
              :src="
                `http://127.0.0.1:8000/storage/` + editProductFormData.image
              "
              :alt="editProductFormData.title"
            /><span>(not editable)</span>
          </div>

          <!-- Description Field -->
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              class="form-control"
              id="description"
              rows="3"
              v-model="editProductFormData.description"
            ></textarea>
          </div>

          <!-- Title Field -->
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="editProductFormData.title"
            />
          </div>

          <!-- Availability Field -->
          <div class="mb-3">
            <label for="availability" class="form-label">Is available?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="availability"
              v-model="editProductFormData.available"
            />
          </div>

          <!-- Taken Field -->
          <div class="mb-3">
            <label for="taken" class="form-label">Is donated already?</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="taken"
              v-model="editProductFormData.is_taken"
            />
          </div>

          <!-- Category Field -->
          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select
              class="form-select"
              id="category"
              v-model="editProductFormData.category"
            >
              <option value="">Select a category...</option>
              <option
                v-for="category in productCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Created At Field -->
          <div class="mb-3">
            <label for="created_at" class="form-label">Created At</label>
            <input
              type="datetime-local"
              class="form-control"
              id="created_at"
              :value="editProductFormData.created_at"
              readonly
              disabled
            />
          </div>

          <!-- Owner Field -->
          <div class="mb-3">
            <label for="owner-id" class="form-label">Owner</label>
            <input
              type="number"
              class="form-control"
              id="owner-id"
              v-model="editProductFormData.owner_id"
            />
          </div>

          <!--<button type="submit" class="btn btn-primary">Submit</button>-->
        </form>
      </div></template
    >
  </ModalConfirmationDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import ModalConfirmationDialog from "../../components/ui/ModalConfirmationDialog.vue";
// Access current route
const route = useRoute();
// Access Vuex store
const store = useStore();

// Computed property to access product results state from the store
const productResults = computed(() => store.state.productResults);
const productTags = computed(() => store.state.productTags);
const productCategories = computed(() => store.state.productCategories);
// Reference to track if data is loaded
const isDataLoaded = ref(false);

//Modal related
const isDeleteModalVisible = ref(false);
// Setter for isDeleteModalVisible
const setIsDeleteModalVisible = (value) => {
  isDeleteModalVisible.value = value;
};

//Modal related
const isEditModalVisible = ref(false);
// Setter for isEditModalVisible
const setIsEditModalVisible = (value) => {
  isEditModalVisible.value = value;
};

const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
};

// Watch to be used as safeguard to make sure both modals can never be visible at the same time
watch(
  () => isEditModalVisible.value,
  (newValue, oldValue) => {
    console.log(
      "isEditModalVisible prop changed from",
      oldValue,
      "to",
      newValue
    );
    if ((newValue = true)) {
      setIsDeleteModalVisible(false);
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
    }
  }
);

const productForDeletion = ref();
const setproductForDeletion = (value) => {
  productForDeletion.value = value;
};
const productForEdition = ref();
const setProductForEdition = (value) => {
  productForEdition.value = value;
};

// Pagination variables
const currentPage = ref(1);
const pageSize = 10; // Number of products per page
const totalPages = computed(() => productResults.value.meta.last_page);

// Load products for the current page
const loadProducts = async () => {
  await getProductRequests(currentPage.value);
};

// Event handler to load the previous page of products
const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadProducts();
  }
};

// Event handler to load the next page of products
const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadProducts();
  }
};

// Function to fetch products based on search text
const getProductRequests = async (page) => {
  try {
    isDataLoaded.value = false;
    // Fetch products or perform product search depending on route params

    await store.dispatch("getProducts", page);

    // Set data loaded to true once data is fetched
    isDataLoaded.value = true;
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
};

// Function to handle request errors
const handleRequestError = (error) => {
  console.error(error);
  isDataLoaded.value = true;
  const errorMessage = error.response
    ? `There was an error while processing the requests. (Code: ${error.response.status})`
    : `There was an error while processing the requests. (Code: ${error.code})`;

  // Dispatch toast message to Vuex store for error notification
  store.commit("addToast", {
    title: "Error Processing Requests",
    type: "error",
    message: errorMessage,
  });
};

// Fetch products on component mount
onMounted(async () => {
  //get tags and categories
  await store.dispatch("getProductTags");
  await store.dispatch("getProductCategories");
  //and then the products
  await getProductRequests(currentPage);
});

// Reset productResults to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductResults", []);
});

async function confirmDeletion(productId) {
  setproductForDeletion(productId);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
async function confirmEdition(prod) {
  //feed all the product details to the form to be opened in the modal

  //cast potential booleans to integers
  const castedObject = {
    ...prod,
    available: prod.available ? 1 : 0,
    is_taken: prod.is_taken ? 1 : 0,
  };

  for (const key in editProductFormData) {
    if (castedObject.hasOwnProperty(key)) {
      editProductFormData[key] = castedObject[key];
    }
  }

  setProductForEdition(castedObject);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
}

async function deleteProduct(productId) {
  try {
    //Delete the product by ID
    await store.dispatch("deleteProduct", productId);

    //let message = `Product ${productId} has been deleted`;
    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Product Deleted",
      type: "success",
      message: `Product ${productId} has been deleted. The product list will be reloaded.`,
    });

    //reload all projects, using the first page
    currentPage.value = 1;
    closeAllModals();
    await loadProducts();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}
async function editProduct(productId) {
  try {
    //Edit the product by ID
    await store.dispatch("updateProductData", {
      id: editProductFormData.id,
      payload: editProductFormData,
    });

    //let message = `Product ${productId} has been deleted`;
    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Product Updated",
      type: "success",
      message: `Product ${productId} has been updated. The product list will be reloaded.`,
    });

    //reload all projects, using the first page
    currentPage.value = 1;
    closeAllModals();
    await loadProducts();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

const onDeleteModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setproductForDeletion(null);
  closeAllModals();
};
const onEditModalClose = async () => {
  console.log("Edit Modal closed, nothing confirmed...");
  await resetEditProductFormData();
  setProductForEdition(null);
  closeAllModals();
};

const onEditModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await editProduct(productForEdition);
  setProductForEdition(null);
  resetEditProductFormData();
};

const onDeleteModalConfirm = async () => {
  console.log("Modal closed, something confirmed...");

  await deleteProduct(productForDeletion.value);
  setProductForEdition(null);
  closeAllModals();
};

const editProductFormData = {
  id: null,
  image: null,
  description: "",
  title: "",
  available: null,
  is_taken: null,
  category: "",
  created_at: "",
  owner_id: null,
};

const resetEditProductFormData = async () => {
  editProductFormData.id = null;
  editProductFormData.image = null;
  editProductFormData.description = "";
  editProductFormData.title = "";
  editProductFormData.available = null;
  editProductFormData.is_taken = null;
  editProductFormData.category = "";
  editProductFormData.created_at = "";
  editProductFormData.owner_id = null;
};

const subitEditProductForm = () => {
  // Submit form logic goes here
  console.log(editProductFormData);
};
</script>
<style scoped>
.pagination-controls {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}
.pagination-information {
  padding-left: 1rem;
  padding-right: 1rem;
}
.product-card-container {
  display: flex;

  align-items: flex-start;
  flex-flow: row wrap;
  /* Then we define how is distributed the remaining space */
  justify-content: center;
  gap: 3rem;
}

h2 {
  text-transform: uppercase;
  text-align: center;
  color: #7ab370;
  padding: 1rem 1rem 1.5rem 1rem;
}
img.mini {
  width: 50px;
  height: auto;
}
</style>
