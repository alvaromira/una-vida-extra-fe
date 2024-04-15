<template>
  <div class="container">
    <h2>Admin Panel</h2>
    <div class="admin-dashboard">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link
            class="nav-link active"
            aria-current="page"
            :to="{ path: '/admin/products' }"
            >Products</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ path: '/admin/users' }"
            >Users</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ path: '/admin/categories' }"
            >Categories</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ path: '/admin/tags' }"
            >Tags</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ path: '/admin/tags' }"
            >Requests</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ path: '/admin/tags' }"
            >Locations</router-link
          >
        </li>
      </ul>
      <router-view />
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background-color: #edb421;
}
.nav-link {
  color: black;
}
</style>
