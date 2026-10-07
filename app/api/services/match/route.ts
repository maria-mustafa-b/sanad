import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { seedServices } from '@/lib/services/catalog';

// Ground the AI matcher in the same reviewed 29-service official catalog used
// by /api/services, so the "28 verified UAE portals" claim is actually wired
// into the live path.
const servicesCatalog = seedServices.map((service, index) => ({
  service_id: `SVC-${String(index + 1).padStart(3, '0')}`,
  name: service.title,
  category: service.category,
  description: service.description,
  official_url: service.url,
}));

export async function POST(request: Request) {
  try {
    const { situation, intent } = await request.json();

    if (!situation) {
      return NextResponse.json({ error: 'Situation is required' }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'AI_UNAVAILABLE',
          message:
            'The AI provider is not configured. Add AI_API_KEY to the environment or browse the full catalog at /services.',
        },
        { status: 503 },
      );
    }

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const modelId = process.env.AI_MODEL || 'gemini-flash-latest';

    const result = await generateObject({
      model: googleProvider(modelId),
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

    // Populate the match objects with the full service details from the catalog
    const populatedMatches = result.object.matches.map(match => {
      const fullService = servicesCatalog.find(s => s.service_id === match.service_id);
      return fullService
        ? { ...fullService, relevance: match.relevance, reasoning: match.reasoning }
        : null;
    }).filter((match): match is NonNullable<typeof match> => match !== null);

    return NextResponse.json({ data: populatedMatches, source: 'ai' });

  } catch (error: any) {
    console.error('Service Matching Error:', error);
    return NextResponse.json({ error: 'Failed to match services' }, { status: 500 });
  }
}
