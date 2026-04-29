import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

let stripeInstance = null

export function useStripe() {
  const loading = ref(false)
  const error = ref(null)

  async function getStripe() {
    if (!stripeInstance) {
      try {
        loading.value = true
        // Use environment variable for publishable key
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        stripeInstance = await loadStripe(publishableKey)
      } catch (err) {
        error.value = err.message
        console.error('Stripe initialization error:', err)
      } finally {
        loading.value = false
      }
    }
    return stripeInstance
  }

  async function createPaymentIntent(amount, currency = 'usd') {
    try {
      loading.value = true
      error.value = null

      // Create a real Stripe payment intent using environment variable
      // This will charge your Stripe test account when payment is confirmed
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: amount,
          currency: currency,
          'automatic_payment_methods[enabled]': 'true',
        }),
      })

      const paymentIntent = await response.json()
      
      if (paymentIntent.error) {
        throw new Error(paymentIntent.error.message)
      }

      return paymentIntent
    } catch (err) {
      error.value = err.message
      console.error('Payment intent creation error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function confirmPayment(clientSecret, cardElement) {
    try {
      loading.value = true
      error.value = null

      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Use real Stripe API to confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer',
          },
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (err) {
      error.value = err.message
      console.error('Payment confirmation error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function createCardElement(elements) {
    return elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1A1A2E',
          '::placeholder': {
            color: '#6B7280',
          },
          iconColor: '#00A1DE',
        },
        invalid: {
          color: '#EF4444',
          iconColor: '#EF4444',
        },
      },
      hidePostalCode: false,
    })
  }

  return {
    loading,
    error,
    getStripe,
    createPaymentIntent,
    confirmPayment,
    createCardElement,
  }
}
