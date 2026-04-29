import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useProductsStore = defineStore('products', () => {
  // State
  const all = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref(null)
  const searchQuery = ref('')
  const sortBy = ref('default')

  // Getters
  const filtered = computed(() => {
    let products = [...all.value]

    // Filter by category
    if (selectedCategory.value) {
      products = products.filter(product => 
        product.category === selectedCategory.value
      )
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      products = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    // Sort products
    switch (sortBy.value) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
        break
      default:
        // Keep original order
        break
    }

    return products
  })

  const byId = computed(() => (id) => {
    return all.value.find(product => product.id == id)
  })

  const featured = computed(() => {
    return all.value.slice(0, 8)
  })

  // Actions
  async function fetchAll() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/products')
      all.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/products/categories')
      categories.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchByCategory(category) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/products/category/${category}`)
      all.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      console.error('Error fetching products by category:', err)
    } finally {
      loading.value = false
    }
  }

  function setCategory(category) {
    selectedCategory.value = category
  }

  function setSearch(query) {
    searchQuery.value = query
  }

  function setSort(sort) {
    sortBy.value = sort
  }

  function clearFilters() {
    selectedCategory.value = null
    searchQuery.value = ''
    sortBy.value = 'default'
  }

  return {
    // State
    all,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    sortBy,
    
    // Getters
    filtered,
    byId,
    featured,
    
    // Actions
    fetchAll,
    fetchCategories,
    fetchByCategory,
    setCategory,
    setSearch,
    setSort,
    clearFilters
  }
})
