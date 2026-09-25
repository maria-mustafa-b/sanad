"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
    apiKey: process.env.AI_API_KEY,
});

const extractionSchema = z.object({
    intent: z.string().describe("The primary goal or problem the user is trying to solve (e.g. 'lost job', 'visa renewal', 'unpaid wages')."),
    facts: z.array(z.string()).describe("List of extracted concrete facts from the situation."),
    missingInformation: z.array(z.string()).describe("List of questions to ask the user to clarify or gather necessary details. If you have enough info, leave this empty."),
    clarificationMessage: z.string().describe("A natural, empathetic reply to the user asking for the missing details. MUST respond in the SAME language(s) the user used. If they used Hinglish, reply in Hinglish. If Arabic, reply in Arabic. If Urdu, reply in Urdu."),
    detectedLanguage: z.string().describe("The BCP-47 language code of the primary language the user used (e.g., 'hi-IN' for Hindi, 'ar-AE' for Arabic, 'ur-PK' for Urdu, 'en-US' for English). For mixed/code-switched input, pick the dominant language."),
    confidence: z.number().min(0).max(100).describe("Your confidence (0-100) in correctly understanding the user's situation. Lower if the input is ambiguous, has heavy code-switching, or is missing critical details."),
    serviceLinks: z.array(z.string()).optional().describe("If the user's situation is clear, provide 1-2 official government service names or URLs relevant to their issue."),
    processGuide: z.array(z.string()).optional().describe("If the situation is clear, step-by-step guidance on how to proceed (including what documents to upload)."),
});

export async function extractSituationFacts(
    situationText: string,
    previousFacts?: string[],
    previousQuestion?: string
) {
    if (!process.env.AI_API_KEY) {
        throw new Error("AI_API_KEY environment variable is not set.");
    }

    let prompt = `You are SANAD, an empathetic, multilingual government service assistant specializing in helping migrant and transnational workers.

You MUST understand these languages and their informal variations:
- English
- Hindi (हिंदी) — including Hinglish (Hindi-English mix), Romanized Hindi, phonetic spelling
- Arabic (العربية) — including Arabizi (Arabic written in Latin script, e.g. "3ayez" = "عايز"), Gulf dialect, informal Arabic
- Urdu (اردو) — including Roman Urdu, Urdu-English mix, phonetic Urdu

Critical language rules:
- Users will CODE-SWITCH mid-sentence (e.g. "Meri job chali gayi and boss ne salary nahi di")
- Users will SPELL BY EAR (e.g. "visaa expire ho gaya" instead of "visa")
- Users will write one language in another's script (e.g. Hindi in Latin letters)
- Users will use slang, abbreviations, incomplete sentences, and grammatical errors
- You MUST respond in the SAME language(s) the user used. Mirror their style.
- NEVER invent government services. Only suggest real, well-known services.`;

    if (previousFacts && previousFacts.length > 0) {
        prompt += `

You have already extracted these facts from the user:
- ${previousFacts.join('\n- ')}

You recently asked the user: "${previousQuestion}"

The user's follow-up reply is:
"${situationText}"

Analyze the new reply in context. Merge any new information with the previously extracted facts. Update the intent, the combined key facts, any STILL missing information, and generate a helpful follow-up.`;
    } else {
        prompt += `

A user has reported the following situation:
"${situationText}"

Analyze the situation and extract the intent, key facts, missing information, and generate a helpful clarification message.`;
    }

    try {
        const { object } = await generateObject({
            model: google("gemini-3.5-flash-lite"),
            schema: extractionSchema,
            prompt: prompt,
        });

        return { success: true, data: object };
    } catch (error: unknown) {
        console.error("AI Extraction Error:", error);
        const msg = error instanceof Error ? error.message : "Failed to extract facts.";
        return { success: false, error: msg };
    }
}
