import { ref } from 'vue'

export function useAI() {
  const isLoading = ref(false)
  const response = ref('')
  const error = ref('')

  async function askAI(question, context = '') {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      error.value = 'OpenRouter API key not configured'
      return
    }

    isLoading.value = true
    error.value = ''
    response.value = ''

    try {
      const messages = [
        {
          role: 'system',
          content: `You are "Kigali", a helpful AI assistant for Kigali Tech Store, an electronics store in Kigali, Rwanda. You help customers with product recommendations, order tracking, and general shopping assistance. Store context: ${context}`
        },
        {
          role: 'user',
          content: question
        }
      ]

      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://kigalitechstore.rw'
        },
        body: JSON.stringify({
          model: 'openrouter/chatgpt-4o-mini',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      })

      console.log('OpenRouter Response Status:', openRouterResponse.status)
      console.log('Response Headers:', Object.fromEntries(openRouterResponse.headers.entries()))

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text()
        console.error('OpenRouter Error:', errorText)
        throw new Error(`API Error: ${openRouterResponse.status} - ${errorText}`)
      }

      const data = await openRouterResponse.json()
      console.log('OpenRouter Response Data:', data)
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI')
      }

      response.value = data.choices[0]?.message?.content || 'Sorry, I could not process that request.'
      
    } catch (err) {
      console.error('OpenRouter API Error:', err)
      error.value = `Connection error: ${err.message}`
      response.value = 'Sorry, I encountered an error. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function clearResponse() {
    response.value = ''
    error.value = ''
  }

  return {
    isLoading,
    response,
    error,
    askAI,
    clearResponse
  }
}
