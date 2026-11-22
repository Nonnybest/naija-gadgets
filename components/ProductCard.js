'use client';
import { naira } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

export default function ProductCard({ p }) {
  const { add } = useCart() || {};
  if (!p) return null;

  return (
    <article className="card">
      {p.image_url ? (
        <img src={p.image_url} alt={p.name || 'Product'} loading="lazy" />
      ) : (
        <div className="ph">{p.category || 'Accessory'}</div>
      )}
      <h3>{p.name}</h3>
      <p className="muted">{p.description}</p>
      <div className="row">
        <strong>{naira(p.price)}</strong>
        <button
          className="btn"
          disabled={!p.stock || p.stock < 1}
          onClick={() => add && add(p)}
        >
          {!p.stock || p.stock < 1 ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
