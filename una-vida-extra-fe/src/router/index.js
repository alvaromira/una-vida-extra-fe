
import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '../views/NotFound.vue';
import store from '../store';
import { computed } from "vue";

//const store = useStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      //component: HomeView,
      redirect: '/products',
      meta: {
        middleware: "public",
        title: 'home'
      },
    },
    {
      path: '/project',
      name: 'project',
      meta: {
        middleware: "public",
        title: "The Project"
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProjectView.vue')
    },
    {
      path: '/products',
      name: 'products',
      meta: {
        middleware: "public",
        title: "Products"
      },
      component: () => import('../views/products/ProductListView.vue')
      //Children
      //add a new product
    },
    {
      path: '/my-products',
      name: 'userProducts',
      meta: {
        middleware: "auth",
        title: 'User Products'
      },
      component: () => import('../views/products/UserProductListView.vue'),
    },
    {
      path: '/products/add',
      name: 'addProduct',
      meta: {
        middleware: "auth",
        title: "Add a Product"
      },
      component: () => import('../views/products/AddNewProduct.vue'),
    },
    {
      path: '/products/:id',
      name: 'product',
      meta: {
        middleware: "public",
        title: "Product Details"
      },
      props: true,
      component: () => import('../views/products/ProductDetailView.vue'),
    },
    {
      path: '/products/:id/request',
      name: 'requestProduct',
      meta: {
        middleware: "auth",
        title: "Request a Product"
      },
      props: true,
      component: () => import('../views/requests/RequestDetailView.vue')
    },
    {
      path: '/products/:id/edit',
      name: 'editProduct',
      meta: {
        middleware: "auth",
        title: "Edit a Product"
      },
      props: true,
      component: () => import('../views/products/EditProductView.vue')
    },
    {
      path: '/requests',
      name: 'requests',
      meta: {
        middleware: "auth",
        title: "Requests"
      },
      component: () => import('../views/requests/RequestListView.vue')
    },
    {
      path: '/requests/product/:id',
      name: 'productRequests',
      meta: {
        middleware: "auth",
        title: "Product Requests"
      },
      component: () => import('../views/requests/ProductRequestListView.vue')
    },
    {
      path: '/sponsors',
      name: 'sponsors',
      meta: {
        middleware: "public",
        title: "Sponsors"
      },
      component: () => import('../views/SponsorsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        middleware: "guest",
        title: 'Login'
      },
      component: () => import('../views/user/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        middleware: "guest",
        title: 'Register'
      },
      component: () => import('../views/user/UserRegisterView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      meta: {
        middleware: "public",
        title: "Logout"
      },
      component: () => import('../views/user/LogoutView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        middleware: "auth",
        title: "User Profile"
      },
      component: () => import('../views/user/ProfileView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: {
        middleware: "public",
        title: "Forgot Password"
      },
      component: () => import('../views/user/ForgotPasswordView.vue')
    },
    {
      //catch all
      path: '/:notFound(.*)',
      name: 'notFound',
      meta: {
        middleware: "public",
        title: "Not Found"
      },
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {

  const isAuthenticated = computed(() => store.getters.authenticated);
  const user = computed(() => store.getters.user);

  document.title = "1up - " + to.meta.title
  if (to.meta.middleware == "guest") {
    if (isAuthenticated.value) {
      //next({ name: "dashboard" })
      console.log("VISITING A GUEST ROUTE, you are authenticated already", to.name)
      console.log(user);
    }
    else {
      console.log("VISITING A GUEST ROUTE, you are NOT authenticated", to.name)
      console.log(user);
    }
    next()
  }
  else if (to.meta.middleware == "public") {
    console.log("VISITING A PUBLIC ROUTE ", to.name);
    console.log(user);
    next()
  } else {
    if (isAuthenticated.value) {
      console.log("VISITING An AUTH ROUTE, you are authenticated")
      console.log(user);
      next()
    } else {
      console.log(`VISITING AN NOT AUTH ROUTE ${to.name}, you are NOT authenticated`)
      console.log(user);
      next({ name: "login", query: { from: from.fullPath } })
    }
  }
})

export default router
