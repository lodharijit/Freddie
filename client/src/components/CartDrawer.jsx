import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 || cart.length === 0 ? 0 : 15.00;
  const totalDiscount = (subtotal * discount);
  const estimatedTax = (subtotal - totalDiscount) * 0.08;
  const finalTotal = Math.max(0, subtotal - totalDiscount + shipping + estimatedTax);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscount(0.10);
      setPromoMessage('10% Welcome Discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'HEARTH20') {
      setDiscount(0.20);
      setPromoMessage('20% Hearth Discount applied!');
    } else {
      setPromoMessage('Invalid promo code. Try WELCOME10 or HEARTH20');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold font-serif text-stone-900">Your Shopping Cart</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">Your cart is empty</h3>
                <p className="text-stone-500 text-xs mb-6 max-w-xs">
                  Looks like you haven't added any household goods yet.
                </p>
                <button
                  onClick={onClose}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-full transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">${item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-bold text-xs text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-extrabold text-stone-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Promo Code (WELCOM10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white text-xs border border-stone-300 rounded-xl outline-none focus:border-emerald-600 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Apply
                </button>
              </form>

              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-stone-200 pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onProceedToCheckout(finalTotal, discount);
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
