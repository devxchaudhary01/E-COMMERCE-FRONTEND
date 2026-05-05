import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../utils/api';

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
        error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { shippingCost = 0, total = cartTotal } = location.state || {};

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '', paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit Indian mobile number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter valid 6-digit pincode';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (cart.length === 0) { navigate('/'); return; }

    setLoading(true);
    setApiError('');

    const orderData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      paymentMethod: form.paymentMethod,
      products: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      shippingCost,
      totalPrice: total,
    };

    try {
      const response = await placeOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { orderId: response.data.orderId, orderData } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/" className="text-orange-500 font-semibold hover:underline">← Go Shopping</Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Sachin Kumar" required />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="sachin@example.com" />
                <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9876543210" required />
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <InputField label="Full Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="House No., Street, Locality" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="New Delhi" required />
                  <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="110001" required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold">3</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'online', label: 'Online Payment', icon: '💳', desc: 'UPI / Card / Net Banking (Demo)' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={handleChange}
                      className="mt-1 accent-orange-500"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                {apiError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 text-lg"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order...
                </>
              ) : (
                <>🎉 Place Order — {formatPrice(total)}</>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48/f97316/white?text=P'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-800 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500 text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
