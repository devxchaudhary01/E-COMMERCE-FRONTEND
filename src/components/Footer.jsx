import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
            </div>
            <span className="text-white text-xl font-bold">Shop<span className="text-orange-500">Ease</span></span>
          </div>
          <p className="text-sm leading-relaxed">Your one-stop shop for premium products at unbeatable prices. Fast delivery, easy returns.</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
            <li><Link to="/cart" className="hover:text-orange-400 transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📧 support@shopease.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 New Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} ShopEase. Built with MERN Stack.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
