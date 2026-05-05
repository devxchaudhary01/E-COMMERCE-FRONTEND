import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../utils/api';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isInCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  const inCart = product ? isInCart(product._id) : false;
  const cartItem = product ? cart.find((i) => i._id === product._id) : null;

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then((r) => setProduct(r.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-10 w-1/2 mt-4" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{error}</h2>
      <Link to="/" className="text-orange-500 font-semibold hover:underline">← Back to Home</Link>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <span className="text-orange-500 font-medium">{product.category}</span>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 fade-in">
        {/* Image */}
        <div className="relative">
          {!imgLoaded && <div className="skeleton h-[420px] rounded-2xl" />}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = `https://placehold.co/600x420/f97316/white?text=${encodeURIComponent(product.name.slice(0,10))}`; setImgLoaded(true); }}
            className={`w-full h-[420px] object-cover rounded-2xl shadow-md transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
          />
          {imgLoaded && (
            <div className="absolute top-4 left-4">
              <span className="bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">{product.category}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-gray-600 text-sm font-medium">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">In Stock ({product.stock})</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6 text-base">{product.description}</p>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold"
              >−</button>
              <span className="px-4 py-2 font-semibold text-gray-800 min-w-[40px] text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold"
              >+</button>
            </div>
            {inCart && (
              <span className="text-sm text-green-600 font-medium">✅ {cartItem?.quantity} in cart</span>
            )}
          </div>

          {/* CTAs */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {inCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>
            <Link
              to="/cart"
              className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              View Cart →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex gap-4 flex-wrap mt-6 pt-6 border-t border-gray-100">
            {[
              { icon: '🚀', text: 'Fast Delivery' },
              { icon: '🔄', text: 'Easy Returns' },
              { icon: '🔒', text: 'Secure Payment' },
              { icon: '💯', text: 'Authentic Products' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm text-gray-600">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
