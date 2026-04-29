<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="not-found-visual">
          <div class="error-code">404</div>
          <div class="error-illustration">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
        </div>
        
        <div class="not-found-text">
          <h1>Oops! This page wandered off in Kigali somewhere</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div class="not-found-actions">
            <router-link to="/" class="btn btn-primary btn-lg">
              Go Home
            </router-link>
            <router-link to="/products" class="btn btn-outline btn-lg">
              Browse Products
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 page component
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.not-found-visual {
  margin-bottom: var(--space-8);
  position: relative;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  opacity: 0.1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.not-found-text h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.not-found-text p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin-bottom: var(--space-8);
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-illustration {
    width: 100px;
    height: 100px;
  }
  
  .not-found-text h1 {
    font-size: var(--text-2xl);
  }
  
  .not-found-text p {
    font-size: var(--text-base);
  }
  
  .not-found-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
