"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AccessibleStatusAnnouncer } from "@/components/accessibility/accessible-status-announcer";
export function SituationDraft() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  return (
    <section className="form-card">
      <label htmlFor="situation">What is happening?</label>
      <p id="input-help">
        Try a fictional example. This text stays in this page’s memory and is
        lost when you leave or reload.
      </p>
      <textarea
        id="situation"
        dir="auto"
        aria-describedby="input-help"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setMessage("");
        }}
        maxLength={4000}
        rows={6}
        placeholder="You can mix languages and write in your own words."
      />
      <div className="actions">
        <Button
          onClick={() => {
            setText(
              "Meri job chali gayi hai aur August ki salary bhi nahi mili.",
            );
            setMessage("Example loaded. You can edit the situation text.");
          }}
        >
          Load example
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setText("");
            setMessage("Situation text cleared.");
          }}
        >
          Clear
        </Button>
      </div>
      <p className="notice">
        Analysis is not connected yet. No claim or credential is created in this
        preview.
      </p>
      <p aria-hidden="true">{message}</p>
      <AccessibleStatusAnnouncer message={message} />
    </section>
  );
}
