<template>
  <div class="simple-ai-assistant">
    <!-- Toggle Button -->
    <button @click="toggleAssistant" class="ai-toggle-btn" :class="{ active: isActive }">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2l3.09 6.26L13.17 16l-3.09-6.26a8 8 0 0 1 3.54 0 0 1-3.54z"/>
      </svg>
      <span class="ai-label">Help</span>
    </button>

    <!-- Chat Panel -->
    <div class="ai-chat-panel" v-if="isActive">
      <div class="ai-chat-header">
        <h3>Kigali Tech Store Assistant</h3>
        <p class="ai-status">{{ isLoading ? 'Typing...' : 'Ready to help' }}</p>
      </div>

      <!-- Messages -->
      <div class="ai-messages-container" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="ai-message"
          :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
        >
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
            placeholder="Ask me anything about products, orders, or the store..."
            class="ai-input"
            rows="3"
            :disabled="isLoading"
            ref="messageInput"
          ></textarea>
          <button 
            @click="sendMessage" 
            class="ai-send-btn"
            :disabled="isLoading || !currentMessage.trim()"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,13"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
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
const currentMessage = ref('')
const messages = ref([])
const unreadCount = ref(0)
const messagesContainer = ref(null)
const messageInput = ref(null)

function toggleAssistant() {
  isActive.value = !isActive.value
  console.log('AI Assistant toggled:', isActive.value)
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
    content: 'Hello! I\'m your Kigali Tech Store assistant. I can help you with:\n\n• Product recommendations\n• Order tracking and delivery status\n• Store information and policies\n• Technical support and troubleshooting\n\nHow can I assist you today?',
    timestamp: new Date()
  }]
})

onUnmounted(() => {
  clearResponse()
})
</script>

<style scoped>
.simple-ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ai-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.ai-toggle-btn.active {
  background: var(--color-secondary);
}

.ai-label {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

/* Chat Panel */
.ai-chat-panel {
  position: absolute;
  bottom: 70px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--color-primary);
  transform: translateY(20px);
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.simple-ai-assistant.active .ai-chat-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-primary);
  background: var(--color-surface);
}

.ai-chat-header h3 {
  margin: 0;
  color: var(--gray-900);
  font-size: 16px;
  font-weight: 600;
}

.ai-status {
  color: var(--color-primary);
  font-size: 12px;
  margin-top: 4px;
}

/* Messages */
.ai-messages-container {
  max-height: 300px;
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--gray-100);
}

.user-message .message-content {
  background: var(--color-primary);
  color: white;
}

.ai-message .message-content {
  background: var(--gray-50);
  color: var(--gray-900);
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  color: var(--gray-500);
  text-align: right;
}

/* Input Area */
.ai-input-area {
  padding: 16px;
  border-top: 1px solid var(--color-primary);
  background: var(--color-surface);
}

.ai-input-wrapper {
  display: flex;
  gap: 12px;
}

.ai-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--gray-400);
  border-radius: 8px;
  background: var(--gray-50);
  color: var(--gray-900);
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
}

.ai-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.ai-send-btn {
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.ai-send-btn:hover:not(:disabled) {
  background: var(--color-secondary);
}

.ai-send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .simple-ai-assistant {
    bottom: 10px;
    right: 10px;
  }
  
  .ai-chat-panel {
    width: calc(100vw - 20px);
    right: 10px;
    left: auto;
    bottom: 60px;
  }
  
  .ai-toggle-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
    left: auto;
  }
}
</style>
