"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, label, type Item } from "./api";
import { Button } from "@/components/ui/button";
export function Dashboard() {
  const [claims, setClaims] = useState<Item[]>([]),
    [credentials, setCredentials] = useState<Item[]>([]),
    [applications, setApplications] = useState<Item[]>([]),
    [notifications, setNotifications] = useState<Item[]>([]),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      api<Item[]>("claims"),
      api<Item[]>("credentials"),
      api<Item[]>("applications"),
      api<Item[]>("notifications"),
    ])
      .then(([c, k, a, n]) => {
        setClaims(c);
        setCredentials(k);
        setApplications(a);
        setNotifications(n);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      {loading && <p role="status">Loading your dashboard...</p>}
      {error && (
        <p role="alert" className="error-box">
          {error} <Link href="/onboarding">Sign in or start a demo</Link>
        </p>
      )}
      <div className="dashboard-grid">
        {[
          {
            title: "My situation",
            number: claims.length,
            detail: claims[0]
              ? label(String(claims[0].status))
              : "Start with your own words",
            href: "/understand",
          },
          {
            title: "My credentials",
            number: credentials.length,
            detail: credentials[0]
              ? label(String(credentials[0].status))
              : "No credentials yet",
            href: "/credentials",
          },
          {
            title: "Potential support",
            number: "22",
            detail: "Official-source resources in the prototype catalog",
            href: "/services",
          },
          {
            title: "Applications",
            number: applications.length,
            detail: applications[0]
              ? label(String(applications[0].status))
              : "No journeys yet",
            href: "/applications",
          },
          {
            title: "Notifications",
            number: notifications.filter((n) => !n.read_at).length,
            detail: "Unread updates",
            href: "/notifications",
          },
        ].map((card) => (
          <Link href={card.href} className="dashboard-card" key={card.title}>
            <span className="eyebrow">{card.title}</span>
            <strong>{card.number}</strong>
            <span>{card.detail}</span>
            <span>Open →</span>
          </Link>
        ))}
      </div>
      <div className="actions">
        <Button asChild>
          <Link href="/understand">Start or continue your situation</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/profile">Profile and accessibility settings</Link>
        </Button>
      </div>
      <p className="notice">
        Applications shown here are SANAD simulations. A government application
        must be submitted through the official authority.
      </p>
    </div>
  );
}
