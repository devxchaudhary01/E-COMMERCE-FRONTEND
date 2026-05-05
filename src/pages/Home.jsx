import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../utils/api';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <div className="skeleton h-52 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="flex justify-between items-center mt-2">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories()
      .then((r) => setCategories(['All', ...r.data]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (activeCategory !== 'All') params.category = activeCategory;
    if (sort) params.sort = sort;

    fetchProducts(params)
      .then((r) => {
        setProducts(r.data.products);
        setTotalPages(r.data.pages);
      })
      .catch(() => setError('Failed to load products. Is the server running?'))
      .finally(() => setLoading(false));
  }, [search, activeCategory, sort, page]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero Banner */}
      {!search && (
        <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 rounded-3xl overflow-hidden mb-10 p-8 md:p-14">
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-2">🎉 Welcome to ShopEase</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Discover Premium<br />Products at Best Prices
            </h1>
            <p className="text-orange-100 text-base md:text-lg max-w-lg mb-6">
              Shop the latest electronics, fashion, fitness gear and more. Free shipping on orders above ₹999.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                className="bg-white text-orange-600 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Shop Now →
              </button>
              <span className="text-orange-100 text-sm">✅ Free Returns &nbsp;|&nbsp; 🚀 Fast Delivery</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-5 rounded-full" />
          <div className="absolute -right-5 -bottom-16 w-48 h-48 bg-white opacity-5 rounded-full" />
        </section>
      )}

      {/* Search result heading */}
      {search && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Results for "<span className="text-orange-500">{search}</span>"
          </h2>
        </div>
      )}

      {/* Category Filter + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 bg-white text-gray-700"
        >
          <option value="">Sort: Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-red-400 text-sm mt-1">Make sure the backend server is running on port 5000</p>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 fade-in">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    p === page ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Home;
