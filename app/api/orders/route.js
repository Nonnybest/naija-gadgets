import { NextResponse } from 'next/server';
import { adminDb, ZONES } from '@/lib/server';

// Step 1 of checkout: validate the cart, price it on the server, save a PENDING order.
export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const customer = body?.customer;
    const items = body?.items;
    if (!customer || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order request.' }, { status: 400 });
    }
    const db = adminDb();
    const ids = items.map((i) => i.id).filter(Boolean);
    const { data: prods, error } = await db.from('ng_products').select('id,name,price,stock').in('id', ids);
    if (error || !prods) return NextResponse.json({ error: 'Could not load products.' }, { status: 500 });

    let subtotal = 0;
    const lines = [];
    for (const it of items) {
      const qty = Math.floor(Number(it.qty));
      const p = prods.find((x) => x.id === it.id);
      if (!p || !(qty > 0) || p.stock < qty) {
        return NextResponse.json({ error: `"${p?.name || 'An item'}" is out of stock or the quantity is too high.` }, { status: 400 });
      }
      subtotal += p.price * qty;
      lines.push({ id: p.id, name: p.name, price: p.price, qty });
    }
    const zone = ZONES[customer.zone] !== undefined ? customer.zone : 'Rest of Nigeria';
    const shipping = ZONES[zone];
    const total = subtotal + shipping;
    const reference = 'NG' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();

    const { data: o, error: oErr } = await db.from('ng_orders').insert({
      reference, user_id: customer.user_id || null, name: customer.name || '', email: customer.email || '',
      phone: customer.phone || '', address: customer.address || '', zone, shipping, total, items: lines, status: 'pending',
    }).select().single();
    if (oErr) return NextResponse.json({ error: 'Could not save the order.' }, { status: 500 });
    return NextResponse.json({ ok: true, id: o.id, reference, total });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unexpected error.' }, { status: 500 });
  }
}
