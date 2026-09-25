"use client";
import { useEffect, useState } from "react";
import { api, label, type Item } from "./api";
import { Button } from "@/components/ui/button";
type Detail = Item & {
  status: string;
  timeline: Array<Item & { description: string; event_type: string }>;
  attachedCredentials: Item[];
  attachedDocuments: Item[];
};
export function ApplicationDetail({ id }: { id: string }) {
  const [detail, setDetail] = useState<Detail | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [file, setFile] = useState<File | null>(null);
  async function load() {
    try {
      setDetail(await api<Detail>(`applications/${id}`));
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load the application.",
      );
    }
  }
  useEffect(() => {
    void api<Detail>(`applications/${id}`)
      .then(setDetail)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Could not load the application.",
        ),
      );
  }, [id]);
  async function change(status: string) {
    setBusy(true);
    try {
      await api(`applications/${id}`, "PATCH", { status });
      await load();
      setNotice(
        `Application status changed. ${label(status)}. Demo simulation.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  async function upload() {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/documents", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error?.message || "Upload failed.");
      await api(`applications/${id}/attach`, "POST", {
        kind: "document",
        evidence_id: result.data.id,
      });
      setNotice("Document uploaded and attached to this SANAD journey.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visible-status"
      >
        {notice}
      </p>
      {error && (
        <p role="alert" className="error-box">
          {error}{" "}
          <button className="text-action" onClick={load}>
            Retry
          </button>
        </p>
      )}
      {!detail && !error && <p>Loading application...</p>}
      {detail && (
        <>
          <div className="form-card">
            <span className="eyebrow">SANAD demo journey · {detail.id}</span>
            <h2>{label(detail.status)}</h2>
            <p className="notice">
              This journey is a simulation. No government authority receives it.
            </p>
            <p>
              Credential evidence attached: {detail.attachedCredentials.length}{" "}
              · Documents attached: {detail.attachedDocuments.length}
            </p>
            <div className="actions">
              {detail.status === "DRAFT" && (
                <Button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await api(`applications/${id}/submit`, "POST", {});
                      await load();
                      setNotice(
                        "Application status changed. Submitted to SANAD demo.",
                      );
                    } catch (e) {
                      setError(
                        e instanceof Error ? e.message : "Submission failed.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Submit SANAD journey
                </Button>
              )}
              {detail.status === "SUBMITTED" && (
                <Button disabled={busy} onClick={() => change("UNDER_REVIEW")}>
                  Simulate under review
                </Button>
              )}
              {detail.status === "UNDER_REVIEW" && (
                <>
                  <Button
                    disabled={busy}
                    onClick={() => change("ADDITIONAL_DOCUMENTS_REQUIRED")}
                  >
                    Request more documents
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => change("VERIFIED")}
                  >
                    Simulate review complete
                  </Button>
                </>
              )}
              {detail.status === "ADDITIONAL_DOCUMENTS_REQUIRED" && (
                <Button disabled={busy} onClick={() => change("UNDER_REVIEW")}>
                  Continue review
                </Button>
              )}
              {detail.status === "VERIFIED" && (
                <Button disabled={busy} onClick={() => change("COMPLETED")}>
                  Complete demo journey
                </Button>
              )}
            </div>
          </div>
          <section className="form-card">
            <h2>Attach a document</h2>
            <p>
              PDF, PNG, JPEG or text; 10 MB maximum. The file stays private to
              your account.
            </p>
            <label htmlFor="document-upload">Choose a document</label>
            <input
              id="document-upload"
              type="file"
              accept="application/pdf,image/png,image/jpeg,text/plain"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              variant="outline"
              onClick={upload}
              disabled={!file || busy || detail.status !== "DRAFT"}
            >
              Upload and attach
            </Button>
            {detail.status !== "DRAFT" && (
              <p>Only draft journeys accept new evidence.</p>
            )}
          </section>
          <section className="form-card">
            <h2>Timeline</h2>
            <ol className="timeline">
              {detail.timeline.map((event) => (
                <li key={event.id}>
                  <strong>{label(event.event_type)}</strong>
                  <p>{event.description}</p>
                  <time dateTime={String(event.created_at)}>
                    {new Date(String(event.created_at)).toLocaleString()}
                  </time>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </section>
  );
}
