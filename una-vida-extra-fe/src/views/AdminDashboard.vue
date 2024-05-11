<!--Vista donde se cargan los componentes y la navegación de la zona de administadores. Tiene sub-routas asignadas y sus correspondientes componentes y vistas, donde se encuentra la documentacion correspondiente -->

<template>
  <div class="container">
    <div class="row admin-panel-jumbo">
      <div class="col">
        <h2>Admin Panel</h2>
        <p>
          This is a resctricted area only available to admin users. Use the
          navigation sidebar on the right to access the data managed in the app,
          the users, etc.
        </p>
        <p>
          Please be mindful of your actions when working on this admin panel
          since your actions can be destructive, especially when deleting data.
        </p>
      </div>
    </div>
    <div class="admin-dashboard-nav row">
      <ul class="nav nav-pills col-md-2">
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/products' }"
            :to="{ path: '/admin/products' }"
            >Products</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/users' }"
            :to="{ path: '/admin/users' }"
            >Users</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/categories' }"
            :to="{ path: '/admin/categories' }"
            >Categories</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/tags' }"
            :to="{ path: '/admin/tags' }"
            >Tags</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/requests' }"
            :to="{ path: '/admin/requests' }"
            >Requests</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/locations' }"
            :to="{ path: '/admin/locations' }"
            >Locations</router-link
          >
        </li>
      </ul>
      <div class="admin-view-wrapper col-md-10">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
//propiedad computada para mantener registro de la ruta actual y marcala en la barra de navegacion
const currentPath = computed(() => route.path);
</script>
<style scoped>
.admin-panel-jumbo {
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
}
.admin-panel-jumbo h2 {
  padding-bottom: 1rem;
}
.nav-pills {
  display: flex;
  flex-direction: column;
}
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background-color: #edb421;
}
.nav-link {
  color: black;
}
.admin-dashboard-nav {
  padding: 2rem 0;
}
.admin-view-wrapper {
}
</style>
