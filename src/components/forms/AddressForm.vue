<template>
  <div class="address-form">
    <h3>Delivery Address</h3>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-row">
        <div class="form-group">
          <label for="fullName">Full Name *</label>
          <input
            id="fullName"
            v-model="formData.fullName"
            @input="checkFormValidity"
            type="text"
            required
            class="form-input"
            placeholder="Enter your full name"
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            id="phone"
            v-model="formData.phone"
            @input="checkFormValidity"
            type="tel"
            required
            class="form-input"
            placeholder="078/079/072/073 XXXXXXX"
            pattern="0[7][2893][0-9]{7}"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="address">Street Address *</label>
        <input
          id="address"
          v-model="formData.address"
          @input="checkFormValidity"
          type="text"
          required
          class="form-input"
          placeholder="Enter your street address"
        />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="district">District *</label>
          <select
            id="district"
            v-model="formData.district"
            @change="checkFormValidity"
            required
            class="form-input"
          >
            <option value="">Select District</option>
            <option value="gasabo">Gasabo</option>
            <option value="kicukiro">Kicukiro</option>
            <option value="nyarugenge">Nyarugenge</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="sector">Sector *</label>
          <input
            id="sector"
            v-model="formData.sector"
            @input="checkFormValidity"
            type="text"
            required
            class="form-input"
            placeholder="Enter your sector"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="deliveryNotes">Delivery Notes (Optional)</label>
        <textarea
          id="deliveryNotes"
          v-model="formData.deliveryNotes"
          class="form-input"
          rows="3"
          placeholder="Any special delivery instructions?"
        ></textarea>
      </div>
      
      <button type="submit" class="btn btn-secondary save-address-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner"></span>
        <span v-else>Save Address</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['submit', 'form-valid'])
const props = defineProps({
  saving: {
    type: Boolean,
    default: false
  }
})

const formData = reactive({
  fullName: '',
  phone: '',
  address: '',
  district: '',
  sector: '',
  deliveryNotes: ''
})

const isFormValid = ref(false)
const isSubmitting = ref(false)

function checkFormValidity() {
  // Check if all required fields are filled
  const isValid = 
    formData.fullName.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.district !== '' &&
    formData.sector.trim() !== ''
  
  isFormValid.value = isValid
  emit('form-valid', isValid)
}

function handleSubmit() {
  if (isFormValid.value) {
    isSubmitting.value = true
    emit('submit', formData)
  } else {
    // Show validation feedback
    const firstInvalidField = document.querySelector('.form-input:invalid')
    if (firstInvalidField) {
      firstInvalidField.focus()
      firstInvalidField.classList.add('error')
    }
  }
}

// Watch for saving prop to reset submitting state
watch(() => props.saving, (newVal) => {
  if (!newVal) {
    isSubmitting.value = false
  }
})

// Watch for changes and emit validity
watch([
  () => formData.fullName,
  () => formData.phone,
  () => formData.address,
  () => formData.district,
  () => formData.sector
], () => {
  checkFormValidity()
}, { deep: true })

defineExpose({
  formData,
  isFormValid
})
</script>

<style scoped>
.save-address-btn {
  margin-top: var(--space-4);
  width: 100%;
}
</style>

<style scoped>
.address-form {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--gray-400);
}

.address-form h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--gray-700);
}

.form-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
