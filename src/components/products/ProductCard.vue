<template>
  <router-link :to="`/products/${product.id}`" class="product-card card">
    <div class="product-image-container">
      <img 
        :src="product.image" 
        :alt="product.title"
        class="product-image"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="product-badges">
        <span class="badge badge-primary">{{ product.category }}</span>
        <span v-if="isOnSale" class="badge badge-danger">Sale</span>
      </div>
      <button 
        @click="toggleWishlist"
        class="wishlist-btn"
        :class="{ active: isWished }"
        :aria-label="isWished ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
    
    <div class="product-content">
      <h3 class="product-title">{{ product.title }}</h3>
      
      <div class="product-rating">
        <RatingStars :rating="product.rating?.rate || 0" :count="product.rating?.count || 0" />
      </div>
      
      <div class="product-price">
        <span class="current-price">${{ formatPrice(product.price) }}</span>
        <span class="currency-conversion">RWF {{ formatRWF(product.price) }}</span>
      </div>
      
      <p class="product-description">{{ truncatedDescription }}</p>
      
      <div class="product-actions">
        <button 
          @click="addToCart"
          class="btn btn-primary btn-sm add-to-cart"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>Add to Cart</span>
        </button>
        
        <button 
          @click.stop="viewDetails"
          class="btn btn-outline btn-sm view-details"
        >
          View Details
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useToast } from '@/composables/useToast'
import RatingStars from './RatingStars.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toast = useToast()

const loading = ref(false)
const imageError = ref(false)

const isWished = computed(() => wishlistStore.isWished(props.product.id))
const truncatedDescription = computed(() => {
  return props.product.description.length > 100 
    ? props.product.description.substring(0, 100) + '...'
    : props.product.description
})

const isOnSale = computed(() => {
  // Mock sale logic - you could add a sale price to the product
  return Math.random() > 0.7 // 30% chance of being on sale
})

function formatPrice(price) {
  return price.toFixed(2)
}

function formatRWF(price) {
  return (price * 1300).toLocaleString('rw-RW')
}

function handleImageError() {
  imageError.value = true
}

async function addToCart() {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
    cartStore.add(props.product)
    toast.success(`${props.product.title} added to cart!`)
  } catch (error) {
    toast.error('Failed to add item to cart')
  } finally {
    loading.value = false
  }
}

function toggleWishlist() {
  wishlistStore.toggle(props.product)
  const action = isWished.value ? 'added to' : 'removed from'
  toast.success(`${props.product.title} ${action} wishlist!`)
}

function viewDetails() {
  router.push(`/products/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.product-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform var(--transition-normal);
  padding: var(--space-2);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.wishlist-btn {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 36px;
  height: 36px;
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

.product-content {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.product-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.current-price {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.currency-conversion {
  font-size: var(--text-xs);
  color: var(--gray-500);
}

.product-description {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.product-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: auto;
}

.add-to-cart {
  flex: 1;
}

.view-details {
  flex-shrink: 0;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .product-image-container {
    height: 160px;
  }
  
  .product-content {
    padding: var(--space-3);
  }
  
  .product-title {
    font-size: var(--text-sm);
  }
  
  .current-price {
    font-size: var(--text-base);
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .view-details {
    order: -1;
  }
}
</style>
