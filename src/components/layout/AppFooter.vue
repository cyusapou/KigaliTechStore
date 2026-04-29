<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-text">
              <span class="logo-main">Kigali</span>
              <span class="logo-accent">Tech</span>
              <span class="logo-main">Store</span>
            </div>
          </div>
          <p class="footer-tagline">
            Ibicuruzwa by'ikoranabuhanga ku giciro gihendutse
          </p>
          <p class="footer-tagline-english">
            Your technology products at affordable prices
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-heading">Quick Links</h3>
          <nav aria-label="Footer navigation">
            <ul class="footer-links">
              <li>
                <router-link to="/products" class="footer-link">Products</router-link>
              </li>
              <li>
                <router-link to="/cart" class="footer-link">Cart</router-link>
              </li>
              <li>
                <router-link to="/wishlist" class="footer-link">Wishlist</router-link>
              </li>
              <li>
                <router-link to="/profile" class="footer-link">My Account</router-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Categories -->
        <div class="footer-section">
          <h3 class="footer-heading">Categories</h3>
          <nav aria-label="Categories navigation">
            <ul class="footer-links">
              <li>
                <a href="/products?category=electronics" class="footer-link">Electronics</a>
              </li>
              <li>
                <a href="/products?category=jewelery" class="footer-link">Jewelry</a>
              </li>
              <li>
                <a href="/products?category=mens-clothing" class="footer-link">Men's Clothing</a>
              </li>
              <li>
                <a href="/products?category=womens-clothing" class="footer-link">Women's Clothing</a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Support -->
        <div class="footer-section">
          <h3 class="footer-heading">Support</h3>
          <nav aria-label="Support navigation">
            <ul class="footer-links">
              <li>
                <a href="#" class="footer-link">About Us</a>
              </li>
              <li>
                <a href="#" class="footer-link">Contact</a>
              </li>
              <li>
                <a href="#" class="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="footer-link">Terms of Service</a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Social Media -->
        <div class="footer-section">
          <h3 class="footer-heading">Follow Us</h3>
          <div class="social-links" role="navigation" aria-label="Social media links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} Kigali Tech Store. All rights reserved.
          </p>
          <p class="made-in-rwanda">
            Made with <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: text-bottom;">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg> in Kigali, Rwanda
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, var(--color-dark) 0%, #2D3748 100%);
  color: var(--gray-300);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: var(--space-8);
  padding: var(--space-12) 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.footer-logo {
  margin-bottom: var(--space-4);
}

.logo-text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.logo-main {
  color: var(--color-primary);
}

.logo-accent {
  color: var(--color-accent);
}

.footer-tagline {
  font-style: italic;
  color: var(--gray-400);
  margin-bottom: var(--space-2);
}

.footer-tagline-english {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.footer-heading {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: white;
  margin-bottom: var(--space-4);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-link {
  color: var(--gray-400);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
  padding: var(--space-1) 0;
}

.footer-link:hover {
  color: var(--color-primary);
}

.social-links {
  display: flex;
  gap: var(--space-3);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-400);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-6) 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.made-in-rwanda {
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-6);
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding: var(--space-8) 0;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .logo-text {
    font-size: var(--text-lg);
  }
  
  .footer-heading {
    font-size: var(--text-base);
  }
}
</style>
