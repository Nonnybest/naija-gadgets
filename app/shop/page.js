'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { INITIAL_PRODUCTS } from '@/lib/products-data';

const CATEGORIES = [
  'All',
  'Raspberry Pi & Single Board Computers',
  'Smart Locks & Biometric Access',
  'Smart Home & Matter Hubs',
  'Drones, Gimbal & Robotics',
  'Hacking, SDR & Radio Tools',
  'Wearables, AR & Smart Rings',
  'Smart Security & Surveillance',
  'Sensors, Lab & Workshop Gadgets',
];

const ITEMS_PER_PAGE = 36;

export default function Shop() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    const query = params.get('q');
    if (category && CATEGORIES.includes(category)) setSelectedCat(category);
    if (query) setSearchQuery(query);

    supabase
      .from('ng_products')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(600)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setAllProducts(data);
        } else {
          setAllProducts(INITIAL_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setAllProducts(INITIAL_PRODUCTS);
        setLoading(false);
      });
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let res = allProducts.filter((p) => {
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const matchQuery =
        !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (sortBy === 'price-low') {
      res.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      res.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      res.sort((a, b) => b.stock - a.stock);
    } else if (sortBy === 'featured') {
      res.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return res;
  }, [allProducts, selectedCat, searchQuery, sortBy]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || loading || visibleCount >= filteredProducts.length) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((current) => Math.min(current + ITEMS_PER_PAGE, filteredProducts.length));
      }
    }, { rootMargin: '500px 0px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredProducts.length, loading, visibleCount]);

  return (
    <main className="shop-wrap">
      {/* Shop Header Banner */}
      <section className="shop-hero-banner">
        <div className="wrap">
          <div className="badge-tag">THE NAIJA GADGETS COLLECTION</div>
          <h1>Good ideas start with good tools.</h1>
          <p className="muted shop-hero-copy">
            Explore considered tech for your home, your workbench, and wherever curiosity takes you.
          </p>
        </div>
      </section>

      <div className="wrap shop-content">
        {/* Controls Bar: Search & Sort */}
        <div className="shop-controls-bar">
          <div className="shop-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="shop-search-input"
              placeholder="Search gadgets, tools, and more"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="shop-sort-box">
            <label className="sort-label">Sort by:</label>
            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">✨ Flagship & Featured</option>
              <option value="price-low">💵 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="stock">📦 Highest Stock</option>
            </select>
          </div>
        </div>

        {/* Categories Chips Strip */}
        <div className="shop-categories-scroll">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? allProducts.length
                : allProducts.filter((p) => p.category === cat).length;
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                className={`category-pill ${active ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCat(cat);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
              >
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="shop-results-info">
          <span>
            Showing <strong>{displayedProducts.length}</strong> of{' '}
            <strong>{filteredProducts.length}</strong> products
            {selectedCat !== 'All' ? ` in "${selectedCat}"` : ''}
          </span>
          {searchQuery && (
            <span className="search-tag-active">Keyword: "{searchQuery}"</span>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="shop-loading-state">
            <div className="spinner" />
            <p>Loading 2026 smart gadgets catalog from Oracle VPS database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <h3>No gadgets match your filters</h3>
            <p className="muted">
              Try a different keyword or reset category to "All" to browse all 500 gadgets.
            </p>
            <button
              className="btn"
              onClick={() => {
                setSelectedCat('All');
                setSearchQuery('');
              }}
              style={{ marginTop: 12 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="jumia-grid">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="load-more-container" ref={loadMoreRef}>
                <button
                  className="btn btn-load-more"
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                >
                  Load {Math.min(ITEMS_PER_PAGE, filteredProducts.length - visibleCount)} more products ({filteredProducts.length - visibleCount} left)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
