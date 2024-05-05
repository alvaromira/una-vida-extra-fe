<template>
  <header>
    <section id="primary-nav-bar">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <RouterLink :to="{ name: 'products' }" class="navbar-brand" href="#">
            <img
              alt="1up logo"
              class="logo"
              src="@/assets/images/one-life-up-logo.png"
              width="125"
              height="100"
          /></RouterLink>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDarkDropdown"
            aria-controls="navbarNavDarkDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse search-and-menu-bar"
            id="navbarNavDarkDropdown"
          >
            <form
              @submit.prevent="searchProducts"
              class="d-flex"
              id="search-product-form"
            >
              <label for="site-search">Search the site:</label>
              <input
                type="search"
                id="site-search"
                name="site-search"
                v-model="searchTerm"
                class="form-control"
                pattern=".{3,}"
                placeholder="Enter your search here..."
                aria-label="Search"
              />
              <button type="submit" class="btn search-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                  />
                </svg>
              </button>
            </form>
            <div id="access" class="d-flex" v-if="!getUserStatus">
              <BaseButton :to="{ name: 'register' }" link="true"
                >Register</BaseButton
              >
              <BaseButton
                mode="outline-green"
                :to="{ name: 'login' }"
                link="true"
                >Login</BaseButton
              >
            </div>
            <div v-if="getUserStatus">
              <ProfileImage
                :userEmail="activeUserEmail"
                :gravatarInfo="false"
                :mode="'small'"
              />
            </div>
            <ul class="navbar-nav">
              <li v-if="getUserStatus" class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle yellow-color"
                  href="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, {{ activeUserEmail }}
                </a>
                <ul
                  class="dropdown-menu yellow-color"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <!--<li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </li>-->
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'userProducts' }"
                      >My Products</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'requests' }"
                      >My Requests</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'profile' }"
                      >Profile</RouterLink
                    >
                  </li>

                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'logout' }"
                      >Log Out</RouterLink
                    >
                  </li>

                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'admin' }"
                      >Admin Dashboard</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'profile' }"
                      >Profile</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'logout' }"
                      >Log Out</RouterLink
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!--  <nav class="navbar navbar-expand-lg">
        <div class="container logo-part">
          <RouterLink :to="{ name: 'products' }" class="navbar-brand" href="#">
            <img
              alt="1up logo"
              class="logo"
              src="@/assets/images/one-life-up-logo.png"
              width="125"
              height="100"
          /></RouterLink>
        </div>
        <div class="d-flex buttons-and-actions">
          <div id="search_and_access" class="d-flex">
            <form
              @submit.prevent="searchProducts"
              class="d-flex"
              id="search-product-form"
            >
              <label for="site-search">Search the site:</label>
              <input
                type="search"
                id="site-search"
                name="site-search"
                v-model="searchTerm"
                class="form-control"
                pattern=".{3,}"
                placeholder="Enter your search here..."
                aria-label="Search"
              />
              <button type="submit" class="btn search-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                  />
                </svg>
              </button>
            </form>
            <div id="access" class="d-flex" v-if="!getUserStatus">
              <BaseButton :to="{ name: 'register' }" link="true"
                >Register</BaseButton
              >
              <BaseButton
                mode="outline-green"
                :to="{ name: 'login' }"
                link="true"
                >Login</BaseButton
              >
            </div>
          </div>

          <div v-if="getUserStatus">
            <ProfileImage
              :userEmail="activeUserEmail"
              :gravatarInfo="false"
              :mode="'small'"
            />
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav user-menu-list">
              <li
                v-if="getUserStatus"
                class="user-menu-item nav-item dropdown d-flex"
              >
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, {{ activeUserEmail }}
                </a>
                <ul
                  class="dropdown-menu"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <div v-if="!isUserAdmin">
                    <RouterLink
                      class="dropdown-item"
                      :to="{ name: 'userProducts' }"
                      >My Products</RouterLink
                    >
                    <RouterLink class="dropdown-item" :to="{ name: 'requests' }"
                      >My Requests</RouterLink
                    >
                    <RouterLink class="dropdown-item" :to="{ name: 'profile' }"
                      >Profile</RouterLink
                    >

                    <RouterLink class="dropdown-item" :to="{ name: 'logout' }"
                      >Log Out</RouterLink
                    >
                  </div>
                  <div v-else>
                    <RouterLink class="dropdown-item" :to="{ name: 'admin' }"
                      >Admin Dashboard</RouterLink
                    >
                    <RouterLink class="dropdown-item" :to="{ name: 'profile' }"
                      >Profile</RouterLink
                    >
                    <RouterLink class="dropdown-item" :to="{ name: 'logout' }"
                      >Log Out</RouterLink
                    >
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>-->
    </section>
    <section id="second-nav-bar">
      <nav class="navbar navbar-expand-sm">
        <div class="container">
          <div class="navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <!--       <li class="nav-item">
                <a class="nav-link active" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Features</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
              </li>-->
              <li class="nav-item">
                <RouterLink
                  aria-current="page"
                  class="nav-link"
                  :to="{ name: 'products' }"
                  >Products</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'sponsors' }"
                  >Sponsors</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'project' }"
                  >Project</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </section>
  </header>
</template>

<script setup>
import BaseButton from "../../ui/BaseButton.vue";
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import ProfileImage from "../../ui/ProfileImage.vue";
import md5 from "md5";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStore();
const searchTerm = ref("");

const searchProducts = () => {
  const searchTermValue = searchTerm.value.trim(); // Trim whitespace

  if (searchTermValue.length >= 3) {
    // Check length
    router.push({
      name: "products",
      query: { q: searchTermValue },
    });
  } else {
    // Handle case where searchTerm is empty or less than 3 characters
    console.log("Search term must be at least 3 characters long");
  }
};

/*const searchProducts = async () => {
  await store.dispatch("searchProducts", searchTerm.value.trim());
};

const searchResults = computed(() => {
  return store.getters["getSearchResults"];
});*/

const activeUserEmail = computed(() => {
  return store.state.user.email;
});

//using computed property derived from Vuex
const getUserStatus = computed(() => {
  return store.state.authenticated;
});
const isUserAdmin = computed(() => {
  return store.state.userIsAdmin;
});
</script>

<style scoped>
.search-and-menu-bar {
  justify-content: flex-end;
  gap: 1rem;
}
#access {
  display: flex;
  gap: 1rem;
  padding-left: 1rem;
}
#second-nav-bar {
  background-color: #fefcf6;
}
section#primary-nav-bar nav.navbar {
  background-color: #7ab370;
  margin-top: 0;
  padding: 1rem;
}
section#second-nav-bar nav.navbar {
  background-color: #fefcf6;
}
.dropdown-menu {
  margin: 0;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
}

header {
  color: #fff;
  width: 100%;
  display: block;
  /*justify-content: center;
  align-items: center;
  background-color: #7ab370;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  padding: 1.5rem 0;*/
}
.top-header {
  display: flex;
  padding: 0rem 1rem;
}
#header-text {
}

#header-text h1 {
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.bottom-header {
  display: flex;
  justify-content: space-between;
  padding: 0rem 1rem;
}

.menu-list,
.user-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: start;
  align-items: start;
}

.menu-item,
.user-menu-item {
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
}

.user-menu-list .user-menu-item a {
  text-decoration: none;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #edb421;
  /*border-radius: 5px;*/
  min-width: 100px;
  display: inline-block;
  text-align: center;
}

.menu-item a {
  text-decoration: none;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #7ab370;
  border-radius: 5px;
  /*min-width: 100px;*/
  display: inline-block;
  text-align: start;
  position: relative;
}
.menu-item a:hover::after {
  border-top: 4px solid #dbd9d9;
  left: 0;
  right: 1px;
  bottom: -4px;
  content: "";
  display: block;
  position: absolute;
  -webkit-transition: -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  transform: translateY(-4px);
}
.nav-item:has(a.router-link-active) {
  border-bottom: 2px solid #7ab370;
  font-weight: bolder;
  position: relative;
}
/*.nav-item:has(a.router-link-active)::after {
  border-top: 4px solid #fff;
  left: 0;
  right: 1px;
  bottom: -4px;
  content: "";
  display: block;
  position: absolute;
  -webkit-transition: -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  transform: translateY(-4px);
}*/
h1,
h2,
h3 {
  color: #fff;
}

/* dropdown-related */

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;

  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100%;
}

/* Links inside the dropdown */
.user-menu-list .dropdown-content a {
  border-radius: 0;
  text-decoration: none;
  display: block;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #edb421;
  min-width: initial;
  text-align: center;
  cursor: pointer;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  opacity: 0.7;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

label[for="site-search"] {
  display: none;
}
#site-search {
  min-width: 350px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
#main-menu {
  display: flex;
}

.search-form {
  display: flex; /* Use flexbox layout */
  align-items: center; /* Align items vertically */
  border: none;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
}

.search-input {
  flex: 1; /* Expand input field to fill available space */
  height: 40px; /* Set desired height */
  padding: 0.5rem; /* Add padding for better appearance */
  border-radius: 5px 0px 0px 5px;
  border: none;
  padding: 0.5rem;
  color: gray;
}

.search-button {
  /*height: 100%; /* Match the height of the input field */
  text-decoration: none;
  padding: 0.5rem;

  background-color: #fff;
  color: gray;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  /*min-width: 100px;*/
  border: none;
  /* display: inline-block;*/
  text-align: center;
  cursor: pointer;
}
.search-button:hover {
  /* Change background color on hover */
}
.search-button:active {
  background-color: #c49f00; /* Change background color when pressed */
}

.yellow-color {
  background-color: #edb421;
}
.dropdown-toggle {
  color: white;
  border-radius: 5px;
}
.dropdown-item {
  color: white;
}

#header-wrapper {
  padding: 0;
}

.logo-part {
  flex: 1;
}
.buttons-and-actions {
  justify-content: flex-end;
  gap: 1rem;
  padding: 2rem;
}
</style>
