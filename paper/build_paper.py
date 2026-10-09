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

TPL = "paper_template/Springer-Template.docx"
OUT = "SANAD_Research_Paper.docx"
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
para("email", "e-mail: {to be supplied by the authors}")

para("abstract", [
    ("Abstract.  ", {"bold": True}),
    ("The United Arab Emirates ranks among the world's leading digital governments, yet "
     "its largely expatriate resident population still faces three practical barriers when "
     "using public services: navigating services in more than one language, understanding "
     "which documents and eligibility rules apply, and producing trustworthy, privacy-safe "
     "records of unresolved complaints such as unpaid wages. We present SANAD, a prototype "
     "assistant that combines (i) a schema-constrained large-language-model front end that "
     "maps a free-text situation to services drawn exclusively from a curated catalogue of "
     "official UAE portals, (ii) an honest-degradation policy in which every AI output is "
     "labelled by source and sample fallbacks can never be issued as credentials, and "
     "(iii) a zero-personally-identifiable-information (zero-PII) verifiable-credential "
     "mechanism that anchors each confirmed claim to a salted SHA-256 digest recorded by an "
     "issuer-controlled smart contract on the Polygon Amoy testnet. The chain attests only "
     "to the existence and immutability of a record, never to the truth of its content - a "
     "distinction the design enforces in its user interface and in this paper. We describe "
     "the architecture, threat model and an automated validation suite (12 of 12 tests "
     "pass, including row-level-security isolation against a live PostgreSQL instance and "
     "contract-level checks for issuer-only access, duplicate rejection and revocation), "
     "and we report explicitly what is proven, what remains unverified, and the roadmap "
     "toward a production pilot.", {}),
])
para("abstract", [
    ("Keywords:  ", {"bold": True}),
    ("electronic government, verifiable credentials, blockchain, large language models, "
     "data minimisation, multilingual access, United Arab Emirates", {}),
])

# ================= 1 Introduction =================
h1("1   Introduction")
p1a("The United Arab Emirates consistently performs at the top of global digital-government "
    "assessments: the 2024 United Nations E-Government Survey places the UAE 11th worldwide on "
    "the E-Government Development Index with a score of 0.9533, and first in its e-Government "
    "Literacy sub-index " + "[1]" + " " + "[2]" + ". Availability of online services, however, is "
    "not the same as accessibility of outcomes. The UAE population is majority foreign-born "
    "(commonly cited at roughly 88%, an indicative figure), and residents routinely interact "
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
   "hallucinated services are structurally impossible in the matching path. (2) A zero-PII "
   "verifiable-credential mechanism: canonical serialisation, a 32-byte random salt and a "
   "domain-separated SHA-256 digest, anchored by an issuer-controlled Solidity registry, with "
   "verification that recomputes integrity off-chain and existence on-chain. (3) An "
   "honest-degradation policy for AI features - clearly labelled sample fallbacks at zero "
   "confidence that are blocked from credential issuance. (4) An automated validation suite, "
   "including row-level-security (RLS) tests against a live PostgreSQL instance, together with "
   "a published taxonomy of what is and is not yet proven (Sect. 6, Table 1).")
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
    "and later work surveyed blockchain approaches to credential management in education and "
    "beyond " + "[5]" + ". The W3C Verifiable Credentials Data Model gave the field a common "
    "representation for claims, proofs and subjects " + "[3]" + ". These systems typically put "
    "structured credential content - often including identifiers of the holder - into a signed "
    "artifact whose validity is checked against a ledger. SANAD takes the more restrictive "
    "route: no credential content is published at all. Only a digest computed over a "
    "canonicalised snapshot with a secret salt is recorded, so the ledger cannot be used to "
    "learn, correlate or enumerate anything about the holder.")
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
    "intake that is grounded by construction, and a trust artifact that is publishable without "
    "consent risk because it contains no personally identifiable information (PII). The PDPL "
    "principles of data minimisation and purpose limitation " + "[7]" + " guide the design: "
    "PII is confined to RLS-protected tables, and the public artifact is a hash.")

# ================= 3 Architecture =================
h1("3   System Architecture")
p1a("SANAD is a full-stack web application: a Next.js 16 (App Router) front end with "
    "TypeScript in strict mode, server route handlers as the only trusted API boundary, "
    "Supabase (PostgreSQL with row-level security and the @supabase/ssr session helper) for "
    "persistence, Gemini accessed through the Vercel AI SDK's generateObject call with a Zod "
    "schema, and ethers v6 for transaction signing against the SANADCredential contract on "
    "Polygon Amoy (chain ID 80002). Figure 1 shows the pipeline end to end.")

fp = doc.add_paragraph()
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
fp.add_run().add_picture(FIG, width=Cm(12.2))
para("figure legend", "Fig. 1.  End-to-end architecture. Personal data stays left of the "
     "dashed boundary in RLS-protected storage; only an opaque identifier and a 32-byte digest "
     "cross onto the testnet. The public verifier reads existence and revocation status, never "
     "content.")

pn("A session begins either with Supabase authentication or with a signed demo cookie "
   "(HMAC-SHA-256 over an identifier and expiry, httpOnly, SameSite=Lax). Every mutating route "
   "handler resolves the caller through a single actor() helper before touching data; "
   "unauthenticated requests receive 401 and the interface responds with an explicit "
   "sign-in prompt rather than silently showing another user's data. The user describes a "
   "situation in their own language; the AI layer extracts structured facts and matches the "
   "situation against the official-services catalogue; document analysis (e.g. a wage slip or "
   "contract photo) can attach evidence summaries; the user then confirms or edits the "
   "resulting claim statement. Only a confirmed claim is snapshotted, hashed and - in real "
   "mode - issued on-chain. The catalogue itself is data, not model memory: 28 curated entries, "
   "each linking to u.ae or mohre.gov.ae, with supported-situation tags used for deterministic "
   "pre-filtering before the model is consulted.")
pn("The interface ships with five hand-curated locales - English, Arabic (RTL), Hindi, Urdu "
   "(RTL) and Bengali - plus machine-translated coverage of additional resident languages via "
   "an in-page translator, so the intake path is usable without English proficiency.")

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
   "immutable, with issue, revoke and a free status view (Listing 1). Duplicate issuance for "
   "an identifier is rejected; revocation is one-way; the stored record hash is never "
   "overwritten, giving tamper-evidence against any later change of the off-chain snapshot.")

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
para("figure legend", "Listing 1.  Core of the deployed SANADCredential registry (Solidity ^0.8.24, MIT).")

h2("4.3   Verification Semantics and What They Do Not Prove")
p1a("Verification composes two independent checks. Integrity: recompute h from the stored "
   "snapshot and salt and compare with the stored record hash. Existence: read status(id) on "
   "the chain and confirm the returned hash matches, the timestamp is present and the revoked "
   "flag is false. A credential is VALID only if both hold. Crucially, the chain attests that "
   "a given digest existed at a given time and has not been altered - it cannot attest that "
   "the underlying statement about the world is true. SANAD encodes this limit in the product "
   "itself: verification pages and issuance dialogs state the distinction, and the paper "
   "throughout uses \u201cverifiable\u201d only in the cryptographic sense.")

# ================= 5 Grounded language layer =================
h1("5   Grounded Language Understanding and Honest Degradation")
p1a("Two AI endpoints carry user-visible risk: situation understanding (free text or voice "
   "transcript to structured facts and service matches) and document analysis (photo or PDF "
   "to extracted fields and risk flags). Both are schema-constrained: generateObject is given "
   "a Zod schema and a prompt that embeds the catalogue and forbids inventing services; "
   "returned identifiers are joined back to catalogue entries and any identifier not present "
   "in the catalogue is dropped before rendering. The user therefore only ever sees official, "
   "linkable services.")
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
   "test suite. At submission time the following evidence holds, and Table 1 records what each "
   "result does and does not support.")
pn("Static and build checks: TypeScript strict type-check passes; ESLint reports zero errors "
   "(ten warnings); next build completes for all 24 routes. Functional tests: the Vitest "
   "suite passes 12/12, including RLS isolation tests executed against a live PostgreSQL "
   "instance that assert one user cannot read or write another user's claims and credentials. "
   "Contract checks: local harnesses verify issuer-only issue and revoke, immutability of the "
   "stored hash, duplicate-issuance rejection and revocation semantics; a preflight against "
   "the Amoy testnet confirms the deployed ABI matches the client (issue(bytes32,bytes32), "
   "revoke(bytes32), status(bytes32)). Security review remediation: previously committed "
   "credentials were removed from the working tree and HEAD, unauthenticated claim reads were "
   "closed by enforcing actor() plus per-user filtering on every claims path, and fabricated "
   "AI fallbacks were replaced by the labelled-sample policy of Sect. 5. Secrets that had "
   "entered git history remain a rotation obligation, tracked as pending on the authors' side.")

# ---- Table 1 ----
para("table title", "Table 1.  Validation status at submission. Rows marked \u201cnot "
     "claimed\u201d are reported to bound the paper's claims, not to criticise them.")

rows = [
    ("Mechanism", "Evidence at submission", "Status"),
    ("Data isolation (RLS)", "12/12 Vitest incl. live-PostgreSQL isolation tests", "Proven (prototype)"),
    ("Registry semantics", "Issuer-only, duplicate-reject, one-way revoke, immutable hash", "Proven (tests + Amoy preflight)"),
    ("Catalogue authenticity", "28 entries, every URL on u.ae or mohre.gov.ae", "Proven URLs; freshness unverified"),
    ("AI grounding", "Schema-constrained IDs; non-catalogue IDs dropped", "Mechanism proven; accuracy not benchmarked"),
    ("Honest degradation", "503 without key; SAMPLE at confidence 0; issuance blocked", "Proven (code + UI)"),
    ("Factual truth of claims", "Chain attests existence/immutability only", "Not claimed"),
    ("Production operation", "Testnet only; key rotation pending", "Not claimed"),
    ("Resident usability", "No user study conducted", "Not claimed"),
]
tbl = doc.add_table(rows=len(rows), cols=3)
widths = [Cm(3.4), Cm(5.4), Cm(3.4)]
for ri, row in enumerate(rows):
    for ci, text in enumerate(row):
        cell = tbl.cell(ri, ci)
        cell.width = widths[ci]
        cp = cell.paragraphs[0]
        r = cp.add_run(text)
        r.font.size = Pt(8)
        if ri == 0:
            r.bold = True

def set_tbl_borders(t):
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
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
set_tbl_borders(tbl)
para("Normal", "")

# ================= 7 Limitations =================
h1("7   Limitations and Ethical Considerations")
p1a("We state the boundaries plainly. The chain layer runs on a public testnet with a single "
   "issuer key; production use requires mainnet deployment, key custody (HSM or multisig), and "
   "a revocation policy agreed with the institutions that would honour these anchors. The AI "
   "layer has no accuracy benchmark: grounding prevents invented services but cannot prevent "
   "a wrong catalogue match, and document extraction quality has not been measured on real, "
   "consented documents. The credential mechanism anchors user-confirmed statements; it adds "
   "no independent verification, and an adversary with the issuer key can anchor false "
   "statements - the immutable issuer address and public events make such abuse visible and "
   "attributable, not impossible. The demo mode's signed cookie is a hackathon convenience, "
   "not an identity system. Finally, the headline demographic figure used in outreach (about "
   "88% foreign-born) is indicative and cited as such; all product claims in this paper are "
   "bounded by Table 1.")
pn("Ethically, the design follows data minimisation by construction: PII remains in "
   "user-partitioned tables under RLS, nothing personal is sent to the blockchain or to the "
   "model provider beyond the transient document image used for extraction, and the "
   "honest-degradation policy exists specifically so that a demonstration can never be "
   "mistaken for an operational service. Accessibility (WCAG 2.2, RTL support) and the "
   "PDPL-aligned storage model are treated as functional requirements rather than polish.")

# ================= 8 Conclusion =================
h1("8   Conclusion")
p1a("SANAD shows that the three barriers residents face in using even a world-class "
   "e-government - language, evidence clarity and trust - can be attacked together by a small "
   "system whose core commitments are negative: the model never invents services, the chain "
   "never sees personal data, and the product never claims more than its proofs support. The "
   "prototype passes its automated validation suite, anchors digests on a public testnet, and "
   "ships an explicit proven/not-proven ledger as part of its public surface. Next steps are "
   "a 90-day innovation pilot with a government partner: consented usability testing with "
   "service-seekers, accuracy benchmarking of the grounded matcher, mainnet custody, and "
   "integration of an institutional verifier that can check anchors without access to the "
   "off-chain snapshot. We invite evaluation of the system by exactly the standard it sets "
   "for itself: every claim verifiable, and none overstated.")

# ================= References =================
h1("References")
refs = [
    "United Nations Department of Economic and Social Affairs: E-Government Survey 2024. United Nations, New York (2024)",
    "Government of the United Arab Emirates: United Arab Emirates - e-Government Development. u.ae, https://u.ae/en/about-the-uae/digital-uae (accessed 2026)",
    "World Wide Web Consortium: Verifiable Credentials Data Model 1.0 - W3C Recommendation. https://www.w3.org/TR/vc-data-model/ (2019)",
    "MIT Digital Currency Initiative: Blockcerts - An Open Standard for Blockchain-Verified Academic Credentials. https://www.blockcerts.org/ (2017)",
    "Bapat, P., et al.: Blockchain for Academic Credentials. arXiv:2006.12665 (2020)",
    "Sheth, R., et al.: Beyond Monolingual Assumptions: A Survey of Code-Switched NLP in the Era of Large Language Models across Modalities. arXiv:2510.07037 (2025)",
    "United Arab Emirates: Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and Privacy (2021)",
    "World Wide Web Consortium: Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/ (2023)",
    "Nakamoto, S.: Bitcoin: A Peer-to-Peer Electronic Cash System (2008)",
    "UAE Ministry of Human Resources and Emiratisation: Register labour complaints for private-sector employees. https://mohre.gov.ae/en/services/register-labor-complaints-private-sector-employees-2022 (accessed 2026)",
]
for i, text in enumerate(refs, 1):
    para("reference", "[%d]  %s" % (i, text))

doc.save(OUT)
print("saved", OUT)
