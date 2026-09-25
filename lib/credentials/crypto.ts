import { randomBytes, createHash } from "node:crypto";
import { z } from "zod";
export const factsSchema = z.record(
  z.string().min(1).max(80),
  z.string().min(1).max(300),
);
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export function makeHash(snapshot: unknown, salt: string) {
  return (
    "0x" +
    createHash("sha256")
      .update("SANAD:v1:")
      .update(salt)
      .update(":")
      .update(canonical(snapshot))
      .digest("hex")
  );
}
export function newSalt() {
  return randomBytes(32).toString("hex");
}
