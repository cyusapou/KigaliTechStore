import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('kts_wishlist') || '[]'))

  // Persistence
  watch(items, (val) => {
    localStorage.setItem('kts_wishlist', JSON.stringify(val))
  }, { deep: true })

  // Getters
  const isWished = computed(() => (id) => {
    return items.value.some(item => item.id === id)
  })

  const count = computed(() => {
    return items.value.length
  })

  // Actions
  function toggle(product) {
    const existingIndex = items.value.findIndex(item => item.id === product.id)
    
    if (existingIndex > -1) {
      items.value.splice(existingIndex, 1)
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      })
    }
  }

  function remove(id) {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function moveToCart(id) {
    const cartStore = useCartStore()
    const item = items.value.find(item => item.id === id)
    
    if (item) {
      cartStore.add(item)
      remove(id)
    }
  }

  function clear() {
    items.value = []
  }

  return {
    // State
    items,
    
    // Getters
    isWished,
    count,
    
    // Actions
    toggle,
    remove,
    moveToCart,
    clear
  }
})
