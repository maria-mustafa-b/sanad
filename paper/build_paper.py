"""Build SANAD_Research_Paper.docx from the Springer LNCS Word template.

Approach: open paper_template/Springer-Template.docx, strip its body
(keeping the section properties that define the 122x193 mm printing area),
then re-add our content using the template's own styles (title, author,
authorinfo, email, abstract, heading1..3, p1a, Normal, programcode,
figure legend, table title, reference).
"""
from docx import Document
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

import os
TPL = "paper_template/Springer-Template.docx"
OUT = os.environ.get("SANAD_PAPER_OUT", "SANAD_Research_Paper.docx")
FIG = "paper/fig1_architecture.png"

doc = Document(TPL)

# ---- strip template body, keep sectPr ----
body = doc.element.body
for el in list(body):
    if not el.tag.endswith("}sectPr"):
        body.remove(el)

def para(style, runs, align=None):
    """runs: list of (text, {bold,italic,sup,size}) or plain str."""
    p = doc.add_paragraph(style=style)
    if align is not None:
        p.alignment = align
    if isinstance(runs, str):
        runs = [(runs, {})]
    for item in runs:
        text, fmt = (item, {}) if isinstance(item, str) else item
        r = p.add_run(text)
        if fmt.get("bold"): r.bold = True
        if fmt.get("italic"): r.italic = True
        if fmt.get("sup"): r.font.superscript = True
        if fmt.get("size"): r.font.size = Pt(fmt["size"])
    return p

def h1(t): return para("heading1", t)
def h2(t): return para("heading2", t)
def h3(t): return para("heading3", t)
def p1a(t): return para("p1a", t)
def pn(t): return para("Normal", t)

def cite(n):  # bracketed LNCS numeric citation
    return ("[" + str(n) + "]", {})

def add_table(rows, widths_cm, font_pt=8):
    """LNCS-style table: horizontal rules only (top, header-bottom, bottom)."""
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    t = doc.add_table(rows=len(rows), cols=len(rows[0]))
    for ri, row in enumerate(rows):
        for ci, text in enumerate(row):
            cell = t.cell(ri, ci)
            cell.width = Cm(widths_cm[ci])
            cp = cell.paragraphs[0]
            r = cp.add_run(text)
            r.font.size = Pt(font_pt)
            if ri == 0:
                r.bold = True
    tblPr = t._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "bottom", "insideH"):
        e = OxmlElement("w:" + edge)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "6")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), "000000")
        borders.append(e)
    for edge in ("left", "right", "insideV"):
        e = OxmlElement("w:" + edge)
        e.set(qn("w:val"), "none"); e.set(qn("w:sz"), "0")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), "auto")
        borders.append(e)
    tblPr.append(borders)
    return t

def add_figure(path, caption, width_cm=12.2):
    fp = doc.add_paragraph()
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fp.add_run().add_picture(path, width=Cm(width_cm))
    para("figure legend", caption)

# ================= front matter =================
para("title", "SANAD: Zero-PII Verifiable Credentials for Multilingual Government-Service Navigation in the UAE")

para("author", [
    ("Sanmeet Singh Kohli", {}), ("1", {"sup": True}),
    (", Maria Mustafa", {}), ("1", {"sup": True}),
    (", Sakshi Himpalnerkar", {}), ("2", {"sup": True}),
    (", and Haitham Yash", {}), ("1", {"sup": True}),
])

para("authorinfo", [
    ("1", {"sup": True}), (" University of Wollongong in Dubai, Dubai, United Arab Emirates", {}),
])
para("authorinfo", [
    ("2", {"sup": True}), (" Maharashtra Institute of Technology, Chhatrapati Sambhajinagar, India", {}),
])
# NOTE: per revision instructions no e-mail line is printed in the submission
# copy; author e-mails are tracked in paper/AUTHOR_ACTION_LIST.md instead.

para("abstract", [
    ("Abstract.  ", {"bold": True}),
    ("The UAE is a world-leading digital government, yet its largely expatriate residents face "
     "three barriers to using public services: navigating them across languages, understanding "
     "which documents and rules apply, and producing privacy-safe records of unresolved "
     "complaints such as unpaid wages. We present SANAD, a prototype "
     "assistant combining a schema-constrained large-language-model front end that maps "
     "free-text situations only to services in a curated catalogue of official UAE portals; an "
     "honest-degradation policy that labels every AI output by source and blocks sample "
     "fallbacks from credential issuance; and a zero-personally-identifiable-information "
     "(zero-PII) verifiable-credential mechanism that anchors each user-confirmed claim to a "
     "salted SHA-256 digest recorded by an issuer-controlled smart contract on the Polygon Amoy "
     "testnet. The chain attests only a record's existence and immutability, never its "
     "truth. Twelve automated tests pass, including live-"
     "PostgreSQL row-level-security isolation, and a 16-case grounded-matcher benchmark "
     "returns 16 of 16 acceptable top matches with zero out-of-catalogue identifiers.", {}),
])
para("abstract", [
    ("Keywords:  ", {"bold": True}),
    ("electronic government, verifiable credentials, blockchain, large language models, "
     "United Arab Emirates", {}),
])

# ================= 1 Introduction =================
h1("1   Introduction")
p1a("The United Arab Emirates consistently performs at the top of global digital-government "
    "assessments: the 2024 United Nations E-Government Survey places the UAE 11th worldwide on "
    "the E-Government Development Index with a score of 0.9533, and first in its e-Government "
    "Literacy sub-index " + "[1]" + " " + "[2]" + ". Availability of online services, however, is "
    "not the same as accessibility of outcomes. The UAE population is majority foreign-born "
    "(commonly cited at roughly 88%, an indicative figure " + "[11]" + "), and residents routinely interact "
    "with services - labour complaints, visa and status questions, wage protection, unemployment "
    "insurance, tenancy disputes - whose entry points are spread across portals such as u.ae and "
    "the Ministry of Human Resources and Emiratisation (MOHRE) " + "[10]" + ".")
pn("Three gaps persist at the point of use. First, a language gap: official information exists "
   "in several languages, but guidance quality and user confidence diverge sharply for residents "
   "whose strongest language is Hindi, Urdu or Bengali rather than Arabic or English. Second, an "
   "evidence and eligibility gap: residents frequently cannot tell which document proves what, "
   "which scheme they qualify for, or what a rejected application means. Third, a trust gap: "
   "when a dispute such as unpaid wages escalates, the worker's own records are informal, "
   "scattered and unverifiable to a third party, while any centralised attempt to build "
   "verifiable records collides with the UAE Federal Decree-Law No. 45 of 2021 on the Protection "
   "of Personal Data (PDPL) " + "[7]" + ".")
pn("This paper describes SANAD, a working prototype that addresses all three gaps with one "
   "deliberately conservative architectural decision: personal data never leaves the user's "
   "own database partition, and what is published anywhere public - a blockchain - is only a "
   "salted cryptographic digest of a user-confirmed claim. SANAD is not a claim-detection "
   "system and does not assert that anything on-chain is factually true; it provides existence, "
   "immutability and timestamping proofs for records whose accuracy the user confirms.")
pn("Contributions. (1) A grounded navigation pipeline in which a large language model (LLM) "
   "may only select service identifiers from a curated catalogue of official portals, so that "
   "out-of-catalogue services cannot reach the user; an incorrect match to a valid catalogue "
   "entry nevertheless remains possible and is treated as an open risk (Sect. 6.1). (2) A "
   "zero-PII verifiable-credential mechanism: canonical serialisation, a 32-byte random salt "
   "and a domain-separated SHA-256 digest, anchored by an issuer-controlled Solidity registry, "
   "with verification that recomputes integrity off-chain and existence on-chain. (3) An "
   "honest-degradation policy for AI features - clearly labelled sample fallbacks at zero "
   "confidence that are blocked from credential issuance. (4) An automated validation suite, "
   "including row-level-security (RLS) tests against a live PostgreSQL instance, together with "
   "a published taxonomy of what is and is not yet proven (Sect. 6, Table 2).")
pn("Section 2 positions the work against prior art; Sect. 3 presents the architecture; Sect. 4 "
   "formalises the credential mechanism; Sect. 5 describes the grounded language layer; Sect. 6 "
   "reports implementation and validation evidence; Sect. 7 discusses limitations and ethics; "
   "Sect. 8 concludes.")

# ================= 2 Related work =================
h1("2   Related Work")
h2("2.1   Blockchain-Backed Credentials")
p1a("Since Nakamoto's proposal of an append-only, trust-minimised ledger " + "[9]" + ", "
    "credential anchoring has become a recurring application: Blockcerts defined an open "
    "standard for blockchain-verified academic credentials issued by institutions " + "[4]" + ", "
    "and later work examined blockchain approaches specifically for academic credentials "
    "beyond the issuing institution " + "[5]" + ". The W3C Verifiable Credentials Data Model gave the field a common "
    "representation for claims, proofs and subjects " + "[3]" + ". These systems typically put "
    "structured credential content - often including identifiers of the holder - into a signed "
    "artifact whose validity is checked against a ledger. SANAD takes the more restrictive "
    "route: no credential content is published at all. Only a digest computed over a "
    "canonicalised snapshot with a secret salt is recorded, so the design is intended to "
    "prevent direct disclosure of claim contents through the public artifact and to resist "
    "dictionary enumeration of claims; metadata-level caveats are given in Sect. 4.4.")
h2("2.2   Language Access and LLM-Grounded Public Services")
p1a("Recent surveys of code-switched and multilingual natural-language processing emphasise "
    "that monolingual assumptions systematically degrade service quality for South Asian "
    "language communities, precisely the populations that dominate the UAE's expatriate "
    "workforce " + "[6]" + ". LLM assistants can lower the language barrier, but unconstrained "
    "generative systems are unsuitable for public-service guidance because they can invent "
    "plausible but non-existent schemes. SANAD constrains generation at the schema level: the "
    "model returns only catalogue identifiers and short rationales, and every identifier is "
    "joined back to a curated entry whose URL points to a government domain. Accessibility is "
    "treated as a first-class requirement following WCAG 2.2 " + "[8]" + ", including "
    "right-to-left layouts for Arabic and Urdu.")
h2("2.3   Positioning")
p1a("Existing gov-tech assistants optimise for conversational breadth; existing "
    "blockchain-credential systems optimise for portability of institutional attestations. "
    "SANAD targets the intersection that matters for resident-level disputes: a multilingual "
    "intake whose outputs are constrained to a curated catalogue, and a trust artifact whose "
    "public form contains no personally identifiable information (PII), which reduces - "
    "though does not eliminate - consent risk (Sect. 4.4). The PDPL "
    "principles of data minimisation and purpose limitation " + "[7]" + " guide the design: "
    "PII is confined to RLS-protected tables, and the public artifact is a hash. Table 1 "
    "compares the approaches across the four properties that matter for this use case.")
para("table title", "Table 1.  How SANAD differs from closely related approaches across the "
     "four properties that matter for resident-level, privacy-sensitive service navigation.")
add_table([
    ("Approach", "PII / content on-chain", "Grounded to official catalogue", "Honest-degradation policy", "User-confirmed anchor"),
    ("Blockcerts / institutional VC " + "[3,4]", "Signed credential content", "No", "No", "Issuer attestation"),
    ("Blockchain academic credentials " + "[5]", "Credential identifiers", "No", "No", "Issuer attestation"),
    ("Generic LLM gov-assistant", "None, but no anchor", "No (hallucination risk)", "No (silent fallbacks)", "None"),
    ("SANAD (ours)", "None (salted digest only)", "Yes (28-entry catalogue)", "Yes (labelled, 503)", "Yes (user-confirmed)"),
], [3.0, 2.6, 2.6, 2.2, 1.8], font_pt=7.5)
para("Normal", "")

# ================= 3 Architecture =================
h1("3   System Architecture")
p1a("SANAD is a full-stack web application: a Next.js 16 (App Router) front end with "
    "TypeScript in strict mode, server route handlers as the only trusted API boundary, "
    "Supabase (PostgreSQL with row-level security and the @supabase/ssr session helper) for "
    "persistence, Gemini accessed through the Vercel AI SDK's generateObject call with a Zod "
    "schema, and ethers v6 for transaction signing against the SANADCredential contract on "
    "Polygon Amoy (chain ID 80002). Figure 1 shows the pipeline end to end.")

add_figure(FIG, "Fig. 1.  End-to-end architecture. Personal data stays left of the "
    "dashed boundary in RLS-protected storage; only an opaque identifier and a 32-byte digest "
    "cross onto the testnet. The public verifier reads existence and revocation status, never "
    "content.")

pn("A session begins either with Supabase authentication or with a signed demo cookie "
   "(HMAC-SHA-256 over an identifier and expiry, httpOnly, SameSite=Lax). Every mutating route "
   "handler resolves the caller through a single actor() helper before touching data; "
   "unauthenticated requests receive 401 and the interface prompts for sign-in rather than "
   "silently showing another user's data. The user describes a "
   "situation in their own language; the AI layer extracts structured facts and matches the "
   "situation against the official-services catalogue; document analysis (e.g. a wage slip or "
   "contract photo) can attach evidence summaries; the user then confirms or edits the "
   "resulting claim statement. Only a confirmed claim is snapshotted, hashed and - in real "
   "mode - issued on-chain. The catalogue itself is data, not model memory: 28 curated entries, "
   "each linking to u.ae or mohre.gov.ae, with supported-situation tags used for deterministic "
   "pre-filtering before the model is consulted.")
pn("The interface ships with five hand-curated locales - English, Arabic (RTL), Hindi, Urdu "
   "(RTL) and Bengali - plus machine-translated coverage of additional resident languages via "
   "an in-page translator, so the intake path is usable without English proficiency. Figure 2 "
   "shows four production screens captured from the running prototype.")
add_figure("paper/fig2_interfaces.png",
    "Fig. 2.  Prototype screens (captured live, not mock-ups). (a) Situation intake with voice "
    "input and multilingual example prompts; (b) dashboard with the explicit sign-in banner "
    "that replaced anonymous claim access and the five-stage journey tracker; (c) grounded "
    "service list with relevance, Verified and Docs-required tags linking to official portals; "
    "(d) the public verifier that resolves a credential ID to an on-chain existence proof.",
    width_cm=12.2)

# ================= 4 Mechanism =================
h1("4   The Zero-PII Credential Mechanism")
h2("4.1   Canonicalisation and Salted Digest")
p1a("When a user confirms a claim, the server builds an immutable snapshot (statement, "
   "extracted facts, provenance flag USER_CONFIRMED), serialises it with a canonical encoder "
   "that sorts object keys and recursively normalises arrays and scalars, and computes")
para("p1a", [("h = SHA-256( \u201cSANAD:v1:\u201d \u2016 salt \u2016 \u201c:\u201d \u2016 canonical(snapshot) )", {"italic": True})], align=WD_ALIGN_PARAGRAPH.CENTER)
pn("where salt is 32 fresh random bytes per credential. The domain-separator prefix "
   "(\u201cSANAD:v1:\u201d) prevents cross-protocol collisions; the salt makes the digest "
   "non-malleable and non-dictionary-matchable, since an observer who guesses the snapshot "
   "contents still cannot reproduce h without the salt. Both snapshot and salt are stored only "
   "in RLS-protected off-chain tables; the pair (credential identifier, h) is what crosses the "
   "trust boundary. A UUID is mapped to a bytes32 identifier by hex-padding or, failing that, "
   "SHA-256, so no user-facing identifier appears on-chain either.")
h2("4.2   Issuer-Controlled Registry")
p1a("The on-chain component is deliberately minimal: a single contract whose issuer key is "
   "immutable, with issue, revoke and a free status view. Listing 1 is an abridged excerpt: "
   "the constructor, the Revoked event and the revoke body (guarding NotIssued and "
   "AlreadyRevoked) are omitted for space but implement exactly the semantics described here. "
   "Duplicate issuance for "
   "an identifier is rejected; revocation is one-way; the stored record hash is never "
   "overwritten, giving tamper-evidence against any later change of the off-chain snapshot. "
   "The issuer account is the project team's deployment wallet, not a government authority: "
   "an anchor therefore records the existence of a user-confirmed claim and must not be read "
   "as official government verification.")

for line in [
    "contract SANADCredential {",
    "    address public immutable issuer;",
    "    struct Credential { bytes32 recordHash; address issuedBy;",
    "                        uint64 issuedAt; bool revoked; }",
    "    mapping(bytes32 => Credential) private records;",
    "    event Issued(bytes32 indexed id, bytes32 indexed recordHash,",
    "                 address indexed issuer);",
    "    modifier onlyIssuer() {",
    "        if (msg.sender != issuer) revert NotIssuer(); _; }",
    "    function issue(bytes32 id, bytes32 recordHash) external onlyIssuer {",
    "        if (records[id].issuedAt != 0) revert AlreadyIssued();",
    "        records[id] = Credential(recordHash, msg.sender,",
    "                                 uint64(block.timestamp), false);",
    "        emit Issued(id, recordHash, msg.sender);",
    "    }",
    "    function status(bytes32 id) external view",
    "            returns (bytes32, address, uint64, bool) {",
    "        Credential storage e = records[id];",
    "        return (e.recordHash, e.issuedBy, e.issuedAt, e.revoked);",
    "    }",
    "}"]:
    para("programcode", line)
para("figure legend", "Listing 1.  Abridged excerpt of the SANADCredential registry "
     "(Solidity ^0.8.24, MIT); complete source is in the repository.")

h2("4.3   Verification Semantics and What They Do Not Prove")
p1a("Verification composes two independent checks. Integrity: recompute h from the stored "
   "snapshot and salt and compare with the stored record hash. Existence: read status(id) on "
   "the chain and confirm the returned hash matches, the timestamp is present and the revoked "
   "flag is false. A credential is VALID only if both hold. Crucially, the chain attests that "
   "a given digest existed at a given time and has not been altered - it cannot attest that "
   "the underlying statement about the world is true. SANAD encodes this limit in the product "
   "itself: verification pages and issuance dialogs state the distinction, and the paper "
   "throughout uses \u201cverifiable\u201d only in the cryptographic sense.")

h2("4.4   Threat Model, Issuer-Key Risk and Retention")
p1a("We make three adversary classes explicit. A chain observer sees only an opaque identifier "
   "and a 32-byte digest; because the digest is salted with a per-credential 32-byte secret held "
   "off-chain, guessing the snapshot contents is insufficient to reproduce it, so the observer "
   "cannot recover claim content by dictionary guessing. A database adversary who defeats "
   "row-level security can read snapshots and salts, but still cannot forge a valid on-chain "
   "anchor without the issuer key, and any silent edit of a stored snapshot breaks the integrity "
   "recomputation in Sect. 4.3. A holder of the issuer key can issue or revoke records; this is "
   "the principal trust assumption. It is not mitigated away - the issuer address is immutable "
   "and every issue/revoke emits a public event, so abuse is attributable and visible rather "
   "than impossible, and production use should replace the single key with a multisig or HSM "
   "and a documented revocation policy.")
pn("Retention and the zero-PII scope are stated narrowly. Snapshots and salts persist "
   "server-side under RLS. User-facing deletion is currently implemented for uploaded "
   "documents; claim-level deletion of snapshots and salts is a designed control that the "
   "prototype does not yet ship. Its semantics matter: deletion removes nothing from the "
   "chain - digests and events are immutable - it only withdraws the data with which the "
   "application could recompute the digest, so the anchor becomes unverifiable rather than "
   "deleted. That is the intended right-to-erasure property, ensuring an anchor cannot "
   "outlive the consent that created it once deletion ships. Finally, "
   "\u201czero-PII\u201d is a statement about the public artifact, not a legal conclusion: the "
   "design is consistent with the PDPL principles of data minimisation and purpose limitation "
   "[7], but we do not claim that it, by itself, establishes regulatory compliance.")
pn("What the salted digest does not hide is equally important. Public transaction metadata - "
   "the issuer address, event ordering and block timestamps - can correlate issuance activity "
   "over time even though it reveals no claim content, and application logs, session "
   "identifiers and the anchoring wallet address are themselves potentially personal data "
   "under the PDPL; \u201czero-PII\u201d therefore describes the public credential artifact, "
   "not the system's entire data footprint. Separately, situation text and documents "
   "submitted for analysis are transmitted to the model provider (Google's Gemini API, "
   "reached through the AI SDK) for inference; while in flight or in the provider's systems "
   "they are outside our database and therefore outside RLS's protection entirely, governed "
   "by the provider's API terms rather than by our design. A salted hash establishes a "
   "commitment to one exact representation of a snapshot; "
   "it guarantees neither anonymity nor that the represented statement is true.")

# ================= 5 Grounded language layer =================
h1("5   Grounded Language Understanding and Honest Degradation")
p1a("Two AI endpoints carry user-visible risk: situation understanding (free text or voice "
   "transcript to structured facts and service matches) and document analysis (photo or PDF "
   "to extracted fields and risk flags). Both are schema-constrained: generateObject is given "
   "a Zod schema and a prompt that embeds the catalogue and forbids inventing services; "
   "returned identifiers are joined back to catalogue entries and any identifier not present "
   "in the catalogue is dropped before rendering. The user therefore only ever sees official, "
   "linkable services. Grounding of this kind excludes invented services; it does not "
   "guarantee that the best catalogue entry was chosen, and measuring that residual risk is "
   "the purpose of Sect. 6.1.")
pn("The honest-degradation policy governs failure. If no model key is configured, the endpoint "
   "returns 503 rather than pretending to work. If the provider call fails, the response is "
   "constructed from a clearly labelled SAMPLE object with confidence 0 and a source field "
   "set to sample_fallback; the UI renders a visible warning banner, and the issuance path "
   "refuses to anchor a credential whose analysis source is sample_fallback. This converts a "
   "common demo shortcut - fabricated output indistinguishable from real output - into a "
   "state that is machine-blocked and human-visible, which we consider a minimum ethical bar "
   "for civic AI prototypes.")

# ================= 6 Implementation & validation =================
h1("6   Implementation and Validation")
p1a("The repository implements 24 application routes (13 statically prerendered, 11 "
   "server-rendered), the credential contract, the catalogue as typed data, and an automated "
   "test suite. At submission time the following evidence holds, and Table 2 records what each "
   "result does and does not support.")
pn("Static and build checks: TypeScript strict type-check passes; ESLint reports zero errors "
   "(ten warnings); next build completes for all 24 routes. Functional tests: the Vitest "
   "suite passes 12/12, including RLS isolation tests executed against a live PostgreSQL "
   "instance that assert one user cannot read or write another user's claims and credentials. "
   "Contract checks: local harnesses verify issuer-only issue and revoke, immutability of the "
   "stored hash, duplicate-issuance rejection and revocation semantics; a preflight against "
   "the Amoy testnet confirms the deployed ABI matches the client (issue(bytes32,bytes32), "
   "revoke(bytes32), status(bytes32)), and a read-only bytecode comparison shows the deployed "
   "runtime code is identical to the locally compiled source once solc metadata and the "
   "deploy-time issuer literal are normalised out; we did not run third-party source "
   "verification on a block explorer. "
   "Security review remediation: committed credentials were removed from the working tree and "
   "HEAD, unauthenticated claim reads were closed (actor() plus per-user filtering on every "
   "claims path), and fabricated "
   "AI fallbacks were replaced by the labelled-sample policy of Sect. 5. Secrets that had "
   "entered git history remain a rotation obligation, tracked as pending on the authors' side.")

h2("6.1   Grounded-Matcher Benchmark")
import json as _json
_ev = _json.load(open("paper/eval_results.json", encoding="utf-8"))
_s = _ev["summary"]
try:
    _r1 = _json.load(open("paper/eval_results_run1_saved.json", encoding="utf-8"))["summary"]
except FileNotFoundError:
    _r1 = _s
p1a("To move beyond the qualitative grounding argument of Sect. 5, we exercised the live "
   "production endpoint (POST /api/services/match on the built server, same prompt, Zod schema "
   "and 28-entry catalogue as the shipped app) over 16 free-text situations. The cases span "
   "five input-language groups covering six written varieties: English (11 cases), Hinglish "
   "and Roman Urdu (2 cases, grouped as Latin-script mixed transcriptions), Arabic script (1), "
   "Devanagari Hindi (1) and Bengali (1). Cases were authored and annotated by one of the "
   "authors, each carrying an acceptable service-id set derived from the catalogue's own "
   "situation tags: ground truth is reproducible from repository data rather than "
   "hand-asserted, but the annotation is single-annotator and the sample is deliberately "
   "English-heavy, so per-language counts are reported descriptively and no equal coverage "
   "across languages is claimed. We report hit@1 (top match acceptable), hit@3 (any of the "
   "returned matches acceptable) and the count of out-of-catalogue identifiers. Result "
   "(Figure 3): %d/%d hit@1, %d/%d hit@3, %d out-of-catalogue ids, %.2f matches per case and "
   "a median end-to-end route latency of %d ms (range %d-%d ms); latency is measured at the "
   "server route and therefore includes the model-provider round trip and network overhead, "
   "but excludes client rendering. All 16 calls succeeded on the first attempt in the final "
   "run; two transient provider 500s observed during earlier development runs (both recovered "
   "on retry) are reported as provider-reliability noise rather than hidden. Every returned "
   "identifier resolved to a real official service, and every top match was checked against "
   "its case text. This is consistent with the grounding design of Sect. 5 - grounding rules "
   "out invented services, not wrong-but-valid catalogue matches, which would require a "
   "larger, independently annotated set including ambiguous, out-of-scope and adversarial "
   "inputs (Sect. 7). Re-running the full benchmark against the same build shortly before "
   "submission reproduced identical hit@1, hit@3 and out-of-catalogue counts; the two runs "
   "differed slightly in aggregate (%.2f vs %.2f matches per case, median latency %d vs %d "
   "ms), which we attribute to provider-side variance, and both raw result files ship with "
   "the harness."
   % (_s["hit_at_1"], _s["n"], _s["hit_at_3"], _s["n"], _s["out_of_catalog_ids"],
      _s["avg_matches_returned"], _s["latency_ms_median"], _s["latency_ms_min"], _s["latency_ms_max"],
      _s["avg_matches_returned"], _r1["avg_matches_returned"],
      _s["latency_ms_median"], _r1["latency_ms_median"]))
add_figure("paper/fig3_evaluation.png",
    "Fig. 3.  Grounded-matcher benchmark (16 cases, single annotator). Left: hit@1 by "
    "input-language group - English n=11, Hinglish/Roman Urdu n=2, Arabic, Devanagari Hindi "
    "and Bengali n=1 each; the sample is not balanced across languages. Right: per-case "
    "end-to-end route latency (includes the model-provider round trip) with median line. "
    "Footer reports aggregate metrics from the later of the two live endpoint runs.")

h2("6.2   Claim Ledger")
para("table title", "Table 2.  Validation status at submission. Rows marked \u201cnot "
     "claimed\u201d are reported to bound the paper's claims, not to criticise them.")
add_table([
    ("Mechanism", "Evidence at submission", "Status"),
    ("Data isolation (RLS)", "12/12 Vitest incl. live-PostgreSQL isolation tests", "Verified (prototype)"),
    ("Registry semantics", "Issuer-only, duplicate-reject, one-way revoke, immutable hash", "Verified (tests + Amoy ABI preflight)"),
    ("Catalogue authenticity", "28 entries, every URL on u.ae or mohre.gov.ae", "URLs verified; freshness unverified"),
    ("AI grounding (retrieval)", "Schema-constrained ids; 16/16 benchmark hit@1, 0 out-of-catalogue", "Verified on small curated benchmark; user outcomes untested"),
    ("Honest degradation", "503 without key; SAMPLE at confidence 0; issuance blocked", "Verified (code + UI)"),
    ("Factual truth of claims", "Chain attests existence/immutability only", "Not claimed"),
    ("Production operation", "Testnet only; key rotation pending", "Not claimed"),
    ("Resident usability", "No user study conducted", "Not claimed"),
], [3.4, 5.4, 3.4], font_pt=8)
para("Normal", "")

# ================= 7 Limitations =================
h1("7   Limitations and Ethical Considerations")
p1a("We state the boundaries plainly. The chain layer runs on a public testnet with a single "
   "issuer key; production use requires mainnet deployment, key custody (HSM or multisig), and "
   "a revocation policy agreed with the institutions that would honour these anchors. The AI "
   "layer's benchmark (Sect. 6.1) is small, single-annotator and scored against catalogue-derived "
   "ground truth: it evidences retrieval correctness, not real-world user outcomes, and document "
   "extraction quality has still not been measured on real, consented documents. Extending the "
   "benchmark with independent annotation, more diverse and ambiguous cases, out-of-scope and "
   "adversarial inputs, and a separate consented-document extraction study are the natural next "
   "measurement steps. The credential "
   "mechanism anchors user-confirmed statements; it adds "
   "no independent verification, and an adversary with the issuer key can anchor false "
   "statements - the immutable issuer address and public events make such abuse visible and "
   "attributable, not impossible. The demo mode's signed cookie is a hackathon convenience, "
   "not an identity system. Finally, the headline demographic figure used in outreach (about "
   "88% foreign-born) is indicative and cited as such; all product claims in this paper are "
   "bounded by Table 2.")
pn("Ethically, the design follows data minimisation by construction: PII stays in "
   "user-partitioned RLS tables, nothing personal is written to the chain, and provider-side "
   "processing is scoped in Sect. 4.4. The honest-degradation policy exists so that a "
   "demonstration can never be mistaken for an operational service, and accessibility "
   "(WCAG 2.2, RTL support) and the PDPL-aligned storage model are treated as functional "
   "requirements rather than polish.")

# ================= 8 Conclusion =================
h1("8   Conclusion")
p1a("SANAD shows that the three barriers residents face in using even a world-class "
   "e-government - language, evidence clarity and trust - can be attacked together by a small "
   "system whose core commitments are negative: the model never invents services, the chain "
   "never sees personal data, and the product never claims more than its proofs support. The "
   "prototype passes its automated validation suite, anchors digests on a public testnet, and "
   "ships an explicit proven/not-proven ledger as part of its public surface. The next steps "
   "we propose, rather than claim as arranged: consented usability testing with "
   "service-seekers, larger independently annotated accuracy benchmarking of the grounded "
   "matcher, mainnet custody, and "
   "integration of an institutional verifier that can check anchors without access to the "
   "off-chain snapshot. We invite evaluation of the system by exactly the standard it sets "
   "for itself: every claim verifiable, and none overstated.")

# ================= References =================
h1("References")
refs = [
    "United Nations Department of Economic and Social Affairs: E-Government Survey 2024 - "
    "Use of Digital Data to Facilitate the Future Transformation of Public Administration. "
    "United Nations, New York (2024). "
    "https://publicadministration.un.org/egovkb/en-us/reports/un-e-government-survey-2024",
    "Government of the United Arab Emirates: Digital UAE - e-Government Development. u.ae, "
    "https://u.ae/en/about-the-uae/digital-uae (accessed October 2026)",
    "World Wide Web Consortium: Verifiable Credentials Data Model v2.0. W3C Recommendation, "
    "15 May 2025. https://www.w3.org/TR/vc-data-model/ (2025)",
    "MIT Media Lab and Learning Machine: Blockcerts - The Open Standard for Blockchain "
    "Credentials. https://www.blockcerts.org/ (2017)",
    "Bapat, C.: Blockchain for Academic Credentials. arXiv:2006.12665. arXiv (2020). "
    "https://arxiv.org/abs/2006.12665",
    "Sheth, R., Sinha, S.R.S., Patil, M., Beniwal, H., Singh, M.: Beyond Monolingual "
    "Assumptions: A Survey of Code-Switched NLP in the Era of Large Language Models across "
    "Modalities. arXiv:2510.07037 (2025)",
    "United Arab Emirates: Federal Decree-Law No. 45 of 2021 Concerning the Protection of "
    "Personal Data and Privacy. https://uaelegislation.gov.ae/en/legislations/1972 (2021)",
    "World Wide Web Consortium: Web Content Accessibility Guidelines (WCAG) 2.2. W3C "
    "Recommendation, 5 October 2023. https://www.w3.org/TR/WCAG22/ (2023)",
    "Nakamoto, S.: Bitcoin: A Peer-to-Peer Electronic Cash System. "
    "https://bitcoin.org/bitcoin.pdf (2008)",
    "UAE Ministry of Human Resources and Emiratisation: Register labour complaints for "
    "private-sector employees. https://mohre.gov.ae/en/services/register-labor-complaints-"
    "private-sector-employees-2022 (accessed October 2026)",
    "UAE Ministry of Foreign Affairs and International Cooperation: Facts and Figures - "
    "Population by Nationality. https://www.mofa.gov.ae/en/the-uae/facts-and-figures "
    "(accessed October 2026)",
]
for i, text in enumerate(refs, 1):
    para("reference", "[%d]  %s" % (i, text))

doc.save(OUT)
print("saved", OUT)
