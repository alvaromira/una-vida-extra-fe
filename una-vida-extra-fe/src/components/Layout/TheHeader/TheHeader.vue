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
          <!-- <label for="site-search">Search the site:</label>
        <input type="search" id="site-search" name="q" />-->
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
                  @gravatarInfo="false"
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
                  <a>Manage Users</a>
                  <a>Manage Products</a>
                  <a>Manage Requests</a>
                  <a>My Profile</a>
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

const store = useStore();

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
  color: #7ab370;
  background-color: #fff;
  border-radius: 5px;
  min-width: 100px;
  display: inline-block;
  text-align: center;
}
.menu-item a.router-link-active {
  border: 1px solid #f391e3;
  font-weight: bolder;
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
</style>
