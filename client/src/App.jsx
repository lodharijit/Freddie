import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import WishlistModal from './components/WishlistModal';
import OrdersModal from './components/OrdersModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('hh_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('hh_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  useEffect(() => {
    localStorage.setItem('hh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error loading categories:', err));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    let url = `/api/products?sort=${sortOption}`;
    if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
    if (searchTerm.trim() !== '') url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    if (featuredOnly) url += `&featured=true`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortOption, featuredOnly]);

  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const handleAddReview = async (productId, reviewData) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        const updatedRes = await fetch(`/api/products/${productId}`);
        const updatedProd = await updatedRes.json();
        setSelectedProduct(updatedProd);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };

  const handleProceedToCheckout = (finalTotal) => {
    setCheckoutTotal(finalTotal);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = () => {
    setCart([]);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        isAdmin={isAdminOpen}
      />

      <main className="flex-grow">
        {selectedCategory === 'all' && !searchTerm && (
          <HeroBanner
            onShopNow={() => {
              const catalogElement = document.getElementById('catalog');
              if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 mb-6 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-stone-900">
                {selectedCategory === 'all'
                  ? 'All Household Products'
                  : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
              <span className="text-xs text-stone-400 font-medium">({products.length} items)</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  featuredOnly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured Only</span>
              </button>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold py-1.5 px-3 rounded-xl outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-3">
                  <div className="aspect-square bg-stone-200 rounded-xl" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-8 bg-stone-200 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto my-8">
              <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">No products found</h3>
              <p className="text-stone-500 text-xs mb-6">
                Try adjusting your search terms or category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setFeaturedOnly(false);
                }}
                className="bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-full"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => {
                    fetch(`/api/products/${p.id}`)
                      .then((res) => res.json())
                      .then((fullData) => setSelectedProduct(fullData))
                      .catch(() => setSelectedProduct(p));
                  }}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  isInCart={cart.some((item) => item.id === product.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
        isInCart={selectedProduct ? cart.some((item) => item.id === selectedProduct.id) : false}
        onAddReview={handleAddReview}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totalAmount={checkoutTotal}
        onCompleteOrder={handleCompleteOrder}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => setWishlist((prev) => prev.filter((it) => it.id !== id))}
        onAddToCart={handleAddToCart}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshProducts={fetchProducts}
      />
    </div>
  );
}
