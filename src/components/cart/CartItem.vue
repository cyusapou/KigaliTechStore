<template>
  <div class="cart-item">
    <div class="item-image">
      <img 
        :src="item.image" 
        :alt="item.title"
        @error="handleImageError"
      />
    </div>
    
    <div class="item-details">
      <h3 class="item-title">{{ item.title }}</h3>
      <p class="item-category">{{ formatCategoryName(item.category) }}</p>
      <p class="item-price">${{ formatPrice(item.price) }} each</p>
    </div>
    
    <div class="item-quantity">
      <div class="quantity-stepper">
        <button 
          @click="decrementQuantity"
          :disabled="item.qty <= 1"
          class="stepper-btn"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          v-model.number="localQuantity"
          type="number"
          min="1"
          max="99"
          @change="updateQuantity"
          class="quantity-input"
        />
        <button 
          @click="incrementQuantity"
          :disabled="item.qty >= 99"
          class="stepper-btn"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
    
    <div class="item-subtotal">
      <span class="subtotal-amount">${{ formatPrice(item.price * item.qty) }}</span>
      <span class="subtotal-rwf">RWF {{ formatRWF(item.price * item.qty) }}</span>
    </div>
    
    <div class="item-actions">
      <button 
        @click="removeItem"
        class="remove-btn"
        :aria-label="`Remove ${item.title} from cart`"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const toast = useToast()

const localQuantity = ref(props.item.qty)

// Watch for changes in props.item.qty
watch(() => props.item.qty, (newQty) => {
  localQuantity.value = newQty
})

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
  if (props.item.qty < 99) {
    cartStore.updateQty(props.item.id, props.item.qty + 1)
  }
}

function decrementQuantity() {
  if (props.item.qty > 1) {
    cartStore.updateQty(props.item.id, props.item.qty - 1)
  }
}

function updateQuantity() {
  if (localQuantity.value < 1) {
    localQuantity.value = 1
  } else if (localQuantity.value > 99) {
    localQuantity.value = 99
  }
  
  cartStore.updateQty(props.item.id, localQuantity.value)
}

function removeItem() {
  cartStore.remove(props.item.id)
  toast.success(`${props.item.title} removed from cart`)
}

function handleImageError() {
  // Handle image error if needed
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-400);
  transition: all var(--transition-fast);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.item-image-container {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--space-1);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
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
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.quantity-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
}

.stepper-btn {
  width: 32px;
  height: 32px;
  background: var(--gray-200);
  border: none;
  cursor: pointer;
  font-size: var(--text-lg);
  color: var(--gray-700);
  transition: background var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn:hover:not(:disabled) {
  background: var(--gray-300);
}

.stepper-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--gray-300);
  border-right: 1px solid var(--gray-300);
  font-size: var(--text-sm);
  font-weight: 500;
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  text-align: right;
}

.subtotal-amount {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-primary);
}

.subtotal-rwf {
  font-size: var(--text-xs);
  color: var(--gray-500);
}

.item-actions {
  display: flex;
  align-items: center;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: none;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.remove-btn:hover {
  background: var(--color-danger);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    gap: var(--space-3);
    padding: var(--space-3);
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    grid-row: 1 / span 3;
  }
  
  .item-details {
    grid-column: 2;
  }
  
  .item-quantity {
    grid-column: 2;
    justify-self: start;
  }
  
  .item-subtotal {
    grid-column: 2;
    justify-self: start;
    align-items: flex-start;
  }
  
  .item-actions {
    grid-column: 1 / span 2;
    justify-self: end;
  }
  
  .quantity-stepper {
    transform: scale(0.9);
  }
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 50px 1fr;
    gap: var(--space-2);
    padding: var(--space-2);
  }
  
  .item-image {
    width: 50px;
    height: 50px;
  }
  
  .item-title {
    font-size: var(--text-sm);
  }
  
  .subtotal-amount {
    font-size: var(--text-base);
  }
  
  .quantity-stepper {
    transform: scale(0.8);
  }
  
  .quantity-input {
    width: 40px;
  }
  
  .stepper-btn {
    width: 28px;
    height: 28px;
    font-size: var(--text-base);
  }
}
</style>
