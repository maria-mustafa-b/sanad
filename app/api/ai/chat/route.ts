import { NextResponse } from 'next/server';

// Leaves room for the provider fallback chain.
export const maxDuration = 60;
import { z } from 'zod';
import { aiConfigured, generateJSON } from '@/lib/ai/resilient';
import { seedServices } from '@/lib/services/catalog';

type Turn = { role: 'user' | 'assistant'; content: string };

const MAX_TURNS = 30;

// Catalogue the model may cite. IDs follow the seed order (SVC-001 ...).
const catalog = seedServices.map((s, i) => ({
  id: `SVC-${String(i + 1).padStart(3, '0')}`,
  title: s.title,
  category: s.category,
  url: s.url,
}));
const catalogIds = new Set(catalog.map((c) => c.id));

const replySchema = z.object({
  language: z.string(),
  reply: z.string().min(1),
  next_question: z.string().nullish(),
  facts: z.array(z.object({ key: z.string(), label: z.string(), value: z.string() })).default([]),
  services: z.array(z.object({ id: z.string(), why: z.string() })).default([]),
  missing_info: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  let body: { messages?: Turn[]; profile?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const turns = (body.messages || [])
    .filter((t) => (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string' && t.content.trim())
    .slice(-MAX_TURNS);
  if (!turns.length || turns[turns.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'The last message must be from the user' }, { status: 400 });
  }

  if (!aiConfigured()) {
    return NextResponse.json(
      { error: 'AI_UNAVAILABLE', message: 'The AI provider is not configured.' },
      { status: 503 },
    );
  }

  const transcript = turns.map((t) => `${t.role === 'user' ? 'USER' : 'SANAD'}: ${t.content}`).join('\n');
  const known = body.profile && Object.keys(body.profile).length ? JSON.stringify(body.profile) : 'none yet';

  try {
    const { data: object, provider } = await generateJSON(
      `You are SANAD, a multilingual assistant that helps UAE residents understand government services.

Rules:
- Detect the language of the user's LAST message and reply in exactly that language and register (Arabic -> Arabic, Hinglish -> Hinglish, English -> English). If the user asks for a specific language, use it.
- Use the whole conversation; never ask again for something the user already told you.
- Ask at most ONE follow-up question at a time, and say briefly why you need it.
- Only record facts the user explicitly said. Never invent salary figures, fees, dates, nationality, visa expiry or processing times.
- Only recommend services from the catalogue below, by ID. If official requirements (fees, salary thresholds) are not in the catalogue, say they must be confirmed on the official source.
- You give navigation and guidance, not legal advice.

Facts already confirmed by the user: ${known}

Service catalogue:
${catalog.map((c) => `${c.id} | ${c.title} | ${c.category} | ${c.url}`).join('\n')}

Conversation:
${transcript}

Respond with ONLY a JSON object of this exact shape:
{
  "language": "language/register of the LAST user message, e.g. Arabic, Hinglish, English",
  "reply": "your reply, in that same language and register",
  "next_question": "at most ONE follow-up question in the same language, or null",
  "facts": [{ "key": "snake_case_id", "label": "short label", "value": "only what the user explicitly said" }],
  "services": [{ "id": "SVC-xxx from the catalogue", "why": "one sentence on why it fits" }],
  "missing_info": ["information still needed"]
}`,
      replySchema,
    );

    const services = object.services
      .filter((s) => catalogIds.has(s.id))
      .map((s) => ({ ...catalog.find((c) => c.id === s.id)!, why: s.why }));

    return NextResponse.json({ ...object, services, source: 'ai', provider });
  } catch (err) {
    console.warn('AI chat provider failed:', err);
    return NextResponse.json(
      { error: 'AI_FAILED', message: 'The AI provider could not answer right now. Please try again.' },
      { status: 502 },
    );
  }
}
