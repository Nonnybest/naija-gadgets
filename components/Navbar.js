'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

const MENU_CATEGORIES = [
  ['Raspberry Pi & Single Board Computers', 'Boards & edge AI'],
  ['Smart Locks & Biometric Access', 'Smart locks'],
  ['Smart Home & Matter Hubs', 'Smart home'],
  ['Drones, Gimbal & Robotics', 'Drones & robotics'],
  ['Hacking, SDR & Radio Tools', 'Security tools'],
  ['Wearables, AR & Smart Rings', 'Wearables'],
  ['Smart Security & Surveillance', 'Cameras & security'],
  ['Sensors, Lab & Workshop Gadgets', 'Sensors & workshop'],
];

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const { items } = useCart();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = (items || []).reduce((sum, item) => sum + (item.qty || 1), 0);
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0];

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('menu-is-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('menu-is-open');
    };
  }, [menuOpen]);

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
      {/* A small service note keeps the header calm and useful. */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <span>Thoughtful tech, delivered across Nigeria</span>
          <span>Need a hand? <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">Chat with us ↗</a></span>
        </div>
      </div>

      {/* 2. Main Marketplace Navigation Header */}
      <header className="marketplace-header">
        <div className="header-inner">
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          {/* Logo */}
          <Link href="/" className="market-logo">
            <span className="logo-main">Naija Gadgets</span>
            <span className="logo-sub">TECH FOR WHAT’S NEXT</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="header-search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="header-search-input"
              />
            </div>
            <button type="submit" className="header-search-btn">
              <span>Search</span><span aria-hidden="true">↗</span>
            </button>
          </form>

          {/* Action Buttons: Account, Shop, Cart */}
          <div className="header-actions">
            {/* Account Link */}
            <Link href="/account" className="header-action-btn">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20c.7-3.7 3.4-5.6 7.5-5.6s6.8 1.9 7.5 5.6" />
              </svg>
              <div className="action-text">
                <span className="action-label">{user ? 'Welcome,' : 'Sign In /'}</span>
                <span className="action-val">{user ? userName : 'Account'}</span>
              </div>
            </Link>

            {/* Cart Link with Badge */}
            <Link href="/cart" className="header-action-btn cart-btn">
              <div className="cart-icon-wrapper">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 4h2l2.3 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                  <circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
                </svg>
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

      {/* Simple primary navigation */}
      <nav className="marketplace-subnav">
        <div className="subnav-inner">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop all</Link>
          <a href="/#featured">Staff picks</a>
          <Link href="/account">Orders & account</Link>
        </div>
      </nav>

      {menuOpen && (
        <div className="drawer-layer">
          <button className="drawer-scrim" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <aside id="site-menu-drawer" className="site-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <div className="drawer-heading">
              <div><span className="drawer-kicker">NAIJA GADGETS</span><h2 id="drawer-title">Explore</h2></div>
              <button className="drawer-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
            </div>

            <Link href="/shop" className="drawer-all-link" onClick={() => setMenuOpen(false)}>Shop all gadgets <span>↗</span></Link>
            <div className="drawer-section-label">SHOP BY CATEGORY</div>
            <nav className="drawer-categories" aria-label="Shop categories">
              {MENU_CATEGORIES.map(([category, label], index) => (
                <Link key={category} href={`/shop?cat=${encodeURIComponent(category)}`} onClick={() => setMenuOpen(false)}>
                  <span className="drawer-category-index">0{index + 1}</span><span>{label}</span><span className="drawer-chevron">↗</span>
                </Link>
              ))}
            </nav>

            <div className="drawer-bottom-links">
              <Link href="/account" onClick={() => setMenuOpen(false)}>
                <span className="drawer-account-icon">◉</span><span><strong>{user ? `Welcome, ${userName}` : 'Sign in or create an account'}</strong><small>{user ? 'View orders and profile' : 'Manage orders and checkout faster'}</small></span><span>→</span>
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)}>
                <span className="drawer-account-icon">▱</span><span><strong>Your cart</strong><small>{cartCount} {cartCount === 1 ? 'item' : 'items'}</small></span><span>→</span>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
