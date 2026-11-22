'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const { items } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const cartCount = (items || []).reduce((sum, item) => sum + (item.qty || 1), 0);
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      {/* 1. Top Jumia-Style Announcement Strip */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <span>🚀 <strong>2026 Smart Tech Hub</strong>: Single-Board Computers, Biometrics, Drones & IoT</span>
          <div className="announcement-links">
            <span>🚚 Nationwide Delivery Across 36 States</span>
            <span>📞 WhatsApp Support: +234 800 GADGETS</span>
            <Link href="/admin/agents" className="top-ai-link">
              🤖 AI Staff
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Marketplace Navigation Header */}
      <header className="marketplace-header">
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="market-logo">
            <span className="logo-main">Naija Gadgets</span>
            <span className="logo-sub">2026 SMART MARKETPLACE</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="header-search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search 500+ Smart Locks, Raspberry Pi 5, Flipper, Drones..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="header-search-input"
              />
            </div>
            <button type="submit" className="header-search-btn">
              SEARCH
            </button>
          </form>

          {/* Action Buttons: Account, Shop, Cart */}
          <div className="header-actions">
            {/* Account Link */}
            <Link href="/account" className="header-action-btn">
              <span className="action-icon">👤</span>
              <div className="action-text">
                <span className="action-label">{user ? 'Welcome,' : 'Sign In /'}</span>
                <span className="action-val">{user ? userName : 'Account'}</span>
              </div>
            </Link>

            {/* Shop Link */}
            <Link href="/shop" className="header-action-btn hide-mobile">
              <span className="action-icon">⚡</span>
              <div className="action-text">
                <span className="action-label">All Items</span>
                <span className="action-val">500+ Gadgets</span>
              </div>
            </Link>

            {/* Cart Link with Badge */}
            <Link href="/cart" className="header-action-btn cart-btn">
              <div className="cart-icon-wrapper">
                <span className="action-icon">🛒</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <div className="action-text hide-mobile">
                <span className="action-label">My Cart</span>
                <span className="action-val">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Sub-Header Category Navigation */}
      <nav className="marketplace-subnav">
        <div className="subnav-inner">
          <Link href="/shop" className="subnav-pill hot-deal">
            🔥 Flash Sales
          </Link>
          <Link href="/shop" className="subnav-pill">
            🧠 Raspberry Pi 5 & AI
          </Link>
          <Link href="/shop" className="subnav-pill">
            🔒 Smart Locks
          </Link>
          <Link href="/shop" className="subnav-pill">
            🌐 IoT Mesh Hubs
          </Link>
          <Link href="/shop" className="subnav-pill">
            🛸 Autonomous Drones
          </Link>
          <Link href="/shop" className="subnav-pill">
            ⚡ Flipper & SDR
          </Link>
          <Link href="/shop" className="subnav-pill">
            💍 Smart Health Rings
          </Link>
          <Link href="/shop" className="subnav-pill">
            ☀️ Solar PTZ Security
          </Link>
        </div>
      </nav>
    </>
  );
}
