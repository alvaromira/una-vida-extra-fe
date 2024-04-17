<template>
  <div class="container">
    <h2>Admin Panel</h2>
    <div class="admin-dashboard">
      <ul class="nav nav-pills">
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
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
//const currentPath = route.path;
const currentPath = computed(() => route.path);
</script>
<style scoped>
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background-color: #edb421;
}
.nav-link {
  color: black;
}
</style>
