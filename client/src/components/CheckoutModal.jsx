import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck, Lock, ArrowRight } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  totalAmount,
  onCompleteOrder
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [form, setForm] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    paymentMethod: 'Credit Card'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip
          },
          items: cart,
          paymentMethod: form.paymentMethod
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setCompletedOrder(data);
        setStep('confirmation');
        onCompleteOrder();
      } else {
        alert('Checkout failed: ' + (data.error || 'Please try again'));
      }
    } catch (err) {
      setLoading(false);
      alert('Error connecting to checkout server');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 my-auto">
        {step !== 'confirmation' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center justify-center gap-3 mb-8 border-b border-stone-200 pb-4 text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">1</span>
            <span>Shipping</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[10px]">2</span>
            <span>Payment</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className={`flex items-center gap-1.5 ${step === 'confirmation' ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[10px]">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        {step === 'shipping' && (
          <form onSubmit={() => setStep('payment')} className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span>Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              <span>Payment Details</span>
            </h3>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Order Total Amount:</span>
              <span className="font-extrabold text-emerald-800 text-base">${totalAmount.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-2xl text-xs transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {loading ? 'Processing Order...' : `Pay $${totalAmount.toFixed(2)}`}
              </button>
            </div>
          </form>
        )}

        {step === 'confirmation' && completedOrder && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-stone-900">Thank You for Your Order!</h3>
            <p className="text-stone-600 text-xs max-w-md mx-auto">
              We have received your order and are preparing it for shipment.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500 font-semibold">Order Number:</span>
                <span className="font-extrabold text-stone-900">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Total Paid:</span>
                <span className="font-bold text-emerald-700">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-8 rounded-full text-xs transition-all shadow-md"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
