<template>
  <div class="profile-orders-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>My Orders</h1>
        <p>View and track your orders</p>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <router-link to="/delivery-status" class="action-card">
          <div class="action-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="action-content">
            <h3>Track Delivery</h3>
            <p>Check the status of your orders</p>
          </div>
        </router-link>
        
        <router-link to="/wishlist" class="action-card">
          <div class="action-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div class="action-content">
            <h3>My Wishlist</h3>
            <p>View your saved items</p>
          </div>
        </router-link>
      </div>

      <!-- Orders List -->
      <div class="orders-section">
        <h2>Recent Orders</h2>
        <div class="orders-list">
          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3>Order #ORD-001</h3>
                <p class="order-date">January 15, 2024</p>
              </div>
              <div class="order-status">
                <span class="status-badge delivered">Delivered</span>
              </div>
            </div>
            <div class="order-items">
              <div class="order-item">
                <img src="https://picsum.photos/seed/phone1/60/60" alt="Product" class="item-image">
                <div class="item-details">
                  <h4>Smartphone XYZ</h4>
                  <p>Quantity: 1</p>
                </div>
                <div class="item-price">$199.99</div>
              </div>
            </div>
            <div class="order-footer">
              <div class="order-total">
                <span>Total: $299.99</span>
              </div>
              <div class="order-actions">
                <router-link to="/delivery-status" class="btn btn-sm btn-outline">Track</router-link>
                <button class="btn btn-sm btn-primary">Reorder</button>
              </div>
            </div>
          </div>

          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3>Order #ORD-002</h3>
                <p class="order-date">January 18, 2024</p>
              </div>
              <div class="order-status">
                <span class="status-badge in-transit">In Transit</span>
              </div>
            </div>
            <div class="order-items">
              <div class="order-item">
                <img src="https://picsum.photos/seed/laptop1/60/60" alt="Product" class="item-image">
                <div class="item-details">
                  <h4>Laptop Pro</h4>
                  <p>Quantity: 1</p>
                </div>
                <div class="item-price">$499.99</div>
              </div>
            </div>
            <div class="order-footer">
              <div class="order-total">
                <span>Total: $549.99</span>
              </div>
              <div class="order-actions">
                <router-link to="/delivery-status" class="btn btn-sm btn-outline">Track</router-link>
                <button class="btn btn-sm btn-primary">Reorder</button>
              </div>
            </div>
          </div>

          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3>Order #ORD-003</h3>
                <p class="order-date">January 20, 2024</p>
              </div>
              <div class="order-status">
                <span class="status-badge processing">Processing</span>
              </div>
            </div>
            <div class="order-items">
              <div class="order-item">
                <img src="https://picsum.photos/seed/headphones1/60/60" alt="Product" class="item-image">
                <div class="item-details">
                  <h4>Wireless Headphones</h4>
                  <p>Quantity: 1</p>
                </div>
                <div class="item-price">$79.99</div>
              </div>
            </div>
            <div class="order-footer">
              <div class="order-total">
                <span>Total: $89.99</span>
              </div>
              <div class="order-actions">
                <router-link to="/delivery-status" class="btn btn-sm btn-outline">Track</router-link>
                <button class="btn btn-sm btn-primary">Reorder</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample orders data
const orders = ref([
  {
    id: 'ORD-001',
    date: 'January 15, 2024',
    status: 'delivered',
    total: 299.99,
    items: [
      { title: 'Smartphone XYZ', quantity: 1, price: 199.99, image: 'phone1' }
    ]
  },
  {
    id: 'ORD-002',
    date: 'January 18, 2024',
    status: 'in-transit',
    total: 549.99,
    items: [
      { title: 'Laptop Pro', quantity: 1, price: 499.99, image: 'laptop1' }
    ]
  },
  {
    id: 'ORD-003',
    date: 'January 20, 2024',
    status: 'processing',
    total: 89.99,
    items: [
      { title: 'Wireless Headphones', quantity: 1, price: 79.99, image: 'headphones1' }
    ]
  }
])
</script>

<style scoped>
.profile-orders-page {
  padding: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.page-header h1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.page-header p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-content h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.action-content p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

.orders-section h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.order-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-400);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-400);
}

.order-info h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.order-date {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

.status-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.delivered {
  background: var(--color-success);
  color: white;
}

.status-badge.in-transit {
  background: var(--color-primary);
  color: white;
}

.status-badge.processing {
  background: var(--color-warning);
  color: white;
}

.order-items {
  margin-bottom: var(--space-4);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-details h4 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.item-details p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

.item-price {
  margin-left: auto;
  font-weight: 600;
  color: var(--color-primary);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-400);
}

.order-total {
  font-weight: 600;
  color: var(--gray-900);
}

.order-actions {
  display: flex;
  gap: var(--space-2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .order-footer {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }
  
  .order-actions {
    justify-content: center;
  }
}
</style>
