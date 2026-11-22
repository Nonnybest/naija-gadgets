import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { AGENTS, providerFor, think } from '@/lib/agents';

export const maxDuration = 60;

const sanitize = (str, fallback = '') =>
  str ? String(str).replace(/^\uFEFF/, '').trim() : fallback;

const N = (n) => '₦' + Number(n || 0).toLocaleString('en-NG');

async function buildContext(db, agent, prompt) {
  const { data: prods } = await db
    .from('ng_products')
    .select('name,category,price,stock,featured')
    .limit(100);

  if (agent === 'accounts') {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { data: orders } = await db
      .from('ng_orders')
      .select('total,shipping,zone,items,created_at')
      .gte('created_at', since);

    const sold = {};
    (orders || []).forEach((o) => {
      (o.items || []).forEach((i) => {
        sold[i.name] = (sold[i.name] || 0) + (i.qty || 1);
      });
    });

    const totalRev = (orders || []).reduce((s, o) => s + (o.total || 0), 0);
    const shippingTotal = (orders || []).reduce((s, o) => s + (o.shipping || 0), 0);
    const lowStock = (prods || []).filter((p) => p.stock <= 5);

    return `Last 30 days metrics:
Total orders: ${orders?.length || 0}
Total revenue: ${N(totalRev)}
Delivery fees collected: ${N(shippingTotal)}
Units sold: ${JSON.stringify(sold, null, 2)}
Low stock alert (<= 5 units): ${JSON.stringify(lowStock, null, 2)}`;
  }

  if (agent === 'support') {
    const { data: orders } = await db
      .from('ng_orders')
      .select('reference,name,phone,zone,status,total,items,created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    const matching = (orders || []).filter(
      (o) =>
        (o.reference && prompt.includes(o.reference)) ||
        (o.phone && prompt.includes(o.phone)) ||
        (o.name && prompt.toLowerCase().includes(o.name.toLowerCase()))
    );

    return `Matching customer orders: ${JSON.stringify(matching, null, 2)}
Available catalog sample: ${JSON.stringify(prods?.slice(0, 20), null, 2)}`;
  }

  if (agent === 'advertising') {
    return `Smart 2026 Tech Products Catalog Sample (price in Naira, stock):
${JSON.stringify(prods?.slice(0, 25), null, 2)}`;
  }

  return `Business Context:
Company: Naija Gadgets (https://naija-gadgets.vercel.app)
Niche: High-tech connected smart devices (Raspberry Pi 5, Matter/Thread smart locks, IoT, drones, cyber tools, SDRs).
Logistics: Nationwide delivery across Nigeria. Zones: Lagos (₦2,500), South-West & Abuja (₦3,500), Rest of Nigeria (₦4,500), Lagos Pickups (Free).
Payment: Paystack (Cards, Bank Transfer, USSD).
Compliance: Nigeria Data Protection Act 2023 (NDPA / NDPR), FCCPC Consumer Protection regulations.`;
}

export async function POST(req) {
  try {
    const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://chrismond.duckdns.org');
    const serviceRoleKey = sanitize(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const adminEmail = sanitize(process.env.NEXT_PUBLIC_ADMIN_EMAIL, 'ajalijohn102@gmail.com');

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error: missing service key.' }, { status: 500 });
    }

    const db = createClient(supabaseUrl, serviceRoleKey);
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: missing authorization token.' }, { status: 401 });
    }

    const { data: authData, error: authError } = await db.auth.getUser(token);
    if (authError || !authData?.user || authData.user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden: admin privilege required.' }, { status: 403 });
    }

    const body = await req.json();
    const { agent, prompt } = body;

    if (!AGENTS[agent] || !prompt?.trim()) {
      return NextResponse.json(
        { error: 'Invalid request: please select a valid agent and enter a task prompt.' },
        { status: 400 }
      );
    }

    const contextData = await buildContext(db, agent, prompt);
    const provider = providerFor(agent);
    const systemPrompt = AGENTS[agent].system;
    const combinedPrompt = `${prompt}\n\n--- Store Live Data & Context ---\n${contextData}`;

    const { text, model } = await think(provider, systemPrompt, combinedPrompt);

    const { data: row, error: insertError } = await db
      .from('ng_agent_tasks')
      .insert({
        agent,
        prompt,
        output: text,
        model,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save agent task to database:', insertError);
      return NextResponse.json({
        ok: true,
        warning: 'Task completed but database logging failed: ' + insertError.message,
        task: { agent, prompt, output: text, model, status: 'draft' },
      });
    }

    return NextResponse.json({ ok: true, task: row });
  } catch (error) {
    console.error('Agent execution error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
