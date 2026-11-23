import { NextResponse } from 'next/server';
import { adminDb, requireAdmin } from '@/lib/server';

export async function GET(req) {
  const db = adminDb();
  if (!(await requireAdmin(req, db))) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const users = (data.users || []).map((u) => ({
    id: u.id, email: u.email, name: u.user_metadata?.full_name || '', phone: u.user_metadata?.phone || '',
    created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
  }));
  return NextResponse.json({ users });
}

// Admin sets a new password for a customer.
export async function POST(req) {
  const db = adminDb();
  if (!(await requireAdmin(req, db))) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  const { userId, newPassword } = (await req.json().catch(() => ({}))) || {};
  if (!userId || !newPassword || String(newPassword).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  const { error } = await db.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
