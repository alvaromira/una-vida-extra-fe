<!--Vista donde se cargan los componentes y la navegación de la zona de administadores. Tiene sub-routas asignadas y sus correspondientes componentes y vistas, donde se encuentra la documentacion correspondiente -->

<template>
  <div class="container">
    <div class="admin-dashboard-nav row">
      <ul class="nav nav-pills col-md-2">
        <h2>Admin Panel</h2>
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
