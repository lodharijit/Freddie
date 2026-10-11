import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          <h2 className="text-lg font-bold font-serif text-stone-900">Your Saved Wishlist</h2>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {wishlist.length}
          </span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 text-xs">No saved items in your wishlist yet.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl bg-white"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs truncate">{item.name}</h4>
                  <span className="text-xs font-extrabold text-emerald-700">${item.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold p-2.5 rounded-xl flex items-center gap-1"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="text-stone-400 hover:text-rose-500 p-2.5 rounded-xl hover:bg-rose-50"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
