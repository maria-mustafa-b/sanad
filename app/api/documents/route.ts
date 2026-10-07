import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'AI_UNAVAILABLE',
          message:
            'The AI provider is not configured. Add AI_API_KEY to the environment before analyzing documents.',
        },
        { status: 503 },
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Convert file to buffer and base64 for Gemini Vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    const modelName = process.env.AI_MODEL || 'gemini-flash-latest';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      You are a legal document analyzer for the UAE. Extract the following information from this image:
      - Document Type (e.g. Passport, Visa, Contract, Salary Slip)
      - Key Entities (Employer, Employee name)
      - Dates (Expiry dates, salary periods)
      - Any illegal clauses (e.g., passport surrender, illegal fee deduction)
      
      Respond in strict JSON format:
      {
        "documentType": "String",
        "extractedText": "String (Summary of the most important text)",
        "flags": ["Array of strings highlighting risks or illegal clauses"],
        "confidence": 0.95
      }
    `;

    let analysis;
    let source = 'ai';
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: file.type || 'image/jpeg'
          }
        }
      ]);
  
      const responseText = result.response.text();
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(jsonStr);
    } catch (apiError) {
      console.warn('AI provider failed; returning clearly-labelled sample analysis:', apiError);
      // Honest demo fallback: static SAMPLE content, never presented as real OCR output.
      source = 'sample_fallback';
      analysis = {
        documentType: 'Salary Slip (SAMPLE)',
        extractedText: 'SAMPLE OUTPUT — the AI provider is unavailable, so this is fixed example text, not an extraction from your document. Try again.',
        flags: ['Sample data only: upload the document again for a real analysis'],
        confidence: 0
      };
    }

    return NextResponse.json({ data: { ...analysis, source } }, { status: 200 });

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({ error: 'Internal Server Error processing document' }, { status: 500 });
  }
}
