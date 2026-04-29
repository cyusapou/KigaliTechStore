import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

// Clear any existing toasts on initialization
toasts.value = []

export function useToast() {
  
  function addToast(message, type = 'info', options = {}) {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      description: options.description || null,
      duration: options.duration !== undefined ? options.duration : 3000,
      persistent: options.persistent || false
    }
    
    toasts.value.push(toast)
    
    // Auto-remove toast after duration (unless persistent)
    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
    
    return id
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(message, options = {}) {
    return addToast(message, 'success', options)
  }
  
  function error(message, options = {}) {
    return addToast(message, 'error', { ...options, duration: 5000 })
  }
  
  function warning(message, options = {}) {
    return addToast(message, 'warning', options)
  }
  
  function info(message, options = {}) {
    return addToast(message, 'info', options)
  }
  
  function clear() {
    toasts.value = []
  }
  
  return {
    toasts,
    success,
    error,
    warning,
    info,
    remove: removeToast,
    clear
  }
}

// Create a singleton instance for global use
const globalToast = useToast()

// Clear any existing toasts immediately
globalToast.clear()

export const useToastStore = () => ({
  toasts: globalToast.toasts,
  remove: globalToast.remove
})
