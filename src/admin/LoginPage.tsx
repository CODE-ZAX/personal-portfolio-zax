import { useState, type FormEvent } from "react";
import { ClientResponseError } from "pocketbase";
import { navigate } from "./router";
import { pb } from "./pb";

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaId, setMfaId] = useState("");
  const [otpId, setOtpId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onPassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await pb.collection("_superusers").authWithPassword(email, password);
      setPassword("");
      onSuccess();
      navigate("/admin");
    } catch (err) {
      const response = err instanceof ClientResponseError ? err.response : {};
      const nextMfa = String(response.mfaId || response.data?.mfaId || "");
      if (!nextMfa) {
        setError("Those credentials were not accepted.");
        setPending(false);
        return;
      }
      try {
        const existing = String(response.otpId || response.data?.otpId || "");
        const issued = existing ? { otpId: existing } : await pb.collection("_superusers").requestOTP(email);
        setMfaId(nextMfa);
        setOtpId(issued.otpId);
      } catch {
        setError("A second factor is required, and the one-time code could not be sent.");
      }
    }
    setPending(false);
  }

  async function onOtp(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await pb.collection("_superusers").authWithOTP(otpId, otp, {
        body: { otpId, password: otp, mfaId },
      });
      setPassword("");
      setOtp("");
      onSuccess();
      navigate("/admin");
    } catch {
      setError("That code was not accepted.");
    }
    setPending(false);
  }

  return (
    <div className="grid min-h-[100dvh] bg-graphite text-ink md:grid-cols-12">
      <main className="px-4 py-16 md:col-span-6 md:col-start-2 md:px-0 md:py-24">
        <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Admin</p>
        <h1 className="mt-3 max-w-[12ch] font-display text-[clamp(2.35rem,5.4vw,5.25rem)] leading-[0.9] tracking-tighter">
          Sign in
        </h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-muted">
          Superuser access for this host. A one-time code appears here only when PocketBase asks for a second factor.
        </p>
        {mfaId ? (
          <form className="mt-8 grid max-w-sm gap-2" onSubmit={onOtp}>
            <label className="font-display text-sm" htmlFor="otp">
              One-time code
            </label>
            <input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink"
              required
            />
            {error ? <p className="text-sm text-accent-text">{error}</p> : null}
            <button type="submit" className="tactile mt-2 rounded-full bg-accent px-5 py-3 font-display font-semibold text-accent-ink" disabled={pending}>
              Confirm code
            </button>
          </form>
        ) : (
          <form className="mt-8 grid max-w-sm gap-4" onSubmit={onPassword}>
            <div className="grid gap-2">
              <label className="font-display text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="font-display text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink"
                required
              />
            </div>
            {error ? <p className="text-sm text-accent-text">{error}</p> : null}
            <button type="submit" className="tactile rounded-full bg-accent px-5 py-3 font-display font-semibold text-accent-ink" disabled={pending}>
              Continue
            </button>
          </form>
        )}
      </main>
      <aside className="hidden border-l border-line md:col-span-3 md:col-start-10 md:block" aria-hidden="true" />
    </div>
  );
}
