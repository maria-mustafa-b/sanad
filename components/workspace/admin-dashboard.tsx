"use client";
import { useEffect, useState } from "react";
import { api, type Item } from "./api";
import { Button } from "@/components/ui/button";
type Metrics = {
  totalUsers: number;
  claims: number;
  credentials: number;
  applications: number;
  pendingApplications: number;
  escalations: number;
  verificationRequests: number;
  claimsByCategory: Record<string, number>;
  applicationsByStatus: Record<string, number>;
  aiConfidence: number[];
};
export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null),
    [services, setServices] = useState<Item[]>([]),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [draft, setDraft] = useState({
      title: "",
      description: "",
      category: "Labour",
      url: "",
    });
  useEffect(() => {
    Promise.all([
      api<Metrics>("analytics/overview"),
      api<Item[]>("admin/services"),
    ])
      .then(([m, s]) => {
        setMetrics(m);
        setServices(s);
      })
      .catch((e) => setError(e.message));
  }, []);
  async function toggle(service: Item) {
    try {
      await api(`admin/services/${service.id}`, "PATCH", {
        published: !service.published,
      });
      setServices(await api<Item[]>("admin/services"));
      setNotice(`${service.title} publication updated.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await api("admin/services", "POST", {
        title: draft.title,
        description: draft.description,
        category: draft.category,
        eligibility_guidance:
          "Potentially relevant only. Check current official conditions before applying.",
        details: {
          official_url: draft.url,
          last_verified: new Date().toISOString().slice(0, 10),
          kind: "official guidance",
        },
        steps: ["Read the official source", "Check current requirements"],
        keywords: [],
        supported_situations: [],
        published: false,
      });
      setServices(await api<Item[]>("admin/services"));
      setDraft({ title: "", description: "", category: "Labour", url: "" });
      setNotice(
        "Draft resource created. Add matching categories and review before publishing.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the source.");
    }
  }
  if (error && !metrics)
    return (
      <p role="alert" className="error-box">
        {error} Admin access is restricted.
      </p>
    );
  if (!metrics) return <p>Loading administrator overview...</p>;
  return (
    <div>
      <div className="dashboard-grid">
        {Object.entries(metrics)
          .filter(([, value]) => typeof value === "number")
          .map(([key, value]) => (
            <div className="dashboard-card" key={key}>
              <span className="eyebrow">{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>{value as number}</strong>
            </div>
          ))}
      </div>
      <div className="form-card">
        <h2>Claims by category</h2>
        <ul>
          {Object.entries(metrics.claimsByCategory).map(([name, total]) => (
            <li key={name} className="metric-line">
              <span>
                {name}: {total}
              </span>
              <span
                className="metric-bar"
                style={{
                  width: `${Math.min(100, Math.max(8, (total / Math.max(1, metrics.claims)) * 100))}%`,
                }}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
        <h2>Applications by status</h2>
        <ul>
          {Object.entries(metrics.applicationsByStatus).map(([name, total]) => (
            <li key={name}>
              {name}: {total}
            </li>
          ))}
        </ul>
        <h2>AI confidence distribution</h2>
        <p>
          {metrics.aiConfidence.length
            ? `${Math.round((metrics.aiConfidence.reduce((a, b) => a + b, 0) / metrics.aiConfidence.length) * 100)}% mean confidence across ${metrics.aiConfidence.length} claims`
            : "No analyzed claims yet"}
        </p>
      </div>
      <section className="form-card">
        <h2>Curated service records</h2>
        <form onSubmit={create} className="admin-form">
          <label htmlFor="admin-title">
            Resource title
            <input
              id="admin-title"
              required
              minLength={5}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label htmlFor="admin-description">
            Description
            <input
              id="admin-description"
              required
              minLength={10}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </label>
          <label htmlFor="admin-category">
            Category
            <input
              id="admin-category"
              required
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </label>
          <label htmlFor="admin-source">
            Official UAE government HTTPS source
            <input
              id="admin-source"
              type="url"
              required
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            />
          </label>
          <Button type="submit">Add draft resource</Button>
        </form>
        <p>
          Source review and publishing are administrator actions. Official URLs
          are required on creation.
        </p>
        <p role="status" aria-live="polite">
          {notice}
        </p>
        {error && <p role="alert">{error}</p>}
        <ul>
          {services.map((service) => (
            <li className="admin-row" key={service.id}>
              {String(service.title)} ·{" "}
              {service.published ? "Published" : "Draft"}
              <Button variant="outline" onClick={() => toggle(service)}>
                {service.published ? "Unpublish" : "Publish"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
