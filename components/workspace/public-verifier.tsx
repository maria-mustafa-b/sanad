"use client";
import { useEffect, useState } from "react";
import { api } from "./api";
import { Button } from "@/components/ui/button";
type Result = {
  credentialId: string;
  valid: boolean;
  status: string;
  integrity: boolean;
  mode: string;
  issuer: string;
  issuedAt: string | null;
  claimType: string;
  blockchainVerification: boolean;
  transactionHash: string | null;
  revoked: boolean;
  notice: string;
};
export function PublicVerifier() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<Result | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("id");
    if (initial) queueMicrotask(() => setId(initial));
  }, []);
  async function verify() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      setResult(await api<Result>(`verify/${encodeURIComponent(id.trim())}`));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Verification failed. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="form-card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verify();
        }}
      >
        <label htmlFor="verify-id">Credential ID</label>
        <input
          id="verify-id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Paste credential ID or open a QR link"
          required
        />
        <Button disabled={busy} type="submit">
          {busy ? "Checking verification..." : "Verify credential"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="error-box">
          {error}
        </p>
      )}
      {result && (
        <section
          className="verification-result"
          aria-label="Verification result"
        >
          <p className={result.valid ? "valid" : "invalid"} role="status">
            {result.valid ? "VALID" : "NOT VALID"} ·{" "}
            {result.mode === "mock"
              ? "Demo/Testnet Simulation"
              : "Polygon Amoy"}
          </p>
          <dl>
            <dt>Credential ID</dt>
            <dd>
              <code>{result.credentialId}</code>
            </dd>
            <dt>Issuer</dt>
            <dd>{result.issuer}</dd>
            <dt>Issued</dt>
            <dd>
              {result.issuedAt
                ? new Date(result.issuedAt).toLocaleDateString()
                : "Pending"}
            </dd>
            <dt>Claim type</dt>
            <dd>{result.claimType.replaceAll("_", " ")}</dd>
            <dt>Integrity</dt>
            <dd>
              {result.integrity
                ? "Hash matches private issued snapshot"
                : "Mismatch"}
            </dd>
            <dt>Blockchain verification</dt>
            <dd>
              {result.mode === "mock"
                ? "Not performed (simulation)"
                : result.blockchainVerification
                  ? "Confirmed on Amoy"
                  : "Not confirmed"}
            </dd>
            <dt>Revoked</dt>
            <dd>{result.revoked ? "Yes" : "No"}</dd>
          </dl>
          {result.transactionHash && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://amoy.polygonscan.com/tx/${result.transactionHash}`}
            >
              Inspect transaction ↗
            </a>
          )}
          <p className="notice">
            {result.notice} This page does not disclose private facts, identity
            or documents.
          </p>
        </section>
      )}
    </div>
  );
}
