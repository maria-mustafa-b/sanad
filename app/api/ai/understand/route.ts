import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        intent: z.string().describe('The primary intent or problem, e.g., employment_support, visa_issue, legal_dispute'),
        category: z.string().describe('A 2-3 word classification of the issue, e.g., Unpaid Wages, Visa Cancellation'),
        summary: z.string().describe('A formal, legal summary of the reported situation in English.'),
        facts: z.object({
          employment_status: z.string().optional(),
          issue: z.string().optional(),
          salary_period: z.string().optional(),
          employer: z.string().optional()
        }).describe('Extracted key facts from the text'),
        confidence: z.number().describe('Confidence score between 0 and 1')
      }),
      prompt: `You are SANAD, a legal structuring AI for the UAE. 
Analyze the following user situation (which may be in English, Arabic, Urdu, or Hindi).
Extract the facts, categorize it, and provide a formal English legal summary.

User situation: "${text}"`,
    });

    return NextResponse.json(result.object);

  } catch (error: any) {
    console.error('AI Processing Error:', error);
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 });
  }
}
