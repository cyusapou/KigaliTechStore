# Kigali Tech Store

A modern e-commerce platform built with Vue 3, featuring a Rwanda-inspired design theme and comprehensive shopping functionality.

## 🌟 Features

- **Product Catalog**: Browse and search products from FakeStoreAPI
- **Shopping Cart**: Full cart management with quantity controls
- **Wishlist**: Save favorite items for later
- **User Authentication**: Login and registration system
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Rwanda Theme**: Inspired by Rwandan flag colors (blue, green, yellow)
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- **Local Storage**: Persistent cart and wishlist data

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Plain CSS (no frameworks!)
- **HTTP Client**: Axios
- **Icons**: Custom SVG icons
- **API**: FakeStoreAPI

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kigali-tech-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Header, Footer
│   ├── products/         # ProductCard, RatingStars
│   ├── cart/            # CartItem
│   └── ui/              # Toast, Spinner, Breadcrumb
├── views/               # Page components
├── stores/              # Pinia stores
├── composables/         # Reusable composition functions
├── router/              # Vue Router configuration
├── utils/               # API utilities
└── assets/styles/       # CSS and design tokens
```

## 🎨 Design System

The project uses a custom plain CSS design system with:

- **Color Palette**: Rwanda-inspired theme
  - Primary Blue: `#00A1DE`
  - Secondary Green: `#20603D`
  - Accent Yellow: `#FAD201`
- **Typography**: Plus Jakarta Sans & Sora fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components

## 🛒 E-commerce Features

### Product Management
- Product listing with pagination
- Product detail pages with image galleries
- Category-based filtering
- Search functionality
- Price range filtering
- Sort options

### Shopping Cart
- Add/remove items
- Quantity adjustment
- Price calculations (including 18% VAT)
- Coupon codes (try: `KIGALI10`)
- Persistent storage

### Wishlist
- Save favorite products
- Move items to cart
- Persistent storage

### User Experience
- Toast notifications
- Loading states
- Error handling
- Mobile-responsive design
- Smooth animations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key_here
VITE_API_BASE=https://fakestoreapi.com
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast mode support
- Reduced motion support

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
# Deploy the `dist` folder to your hosting provider
```

## 🎯 Key Features Demonstrated

### Vue 3 Composition API
- Reactive state management
- Computed properties
- Lifecycle hooks
- Component composition

### State Management with Pinia
- Centralized store architecture
- LocalStorage persistence
- Reactive getters and actions

### Modern CSS Techniques
- CSS Grid and Flexbox
- Custom properties (variables)
- Smooth animations and transitions
- Mobile-first responsive design

### Performance Optimizations
- Lazy loading images
- Code splitting with dynamic imports
- Efficient reactivity patterns
- Optimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FakeStoreAPI for providing the product data
- Vue.js team for the amazing framework
- Rwanda flag colors for design inspiration

---

**Built with ❤️ in Kigali, Rwanda**
