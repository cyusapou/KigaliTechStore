import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('kts_user') || 'null'))
  const token = ref(localStorage.getItem('kts_token') || null)
  const isLoading = ref(false)
  const orders = ref(JSON.parse(localStorage.getItem('kts_orders') || '[]'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(email, password) {
    isLoading.value = true
    
    try {
      // For demo purposes, accept any email/password combo
      // In production, this would call the real API
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now()
      }
      
      token.value = mockResponse.token
      localStorage.setItem('kts_token', token.value)
      
      // Create mock user object
      user.value = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        avatar: null
      }
      localStorage.setItem('kts_user', JSON.stringify(user.value))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    
    try {
      // For demo purposes, accept any registration
      // In production, this would call the real API
      const mockResponse = {
        id: Date.now(),
        username: userData.email,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`
      }
      
      // Auto-login after registration
      const loginResult = await login(userData.email, userData.password)
      return loginResult
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('kts_token')
    localStorage.removeItem('kts_user')
  }

  function initFromStorage() {
    const storedToken = localStorage.getItem('kts_token')
    const storedUser = localStorage.getItem('kts_user')
    const storedOrders = localStorage.getItem('kts_orders')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    
    if (storedOrders) {
      orders.value = JSON.parse(storedOrders)
    }
  }

  function saveOrder(orderData) {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    }
    
    orders.value.unshift(order)
    localStorage.setItem('kts_orders', JSON.stringify(orders.value))
    
    return order
  }

  function updateProfile(profileData) {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem('kts_user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    orders,
    
    // Getters
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    initFromStorage,
    saveOrder,
    updateProfile
  }
})
