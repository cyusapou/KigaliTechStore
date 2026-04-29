<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
    <Toast />
    <AIAssistant />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import Toast from '@/components/ui/Toast.vue'
import SimpleAssistant from '@/components/ai/SimpleAssistant.vue'
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px;
}
</style>
