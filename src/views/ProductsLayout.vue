<template>
  <div class="products-layout">
    <router-view />
  </div>
</template>

<script setup>
// This is a wrapper component for nested product routes
</script>

<style scoped>
.products-layout {
  min-height: calc(100vh - 80px);
  padding-top: var(--space-4);
}
</style>
