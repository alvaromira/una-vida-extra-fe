import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      //component: HomeView,
      redirect: '/products'
    },
    {
      path: '/project',
      name: 'project',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProjectView.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/products/ProductListView.vue')
      //Children
      //add a new product
    },
    {
      path: '/my-products',
      name: 'userProducts',
      component: () => import('../views/products/UserProductListView.vue'),
    },
    {
      path: '/products/add',
      name: 'addProduct',
      component: () => import('../views/products/AddNewProduct.vue'),
    },
    {
      path: '/products/:id',
      name: 'product',
      props: true,
      component: () => import('../views/products/ProductDetailView.vue'),
    },
    {
      path: '/products/:id/request',
      name: 'requestProduct',
      props: true,
      component: () => import('../views/requests/RequestDetailView.vue')
    },
    {
      path: '/products/:id/edit',
      name: 'editProduct',
      props: true,
      component: () => import('../views/products/EditProduct.vue')
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/requests/RequestListView.vue')
    },
    {
      path: '/sponsors',
      name: 'sponsors',
      component: () => import('../views/SponsorsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/user/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/user/UserRegisterView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/user/LogoutView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/ProfileView.vue')
    },
    {
      //catch all
      path: '/:notFound(.*)',
      name: 'notFound',
      component: NotFound
    }
  ]
})

export default router
