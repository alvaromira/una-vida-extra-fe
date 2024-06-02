<!--Componente header para el esquema de layout principal-->
<template>
  <header>
    <section id="primary-nav-bar">
      <nav class="navbar navbar-expand-md">
        <div class="container-fluid">
          <RouterLink :to="{ name: 'products' }" class="navbar-brand">
            <img
              alt="1up logo"
              class="logo"
              src="@/assets/images/one-life-up-logo.png"
              width="125"
              height="100"
            /><span class="logo-letters">Una vida extra</span></RouterLink
          >

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
              <label for="site-search">Buscar en el sitio web:</label>
              <input
                type="search"
                id="site-search"
                name="site-search"
                v-model="searchTerm"
                class="form-control"
                pattern=".{3,}"
                placeholder="Introduce lo que buscas..."
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
                >Registrarse</BaseButton
              >
              <BaseButton
                mode="outline-green"
                :to="{ name: 'login' }"
                link="true"
                >Acceder</BaseButton
              >
            </div>
            <div v-if="getUserStatus" class="profile-image-icon">
              <ProfileImage
                :userEmail="activeUserEmail"
                :gravatarInfo="false"
                :mode="'small'"
              />
            </div>
            <ul class="navbar-nav">
              <li v-if="getUserStatus" class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle yellow-color w-100"
                  href="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hola, {{ activeUserEmail }}
                </a>
                <ul
                  class="dropdown-menu yellow-color w-100"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'userProducts' }"
                      >Mis productos</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'requests' }"
                      >Mis solicitudes</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'profile' }"
                      >Perfil</RouterLink
                    >
                  </li>

                  <li>
                    <RouterLink
                      v-if="!isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'logout' }"
                      >Salir</RouterLink
                    >
                  </li>

                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'admin' }"
                      >Zona Admin</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'profile' }"
                      >Perfil</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      v-if="isUserAdmin"
                      class="dropdown-item"
                      :to="{ name: 'logout' }"
                      >Salir</RouterLink
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </section>
    <section id="second-nav-bar">
      <nav class="navbar navbar-expand-sm">
        <div class="container">
          <div class="navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <RouterLink
                  aria-current="page"
                  class="nav-link"
                  :to="{ name: 'products' }"
                  >Productos</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'project' }"
                  >Proyecto</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'sponsors' }"
                  >Patrocinadores</RouterLink
                >
              </li>

              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'help' }"
                  >Ayuda</RouterLink
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
import { useRouter } from "vue-router";

const router = useRouter(); // inicializacion para acceso al router
const store = useStore(); // inicializacion para acceso al state en el store de Vuex
const searchTerm = ref("");

const searchProducts = () => {
  const searchTermValue = searchTerm.value.trim(); // se eliminan espacios en blancos para el termino de busqeuda

  if (searchTermValue.length >= 3) {
    // Antes de empezar a buscar, se comprueba que la busqueda tenga mas de 3 caracteres
    router.push({
      name: "products",
      query: { q: searchTermValue },
    });
  } else {
    console.log("El término de búsqueda debe tener al menos 3 caracteres.");
  }
};

//Se usan computed para los datos que viene del state en el store de Vuex
const activeUserEmail = computed(() => {
  return store.state.user.email;
});
const getUserStatus = computed(() => {
  return store.state.authenticated;
});
const isUserAdmin = computed(() => {
  return store.state.userIsAdmin;
});
</script>

<style scoped>
#navbarNavDarkDropdown {
  padding-top: 1rem;
}
#navbarDarkDropdownMenuLink {
  margin-top: 1rem;
}
.search-and-menu-bar {
  justify-content: flex-end;
  gap: 1rem;
}
#access {
  display: flex;
  gap: 1rem;
  padding-left: 0rem;
  padding-top: 1rem;
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
  min-width: unset;
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
  color: white !important;
  border-radius: 5px;
  padding: 0.5rem 1rem !important;
  font-weight: normal;
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
/* De forma predeterminada para dispositivos pequeños, no se muestra */
.profile-image-icon {
  display: none;
}
#second-nav-bar .navbar-nav {
  gap: 1rem;
}
.navbar-brand a {
  color: white;
}
.navbar-brand a:hover {
  color: white;
  text-decoration: underline;
}
.logo-letters {
  color: white;
  letter-spacing: -0.1rem;
  font-weight: 300;
}
@media (min-width: 768px) {
  #access {
    display: flex;
    gap: 1rem;
    padding-left: 1rem;
    padding-top: 0rem;
  }
  #navbarNavDarkDropdown {
    padding-top: 0rem;
  }

  #navbarDarkDropdownMenuLink {
    margin-top: 0rem;
  }
  .profile-image-icon {
    display: flex;
    align-items: center;
  }
  #site-search {
    min-width: 360px;
  }
  .navbar-expand-md .navbar-collapse {
    display: flex !important;
    flex-basis: auto;
    flex-wrap: wrap;
  }
}
</style>
