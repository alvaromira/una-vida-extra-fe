<template>
  <div>
    <h2>Products</h2>
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
            <th scope="col">Owner</th>
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
            <td><button @click="editProduct(product.id)">Edit</button></td>
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
    v-if="isModalVisible"
    @modal-confirmed="onModalConfirm"
    @modal-close="onModalClose"
  >
    <template #header>Confirm Product Deletion</template>
    <template #body
      ><p>
        Are you sure you want to delete this product? The product will no longer
        be listed or visible to anybody. Any requests it may have will be
        deleted as well.
      </p>
      <p>This action cannot be undone.</p></template
    ></ModalConfirmationDialog
  >
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
// Computed property to check if there's a registration redirection query parameter
const registrationRedirection = computed(() => {
  return route.query.registration === "success";
});
// Computed property to access product results state from the store
const productResults = computed(() => store.state.productResults);
// Reference to track if data is loaded
const isDataLoaded = ref(false);

//Modal related
const isModalVisible = ref(false);
// Setter for isModalVisible
const setIsModalVisible = (value) => {
  isModalVisible.value = value;
};

const productForDeletion = ref();
const setproductForDeletion = (value) => {
  productForDeletion.value = value;
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
  await getProductRequests(currentPage);
});

// Reset productResults to an empty array on component unmount
onUnmounted(() => {
  store.commit("setProductResults", []);
});

async function confirmDeletion(productId) {
  setproductForDeletion(productId);
  setIsModalVisible(true);
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
    await loadProducts();
  } catch (error) {
    isDataLoaded.value = true; // Set data loaded to true once data is fetched
    // Handle request error
    handleRequestError(error);
  }
}
async function editProduct(productId) {
  try {
    console.log("Editing product");
    /*  const response = await fetch(`http://your-api-endpoint/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.statusText}`);
    }

    const deletedProduct = await response.json();
    products.value = products.value.filter(
      (product) => product.id !== productId
    );
*/
    // Display success message or handle deletion logic here (optional)
  } catch (error) {
    console.error("Error deleting product:", error);
    // Display error message to user (optional)
  }
}

const onModalClose = () => {
  console.log("Modal closed, nothing confirmed...");
  setproductForDeletion(null);
  setIsModalVisible(false);
};
const onModalConfirm = async () => {
  console.log("Modal closed, something confirmed...");

  await deleteProduct(productForDeletion.value);

  /*try {
      const data = await store.dispatch("updateProductData", {
      id: props.id,
      payload: {
        is_taken: 1,
      },
    });

    console.log(data);
    //check if the product is really marked as taken
    if (data.is_taken === true) {
      setProductIsTaken(true);
      store.commit("addToast", {
        title: "Product Donated",
        type: "success",
        message: "You have correctly marked the product as donated.",
      });
    } else {
      setProductIsTaken(false);
      store.commit("addToast", {
        title: "Error",
        type: "error",
        message:
          "There was an error marking the product as taken. Please try again. If it does not work, please contact support.",
      });
    }
  } catch (error) {
    console.log(error);
    /*store.commit("addToast", {
      title: "Error",
      type: "error",
      message:
        "There was an error marking the product as taken. Please try again.",
    });
  }*/
  setproductForDeletion(null);
  setIsModalVisible(false);
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
