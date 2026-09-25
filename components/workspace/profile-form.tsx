"use client";
import { useEffect, useState } from "react";
import { api } from "./api";
import { Button } from "@/components/ui/button";
type Profile = {
  display_name: string | null;
  preferred_language: "en" | "ar" | "hi" | "ur";
  accessibility: {
    larger_text?: boolean;
    reduced_motion?: boolean;
    screen_reader?: boolean;
  };
};
export function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({
      display_name: "",
      preferred_language: "en",
      accessibility: {},
    }),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api<Profile>("profile")
      .then(setProfile)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    document.body.classList.toggle(
      "larger-text",
      !!profile.accessibility.larger_text,
    );
    document.body.classList.toggle(
      "reduced-motion",
      !!profile.accessibility.reduced_motion,
    );
    return () => {
      document.body.classList.remove("larger-text", "reduced-motion");
    };
  }, [profile.accessibility.larger_text, profile.accessibility.reduced_motion]);
  async function save() {
    setBusy(true);
    setError("");
    try {
      setProfile(
        await api<Profile>("profile", "PATCH", {
          display_name: profile.display_name || "",
          preferred_language: profile.preferred_language,
          accessibility: {
            larger_text: !!profile.accessibility.larger_text,
            reduced_motion: !!profile.accessibility.reduced_motion,
            screen_reader: !!profile.accessibility.screen_reader,
          },
        }),
      );
      setMessage("Preferences saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save preferences.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="form-card">
      <h2>Personal information</h2>
      <label htmlFor="display-name">Display name</label>
      <input
        id="display-name"
        value={profile.display_name || ""}
        maxLength={80}
        onChange={(e) =>
          setProfile({ ...profile, display_name: e.target.value })
        }
      />
      <label htmlFor="language">Preferred language</label>
      <select
        id="language"
        value={profile.preferred_language}
        onChange={(e) =>
          setProfile({
            ...profile,
            preferred_language: e.target.value as Profile["preferred_language"],
          })
        }
      >
        <option value="en">English</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
        <option value="ur">Urdu</option>
      </select>
      <p className="subtle">
        Interface translations are in progress. English is currently the
        available interface language.
      </p>
      <h2>Accessibility</h2>
      {(
        [
          { key: "larger_text", label: "Larger text" },
          { key: "reduced_motion", label: "Reduced motion" },
          { key: "screen_reader", label: "Screen reader preference" },
        ] as const
      ).map((item) => (
        <label className="check-label" key={item.key}>
          <input
            type="checkbox"
            checked={!!profile.accessibility[item.key]}
            onChange={(e) =>
              setProfile({
                ...profile,
                accessibility: {
                  ...profile.accessibility,
                  [item.key]: e.target.checked,
                },
              })
            }
          />
          {item.label}
        </label>
      ))}
      <Button disabled={busy} onClick={save}>
        Save preferences
      </Button>
      <p aria-live="polite" role="status">
        {message}
      </p>
      {error && (
        <p role="alert" className="error-box">
          {error}
        </p>
      )}
    </div>
  );
}
