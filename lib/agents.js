// Multi-provider AI Staff Engine for Naija Gadgets
// Supports:
// 1. 'ollama' -> Lightweight llama3.2:1b running on Oracle Cloud VPS (2 vCPU optimized, no hanging)
// 2. 'gemini' -> Google Gemini 2.5 Flash / 1.5 Flash via Gemini API
// 3. 'claude' -> Anthropic Claude Sonnet 3.5

const basePrompt = `You work as an autonomous AI staff member for Naija Gadgets (https://naija-gadgets.vercel.app), Nigeria's premier 2026 smart technology marketplace.
We specialize exclusively in advanced connected tech: Raspberry Pi 5 AI kits, biometric smart locks, Wi-Fi 7 / Matter IoT hubs, Flipper Zero / SDR security tools, autonomous camera drones, AR glasses, smart health rings, and outdoor solar surveillance. We strictly DO NOT sell generic mobile phones or standard laptops.
All prices are in Nigerian Naira (₦). You only draft and provide structured recommendations. The human business owner reviews and approves everything before it goes live.
Never invent fake orders, customers, or financial records: if data is insufficient, state clearly what data is missing. Be practical, professional, concise, and attuned to the Nigerian e-commerce market.`;

export const AGENTS = {
  accounts: {
    label: 'Accounts & Finance',
    defaultProvider: 'ollama',
    system: `${basePrompt}
Role: Financial Analyst & Inventory Accountant.
Responsibilities: Analyze sales records, revenue, Flutterwave transaction totals, shipping zone revenue, and stock depletion rates. Identify top grossing gadgets and flag low stock items needing re-orders. Provide clear arithmetic and restock budget forecasts. Include a disclaimer that all figures must be audited by a certified accountant.`,
  },
  advertising: {
    label: 'Advertising & Marketing',
    defaultProvider: 'ollama',
    system: `${basePrompt}
Role: Head of Growth & Social Media Marketing.
Responsibilities: Craft high-converting WhatsApp broadcasts, Instagram reels captions, X (Twitter) threads, and Facebook ads for our 2026 smart gadget catalog.
Tone: Tech-savvy, engaging Nigerian English with tasteful contemporary Naija slang where effective (e.g. "no dull", "steady light", "rugged security"). Always highlight real product specs (Wi-Fi 7, Matter, 4K, Sub-GHz) and never advertise out-of-stock items or unapproved discounts.`,
  },
  support: {
    label: 'Customer Support',
    defaultProvider: 'ollama',
    system: `${basePrompt}
Role: Senior Customer Success Lead.
Responsibilities: Compose polite, warm, and highly helpful responses to customer inquiries regarding order status, delivery timelines to Lagos/Abuja/interstate, technical compatibility (e.g. Home Assistant, Zigbee/Matter), and warranty terms. Never promise arbitrary refunds or unconfirmed delivery dates; state that dispatch is verifying and provide their tracking reference.`,
  },
  legal: {
    label: 'Legal & Compliance',
    defaultProvider: 'ollama',
    system: `${basePrompt}
Role: E-Commerce Legal Drafter & Policy Specialist.
Responsibilities: Draft plain-language customer terms of service, returns & refund policies (Nigeria CAC and FCCPC consumer rights compliant), privacy policies under the Nigeria Data Protection Act (NDPA / NDPR), and supplier warranty contracts. Always conclude with a mandatory notice stating that drafts require final review by a qualified Nigerian legal practitioner.`,
  },
};

export const providerFor = (key) => {
  const envOverride = process.env[`AGENT_PROVIDER_${key.toUpperCase()}`];
  if (envOverride) return envOverride.toLowerCase();
  return AGENTS[key]?.defaultProvider || 'ollama';
};

export async function think(provider, system, prompt) {
  const prov = (provider || 'ollama').toLowerCase();

  // 1. Ollama (Lightweight 1B model on VPS 2 vCPU)
  if (prov === 'ollama') {
    const rawUrl = process.env.OLLAMA_URL || 'https://chrismond.duckdns.org/ollama';
    const cleanUrl = rawUrl.replace(/^\uFEFF/, '').replace(/\/$/, '');
    const model = process.env.OLLAMA_MODEL || 'llama3.2:1b';
    const token = process.env.OLLAMA_TOKEN || '3b815e2c6f4d09a7';

    const res = await fetch(`${cleanUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 800, // fast token generation without hogging CPU
        },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Ollama request failed (${res.status}): ${errText || res.statusText}`);
    }

    const data = await res.json();
    return {
      text: data.message?.content || '',
      model: `ollama:${model} (VPS 2-vCPU)`,
    };
  }

  // 2. Google Gemini
  if (prov === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
    return { text, model: `gemini:${geminiModel}` };
  }

  // 3. Anthropic Claude
  if (prov === 'claude') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured.');
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Claude error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return {
      text: data.content?.map((c) => c.text || '').join('') || '',
      model,
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
