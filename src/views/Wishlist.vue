<template>
  <div class="wishlist-page">
    <div class="container">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />
      
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Wishlist</h1>
        <p class="page-subtitle">{{ wishlistStore.count }} items saved</p>
      </div>

      <!-- Empty State -->
      <div v-if="wishlistStore.count === 0" class="empty-wishlist">
        <div class="empty-wishlist-content">
          <div class="empty-wishlist-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love to your wishlist!</p>
          <router-link to="/products" class="btn btn-primary btn-lg">
            Browse Products
          </router-link>
        </div>
      </div>

      <!-- Wishlist Items -->
      <div v-else class="wishlist-content">
        <div class="wishlist-grid">
          <div 
            v-for="item in wishlistStore.items"
            :key="item.id"
            class="wishlist-item"
          >
            <div class="wishlist-item-image">
              <img 
                :src="item.image" 
                :alt="item.title"
                @error="handleImageError"
              />
              <button 
                @click="removeFromWishlist(item.id)"
                class="remove-wishlist-btn"
                :aria-label="`Remove ${item.title} from wishlist`"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <div class="wishlist-item-details">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-category">{{ formatCategoryName(item.category) }}</p>
              
              <div class="item-price">
                <span class="current-price">${{ formatPrice(item.price) }}</span>
                <span class="currency-conversion">RWF {{ formatRWF(item.price) }}</span>
              </div>
              
              <div class="item-actions">
                <button 
                  @click="moveToCart(item.id)"
                  :disabled="loading === item.id"
                  class="btn btn-primary btn-sm move-to-cart-btn"
                >
                  <span v-if="loading === item.id" class="spinner"></span>
                  <span v-else>Move to Cart</span>
                </button>
                
                <router-link 
                  :to="`/products/${item.id}`"
                  class="btn btn-outline btn-sm view-details-btn"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist Actions -->
        <div class="wishlist-actions">
          <button 
            @click="addAllToCart"
            :disabled="loadingAll || wishlistStore.count === 0"
            class="btn btn-secondary"
          >
            <span v-if="loadingAll" class="spinner"></span>
            <span v-else>Add All to Cart</span>
          </button>
          
          <button 
            @click="clearWishlist"
            :disabled="wishlistStore.count === 0"
            class="btn btn-ghost"
          >
            Clear Wishlist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const toast = useToast()

// Reactive state
const loading = ref(null)
const loadingAll = ref(false)

// Computed properties
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Wishlist' }
])

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

function handleImageError() {
  // Handle image error if needed
}

async function removeFromWishlist(itemId) {
  const item = wishlistStore.items.find(i => i.id === itemId)
  if (!item) return
  
  wishlistStore.remove(itemId)
  toast.success(`${item.title} removed from wishlist`)
}

async function moveToCart(itemId) {
  const item = wishlistStore.items.find(i => i.id === itemId)
  if (!item) return
  
  loading.value = itemId
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    wishlistStore.moveToCart(itemId)
    toast.success(`${item.title} moved to cart!`)
  } catch (error) {
    toast.error('Failed to move item to cart')
  } finally {
    loading.value = null
  }
}

async function addAllToCart() {
  loadingAll.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const itemsToMove = [...wishlistStore.items]
    for (const item of itemsToMove) {
      wishlistStore.moveToCart(item.id)
    }
    
    toast.success(`${itemsToMove.length} items moved to cart!`)
  } catch (error) {
    toast.error('Failed to move items to cart')
  } finally {
    loadingAll.value = false
  }
}

function clearWishlist() {
  if (confirm('Are you sure you want to clear your entire wishlist?')) {
    wishlistStore.clear()
    toast.success('Wishlist cleared')
  }
}
</script>

<style scoped>
.wishlist-page {
  padding: var(--space-6) 0;
}

.breadcrumb {
  margin-bottom: var(--space-6);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

/* Empty State */
.empty-wishlist {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-12);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.empty-wishlist-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.empty-wishlist-icon {
  width: 120px;
  height: 120px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-4xl);
  margin-bottom: var(--space-6);
}

.empty-wishlist h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.empty-wishlist p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

/* Wishlist Content */
.wishlist-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.wishlist-item {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.wishlist-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.wishlist-item-image {
  .product-image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: var(--color-surface);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform var(--transition-normal);
    padding: var(--space-2);
  }
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform var(--transition-normal);
  padding: var(--space-2);
}

.wishlist-item:hover .wishlist-item-image img {
  transform: scale(1.05);
}

.remove-wishlist-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
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

.remove-wishlist-btn:hover {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
  transform: scale(1.1);
}

.wishlist-item-details {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
}

.item-title {
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

.item-category {
  font-size: var(--text-sm);
  color: var(--gray-500);
  margin: 0;
}

.item-price {
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

.item-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: auto;
}

.move-to-cart-btn,
.view-details-btn {
  flex: 1;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Wishlist Actions */
.wishlist-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

/* Responsive Design */
@media (max-width: 768px) {
  .wishlist-page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-4);
  }
  
  .wishlist-item-image {
    height: 160px;
  }
  
  .item-actions {
    flex-direction: column;
  }
  
  .view-details-btn {
    order: -1;
  }
  
  .wishlist-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .wishlist-item-details {
    padding: var(--space-3);
  }
  
  .item-title {
    font-size: var(--text-sm);
  }
  
  .current-price {
    font-size: var(--text-base);
  }
  
  .empty-wishlist-content {
    gap: var(--space-4);
  }
  
  .empty-wishlist-icon {
    width: 80px;
    height: 80px;
  }
  
  .empty-wishlist h2 {
    font-size: var(--text-xl);
  }
  
  .empty-wishlist p {
    font-size: var(--text-base);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
