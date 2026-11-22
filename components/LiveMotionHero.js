'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

const floatingGadgets = [
  {
    id: 1,
    name: 'Raspberry Pi 5 AI Kit',
    badge: '26 TOPS NPU • Wi-Fi 6E',
    tag: '📶 Edge Compute',
    price: '₦145,000',
    img: '/products/raspberry-pi-5-ai.jpg',
    delay: 0,
    duration: 6,
    x: -12,
    y: 18,
  },
  {
    id: 2,
    name: '3D Biometric Smart Lock',
    badge: 'Face ID • Bluetooth BLE',
    tag: '🔒 Proximity Access',
    price: '₦185,000',
    img: '/products/smart-biometric-lock.jpg',
    delay: 1.5,
    duration: 7,
    x: 14,
    y: -16,
  },
  {
    id: 3,
    name: 'Flipper Zero Multi-Tool',
    badge: 'Sub-GHz • RFID • NFC',
    tag: '⚡ Hardware Pentest',
    price: '₦210,000',
    img: '/products/flipper-zero.jpg',
    delay: 0.8,
    duration: 6.5,
    x: 8,
    y: 22,
  },
  {
    id: 4,
    name: 'DJI 4K LiDAR Smart Drone',
    badge: 'Wi-Fi 6 • 20km O4 Link',
    tag: '🛸 360° Radar Avoidance',
    price: '₦520,000',
    img: '/products/dji-smart-drone.jpg',
    delay: 2.2,
    duration: 8,
    x: -16,
    y: -20,
  },
];

export default function LiveMotionHero() {
  const { user, signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      if (authMode === 'register') {
        await signUp(email, password, fullName, phone);
        setMsg('Account created successfully! Welcome to Naija Gadgets.');
      } else {
        await signIn(email, password);
        setMsg('Signed in successfully!');
      }
    } catch (err) {
      setMsg(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="live-hero">
      {/* Dynamic Ambient Background Canvas */}
      <div className="ambient-backdrop">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-mesh" />
        <div className="scanline" />
      </div>

      <div className="hero-container">
        {/* Left Side: Cinematic Copy & Value Proposition */}
        <div className="hero-intro">
          <div className="tech-badge">
            <span className="live-dot" /> 2026 FLAGSHIP SMART TECH • 500+ INVENTORY
          </div>
          <h1 className="hero-title">
            The Marketplace for <span className="highlight-text">Mad, Extreme Gadgets.</span>
          </h1>
          <p className="hero-sub">
            Zero ordinary phones. Zero common laptops. Only advanced 2026-generation hardware with
            Bluetooth LE, Wi-Fi 7, Matter, Sub-GHz radio, and edge AI compute.
          </p>

          <div className="hero-metrics">
            <div className="metric-box">
              <strong>500+</strong>
              <span>Distinct Devices</span>
            </div>
            <div className="metric-box">
              <strong>100%</strong>
              <span>IoT & Wireless</span>
            </div>
            <div className="metric-box">
              <strong>All 36</strong>
              <span>States Delivered</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <Link href="/shop" className="btn btn-hero">
              ⚡ Explore 500 Smart Gadgets
            </Link>
            <a href="#flash-sales" className="btn btn-secondary">
              🔥 View Flash Sales
            </a>
          </div>
        </div>

        {/* Center: Live Motion Floating Gadgets */}
        <div className="floating-showcase">
          {floatingGadgets.map((g) => (
            <motion.div
              key={g.id}
              className={`float-card float-card-${g.id}`}
              animate={{
                y: [0, g.y, 0],
                x: [0, g.x, 0],
                rotate: [0, g.id % 2 === 0 ? 2 : -2, 0],
              }}
              transition={{
                duration: g.duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: g.delay,
              }}
            >
              <div className="float-img-box">
                <img src={g.img} alt={g.name} />
                <span className="float-tag">{g.tag}</span>
              </div>
              <div className="float-meta">
                <h4>{g.name}</h4>
                <p className="float-badge">{g.badge}</p>
                <div className="float-bottom">
                  <span className="float-price">{g.price}</span>
                  <Link href="/shop" className="float-btn">
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Account Section (First page login/registration) */}
        <div className="hero-auth-portal">
          <div className="portal-card">
            {user ? (
              <div className="user-welcome-box">
                <div className="welcome-avatar">
                  {user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <h3>Welcome back,</h3>
                <h2 className="user-name">{user.user_metadata?.full_name || user.email.split('@')[0]}</h2>
                <p className="user-email">{user.email}</p>
                <div className="user-actions">
                  <Link href="/account" className="btn big" style={{ marginBottom: 10 }}>
                    📦 My Account & Orders
                  </Link>
                  <Link href="/shop" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    ⚡ Shop New Arrivals
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="portal-tabs">
                  <button
                    className={`portal-tab ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('register'); setMsg(''); }}
                  >
                    Create Account
                  </button>
                  <button
                    className={`portal-tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('login'); setMsg(''); }}
                  >
                    Sign In
                  </button>
                </div>

                <div className="portal-header">
                  <h3>{authMode === 'register' ? 'Join 2026 Tech Hub' : 'Member Sign In'}</h3>
                  <p className="muted">
                    {authMode === 'register'
                      ? 'Instant access to 500+ gadgets, order tracking & flash discounts.'
                      : 'Sign in to access your saved cart, orders & addresses.'}
                  </p>
                </div>

                {msg && (
                  <p className="note" style={{ background: msg.includes('success') ? '#1F9D55' : '#FF4D4F', color: '#fff', fontSize: '0.85rem' }}>
                    {msg}
                  </p>
                )}

                <form onSubmit={handleAuth} className="portal-form">
                  {authMode === 'register' && (
                    <>
                      <input
                        className="in"
                        type="text"
                        placeholder="Full Name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <input
                        className="in"
                        type="tel"
                        placeholder="Phone Number (e.g. 08012345678)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </>
                  )}
                  <input
                    className="in"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="in"
                    type="password"
                    placeholder="Password (min 6 characters)"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="btn big" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                    {loading
                      ? 'Processing...'
                      : authMode === 'register'
                      ? 'Create Free Account'
                      : 'Sign In to Marketplace'}
                  </button>
                </form>

                <p className="portal-foot-note">
                  🔒 Encrypted Supabase Auth • Secure Paystack Checkout
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Video-like Tech Ticker */}
      <div className="hero-ticker">
        <div className="ticker-label">NOW TRENDING IN NIGERIA:</div>
        <div className="ticker-track">
          <span>⚡ Raspberry Pi 5 AI Kit (26 TOPS) In Stock</span>
          <span>🔒 3D Biometric Face-ID Deadbolts</span>
          <span>📡 Flipper Zero Cyber Multi-Tools</span>
          <span>🕶️ AR HUD Smart Glasses with Spatial BLE</span>
          <span>🛸 DJI Mini 4 Pro 20km O4 Smart Drones</span>
          <span>🌐 Matter & Thread Wireless Smart Mesh Hubs</span>
          <span>💍 Titanium Biometric Smart Health Rings</span>
        </div>
      </div>
    </section>
  );
}
