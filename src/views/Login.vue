<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Login to Kigali Tech Store</h1>
          <p>Access your account and continue shopping</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="form.remember" type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <button 
            type="submit"
            :disabled="authStore.isLoading"
            class="btn btn-primary btn-lg auth-submit"
          >
            <span v-if="authStore.isLoading" class="spinner"></span>
            <span v-else>Login</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  email: '',
  password: '',
  remember: false
})

async function handleLogin() {
  const result = await authStore.login(form.value.email, form.value.password)
  
  if (result.success) {
    toast.success('Login successful!')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    toast.error(result.error || 'Login failed')
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-header h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.auth-header p {
  color: var(--gray-600);
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
}

.forgot-password:hover {
  color: var(--color-secondary);
}

.auth-submit {
  width: 100%;
}

.auth-footer {
  text-align: center;
  padding-top: var(--space-6);
  border-top: 1px solid var(--gray-200);
}

.auth-footer p {
  color: var(--gray-600);
  margin: 0;
}

.auth-footer a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  color: var(--color-secondary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
