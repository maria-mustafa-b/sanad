import { NextResponse } from 'next/server';

// Leaves room for the provider fallback chain.
export const maxDuration = 60;
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { aiConfigured, generateJSON } from '@/lib/ai/resilient';

const ocrSchema = z.object({
  documentType: z.string().default('Unknown document'),
  extractedText: z.string().default(''),
  fields: z.array(z.object({ label: z.string(), value: z.string(), certain: z.boolean().default(false) })).default([]),
  unreadableFields: z.array(z.string()).default([]),
  expiryDate: z.string().nullish(),
  flags: z.array(z.string()).default([]),
  readable: z.boolean().default(true),
  confidence: z.number().default(0),
});

export async function POST(request: Request) {
  try {
    if (!aiConfigured()) {
      return NextResponse.json(
        { error: 'AI_UNAVAILABLE', message: 'The AI provider is not configured.' },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Convert file to buffer and base64 for Gemini Vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    

    const prompt = `
      You are a legal document analyzer for the UAE. Extract the following information from this image:
      - Document Type (e.g. Passport, Visa, Contract, Salary Slip)
      - Key Entities (Employer, Employee name)
      - Dates (Expiry dates, salary periods)
      - Any illegal clauses (e.g., passport surrender, illegal fee deduction)
      
      STRICT OCR RULES:
      - Copy characters exactly as printed. Never reconstruct, round, complete or "fix" a value.
      - If any character of a value is blurred, cut off or ambiguous, mark that field "certain": false,
        and also list it in unreadableFields. Placeholder digits such as 0000 must be copied as-is.
      - If the image is blurred overall or a large part of the page is missing, set "readable": false.
      - Fill extractedText only with text you can actually read.

      Respond in strict JSON format:
      {
        "documentType": "String",
        "extractedText": "String (Summary of the most important text)",
        "fields": [{ "label": "String", "value": "String exactly as printed", "certain": true }],
        "unreadableFields": ["Fields that are missing, blurred or unreadable"],
        "expiryDate": "YYYY-MM-DD or empty string if none is visible",
        "flags": ["Array of strings highlighting risks or illegal clauses"],
        "readable": true,
        "confidence": 0.95
      }
    `;

    let analysis;
    try {
      const { data, provider } = await generateJSON(prompt, ocrSchema, {
        data: base64Image,
        mimeType: file.type || 'image/jpeg',
      });
      analysis = { ...data, provider };
    } catch (apiError) {
      console.warn('OCR providers failed:', apiError);
      return NextResponse.json(
        { error: 'AI_FAILED', message: 'SANAD could not read this document right now. Nothing was extracted. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: { ...analysis, source: 'ai' } }, { status: 200 });

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({ error: 'Internal Server Error processing document' }, { status: 500 });
  }
}
