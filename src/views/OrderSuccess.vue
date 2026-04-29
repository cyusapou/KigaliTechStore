<template>
  <div class="order-success-page">
    <div class="container">
      <!-- Success Animation -->
      <div class="success-animation">
        <div class="success-circle">
          <svg class="success-checkmark" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>

      <!-- Success Message -->
      <div class="success-content">
        <h1 class="success-title">Thank you, {{ user?.name || 'Customer' }}!</h1>
        <p class="success-subtitle">Your order has been placed successfully</p>
        
        <!-- Order Details -->
        <div v-if="latestOrder" class="order-details">
          <h3>Order Summary</h3>
          <div class="order-info">
            <div class="info-row">
              <span>Order ID:</span>
              <span class="order-id">#{{ latestOrder.id }}</span>
            </div>
            <div class="info-row">
              <span>Date:</span>
              <span>{{ formatDate(latestOrder.date) }}</span>
            </div>
            <div class="info-row">
              <span>Total:</span>
              <span class="order-total">${{ latestOrder.total.toFixed(2) }}</span>
            </div>
            <div class="info-row">
              <span>Status:</span>
              <span class="order-status">{{ latestOrder.status }}</span>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="order-items">
            <h4>Items Ordered</h4>
            <div class="items-grid">
              <div 
                v-for="item in latestOrder.items"
                :key="item.id"
                class="order-item"
              >
                <img :src="item.image" :alt="item.title" />
                <div class="item-info">
                  <h5>{{ item.title }}</h5>
                  <p>Qty: {{ item.qty }} × ${{ item.price }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Delivery Address -->
          <div v-if="latestOrder.address" class="delivery-address">
            <h4>Delivery Address</h4>
            <div class="address-info">
              <p><strong>{{ latestOrder.address.fullName }}</strong></p>
              <p>{{ latestOrder.address.phone }}</p>
              <p>{{ latestOrder.address.address }}</p>
              <p>{{ latestOrder.address.sector }}, {{ latestOrder.address.district }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="success-actions">
          <router-link to="/products" class="btn btn-primary btn-lg">
            Continue Shopping
          </router-link>
          <router-link to="/profile/orders" class="btn btn-outline btn-lg">
            View Orders
          </router-link>
        </div>

        <!-- Additional Info -->
        <div class="success-info">
          <div class="info-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Order confirmation sent to your email</span>
          </div>
          <div class="info-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Track your order in profile section</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const latestOrder = computed(() => authStore.orders[0])

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
.order-success-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-surface) 100%);
}

.success-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

/* Success Animation */
.success-animation {
  margin-bottom: var(--space-8);
}

.success-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: var(--color-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.6s ease-out;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.success-checkmark {
  color: white;
  animation: checkmark 0.4s ease-out 0.3s both;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(-45deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Success Content */
.success-title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.success-subtitle {
  font-size: var(--text-xl);
  color: var(--gray-600);
  margin-bottom: var(--space-8);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Order Details */
.order-details {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-lg);
  text-align: left;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.order-details h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
  text-align: center;
}

.order-info {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-base);
}

.info-row span:first-child {
  color: var(--gray-600);
}

.order-id {
  font-weight: 600;
  color: var(--color-primary);
  font-family: monospace;
}

.order-total {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--text-lg);
}

.order-status {
  padding: var(--space-1) var(--space-3);
  background: var(--color-success);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
}

/* Order Items */
.order-items {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
}

.order-items h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 200px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.order-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.item-info h5 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.3;
}

.item-info p {
  font-size: var(--text-xs);
  color: var(--gray-600);
  margin: 0;
}

/* Delivery Address */
.delivery-address h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.address-info p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: var(--space-1) 0;
}

/* Action Buttons */
.success-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-8);
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

/* Success Info */
.success-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  animation: fadeInUp 0.6s ease-out 1s both;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.info-item svg {
  color: var(--color-success);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .success-circle {
    width: 100px;
    height: 100px;
  }
  
  .success-checkmark {
    width: 60px;
    height: 60px;
  }
  
  .success-title {
    font-size: var(--text-3xl);
  }
  
  .success-subtitle {
    font-size: var(--text-lg);
  }
  
  .order-details {
    padding: var(--space-6);
  }
  
  .success-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .info-row {
    font-size: var(--text-sm);
  }
}
</style>
