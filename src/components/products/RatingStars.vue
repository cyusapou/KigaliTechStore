<template>
  <div class="rating-stars" :aria-label="`${rating} out of 5 stars`">
    <div class="stars-container">
      <svg
        v-for="star in 5"
        :key="star"
        class="star"
        :class="getStarClass(star)"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        :aria-label="getStarLabel(star)"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <span v-if="showCount && count > 0" class="rating-count">
      ({{ count }}{{ count === 1 ? ' review' : ' reviews' }})
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 5
  },
  count: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: true
  }
})

const fullStars = computed(() => Math.floor(props.rating))
const hasHalfStar = computed(() => props.rating % 1 >= 0.5)
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0))

function getStarClass(position) {
  if (position <= fullStars.value) {
    return 'filled'
  } else if (position === fullStars.value + 1 && hasHalfStar.value) {
    return 'half'
  } else {
    return 'empty'
  }
}

function getStarLabel(position) {
  if (position <= fullStars.value) {
    return 'Filled star'
  } else if (position === fullStars.value + 1 && hasHalfStar.value) {
    return 'Half filled star'
  } else {
    return 'Empty star'
  }
}
</script>

<style scoped>
.rating-stars {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stars-container {
  display: inline-flex;
  gap: 1px;
}

.star {
  font-size: 16px;
  line-height: 1;
  color: var(--gray-500);
  transition: color var(--transition-fast);
}

.star.filled {
  color: var(--color-accent);
}

.star.half {
  position: relative;
  color: var(--gray-500);
}

.star.half::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: var(--color-accent);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat left center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat left center;
}

.star.empty {
  color: var(--gray-300);
}

.rating-count {
  font-size: var(--text-xs);
  color: var(--gray-500);
  white-space: nowrap;
}

/* Hover effects for interactive rating (if needed in future) */
.rating-stars.interactive .star {
  cursor: pointer;
}

.rating-stars.interactive .star:hover {
  color: var(--color-accent);
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 640px) {
  .star {
    font-size: 14px;
  }
  
  .rating-count {
    font-size: 0.7rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .star.filled {
    color: #FFD700;
  }
  
  .star.empty {
    color: #666666;
  }
}
</style>
