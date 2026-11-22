'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { naira, ZONES } from '@/lib/supabase';

export default function Cart() {
  const { items, setQty, clear, subtotal } = useCart();
  const { user } = useAuth();
  const [f, setF] = useState({ name: '', email: '', phone: '', address: '', zone: 'Lagos' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setF((prev) => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.user_metadata?.phone || '',
      }));
    }
  }, [user]);

  const ship = ZONES[f.zone] ?? 4500;
  const total = subtotal + ship;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function pay() {
    if (!f.name || !f.email || !f.phone || (f.zone !== 'Pickup point' && !f.address)) {
      return setMsg('Please fill in your name, email, phone and delivery address.');
    }
    if (!f.email.includes('@')) {
      return setMsg('Please enter a valid email address.');
    }
    if (typeof window === 'undefined' || !window.PaystackPop) {
      return setMsg('Payment gateway is loading. Please check your internet connection and try again.');
    }

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      return setMsg('Paystack public key is not configured in environment variables.');
    }

    const ref = 'NG' + Date.now();
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: f.email,
      amount: total * 100,
      currency: 'NGN',
      ref,
      callback: (r) => {
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: r.reference,
            customer: { ...f, user_id: user?.id || null },
            items: items.map(({ id, qty }) => ({ id, qty })),
          }),
        })
          .then((x) => x.json())
          .then((d) => {
            setLoading(false);
            if (d.ok) {
              clear();
              setMsg(`🎉 Payment received! Order ${d.id.slice(0, 8).toUpperCase()} is confirmed. Check your account for real-time tracking.`);
            } else {
              setMsg(d.error || 'Payment not confirmed. Contact us with ref ' + r.reference);
            }
          })
          .catch(() => {
            setLoading(false);
            setMsg('Network error verifying order. Please contact us with reference: ' + r.reference);
          });
      },
      onClose: () => {
        setLoading(false);
        setMsg('Payment checkout was canceled.');
      },
    });

    handler.openIframe();
  }

  return (
    <main className="wrap" style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px' }}>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>🛒 Shopping Cart ({items.reduce((s, i) => s + i.qty, 0)} items)</h1>
        <Link href="/shop" className="muted" style={{ textDecoration: 'underline' }}>
          ← Continue Shopping
        </Link>
      </div>

      {msg && (
        <div className="note" style={{ marginBottom: 20, background: msg.includes('Payment received') ? '#1F9D55' : '#FFC21A', color: msg.includes('Payment received') ? '#fff' : '#0D1B2A' }}>
          {msg}
        </div>
      )}

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 8px 0' }}>Your cart is empty</h2>
          <p className="muted" style={{ maxWidth: 400, margin: '0 auto 20px auto' }}>
            Explore our curated catalog of 500+ advanced 2026 smart gadgets with nationwide delivery across Nigeria.
          </p>
          <Link href="/shop" className="btn" style={{ padding: '12px 24px', fontSize: 15 }}>
            ⚡ Browse 2026 Smart Tech Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          {/* Cart Items List */}
          <div className="card" style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #EAF0F4', paddingBottom: 12 }}>
              Selected Products ({items.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((i) => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f4f8', paddingBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0D1B2A' }}>{i.name}</div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>{naira(i.price)} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.85rem', color: '#5B6B7B' }}>Qty:</span>
                    <input
                      className="qty"
                      type="number"
                      min="1"
                      max={i.stock}
                      value={i.qty}
                      onChange={(e) => setQty(i.id, Math.min(Math.max(0, +e.target.value || 0), i.stock))}
                      style={{ width: 52, padding: '4px 6px', textAlign: 'center', borderRadius: 6, border: '1px solid #ccc' }}
                    />
                    <button
                      onClick={() => setQty(i.id, 0)}
                      style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}
                      title="Remove"
                    >
                      🗑
                    </button>
                  </div>
                  <div style={{ fontWeight: 700, color: '#0D1B2A', minWidth: 90, textAlign: 'right' }}>
                    {naira(i.price * i.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={clear}
                style={{ background: 'none', border: 'none', color: '#5B6B7B', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Clear all items
              </button>
              <div style={{ fontSize: '1rem', color: '#0D1B2A' }}>
                Items Subtotal: <strong>{naira(subtotal)}</strong>
              </div>
            </div>
          </div>

          {/* Checkout & Delivery Form */}
          <div className="card" style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #EAF0F4', paddingBottom: 12 }}>
              Delivery & Payment Details
            </h3>

            {!user && (
              <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: '0.85rem' }}>
                💡 <strong>Have an account?</strong> <Link href="/account" style={{ textDecoration: 'underline', color: '#0D1B2A', fontWeight: 600 }}>Sign in</Link> to auto-fill delivery details and earn buyer rewards.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6B7B' }}>Delivery State / Zone</label>
                <select className="in" value={f.zone} onChange={set('zone')} style={{ marginTop: 4 }}>
                  {Object.keys(ZONES).map((z) => (
                    <option key={z} value={z}>
                      {z} ({ZONES[z] === 0 ? 'Free' : naira(ZONES[z])})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6B7B' }}>Full Name *</label>
                <input className="in" placeholder="e.g. Chinonso Ajali" value={f.name} onChange={set('name')} style={{ marginTop: 4 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6B7B' }}>Email Address *</label>
                <input className="in" type="email" placeholder="e.g. john@example.com" value={f.email} onChange={set('email')} style={{ marginTop: 4 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6B7B' }}>Phone Number *</label>
                <input className="in" type="tel" placeholder="e.g. 08012345678" value={f.phone} onChange={set('phone')} style={{ marginTop: 4 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6B7B' }}>
                  {f.zone === 'Pickup point' ? 'Preferred Pickup Hub / City *' : 'Street Address / Landmarks *'}
                </label>
                <input
                  className="in"
                  placeholder={f.zone === 'Pickup point' ? 'e.g. Ikeja Hub, Lagos' : 'House number, Street, Area'}
                  value={f.address}
                  onChange={set('address')}
                  style={{ marginTop: 4 }}
                />
              </div>

              {/* Order Cost Summary */}
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Subtotal ({items.length} items)</span>
                  <span>{naira(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Delivery Fee ({f.zone})</span>
                  <span>{ship === 0 ? 'Free' : naira(ship)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 8, marginTop: 4, fontWeight: 800, fontSize: '1.1rem', color: '#0D1B2A' }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#1F9D55' }}>{naira(total)}</span>
                </div>
              </div>

              <button
                className="btn big"
                onClick={pay}
                disabled={loading}
                style={{ marginTop: 14, background: '#FFC21A', color: '#0D1B2A', fontWeight: 800, fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Opening Secure Paystack...' : `🔒 Pay ${naira(total)} with Paystack`}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#5B6B7B', marginTop: 8 }}>
                ✓ Debit/Credit Cards • Bank Transfer • USSD • 100% Secure Nigerian Gateway
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
