"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, label, type Item } from "./api";
import { Button } from "@/components/ui/button";
export function Records({
  type,
}: {
  type: "claims" | "credentials" | "applications" | "notifications";
}) {
  const [items, setItems] = useState<Item[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [announcement, setAnnouncement] = useState("");
  async function refresh() {
    try {
      setItems(await api<Item[]>(type));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void api<Item[]>(type)
      .then(setItems)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Please try again."),
      )
      .finally(() => setBusy(false));
  }, [type]);
  async function perform(
    path: string,
    method: string,
    body: unknown,
    success: string,
  ) {
    setBusy(true);
    try {
      await api(path, method, body);
      await refresh();
      setAnnouncement(success);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <p role="status" aria-live="polite">
        {announcement}
      </p>
      {busy && <p>Loading...</p>}
      {error && (
        <p role="alert" className="error-box">
          {error}{" "}
          <button className="text-action" onClick={refresh}>
            Retry
          </button>
        </p>
      )}
      {items.length === 0 && !busy && (
        <p className="form-card">
          No {type} yet. <Link href="/understand">Start a situation →</Link>
        </p>
      )}
      <div className="record-list">
        {items.map((item) => (
          <article className="record" key={item.id}>
            <div>
              <span className="eyebrow">
                {type.slice(0, -1)} ·{" "}
                {new Date(String(item.created_at)).toLocaleDateString()}
              </span>
              <h2>
                {type === "claims"
                  ? label(String(item.intent || "Situation"))
                  : type === "credentials"
                    ? "Portable situation credential"
                    : type === "applications"
                      ? "SANAD application journey"
                      : String(item.message)}
              </h2>
              <p className="subtle">
                {type !== "notifications" && (
                  <>
                    Status: <strong>{label(String(item.status))}</strong> ·{" "}
                  </>
                )}
                ID: <code>{item.id}</code>
              </p>
              {type === "credentials" && (
                <p>
                  {item.mode === "mock"
                    ? "Demo/Testnet Simulation"
                    : "Polygon Amoy testnet"}{" "}
                  ·{" "}
                  <Link href={`/verify?id=${item.id}`}>
                    Public verification
                  </Link>
                </p>
              )}
            </div>
            <div className="record-actions">
              {type === "credentials" && item.status === "VALID" && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    perform(
                      `credentials/${item.id}/revoke`,
                      "POST",
                      {},
                      "Credential revoked. Public verification now reports it as revoked.",
                    )
                  }
                >
                  Revoke credential
                </Button>
              )}
              {type === "credentials" &&
                (item.status === "PENDING" || item.status === "REVOKING") &&
                item.mode === "real" &&
                Boolean(item.status === "PENDING"
                  ? item.transaction_hash
                  : item.revocation_transaction_hash) && (
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      perform(
                        `credentials/${item.id}/reconcile`,
                        "POST",
                        {},
                        "Transaction status checked.",
                      )
                    }
                  >
                    Check confirmation
                  </Button>
                )}
              {type === "applications" && (
                <Link href={`/applications/${item.id}`} className="button-link">
                  View timeline →
                </Link>
              )}
              {type === "notifications" && !item.read_at && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    perform(
                      `notifications/${item.id}/read`,
                      "PATCH",
                      {},
                      "Notification marked as read.",
                    )
                  }
                >
                  Mark read
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
