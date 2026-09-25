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
    missingInformation: z.array(z.string()).describe("List of questions to ask the user to clarify or gather necessary details."),
    clarificationMessage: z.string().describe("A natural, empathetic reply to the user asking for the missing details, responding in the same language they used."),
});

export async function extractSituationFacts(situationText: string) {
    if (!process.env.AI_API_KEY) {
        throw new Error("AI_API_KEY environment variable is not set.");
    }

    try {
        const { object } = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: extractionSchema,
            prompt: `You are an empathetic, multilingual government service assistant.
      
A user has reported the following situation:
"${situationText}"

Analyze the situation and extract the intent, key facts, missing information, and generate a helpful clarification message.
Ensure the clarification message matches the user's language (e.g. if they mix languages like Hindi and English, respond appropriately and empathetically).`,
        });

        return { success: true, data: object };
    } catch (error: any) {
        console.error("AI Extraction Error:", error);
        return { success: false, error: error.message || "Failed to extract facts." };
    }
}
