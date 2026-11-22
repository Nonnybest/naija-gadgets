'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AGENTS } from '@/lib/agents-public';

const PROMPT_SUGGESTIONS = {
  accounts: [
    'Generate a 30-day revenue and inventory audit with restock recommendations for low-stock gadgets.',
    'Calculate gross margins assuming 18% supplier landed costs and forecast next week budget.',
  ],
  advertising: [
    'Write a viral 3-part WhatsApp broadcast promoting the Raspberry Pi 5 AI Kit and Smart Biometric Door Locks in Lagos and Abuja.',
    'Draft an engaging Instagram carousel caption explaining why home owners need Matter Wi-Fi 7 Smart Hubs.',
  ],
  support: [
    'Customer asking: "Does the Biometric Smart Door Lock work during NEPA power outages, and do you deliver to Port Harcourt?"',
    'Customer asking about order delivery timeline and tracking reference.',
  ],
  legal: [
    'Draft a comprehensive 2026 1-year replacement warranty policy for all smart biometric and IoT electronics.',
    'Draft a customer Privacy Policy compliant with the Nigeria Data Protection Act (NDPA 2023).',
  ],
};

export default function AdminAgentsPage() {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState('accounts');
  const [prompt, setPrompt] = useState('');
  const [tasks, setTasks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [err, setErr] = useState('');

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('ng_agent_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);
      if (error) console.error(error);
      else setTasks(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadTasks();
    });
  }, []);

  const runAgent = async () => {
    if (!prompt.trim()) return;
    setBusy(true);
    setErr('');
    setStatusMsg('Running agent on VPS (llama3.2:1b)...');

    try {
      const { data: s } = await supabase.auth.getSession();
      const token = s?.session?.access_token;
      if (!token) throw new Error('You must be signed in as admin.');

      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ agent, prompt }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Agent execution failed.');

      setStatusMsg('Task completed successfully!');
      setPrompt('');
      loadTasks();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (id, status) => {
    await supabase.from('ng_agent_tasks').update({ status }).eq('id', id);
    loadTasks();
  };

  const deleteTask = async (id) => {
    if (confirm('Delete this draft?')) {
      await supabase.from('ng_agent_tasks').delete().eq('id', id);
      loadTasks();
    }
  };

  return (
    <main className="wrap" style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <Link href="/admin" className="muted" style={{ textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            ← Back to Stock & Inventory
          </Link>
          <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 800 }}>🤖 Naija Gadgets AI Staff</h1>
          <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Powered by lightweight local Ollama (<code>llama3.2:1b</code>) on your Oracle VPS (2 vCPU) with zero lag.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="chip" style={{ background: 'rgba(31,157,85,0.15)', color: '#1F9D55', fontWeight: 600 }}>
            ● VPS Engine Online
          </span>
        </div>
      </div>

      {err && (
        <div className="note" style={{ background: '#ff4d4f22', border: '1px solid #ff4d4f', color: '#ff7875', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {err}
        </div>
      )}

      {statusMsg && (
        <div className="note" style={{ background: 'rgba(31,157,85,0.15)', border: '1px solid #1F9D55', color: '#1F9D55', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {statusMsg}
        </div>
      )}

      {/* Task Creation Box */}
      <div style={{ background: '#122336', border: '1px solid #243B53', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Assign New Task</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {Object.entries(AGENTS).map(([key, label]) => {
            const active = agent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAgent(key)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: active ? '2px solid #FFC21A' : '1px solid #243B53',
                  background: active ? 'rgba(255,194,26,0.1)' : '#0D1B2A',
                  color: active ? '#FFC21A' : '#EAF0F4',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '14px' }}>{label}</div>
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                  {key === 'accounts' && 'Sales, restock & audits'}
                  {key === 'advertising' && 'WhatsApp, IG & Ads'}
                  {key === 'support' && 'Order queries & FAQs'}
                  {key === 'legal' && 'Policies & agreements'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick prompt suggestions */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#829ab1', marginBottom: '8px' }}>💡 Quick suggestions:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PROMPT_SUGGESTIONS[agent]?.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                style={{
                  background: 'transparent',
                  border: '1px dashed #334e68',
                  borderRadius: '6px',
                  color: '#9fb3c8',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                "{sug}"
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="in"
          rows={5}
          placeholder={`Describe the task for the ${AGENTS[agent]} agent...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0D1B2A', border: '1px solid #334e68', color: '#fff', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            className="btn"
            disabled={busy || !prompt.trim()}
            onClick={runAgent}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 700,
              background: busy ? '#627D98' : '#FFC21A',
              color: '#0D1B2A',
              border: 'none',
              borderRadius: '8px',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >
            {busy ? '⏳ Processing on VPS...' : '🚀 Execute Agent Task'}
          </button>
        </div>
      </div>

      {/* Drafts and History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '20px' }}>Task Outputs & Drafts ({tasks.length})</h3>
        <button onClick={loadTasks} className="chip" style={{ cursor: 'pointer', background: '#243B53', color: '#EAF0F4' }}>
          ↻ Refresh
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>
          No agent tasks run yet. Assign a task above to see the results.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              style={{
                background: '#122336',
                border: '1px solid #243B53',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#FFC21A', fontSize: '15px' }}>
                    {AGENTS[t.agent] || t.agent}
                  </span>
                  <span className="muted" style={{ marginLeft: '10px', fontSize: '12px' }}>
                    {t.model} · {new Date(t.created_at).toLocaleString('en-NG')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      background:
                        t.status === 'approved'
                          ? 'rgba(31,157,85,0.2)'
                          : t.status === 'rejected'
                          ? 'rgba(255,77,79,0.2)'
                          : 'rgba(255,194,26,0.2)',
                      color:
                        t.status === 'approved'
                          ? '#1F9D55'
                          : t.status === 'rejected'
                          ? '#ff7875'
                          : '#FFC21A',
                    }}
                  >
                    {t.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    style={{ background: 'transparent', border: 'none', color: '#627D98', cursor: 'pointer', fontSize: '16px' }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#9FB3C8', fontStyle: 'italic' }}>
                Prompt: "{t.prompt}"
              </p>

              <div
                style={{
                  background: '#0D1B2A',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #1E3A5F',
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#EAF0F4',
                  fontFamily: 'inherit',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {t.output}
              </div>

              {t.status === 'draft' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                  <button
                    className="chip"
                    onClick={() => updateStatus(t.id, 'approved')}
                    style={{ background: '#1F9D55', color: '#fff', fontWeight: 600, cursor: 'pointer', border: 'none', padding: '6px 14px' }}
                  >
                    ✓ Approve Draft
                  </button>
                  <button
                    className="chip"
                    onClick={() => updateStatus(t.id, 'rejected')}
                    style={{ background: '#627D98', color: '#fff', cursor: 'pointer', border: 'none', padding: '6px 14px' }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
