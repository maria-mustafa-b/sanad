"use client";
import { useEffect, useState } from "react";
import { api, type Item } from "./api";
import { Button } from "@/components/ui/button";
type Extraction = {
  document_type: string;
  date: string | null;
  employer_name: string | null;
  salary_period: string | null;
};
type Document = Item & {
  original_name: string;
  mime_type: string;
  size_bytes: number;
  analysis_status: string;
  extraction: Extraction | null;
};
export function DocumentVault() {
  const [docs, setDocs] = useState<Document[]>([]),
    [file, setFile] = useState<File | null>(null),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function refresh() {
    try {
      setDocs(await api<Document[]>("documents"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load documents.");
    }
  }
  useEffect(() => {
    void api<Document[]>("documents")
      .then(setDocs)
      .catch((e) => setError(e.message));
  }, []);
  async function upload() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/documents", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error?.message || "Upload failed");
      setFile(null);
      setNotice("Private document uploaded.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  async function action(
    id: string,
    type: "analyze" | "confirm" | "delete",
    extraction?: Extraction,
  ) {
    setBusy(true);
    setError("");
    try {
      if (type === "delete") await api(`documents/${id}`, "DELETE");
      else
        await api(
          `documents/${id}/${type}`,
          "POST",
          type === "analyze" ? { consent: true } : { extraction },
        );
      setNotice(
        type === "analyze"
          ? "Extracted fields are ready for your review. They are not verified."
          : type === "confirm"
            ? "Document fields confirmed by you."
            : "Document deleted.",
      );
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <section className="form-card">
        <h2>Private documents</h2>
        <p>
          PDF, PNG, JPEG or plain text; 10 MB maximum. Your files stay private
          to your account.
        </p>
        <label htmlFor="vault-upload">Choose a document</label>
        <input
          id="vault-upload"
          type="file"
          accept="application/pdf,image/png,image/jpeg,text/plain"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={upload} disabled={!file || busy}>
          Upload securely
        </Button>
        <label className="check-label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          I agree to process a selected document with the configured AI provider
          when I click Analyze. Demo mode uses local rules for text.
        </label>
      </section>
      <p role="status" aria-live="polite">
        {notice}
      </p>
      {error && (
        <p role="alert" className="error-box">
          {error}
        </p>
      )}
      {docs.length === 0 && <p>No documents uploaded yet.</p>}
      {docs.map((doc) => (
        <article className="form-card" key={doc.id}>
          <h2>{doc.original_name}</h2>
          <p>
            {doc.mime_type} · {Math.round(doc.size_bytes / 1024)} KB ·{" "}
            {doc.analysis_status.replaceAll("_", " ")}
          </p>
          <div className="actions">
            <a
              className="button-link"
              href={`/api/documents/${doc.id}/download`}
            >
              Download
            </a>
            <Button
              disabled={busy || !consent}
              variant="outline"
              onClick={() => action(doc.id, "analyze")}
            >
              Analyze and extract fields
            </Button>
            <Button
              disabled={busy}
              variant="outline"
              onClick={() => action(doc.id, "delete")}
            >
              Delete document
            </Button>
          </div>
          {doc.extraction && (
            <div>
              <h3>Extracted information — review before confirming</h3>
              <p>
                Type: {doc.extraction.document_type}; date:{" "}
                {doc.extraction.date || "Not found"}; employer:{" "}
                {doc.extraction.employer_name || "Not found"}; salary period:{" "}
                {doc.extraction.salary_period || "Not found"}.
              </p>
              <p className="subtle">
                These are tentative extracted fields, not authenticity or legal
                findings.
              </p>
              {doc.analysis_status !== "CONFIRMED" && (
                <Button
                  disabled={busy}
                  onClick={() => action(doc.id, "confirm", doc.extraction!)}
                >
                  Confirm extracted fields
                </Button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
