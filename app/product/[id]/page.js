'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, naira } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { productImages } from '@/lib/products-data';

export default function ProductPage() {
  const { id } = useParams();
  const { add } = useCart() || {};
  const [p, setP] = useState(null);
  const [state, setState] = useState('loading');
  const [idx, setIdx] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase.from('ng_products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) { setP(data); setState('ok'); } else setState('missing');
    });
  }, [id]);

  if (state === 'loading') return <main className="wrap pdp"><p className="muted">Loading…</p></main>;
  if (state === 'missing') return (
    <main className="wrap pdp"><h2>Product not found</h2><p><Link href="/shop" className="quiet-link">Back to the shop</Link></p></main>
  );

  const imgs = productImages(p);
  const out = !p.stock || p.stock < 1;
  const go = (n) => setIdx((i) => (i + n + imgs.length) % imgs.length);

  return (
    <main className="wrap pdp">
      <p className="pdp-crumbs"><Link href="/shop">Shop</Link> / <Link href={`/shop?cat=${encodeURIComponent(p.category)}`}>{p.category}</Link></p>
      <div className="pdp-grid">
        <div className="pdp-gallery">
          <div className="pdp-stage">
            {imgs.length ? <img key={imgs[idx]} src={imgs[idx]} alt={`${p.name}, photo ${idx + 1}`} className="pdp-img" /> : <div className="ph"><span>No photo yet</span></div>}
            {imgs.length > 1 && (<>
              <button className="pdp-arrow left" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
              <button className="pdp-arrow right" onClick={() => go(1)} aria-label="Next photo">›</button>
            </>)}
          </div>
          {imgs.length > 1 && (
            <div className="pdp-thumbs">
              {imgs.map((src, i) => (
                <button key={src} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} aria-label={`Show photo ${i + 1}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <div className="card-cat-tag">{p.category}</div>
          <h1>{p.name}</h1>
          <div className="pdp-price">{naira(p.price)}</div>
          <p className="pdp-stock" style={{ color: out ? '#E63946' : p.stock <= 5 ? '#B7791F' : '#1F9D55' }}>
            {out ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'}
          </p>
          {p.description && <p className="pdp-desc">{p.description}</p>}
          <button className="btn big" disabled={out} onClick={() => { add && add(p); setAdded(true); }} style={{ background: '#FFC21A', color: '#0D1B2A', fontWeight: 800 }}>
            {out ? 'Sold out' : added ? 'Added. Add another' : 'Add to cart'}
          </button>
          {added && <p><Link href="/cart" className="quiet-link">Go to cart and pay</Link></p>}
          <ul className="pdp-points">
            <li>Delivery across Nigeria, or pick up at our point</li>
            <li>Pay securely by card, bank transfer or USSD</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
