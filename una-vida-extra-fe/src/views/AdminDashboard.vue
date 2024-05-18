<!--Vista donde se cargan los componentes y la navegación de la zona de administadores. Tiene sub-routas asignadas y sus correspondientes componentes y vistas, donde se encuentra la documentacion correspondiente -->

<template>
  <div class="container">
    <div class="row admin-panel-jumbo">
      <div class="col">
        <div class="d-flex" style="justify-content: space-between">
          <h2>Zona Admin</h2>
          &nbsp;
          <a
            class="collapse-icon"
            data-bs-toggle="collapse"
            href="#collapseInfo"
            role="button"
            aria-expanded="false"
            aria-controls="collapseInfo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrows-collapse"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z"
              />
            </svg>
          </a>
        </div>
        <div class="collapse" id="collapseInfo">
          <p>
            Esta es un área restringida solo disponible para usuarios
            administradores. Utilice la barra lateral de navegación de la
            derecha para acceder a los datos gestionados en la aplicación, los
            usuarios, etc.
          </p>
          <p>
            Tenga en cuenta sus acciones cuando trabaje en este panel de
            administración, ya que pueden ser destructivas, especialmente al
            eliminar datos.
          </p>
        </div>
      </div>
    </div>
    <!--Menu vertical para los subcomponentes-->
    <div class="admin-dashboard-nav row">
      <ul class="nav nav-pills col-md-2">
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/products' }"
            :to="{ path: '/admin/products' }"
            >Productos</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/users' }"
            :to="{ path: '/admin/users' }"
            >Usuarios</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/categories' }"
            :to="{ path: '/admin/categories' }"
            >Categorías</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/tags' }"
            :to="{ path: '/admin/tags' }"
            >Etiquetas</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/requests' }"
            :to="{ path: '/admin/requests' }"
            >Solicitudes</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: currentPath === '/admin/locations' }"
            :to="{ path: '/admin/locations' }"
            >Ubicaciones</router-link
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
#collapseInfo {
  padding-top: 1rem;
}
.admin-panel-jumbo {
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
}
.admin-panel-jumbo h2 {
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
.collapse-icon {
  display: flex;
  color: #7ab370;
  justify-content: center;
  align-items: center;
  border: 1px solid #7ab370;
  padding: 1rem;
  border-radius: 50%;
}
</style>
