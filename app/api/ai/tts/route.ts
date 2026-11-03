import { NextResponse } from 'next/server';

const MAX_CHARS = 1200;
const SAMPLE_RATE = 24000; // Gemini TTS returns 16-bit mono PCM at 24 kHz

// Wrap raw PCM in a WAV header so browsers can play it directly.
function pcmToWav(pcm: Buffer) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function POST(request: Request) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 503 });

  let text = '';
  try {
    ({ text } = await request.json());
  } catch {}
  if (!text?.trim()) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  const model = process.env.AI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Say this warmly and naturally, like a helpful person talking to a friend, at a relaxed pace. Keep the original language and accent of the text:\n\n${text.slice(0, MAX_CHARS)}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: process.env.AI_TTS_VOICE || 'Sulafat' } } },
      },
    }),
  });

  const json = await res.json().catch(() => null);
  const data = json?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { data: string } }) => p.inlineData)?.inlineData?.data;
  if (!res.ok || !data) {
    return NextResponse.json({ error: 'TTS_FAILED' }, { status: 502 });
  }

  return new NextResponse(new Uint8Array(pcmToWav(Buffer.from(data, 'base64'))), {
    headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' },
  });
}
