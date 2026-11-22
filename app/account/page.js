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
      <main className="account-loading">
        <span className="account-loading-mark" />
        <p>Opening your account…</p>
      </main>
    );
  }

  // Sign in and registration live in the same calm, spacious account entry point.
  if (!user) {
    return (
      <main className="account-auth-page">
        <section className="auth-story">
          <div className="auth-story-photo"><img src="/products/dji-smart-drone.jpg" alt="Camera drone ready for its next flight" /></div>
          <div className="auth-story-shade" />
          <div className="auth-story-content">
            <Link href="/" className="auth-story-brand">NAIJA GADGETS <span> / MEMBERS</span></Link>
            <div className="auth-story-message">
              <span className="section-kicker">A BETTER WAY TO KEEP IT ALL TOGETHER</span>
              <h1>Your next good<br />idea starts here<span>.</span></h1>
              <p>Keep your orders close, save time at checkout, and get back to discovering what’s next.</p>
            </div>
            <div className="auth-story-foot"><span>01 / MEMBER ACCESS</span><span>TECH FOR WHAT’S NEXT</span></div>
          </div>
        </section>

        <section className="auth-form-side">
          <div className="auth-form-top"><span>{authMode === 'login' ? 'WELCOME BACK' : 'JOIN THE COMMUNITY'}</span><Link href="/shop">Continue shopping <b>↗</b></Link></div>
          <div className="auth-form-wrap">
            <div className="auth-tabs" role="tablist" aria-label="Account access">
              <button type="button" role="tab" aria-selected={authMode === 'login'} className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`} onClick={() => { setAuthMode('login'); setAuthErr(''); }}>Sign in</button>
              <button type="button" role="tab" aria-selected={authMode === 'register'} className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`} onClick={() => { setAuthMode('register'); setAuthErr(''); }}>Create account</button>
            </div>

            <span className="auth-form-kicker">{authMode === 'login' ? 'YOUR ACCOUNT, RIGHT THIS WAY' : 'A LITTLE MORE ROOM TO EXPLORE'}</span>
            <h2>{authMode === 'login' ? 'Good to see you again.' : 'Make yourself at home.'}</h2>
            <p className="auth-form-intro">
              {authMode === 'login'
                ? 'Sign in to see your orders, delivery details, and saved account information.'
                : 'Create an account to keep track of your orders and make checkout simpler.'}
            </p>

            {authErr && <p className="auth-error" role="alert">{authErr}</p>}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form">
                <label className="lbl" htmlFor="account-email">Email address</label>
                <input id="account-email" className="in" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="lbl" htmlFor="account-password">Password</label>
                <input id="account-password" className="in" type="password" autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Signing you in…' : 'Sign in'} <span>→</span></button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <label className="lbl" htmlFor="account-name">Full name</label>
                <input id="account-name" className="in" type="text" autoComplete="name" required placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <label className="lbl" htmlFor="account-phone">Phone number <span>(optional)</span></label>
                <input id="account-phone" className="in" type="tel" autoComplete="tel" placeholder="080 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <label className="lbl" htmlFor="account-register-email">Email address</label>
                <input id="account-register-email" className="in" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="lbl" htmlFor="account-register-password">Create a password</label>
                <input id="account-register-password" className="in" type="password" autoComplete="new-password" required minLength={6} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Creating your account…' : 'Create account'} <span>→</span></button>
              </form>
            )}

            <div className="auth-form-foot"><span>Secure sign-in</span><span>•</span><span>Your account stays yours</span></div>
          </div>
          <div className="auth-form-bottom"><Link href="/">← Back to Naija Gadgets</Link><span>Need help? <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">Talk to us ↗</a></span></div>
        </section>
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
