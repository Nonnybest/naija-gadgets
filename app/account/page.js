'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase, naira } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword, updatePassword } = useAuth();
  const [tab, setTab] = useState('orders'); // 'orders' | 'profile'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [authErr, setAuthErr] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'reset') {
        setAuthMode('reset');
      }
    }
  }, []);

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
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      await signUp(email, password, fullName, phone);
    } catch (err) {
      setAuthErr(err.message || 'Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthErr('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthErr(err.message || 'Google sign-in failed. Please verify provider settings.');
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      await resetPassword(email);
      setAuthSuccess('Password recovery email sent! Check your inbox for the reset link.');
    } catch (err) {
      setAuthErr(err.message || 'Could not send reset email. Please verify your email address.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      await updatePassword(newPassword);
      setAuthSuccess('Password updated successfully! Redirecting you to sign in...');
      setTimeout(() => {
        setAuthMode('login');
      }, 2000);
    } catch (err) {
      setAuthErr(err.message || 'Failed to update password.');
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
          <div className="auth-form-top"><span>{authMode === 'login' ? 'WELCOME BACK' : authMode === 'register' ? 'JOIN THE COMMUNITY' : 'PASSWORD RECOVERY'}</span><Link href="/shop">Continue shopping <b>↗</b></Link></div>
          <div className="auth-form-wrap">
            {authMode !== 'forgot' && authMode !== 'reset' && (
              <div className="auth-tabs" role="tablist" aria-label="Account access">
                <button type="button" role="tab" aria-selected={authMode === 'login'} className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`} onClick={() => { setAuthMode('login'); setAuthErr(''); setAuthSuccess(''); }}>Sign in</button>
                <button type="button" role="tab" aria-selected={authMode === 'register'} className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`} onClick={() => { setAuthMode('register'); setAuthErr(''); setAuthSuccess(''); }}>Create account</button>
              </div>
            )}

            <span className="auth-form-kicker">
              {authMode === 'login' && 'YOUR ACCOUNT, RIGHT THIS WAY'}
              {authMode === 'register' && 'A LITTLE MORE ROOM TO EXPLORE'}
              {authMode === 'forgot' && 'ACCOUNT RECOVERY'}
              {authMode === 'reset' && 'SET NEW PASSWORD'}
            </span>
            <h2>
              {authMode === 'login' && 'Good to see you again.'}
              {authMode === 'register' && 'Make yourself at home.'}
              {authMode === 'forgot' && 'Reset your password.'}
              {authMode === 'reset' && 'Create a new password.'}
            </h2>
            <p className="auth-form-intro">
              {authMode === 'login' && 'Sign in to see your orders, delivery details, and saved account information.'}
              {authMode === 'register' && 'Create an account to keep track of your orders and make checkout simpler.'}
              {authMode === 'forgot' && 'Enter your email address and we will send you a secure password reset link.'}
              {authMode === 'reset' && 'Please choose a strong password with at least 6 characters.'}
            </p>

            {authErr && <p className="auth-error" role="alert">{authErr}</p>}
            {authSuccess && <p className="note" style={{ background: 'rgba(31,157,85,0.15)', border: '1px solid #1F9D55', color: '#1F9D55', padding: '12px', borderRadius: '8px', marginBottom: '16px' }} role="status">{authSuccess}</p>}

            {(authMode === 'login' || authMode === 'register') && (
              <>
                <button
                  type="button"
                  className="google-auth-btn"
                  onClick={handleGoogleSignIn}
                  disabled={process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== 'true'}
                  disabled={authLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #243B53',
                    background: '#0D1B2A',
                    color: '#EAF0F4',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '16px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google{process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== 'true' ? ' (coming soon)' : ''}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '8px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#243B53' }} />
                  <span style={{ fontSize: '11px', color: '#8899A6', textTransform: 'uppercase' }}>or with email</span>
                  <div style={{ flex: 1, height: '1px', background: '#243B53' }} />
                </div>
              </>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="auth-form">
                <label className="lbl" htmlFor="account-email">Email address</label>
                <input id="account-email" className="in" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="lbl" htmlFor="account-password" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthErr(''); setAuthSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#FFC21A', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input id="account-password" className="in" type="password" autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Signing you in…' : 'Sign in'} <span>→</span></button>
              </form>
            )}

            {authMode === 'register' && (
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

            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="auth-form">
                <label className="lbl" htmlFor="forgot-email">Account email address</label>
                <input id="forgot-email" className="in" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Sending link…' : 'Send reset link'} <span>→</span></button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthErr(''); setAuthSuccess(''); }}
                  style={{ background: 'none', border: 'none', color: '#8899A6', fontSize: '13px', cursor: 'pointer', marginTop: '12px', textAlign: 'center' }}
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {authMode === 'reset' && (
              <form onSubmit={handleUpdatePassword} className="auth-form">
                <label className="lbl" htmlFor="reset-new-password">New password</label>
                <input id="reset-new-password" className="in" type="password" required minLength={6} placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Updating password…' : 'Save new password'} <span>→</span></button>
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
