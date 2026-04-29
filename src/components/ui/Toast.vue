<template>
  <teleport to="body">
    <div v-if="toasts.length > 0" class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="`toast-${toast.id}`"
          :class="['toast', `toast-${toast.type}`]"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else-if="toast.type === 'info'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          
          <div class="toast-content">
            <p class="toast-message">{{ toast.message }}</p>
            <p v-if="toast.description" class="toast-description">{{ toast.description }}</p>
          </div>
          
          <button 
            @click="removeToast(toast.id)"
            class="toast-close"
            :aria-label="`Close ${toast.type} notification`"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/composables/useToast'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

function removeToast(id) {
  toastStore.remove(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  min-width: 320px;
  max-width: 480px;
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: var(--color-success);
}

.toast-error {
  border-left-color: var(--color-danger);
}

.toast-warning {
  border-left-color: var(--color-warning);
}

.toast-info {
  border-left-color: var(--color-info);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.toast-success .toast-icon {
  color: var(--color-success);
}

.toast-error .toast-icon {
  color: var(--color-danger);
}

.toast-warning .toast-icon {
  color: var(--color-warning);
}

.toast-info .toast-icon {
  color: var(--color-info);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--gray-900);
  margin: 0;
  line-height: 1.4;
}

.toast-description {
  font-size: var(--text-xs);
  color: var(--gray-600);
  margin: var(--space-1) 0 0 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.toast-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

/* Toast Animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive Design */
@media (max-width: 640px) {
  .toast-container {
    top: var(--space-3);
    right: var(--space-3);
    left: var(--space-3);
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .toast {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toast {
    animation: none;
  }
  
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
