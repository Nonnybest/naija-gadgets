'use client';
import { useEffect, useState } from 'react';
import { supabase, naira } from '@/lib/supabase';

const blank = { name: '', category: 'Phone accessories', price: 0, stock: 0, image_url: '', description: '', featured: false };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [cred, setCred] = useState({ email: '', password: '' });
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data: pData, error: pErr } = await supabase.from('ng_products').select('*').order('created_at', { ascending: false });
      if (pErr) setErr(pErr.message);
      else setRows(pData || []);

      const { data: oData, error: oErr } = await supabase.from('ng_orders').select('*').order('created_at', { ascending: false }).limit(50);
      if (oErr) setErr(oErr.message);
      else setOrders(oData || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user) load();
    });
  }, []);

  const login = async () => {
    setErr('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(cred);
    setLoading(false);
    if (error) return setErr(error.message);
    setUser(data?.user || null);
    load();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRows([]);
    setOrders([]);
  };

  const save = async () => {
    const { id, created_at, ...body } = form;
    if (!body.name || !body.category) return setErr('Name and category are required.');
    body.price = Math.max(0, Number(body.price) || 0);
    body.stock = Math.max(0, Number(body.stock) || 0);

    const r = id
      ? await supabase.from('ng_products').update(body).eq('id', id)
      : await supabase.from('ng_products').insert(body);

    if (r.error) return setErr(r.error.message);
    setErr('');
    setForm(blank);
    load();
  };

  const del = async (id) => {
    if (confirm('Delete this product?')) {
      const { error } = await supabase.from('ng_products').delete().eq('id', id);
      if (error) setErr(error.message);
      else load();
    }
  };

  const bump = async (p, n) => {
    const newStock = Math.max(0, p.stock + n);
    const { error } = await supabase.from('ng_products').update({ stock: newStock }).eq('id', p.id);
    if (error) setErr(error.message);
    else load();
  };

  const f = (k, num) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : num ? Math.max(0, +e.target.value) : e.target.value });

  if (!user) {
    return (
      <main className="wrap">
        <h2>Admin sign in</h2>
        {err && <p className="note">{err}</p>}
        <input className="in" placeholder="Email" value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} />
        <input className="in" type="password" placeholder="Password" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} />
        <button className="btn" onClick={login} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Stock Management</h2>
        <button className="chip" onClick={logout}>Sign out ({user.email})</button>
      </div>
      {err && <p className="note">{err}</p>}
      <div className="form">
        <input className="in" placeholder="Name" value={form.name} onChange={f('name')} />
        <input className="in" placeholder="Category" value={form.category} onChange={f('category')} />
        <input className="in" type="number" placeholder="Price (₦)" value={form.price} onChange={f('price', 1)} />
        <input className="in" type="number" placeholder="Stock" value={form.stock} onChange={f('stock', 1)} />
        <input className="in" placeholder="Image URL" value={form.image_url || ''} onChange={f('image_url')} />
        <input className="in" placeholder="Description" value={form.description || ''} onChange={f('description')} />
        <label style={{ display: 'block', margin: '8px 0' }}>
          <input type="checkbox" checked={!!form.featured} onChange={f('featured')} /> Show on home page
        </label>
        <button className="btn" onClick={save}>{form.id ? 'Save changes' : 'Add product'}</button>
        {form.id && <button className="chip" style={{ marginLeft: 8 }} onClick={() => setForm(blank)}>Cancel</button>}
      </div>

      {rows.map((p) => (
        <div className="row line" key={p.id}>
          <span>{p.name} · {naira(p.price)}</span>
          <span>
            <button className="chip" onClick={() => bump(p, -1)}>−</button> {p.stock}{' '}
            <button className="chip" onClick={() => bump(p, 1)}>+</button>
          </span>
          <span>
            <button className="chip" onClick={() => setForm(p)}>Edit</button>{' '}
            <button className="chip" onClick={() => del(p.id)}>Delete</button>
          </span>
        </div>
      ))}

      <h2 style={{ marginTop: 32 }}>Recent orders</h2>
      {orders.length === 0 && <p className="muted">No orders found.</p>}
      {orders.map((o) => (
        <div className="line" key={o.id}>
          <strong>{naira(o.total)}</strong> · {o.name} · {o.phone} · {o.zone}<br />
          <span className="muted">{o.address} · {(o.items || []).map((i) => i.qty + '× ' + i.name).join(', ')}</span>
        </div>
      ))}
    </main>
  );
}
