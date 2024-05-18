<!--Componente footer para el esquema de layout principal-->
<template>
  <footer>
    <div class="container-fluid" id="footer-wrapper">
      <div class="row">
        <div class="col">
          <p>Una Vida Extra &copy;{{ new Date().getFullYear() }}.</p>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <nav class="navbar navbar-expand-sm">
            <div class="container-fluid d-flex justify-content-center">
              <ul class="navbar-nav d-flex justify-content-center">
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'privacy' }"
                    >Política de privacidad</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'terms' }"
                    >Términos y condiciones</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'cookies' }"
                    >Cookies&nbsp;🍪</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="{ name: 'contact' }"
                    >Contacto</RouterLink
                  >
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
#footer-wrapper {
  margin-top: 2rem;
}
footer {
  width: 100%;
  text-align: center;
  background-color: #7ab370;
  color: aliceblue;

  padding: 2rem 0;
}
p {
  margin: 0;
  padding: 0;
  font-weight: 300;
}
.nav-link {
  color: white !important;
  font-weight: 300 !important;
}
.nav-link:hover {
  text-decoration: underline;
}
.navbar-nav {
  gap: 1.5rem;
}
</style>
