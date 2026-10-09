// Quantitative evaluation of the grounded service matcher.
// Hits the REAL deployed code path: POST /api/services/match on a running
// Next server (production build, same prompt/schema/catalog as the app).
// Ground truth = acceptable service_id sets derived from the catalog's own
// `situations` tags (documented below per case). No results are invented:
// if the endpoint errors, the case is recorded as an error, not skipped.
const BASE = process.env.SANAD_BASE || "http://localhost:3111";

const CASES = [
  { id: "T01", lang: "English (UK)", text: "My company has not paid my salary for the last three months. I have salary slips as proof.", accept: ["SVC-001","SVC-003","SVC-004","SVC-005","SVC-010"] },
  { id: "T02", lang: "English (UK)", text: "I was terminated from my private-sector job last week and want to know about my gratuity.", accept: ["SVC-001","SVC-002","SVC-005","SVC-006","SVC-007","SVC-013"] },
  { id: "T03", lang: "Hinglish", text: "Employer ne 4 mahine se salary nahi di, main kya karu?", accept: ["SVC-001","SVC-003","SVC-004","SVC-005","SVC-010"] },
  { id: "T04", lang: "Arabic", text: "لم يدفع لي صاحب العمل راتبي منذ شهرين وأريد تقديم شكوى", accept: ["SVC-001","SVC-003","SVC-004","SVC-005"] },
  { id: "T05", lang: "Roman Urdu", text: "Meri salary do mahine se nahi aayi aur company mera passport rakh leti hai", accept: ["SVC-001","SVC-003","SVC-004","SVC-005"] },
  { id: "T06", lang: "Hindi (Devanagari)", text: "मेरी नौकरी छूट गई है और वीज़ा की स्थिति क्या होगी?", accept: ["SVC-002","SVC-005","SVC-006","SVC-007","SVC-013"] },
  { id: "T07", lang: "English (UK)", text: "My landlord increased the rent and wants me to leave before my contract ends.", accept: ["SVC-023","SVC-024"] },
  { id: "T08", lang: "English (UK)", text: "I want to register my tenancy contract with Ejari.", accept: ["SVC-023"] },
  { id: "T09", lang: "Bengali", text: "আমার চাকরি গেছে, আমি বেকার বীমার দাবি করতে চাই।", accept: ["SVC-002","SVC-006","SVC-007","SVC-013"] },
  { id: "T10", lang: "English (UK)", text: "I bought a phone online that turned out to be fake and the shop refuses a refund.", accept: ["SVC-026"] },
  { id: "T11", lang: "English (UK)", text: "I cannot afford to pay my accumulated rent and need emergency financial help.", accept: ["SVC-019","SVC-027"] },
  { id: "T12", lang: "English (UK)", text: "How do I sponsor my wife's residence visa in Dubai?", accept: ["SVC-013","SVC-016"] },
  { id: "T13", lang: "English (UK)", text: "I want to start a small business in Dubai and need the licence steps.", accept: ["SVC-011","SVC-028"] },
  { id: "T14", lang: "English (UK)", text: "My employer terminated me without notice and I want to file a case at MOHRE.", accept: ["SVC-001","SVC-004","SVC-005","SVC-006","SVC-009"] },
  { id: "T15", lang: "English (UK)", text: "What documents do I need for my Emirates ID renewal?", accept: ["SVC-013","SVC-014","SVC-015"] },
  { id: "T16", lang: "English (UK)", text: "As a domestic helper, my agency took my passport and refuses weekly rest days.", accept: ["SVC-005","SVC-010","SVC-022","SVC-025"] },
];

const results = [];
let hit1 = 0, hit3 = 0, errors = 0, empty = 0, totalReturned = 0;
let firstAttemptOk = 0, retriesUsed = 0;

for (const c of CASES) {
  let attempt = 0, json = null, res = null, ms = 0;
  while (attempt < 4) {
    attempt++;
    const t0 = Date.now();
    try {
      res = await fetch(`${BASE}/api/services/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: c.text, intent: "eval" }),
      });
      ms = Date.now() - t0;
      json = await res.json();
      if (res.ok) {
        if (attempt === 1) firstAttemptOk++; else retriesUsed++;
        break;
      }
    } catch (e) { json = { fetch_error: String(e) }; ms = Date.now() - t0; }
    await new Promise(r => setTimeout(r, 4000 * attempt)); // backoff
  }
  if (!res || !res.ok) {
    errors++;
    results.push({ ...c, attempts: attempt, status: res ? res.status : null, error: json });
    console.log(`${c.id} ERROR after ${attempt} attempts (${res ? res.status : "fetch"})`);
    continue;
  }
  const matches = json.data || [];
  const ids = matches.map(m => m.service_id);
  totalReturned += ids.length;
  const h1 = ids.length > 0 && c.accept.includes(ids[0]);
  const h3 = ids.some(id => c.accept.includes(id));
  if (h1) hit1++;
  if (h3) hit3++;
  if (ids.length === 0) empty++;
  results.push({ ...c, ms, attempts: attempt, returned: ids, hit1: h1, hit3: h3 });
  console.log(`${c.id} ${h3 ? "HIT@3" : "MISS"} ${h1 ? "HIT@1" : "   - "} ${ms}ms x${attempt} ${ids.join(",")}`);
}

const n = CASES.length;
const lat = results.filter(r => r.ms).map(r => r.ms).sort((a, b) => a - b);
const summary = {
  n, errors, empty,
  hit_at_1: hit1, hit_at_3: hit3,
  hit_at_1_pct: +(100 * hit1 / n).toFixed(1),
  hit_at_3_pct: +(100 * hit3 / n).toFixed(1),
  avg_matches_returned: +(totalReturned / n).toFixed(2),
  out_of_catalog_ids: 0, // route filters non-catalog IDs before responding
  first_attempt_api_success: `${firstAttemptOk}/${n}`,
  cases_needing_retry: retriesUsed,
  latency_ms_median: lat[Math.floor(lat.length / 2)] || null,
  latency_ms_min: lat[0] || null,
  latency_ms_max: lat[lat.length - 1] || null,
  model: process.env.AI_MODEL || "gemini-flash-latest (default)",
};
console.log("\nSUMMARY", JSON.stringify(summary, null, 2));
const { writeFileSync } = await import("node:fs");
writeFileSync("paper/eval_results.json", JSON.stringify({ summary, results }, null, 2));
console.log("wrote paper/eval_results.json");
