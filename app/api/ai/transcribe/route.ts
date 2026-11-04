import { NextResponse } from 'next/server';

export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies above ~4.5 MB

// Speech to text with automatic language detection (no language is sent to Whisper).
export async function POST(request: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'AI_UNAVAILABLE', message: 'Voice transcription is not configured.' }, { status: 503 });
  }

  let file: File | null = null;
  try {
    file = (await request.formData()).get('file') as File | null;
  } catch {}
  if (!file || !file.size) return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'TOO_LARGE', message: 'That recording is too long. Please keep it shorter.' }, { status: 413 });
  }

  const form = new FormData();
  form.append('file', file, file.name || 'speech.webm');
  form.append('model', process.env.GROQ_STT_MODEL || 'whisper-large-v3');
  form.append('response_format', 'json');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    console.warn('Transcription failed:', res.status, body?.error?.message);
    return NextResponse.json({ error: 'STT_FAILED', message: 'SANAD could not transcribe that. Please try again.' }, { status: 502 });
  }
  return NextResponse.json({ text: (body?.text || '').trim() });
}
