"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "./api";
import { createBrowserClient } from "@supabase/ssr";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export function AccountForm({ demoEnabled }: { demoEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [isError, setIsError] = useState(
    () => searchParams.get("error") === "auth_failed"
  );
  const [message, setMessage] = useState(
    () => searchParams.get("error") === "auth_failed"
      ? "Google sign-in failed. Please try again."
      : ""
  );

  async function handleGoogle() {
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/understand`,
      },
    });
    if (error) {
      setMessage("Google sign-in failed. Please try again.");
      setIsError(true);
      setBusy(false);
    }
  }

  async function submit(action: "demo" | "account") {
    setBusy(true);
    setMessage("");
    setIsError(false);
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
      if (result.confirmationRequired) {
        setMessage("Check your email to confirm the account, then sign in.");
        setIsError(false);
      } else router.push("/understand");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-card">
      {/* Google SSO */}
      {!demoEnabled && (
        <>
          <h2>Sign in</h2>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={handleGoogle}
            style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center" }}
          >
            <GoogleIcon /> Continue with Google
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
            <hr style={{ flex: 1 }} />
            <span className="subtle" style={{ fontSize: "0.8rem" }}>or</span>
            <hr style={{ flex: 1 }} />
          </div>
        </>
      )}

      {/* Demo mode */}
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
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={handleGoogle}
            style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center" }}
          >
            <GoogleIcon /> Continue with Google
          </Button>
          <hr className="divider" />
        </>
      )}

      {/* Email / Password */}
      <h2>{mode === "login" ? "Sign in with email" : "Create your account"}</h2>
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
        <p role="status" className={isError ? "error-box" : "notice"}>
          {message}
        </p>
      )}
    </div>
  );
}
