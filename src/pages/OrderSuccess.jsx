import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, orderData } = location.state || {};

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-center">
      {/* Success animation */}
      <div className="relative inline-block mb-6">
        <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 text-3xl animate-bounce">🎉</div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Order Placed!</h1>
      <p className="text-gray-500 text-lg mb-8">
        Thank you{orderData?.name ? `, ${orderData.name}` : ''}! Your order has been placed successfully.
      </p>

      {/* Order ID */}
      {orderId && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 inline-block">
          <p className="text-orange-600 text-sm font-medium mb-1">Order ID</p>
          <p className="font-mono text-gray-800 font-bold text-sm break-all">{orderId}</p>
        </div>
      )}

      {/* Order details */}
      {orderData && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left mb-8 fade-in">
          <h2 className="font-bold text-gray-900 mb-4">Order Details</h2>

          <div className="grid grid-cols-2 gap-3 text-sm mb-5">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{orderData.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{orderData.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-semibold text-gray-800">{orderData.address}, {orderData.city} - {orderData.pincode}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-semibold text-gray-800 uppercase">{orderData.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Paid</p>
              <p className="font-bold text-orange-500 text-lg">{formatPrice(orderData.totalPrice)}</p>
            </div>
          </div>

          {/* Products */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-sm mb-3">Items Ordered ({orderData.products?.length})</p>
            <div className="space-y-2">
              {orderData.products?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: '📦', title: 'Processing', desc: 'Your order is being confirmed' },
          { icon: '🚀', title: 'Shipping', desc: 'Dispatched within 24 hours' },
          { icon: '🏠', title: 'Delivery', desc: '3-5 business days' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs font-bold text-gray-700">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
      >
        Continue Shopping →
      </Link>
    </main>
  );
};

export default OrderSuccess;
