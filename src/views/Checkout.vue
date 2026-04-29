<template>
  <div class="checkout-page">
    <div class="container">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />
      
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Checkout</h1>
        <p class="page-subtitle">Complete your order securely</p>
      </div>

      <div v-if="cartStore.isEmpty" class="empty-checkout">
        <div class="empty-content">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart before checkout</p>
          <router-link to="/products" class="btn btn-primary">
            Browse Products
          </router-link>
        </div>
      </div>

      <div v-else class="checkout-content">
        <div class="checkout-grid">
          <!-- Left Column - Forms -->
          <div class="checkout-forms">
            <!-- Address Form -->
            <AddressForm 
              ref="addressFormRef"
              @submit="handleAddressSubmit"
              @form-valid="handleFormValidity"
              :saving="savingAddress"
            />
            
            <!-- Order Review -->
            <div class="order-review">
              <h3>Order Review</h3>
              <div class="review-items">
                <div 
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="review-item"
                >
                  <img :src="item.image" :alt="item.title" />
                  <div class="item-details">
                    <h4>{{ item.title }}</h4>
                    <p>Qty: {{ item.qty }}</p>
                  </div>
                  <div class="item-price">
                    ${{ (item.price * item.qty).toFixed(2) }}
                  </div>
                </div>
              </div>
              
              <div class="review-totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>${{ cartStore.subtotal.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Tax (18%)</span>
                  <span>${{ cartStore.tax.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span v-if="cartStore.shipping === 0">FREE</span>
                  <span v-else>${{ (cartStore.shipping / 1300).toFixed(2) }}</span>
                </div>
                <div class="total-row final">
                  <span>Total</span>
                  <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Payment -->
          <div class="payment-section">
            <div class="payment-card">
              <h3>Payment Information</h3>
              
              <!-- Stripe Card Element -->
              <div class="card-element-container">
                <div id="card-element" class="card-element"></div>
                <div id="card-errors" class="card-errors" role="alert"></div>
              </div>

              <!-- Test Card Info -->
              <div class="test-card-info">
                <h4>Test Card Details</h4>
                <div class="test-card-details">
                  <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>CVC:</strong> Any 3 digits</p>
                  <p><strong>ZIP:</strong> Any 5 digits</p>
                </div>
              </div>

              <!-- Payment Button -->
              <button 
                @click="handlePayment"
                :disabled="processing || !addressComplete"
                class="btn btn-primary btn-lg payment-btn"
              >
                <span v-if="processing" class="spinner"></span>
                <span v-else>Pay ${{ cartStore.total.toFixed(2) }}</span>
              </button>

              <!-- Security Info -->
              <div class="security-badges">
                <div class="security-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div class="security-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useStripe } from '@/composables/useStripe'
import AddressForm from '@/components/forms/AddressForm.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const stripe = useStripe()

// Reactive state
const processing = ref(false)
const savingAddress = ref(false)
const addressComplete = ref(false)
const addressFormRef = ref(null)
const cardElement = ref(null)
const elements = ref(null)

// Computed properties
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout' }
])

// Methods
async function initializeStripe() {
  try {
    const stripeInstance = await stripe.getStripe()
    if (!stripeInstance) {
      throw new Error('Failed to initialize Stripe')
    }

    elements.value = stripeInstance.elements()
    cardElement.value = elements.value.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1A1A2E',
          '::placeholder': {
            color: '#6B7280',
          },
          iconColor: '#00A1DE',
        },
        invalid: {
          color: '#EF4444',
          iconColor: '#EF4444',
        },
      },
      hidePostalCode: false,
    })

    cardElement.value.mount('#card-element')

    // Handle real-time validation errors
    cardElement.value.on('change', ({ error }) => {
      const displayError = document.getElementById('card-errors')
      if (error) {
        displayError.textContent = error.message
      } else {
        displayError.textContent = ''
      }
    })
  } catch (error) {
    console.error('Stripe initialization error:', error)
    toast.error('Failed to initialize payment system')
  }
}

function handleAddressSubmit() {
  savingAddress.value = true
  
  // Simulate saving process
  setTimeout(() => {
    addressComplete.value = true
    savingAddress.value = false
    toast.success('Delivery address saved successfully!')
  }, 1000)
}

function handleFormValidity(isValid) {
  addressComplete.value = isValid
}

async function handlePayment() {
  if (!addressComplete.value) {
    toast.error('Please complete delivery address first')
    return
  }

  if (!cardElement.value) {
    toast.error('Payment system not ready')
    return
  }

  processing.value = true

  try {
    // Create payment intent
    const paymentIntent = await stripe.createPaymentIntent(
      Math.round(cartStore.total * 100), // Convert to cents
      'usd'
    )

    // Confirm payment
    const result = await stripe.confirmPayment(
      paymentIntent.client_secret,
      cardElement.value
    )

    if (result.paymentIntent) {
      // Payment successful
      const orderData = {
        items: cartStore.items,
        total: cartStore.total,
        address: addressFormRef.value.formData,
        paymentId: result.paymentIntent.id,
        date: new Date().toISOString()
      }

      // Save order to auth store
      authStore.saveOrder(orderData)

      // Clear cart
      cartStore.clear()

      // Redirect to success page
      router.push('/order-success')
      toast.success('Payment successful! Order placed.')
    }
  } catch (error) {
    console.error('Payment error:', error)
    toast.error(error.message || 'Payment failed. Please try again.')
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/checkout' } })
    return
  }

  await initializeStripe()
})

onUnmounted(() => {
  if (cardElement.value) {
    cardElement.value.destroy()
  }
})
</script>

<style scoped>
.checkout-page {
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

.empty-checkout {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-content h2 {
  font-size: var(--text-2xl);
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.empty-content p {
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}

.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-8);
}

.checkout-forms {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.order-review {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--gray-400);
}

.order-review h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  max-height: 300px;
  overflow-y: auto;
}

.review-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.review-item img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.3;
}

.item-details p {
  font-size: var(--text-xs);
  color: var(--gray-600);
  margin: 0;
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.review-totals {
  border-top: 1px solid var(--gray-200);
  padding-top: var(--space-4);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.total-row.final {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  border-top: 2px solid var(--gray-300);
  margin-top: var(--space-2);
  padding-top: var(--space-4);
}

/* Payment Section */
.payment-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.payment-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-400);
}

.payment-card h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.card-element-container {
  margin-bottom: var(--space-6);
}

.card-element {
  padding: var(--space-4);
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.card-element:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

.card-errors {
  color: var(--color-danger);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
  min-height: 20px;
}

.test-card-info {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.test-card-info h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.test-card-details p {
  font-size: var(--text-xs);
  color: var(--gray-600);
  margin: var(--space-1) 0;
  font-family: monospace;
}

.payment-btn {
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

.security-badges {
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
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .payment-section {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .review-item {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2);
  }
  
  .security-badges {
    flex-direction: column;
    gap: var(--space-2);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
