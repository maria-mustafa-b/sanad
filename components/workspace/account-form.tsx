"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "./api";
export function AccountForm({ demoEnabled }: { demoEnabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(action: "demo" | "account") {
    setBusy(true);
    setMessage("");
    try {
      if (action === "demo") {
        await api("auth/demo", "POST", {});
        router.push("/understand?demo=1");
        return;
      }
      const result = await api<{ confirmationRequired?: boolean }>(
        `auth/${mode}`,
        "POST",
        { email, password },
      );
      if (result.confirmationRequired)
        setMessage("Check your email to confirm the account, then sign in.");
      else router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="form-card">
      {demoEnabled && (
        <>
          <h2>Try the complete fictional demo</h2>
          <p>
            No account or external credentials needed on a local installation.
            Demo data stays on this server and is labelled throughout the
            experience.
          </p>
          <Button disabled={busy} onClick={() => submit("demo")}>
            Try Demo →
          </Button>
          <hr className="divider" />
        </>
      )}
      <h2>{mode === "login" ? "Sign in" : "Create your account"}</h2>
      <p>
        {demoEnabled
          ? "Account access is available when Supabase mode is configured."
          : "Sign in with your SANAD account, or create one below."}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit("account");
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={10}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button disabled={busy} type="submit">
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        type="button"
        className="text-action"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already registered? Sign in"}
      </button>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
    </div>
  );
}
