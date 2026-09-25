import { z } from "zod";
import { AppError } from "@/lib/api/errors";
import { demoMode } from "@/lib/database/repository";
export const analysisSchema = z.object({
  intent: z.string().max(100),
  confidence: z.number().min(0).max(1),
  languageSignals: z.array(z.string().max(30)).max(6),
  facts: z.record(z.string().max(80), z.string().max(300)),
  missing_information: z.array(z.string().max(80)).max(12),
  potential_categories: z.array(z.string().max(80)).max(12),
});
export type Analysis = z.infer<typeof analysisSchema>;
export function analyzeExample(input: string): Analysis {
  const text = input.toLowerCase();
  const wages =
    /salary|salri|salry|paisa|pay|wage|راتب|تنخواه|tankhwa|tankhwaah|ملا|वेतन|सैलरी|nahi mili|nahin mili/.test(
      text,
    );
  const loss =
    /job chali|job lost|lost my job|terminated|fired|laid off|no job|employment ended|نوکری|کام ختم|فصل|وظيفة|نوکری/.test(
      text,
    );
  const arabic = /[؀-ۿ]/.test(input),
    devanagari = /[ऀ-ॿ]/.test(input);
  const period =
    /(january|february|march|april|may|june|july|august|september|october|november|december)/i.exec(
      input,
    )?.[1];
  const facts: Record<string, string> = {};
  if (loss) facts.employment_status = "lost_job";
  if (wages) facts.issue = "unpaid_wages";
  if (period)
    facts.salary_period =
      period[0].toUpperCase() + period.slice(1).toLowerCase();
  return analysisSchema.parse({
    intent: loss || wages ? "employment_support" : "general_support",
    confidence: loss && wages ? 0.81 : loss || wages ? 0.65 : 0.3,
    languageSignals: [
      arabic
        ? "Arabic/Urdu script"
        : devanagari
          ? "Hindi script"
          : /meri|nahi|chali|mili|paisa/i.test(input)
            ? "Romanized South Asian language"
            : "English",
      "English",
    ].filter((v, i, a) => a.indexOf(v) === i),
    facts,
    missing_information: [
      ...(loss ? ["employment_end_date"] : []),
      ...(wages && !period ? ["salary_period"] : []),
    ],
    potential_categories: [
      ...(wages ? ["unpaid_wages"] : []),
      ...(loss ? ["job_loss", "employment_support"] : []),
    ],
  });
}
const instruction = `You extract only explicitly stated facts from mixed Arabic-English, Hindi-English, Urdu-English, Arabizi or phonetic spelling. Output strictly JSON with keys intent, confidence (0..1), languageSignals (array), facts (object of string values), missing_information (array), potential_categories (array). Use categories unpaid_wages, job_loss, employment_support, residency, labour_dispute as appropriate. Do not invent facts, legal eligibility, programmes or personal details. Ask for missing facts without asserting their value.`;
export async function analyze(
  text: string,
): Promise<{ analysis: Analysis; method: "provider" | "demo_rules" }> {
  if (!process.env.AI_API_KEY) {
    if (demoMode())
      return { analysis: analyzeExample(text), method: "demo_rules" };
    throw new AppError(
      "AI_NOT_CONFIGURED",
      "Configure an AI provider to analyze a situation.",
      503,
    );
  }
  const provider = process.env.AI_PROVIDER || "OPENAI",
    model = process.env.AI_MODEL || "";
  if (!model)
    throw new AppError(
      "AI_NOT_CONFIGURED",
      "Set AI_MODEL before using AI analysis.",
      503,
    );
  let endpoint: string, headers: Record<string, string>, payload: unknown;
  if (provider === "GEMINI") {
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.AI_API_KEY,
    };
    payload = {
      contents: [{ parts: [{ text: instruction + "\nSituation: " + text }] }],
      generationConfig: { responseMimeType: "application/json" },
    };
  } else {
    endpoint =
      provider === "AZURE_OPENAI"
        ? `${process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "")}/openai/deployments/${encodeURIComponent(model)}/chat/completions?api-version=${encodeURIComponent(process.env.AZURE_OPENAI_API_VERSION || "2024-10-21")}`
        : "https://api.openai.com/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      ...(provider === "OPENAI"
        ? { Authorization: `Bearer ${process.env.AI_API_KEY}` }
        : { "api-key": process.env.AI_API_KEY }),
    };
    payload = {
      ...(provider === "OPENAI" ? { model } : {}),
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    };
  }
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Provider status " + response.status);
    const data = await response.json();
    const content =
      provider === "GEMINI"
        ? data.candidates?.[0]?.content?.parts?.[0]?.text
        : data.choices?.[0]?.message?.content;
    return {
      analysis: analysisSchema.parse(JSON.parse(content)),
      method: "provider",
    };
  } catch {
    throw new AppError(
      "AI_ANALYSIS_FAILED",
      "We could not analyze the situation. Please try again.",
      502,
    );
  }
}
