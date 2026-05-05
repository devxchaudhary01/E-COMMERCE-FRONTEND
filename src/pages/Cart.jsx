import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
        >
          Browse Products →
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Your Cart <span className="text-orange-500">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4 fade-in">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                onError={(e) => { e.target.src = `https://placehold.co/100x100/f97316/white?text=IMG`; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{item.name}</h3>
                <p className="text-orange-500 font-bold text-base mb-3">{formatPrice(item.price)}</p>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 font-bold text-lg"
                    >−</button>
                    <span className="px-3 py-1 font-semibold text-gray-800 min-w-[32px] text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 font-bold text-lg"
                    >+</button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-orange-500">Add {formatPrice(999 - cartTotal)} more for free shipping!</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between font-extrabold text-gray-900 text-lg">
                <span>Total</span>
                <span className="text-orange-500">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              state={{ shippingCost, total }}
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-95"
            >
              Proceed to Checkout →
            </Link>

            <Link to="/" className="block text-center text-orange-500 hover:text-orange-600 text-sm font-medium mt-4">
              ← Continue Shopping
            </Link>

            {/* Secure badges */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
              <span className="text-xs text-gray-400">🔒 Secure</span>
              <span className="text-xs text-gray-400">🚀 Fast</span>
              <span className="text-xs text-gray-400">💯 Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
