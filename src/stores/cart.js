import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('kts_cart') || '[]'))

  // Persistence
  watch(items, (val) => {
    localStorage.setItem('kts_cart', JSON.stringify(val))
  }, { deep: true })

  // Getters
  const count = computed(() => {
    return items.value.reduce((total, item) => total + item.qty, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.qty), 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.18 // 18% VAT Rwanda
  })

  const shipping = computed(() => {
    return subtotal.value > 50000 / 1300 ? 0 : 3000 // Free above threshold (RWF)
  })

  const total = computed(() => {
    return subtotal.value + tax.value + shipping.value
  })

  const isEmpty = computed(() => {
    return items.value.length === 0
  })

  // Actions
  function add(product) {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.qty += 1
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        qty: 1
      })
    }
  }

  function remove(id) {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQty(id, qty) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (qty <= 0) {
        remove(id)
      } else {
        item.qty = qty
      }
    }
  }

  function clear() {
    items.value = []
  }

  function getTotalQuantity() {
    return items.value.reduce((total, item) => total + item.qty, 0)
  }

  function getItemQuantity(id) {
    const item = items.value.find(item => item.id === id)
    return item ? item.qty : 0
  }

  return {
    // State
    items,
    
    // Getters
    count,
    subtotal,
    tax,
    shipping,
    total,
    isEmpty,
    
    // Actions
    add,
    remove,
    updateQty,
    clear,
    getTotalQuantity,
    getItemQuantity
  }
})
