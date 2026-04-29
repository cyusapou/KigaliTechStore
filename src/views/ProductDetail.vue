<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />
      
      <div v-if="productsStore.loading" class="product-loading">
        <LoadingSpinner size="60px" text="Loading product..." />
      </div>
      
      <div v-else-if="!product" class="not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <router-link to="/products" class="btn btn-primary">
          Browse Products
        </router-link>
      </div>
      
      <div v-else class="product-content">
        <div class="product-main">
          <!-- Product Gallery -->
          <div class="product-gallery">
            <div class="main-image-container">
              <img 
                ref="mainImageRef"
                :src="product.image" 
                :alt="product.title"
                class="main-image"
                @error="handleImageError"
                @mouseenter="showMagnifier = true"
                @mouseleave="showMagnifier = false"
                @mousemove="updateMagnifier"
              />
              <div 
                v-if="showMagnifier"
                class="magnifier"
                :style="magnifierStyle"
              ></div>
              <div class="image-overlay">
                <button 
                  @click="toggleWishlist"
                  class="wishlist-btn"
                  :class="{ active: isWished }"
                  :aria-label="isWished ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Thumbnail Images -->
            <div class="thumbnail-list">
              <button
                v-for="i in 4"
                :key="i"
                @click="selectImage(i)"
                :class="['thumbnail-btn', { active: selectedImage === i }]"
                :aria-label="`View image ${i}`"
              >
                <img 
                  :src="product.image" 
                  :alt="`${product.title} - Image ${i}`"
                  class="thumbnail-image"
                />
              </button>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="product-info">
            <div class="product-header">
              <span class="category-badge">{{ product.category }}</span>
              <h1 class="product-title">{{ product.title }}</h1>
              
              <div class="product-rating">
                <RatingStars :rating="product.rating?.rate || 0" :count="product.rating?.count || 0" />
              </div>
            </div>
            
            <div class="product-price-section">
              <div class="price-row">
                <span class="current-price">${{ formatPrice(product.price) }}</span>
                <span class="currency-conversion">RWF {{ formatRWF(product.price) }}</span>
              </div>
              <div class="price-info">
                <span class="tax-info">Includes 18% VAT</span>
                <span class="shipping-info">Free shipping on orders above RWF 50,000</span>
              </div>
            </div>
            
            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>
            
            <!-- Add to Cart Section -->
            <div class="add-to-cart-section">
              <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <div class="quantity-stepper">
                  <button 
                    @click="decrementQuantity"
                    :disabled="quantity <= 1"
                    class="stepper-btn"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    max="99"
                    class="quantity-input"
                  />
                  <button 
                    @click="incrementQuantity"
                    :disabled="quantity >= 99"
                    class="stepper-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div class="action-buttons">
                <button 
                  @click="addToCart"
                  :disabled="loading"
                  class="btn btn-primary btn-lg add-to-cart-btn"
                >
                  <span v-if="loading" class="spinner"></span>
                  <span v-else>Add to Cart</span>
                </button>
                
                <button 
                  @click="buyNow"
                  :disabled="loading"
                  class="btn btn-accent btn-lg buy-now-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>
            
            <!-- Product Features -->
            <div class="product-features">
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>In Stock</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Authentic Products</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>1 Year Warranty</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Related Products -->
        <section class="related-products">
          <h2>Related Products</h2>
          <div v-if="relatedProducts.length > 0" class="related-grid">
            <ProductCard 
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              :product="relatedProduct"
            />
          </div>
          <div v-else class="no-related">
            <p>No related products found</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useToast } from '@/composables/useToast'
import ProductCard from '@/components/products/ProductCard.vue'
import RatingStars from '@/components/products/RatingStars.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toast = useToast()

// Reactive state
const quantity = ref(1)
const selectedImage = ref(1)
const loading = ref(false)
const showMagnifier = ref(false)
const magnifierStyle = ref({})
const mainImageRef = ref(null)

// Computed properties
const product = computed(() => {
  const id = route.params.id
  return productsStore.byId(id)
})

const isWished = computed(() => {
  return product.value ? wishlistStore.isWished(product.value.id) : false
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  
  return productsStore.all
    .filter(p => 
      p.category === product.value.category && 
      p.id !== product.value.id
    )
    .slice(0, 4)
})

const breadcrumbItems = computed(() => {
  if (!product.value) return []
  
  return [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: formatCategoryName(product.value.category), to: `/products?category=${product.value.category}` },
    { label: product.value.title }
  ]
})

// Methods
function formatPrice(price) {
  return price.toFixed(2)
}

function formatRWF(price) {
  return (price * 1300).toLocaleString('rw-RW')
}

function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function incrementQuantity() {
  if (quantity.value < 99) {
    quantity.value++
  }
}

function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function selectImage(index) {
  selectedImage.value = index
}

function handleImageError() {
  // Handle image error if needed
}

async function addToCart() {
  if (!product.value) return
  
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    for (let i = 0; i < quantity.value; i++) {
      cartStore.add(product.value)
    }
    
    toast.success(`${quantity.value} × ${product.value.title} added to cart!`)
    quantity.value = 1
  } catch (error) {
    toast.error('Failed to add item to cart')
  } finally {
    loading.value = false
  }
}

async function buyNow() {
  if (!product.value) return
  
  await addToCart()
  router.push('/cart')
}

function toggleWishlist() {
  if (!product.value) return
  
  wishlistStore.toggle(product.value)
  const action = isWished.value ? 'added to' : 'removed from'
  toast.success(`${product.value.title} ${action} wishlist!`)
}

function updateMagnifier(event) {
  if (!mainImageRef.value) return
  
  const rect = mainImageRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Calculate position for magnifier (positioned aside from cursor)
  const magnifierSize = 150
  const offset = 20 // Distance from cursor
  const magnifierX = x + offset
  const magnifierY = y - magnifierSize / 2
  
  // Keep magnifier within image bounds
  const maxX = rect.width - magnifierSize
  const maxY = rect.height - magnifierSize
  const finalX = Math.min(Math.max(0, magnifierX), maxX)
  const finalY = Math.min(Math.max(0, magnifierY), maxY)
  
  // Calculate background position for magnified view (cursor at center of magnified area)
  const bgX = -(x * 2 - magnifierSize / 2)
  const bgY = -(y * 2 - magnifierSize / 2)
  
  magnifierStyle.value = {
    left: `${finalX}px`,
    top: `${finalY}px`,
    backgroundImage: `url(${product.value.image})`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    backgroundSize: `${rect.width * 2}px ${rect.height * 2}px`
  }
}

// Lifecycle
onMounted(async () => {
  if (productsStore.all.length === 0) {
    await productsStore.fetchAll()
  }
})
</script>

<style scoped>
.product-detail-page {
  padding: var(--space-6) 0;
}

.breadcrumb {
  margin-bottom: var(--space-6);
}

/* Loading State */
.product-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Not Found State */
.not-found {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.not-found h2 {
  font-size: var(--text-2xl);
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.not-found p {
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}

/* Product Content */
.product-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}

/* Product Gallery */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.main-image-container {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform var(--transition-normal);
  padding: var(--space-4);
  cursor: crosshair;
}

.magnifier {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 10;
  background-repeat: no-repeat;
  opacity: 0;
  animation: fadeIn 0.2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.image-overlay {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
}

.wishlist-btn {
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-600);
  box-shadow: var(--shadow-sm);
}

.wishlist-btn:hover {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

.thumbnail-list {
  display: flex;
  gap: var(--space-2);
}

.thumbnail-btn {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-surface);
}

.thumbnail-btn:hover {
  border-color: var(--color-primary);
}

.thumbnail-btn.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 161, 222, 0.2);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.category-badge {
  align-self: flex-start;
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.2;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* Price Section */
.product-price-section {
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-400);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.current-price {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-primary);
}

.currency-conversion {
  font-size: var(--text-lg);
  color: var(--gray-600);
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.tax-info,
.shipping-info {
  font-size: var(--text-sm);
  color: var(--gray-600);
}

/* Description */
.product-description h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.product-description p {
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

/* Add to Cart Section */
.add-to-cart-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.quantity-selector label {
  font-weight: 500;
  color: var(--gray-700);
  min-width: 80px;
}

.quantity-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.stepper-btn {
  width: 40px;
  height: 40px;
  background: var(--gray-200);
  border: none;
  cursor: pointer;
  font-size: var(--text-lg);
  color: var(--gray-700);
  transition: background var(--transition-fast);
}

.stepper-btn:hover:not(:disabled) {
  background: var(--gray-300);
}

.stepper-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--gray-300);
  border-right: 1px solid var(--gray-300);
  font-size: var(--text-base);
  font-weight: 500;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.add-to-cart-btn,
.buy-now-btn {
  min-height: 48px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Product Features */
.product-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-400);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--gray-700);
}

.feature-item svg {
  color: var(--color-success);
  flex-shrink: 0;
}

/* Related Products */
.related-products {
  padding-top: var(--space-8);
  border-top: 2px solid var(--gray-200);
}

.related-products h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.no-related {
  text-align: center;
  padding: var(--space-8);
  color: var(--gray-600);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .product-gallery {
    order: 1;
  }
  
  .product-info {
    order: 2;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .product-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: var(--space-4) 0;
  }
  
  .product-title {
    font-size: var(--text-2xl);
  }
  
  .current-price {
    font-size: var(--text-3xl);
  }
  
  .thumbnail-list {
    justify-content: center;
  }
  
  .thumbnail-btn {
    width: 60px;
    height: 60px;
  }
  
  .related-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-4);
  }
}

@media (max-width: 640px) {
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .quantity-selector label {
    min-width: auto;
  }
  
  .quantity-stepper {
    width: 100%;
    max-width: 200px;
  }
  
  .product-features {
    padding: var(--space-4);
    gap: var(--space-3);
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
