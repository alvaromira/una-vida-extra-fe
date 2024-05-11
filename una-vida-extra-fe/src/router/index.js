
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import { computed } from "vue";
import NotFound404Page from '../components/ui/NotFound404Page.vue';

const router = createRouter({
  // Configuración para el historial de navegación basado en la API de historial de navegación web
  history: createWebHistory(import.meta.env.BASE_URL),
  // Definición de las rutas de la aplicación
  routes: [
    {
      path: '/', // Ruta raíz de la aplicación
      name: 'home',
      redirect: '/products', // Redirige la ruta raíz a la vista de productos
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: 'Home' // Título de la página
      },
    },
    {
      path: '/project', // Ruta para la vista del proyecto
      name: 'project',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "The Project" // Título de la página
      },
      component: () => import('../views/ProjectView.vue') // Componente asociado a la vista del proyecto
    },
    {
      path: '/products', // Ruta para mostrar todos los productos
      name: 'products',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Products" // Título de la página
      },
      component: () => import('../views/products/ProductListView.vue'), // Componente asociado a la vista de lista de productos
      props: route => ({ sText: route.query.q }) // Propiedades pasadas al componente, incluyendo el texto de búsqueda si está presente en la consulta URL
    },
    {
      path: '/my-products', // Ruta para mostrar los productos del usuario
      name: 'userProducts',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: 'User Products' // Título de la página
      },
      component: () => import('../views/products/UserProductListView.vue') // Componente asociado a la vista de productos del usuario
    },
    {
      path: '/products/add', // Ruta para agregar un nuevo producto
      name: 'addProduct',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: "Add a Product" // Título de la página
      },
      component: () => import('../views/products/AddNewProduct.vue') // Componente asociado a la vista de agregar nuevo producto
    },
    {
      path: '/products/:id', // Ruta para mostrar los detalles de un producto específico
      name: 'product',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Product Details" // Título de la página
      },
      props: true, // Pasar las propiedades de la ruta al componente
      component: () => import('../views/products/ProductDetailView.vue') // Componente asociado a la vista de detalles del producto
    },
    {
      path: '/products/:id/request', // Ruta para solicitar un producto específico
      name: 'requestProduct',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: "Request a Product" // Título de la página
      },
      props: true, // Pasar las propiedades de la ruta al componente
      component: () => import('../views/requests/RequestDetailView.vue') // Componente asociado a la vista de solicitud de producto
    },
    {
      path: '/products/:id/edit', // Ruta para editar un producto específico
      name: 'editProduct',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: "Edit a Product" // Título de la página
      },
      props: true, // Pasar las propiedades de la ruta al componente
      component: () => import('../views/products/EditProductView.vue') // Componente asociado a la vista de edición de producto
    },
    {
      path: '/requests', // Ruta para ver todas las solicitudes de productos
      name: 'requests',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: "Requests" // Título de la página
      },
      component: () => import('../views/requests/RequestListView.vue') // Componente asociado a la vista de lista de solicitudes
    },
    {
      path: '/requests/product/:id', // Ruta para ver las solicitudes de un producto específico
      name: 'productRequests',
      meta: {
        middleware: "auth", // Middleware de autenticación requerida
        title: "Product Requests" // Título de la página
      },
      component: () => import('../views/requests/ProductRequestListView.vue') // Componente asociado a la vista de solicitudes de producto específico
    },
    {
      path: '/sponsors', // Ruta para mostrar los patrocinadores
      name: 'sponsors',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Sponsors" // Título de la página
      },
      component: () => import('../views/SponsorsView.vue') // Componente asociado a la vista de patrocinadores
    },
    {
      path: '/login', // Ruta para iniciar sesión
      name: 'login',
      meta: {
        middleware: "guest", // Middleware de invitado (no autenticado)
        title: 'Login' // Título de la página
      },
      component: () => import('../views/user/LoginView.vue') // Componente asociado a la vista de inicio de sesión
    },
    {
      path: '/forgot-password', // Ruta para restablecer la contraseña olvidada
      name: 'forgot-password',
      meta: {
        middleware: "guest", // Middleware de invitado (no autenticado)
        title: 'Forgot Password' // Título de la página
      },
      component: () => import('../views/user/ForgotPasswordView.vue') // Componente asociado a la vista de olvido de contraseña
    },
    {
      path: '/reset-password/:token', // Ruta para restablecer la contraseña con un token específico
      name: 'reset-password',
      meta: {
        middleware: "guest", // Middleware de invitado (no autenticado)
        title: 'Reset Password' // Título de la página
      },
      component: () => import('../views/user/ResetPasswordView.vue') // Componente asociado a la vista de restablecimiento de contraseña
    },
    {
      path: '/register', // Ruta para registrar un nuevo usuario
      name: 'register',
      meta: {
        middleware: "guest", // Middleware de invitado (no autenticado)
        title: 'Register' // Título de la página
      },
      component: () => import('../views/user/UserRegisterView.vue') // Componente asociado a la vista de registro de usuario
    },
    {
      path: '/terms', // Ruta para mostrar los términos y condiciones
      name: 'terms',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Terms and Conditions" // Título de la página
      },
      component: () => import('../views/TermsAndConditionsView.vue') // Componente asociado a la vista de términos y condiciones
    },

    {
      path: '/logout', // Ruta para cerrar sesión
      name: 'logout',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Logout" // Título de la página
      },
      component: () => import('../views/user/LogoutView.vue') // Componente asociado a la vista de cierre de sesión
    },
    {
      path: '/profile', // Ruta para ver el perfil del usuario
      name: 'profile',
      meta: {
        middleware: "auth", // Middleware de autenticación requerido
        title: "User Profile" // Título de la página
      },
      component: () => import('../views/user/ProfileView.vue') // Componente asociado a la vista de perfil de usuario
    },
    {
      path: '/admin', // Ruta para el panel de administración
      name: 'admin',
      children: [
        { path: '', redirect: 'products' }, // Redirecciona a la página de gestión de productos por defecto
        { path: 'products', component: () => import('../views/admin/ProductManagement.vue') }, // Página de gestión de productos
        { path: 'users', component: () => import('../views/admin/UserManagement.vue') }, // Página de gestión de usuarios
        { path: 'categories', component: () => import('../views/admin/CategoryManagement.vue') }, // Página de gestión de categorías
        { path: 'tags', component: () => import('../views/admin/TagManagement.vue') }, // Página de gestión de etiquetas
        { path: 'locations', component: () => import('../views/admin/LocationManagement.vue') }, // Página de gestión de ubicaciones
        { path: 'requests', component: () => import('../views/admin/RequestManagement.vue') }, // Página de gestión de solicitudes
      ],
      meta: {
        middleware: "admin", // Middleware de administrador requerido
        title: "Admin Dashboard" // Título de la página
      },
      component: () => import('../views/AdminDashboard.vue') // Componente asociado al panel de administración
    },
    {
      path: '/forgot-password', // Ruta para restablecer la contraseña olvidada
      name: 'forgot-password',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Forgot Password" // Título de la página
      },
      component: () => import('../views/user/ForgotPasswordView.vue') // Componente asociado a la vista de olvido de contraseña
    },

    {
      // Ruta de captura para cualquier ruta no encontrada. Fallback
      path: '/:notFound(.*)',
      name: 'notFound',
      meta: {
        middleware: "public", // Middleware público (sin autenticación requerida)
        title: "Not Found" // Título de la página
      },
      component: NotFound404Page // Componente asociado a la página de error 404
    }
  ]
});

// Propiedad computada para verificar si el usuario está autenticado
const isAuthenticated = computed(() => store.getters.authenticated);

// Propiedad computada para obtener los datos del usuario
const user = computed(() => store.getters.user);

// Función para manejar rutas accesibles para invitados
async function handleGuestRoute(to, next) {
  // Verificar si el token csrf y la sesión son válidos, si es así, redirigir
  // Pendiente (considerar una página de redirección)
  store.dispatch("getAuthUser").then(() => {
    if (isAuthenticated.value) {
      console.log("VISITANDO UNA RUTA DE INVITADO, ya estás autenticado", to.name);
      next({ name: "products" });
      //next();
    } else {
      console.log("VISITANDO UNA RUTA DE INVITADO, no estás autenticado", to.name);
      next();
    }
  });
}

// Función para manejar rutas públicas, realmente no hace falta nada al ser pública, se sigue adelante
function handlePublicRoute(to, next) {
  next();
}

// Función para manejar rutas autenticadas
async function handleAuthRoute(to, from, next) {
  const routePath = to.fullPath;
  //si el usuario está authenticado, se sigue adelante
  if (isAuthenticated.value) {
    next();
  } else {
    //si no lo está porque no se ha logeado, se trata de comprobar si en el estado ya está logeado y por tanto con una cookie de Sanctum valida. Si es el caso, se recicla la autenticación, se logea al usuario y se sigue adelante
    store.dispatch("getAuthUser").then(() => {
      if (isAuthenticated.value) {
        //console.log("VISITANDO UNA RUTA DE AUTENTICACIÓN, no estabas autenticado, pero ahora estás re-autenticado desde tu sesión válida");
        next();
      } else {
        //en caso contrario, se pone un toast de informacion para y se redirije a login
        //console.log(`VISITANDO UNA RUTA DE AUTENTICACIÓN ${to.name}, no estás autenticado`);
        store.commit("addToast", {
          title: "Necesitas iniciar sesión",
          type: "info",
          message:
            "Necesitas iniciar sesión para acceder a esta página.",
        });
        next({ name: "login" });
      }
    });
  }
}

// Guardia o controles de navegación global.En función del tipo del middleware de la ruta, se gestiona de una u otra forma por parte del router antes de pintar la vista
router.beforeEach((to, from, next) => {
  document.title = "1up - " + to.meta.title; //para el título de cualquier ruta

  // Determinar el tipo de middleware de la ruta y manejarla en consecuencia con los métodos de arriba
  if (to.meta.middleware === "guest") {
    handleGuestRoute(to, next);
  } else if (to.meta.middleware === "admin") {
    handleAuthRoute(to, from, next);
  }
  else if (to.meta.middleware === "public") {
    handlePublicRoute(to, next);
  } else {
    handleAuthRoute(to, from, next);
  }
});



export default router
