<template>
  <div class="cart-page">
    <div class="container">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />
      
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Shopping Cart</h1>
        <p class="page-subtitle">{{ cartStore.count }} items in your cart</p>
      </div>

      <div class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items-section">
          <!-- Empty State -->
          <div v-if="cartStore.isEmpty" class="empty-cart">
            <div class="empty-cart-content">
              <div class="empty-cart-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <router-link to="/products" class="btn btn-primary btn-lg">
                Start Shopping
              </router-link>
            </div>
          </div>

          <!-- Cart Items List -->
          <div v-else class="cart-items">
            <CartItem 
              v-for="item in cartStore.items"
              :key="item.id"
              :item="item"
            />
          </div>

          <!-- Cart Actions -->
          <div v-if="!cartStore.isEmpty" class="cart-actions">
            <button @click="clearCart" class="btn btn-ghost">
              Clear Cart
            </button>
            <router-link to="/products" class="btn btn-outline">
              Continue Shopping
            </router-link>
          </div>
        </div>

        <!-- Order Summary -->
        <div v-if="!cartStore.isEmpty" class="order-summary">
          <div class="summary-card">
            <h2 class="summary-title">Order Summary</h2>
            
            <!-- Coupon Code -->
            <div class="coupon-section">
              <div class="coupon-input-group">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Enter coupon code"
                  class="coupon-input"
                  @keyup.enter="applyCoupon"
                />
                <button 
                  @click="applyCoupon"
                  :disabled="!couponCode.trim()"
                  class="btn btn-outline btn-sm"
                >
                  Apply
                </button>
              </div>
              <div v-if="couponApplied" class="coupon-applied">
                <span class="coupon-success">Coupon applied: {{ couponCode }}</span>
                <button @click="removeCoupon" class="remove-coupon">
                  Remove
                </button>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="price-breakdown">
              <div class="price-row">
                <span>Subtotal ({{ cartStore.count }} items)</span>
                <span>${{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              
              <div class="price-row">
                <span>Tax (18% VAT)</span>
                <span>${{ formatPrice(cartStore.tax) }}</span>
              </div>
              
              <div class="price-row">
                <span>Shipping</span>
                <span v-if="cartStore.shipping === 0" class="free-shipping">FREE</span>
                <span v-else>RWF {{ cartStore.shipping.toLocaleString() }}</span>
              </div>
              
              <div v-if="discountAmount > 0" class="price-row discount">
                <span>Discount ({{ couponCode }})</span>
                <span>-${{ formatPrice(discountAmount) }}</span>
              </div>
              
              <div class="price-row total">
                <span>Total</span>
                <span class="total-amount">${{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <!-- Currency Conversion -->
            <div class="currency-conversion">
              <span class="conversion-text">
                Total: RWF {{ formatRWF(finalTotal) }}
              </span>
            </div>

            <!-- Checkout Button -->
            <button 
              @click="proceedToCheckout"
              :disabled="loading"
              class="btn btn-primary btn-lg checkout-btn"
            >
              <span v-if="loading" class="spinner"></span>
              <span v-else>Proceed to Checkout</span>
            </button>

            <!-- Security Info -->
            <div class="security-info">
              <div class="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div class="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span>Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import CartItem from '@/components/cart/CartItem.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

// Reactive state
const couponCode = ref('')
const couponApplied = ref(false)
const loading = ref(false)

// Computed properties
const discountAmount = computed(() => {
  if (!couponApplied.value) return 0
  return cartStore.subtotal * 0.1 // 10% discount for KIGALI10
})

const finalTotal = computed(() => {
  return cartStore.total - discountAmount.value
})

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart' }
])

// Methods
function formatPrice(price) {
  return price.toFixed(2)
}

function formatRWF(price) {
  return (price * 1300).toLocaleString('rw-RW')
}

function applyCoupon() {
  const code = couponCode.value.trim().toUpperCase()
  
  if (code === 'KIGALI10') {
    couponApplied.value = true
    toast.success('Coupon applied successfully! 10% discount added.')
  } else {
    toast.error('Invalid coupon code')
  }
}

function removeCoupon() {
  couponApplied.value = false
  couponCode.value = ''
  toast.info('Coupon removed')
}

function clearCart() {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    cartStore.clear()
    toast.success('Cart cleared')
  }
}

async function proceedToCheckout() {
  if (!authStore.isAuthenticated) {
    toast.info('Please login to proceed to checkout')
    router.push({ 
      name: 'Login', 
      query: { redirect: '/checkout' } 
    })
    return
  }
  
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/checkout')
  } catch (error) {
    toast.error('Failed to proceed to checkout')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cart-page {
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-8);
}

/* Cart Items Section */
.cart-items-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.empty-cart {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-12);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.empty-cart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.empty-cart-icon {
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

.empty-cart h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.empty-cart p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-400);
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-400);
}

.summary-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

/* Coupon Section */
.coupon-section {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
}

.coupon-input-group {
  display: flex;
  gap: var(--space-2);
}

.coupon-input {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.coupon-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

.coupon-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-md);
  margin-top: var(--space-2);
}

.coupon-success {
  font-size: var(--text-sm);
  color: var(--color-success);
  font-weight: 500;
}

.remove-coupon {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: var(--text-xs);
  cursor: pointer;
  text-decoration: underline;
}

/* Price Breakdown */
.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.price-row.discount {
  color: var(--color-success);
}

.price-row.total {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  padding-top: var(--space-3);
  border-top: 2px solid var(--gray-200);
}

.total-amount {
  color: var(--color-primary);
}

.free-shipping {
  color: var(--color-success);
  font-weight: 500;
}

/* Currency Conversion */
.currency-conversion {
  text-align: center;
  margin-bottom: var(--space-6);
}

.conversion-text {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  margin-bottom: var(--space-4);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Security Info */
.security-info {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-200);
}

.security-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--gray-500);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .order-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .cart-actions {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }
  
  .coupon-input-group {
    flex-direction: column;
  }
  
  .security-info {
    flex-direction: column;
    gap: var(--space-2);
  }
}

@media (max-width: 640px) {
  .empty-cart-content {
    gap: var(--space-4);
  }
  
  .empty-cart-icon {
    width: 80px;
    height: 80px;
  }
  
  .empty-cart h2 {
    font-size: var(--text-xl);
  }
  
  .empty-cart p {
    font-size: var(--text-base);
  }
  
  .summary-card {
    padding: var(--space-4);
  }
  
  .price-row {
    font-size: 0.75rem;
  }
  
  .price-row.total {
    font-size: var(--text-base);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
