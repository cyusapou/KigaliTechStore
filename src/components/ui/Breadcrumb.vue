<template>
  <nav class="breadcrumb" aria-label="Breadcrumb navigation">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="breadcrumb-item"
      >
        <router-link 
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb-current">
          {{ item.label }}
        </span>
        
        <span 
          v-if="index < items.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 
        typeof item.label === 'string' && 
        (typeof item.to === 'string' || item.to === undefined)
      )
    }
  }
})
</script>

<style scoped>
.breadcrumb {
  margin: var(--space-4) 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: var(--space-2);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.breadcrumb-link:hover {
  background: rgba(0, 161, 222, 0.2);
  color: var(--color-secondary);
}

.breadcrumb-current {
  color: var(--gray-600);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
}

.breadcrumb-separator {
  color: var(--gray-400);
  font-size: var(--text-sm);
  user-select: none;
}

/* Responsive Design */
@media (max-width: 640px) {
  .breadcrumb {
    margin: var(--space-3) 0;
  }
  
  .breadcrumb-list {
    gap: var(--space-1);
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 0.75rem;
    padding: var(--space-1);
  }
  
  .breadcrumb-separator {
    font-size: 0.75rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .breadcrumb-link {
    text-decoration: underline;
  }
  
  .breadcrumb-link:hover {
    background: transparent;
    text-decoration-thickness: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .breadcrumb-link {
    transition: none;
  }
}
</style>
