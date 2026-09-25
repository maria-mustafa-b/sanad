"use client";
import { useEffect, useState } from "react";
import { api, type Item } from "./api";
type Service = Item & {
  title: string;
  description: string;
  category: string;
  eligibility_guidance: string;
  details: { kind: string; official_url: string; last_verified: string };
  steps: string[];
};
export function ServiceBrowser() {
  const [services, setServices] = useState<Service[]>([]),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [error, setError] = useState("");
  useEffect(() => {
    api<Service[]>("services")
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);
  const categories = ["All", ...new Set(services.map((s) => s.category))];
  const visible = services.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      `${s.title} ${s.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section>
      <div className="search-row">
        <label htmlFor="service-query">
          Search official resources
          <input
            id="service-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wages, work permit, residency..."
          />
        </label>
        <label htmlFor="service-category">
          Category
          <select
            id="service-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="error-box">
          {error}
        </p>
      )}
      <p role="status">{visible.length} official-source resources</p>
      <div className="service-grid">
        {visible.map((s) => (
          <article className="service-card" key={s.id}>
            <span className="eyebrow">
              {s.category} · {s.details?.kind || "official guidance"}
            </span>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            <p className="subtle">{s.eligibility_guidance}</p>
            <p>Source reviewed: {s.details?.last_verified}</p>
            <a
              href={s.details?.official_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read official source ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
