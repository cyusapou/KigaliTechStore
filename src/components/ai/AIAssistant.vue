<template>
  <div class="ai-assistant" :class="{ active: isActive, expanded: isExpanded }">
    <!-- Toggle Button -->
    <button @click="toggleAssistant" class="ai-toggle-btn" :class="{ active: isActive }">
      <div class="ai-icon-wrapper">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5v10l-10 5z"/>
          <path d="M8.5 2.5a1.5 1.5 0 0 1 3 0 3 1.5 0 0 1-3z"/>
          <path d="M12 15.5A3.5 3.5 0 0 1 0 3.5 0 0 1 0z"/>
        </svg>
        <span class="ai-label">Kigali AI</span>
        <span v-if="unreadCount > 0" class="ai-badge">{{ unreadCount }}</span>
      </div>
      <div class="ai-pulse"></div>
    </button>

    <!-- AI Panel -->
    <div class="ai-panel">
      <div class="ai-header">
        <h3>Kigali Tech Store Assistant</h3>
        <button @click="toggleAssistant" class="close-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="ai-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
        >
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="ai-input-container">
        <div class="ai-input-wrapper">
          <textarea
            v-model="currentMessage"
            @keydown.enter.prevent="sendMessage"
            @keydown.ctrl.enter.prevent="sendMessage"
            placeholder="Ask about products, orders, or store info..."
            class="ai-input"
            rows="1"
            :disabled="isLoading"
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
const isExpanded = ref(false)
const currentMessage = ref('')
const messages = ref([])
const unreadCount = ref(0)
const messagesContainer = ref(null)

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
    context += ' User is browsing products page. '
  } else if (currentPath.includes('/cart')) {
    context += ' User is viewing cart. '
  } else if (currentPath.includes('/checkout')) {
    context += ' User is in checkout process. '
  } else if (currentPath.includes('/profile')) {
    context += ' User is viewing profile. '
  }

  // Add cart context if available
  try {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cartData.length > 0) {
      context += ` User has ${cartData.length} items in cart: ${cartData.map(item => item.title).join(', ')}. `
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
    content: 'Hello! I\'m your Kigali Tech Store assistant. I can help you with product recommendations, order tracking, and any questions about our store. How can I assist you today?',
    timestamp: new Date()
  }]
})

onUnmounted(() => {
  clearResponse()
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--font-family);
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-full) var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.ai-toggle-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1));
  transform: rotate(0deg);
  transition: all 0.6s ease;
}

.ai-toggle-btn:hover::before {
  transform: rotate(180deg);
}

.ai-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: aiPulse 2s ease-in-out infinite;
}

@keyframes aiPulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
}

.ai-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.ai-toggle-btn.active {
  background: var(--color-secondary);
}

.ai-label {
  font-weight: 600;
  font-size: var(--text-sm);
}

.ai-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--color-danger);
  color: white;
  border-radius: var(--radius-full);
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-panel {
  position: absolute;
  bottom: 70px;
  right: 20px;
  width: 380px;
  max-height: 500px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-400);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all var(--transition-normal);
}

.ai-assistant.active .ai-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.ai-assistant.expanded .ai-panel {
  max-height: 600px;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-400);
  background: var(--color-surface);
}

.ai-header h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--gray-700);
}

.ai-messages {
  max-height: 300px;
  overflow-y: auto;
  padding: var(--space-4);
  background: var(--color-surface);
}

.message {
  margin-bottom: var(--space-3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.ai-message {
  display: flex;
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: var(--gray-50);
}

.user-message .message-content {
  background: var(--color-primary);
  color: white;
}

.ai-message .message-content {
  background: var(--gray-100);
  color: var(--gray-900);
}

.message-text {
  font-size: var(--text-sm);
  line-height: 1.4;
  margin-bottom: var(--space-2);
}

.message-time {
  font-size: var(--text-xs);
  color: var(--gray-500);
  text-align: right;
}

.ai-input-container {
  padding: var(--space-4);
  border-top: 1px solid var(--gray-400);
  background: var(--color-surface);
}

.ai-input-wrapper {
  display: flex;
  gap: var(--space-3);
}

.ai-input {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--gray-400);
  border-radius: var(--radius-md);
  background: var(--gray-50);
  color: var(--gray-900);
  font-size: var(--text-sm);
  resize: none;
  outline: none;
  transition: all var(--transition-fast);
}

.ai-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

.ai-send-btn {
  padding: var(--space-3);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
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
  border: 2px solid white;
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
  .ai-panel {
    width: 90vw;
    right: 5vw;
    bottom: 10px;
    left: 5vw;
    right: auto;
  }
  
  .ai-assistant {
    position: fixed;
    bottom: 10px;
    right: auto;
    left: 5vw;
  }
  
  .ai-toggle-btn {
    position: fixed;
    bottom: 10px;
    right: auto;
    left: 5vw;
  }
}
</style>
