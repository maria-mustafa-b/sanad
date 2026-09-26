import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Convert file to buffer and base64 for Gemini Vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    // 2. We use Gemini 1.5 Flash (or standard Gemini Pro Vision depending on env)
    const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
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
    // Clean up potential markdown formatting from Gemini response
    const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", jsonStr);
      analysis = { documentType: 'Unknown', extractedText: responseText, flags: [], confidence: 0 };
    }

    // 3. Save the record in Supabase (Optional for now, but adheres to No Mock Data)
    // We would upload the file to Supabase Storage here in a production env.

    return NextResponse.json({ data: analysis }, { status: 200 });

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({ error: 'Internal Server Error processing document' }, { status: 500 });
  }
}
