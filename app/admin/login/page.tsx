"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";

export default function LoginPage() {
  const router = useRouter();
  const { mode, ready, session, role, signIn } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (mode === "local" || (session && role)) router.replace("/admin");
  }, [ready, mode, session, role, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  if (!ready || mode === "local") {
    return (
      <div className="login-wrap">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1 className="admin-title">Dashboard sign-in</h1>
        <p className="admin-hint">Dr. Abdullah Elkasaby — content dashboard</p>
        {error && <div className="banner banner--error">{error}</div>}
        <div className="field">
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
        </div>
        <div className="field">
          <label>
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
        </div>
        <button type="submit" className="btn btn--primary" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="field-hint" style={{ marginTop: "1rem" }}>
          New team members are invited from the Supabase dashboard, not from this page — see docs/SUPABASE.md.
        </p>
      </form>
    </div>
  );
}
