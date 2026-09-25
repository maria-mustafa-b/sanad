"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, LoaderCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibleStatusAnnouncer } from "@/components/accessibility/accessible-status-announcer";
import { api, label, type Item } from "./api";

type Analysis = {
  analysis: {
    intent: string;
    confidence: number;
    languageSignals: string[];
    facts: Record<string, string>;
    missing_information: string[];
    potential_categories: string[];
  };
  method: "provider" | "demo_rules";
};
type Match = Item & {
  title: string;
  category: string;
  relevance_score: number;
  why: string;
  description: string;
  details: { official_url: string; kind: string };
};
const sample = "Meri job chali gayi hai aur August ki salary bhi nahi mili.";
export function SituationFlow() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [facts, setFacts] = useState<Record<string, string>>({});
  const [claim, setClaim] = useState<Item | null>(null);
  const [credential, setCredential] = useState<Item | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [application, setApplication] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [voiceSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  });
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      queueMicrotask(() => {
        setText(sample);
      });
    }
  }, []);
  async function work<T>(
    message: string,
    action: () => Promise<T>,
    done: (value: T) => void,
  ) {
    setBusy(message);
    setError("");
    setNotice(message);
    try {
      const result = await action();
      done(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
      setNotice("Action failed. You can retry.");
    } finally {
      setBusy("");
    }
  }
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<unknown>(null);

  function listen() {
    if (isListening) {
      (recognitionRef.current as { stop?: () => void })?.stop?.();
      setIsListening(false);
      setNotice("Recording stopped.");
      return;
    }

    type RecognitionInstance = {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult:
        | ((event: {
            results: ArrayLike<ArrayLike<{ transcript: string }>>;
          }) => void)
        | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    const browser = window as typeof window & {
      SpeechRecognition?: new () => RecognitionInstance;
      webkitSpeechRecognition?: new () => RecognitionInstance;
    };
    const Construct =
      browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Construct) return;
    const recognition = new Construct();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      let finalTranscript = "";
      for (let i = 0; i < e.results.length; i++) {
        finalTranscript += e.results[i][0].transcript + " ";
      }
      if (finalTranscript) {
        setText(finalTranscript);
        setNotice("Listening... Speech transcript updated.");
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError("Speech recognition failed or permission denied. You can type instead.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setNotice("Listening... Speak now.");
  }
  return (
    <div className="flow-stack">
      <section
        className="form-card flow-panel"
        aria-labelledby="situation-title"
      >
        <div className="step-number">01 · Explain</div>
        <h2 id="situation-title">What happened?</h2>
        <label htmlFor="situation-input">
          Describe the situation in your own words
        </label>
        <p id="situation-help">
          Mixed languages and phonetic spelling are welcome. Use fictional
          information in demo mode.
        </p>
        <textarea
          id="situation-input"
          aria-describedby="situation-help"
          dir="auto"
          rows={4}
          maxLength={4000}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="For example: Meri job chali gayi hai aur August ki salary bhi nahi mili."
        />
        <div className="actions">
          <Button
            type="button"
            onClick={() =>
              work(
                "Understanding your situation...",
                () => api<Analysis>("ai/analyze", "POST", { text }),
                (value) => {
                  setAnalysis(value);
                  setFacts(value.analysis.facts);
                  setNotice("Analysis ready. Review and edit the facts below.");
                },
              )
            }
            disabled={busy !== "" || text.trim().length < 10}
          >
            {busy.startsWith("Understanding") ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <ArrowRight size={17} />
            )}{" "}
            Understand my situation
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setText(sample);
              setAnalysis(null);
              setClaim(null);
              setCredential(null);
              setMatches([]);
              setApplication(null);
              setNotice("Fictional example loaded.");
            }}
          >
            Load demo example
          </Button>
          {voiceSupported && (
            <Button
              variant={isListening ? "destructive" : "outline"}
              type="button"
              onClick={listen}
            >
              <Mic size={17} /> {isListening ? "🛑 Stop Recording" : "🎤 Speak"}
            </Button>
          )}
        </div>
      </section>
      {analysis && (
        <section
          className="form-card flow-panel"
          aria-labelledby="understood-title"
        >
          <div className="step-number">02 · Review</div>
          <h2 id="understood-title">Here’s what SANAD understood.</h2>
          <p className="subtle">
            {analysis.method === "demo_rules"
              ? "Local example analysis (rule-based simulation)"
              : "AI-extracted interpretation"}{" "}
            · {analysis.analysis.languageSignals.join(" + ")} ·{" "}
            {Math.round(analysis.analysis.confidence * 100)}% analysis
            confidence. This is not an official eligibility score.
          </p>
          <div className="fact-grid">
            {Object.entries(facts).map(([name, value]) => (
              <label key={name}>
                {label(name)}
                <input
                  value={value}
                  onChange={(e) =>
                    setFacts((previous) => ({
                      ...previous,
                      [name]: e.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          {analysis.analysis.missing_information.map((name) => (
            <label className="missing-field" key={name}>
              {label(name)} <span>(optional clarification)</span>
              <input
                value={facts[name] || ""}
                onChange={(e) =>
                  setFacts((previous) => ({
                    ...previous,
                    [name]: e.target.value,
                  }))
                }
                placeholder="Enter if known"
              />
            </label>
          ))}
          <p className="notice">
            These are interpreted facts. You must confirm them before SANAD can
            issue a user-confirmed credential.
          </p>
          <Button
            disabled={
              busy !== "" ||
              claim !== null ||
              Object.values(facts).every((v) => !v.trim())
            }
            onClick={() =>
              work(
                "Saving and confirming your information...",
                async () => {
                  const created = await api<Item>("claims", "POST", { text });
                  await api(`claims/${created.id}`, "PATCH", { facts });
                  return api<Item>(`claims/${created.id}/confirm`, "POST", {});
                },
                (value) => {
                  setClaim(value);
                  setNotice("Facts confirmed. You can now issue a credential.");
                },
              )
            }
          >
            <Check size={17} /> Confirm information
          </Button>
          {claim && (
            <p className="success">
              Your confirmed claim was saved. Claim ID: <code>{claim.id}</code>
            </p>
          )}
        </section>
      )}
      {claim && (
        <section
          className="form-card flow-panel"
          aria-labelledby="credential-title"
        >
          <div className="step-number">03 · Record</div>
          <h2 id="credential-title">Make the record verifiable.</h2>
          <p>
            A SANAD credential preserves your confirmed claim. It proves
            issuance and integrity, not the underlying truth of the claim.
          </p>
          <Button
            disabled={busy !== "" || credential !== null}
            onClick={() =>
              work(
                "Waiting for credential confirmation...",
                () =>
                  api<Item>("credentials/issue", "POST", { claimId: claim.id }),
                (value) => {
                  setCredential(value);
                  setNotice(
                    "Credential issued. Find potentially relevant support.",
                  );
                },
              )
            }
          >
            Issue user-confirmed credential
          </Button>
          {credential && (
            <div className="success">
              <strong>
                Credential valid ·{" "}
                {credential.mode === "mock"
                  ? "Demo/Testnet Simulation"
                  : "Polygon Amoy testnet"}
              </strong>
              <p>
                ID: <code>{credential.id}</code>
              </p>
              <p>Issuer: {String(credential.issuer)}</p>
              <a href={`/verify?id=${credential.id}`}>
                Open public verification <ArrowRight size={15} />
              </a>
              {credential.mode === "real" &&
                Boolean(credential.transaction_hash) && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://amoy.polygonscan.com/tx/${credential.transaction_hash}`}
                  >
                    View Amoy transaction
                  </a>
                )}
              <Image
                unoptimized
                width={160}
                height={160}
                className="qr-preview"
                alt="QR code linking to the public verification page"
                src={`/api/credentials/${credential.id}/qr`}
              />
            </div>
          )}
        </section>
      )}
      {credential && (
        <section
          className="form-card flow-panel"
          aria-labelledby="support-title"
        >
          <div className="step-number">04 · Find support</div>
          <h2 id="support-title">Support that may be relevant.</h2>
          <p>
            Matches are based on your confirmed situation, not official
            eligibility. Check each source.
          </p>
          <Button
            disabled={busy !== ""}
            onClick={() =>
              work(
                "Finding potentially relevant support...",
                () =>
                  api<Match[]>("services/match", "POST", {
                    claimId: claim?.id,
                  }),
                (value) => {
                  setMatches(value);
                  setNotice(
                    `${value.length} potentially relevant official resources found.`,
                  );
                },
              )
            }
          >
            Find relevant support
          </Button>
          <div className="service-grid">
            {matches.map((service) => (
              <article key={service.id} className="service-card">
                <span className="eyebrow">
                  {service.category} · {service.details.kind}
                </span>
                <h3>{service.title}</h3>
                <p>{service.why}</p>
                <p className="subtle">
                  AI relevance score: {service.relevance_score}% · Not an
                  eligibility determination
                </p>
                <a
                  href={service.details.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official source ↗
                </a>
                <Button
                  variant="outline"
                  disabled={busy !== "" || application !== null}
                  onClick={() =>
                    work(
                      "Starting a SANAD demo application...",
                      () =>
                        api<Item>("applications", "POST", {
                          service_id: service.id,
                          credential_id: credential.id,
                        }),
                      (value) => {
                        setApplication(value);
                        setNotice(
                          "Demo journey created with your credential attached.",
                        );
                      },
                    )
                  }
                >
                  Start SANAD journey
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}
      {application && (
        <section
          className="form-card flow-panel"
          aria-labelledby="application-title"
        >
          <div className="step-number">05 · Follow progress</div>
          <h2 id="application-title">Your application journey</h2>
          <p className="notice">
            Demo simulation: SANAD does not submit an application to a
            government authority. Follow the official source to apply.
          </p>
          <ol className="timeline">
            <li>Journey created</li>
            <li>Credential attached</li>
            <li>
              Submitted to SANAD demo{" "}
              {application.status !== "DRAFT" ? "✓" : "○"}
            </li>
            <li>
              Status: <strong>{label(String(application.status))}</strong>
            </li>
          </ol>
          {application.status === "DRAFT" && (
            <Button
              disabled={busy !== ""}
              onClick={() =>
                work(
                  "Submitting demo application...",
                  () =>
                    api<Item>(
                      `applications/${application.id}/submit`,
                      "POST",
                      {},
                    ),
                  (value) => {
                    setApplication(value);
                    setNotice(
                      "Application status changed. Submitted to SANAD demo, not a government authority.",
                    );
                  },
                )
              }
            >
              Submit demo journey
            </Button>
          )}
          {application.status === "SUBMITTED" && (
            <Button
              disabled={busy !== ""}
              onClick={() =>
                work(
                  "Updating demo status...",
                  () =>
                    api<Item>(`applications/${application.id}`, "PATCH", {
                      status: "UNDER_REVIEW",
                    }),
                  (value) => {
                    setApplication(value);
                    setNotice(
                      "Application status changed. Under review. Demo simulation.",
                    );
                  },
                )
              }
            >
              Simulate under review
            </Button>
          )}
          {application.status === "UNDER_REVIEW" && (
            <Button
              disabled={busy !== ""}
              onClick={() =>
                work(
                  "Updating demo status...",
                  () =>
                    api<Item>(`applications/${application.id}`, "PATCH", {
                      status: "ADDITIONAL_DOCUMENTS_REQUIRED",
                    }),
                  (value) => {
                    setApplication(value);
                    setNotice(
                      "Application status changed. Additional documents are required. Demo simulation.",
                    );
                  },
                )
              }
            >
              Simulate document request
            </Button>
          )}
          <Link href="/applications">View application timeline →</Link>
        </section>
      )}
      {error && (
        <p role="alert" className="error-box">
          {error} <span>You can retry the last action.</span>
        </p>
      )}
      <p
        className="visible-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notice}
      </p>
      <AccessibleStatusAnnouncer message={notice} />
    </div>
  );
}
