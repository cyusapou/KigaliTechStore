<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join Kigali Tech Store today</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="form-input"
                placeholder="Enter your first name"
              />
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="form-input"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
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
              placeholder="Create a password"
            />
            <div class="password-strength">
              <div class="strength-bar" :class="passwordStrength"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="form-input"
              placeholder="Confirm your password"
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="form.terms" type="checkbox" required />
              <span>I agree to the Terms & Conditions</span>
            </label>
          </div>
          
          <button 
            type="submit"
            :disabled="authStore.isLoading || !isFormValid"
            class="btn btn-primary btn-lg auth-submit"
          >
            <span v-if="authStore.isLoading" class="spinner"></span>
            <span v-else>Create Account</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return ''
  if (password.length < 6) return 'weak'
  if (password.length < 10) return 'medium'
  return 'strong'
})

const isFormValid = computed(() => {
  return form.value.firstName &&
         form.value.lastName &&
         form.value.email &&
         form.value.password &&
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         form.value.terms
})

async function handleRegister() {
  const result = await authStore.register(form.value)
  if (result.success) {
    toast.success('Account created successfully!')
    router.push('/')
  } else {
    toast.error(result.error || 'Registration failed')
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
  max-width: 450px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.password-strength {
  height: 4px;
  background: var(--gray-400);
  border-radius: var(--radius-full);
  margin-top: var(--space-2);
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0;
  transition: all var(--transition-normal);
}

.strength-bar.weak {
  width: 33%;
  background: var(--color-danger);
}

.strength-bar.medium {
  width: 66%;
  background: var(--color-warning);
}

.strength-bar.strong {
  width: 100%;
  background: var(--color-success);
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
