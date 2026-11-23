'use client';
import { useState } from 'react';
import Link from 'next/link';
import { naira } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import { productImages } from '@/lib/products-data';

export default function ProductCard({ p }) {
  const { add } = useCart() || {};
  const [added, setAdded] = useState(false);
  if (!p) return null;

  const imgs = productImages(p);
  const out = !p.stock || p.stock < 1;
  const handleAdd = () => {
    if (out) return;
    add && add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="jumia-card">
      <Link href={`/product/${p.id}`} className="card-img-wrapper" aria-label={`View ${p.name}`}>
        {imgs[0] ? (
          <img src={imgs[0]} alt={p.name} loading="lazy" decoding="async" className="product-img" />
        ) : (
          <div className="ph"><span>{p.category || 'Smart Tech'}</span></div>
        )}
        {imgs.length > 1 && <span className="img-count">{imgs.length} photos</span>}
      </Link>

      <div className="card-body">
        <div className="card-cat-tag">{p.category}</div>
        <h3 className="card-title" title={p.name}>
          <Link href={`/product/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="card-prices"><div className="price-current">{naira(p.price)}</div></div>
        <div className="card-stock">
          <div className="stock-text">
            {out ? <span style={{ color: '#E63946' }}>Out of stock</span>
              : p.stock <= 5 ? <span style={{ color: '#B7791F' }}>Only {p.stock} left</span>
              : <span style={{ color: '#1F9D55' }}>In stock</span>}
          </div>
        </div>
        <button className={`card-add-btn ${added ? 'added' : ''} ${out ? 'disabled' : ''}`} disabled={out} onClick={handleAdd}>
          {out ? 'Sold out' : added ? 'Added to cart' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
