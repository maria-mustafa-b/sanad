import { describe, it, expect } from "vitest";
import { analyzeExample, analysisSchema } from "../../lib/ai/analyze";
import { canonical, makeHash, newSalt } from "../../lib/credentials/crypto";
import { matchServices, seedServices } from "../../lib/services/catalog";
import type { Service } from "../../lib/services/catalog";
describe("untrusted analysis and record integrity", () => {
  it("recognizes code-switched phonetic job loss and unpaid wages without claiming issuer verification", () => {
    const result = analyzeExample(
      "Meri job chali gayi hai aur August ki salary bhi nahi mili.",
    );
    expect(result.facts).toEqual({
      employment_status: "lost_job",
      issue: "unpaid_wages",
      salary_period: "August",
    });
    expect(result.missing_information).toContain("employment_end_date");
    expect(result.languageSignals).toContain("Romanized South Asian language");
  });
  it("detects script signals and rejects malformed provider JSON", () => {
    expect(
      analyzeExample("راتب salary नहीं मिली मैंने job lost").languageSignals,
    ).toContain("Arabic/Urdu script");
    expect(
      analysisSchema.safeParse({
        intent: "test",
        confidence: 10,
        facts: {},
        languageSignals: [],
        missing_information: [],
        potential_categories: [],
      }).success,
    ).toBe(false);
  });
  it("canonicalizes object order, salts snapshots, and detects tampering", () => {
    const salt = newSalt(),
      record = { type: "employment", facts: { a: "one", b: "two" } };
    expect(canonical(record)).toBe(
      canonical({ facts: { b: "two", a: "one" }, type: "employment" }),
    );
    expect(makeHash(record, salt)).toMatch(/^0x[0-9a-f]{64}$/);
    expect(makeHash(record, salt)).not.toBe(
      makeHash({ ...record, facts: { a: "one", b: "altered" } }, salt),
    );
    expect(makeHash(record, salt)).not.toBe(makeHash(record, newSalt()));
  });
  it("retrieves only curated official source matches and labels relevance", () => {
    expect(seedServices.length).toBeGreaterThanOrEqual(20);
    expect(
      seedServices.every(
        (s) =>
          s.url.startsWith("https://") &&
          (s.url.includes("u.ae") || s.url.includes("mohre.gov.ae")),
      ),
    ).toBe(true);
    const services = seedServices.map((s, i) => ({
      id: String(i),
      created_at: "",
      updated_at: "",
      title: s.title,
      category: s.category,
      description: s.description,
      eligibility_guidance: "Potentially relevant",
      steps: [],
      keywords: [],
      supported_situations: [...s.situations],
      published: true,
      details: {
        kind: "official guidance",
        official_url: s.url,
        last_verified: "2026-09-25",
      },
    })) as Service[];
    const matches = matchServices(services, {
      employment_status: "lost_job",
      issue: "unpaid_wages",
    });
    expect(matches[0].relevance_score).toBeLessThanOrEqual(92);
    expect(matches.some((s) => s.title.includes("labour complaint"))).toBe(
      true,
    );
    expect(matches.every((s) => s.why.includes("confirmed situation"))).toBe(
      true,
    );
  });
});
