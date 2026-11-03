import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
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

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI_UNAVAILABLE', message: 'The AI provider is not configured (AI_API_KEY missing).' },
      { status: 503 },
    );
  }

  const transcript = turns.map((t) => `${t.role === 'user' ? 'USER' : 'SANAD'}: ${t.content}`).join('\n');
  const known = body.profile && Object.keys(body.profile).length ? JSON.stringify(body.profile) : 'none yet';

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const { object } = await generateObject({
      model: google(process.env.AI_MODEL || 'gemini-flash-latest'),
      schema: z.object({
        language: z.string().describe('Language/register of the LAST user message, e.g. Arabic, Hinglish, English, Roman Urdu'),
        reply: z.string().describe('Your reply to the user, written in that same language and register'),
        next_question: z.string().optional().describe('At most ONE follow-up question, same language; omit if none is needed'),
        facts: z
          .array(z.object({ key: z.string(), label: z.string(), value: z.string() }))
          .describe('Only facts the user explicitly stated in this conversation; never guessed'),
        services: z
          .array(z.object({ id: z.string(), why: z.string().describe('One sentence: why this service fits what the user said') }))
          .describe('Relevant catalogue services only, by ID from the list provided'),
        missing_info: z.array(z.string()).describe('Information still needed to give accurate guidance'),
      }),
      prompt: `You are SANAD, a multilingual assistant that helps UAE residents understand government services.

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
${transcript}`,
    });

    const services = object.services
      .filter((s) => catalogIds.has(s.id))
      .map((s) => ({ ...catalog.find((c) => c.id === s.id)!, why: s.why }));

    return NextResponse.json({ ...object, services, source: 'ai' });
  } catch (err) {
    console.warn('AI chat provider failed:', err);
    return NextResponse.json(
      { error: 'AI_FAILED', message: 'The AI provider could not answer right now. Please try again.' },
      { status: 502 },
    );
  }
}
