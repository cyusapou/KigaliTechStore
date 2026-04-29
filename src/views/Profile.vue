<template>
  <div class="profile-page">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-container" @click="triggerFileInput">
            <div class="avatar-circle large" :style="avatarStyle">
              <img v-if="profilePicture" :src="profilePicture" :alt="user?.name" class="avatar-image" />
              <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
            <div class="avatar-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 12m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5z"/>
              </svg>
              <span>Change Photo</span>
            </div>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileChange" 
            class="hidden-input"
          />
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.name || 'User' }}</h1>
          <p class="profile-email">{{ user?.email || 'user@example.com' }}</p>
          <p class="profile-member">Member since {{ joinDate }}</p>
        </div>
        <div class="profile-actions">
          <button class="btn btn-outline">Edit Profile</button>
          <button 
            v-if="profilePicture" 
            @click="removeProfilePicture" 
            class="btn btn-outline btn-sm"
          >
            Remove Photo
          </button>
        </div>
      </div>

      <!-- Profile Navigation -->
      <div class="profile-nav">
        <router-link to="/profile" class="nav-link active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile
        </router-link>
        <router-link to="/profile/orders" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 2L3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-7z"></path>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <path d="M12 2v7"></path>
          </svg>
          Orders
        </router-link>
        <router-link to="/profile/wishlist" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Wishlist
        </router-link>
      </div>

      <!-- Profile Content -->
      <div class="profile-content">
        <!-- Account Information -->
        <div class="profile-section">
          <h2 class="section-title">Account Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Full Name</label>
              <p>{{ user?.name || 'Not provided' }}</p>
            </div>
            <div class="info-item">
              <label>Email Address</label>
              <p>{{ user?.email || 'Not provided' }}</p>
            </div>
            <div class="info-item">
              <label>Phone Number</label>
              <p>{{ user?.phone || 'Not provided' }}</p>
            </div>
            <div class="info-item">
              <label>Member Since</label>
              <p>{{ joinDate }}</p>
            </div>
          </div>
        </div>

        <!-- Addresses -->
        <div class="profile-section">
          <h2 class="section-title">Shipping Addresses</h2>
          <div class="address-list">
            <div class="address-card" v-if="addresses.length > 0" v-for="address in addresses" :key="address.id">
              <div class="address-info">
                <h3>{{ address.type }}</h3>
                <p>{{ address.street }}</p>
                <p>{{ address.city }}, {{ address.postalCode }}</p>
                <p>{{ address.country }}</p>
              </div>
              <div class="address-actions">
                <button class="btn btn-sm btn-outline" @click="editAddress(address.id)">Edit</button>
                <button class="btn btn-sm btn-outline" @click="removeAddress(address.id)">Remove</button>
              </div>
            </div>
            <div class="empty-address" v-else>
              <p>No addresses saved yet</p>
              <button class="btn btn-primary" @click="saveAddress" :disabled="isAddingAddress">
                <span v-if="isAddingAddress">Saving...</span>
                <span v-else>Add Address</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="profile-section">
          <h2 class="section-title">Preferences</h2>
          <div class="preferences-grid">
            <div class="preference-item">
              <label class="switch">
                <input type="checkbox" v-model="preferences.emailNotifications">
                <span class="slider"></span>
              </label>
              <div class="preference-info">
                <h3>Email Notifications</h3>
                <p>Receive updates about your orders and promotions</p>
              </div>
            </div>
            <div class="preference-item">
              <label class="switch">
                <input type="checkbox" v-model="preferences.newsletter">
                <span class="slider"></span>
              </label>
              <div class="preference-info">
                <h3>Newsletter</h3>
                <p>Get the latest deals and product updates</p>
              </div>
            </div>
            <div class="preference-item">
              <label class="switch">
                <input type="checkbox" v-model="preferences.smsNotifications">
                <span class="slider"></span>
              </label>
              <div class="preference-info">
                <h3>SMS Notifications</h3>
                <p>Receive text messages about order status</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="profile-section">
          <h2 class="section-title">Security</h2>
          <div class="security-actions">
            <button class="btn btn-outline">Change Password</button>
            <button class="btn btn-outline">Two-Factor Authentication</button>
            <button class="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const joinDate = computed(() => {
  if (user.value?.createdAt) {
    return new Date(user.value.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return 'January 1, 2024'
})

const addresses = ref([
  {
    id: 1,
    type: 'Home',
    street: '123 Kigali Street',
    city: 'Kigali',
    postalCode: '12345',
    country: 'Rwanda'
  }
])

const preferences = ref({
  emailNotifications: true,
  newsletter: false,
  smsNotifications: true
})

// Profile picture state
const profilePicture = ref(localStorage.getItem('userProfilePicture') || '')
const fileInput = ref(null)
const isUploading = ref(false)

const avatarStyle = computed(() => {
  if (profilePicture.value) {
    return {
      backgroundImage: 'none',
      background: 'transparent'
    }
  }
  return {}
})

// Profile picture functions
function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB')
    return
  }
  
  isUploading.value = true
  
  // Read and process the image
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target.result
    profilePicture.value = imageUrl
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfilePicture', imageUrl)
    
    // Trigger storage event to update other components (like header)
    window.dispatchEvent(new Event('storage'))
    
    isUploading.value = false
    toast.success('Profile picture updated successfully!')
  }
  
  reader.onerror = () => {
    isUploading.value = false
    toast.error('Failed to upload image. Please try again.')
  }
  
  reader.readAsDataURL(file)
}

function removeProfilePicture() {
  profilePicture.value = ''
  localStorage.removeItem('userProfilePicture')
  
  // Trigger storage event to update other components (like header)
  window.dispatchEvent(new Event('storage'))
  
  toast.success('Profile picture removed')
}

// Address functionality
const isAddingAddress = ref(false)

function saveAddress() {
  isAddingAddress.value = true
  
  // Simulate saving address
  setTimeout(() => {
    // Add a new address to the list
    const newAddress = {
      id: addresses.value.length + 1,
      type: 'Home',
      street: 'New Address Street',
      city: 'Kigali',
      postalCode: '12345',
      country: 'Rwanda'
    }
    addresses.value.push(newAddress)
    
    isAddingAddress.value = false
    toast.success('Address saved successfully!')
  }, 1000)
}

function editAddress(addressId) {
  toast.info(`Editing address ${addressId}`)
}

function removeAddress(addressId) {
  addresses.value = addresses.value.filter(addr => addr.id !== addressId)
  toast.success('Address removed successfully!')
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    router.push('/login')
  }
})
</script>

<style scoped>
.profile-page {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-8);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.profile-avatar .avatar-container {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.profile-avatar .avatar-circle.large {
  width: 80px;
  height: 80px;
  font-size: var(--text-2xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  border: 3px solid var(--color-surface);
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.25s ease;
  cursor: pointer;
  text-align: center;
  padding: 0 8px;
}

.avatar-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
  mix-blend-mode: overlay;
}

.avatar-overlay svg {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.avatar-overlay span {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  text-align: center;
  line-height: 1.2;
  width: 100%;
}

.profile-avatar .avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.hidden-input {
  display: none;
}

.profile-avatar .avatar-circle.large:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.profile-avatar .avatar-circle.large::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  z-index: -1;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.profile-avatar .avatar-circle.large:hover::after {
  opacity: 0.3;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.profile-email {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin-bottom: var(--space-1);
}

.profile-member {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

/* Profile Navigation */
.profile-nav {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  border-bottom: 1px solid var(--gray-200);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.profile-section {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

/* Information Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.info-item label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
}

.info-item p {
  font-size: var(--text-base);
  color: var(--gray-900);
  margin: 0;
}

/* Address Cards */
.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.address-info h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.address-info p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

.address-actions {
  display: flex;
  gap: var(--space-2);
}

.empty-address {
  text-align: center;
  padding: var(--space-8);
  color: var(--gray-600);
}

/* Preferences */
.preferences-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.preference-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.preference-info h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.preference-info p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0;
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: var(--transition-fast);
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition-fast);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Security Actions */
.security-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-nav {
    flex-wrap: wrap;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .address-card {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .security-actions {
    flex-direction: column;
  }
}
</style>
