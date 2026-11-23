import { NextResponse } from 'next/server';
import { adminDb, markPaid } from '@/lib/server';

// Flutterwave calls this itself, so an order is never lost if the customer closes the tab after paying.
export async function POST(req) {
  const secret = (process.env.FLW_SECRET_HASH || '').trim();
  if (!secret || req.headers.get('verif-hash') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const ref = body?.data?.tx_ref || body?.txRef;
  if (ref) await markPaid(adminDb(), ref);
  return NextResponse.json({ ok: true });
}
