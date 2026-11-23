import { createClient } from '@supabase/supabase-js';

const clean = (v) => (v ? String(v).replace(/^\uFEFF/, '').trim() : '');
export const ZONES = { 'Lagos': 2500, 'South-West and Abuja': 3500, 'Rest of Nigeria': 4500, 'Pickup point': 0 };

export function adminDb() {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) throw new Error('Database service is not configured.');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function requireAdmin(req, db) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  const email = (data?.user?.email || '').toLowerCase();
  const admin = clean(process.env.NEXT_PUBLIC_ADMIN_EMAIL).toLowerCase();
  return email && email === admin ? data.user : null;
}

// Ask Flutterwave directly whether this reference was really paid, in full, in naira.
async function verifyFlutterwave(reference, expectedTotal) {
  const key = clean(process.env.FLW_SECRET_KEY);
  if (!key) return false;
  const r = await fetch('https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=' + encodeURIComponent(reference), {
    headers: { Authorization: 'Bearer ' + key },
  });
  const v = await r.json().catch(() => null);
  const d = v?.data;
  return !!(v?.status === 'success' && d && d.status === 'successful' && d.currency === 'NGN' && Number(d.amount) >= Number(expectedTotal));
}

// Used by both the browser callback and the Flutterwave webhook. Safe to call many times.
export async function markPaid(db, reference) {
  const { data: order } = await db.from('ng_orders').select('*').eq('reference', reference).maybeSingle();
  if (!order) return { error: 'Order not found.' };
  if (order.status !== 'pending') return { ok: true, order };
  if (!(await verifyFlutterwave(reference, order.total))) return { error: 'Payment not confirmed yet.' };
  const { data: claimed } = await db.from('ng_orders').update({ status: 'paid' }).eq('id', order.id).eq('status', 'pending').select().maybeSingle();
  if (!claimed) return { ok: true, order };
  for (const l of order.items || []) {
    const { data: p } = await db.from('ng_products').select('stock').eq('id', l.id).maybeSingle();
    if (p) await db.from('ng_products').update({ stock: Math.max(0, p.stock - l.qty) }).eq('id', l.id);
  }
  return { ok: true, order: claimed };
}
