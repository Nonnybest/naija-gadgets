'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase, naira } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [tab, setTab] = useState('orders'); // 'orders' | 'profile'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [authErr, setAuthErr] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    supabase
      .from('ng_orders')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setAuthErr(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthLoading(true);
    try {
      await signUp(email, password, fullName, phone);
    } catch (err) {
      setAuthErr(err.message || 'Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="wrap" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p className="muted">Loading your account...</p>
      </main>
    );
  }

  // Not logged in: Show Jumia-style Auth Card
  if (!user) {
    return (
      <main className="wrap" style={{ maxWidth: 480, margin: '40px auto' }}>
        <div className="card auth-box">
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthErr(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setAuthErr(''); }}
            >
              Create Account
            </button>
          </div>

          <h2 style={{ fontSize: '1.4rem', margin: '16px 0 6px' }}>
            {authMode === 'login' ? 'Welcome back to Naija Gadgets' : 'Join the Tech Marketplace'}
          </h2>
          <p className="muted" style={{ marginBottom: 16 }}>
            {authMode === 'login'
              ? 'Sign in to access your order history and saved delivery addresses.'
              : 'Create an account to track shipments, get exclusive 2026 tech deals and fast checkout.'}
          </p>

          {authErr && <p className="note" style={{ background: '#FF4D4F', color: '#fff' }}>{authErr}</p>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <label className="lbl">Email address</label>
              <input
                className="in"
                type="email"
                required
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="lbl">Password</label>
              <input
                className="in"
                type="password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn big" type="submit" disabled={authLoading} style={{ marginTop: 12 }}>
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <label className="lbl">Full Name</label>
              <input
                className="in"
                type="text"
                required
                placeholder="e.g. Chinonso Ajali"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label className="lbl">Phone Number</label>
              <input
                className="in"
                type="tel"
                placeholder="e.g. 08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label className="lbl">Email address</label>
              <input
                className="in"
                type="email"
                required
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="lbl">Create Password</label>
              <input
                className="in"
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn big" type="submit" disabled={authLoading} style={{ marginTop: 12 }}>
                {authLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link href="/shop" className="muted" style={{ textDecoration: 'underline' }}>
              ← Return to marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Logged-in Account Dashboard
  const nameDisplay = user.user_metadata?.full_name || user.email.split('@')[0];

  return (
    <main className="wrap account-wrap">
      <div className="account-header">
        <div>
          <h2>My Account</h2>
          <p className="muted">Welcome back, <strong>{nameDisplay}</strong> ({user.email})</p>
        </div>
        <button className="chip" onClick={signOut} style={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}>
          Sign Out
        </button>
      </div>

      <div className="account-grid">
        {/* Sidebar Nav */}
        <div className="account-nav card">
          <button
            className={`acc-nav-link ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            📦 My Orders ({orders.length})
          </button>
          <button
            className={`acc-nav-link ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}
          >
            👤 Profile & Addresses
          </button>
          <Link href="/shop" className="acc-nav-link">
            ⚡ Shop 2026 Gadgets
          </Link>
        </div>

        {/* Content Area */}
        <div className="account-content">
          {tab === 'orders' && (
            <div className="card">
              <h3>Order History</h3>
              {ordersLoading && <p className="muted">Fetching your recent orders...</p>}
              {!ordersLoading && orders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <p className="muted">You haven't placed any orders yet.</p>
                  <Link href="/shop" className="btn" style={{ marginTop: 12 }}>
                    Explore Smart Tech Catalog
                  </Link>
                </div>
              )}
              {orders.map((o) => (
                <div className="order-box line" key={o.id}>
                  <div className="order-row-top">
                    <div>
                      <strong>Order Ref: {o.reference}</strong>
                      <span className="order-status-pill">{o.status?.toUpperCase() || 'PAID'}</span>
                    </div>
                    <span className="order-total">{naira(o.total)}</span>
                  </div>
                  <p className="muted" style={{ margin: '4px 0' }}>
                    Placed on: {new Date(o.created_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                  </p>
                  <p className="muted" style={{ margin: '4px 0' }}>
                    Delivery: {o.zone} — {o.address}
                  </p>
                  <div className="order-items-list">
                    {(o.items || []).map((it, idx) => (
                      <span key={idx} className="order-item-badge">
                        {it.qty}× {it.name} ({naira(it.price)})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'profile' && (
            <div className="card">
              <h3>Customer Profile</h3>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="muted">Full Name</span>
                  <strong>{user.user_metadata?.full_name || 'Not provided'}</strong>
                </div>
                <div className="detail-row">
                  <span className="muted">Email</span>
                  <strong>{user.email}</strong>
                </div>
                <div className="detail-row">
                  <span className="muted">Phone</span>
                  <strong>{user.user_metadata?.phone || 'Not provided'}</strong>
                </div>
                <div className="detail-row">
                  <span className="muted">Account ID</span>
                  <code style={{ fontSize: '0.85rem' }}>{user.id}</code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
