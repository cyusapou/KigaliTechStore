<template>
  <div class="modern-ai-assistant" :class="{ active: isActive, expanded: isExpanded }">
    <!-- Floating Action Button -->
    <div class="ai-action-card" @click="toggleAssistant">
      <div class="ai-icon">
        <div class="icon-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L13.17 16l-3.09-6.26a8 8 0 0 0-8 0zm0 8a8 8 0 0 1 3.54 0 0 1 3.54 0 0 8 8 3.54 0 0 1-3.54-8-8z"/>
            <path d="M12 2v2a1 1 0 0 1-1h0a1 1 0 0 1 1v1a1 1 0 0 1-1h-2a1 1 0 0-1 1 1v1h-2a1 1 0 0-1 1-1z"/>
          </svg>
        </div>
        <div class="ai-status-dot" :class="{ active: isLoading }"></div>
      </div>
      <div class="ai-label">
        <span>Kigali Assistant</span>
        <div class="ai-pulse" v-if="unreadCount > 0"></div>
      </div>
    </div>

    <!-- Chat Panel -->
    <transition name="slide-fade">
      <div class="ai-chat-panel" v-if="isActive">
        <div class="ai-chat-header">
          <div class="ai-chat-info">
            <h3>Kigali Tech Store Assistant</h3>
            <p class="ai-status">{{ isLoading ? 'Thinking...' : 'Ready to help' }}</p>
          </div>
          <button @click="toggleAssistant" class="ai-minimize-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="18" x2="18" y2="6"></line>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="ai-messages-container" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="ai-message"
            :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
          >
            <div class="message-avatar">
              <div class="avatar user-avatar" v-if="message.role === 'user'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0-4.21-4.21 0 0 4.21 4.21 0 0 9.42 0 0 9.42 0 0 1-9.42-4.21-4.21-4.21 4.21 0 0 9.42-4.21-4.21-4.21 0 0 9.42z"/>
                </svg>
              </div>
              <div class="avatar ai-avatar" v-else>
                <div class="avatar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 7V5.5a1.5 1.5 0 0 1 3.54 0 0 1 3.54 0 0 1-3.54-8-8z"/>
                    <path d="M12 17v-1h0a1 1 0 0 1 1v1a1 1 0 0 1-1h-2a1 1 0 0-1 1-1z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="ai-input-area">
          <div class="ai-input-wrapper">
            <textarea
              v-model="currentMessage"
              @keydown.enter.prevent="sendMessage"
              @keydown.ctrl.enter.prevent="sendMessage"
              placeholder="How can I help you today?"
              class="ai-input"
              rows="2"
              :disabled="isLoading"
              ref="messageInput"
            ></textarea>
            <button 
              @click="sendMessage" 
              class="ai-send-btn"
              :disabled="isLoading || !currentMessage.trim()"
            >
              <div class="send-btn-content">
                <span v-if="isLoading" class="loading-spinner"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,13"></polygon>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useAI } from '@/composables/useAI'

const props = defineProps({
  context: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['message'])

const { isLoading, response, error, askAI, clearResponse } = useAI()

const isActive = ref(false)
const isExpanded = ref(false)
const currentMessage = ref('')
const messages = ref([])
const unreadCount = ref(0)
const messagesContainer = ref(null)
const messageInput = ref(null)
const isInitialized = ref(false)

// Always show the assistant
onMounted(() => {
  console.log('AI Assistant mounted - ensuring visibility')
  
  // Initialize with welcome message
  messages.value = [{
    role: 'assistant',
    content: '👋 Welcome to Kigali Tech Store! I\'m your personal shopping assistant. How can I help you today?',
    timestamp: new Date()
  }]
  console.log('AI Assistant initialized successfully')
})

function toggleAssistant() {
  isActive.value = !isActive.value
  if (isActive.value) {
    isExpanded.value = true
  }
}

function sendMessage() {
  const message = currentMessage.value.trim()
  if (!message || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: message,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  currentMessage.value = ''

  // Get context for AI
  const context = getContext()
  
  askAI(message, context)
}

function getContext() {
  let context = props.context
  
  // Add current page context
  const currentPath = window.location.pathname
  if (currentPath.includes('/products')) {
    context += 'User is browsing products. '
  } else if (currentPath.includes('/cart')) {
    context += 'User is viewing cart. '
  } else if (currentPath.includes('/checkout')) {
    context += 'User is in checkout process. '
  } else if (currentPath.includes('/profile')) {
    context += 'User is viewing profile. '
  }

  // Add cart context if available
  try {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cartData.length > 0) {
      context += `User has ${cartData.length} items in cart: ${cartData.map(item => item.title).join(', ')}. `
    }
  } catch (e) {
    // Ignore cart errors
  }

  return context
}

// Watch for AI responses
watch(response, (newResponse) => {
  if (newResponse) {
    const aiMessage = {
      role: 'assistant',
      content: newResponse,
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    unreadCount.value += 1
    
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })

    // Emit message to parent if needed
    emit('message', aiMessage)
  }
})

// Clear unread count when assistant is opened
watch(isActive, (newActive) => {
  if (newActive) {
    unreadCount.value = 0
  }
})

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Add welcome message
  messages.value = [{
    role: 'assistant',
    content: '👋 Welcome to Kigali Tech Store! I\'m your personal shopping assistant. I can help you with:\n\n• Product recommendations and comparisons\n• Order tracking and delivery status\n• Store information and policies\n• Technical support and troubleshooting\n\nHow can I assist you today?',
    timestamp: new Date()
  }]
})

onUnmounted(() => {
  clearResponse()
})
</script>

<style scoped>
.modern-ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--font-family);
}

/* Floating Action Button */
.ai-action-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.ai-icon {
  position: relative;
  width: 40px;
  height: 40px;
}

.ai-status-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.ai-status-dot.active {
  opacity: 1;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ai-label {
  color: white;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-pulse {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 1; }
}

/* Chat Panel */
.ai-chat-panel {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 420px;
  max-height: 600px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  visibility: hidden;
}

.modern-ai-assistant.active .ai-chat-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.modern-ai-assistant.expanded .ai-chat-panel {
  max-height: 80vh;
}

.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.ai-chat-info h3 {
  margin: 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.ai-status {
  color: #10b981;
  font-size: 12px;
  margin-top: 4px;
}

.ai-minimize-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.ai-minimize-btn:hover {
  color: white;
}

/* Messages */
.ai-messages-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.ai-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ai-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.message-content {
  flex: 1;
  max-width: 280px;
}

.message-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  line-height: 1.4;
}

.user-message .message-text {
  background: rgba(102, 126, 234, 0.9);
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

/* Input Area */
.ai-input-area {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.ai-input-wrapper {
  display: flex;
  gap: 12px;
}

.ai-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;
}

.ai-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3);
}

.ai-send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.ai-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: #667eea;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-ai-assistant {
    bottom: 10px;
    right: 10px;
  }
  
  .ai-chat-panel {
    width: calc(100vw - 20px);
    right: 10px;
    left: auto;
    bottom: 60px;
  }
  
  .ai-action-card {
    padding: 8px 12px;
  gap: 8px;
  }
  
  .ai-chat-panel {
    max-height: 70vh;
  }
}
</style>
