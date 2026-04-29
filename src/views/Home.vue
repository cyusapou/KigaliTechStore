<template>
  <main id="main-content" class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" role="banner">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Your Tech Hub in Kigali
            </h1>
            <p class="hero-subtitle">
              Ibicuruzwa by'ikoranabuhanga ku giciro gihendutse
            </p>
            <p class="hero-description">
              Shop the latest smartphones, laptops, and tech accessories at the best prices in Rwanda
            </p>
            <router-link to="/products" class="btn btn-accent btn-lg hero-cta">
              Shop Now
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="margin-left: 8px;">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </router-link>
          </div>
          <div class="hero-visual">
            <div class="floating-products">
              <div class="floating-product product-1">
                <div class="product-mockup">
                  <div class="mockup-screen"></div>
                </div>
              </div>
              <div class="floating-product product-2">
                <div class="product-mockup laptop">
                  <div class="mockup-screen"></div>
                </div>
              </div>
              <div class="floating-product product-3">
                <div class="product-mockup headphones">
                  <div class="mockup-screen"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-gradient-overlay"></div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Handpicked tech deals just for you</p>
        </div>
        
        <div v-if="productsStore.loading" class="featured-grid">
          <div v-for="i in 4" :key="i" class="skeleton-card skeleton"></div>
        </div>
        
        <div v-else-if="productsStore.error" class="error-state">
          <p>{{ productsStore.error }}</p>
          <button @click="loadFeaturedProducts" class="btn btn-primary">
            Try Again
          </button>
        </div>
        
        <div v-else class="featured-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div class="section-footer">
          <router-link to="/products" class="btn btn-outline">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Shop by Category</h2>
          <p class="section-subtitle">Find exactly what you're looking for</p>
        </div>
        
        <div v-if="categoriesStore.loading" class="categories-grid">
          <div v-for="i in 4" :key="i" class="skeleton-card skeleton"></div>
        </div>
        
        <div v-else-if="categoriesStore.error" class="error-state">
          <p>{{ categoriesStore.error }}</p>
          <button @click="loadCategories" class="btn btn-primary">
            Try Again
          </button>
        </div>
        
        <div v-else class="categories-grid">
          <router-link
            v-for="category in categories"
            :key="category"
            :to="`/products?category=${category}`"
            class="category-card"
          >
            <div class="category-icon">
              <component :is="getCategoryIcon(category)" />
            </div>
            <h3 class="category-name">{{ formatCategoryName(category) }}</h3>
            <p class="category-description">{{ getCategoryDescription(category) }}</p>
            <span class="category-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Trust Strip -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="trust-content">
              <h4>Free Shipping</h4>
              <p>On orders above RWF 50,000</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <div class="trust-content">
              <h4>Secure Payment</h4>
              <p>100% secure transactions</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </div>
            <div class="trust-content">
              <h4>Local Support</h4>
              <p>24/7 customer service in Kigali</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div class="trust-content">
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'

const productsStore = useProductsStore()

// Reactive state
const categories = ref([])
const categoriesStore = ref({ loading: false, error: null })

// Computed properties
const featuredProducts = computed(() => productsStore.featured.slice(0, 8))

// Methods
async function loadFeaturedProducts() {
  await productsStore.fetchAll()
}

async function loadCategories() {
  categoriesStore.value.loading = true
  categoriesStore.value.error = null
  
  try {
    await productsStore.fetchCategories()
    categories.value = productsStore.categories
  } catch (error) {
    categoriesStore.value.error = 'Failed to load categories'
  } finally {
    categoriesStore.value.loading = false
  }
}

function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getCategoryDescription(category) {
  const descriptions = {
    'electronics': 'Latest gadgets and devices',
    'jewelery': 'Beautiful jewelry pieces',
    'mens-clothing': "Men's fashion and apparel",
    'womens-clothing': "Women's fashion and apparel"
  }
  return descriptions[category] || 'Explore this category'
}

function getCategoryIcon(category) {
  const icons = {
    'electronics': () => h('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z' })
    ]),
    'jewelery': () => h('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 2l.01 10.55c-.59-.34-1.27-.55-2-.55C7.79 12 6 13.79 6 16s1.79 4 4.01 4S14 18.21 14 16V8h4V6h-4V2h-2z' })
    ]),
    'mens-clothing': () => h('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M7 2v11h3v9l7-12h-4l4-8z' })
    ]),
    'womens-clothing': () => h('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M7 2v11h3v9l7-12h-4l4-8z' })
    ])
  }
  return icons[category] || icons['electronics']
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadFeaturedProducts(),
    loadCategories()
  ])
})
</script>

<style scoped>
.home-page {
  padding-top: 0;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--color-primary) 0%, 
    var(--color-secondary) 50%, 
    var(--color-accent) 100%);
}

.hero-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(0, 161, 222, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(250, 210, 1, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: 800;
  margin-bottom: var(--space-4);
  line-height: 1.1;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  font-size: var(--text-xl);
  font-style: italic;
  margin-bottom: var(--space-4);
  color: var(--color-accent);
  opacity: 1;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-description {
  font-size: var(--text-lg);
  margin-bottom: var(--space-6);
  color: white;
  opacity: 1;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-cta {
  animation: fadeInUp 0.8s ease-out 0.6s both;
  background: var(--color-surface);
  color: var(--color-primary);
  border: none;
  box-shadow: var(--shadow-lg);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 400px;
}

.floating-products {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-product {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

.product-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.product-2 {
  top: 40%;
  right: 20%;
  animation-delay: 2s;
}

.product-3 {
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

.product-mockup {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
}

.product-mockup:not(.laptop):not(.headphones) {
  width: 60px;
  height: 120px;
}

.product-mockup.laptop {
  width: 120px;
  height: 80px;
  border-radius: var(--radius-md);
}

.product-mockup.headphones {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.mockup-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  border-radius: inherit;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Styles */
.featured-section,
.categories-section {
  padding: var(--space-20) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

/* Featured Products Grid */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.section-footer {
  text-align: center;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.category-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent));
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-4);
  transition: transform var(--transition-normal);
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.category-description {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-4);
  flex: 1;
}

.category-arrow {
  font-size: var(--text-xl);
  color: var(--color-primary);
  font-weight: 700;
  transition: transform var(--transition-normal);
}

.category-card:hover .category-arrow {
  transform: translateX(4px);
}

/* Trust Section */
.trust-section {
  background: var(--gray-50);
  padding: var(--space-16) 0;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  text-align: left;
}

.trust-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trust-content h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.trust-content p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

/* Error State */
.error-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-danger);
}

.error-state p {
  margin-bottom: var(--space-4);
}

/* Skeleton Loading */
.skeleton-card {
  height: 300px;
  border-radius: var(--radius-lg);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    text-align: center;
  }
  
  .hero-visual {
    height: 300px;
  }
  
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 500px;
  }
  
  .hero-title {
    font-size: var(--text-4xl);
  }
  
  .hero-subtitle {
    font-size: var(--text-lg);
  }
  
  .featured-grid,
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }
  
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
  
  .trust-item {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 400px;
  }
  
  .hero-title {
    font-size: var(--text-3xl);
  }
  
  .hero-visual {
    height: 200px;
  }
  
  .floating-product.product-1 {
    top: 10%;
    left: 20%;
  }
  
  .floating-product.product-2 {
    top: 30%;
    right: 10%;
  }
  
  .floating-product.product-3 {
    bottom: 10%;
    left: 40%;
  }
  
  .featured-section,
  .categories-section {
    padding: var(--space-12) 0;
  }
  
  .section-title {
    font-size: var(--text-3xl);
  }
  
  .featured-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .trust-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .trust-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
