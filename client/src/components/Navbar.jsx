import React from 'react';
import { ShoppingBag, Heart, Search, Home, ShieldCheck, PackageCheck } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAdmin,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  isAdmin
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-4">
        <span>✨ Free standard shipping on orders over $100</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline text-amber-300">30-Day Hassle-Free Home Trial</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <div
            onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:bg-emerald-800 transition-colors">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 block leading-none font-serif">
                Haven & Hearth
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold block mt-1">
                Household Goods
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-lg hidden sm:block relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search kitchenware, linens, decor, furniture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-800 placeholder-stone-400 rounded-full border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenOrders}
              className="p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="My Orders"
            >
              <PackageCheck className="w-5 h-5" />
              <span className="hidden lg:inline">Orders</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="hidden lg:inline">{isAdmin ? 'Admin Active' : 'Admin'}</span>
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold">{cartCount}</span>
              <span className="hidden sm:inline border-l border-emerald-600 pl-2 text-emerald-100 text-xs">
                Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
