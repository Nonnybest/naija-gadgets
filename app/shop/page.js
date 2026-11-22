'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

const CATS = ['All', 'Phone accessories', 'Laptop accessories', 'Smart devices', 'Smart home'];

export default function Shop() {
  const [all, setAll] = useState([]);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('ng_products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setAll(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const list = all.filter(
    (p) =>
      (cat === 'All' || p.category === cat) &&
      (p.name || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="wrap">
      <h2>Shop</h2>
      <input className="in" placeholder="Search accessories" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chips">
        {CATS.map((c) => (
          <button key={c} className={c === cat ? 'chip on' : 'chip'} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="muted">Loading products...</p>
      ) : (
        <>
          <div className="grid">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          {!list.length && <p className="muted">Nothing here yet. Try another category.</p>}
        </>
      )}
    </main>
  );
}
