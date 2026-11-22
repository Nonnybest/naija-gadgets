'use client';
import { useEffect, useState } from 'react';
import { naira } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import ProductArtwork, { hasProductArtwork } from '@/components/ProductArtwork';

export default function ProductCard({ p }) {
  const { add } = useCart() || {};
  const [added, setAdded] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    if (!imageOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setImageOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [imageOpen]);

  if (!p) return null;

  // Compute realistic original MSRP discount tag (e.g. 20-35% higher)
  const discountPercent = ((p.id ? p.id.charCodeAt(0) % 15 : 12) + 15);
  const originalPrice = Math.round(p.price * (1 + discountPercent / 100));
  const ratingStars = ((p.id ? (p.id.charCodeAt(1) % 5) : 3) + 45) / 10; // e.g. 4.7 to 4.9
  const reviewCount = (p.id ? (p.id.charCodeAt(2) % 80) : 34) + 18;

  const handleAdd = () => {
    if (!p.stock || p.stock < 1) return;
    if (add) add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = !p.stock || p.stock < 1;

  const hasArtwork = hasProductArtwork(p);

  return (
    <>
    <article className="jumia-card">
      {/* Discount badge & Official Store pill */}
      <div className="card-top-badges">
        <span className="badge-discount">-{discountPercent}%</span>
        {p.featured && <span className="badge-official">2026 FLAGSHIP</span>}
      </div>

      {/* Product Image */}
      <div className="card-img-wrapper">
        <button
          className="product-image-trigger"
          type="button"
          onClick={() => setImageOpen(true)}
          aria-label={`View image of ${p.name} larger`}
        >
          {hasArtwork ? <ProductArtwork product={p} /> : p.image_url ? (
            <img src={p.image_url} alt={p.name || 'Smart gadget'} loading="lazy" decoding="async" className="product-img" />
          ) : (
            <div className="ph"><span>📶 {p.category || 'Smart Tech'}</span></div>
          )}
          <span className="image-zoom-hint"><span>⌕</span> View image</span>
        </button>
      </div>

      {/* Card Info */}
      <div className="card-body">
        <div className="card-cat-tag">{p.category}</div>
        <h3 className="card-title" title={p.name}>
          {p.name}
        </h3>

        {/* Rating */}
        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-score">{ratingStars.toFixed(1)}</span>
          <span className="rating-count">({reviewCount})</span>
        </div>

        {/* Pricing */}
        <div className="card-prices">
          <div className="price-current">{naira(p.price)}</div>
          <div className="price-original">{naira(originalPrice)}</div>
        </div>

        {/* Stock progress */}
        <div className="card-stock">
          <div className="stock-text">
            {isOutOfStock ? (
              <span style={{ color: '#E63946' }}>● Out of Stock</span>
            ) : p.stock <= 5 ? (
              <span style={{ color: '#FF9800' }}>⚠️ Only {p.stock} units left!</span>
            ) : (
              <span style={{ color: '#1F9D55' }}>✓ In Stock ({p.stock} units)</span>
            )}
          </div>
          {!isOutOfStock && (
            <div className="stock-bar-bg">
              <div
                className="stock-bar-fill"
                style={{ width: `${Math.min(100, Math.max(15, (p.stock / 40) * 100))}%` }}
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className={`card-add-btn ${added ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
          disabled={isOutOfStock}
          onClick={handleAdd}
        >
          {isOutOfStock
            ? 'Sold Out'
            : added
            ? '✓ Added to Cart!'
            : '🛒 Add to Cart'}
        </button>
      </div>
    </article>
    {imageOpen && (
      <div className="image-viewer-backdrop" onClick={() => setImageOpen(false)}>
        <div className="image-viewer" role="dialog" aria-modal="true" aria-label={`Product image: ${p.name}`} onClick={(event) => event.stopPropagation()}>
          <button className="image-viewer-close" type="button" onClick={() => setImageOpen(false)} aria-label="Close image viewer">×</button>
          <div className="image-viewer-photo">
            {hasArtwork ? <ProductArtwork product={p} /> : p.image_url ? (
              <img src={p.image_url} alt={p.name || 'Smart gadget'} loading="eager" decoding="async" />
            ) : <div className="ph"><span>📶 {p.category || 'Smart Tech'}</span></div>}
          </div>
          <div className="image-viewer-caption"><span>PRODUCT IMAGE</span><h2>{p.name}</h2><p>Click outside the image or press Esc to close.</p></div>
        </div>
      </div>
    )}
    </>
  );
}
