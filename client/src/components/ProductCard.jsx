import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isInCart
}) {
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
      <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_new && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-500'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
            {product.category_name || 'Household'}
          </span>

          <h3
            onClick={() => onQuickView(product)}
            className="font-serif font-bold text-stone-900 text-base line-clamp-1 hover:text-emerald-700 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-stone-800">{product.rating}</span>
            <span className="text-xs text-stone-400">({product.review_count})</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold block ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all font-semibold flex items-center gap-1 text-xs shadow-sm ${
              isInCart
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Add to Cart"
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
