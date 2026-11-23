import { NextResponse } from 'next/server';
import { adminDb, markPaid } from '@/lib/server';

// Step 3: after the customer pays, confirm with Flutterwave and mark the order paid.
export async function POST(req) {
  try {
    const { reference } = (await req.json().catch(() => ({}))) || {};
    if (!reference) return NextResponse.json({ error: 'Missing reference.' }, { status: 400 });
    const r = await markPaid(adminDb(), reference);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    return NextResponse.json({ ok: true, id: r.order.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unexpected error.' }, { status: 500 });
  }
}
