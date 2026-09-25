import { z } from "zod";
const optionalValue = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);
export const environmentSchema = z
  .object({
    AI_PROVIDER: z.enum(["OPENAI", "AZURE_OPENAI", "GEMINI"]).default("OPENAI"),
    BLOCKCHAIN_MODE: z.enum(["real", "mock"]).default("mock"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.url().optional(),
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalValue,
    AI_API_KEY: optionalValue,
    AI_MODEL: optionalValue,
    POLYGON_AMOY_RPC_URL: optionalValue,
    BLOCKCHAIN_PRIVATE_KEY: optionalValue,
    SANAD_CONTRACT_ADDRESS: optionalValue,
  })
  .superRefine((env, ctx) => {
    if (env.BLOCKCHAIN_MODE === "real")
      for (const key of [
        "POLYGON_AMOY_RPC_URL",
        "BLOCKCHAIN_PRIVATE_KEY",
        "SANAD_CONTRACT_ADDRESS",
      ] as const)
        if (!env[key])
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Required for real blockchain mode",
          });
  });
