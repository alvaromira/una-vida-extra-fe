<template>
  <header>
    <div class="top-header">
      <RouterLink :to="{ name: 'products' }">
        <img
          alt="1up logo"
          class="logo"
          src="@/assets/images/one-life-up-logo.png"
          width="150"
          height="125"
      /></RouterLink>
      <div id="header-text">
        <h1>One Life Up</h1>
        <h2>Reuse to protect the environment</h2>
      </div>
    </div>

    <div class="bottom-header">
      <div>
        <nav id="main-menu">
          <ul class="menu-list">
            <!--<li><RouterLink :to="{ name: ''}">Home</RouterLink></li>
          <li><RouterLink :to="{ name: 'about'}">About</RouterLink></li>-->
            <li class="menu-item">
              <RouterLink :to="{ name: 'products' }">Products</RouterLink>
            </li>
            <li class="menu-item">
              <RouterLink :to="{ name: 'sponsors' }">Sponsors</RouterLink>
            </li>
            <li class="menu-item">
              <RouterLink :to="{ name: 'project' }">Project</RouterLink>
            </li>
            <!--<li><RouterLink :to="{ name: 'login'}">Login</RouterLink></li>
          <li><RouterLink :to="{ name: 'register'}">Register</RouterLink></li>-->
          </ul>
          <div>
            <form @submit.prevent="searchProducts" class="search-form">
              <label for="site-search">Search the site:</label>
              <input
                type="search"
                id="site-search"
                name="site-search"
                v-model="searchTerm"
                class="search-input"
                pattern=".{3,}"
              />
              <button type="submit" class="search-button">Search</button>
            </form>
          </div>
        </nav>
      </div>
      <div>
        <nav id="user-menu">
          <ul class="user-menu-list">
            <!-- if not logged in-->
            <li v-if="!getUserStatus" class="user-menu-item">
              <BaseButton :to="{ name: 'register' }" link="true"
                >Register</BaseButton
              >
            </li>
            <li v-if="!getUserStatus" class="user-menu-item">
              <BaseButton :to="{ name: 'login' }" link="true">Login</BaseButton>
            </li>
            <!--For logged in users -->

            <li v-if="getUserStatus" class="user-menu-item">
              <!--<BaseButton>My Account</BaseButton>-->
              <div>
                <ProfileImage
                  :userEmail="activeUserEmail"
                  :gravatarInfo="false"
                  :mode="'small'"
                />
              </div>
              <div class="dropdown">
                <BaseButton>My Account</BaseButton>
                <div v-if="!isUserAdmin" class="dropdown-content">
                  <RouterLink :to="{ name: 'userProducts' }"
                    >My Products</RouterLink
                  >
                  <RouterLink :to="{ name: 'requests' }"
                    >My Requests</RouterLink
                  >
                  <RouterLink :to="{ name: 'profile' }">Profile</RouterLink>

                  <RouterLink :to="{ name: 'logout' }">Log Out</RouterLink>
                </div>
                <div v-else class="dropdown-content">
                  <RouterLink :to="{ name: 'admin' }"
                    >Admin Dashboard</RouterLink
                  >
                  <RouterLink :to="{ name: 'profile' }">Profile</RouterLink>
                  <RouterLink :to="{ name: 'logout' }">Log Out</RouterLink>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
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
header {
  color: #fff;
  width: 100%;
  display: block;
  /*justify-content: center;
  align-items: center;*/
  background-color: #7ab370;
  box-shadow: rgba(17, 17, 26, 0.2) 0px 2px 4px;
  padding: 1.5rem 0;
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
  border-radius: 5px;
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
.menu-item a.router-link-active {
  /* border: 1px solid #f391e3; */
  font-weight: bolder;
  position: relative;
}
.menu-item a.router-link-active::after {
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
}
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
  height: 100%; /* Match the height of the input field */
  text-decoration: none;
  padding: 1rem;
  color: #fff;
  /*background-color: #edb421;*/
  color: gray;
  border-radius: 0px;
  min-width: 100px;
  border: none;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}
.search-button:hover {
  background-color: #edb421; /* Change background color on hover */
}
.search-button:active {
  background-color: #c49f00; /* Change background color when pressed */
}
</style>
