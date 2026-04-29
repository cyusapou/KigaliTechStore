# KIGALI TECH STORE — WINDSURF EXECUTION BRIEF
### Role: You are the sole executor. I am the architect. Build exactly what is specified.

---

> **CRITICAL INSTRUCTION BEFORE ANYTHING ELSE:**
> Do NOT skip any feature listed here. Do NOT simplify routing, stores, or components to "save time."
> Every phase must be completed fully before moving to the next. If a feature is listed — it ships.
> This is a **3–6 hour sprint**, not a long-term project. Everything here is scoped to be achievable.
> When in doubt, build it. Do not ask — execute.

---

## PROJECT IDENTITY

**App Name:** Kigali Tech Store
**Type:** Single-Page Application (SPA) — E-Commerce
**Stack:** Vue 3 + Vite · Pinia · Vue Router 4 · Axios · Tailwind CSS · Stripe.js
**Data Source:** [Fake Store API](https://fakestoreapi.com)
**Theme:** Rwanda-inspired (blue, green, yellow from the Rwandan flag), warm and modern
**Target Users:** Local Kigali customers shopping for smartphones, laptops, accessories

---

## ARCHITECTURE OVERVIEW

```
src/
├── views/                  # Page-level route components
│   ├── Home.vue
│   ├── ProductsLayout.vue  # Nested route wrapper
│   ├── ProductsList.vue
│   ├── ProductDetail.vue
│   ├── Cart.vue
│   ├── Wishlist.vue
│   ├── Checkout.vue
│   ├── OrderSuccess.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Profile.vue
│   ├── ProfileOrders.vue
│   ├── ProfileWishlist.vue
│   └── NotFound.vue
├── components/
│   ├── layout/             # Header, Footer, Sidebar
│   ├── products/           # ProductCard, ProductGallery, RatingStars
│   ├── cart/               # CartItem, CartSummary
│   ├── ui/                 # Toast, Spinner, Modal, Breadcrumb, Badge
│   └── forms/              # InputField, AddressForm, SearchBar
├── stores/
│   ├── cart.js
│   ├── wishlist.js
│   ├── auth.js
│   └── products.js
├── composables/
│   ├── useToast.js
│   ├── useLocalStorage.js
│   └── useStripe.js
├── router/
│   └── index.js
├── utils/
│   ├── formatCurrency.js   # RWF, USD formatting
│   └── api.js              # Axios instance + interceptors
└── assets/
    └── styles/             # Tailwind config, custom CSS vars
```

---

## PHASE 0 — PROJECT SCAFFOLD
### ⏱ ~15 minutes | Foundation only. No features yet.

**Checklist — complete all before Phase 1:**

- [ ] `npm create vue@latest` with: Vue Router ✅, Pinia ✅, Vitest (optional), ESLint ✅
- [ ] Install: `axios`, `@stripe/stripe-js`, `tailwindcss`, `@tailwindcss/vite`, `swiper`
- [ ] Configure `tailwind.config.js` with custom Rwanda-themed color palette:
  ```js
  colors: {
    rwandan: {
      blue:   '#00A1DE',  // flag blue
      green:  '#20603D',  // flag green
      yellow: '#FAD201',  // flag yellow
      dark:   '#1A1A2E',
      light:  '#F5F7FA',
    }
  }
  ```
- [ ] Set up `src/utils/api.js` — Axios instance with `baseURL: 'https://fakestoreapi.com'`
  - Add request interceptor: attach JWT token from localStorage if present
  - Add response interceptor: catch 401 → clear auth store → redirect to `/login`
- [ ] Set up `src/router/index.js` — all routes defined (lazy-loaded), guards in place (see Phase 2)
- [ ] Wire up `main.js`: `app.use(router).use(pinia).mount('#app')`
- [ ] Create `index.html` with proper meta tags, viewport, favicon placeholder
- [ ] Set up `.env` with:
  ```
  VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
  VITE_API_BASE=https://fakestoreapi.com
  ```
- [ ] Add `.env` to `.gitignore` immediately — do not commit API keys

---

## PHASE 1 — STATE MANAGEMENT (PINIA STORES)
### ⏱ ~30 minutes | Stores must be complete before building any UI that depends on them.

Build all four stores. Each must persist relevant state to `localStorage` using a `watch` on the state.

---

### `stores/products.js`
```js
state: () => ({
  all: [],           // raw API response
  categories: [],    // fetched from /products/categories
  loading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',
  sortBy: 'default', // 'price-asc' | 'price-desc' | 'rating'
})

getters:
  filtered(state) → apply selectedCategory, searchQuery, sortBy on state.all
  byId: (state) => (id) => state.all.find(p => p.id == id)

actions:
  fetchAll()       → GET /products
  fetchCategories() → GET /products/categories
  fetchByCategory(cat) → GET /products/category/{cat}
  setCategory(cat)
  setSearch(query)
  setSort(sortBy)
```

---

### `stores/cart.js`
```js
state: () => ({
  items: []   // [{ id, title, price, image, qty, category }]
})

getters:
  count        → total number of items (sum of qty)
  subtotal     → sum(item.price * item.qty)
  tax          → subtotal * 0.18  (18% VAT Rwanda)
  shipping     → subtotal > 50000 ? 0 : 3000  (RWF, free above threshold)
  total        → subtotal + tax + shipping
  isEmpty      → items.length === 0

actions:
  add(product)         → if exists increment qty, else push with qty: 1
  remove(id)           → filter out
  updateQty(id, qty)   → qty <= 0 ? remove : update
  clear()              → items = []

persistence: watch(items, saveToLocalStorage, { deep: true })
  → key: 'kts_cart'
```

---

### `stores/wishlist.js`
```js
state: () => ({
  items: []   // same shape as cart items
})

getters:
  isWished: (state) => (id) => state.items.some(i => i.id == id)
  count → state.items.length

actions:
  toggle(product) → isWished ? remove : add
  remove(id)
  moveToCart(id)  → add to cart store, remove from wishlist

persistence: watch → key: 'kts_wishlist'
```

---

### `stores/auth.js`
```js
state: () => ({
  user: null,          // { id, email, name, avatar }
  token: null,
  isLoading: false,
})

getters:
  isAuthenticated → !!state.token

actions:
  login(email, password):
    → POST /auth/login with { username: email, password }
    → on success: store token in state + localStorage key 'kts_token'
    → set mock user object from email
  logout():
    → clear token + user, remove from localStorage
  initFromStorage():
    → on app mount, check localStorage for 'kts_token', restore if present
  register(data):
    → POST /users (FakeStore supports this)
    → on success: auto-login
```

---

## PHASE 2 — ROUTING
### ⏱ ~20 minutes | All routes defined. Guards wired. No 404s should go unhandled.

```js
// src/router/index.js
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/products',
    component: () => import('@/views/ProductsLayout.vue'),
    children: [
      {
        path: '',
        name: 'ProductsList',
        component: () => import('@/views/ProductsList.vue')
      },
      {
        path: ':id',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetail.vue'),
        props: true
      }
    ]
  },
  { path: '/cart',     name: 'Cart',     component: () => import('@/views/Cart.vue') },
  { path: '/wishlist', name: 'Wishlist', component: () => import('@/views/Wishlist.vue') },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: () => import('@/views/OrderSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',         redirect: 'orders' },
      { path: 'orders',   name: 'ProfileOrders',   component: () => import('@/views/ProfileOrders.vue') },
      { path: 'wishlist', name: 'ProfileWishlist', component: () => import('@/views/ProfileWishlist.vue') }
    ]
  },
  { path: '/login',    name: 'Login',    component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') }
]
```

**Global navigation guard:**
```js
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && auth.isAuthenticated) {
    next({ name: 'ProfileOrders' })
  } else {
    next()
  }
})
```

---

## PHASE 3 — LAYOUT COMPONENTS
### ⏱ ~30 minutes | Global shell. Every page uses these.

### `components/layout/AppHeader.vue`
- Logo: "Kigali Tech Store" — Rwandan flag colors, clean wordmark
- Navigation links: Home · Products · Cart (badge with count) · Wishlist (badge)
- Right side: Search bar (collapsible on mobile) · Login/Profile avatar
- Mobile: hamburger menu → slide-in drawer with all nav links
- Cart badge: live count from `useCartStore().count`
- Wishlist badge: live count from `useWishlistStore().count`
- Search input: `v-model` bound to `useProductsStore().setSearch(query)`, triggers navigation to `/products`
- ARIA: `role="banner"`, `aria-label` on nav, skip-to-content link at top

### `components/layout/AppFooter.vue`
- Brand tagline in Kinyarwanda + English
- Links: Products · About · Contact · Privacy
- Social icons (SVG only)
- Copyright with current year (computed)

### `components/ui/Toast.vue` + `composables/useToast.js`
- Notification system: success, error, warning, info variants
- Auto-dismiss after 3 seconds
- Stack multiple toasts at bottom-right
- Triggered from any component via: `const toast = useToast(); toast.success('Added to cart!')`

### `components/ui/LoadingSpinner.vue`
- Full-screen overlay variant (for page loads)
- Inline variant (for buttons, cards)
- Rwandan blue color

### `components/ui/Breadcrumb.vue`
- Accepts array of `{ label, to }` objects
- Used on: ProductDetail, Checkout, Profile nested routes

---

## PHASE 4 — HOME PAGE
### ⏱ ~30 minutes | `/` route

**Sections (top to bottom):**

### Hero Banner
- Full-width, Rwanda-themed gradient background
- H1: "Your Tech Hub in Kigali" 
- Subtitle in Kinyarwanda: "Ibicuruzwa by'ikoranabuhanga ku giciro gihendutse"
- CTA button: "Shop Now" → navigates to `/products`
- Decorative product images (floating/layered) on right side

### Featured Products Slider
- Fetch: `GET /products?limit=8`
- Use **Swiper.js** (`import { Swiper, SwiperSlide } from 'swiper/vue'`)
- Config: `slidesPerView: 1`, breakpoints for 2/3/4 per view
- Each slide: `<ProductCard>` component
- Title: "Featured Products"
- Loading: show skeleton cards (4 placeholder cards) while fetching

### Categories Grid
- Fetch: `GET /products/categories`
- Display each category as a clickable card with:
  - Category-appropriate icon (SVG or emoji)
  - Category name (capitalized)
  - On click: navigate to `/products?category={name}`
- 2×2 on mobile, 4-column row on desktop

### Why Shop With Us (Trust Strip)
- 4 icons with text: Free Shipping · Secure Payment · Local Support · Easy Returns
- Simple icon row, muted colors

---

## PHASE 5 — PRODUCTS PAGES
### ⏱ ~45 minutes | `/products` and `/products/:id`

### `views/ProductsList.vue`
**Filters sidebar (desktop) / bottom sheet (mobile):**
- Category select: from `productsStore.categories` (populated on mount)
- Price range: dual-handle slider (min/max), default 0–200 USD
- Sort by: dropdown (Default · Price: Low–High · Price: High–Low · Rating)
- Search: debounced input (300ms), syncs with store
- All filters reflected in URL query params: `?category=electronics&minPrice=10&sort=price-asc`
- On mount: read query params and initialize store filters from them (deep-link support)

**Product grid:**
- 2 cols mobile · 3 cols tablet · 4 cols desktop
- If product count > 50: implement **virtual scrolling** (use `vue-virtual-scroller` or manual intersection observer approach)
- Empty state: illustration + "No products found. Clear filters." button
- Loading state: 8 skeleton cards

### `components/products/ProductCard.vue`
Props: `{ product }`
- Product image (lazy-loaded with `loading="lazy"`)
- Category badge (top-left)
- Title (max 2 lines, text-ellipsis)
- Star rating: `RatingStars` component (filled/half/empty stars from `product.rating.rate`)
- Review count: `(${product.rating.count} reviews)`
- Price: formatted in both USD and RWF equivalent (use fixed rate: 1 USD = 1,300 RWF)
- Add to Cart button → triggers `cartStore.add(product)` + toast
- Heart icon (wishlist toggle) → `wishlistStore.toggle(product)`, filled if wished
- Hover state: slight scale + shadow

### `views/ProductDetail.vue`
Route param: `id` (props: true)
- Fetch: `GET /products/:id` OR use `productsStore.byId(id)` if already loaded
- **Image gallery:** main large image + thumbnails row (mock multiple images with same image)
- Product title, category badge, rating stars + count
- Price (USD + RWF)
- Description (full)
- **Add to Cart:** quantity stepper (−/+) then "Add to Cart" button
  - Shows "Added!" state briefly after click
- **Add to Wishlist:** heart button
- **Breadcrumb:** Home > Products > {category} > {title}
- Related products: fetch same category, show 4 `ProductCard` components below
- Loading: skeleton layout while fetching

### `components/products/RatingStars.vue`
Props: `{ rating: Number, count: Number }`
- Renders 5 stars, filled proportionally
- Shows `rating/5` text + count in parentheses

---

## PHASE 6 — CART PAGE
### ⏱ ~30 minutes | `/cart`

### `views/Cart.vue`
**Empty state:**
- Illustration + "Your cart is empty" + "Start Shopping" button

**Cart items list:**
- Each item: `<CartItem>` component
- `components/cart/CartItem.vue` props: `{ item }`
  - Product image (80×80)
  - Title + category
  - Price per unit
  - Quantity stepper: minus button · qty input · plus button
    - Minus at qty=1 → show confirm removal or just remove
    - Direct input allowed (validate: positive integer only)
  - Remove button (trash icon) + confirmation
  - Subtotal for that line: `item.price * item.qty`

**Order summary panel (sticky on desktop, below list on mobile):**
- Subtotal
- Tax (18% VAT — label it clearly)
- Shipping (show "FREE" if above threshold, else show RWF amount)
- **Total** (bold, large)
- "Proceed to Checkout" → navigates to `/checkout`
  - If not authenticated: show toast "Please login to checkout" → redirect to `/login?redirect=/checkout`
- "Continue Shopping" link → `/products`
- Coupon code input (UI only — apply mock discount of 10% if code is `KIGALI10`)

---

## PHASE 7 — WISHLIST PAGE
### ⏱ ~15 minutes | `/wishlist`

### `views/Wishlist.vue`
- Uses `useWishlistStore()`
- **Empty state:** heart illustration + "No saved items yet" + "Browse Products"
- **Items grid:** same card layout as product list (2–3 cols)
  - Each card: `ProductCard` variant with:
    - "Move to Cart" button → `wishlistStore.moveToCart(id)` + success toast
    - "Remove" button → `wishlistStore.remove(id)` + toast
- Total saved items count in page heading: `Wishlist (3 items)`

---

## PHASE 8 — CHECKOUT + STRIPE
### ⏱ ~45 minutes | `/checkout` — Auth-guarded

### `views/Checkout.vue`

**Guard:** This route has `meta: { requiresAuth: true }`. Guard redirects to `/login` if not authenticated.

**Layout:** Two-column (form left, order summary right). Stacks on mobile.

**Step 1 — Delivery Address Form (`components/forms/AddressForm.vue`)**
Fields (all required):
- Full name
- Phone number (Rwandan format: 078/079/072/073 XXXXXXX)
- Street address
- District (dropdown: Kigali districts — Gasabo, Kicukiro, Nyarugenge)
- Sector (text input)
- Delivery notes (optional textarea)
- Validation: all required fields, phone regex, min lengths
- Show inline error messages below each field

**Step 2 — Order Review**
- List of cart items (read-only): image, title, qty, subtotal
- Totals: subtotal, tax, shipping, grand total
- Edit cart link

**Step 3 — Payment (Stripe Elements)**
```js
// composables/useStripe.js
import { loadStripe } from '@stripe/stripe-js'
const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const elements = stripe.elements()
const cardElement = elements.create('card', {
  style: { base: { fontSize: '16px', color: '#1A1A2E' } }
})
cardElement.mount('#card-element')
```

- Mount card element into `#card-element` div
- Show card errors in real-time below the card field
- "Pay Now" button:
  - Shows spinner while processing
  - On click: `stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } })`
  - Use mock `clientSecret` (for test mode — generate a fake one or use Stripe test flow)
  - **On success:** 
    - `cartStore.clear()`
    - Save order to `authStore.orders` + localStorage
    - Navigate to `/order-success`
  - **On failure:** show error toast with Stripe error message

**Test card to document in README:** `4242 4242 4242 4242` exp: any future date, CVV: any 3 digits

### `views/OrderSuccess.vue`
- Animated checkmark (CSS animation)
- "Thank you, {user.name}!" heading
- Order summary: items, total, delivery address
- "Continue Shopping" CTA
- "View Orders" link → `/profile/orders`

---

## PHASE 9 — AUTH PAGES
### ⏱ ~25 minutes | `/login` and `/register`

Both pages: centered card layout, Kigali Tech Store branding at top

### `views/Login.vue`
- Email + password fields
- "Remember me" checkbox
- Login button → `authStore.login(email, password)`
- Loading state on button while request is in flight
- Error display (wrong credentials, network error)
- "Don't have an account? Register" link
- After login: redirect to `route.query.redirect || '/'`
- OAuth placeholder buttons (Google/Apple) — UI only, show "Coming soon" toast

### `views/Register.vue`
- Fields: First name · Last name · Email · Password · Confirm Password
- Password strength indicator (weak/medium/strong)
- Terms & conditions checkbox (required)
- On submit: `authStore.register(data)` then redirect to `/`
- "Already have an account? Login" link
- All fields validated client-side before submission

---

## PHASE 10 — PROFILE PAGES
### ⏱ ~20 minutes | `/profile` nested routes — Auth-guarded

### `views/Profile.vue` (wrapper)
- Sidebar navigation: "My Orders" · "Saved Items" · "Account Settings"
- User avatar (initials-based circle if no photo)
- User name + email display
- "Logout" button → `authStore.logout()` → redirect to `/`

### `views/ProfileOrders.vue`
- Display mock orders from `authStore.orders` array
- If no real orders (no completed checkout yet): show 3 hardcoded mock orders
- Each order card:
  - Order ID (generated UUID)
  - Date placed
  - Status badge: Processing / Shipped / Delivered
  - Items summary (images row)
  - Total amount
  - "View Details" → expand accordion within card

### `views/ProfileWishlist.vue`
- Reuse wishlist display from Phase 7 (same `useWishlistStore()`)
- Identical UX to `/wishlist` page

---

## PHASE 11 — 404 PAGE
### ⏱ ~10 minutes

### `views/NotFound.vue`
- Friendly illustration or large "404" typography
- "Oops! This page wandered off in Kigali somewhere."
- Two buttons: "Go Home" (`/`) and "Browse Products" (`/products`)
- Kigali-themed subtle background (rolling hills outline SVG)

---

## PHASE 12 — ACCESSIBILITY + PERFORMANCE
### ⏱ ~20 minutes | Non-negotiable. Do not skip.

**Accessibility (A11y):**
- [ ] All interactive elements have `aria-label` where icon-only
- [ ] Cart count badge: `aria-label="Cart: 3 items"`
- [ ] Loading spinners: `role="status" aria-label="Loading..."`
- [ ] Form fields: `<label for="...">` properly linked to inputs
- [ ] Modal/drawer: focus trap, `Escape` closes, `aria-modal="true"`
- [ ] Keyboard navigation: Tab order logical throughout, Enter/Space on buttons
- [ ] Color contrast: all text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- [ ] Product images: descriptive `alt` attributes (use `product.title`)

**Performance:**
- [ ] All routes: lazy-loaded (`() => import(...)`) — already in router setup
- [ ] All product images: `loading="lazy"` attribute
- [ ] Search input: debounced (300ms) before triggering filter
- [ ] Virtual scrolling if product list exceeds 50 items (use `v-virtual-scroller` or intersection observer batching)
- [ ] Axios requests: cancel on component unmount using `AbortController`
- [ ] `defineAsyncComponent` for heavy components (ProductGallery, Stripe form)

---

## PHASE 13 — FINAL WIRING + DEPLOYMENT
### ⏱ ~20 minutes

**Final checks:**
- [ ] `app.use(router)` — router guard calls `authStore.initFromStorage()` in `app.beforeCreate` or router `beforeEach` first hook
- [ ] All stores initialized with `createPinia()` before router
- [ ] Currency formatter in `utils/formatCurrency.js`:
  ```js
  export const formatRWF = (usd) => 
    new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' })
      .format(usd * 1300)
  export const formatUSD = (usd) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd)
  ```
- [ ] All error states handled (API down → error toast, not blank screen)
- [ ] All loading states covered (no flash of empty content)
- [ ] Console is clean — no Vue warnings, no undefined errors

**README.md must include:**
- Project overview + screenshot
- Setup instructions (`npm install`, `npm run dev`)
- `.env` setup with placeholder keys
- Stripe test card details
- Features list
- Live demo link

**Deployment (Vercel):**
- Connect GitHub repo
- Set environment variables in Vercel dashboard
- Build command: `npm run build`
- Output directory: `dist`

---

## COMPONENT COMPLETION CHECKLIST

Before declaring any phase done, verify these for every component built:

| Check | Requirement |
|-------|-------------|
| Props | All props typed with `defineProps` |
| Emits | All emits declared with `defineEmits` |
| Loading | Every async operation has a loading state |
| Error | Every async operation has an error state shown in UI |
| Empty | Every list has an empty state |
| Mobile | Every component is functional and styled on 375px viewport |
| ARIA | Every interactive element has proper ARIA attributes |
| Toast | Every user action (add to cart, remove, login, etc.) shows a toast |

---

## STORE PERSISTENCE PATTERN
Use this pattern in every store that needs localStorage:

```js
import { watch } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('kts_cart') || '[]'))
  
  watch(items, (val) => {
    localStorage.setItem('kts_cart', JSON.stringify(val))
  }, { deep: true })

  // ... rest of store
  return { items, /* getters, actions */ }
})
```

---

## DESIGN SYSTEM TOKENS

```css
/* src/assets/styles/tokens.css */
:root {
  --color-primary:    #00A1DE;   /* Rwandan flag blue */
  --color-secondary:  #20603D;   /* Rwandan flag green */
  --color-accent:     #FAD201;   /* Rwandan flag yellow */
  --color-dark:       #1A1A2E;
  --color-light:      #F5F7FA;
  --color-surface:    #FFFFFF;
  --color-muted:      #6B7280;
  --color-danger:     #EF4444;
  --color-success:    #10B981;
  --color-warning:    #F59E0B;

  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  20px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);

  --font-body:    'Plus Jakarta Sans', sans-serif;
  --font-heading: 'Sora', sans-serif;
}
```

---

## API ENDPOINTS REFERENCE

| Endpoint | Used In |
|----------|---------|
| `GET /products` | Home featured, ProductsList |
| `GET /products/:id` | ProductDetail |
| `GET /products/categories` | Categories grid, filter sidebar |
| `GET /products/category/:name` | ProductsList (filtered) |
| `GET /products?limit=N` | Home slider |
| `POST /auth/login` | Login page |
| `POST /users` | Register page |

All via Axios instance in `src/utils/api.js`.

---

## WHAT DONE LOOKS LIKE

The project is complete when ALL of the following are true:

1. All 10+ routes navigate correctly with no 404s (except the intentional catch-all)
2. Cart persists across page refresh
3. Wishlist persists across page refresh
4. Login/logout flow works; protected routes redirect to login
5. Checkout is only accessible when authenticated
6. Stripe card element mounts and test payment flow completes (success or graceful error)
7. Order success page shows after payment
8. Profile/orders shows at least mock order history
9. All product filters work (category, price, search, sort)
10. App is fully responsive at 375px, 768px, and 1280px
11. No console errors or Vue warnings in production build
12. README is complete with setup instructions and env placeholder
13. Deployed and accessible via public URL

---

*Built for: Kigali Tech Store — L3 SOD Assignment*
*Architecture by: Project Lead*
*Execution by: Windsurf*
