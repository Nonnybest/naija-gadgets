'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');

  const call = async (method, body) => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    const r = await fetch('/api/admin/users', {
      method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token || '') },
      body: body ? JSON.stringify(body) : undefined,
    });
    return r.json();
  };

  useEffect(() => {
    call('GET').then((d) => (d.users ? setUsers(d.users) : setMsg(d.error || 'Sign in on the admin page first.')));
  }, []);

  const reset = async (u) => {
    const pw = window.prompt(`New password for ${u.email} (at least 8 characters):`);
    if (!pw) return;
    const d = await call('POST', { userId: u.id, newPassword: pw });
    setMsg(d.ok ? `Password changed for ${u.email}. Send it to the customer and ask them to keep it private.` : d.error);
  };

  const shown = users.filter((u) => (u.email + u.name + u.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="wrap">
      <h2>Customers</h2>
      <p><Link href="/admin" className="quiet-link">Back to Stock Management</Link></p>
      {msg && <p className="note">{msg}</p>}
      <input className="in" placeholder="Search by name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ textAlign: 'left' }}><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{u.name || '-'}</td><td>{u.email}</td><td>{u.phone || '-'}</td>
                <td>{new Date(u.created_at).toLocaleDateString('en-NG')}</td>
                <td><button className="chip" onClick={() => reset(u)}>Reset password</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
