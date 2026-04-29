<template>
  <header class="app-header" role="banner">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo" aria-label="Kigali Tech Store Home">
          <div class="logo-text">
            <span class="logo-main">Kigali</span>
            <span class="logo-accent">Tech</span>
            <span class="logo-main">Store</span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" role="navigation" aria-label="Main navigation">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/products" class="nav-link">Products</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            Cart
            <span v-if="cartCount > 0" class="badge badge-accent" aria-label="Cart items">
              {{ cartCount }}
            </span>
          </router-link>
          <router-link to="/wishlist" class="nav-link wishlist-link">
            Wishlist
            <span v-if="wishlistCount > 0" class="badge badge-secondary" aria-label="Wishlist items">
              {{ wishlistCount }}
            </span>
          </router-link>
          <router-link 
            v-if="isAuthenticated" 
            to="/delivery-status" 
            class="nav-link delivery-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Track Order
          </router-link>
        </nav>

        <!-- Search Bar -->
        <div class="search-bar">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search products..."
              class="search-input"
              @input="handleSearch"
            />
          </div>

        <!-- User Actions -->
        <div class="user-actions">
          <router-link 
            v-if="isAuthenticated" 
            to="/profile" 
            class="user-avatar"
            :aria-label="`Profile: ${user?.name || 'User'}`"
          >
            <div class="avatar-circle">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          </router-link>
          <router-link 
            v-else 
            to="/login" 
            class="btn btn-outline btn-sm"
          >
            Login
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="toggleMobileMenu"
          class="mobile-menu-toggle"
          :class="{ active: mobileMenuOpen }"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      class="mobile-menu-overlay" 
      :class="{ open: mobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
    <nav 
      class="mobile-menu" 
      :class="{ open: mobileMenuOpen }"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div class="mobile-menu-header">
        <router-link to="/" class="logo" @click="closeMobileMenu">
          <div class="logo-text">
            <span class="logo-main">Kigali</span>
            <span class="logo-accent">Tech</span>
            <span class="logo-main">Store</span>
          </div>
        </router-link>
        <button 
          @click="closeMobileMenu"
          class="close-menu"
          aria-label="Close mobile menu"
        >
          ✕
        </button>
      </div>
      
      <div class="mobile-menu-content">
        <div class="mobile-search">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search products..."
            class="search-input"
          />
        </div>
        
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          Home
        </router-link>
        <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">
          Products
        </router-link>
        <router-link to="/cart" class="mobile-nav-link" @click="closeMobileMenu">
          Cart
          <span v-if="cartCount > 0" class="badge badge-accent">
            {{ cartCount }}
          </span>
        </router-link>
        <router-link to="/wishlist" class="mobile-nav-link" @click="closeMobileMenu">
          Wishlist
          <span v-if="wishlistCount > 0" class="badge badge-secondary">
            {{ wishlistCount }}
          </span>
        </router-link>
        
        <div class="mobile-user-section">
          <router-link 
            v-if="isAuthenticated" 
            to="/profile" 
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            Profile
          </router-link>
          <template v-else>
            <router-link 
              to="/login" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Register
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productsStore = useProductsStore()

// Reactive state
const mobileMenuOpen = ref(false)
const searchQuery = ref('')

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const cartCount = computed(() => cartStore.count)
const wishlistCount = computed(() => wishlistStore.count)

// Methods
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Update aria-expanded
  const toggle = document.querySelector('.mobile-menu-toggle')
  if (toggle) {
    toggle.setAttribute('aria-expanded', mobileMenuOpen.value.toString())
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  const toggle = document.querySelector('.mobile-menu-toggle')
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false')
  }
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    productsStore.setSearch(searchQuery.value.trim())
    closeMobileMenu()
    router.push('/products')
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  z-index: var(--z-sticky);
  height: 80px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: var(--space-4);
}

/* Logo */
.logo {
  text-decoration: none;
  flex-shrink: 0;
}

.logo-text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.logo-main {
  color: var(--color-primary);
}

.logo-accent {
  color: var(--color-accent);
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.nav-link {
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background: rgba(0, 161, 222, 0.1);
}

.cart-link,
.wishlist-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.badge {
  font-size: 0.75rem;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: 600;
}

/* Search Bar */
.search-bar {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
  background: var(--color-surface);
  color: var(--gray-700);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--gray-100);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

.search-bar {
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  text-decoration: none;
  position: relative;
}

.user-avatar::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  z-index: -1;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.user-avatar:hover::after {
  opacity: 0.3;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-lg);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-surface);
}

.avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--gray-700);
  margin: 2px 0;
  transition: all var(--transition-normal);
  transform-origin: center;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu */
.mobile-menu-overlay {
  display: none;
}

.mobile-menu {
  display: none;
}

.close-menu {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .search-bar {
    display: none;
  }
  
  .user-actions .btn {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .mobile-menu-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal-backdrop);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }
  
  .mobile-menu-overlay.open {
    opacity: 1;
    visibility: visible;
  }
  
  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100vh;
    background: var(--color-surface);
    box-shadow: var(--shadow-xl);
    transition: left var(--transition-normal);
    z-index: var(--z-modal);
    overflow-y: auto;
  }
  
  .mobile-menu.open {
    left: 0;
  }
  
  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid var(--gray-200);
  }
  
  .close-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    font-size: var(--text-xl);
    cursor: pointer;
    color: var(--gray-600);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }
  
  .close-menu:hover {
    background: var(--gray-100);
  }
  
  .mobile-menu-content {
    padding: var(--space-4);
  }
  
  .mobile-search {
    margin-bottom: var(--space-6);
  }
  
  .mobile-search .search-input {
    padding-left: var(--space-4);
    background: var(--gray-50);
  }
  
  .mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) 0;
    text-decoration: none;
    color: var(--gray-700);
    font-weight: 500;
    border-bottom: 1px solid var(--gray-100);
    transition: color var(--transition-fast);
  }
  
  .mobile-nav-link:hover,
  .mobile-nav-link.router-link-active {
    color: var(--color-primary);
  }
  
  .mobile-user-section {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 2px solid var(--gray-200);
  }
}

@media (max-width: 640px) {
  .logo-text {
    font-size: var(--text-lg);
  }
  
  .header-content {
    gap: var(--space-2);
  }
}
</style>
