import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'AI_UNAVAILABLE',
          message:
            'The AI provider is not configured. Add AI_API_KEY to the environment or run in demo mode.',
        },
        { status: 503 },
      );
    }

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const modelId = process.env.AI_MODEL || 'gemini-flash-latest';

    let resultObject;
    let source = 'ai';
    try {
      const result = await generateObject({
        model: googleProvider(modelId),
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
      resultObject = result.object;
    } catch (apiError) {
      console.warn('AI provider failed; returning clearly-labelled sample analysis:', apiError);
      // Honest demo fallback: static SAMPLE content, never presented as AI output.
      source = 'sample_fallback';
      resultObject = {
        intent: 'employment_support',
        category: 'Unpaid Wages (SAMPLE)',
        summary:
          'SAMPLE OUTPUT — the AI provider is unavailable, so this is fixed example text, not an analysis of your situation. Try again.',
        facts: {
          employment_status: 'Terminated (sample)',
          issue: 'Unpaid wages & Passport retention (sample)',
          salary_period: '2 months (sample)',
          employer: 'Unknown (sample)'
        },
        confidence: 0
      };
    }

    return NextResponse.json({ ...resultObject, source });

  } catch (error: any) {
    console.error('AI Processing Error:', error);
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 });
  }
}
