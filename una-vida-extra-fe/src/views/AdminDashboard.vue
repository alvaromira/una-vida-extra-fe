<template>
  <div>
    <h2>Admin Panel</h2>
    <div class="admin-dashboard">
      <ul class="nav">
        <li class="nav-item">
          <router-link :to="{ path: '/admin/products' }">Products</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ path: '/admin/users' }">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ path: '/admin/categories' }"
            >Categories</router-link
          >
        </li>
        <li class="nav-item">
          <router-link :to="{ path: '/admin/tags' }">Tags</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ path: '/admin/tags' }">Requests</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ path: '/admin/tags' }">Locations</router-link>
        </li>
      </ul>
      <router-view />
    </div>
  </div>
</template>
<script setup></script>
<style scoped></style>
