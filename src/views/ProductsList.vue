<template>
  <div class="products-list-page">
    <div class="container">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />
      
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">{{ filteredProducts.length }} products found</p>
      </div>

      <div class="products-content">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar" role="complementary" aria-label="Product filters">
          <div class="filters-header">
            <h2>Filters</h2>
            <button 
              @click="clearAllFilters"
              class="btn btn-ghost btn-sm"
              :disabled="!hasActiveFilters"
            >
              Clear All
            </button>
          </div>

          <!-- Category Filter -->
          <div class="filter-section">
            <h3>Category</h3>
            <div class="category-filters">
              <label class="category-option">
                <input
                  type="radio"
                  name="category"
                  :value="null"
                  v-model="selectedCategory"
                  @change="handleCategoryChange"
                />
                <span>All Categories</span>
              </label>
              <label 
                v-for="category in productsStore.categories"
                :key="category"
                class="category-option"
              >
                <input
                  type="radio"
                  name="category"
                  :value="category"
                  v-model="selectedCategory"
                  @change="handleCategoryChange"
                />
                <span>{{ formatCategoryName(category) }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-section">
            <h3>Price Range</h3>
            <div class="price-range">
              <div class="price-inputs">
                <div class="form-group">
                  <label for="min-price">Min Price ($)</label>
                  <input
                    id="min-price"
                    type="number"
                    v-model.number="minPrice"
                    @input="handlePriceChange"
                    min="0"
                    step="1"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label for="max-price">Max Price ($)</label>
                  <input
                    id="max-price"
                    type="number"
                    v-model.number="maxPrice"
                    @input="handlePriceChange"
                    min="0"
                    step="1"
                    class="form-input"
                  />
                </div>
              </div>
              <div class="price-slider">
                <input
                  type="range"
                  v-model.number="minPrice"
                  @input="handlePriceChange"
                  min="0"
                  max="200"
                  step="1"
                  class="range-slider"
                />
                <input
                  type="range"
                  v-model.number="maxPrice"
                  @input="handlePriceChange"
                  min="0"
                  max="200"
                  step="1"
                  class="range-slider"
                />
              </div>
            </div>
          </div>

          <!-- Sort Filter -->
          <div class="filter-section">
            <h3>Sort By</h3>
            <select 
              v-model="sortBy" 
              @change="handleSortChange"
              class="form-input"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="products-main" role="main">
          <!-- Search Bar -->
          <div class="search-section">
            <div class="search-bar">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search products..."
                class="search-input"
              />
              <button 
                v-if="searchQuery"
                @click="clearSearch"
                class="search-clear"
                aria-label="Clear search"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="productsStore.loading" class="products-grid">
            <div v-for="i in 8" :key="i" class="skeleton-card skeleton"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="productsStore.error" class="error-state">
            <div class="error-content">
              <h3>Oops! Something went wrong</h3>
              <p>{{ productsStore.error }}</p>
              <button @click="loadProducts" class="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-content">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button @click="clearAllFilters" class="btn btn-primary">
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-outline btn-sm"
            >
              Previous
            </button>
            
            <div class="page-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="['page-btn', { active: page === currentPage }]"
                class="btn btn-sm"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

// Reactive state
const selectedCategory = ref(null)
const minPrice = ref(0)
const maxPrice = ref(200)
const sortBy = ref('default')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// Computed properties
const filteredProducts = computed(() => {
  let products = [...productsStore.filtered]
  
  // Apply price filter
  if (minPrice.value > 0 || maxPrice.value < 200) {
    products = products.filter(product => 
      product.price >= minPrice.value && product.price <= maxPrice.value
    )
  }
  
  return products
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const hasActiveFilters = computed(() => {
  return selectedCategory.value || 
         minPrice.value > 0 || 
         maxPrice.value < 200 || 
         searchQuery.value ||
         sortBy.value !== 'default'
})

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' }
])

// Methods
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function handleCategoryChange() {
  productsStore.setCategory(selectedCategory.value)
  updateURL()
  currentPage.value = 1
}

function handlePriceChange() {
  updateURL()
  currentPage.value = 1
}

function handleSortChange() {
  productsStore.setSort(sortBy.value)
  updateURL()
  currentPage.value = 1
}

function handleSearch() {
  productsStore.setSearch(searchQuery.value)
  updateURL()
  currentPage.value = 1
}

function clearSearch() {
  searchQuery.value = ''
  handleSearch()
}

function clearAllFilters() {
  selectedCategory.value = null
  minPrice.value = 0
  maxPrice.value = 200
  sortBy.value = 'default'
  searchQuery.value = ''
  
  productsStore.clearFilters()
  updateURL()
  currentPage.value = 1
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    updateURL()
  }
}

function updateURL() {
  const query = {}
  
  if (selectedCategory.value) query.category = selectedCategory.value
  if (minPrice.value > 0) query.minPrice = minPrice.value
  if (maxPrice.value < 200) query.maxPrice = maxPrice.value
  if (sortBy.value !== 'default') query.sort = sortBy.value
  if (searchQuery.value) query.search = searchQuery.value
  if (currentPage.value > 1) query.page = currentPage.value
  
  router.push({ path: '/products', query })
}

function loadProducts() {
  productsStore.fetchAll()
}

// Watch for URL changes
watch(() => route.query, (newQuery) => {
  // Update state from URL
  if (newQuery.category) {
    selectedCategory.value = newQuery.category
    productsStore.setCategory(newQuery.category)
  }
  
  if (newQuery.minPrice) minPrice.value = parseInt(newQuery.minPrice)
  if (newQuery.maxPrice) maxPrice.value = parseInt(newQuery.maxPrice)
  if (newQuery.sort) sortBy.value = newQuery.sort
  if (newQuery.search) searchQuery.value = newQuery.search
  if (newQuery.page) currentPage.value = parseInt(newQuery.page)
  
  // Apply filters to store
  productsStore.setSearch(searchQuery.value)
  productsStore.setSort(sortBy.value)
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    productsStore.fetchAll(),
    productsStore.fetchCategories()
  ])
})
</script>

<style scoped>
.products-list-page {
  padding: var(--space-6) 0;
}

.breadcrumb {
  margin-bottom: var(--space-6);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

.products-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
}

/* Filters Sidebar */
.filters-sidebar {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.filters-header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.filter-section {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
}

.price-section {
  margin-bottom: var(--space-3);
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-section h3 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.category-filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.category-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.category-option:hover {
  background: var(--gray-200);
}

.category-option input[type="radio"] {
  accent-color: var(--color-primary);
}

.category-option span {
  font-size: var(--text-sm);
  color: var(--gray-700);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.price-slider {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.range-slider {
  width: 100%;
  height: 6px;
  background: var(--gray-400);
  border-radius: var(--radius-full);
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-sm);
}

/* Products Main */
.products-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.search-section {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-6);
}

.search-bar {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
  border: 2px solid var(--gray-400);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--color-surface);
  color: var(--gray-700);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 161, 222, 0.1);
}

.search-bar::before {
  content: "";
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.search-clear {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--gray-200);
  color: var(--gray-600);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

/* States */
.error-state,
.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.error-content h3,
.empty-content h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.error-content p,
.empty-content p {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}

.skeleton-card {
  height: 400px;
  border-radius: var(--radius-lg);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.page-numbers {
  display: flex;
  gap: var(--space-2);
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .filters-sidebar {
    position: sticky;
    top: 80px;
    order: 2;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
  
  .products-main {
    order: 1;
  }
  
  .price-inputs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .products-list-page {
    padding: var(--space-4) 0;
  }
  
  .page-title {
    font-size: var(--text-3xl);
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-4);
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: var(--space-2);
  }
}

@media (max-width: 640px) {
  .products-content {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .filters-sidebar {
    padding: var(--space-4);
    position: sticky;
    top: 70px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
  
  .search-input {
    font-size: var(--text-sm);
  }
}
</style>
