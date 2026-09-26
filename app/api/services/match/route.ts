import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import servicesCatalog from '@/data/services.json';

export async function POST(request: Request) {
  try {
    const { situation, intent } = await request.json();

    if (!situation) {
      return NextResponse.json({ error: 'Situation is required' }, { status: 400 });
    }

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        matches: z.array(z.object({
          service_id: z.string(),
          relevance: z.enum(['High', 'Medium', 'Low']),
          reasoning: z.string().describe('A "Why am I seeing this?" explanation for why this specific service matches the user situation based strictly on its description.')
        })).max(3)
      }),
      prompt: `You are SANAD, a legal structuring AI for the UAE. 
A user has reported the following situation: "${situation}" (Intent: ${intent || 'Unknown'})

Here is the current catalog of verifiable UAE services:
${JSON.stringify(servicesCatalog, null, 2)}

Identify the top 1 to 3 most relevant services from this catalog. 
For each match, provide the service_id, the relevance level, and a "Why am I seeing this?" grounded explanation based strictly on the service description.
DO NOT invent services. Only return IDs from the provided catalog.`,
    });

    // Populate the match objects with the full service details from the JSON
    const populatedMatches = result.object.matches.map(match => {
      const fullService = servicesCatalog.find(s => s.service_id === match.service_id);
      return {
        ...fullService,
        relevance: match.relevance,
        reasoning: match.reasoning
      };
    }).filter(match => match.name); // ensure valid matches

    return NextResponse.json({ data: populatedMatches });

  } catch (error: any) {
    console.error('Service Matching Error:', error);
    return NextResponse.json({ error: 'Failed to match services' }, { status: 500 });
  }
}
