import { z } from 'zod';

// JSON generation that survives provider outages: every Gemini model on every
// Gemini key first, then Groq. Keys come only from the environment.

type Image = { data: string; mimeType: string };
type Result<T> = { data: T; provider: string };

const TIMEOUT_MS = 20000;
const FIRST_GEMINI_TIMEOUT_MS = 30000;

function geminiKeys() {
  return [process.env.AI_API_KEY, process.env.AI_API_KEY_FALLBACK, process.env.AI_API_KEY_FALLBACK2].filter(Boolean) as string[];
}

function geminiModels() {
  const preferred = process.env.AI_MODEL;
  return [...new Set([preferred, 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'].filter(Boolean))] as string[];
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${body?.error?.message || ''}`.slice(0, 200));
    return body;
  } finally {
    clearTimeout(timer);
  }
}

function parseModelJson(text: string) {
  return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());
}

async function gemini(prompt: string, image: Image | undefined, key: string, model: string, timeoutMs = TIMEOUT_MS) {
  const parts: object[] = [{ text: prompt }];
  if (image) parts.push({ inlineData: image });
  const body = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json' } }),
  }, timeoutMs);
  const text = body?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
  return parseModelJson(text);
}

async function groq(prompt: string, image: Image | undefined) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY missing');
  // Groq vision accepts images, not PDFs.
  if (image && !image.mimeType.startsWith('image/')) throw new Error('Groq cannot read this file type');
  const content = image
    ? [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.data}` } }]
    : prompt;
  const body = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: image ? process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b' : process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });
  return parseModelJson(body?.choices?.[0]?.message?.content || '');
}

export function aiConfigured() {
  return geminiKeys().length > 0 || !!process.env.GROQ_API_KEY;
}

export async function generateJSON<T>(prompt: string, schema: z.ZodType<T>, image?: Image): Promise<Result<T>> {
  const errors: string[] = [];
  const attempts: [string, () => Promise<unknown>][] = [];
  const [first, ...rest] = geminiModels();
  // Preferred model on each key, then Groq, then the remaining Gemini models.
  const keys = geminiKeys();
  // Gemini is slow under load: one Gemini try, then Groq, then the other keys and models.
  if (keys[0]) attempts.push([`gemini:${first}:key1`, () => gemini(prompt, image, keys[0], first, FIRST_GEMINI_TIMEOUT_MS)]);
  attempts.push(['groq', () => groq(prompt, image)]);
  for (const [i, key] of keys.entries()) if (i > 0) attempts.push([`gemini:${first}:key${i + 1}`, () => gemini(prompt, image, key, first)]);
  for (const model of rest) {
    for (const [i, key] of geminiKeys().entries()) attempts.push([`gemini:${model}:key${i + 1}`, () => gemini(prompt, image, key, model)]);
  }

  for (const [name, run] of attempts) {
    try {
      const parsed = schema.safeParse(await run());
      if (parsed.success) return { data: parsed.data, provider: name };
      errors.push(`${name}: invalid shape`);
    } catch (e) {
      errors.push(`${name}: ${(e as Error).message}`);
    }
  }
  throw new Error(`All AI providers failed. ${errors.join(' | ')}`);
}
