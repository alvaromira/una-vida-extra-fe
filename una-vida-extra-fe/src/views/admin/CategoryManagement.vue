<template>
  <div>
    <div v-if="isDataLoaded">
      <div id="new-category-container">
        <BaseButton @click="confirmAddition">Create new category</BaseButton>
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in productCategories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
              <button @click="confirmEdition(category)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                  />
                </svg>
              </button>
            </td>
            <td>
              <button @click="confirmDeletion(category.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="loading">
      <base-spinner></base-spinner>
    </div>
  </div>
  <ModalConfirmationDialog
    v-if="isDeleteModalVisible"
    @modal-confirmed="onDeleteModalConfirm"
    @modal-close="onDeleteModalClose"
    id="delete-category-modal"
  >
    <template #header>Confirm Category Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this category? The category will be
        removed from products where it is now used.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-category-modal"
  >
    <template #header>Category Editing</template>
    <template #body>
      <div class="container">
        <h2>Edit Category</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editCategoryFormData.id"
              readonly
              disabled
            />
          </div>

          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="editCategoryFormData.name"
            ></textarea>
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isCreateModalVisible"
    @modal-confirmed="onCreateModalConfirm"
    @modal-close="onCreateModalClose"
    id="create-category-modal"
  >
    <template #header>Category Creation</template>
    <template #body>
      <div class="container">
        <h2>Create Category</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="newCategory"
            ></textarea>
          </div>
        </form></div
    ></template>
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

const isCreateModalVisible = ref(false);
const setIsCreateModalVisible = (value) => {
  isCreateModalVisible.value = value;
};

const newCategory = ref();

const closeAllModals = () => {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(false);
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
      setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isDeleteModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsCreateModalVisible(false);
    }
  }
);
watch(
  () => isCreateModalVisible.value,
  (newValue, oldValue) => {
    console.log("isDeleteModalVisible changed from", oldValue, "to", newValue);
    if ((newValue = true)) {
      setIsEditModalVisible(false);
      setIsDeleteModalVisible(false);
    }
  }
);

const categoryForDeletion = ref();
const setCategoryForDeletion = (value) => {
  categoryForDeletion.value = value;
};
const categoryForEdition = ref();
const setCategoryForEdition = (value) => {
  categoryForEdition.value = value;
};

// Function to fetch all categories
const getAllCategories = async () => {
  try {
    isDataLoaded.value = false;
    // Fetch all categories to store so they can be used
    await store.dispatch("getProductCategories");
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

// Fetch all tags on component mount
onMounted(async () => {
  await getAllCategories();
});

// Reset tags in store to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductCategories", []);
});

async function confirmDeletion(category) {
  setCategoryForDeletion(category);
  setIsCreateModalVisible(false);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
async function confirmAddition() {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(true);
}

async function confirmEdition(category) {
  //feed all the categoriy details to the form to be opened in the modal
  for (const key in editCategoryFormData) {
    if (category.hasOwnProperty(key)) {
      editCategoryFormData[key] = category[key];
    }
  }
  setCategoryForEdition(category);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
  setIsCreateModalVisible(false);
}

async function deleteCategory(categoryId) {
  try {
    //Delete the product by ID
    await store.dispatch("deleteCategory", categoryId);

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Category Deleted",
      type: "success",
      message: `Category ${categoryId} has been deleted. The list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

async function createCategory(categoryName) {
  try {
    //Edit the product by ID
    await store.dispatch("createCategory", {
      name: categoryName,
    });

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Category Created",
      type: "success",
      message: `The category has been created. The list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}
async function editCategory(category) {
  try {
    //Edit the product by ID
    await store.dispatch("updateCategory", {
      id: editCategoryFormData.id,
      newname: editCategoryFormData.name,
    });

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Category Updated",
      type: "success",
      message: `The category has been updated. The list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllCategories();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

const onDeleteModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setCategoryForDeletion(null);
  closeAllModals();
};
const onEditModalClose = async () => {
  console.log("Edit Modal closed, nothing confirmed...");
  await reseteditCategoryFormData();
  setCategoryForEdition(null);
  closeAllModals();
};
const onCreateModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  newCategory.value = null;
  closeAllModals();
};

const onEditModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await editCategory(categoryForEdition);
  setCategoryForEdition(null);
  reseteditCategoryFormData();
};

const onCreateModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await createCategory(newCategory.value);
  newCategory.value = null;
};

const onDeleteModalConfirm = async () => {
  console.log("Modal closed, something confirmed...");

  await deleteCategory(categoryForDeletion.value);
  setCategoryForEdition(null);
  closeAllModals();
};

const editCategoryFormData = {
  id: null,
  name: "",
};

const reseteditCategoryFormData = async () => {
  editCategoryFormData.id = null;
  editCategoryFormData.name = "";
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
#new-category-container {
  text-align: right;
  padding-bottom: 2rem;
}
</style>
