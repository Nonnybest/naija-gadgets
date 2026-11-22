'use client';
import { useState } from 'react';
import Script from 'next/script';
import { useCart } from '@/lib/cart';
import { naira, ZONES } from '@/lib/supabase';

export default function Cart() {
  const { items, setQty, clear, subtotal } = useCart();
  const [f, setF] = useState({ name: '', email: '', phone: '', address: '', zone: 'Lagos' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const ship = ZONES[f.zone] ?? 4500;
  const total = subtotal + ship;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function pay() {
    if (!f.name || !f.email || !f.phone || (f.zone !== 'Pickup point' && !f.address)) {
      return setMsg('Fill in your name, email, phone and address.');
    }
    if (!f.email.includes('@')) {
      return setMsg('Please enter a valid email address.');
    }
    if (typeof window === 'undefined' || !window.PaystackPop) {
      return setMsg('Payment gateway is still loading. Please check your connection and try again.');
    }

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      return setMsg('Paystack public key is not configured.');
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
            customer: f,
            items: items.map(({ id, qty }) => ({ id, qty })),
          }),
        })
          .then((x) => x.json())
          .then((d) => {
            setLoading(false);
            if (d.ok) {
              clear();
              setMsg('Payment received. Order ' + d.id.slice(0, 8) + ' is confirmed.');
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
        setMsg('Payment window closed.');
      },
    });

    handler.openIframe();
  }

  return (
    <main className="wrap">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <h2>Your cart</h2>
      {msg && <p className="note">{msg}</p>}
      {!items.length && <p className="muted">Your cart is empty.</p>}
      {items.map((i) => (
        <div className="row line" key={i.id}>
          <span>{i.name}</span>
          <input
            className="qty"
            type="number"
            min="1"
            max={i.stock}
            value={i.qty}
            onChange={(e) => setQty(i.id, Math.min(Math.max(1, +e.target.value || 1), i.stock))}
          />
          <strong>{naira(i.price * i.qty)}</strong>
        </div>
      ))}
      {!!items.length && (
        <>
          <h3>Delivery</h3>
          <select className="in" value={f.zone} onChange={set('zone')}>
            {Object.keys(ZONES).map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <input className="in" placeholder="Full name" value={f.name} onChange={set('name')} />
          <input className="in" type="email" placeholder="Email" value={f.email} onChange={set('email')} />
          <input className="in" type="tel" placeholder="Phone number" value={f.phone} onChange={set('phone')} />
          <input className="in" placeholder="Delivery address or pickup city" value={f.address} onChange={set('address')} />
          <p>
            Items {naira(subtotal)} · Delivery {naira(ship)}
          </p>
          <h3>Total {naira(total)}</h3>
          <button className="btn big" onClick={pay} disabled={loading}>
            {loading ? 'Processing...' : `Pay ${naira(total)}`}
          </button>
        </>
      )}
    </main>
  );
}
