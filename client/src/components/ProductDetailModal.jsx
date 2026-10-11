import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Plus, Minus, Send, Check } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isInCart,
  onAddReview
}) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image_url);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setSelectedImage(product.image_url);
    setQuantity(1);
  }, [product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;
    setReviewSubmitting(true);
    await onAddReview(product.id, {
      user_name: reviewerName,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewerName('');
    setReviewComment('');
    setReviewSubmitting(false);
  };

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-100 hover:bg-stone-200 text-stone-600 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-inner">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === imgUrl ? 'border-emerald-600 scale-95 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {product.category_name || 'Household'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-3">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating) ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800">{product.rating}</span>
                <span className="text-xs text-stone-400">({product.review_count} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-base text-stone-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className={`text-xs font-semibold mt-2 ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `In Stock - ${product.stock} units available` : 'Currently Out of Stock'}
              </p>

              <p className="text-stone-600 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold uppercase text-stone-500">Quantity</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isInCart ? 'Add More To Cart' : 'Add To Cart'}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-stone-300 hover:bg-stone-100 text-stone-700'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 p-6 sm:p-8 bg-stone-50/50">
          <div className="flex border-b border-stone-200 gap-6 mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'details'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'specs'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {activeTab === 'details' && (
            <div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
                {product.features && Array.isArray(product.features) ? (
                  product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-stone-200/60 shadow-2xs">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-stone-500">No feature details provided.</p>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden text-sm">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                Object.entries(product.specs).map(([key, val], idx) => (
                  <div key={idx} className="flex justify-between p-3.5">
                    <span className="font-semibold text-stone-500">{key}</span>
                    <span className="font-bold text-stone-900">{val}</span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-stone-500">No specifications listed.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((rev) => (
                    <div key={rev.id || Math.random()} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{rev.user_name}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600 text-xs mt-2 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500">No reviews yet. Be the first to review this product!</p>
              )}

              <form onSubmit={handleReviewSubmit} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mt-6">
                <h4 className="font-bold text-stone-900 text-sm mb-3">Leave a Customer Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <textarea
                  placeholder="Write your honest review..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600 mb-3"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
