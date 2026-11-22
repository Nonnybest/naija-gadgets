import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ZONES = { 'Lagos': 2500, 'South-West and Abuja': 3500, 'Rest of Nigeria': 4500, 'Pickup point': 0 };

const clean = (val) => (val ? String(val).replace(/^\uFEFF/, '').trim() : '');

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.reference || !body.customer || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Invalid order request payload.' }, { status: 400 });
    }

    const { reference, customer, items } = body;

    const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const paystackKey = clean(process.env.PAYSTACK_SECRET_KEY);

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Database service is not configured.' }, { status: 500 });
    }

    const db = createClient(supabaseUrl, serviceKey);
    const ids = items.map((i) => i.id).filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid products in cart.' }, { status: 400 });
    }

    const { data: prods, error: prodErr } = await db.from('ng_products').select('*').in('id', ids);
    if (prodErr || !prods) {
      return NextResponse.json({ error: 'Failed to retrieve product details.' }, { status: 500 });
    }

    let subtotal = 0;
    const lines = [];

    for (const it of items) {
      const p = prods.find((x) => x.id === it.id);
      if (!p || p.stock < it.qty) {
        return NextResponse.json({ error: `Item "${p?.name || it.id}" is out of stock or insufficient quantity.` }, { status: 400 });
      }
      subtotal += p.price * it.qty;
      lines.push({ id: p.id, name: p.name, price: p.price, qty: it.qty });
    }

    const shipping = ZONES[customer?.zone] ?? 4500;
    const total = subtotal + shipping;

    if (!paystackKey) {
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 500 });
    }

    const vRes = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      headers: { Authorization: 'Bearer ' + paystackKey },
    });
    const v = await vRes.json().catch(() => null);

    if (!v || !v.status || !v.data || v.data.status !== 'success' || v.data.amount < total * 100) {
      return NextResponse.json({ error: 'Payment could not be verified with Paystack.' }, { status: 400 });
    }

    const { data: o, error: orderErr } = await db
      .from('ng_orders')
      .insert({
        reference,
        user_id: customer.user_id || null,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        zone: customer.zone || 'Lagos',
        shipping,
        total,
        items: lines,
        status: 'paid',
      })
      .select()
      .single();

    if (orderErr) {
      return NextResponse.json({ error: 'Order already recorded or failed to save.' }, { status: 400 });
    }

    for (const l of lines) {
      const p = prods.find((x) => x.id === l.id);
      if (p) {
        await db.from('ng_products').update({ stock: Math.max(0, p.stock - l.qty) }).eq('id', l.id);
      }
    }

    return NextResponse.json({ ok: true, id: o.id });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
