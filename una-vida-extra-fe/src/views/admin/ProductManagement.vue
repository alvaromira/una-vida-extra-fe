<template>
  <div>
    <h2>Products</h2>
    <div v-if="isDataLoaded">
      <table class="table">
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
            <td><button @click="deleteProduct(product.id)">Delete</button></td>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ProductCard from "../../components/ui/product/ProductCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
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

async function deleteProduct(productId) {
  try {
    console.log("Deleting product");
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
