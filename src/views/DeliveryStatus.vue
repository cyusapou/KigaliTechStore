<template>
  <div class="delivery-status-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Order Delivery Status</h1>
        <p class="page-subtitle">Track your order from our store to your doorstep</p>
      </div>

      <!-- Order Selection -->
      <div class="order-selection">
        <label for="order-select">Select Order:</label>
        <select id="order-select" v-model="selectedOrderId" @change="loadOrderDetails" class="order-select">
          <option value="">Choose an order...</option>
          <option v-for="order in orders" :key="order.id" :value="order.id">
            Order #{{ order.id }} - {{ order.date }} - ${{ order.total }}
          </option>
        </select>
      </div>

      <!-- Order Details -->
      <div v-if="selectedOrder" class="order-details">
        <!-- Order Info -->
        <div class="order-info">
          <div class="order-header">
            <h2>Order #{{ selectedOrder.id }}</h2>
            <div class="order-meta">
              <span class="order-date">{{ selectedOrder.date }}</span>
              <span class="order-total">${{ selectedOrder.total }}</span>
            </div>
          </div>
          <div class="order-status-badge" :class="getStatusClass()">
            {{ getStatusText() }}
          </div>
        </div>

        <!-- Delivery Timeline -->
        <div class="delivery-timeline">
          <h3>Delivery Timeline</h3>
          <div class="timeline">
            <div 
              v-for="(step, index) in deliverySteps" 
              :key="step.id"
              class="timeline-step"
              :class="getStepClass(step)"
            >
              <div class="timeline-marker">
                <div class="timeline-dot"></div>
                <div v-if="index < deliverySteps.length - 1" class="timeline-line"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>{{ step.title }}</h4>
                  <span class="timeline-time">{{ step.time }}</span>
                </div>
                <p class="timeline-description">{{ step.description }}</p>
                <div v-if="step.location" class="timeline-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {{ step.location }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="order-products">
          <h3>Order Items</h3>
          <div class="product-list">
            <div v-for="item in selectedOrder.items" :key="item.id" class="product-item">
              <img :src="item.image" :alt="item.title" class="product-image">
              <div class="product-info">
                <h4>{{ item.title }}</h4>
                <p>Quantity: {{ item.quantity }}</p>
                <p class="product-price">${{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="delivery-info">
          <h3>Delivery Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Estimated Delivery:</label>
              <p>{{ selectedOrder.estimatedDelivery }}</p>
            </div>
            <div class="info-item">
              <label>Delivery Address:</label>
              <p>{{ selectedOrder.deliveryAddress }}</p>
            </div>
            <div class="info-item">
              <label>Tracking Number:</label>
              <p>{{ selectedOrder.trackingNumber }}</p>
            </div>
            <div class="info-item">
              <label>Carrier:</label>
              <p>{{ selectedOrder.carrier }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="order-actions">
          <button class="btn btn-outline" @click="contactSupport">Contact Support</button>
          <button class="btn btn-primary" @click="trackPackage">Track Package</button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3>No Order Selected</h3>
        <p>Please select an order to view its delivery status</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const selectedOrderId = ref('')
const orders = ref([
  {
    id: 'ORD-001',
    date: '2024-01-15',
    total: '299.99',
    status: 'delivered',
    estimatedDelivery: 'January 20, 2024',
    deliveryAddress: '123 Kigali Street, Kigali, Rwanda',
    trackingNumber: 'KG-2024-001234',
    carrier: 'Kigali Express',
    items: [
      {
        id: 1,
        title: 'Smartphone XYZ',
        price: '199.99',
        quantity: 1,
        image: 'https://picsum.photos/seed/phone1/100/100'
      },
      {
        id: 2,
        title: 'Phone Case',
        price: '29.99',
        quantity: 2,
        image: 'https://picsum.photos/seed/case1/100/100'
      }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-18',
    total: '549.99',
    status: 'in-transit',
    estimatedDelivery: 'January 25, 2024',
    deliveryAddress: '456 Kimironko Road, Kigali, Rwanda',
    trackingNumber: 'KG-2024-001235',
    carrier: 'Rwanda Logistics',
    items: [
      {
        id: 3,
        title: 'Laptop Pro',
        price: '499.99',
        quantity: 1,
        image: 'https://picsum.photos/seed/laptop1/100/100'
      },
      {
        id: 4,
        title: 'Mouse Pad',
        price: '19.99',
        quantity: 1,
        image: 'https://picsum.photos/seed/mouse1/100/100'
      }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-20',
    total: '89.99',
    status: 'processing',
    estimatedDelivery: 'January 28, 2024',
    deliveryAddress: '789 Nyabugogo, Kigali, Rwanda',
    trackingNumber: 'KG-2024-001236',
    carrier: 'Kigali Express',
    items: [
      {
        id: 5,
        title: 'Wireless Headphones',
        price: '79.99',
        quantity: 1,
        image: 'https://picsum.photos/seed/headphones1/100/100'
      }
    ]
  }
])

const selectedOrder = computed(() => {
  return orders.value.find(order => order.id === selectedOrderId.value)
})

const deliverySteps = computed(() => {
  if (!selectedOrder.value) return []
  
  const baseSteps = [
    {
      id: 'order-placed',
      title: 'Order Placed',
      description: 'Your order has been received and is being processed',
      time: selectedOrder.value.date,
      location: 'Kigali Tech Store',
      completed: true
    },
    {
      id: 'order-processed',
      title: 'Order Processed',
      description: 'Your order has been processed and prepared for shipping',
      time: selectedOrder.value.date,
      location: 'Kigali Warehouse',
      completed: true
    },
    {
      id: 'out-for-delivery',
      title: 'Out for Delivery',
      description: 'Your package is on its way to you',
      time: selectedOrder.value.date,
      location: 'Kigali Distribution Center',
      completed: selectedOrder.value.status !== 'processing'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Your package has been delivered successfully',
      time: selectedOrder.value.estimatedDelivery,
      location: selectedOrder.value.deliveryAddress,
      completed: selectedOrder.value.status === 'delivered'
    }
  ]
  
  return baseSteps
})

function loadOrderDetails() {
  if (selectedOrder.value) {
    toast.success(`Loaded order #${selectedOrder.value.id}`)
  }
}

function getStatusClass() {
  if (!selectedOrder.value) return ''
  return `status-${selectedOrder.value.status}`
}

function getStatusText() {
  if (!selectedOrder.value) return ''
  const statusMap = {
    'processing': 'Processing',
    'in-transit': 'In Transit',
    'delivered': 'Delivered'
  }
  return statusMap[selectedOrder.value.status] || 'Unknown'
}

function getStepClass(step) {
  const classes = []
  if (step.completed) {
    classes.push('completed')
  }
  if (isCurrentStep(step)) {
    classes.push('current')
  }
  return classes.join(' ')
}

function isCurrentStep(step) {
  if (!selectedOrder.value) return false
  
  const completedSteps = deliverySteps.value.filter(s => s.completed)
  const lastCompleted = completedSteps[completedSteps.length - 1]
  
  return lastCompleted && lastCompleted.id === step.id
}

function contactSupport() {
  toast.info('Support contact: support@kigalitechstore.rw')
}

function trackPackage() {
  if (selectedOrder.value) {
    toast.info(`Tracking ${selectedOrder.value.trackingNumber} with ${selectedOrder.value.carrier}`)
  }
}

onMounted(() => {
  // Auto-select first order for demo
  if (orders.value.length > 0) {
    selectedOrderId.value = orders.value[0].id
    loadOrderDetails()
  }
})
</script>

<style scoped>
.delivery-status-page {
  padding: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
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

.order-selection {
  margin-bottom: var(--space-8);
}

.order-selection label {
  display: block;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.order-select {
  width: 100%;
  max-width: 400px;
  padding: var(--space-3);
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--gray-700);
  font-size: var(--text-base);
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.order-header h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.order-meta {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.order-status-badge {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-sm);
}

.status-processing {
  background: var(--color-warning);
  color: white;
}

.status-in-transit {
  background: var(--color-primary);
  color: white;
}

.status-delivered {
  background: var(--color-success);
  color: white;
}

/* Timeline */
.delivery-timeline {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.delivery-timeline h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.timeline {
  position: relative;
}

.timeline-step {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  position: relative;
}

.timeline-step:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gray-300);
  border: 2px solid var(--gray-300);
  transition: all var(--transition-fast);
  z-index: 2;
}

.timeline-line {
  width: 2px;
  height: 60px;
  background: var(--gray-300);
  margin-top: var(--space-2);
}

.timeline-step.completed .timeline-dot {
  background: var(--color-success);
  border-color: var(--color-success);
}

.timeline-step.completed .timeline-line {
  background: var(--color-success);
}

.timeline-step.current .timeline-dot {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(0, 161, 222, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 4px rgba(0, 161, 222, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(0, 161, 222, 0.1);
  }
  100% {
    box-shadow: 0 0 0 4px rgba(0, 161, 222, 0.2);
  }
}

.timeline-content {
  flex: 1;
  padding-top: var(--space-1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.timeline-header h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.timeline-time {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.timeline-description {
  font-size: var(--text-base);
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.timeline-location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--gray-600);
}

/* Products */
.order-products {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.order-products h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.product-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.product-info h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.product-info p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-1);
}

.product-price {
  font-weight: 600;
  color: var(--color-primary);
}

/* Delivery Info */
.delivery-info {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.delivery-info h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.info-item label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
}

.info-item p {
  font-size: var(--text-base);
  color: var(--gray-900);
  margin: 0;
}

/* Actions */
.order-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  color: var(--gray-400);
}

.empty-state h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.empty-state p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  
  .timeline-step {
    gap: var(--space-3);
  }
  
  .product-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .order-actions {
    flex-direction: column;
  }
}
</style>
