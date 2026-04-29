import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/products',
      component: () => import('@/views/ProductsLayout.vue'),
      children: [
        {
          path: '',
          name: 'ProductsList',
          component: () => import('@/views/ProductsList.vue')
        },
        {
          path: ':id',
          name: 'ProductDetail',
          component: () => import('@/views/ProductDetail.vue'),
          props: true
        }
      ]
    },
    { 
      path: '/cart', 
      name: 'Cart', 
      component: () => import('@/views/Cart.vue') 
    },
    { 
      path: '/wishlist', 
      name: 'Wishlist', 
      component: () => import('@/views/Wishlist.vue') 
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/Checkout.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order-success',
      name: 'OrderSuccess',
      component: () => import('@/views/OrderSuccess.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/orders',
      name: 'ProfileOrders',
      component: () => import('@/views/ProfileOrders.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/wishlist',
      name: 'ProfileWishlist',
      component: () => import('@/views/ProfileWishlist.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/delivery-status',
      name: 'DeliveryStatus',
      component: () => import('@/views/DeliveryStatus.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/login', 
      name: 'Login', 
      component: () => import('@/views/Login.vue') 
    },
    { 
      path: '/register', 
      name: 'Register', 
      component: () => import('@/views/Register.vue') 
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('@/views/NotFound.vue') 
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Initialize auth from storage
  if (!auth.user && !auth.token) {
    auth.initFromStorage()
  }
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && auth.isAuthenticated) {
    next({ name: 'ProfileOrders' })
  } else {
    next()
  }
})

export default router
