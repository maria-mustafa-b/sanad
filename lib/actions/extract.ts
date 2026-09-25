"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
    apiKey: process.env.AI_API_KEY,
});

const extractionSchema = z.object({
    intent: z.string().describe("The primary goal or problem the user is trying to solve (e.g. 'lost job', 'visa renewal')."),
    facts: z.array(z.string()).describe("List of extracted concrete facts from the situation."),
    missingInformation: z.array(z.string()).describe("List of questions to ask the user to clarify or gather necessary details. If you have enough info, leave this empty."),
    clarificationMessage: z.string().describe("A natural, empathetic reply to the user asking for the missing details, responding in the same language they used."),
    detectedLanguage: z.string().describe("The BCP-47 language code of the primary language the user used (e.g., 'mr-IN' for Marathi, 'hi-IN' for Hindi, 'ar-AE' for Arabic, 'ur-PK' for Urdu, 'en-US' for English)."),
    serviceLinks: z.array(z.string()).optional().describe("If the user's situation is clear, provide 1-2 official government links (URLs or names) relevant to their issue."),
    processGuide: z.array(z.string()).optional().describe("If the situation is clear, step-by-step guidance on how to use the service or handle their issue (including what documents they should upload)."),
});

export async function extractSituationFacts(
    situationText: string,
    previousFacts?: string[],
    previousQuestion?: string
) {
    if (!process.env.AI_API_KEY) {
        throw new Error("AI_API_KEY environment variable is not set.");
    }

    let prompt = `You are an empathetic, multilingual government service assistant.`;

    if (previousFacts && previousFacts.length > 0) {
        prompt += `
        
You have already extracted these facts from the user:
- ${previousFacts.join('\n- ')}

You recently asked the user: "${previousQuestion}"

The user's follow-up reply is:
"${situationText}"

Analyze the new reply in context. Merge any new information with the previously extracted facts. Extract the intent, the updated combined key facts, any STILL missing information, and generate a helpful clarification message if needed.`;
    } else {
        prompt += `
        
A user has reported the following situation:
"${situationText}"

Analyze the situation and extract the intent, key facts, missing information, and generate a helpful clarification message.`;
    }

    prompt += `\nEnsure the clarification message matches the user's language (e.g. if they mix languages like Hindi and English, respond appropriately and empathetically).`;

    try {
        const { object } = await generateObject({
            model: google("gemini-3.5-flash-lite"),
            schema: extractionSchema,
            prompt: prompt,
        });

        return { success: true, data: object };
    } catch (error: any) {
        console.error("AI Extraction Error:", error);
        return { success: false, error: error.message || "Failed to extract facts." };
    }
}
