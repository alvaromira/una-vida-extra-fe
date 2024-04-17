<template>
  <div>
    <div v-if="isDataLoaded">
      <div>
        <button @click="confirmAddition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-plus-square"
            viewBox="0 0 16 16"
          >
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
            />
          </svg>
        </button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in productTags" :key="tag.id">
            <td>{{ tag.id }}</td>
            <td>{{ tag.name }}</td>
            <td>
              <button @click="confirmEdition(tag)">
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
              <button @click="confirmDeletion(tag.id)">
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
    id="delete-tag-modal"
  >
    <template #header>Confirm Tag Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this tag? The tag will be removed from
        products where it is now used.
      </p>
      <p>This action cannot be undone.</p></template
    >
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isEditModalVisible"
    @modal-confirmed="onEditModalConfirm"
    @modal-close="onEditModalClose"
    id="edit-tag-modal"
  >
    <template #header>Tag Editing</template>
    <template #body>
      <div class="container">
        <h2>Edit Tag</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- ID Field -->
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              type="number"
              class="form-control"
              id="id"
              :value="editTagFormData.id"
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
              v-model="editTagFormData.name"
            ></textarea>
          </div>
        </form></div
    ></template>
  </ModalConfirmationDialog>
  <ModalConfirmationDialog
    v-if="isCreateModalVisible"
    @modal-confirmed="onCreateModalConfirm"
    @modal-close="onCreateModalClose"
    id="create-tag-modal"
  >
    <template #header>Tag Creation</template>
    <template #body>
      <div class="container">
        <h2>Create Tag</h2>
        <form @submit.prevent="subitEditProductForm">
          <!-- Name Field -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <textarea
              class="form-control"
              id="name"
              rows="3"
              v-model="newTag"
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

const productTags = computed(() => store.state.productTags);

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

const newTag = ref();

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

const tagForDeletion = ref();
const setTagForDeletion = (value) => {
  tagForDeletion.value = value;
};
const tagForEdition = ref();
const setTagForEdition = (value) => {
  tagForEdition.value = value;
};

// Function to fetch products based on search text
const getAllTags = async () => {
  try {
    isDataLoaded.value = false;
    // Fetch all tags to store so they can be used
    await store.dispatch("getProductTags");
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
  await getAllTags();
});

// Reset tags in store to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductTags", []);
});

async function confirmDeletion(tag) {
  setTagForDeletion(tag);
  setIsCreateModalVisible(false);
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(true);
}
async function confirmAddition() {
  setIsEditModalVisible(false);
  setIsDeleteModalVisible(false);
  setIsCreateModalVisible(true);
}

async function confirmEdition(tag) {
  //feed all the tags details to the form to be opened in the modal
  for (const key in editTagFormData) {
    if (tag.hasOwnProperty(key)) {
      editTagFormData[key] = tag[key];
    }
  }
  setTagForEdition(tag);
  setIsDeleteModalVisible(false);
  setIsEditModalVisible(true);
  setIsCreateModalVisible(false);
}

async function deleteTag(tagId) {
  try {
    //Delete the product by ID
    await store.dispatch("deleteTag", tagId);

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Tag Deleted",
      type: "success",
      message: `Tag ${tagId} has been deleted. The tag list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

async function createTag(tagName) {
  try {
    //Edit the product by ID
    await store.dispatch("createTag", {
      name: tagName,
    });

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Tag Created",
      type: "success",
      message: `The tag has been created. The tag list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}
async function editTag(tag) {
  try {
    //Edit the product by ID
    await store.dispatch("updateTag", {
      id: editTagFormData.id,
      newname: editTagFormData.name,
    });

    // Dispatch toast message to Vuex store for success notification
    store.commit("addToast", {
      title: "Tag Updated",
      type: "success",
      message: `The tag has been updated. The tag list will be reloaded.`,
    });

    //reload all projects, using the first page
    //currentPage.value = 1;
    closeAllModals();
    await getAllTags();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}

const onDeleteModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setTagForDeletion(null);
  closeAllModals();
};
const onEditModalClose = async () => {
  console.log("Edit Modal closed, nothing confirmed...");
  await resetEditTagFormData();
  setTagForEdition(null);
  closeAllModals();
};
const onCreateModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  newTag.value = null;
  closeAllModals();
};

const onEditModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await editTag(tagForEdition);
  setTagForEdition(null);
  resetEditTagFormData();
};

const onCreateModalConfirm = async () => {
  console.log("Edit modal closd, cofirming something...");
  await createTag(newTag.value);
  newTag.value = null;
};

const onDeleteModalConfirm = async () => {
  console.log("Modal closed, something confirmed...");

  await deleteTag(tagForDeletion.value);
  setTagForEdition(null);
  closeAllModals();
};

const editTagFormData = {
  id: null,
  name: "",
};

const resetEditTagFormData = async () => {
  editTagFormData.id = null;
  editTagFormData.name = "";
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
