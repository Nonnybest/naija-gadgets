import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server';

// Creates an already-confirmed account, because confirmation emails are not switched on yet.
export async function POST(req) {
  try {
    const { email, password, fullName, phone } = (await req.json().catch(() => ({}))) || {};
    if (!email || !String(email).includes('@') || !password || String(password).length < 6) {
      return NextResponse.json({ error: 'Enter a valid email and a password of at least 6 characters.' }, { status: 400 });
    }
    const { error } = await adminDb().auth.admin.createUser({
      email: String(email).trim(), password, email_confirm: true,
      user_metadata: { full_name: fullName || '', phone: phone || '' },
    });
    if (error) {
      const taken = /already|registered|exists/i.test(error.message);
      return NextResponse.json({ error: taken ? 'An account with this email already exists. Try signing in.' : error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unexpected error.' }, { status: 500 });
  }
}
