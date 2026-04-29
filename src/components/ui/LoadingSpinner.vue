<template>
  <div 
    :class="['loading-spinner', { 'loading-spinner-overlay': overlay }]"
    :role="role"
    :aria-label="ariaLabel"
  >
    <div class="spinner-container">
      <div class="spinner" :style="{ width: size, height: size }">
        <div class="spinner-circle"></div>
      </div>
      <p v-if="text" class="spinner-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: '40px',
    validator: (value) => /^\d+(px|rem|em|%)$/.test(value)
  },
  text: {
    type: String,
    default: null
  },
  overlay: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'white'].includes(value)
  }
})

const role = computed(() => props.overlay ? 'status' : 'img')
const ariaLabel = computed(() => {
  if (props.text) return props.text
  return props.overlay ? 'Loading content...' : 'Loading...'
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: var(--z-modal);
  backdrop-filter: blur(2px);
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.spinner {
  position: relative;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--color-primary) 90deg,
    transparent 90deg
  );
  animation: spin 1s linear infinite;
}

.spinner-text {
  font-size: var(--text-sm);
  color: var(--gray-600);
  font-weight: 500;
  margin: 0;
}

/* Color variations */
.loading-spinner[data-color="secondary"] .spinner {
  border-top-color: var(--color-secondary);
}

.loading-spinner[data-color="secondary"] .spinner-circle {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--color-secondary) 90deg,
    transparent 90deg
  );
}

.loading-spinner[data-color="accent"] .spinner {
  border-top-color: var(--color-accent);
}

.loading-spinner[data-color="accent"] .spinner-circle {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--color-accent) 90deg,
    transparent 90deg
  );
}

.loading-spinner[data-color="white"] .spinner {
  border-top-color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.loading-spinner[data-color="white"] .spinner-circle {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    white 90deg,
    transparent 90deg
  );
}

.loading-spinner[data-color="white"] .spinner-text {
  color: white;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .spinner-circle {
    animation: none;
  }
  
  .spinner {
    border-top-color: var(--color-primary);
  }
}
</style>
