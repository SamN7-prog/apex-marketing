"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type AuthProvider = "google" | "apple";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phoneMode, setPhoneMode] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] =
    useState<AuthProvider | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  function clearMessages() {
    setError("");
    setMessage("");
  }

  // ------------------------------------------
  // RESEND COUNTDOWN
  // ------------------------------------------

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  // ------------------------------------------
  // EMAIL LOGIN
  // ------------------------------------------

  async function signIn() {
    clearMessages();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // ------------------------------------------
  // EMAIL SIGN UP
  // ------------------------------------------

  async function signUp() {
    clearMessages();

    if (!email || !password) {
      setError("Please enter an email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created! Check your email for the confirmation link."
    );

    setLoading(false);
  }

  // ------------------------------------------
  // GOOGLE / APPLE
  // ------------------------------------------

  async function signInWithProvider(provider: AuthProvider) {
    clearMessages();
    setProviderLoading(provider);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setProviderLoading(null);
    }
  }

  // ------------------------------------------
  // PHONE HELPERS
  // ------------------------------------------

  function normalizePhone(value: string) {
    let cleaned = value.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }

    if (!cleaned.startsWith("+") && cleaned.length === 10) {
      cleaned = "+1" + cleaned;
    }

    return cleaned;
  }

  function isValidPhone(value: string) {
    const normalized = normalizePhone(value);

    // E.164-style validation.
    return /^\+[1-9]\d{7,14}$/.test(normalized);
  }

  function formatPhoneForDisplay(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6
      )}`;
    }

    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(
        4,
        7
      )}-${digits.slice(7)}`;
    }

    return value;
  }

  // ------------------------------------------
  // SEND PHONE CODE
  // ------------------------------------------

  async function sendPhoneCode() {
    clearMessages();

    const normalizedPhone = normalizePhone(phone);

    if (!phone) {
      setError("Enter your phone number first.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError(
        "Enter a valid phone number with country code, like +1 555 123 4567."
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setPhone(normalizedPhone);
    setPhoneStep("otp");
    setOtp("");
    setResendCooldown(60);

    setMessage("Verification code sent. Check your phone.");

    setLoading(false);
  }

  // ------------------------------------------
  // RESEND PHONE CODE
  // ------------------------------------------

  async function resendPhoneCode() {
    if (resendCooldown > 0 || loading) return;

    clearMessages();

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizePhone(phone),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOtp("");
    setResendCooldown(60);
    setMessage("A new verification code has been sent.");

    setLoading(false);
  }

  // ------------------------------------------
  // VERIFY PHONE
  // ------------------------------------------

  async function verifyPhoneCode() {
    clearMessages();

    if (!otp) {
      setError("Enter the verification code.");
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: otp,
      type: "sms",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // ------------------------------------------
  // RESET PHONE FLOW
  // ------------------------------------------

  function resetPhone() {
    setPhoneMode(false);
    setPhoneStep("phone");
    setPhone("");
    setOtp("");
    setResendCooldown(0);
    clearMessages();
  }

  function changePhoneNumber() {
    setPhoneStep("phone");
    setOtp("");
    setResendCooldown(0);
    clearMessages();
  }

  // ------------------------------------------
  // UI
  // ------------------------------------------

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-8 text-white sm:px-6">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-320px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[150px]" />

        <div className="absolute bottom-[-300px] left-[-180px] h-[520px] w-[520px] rounded-full bg-indigo-600/15 blur-[140px]" />

        <div className="absolute right-[-180px] top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-[470px]">
        {/* BRAND */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-[23px] bg-blue-500/30 blur-xl" />

              <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-white/10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-600/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M12 3l1.4 4.1L17.5 9l-4.1 1.4L12 14.5l-1.4-4.1L6.5 9l4.1-1.9L12 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M18.5 14l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black tracking-[-0.04em]">
            APEX
          </h1>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-blue-500/50" />

            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-400">
              Marketing OS
            </p>

            <span className="h-px w-6 bg-blue-500/50" />
          </div>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Your AI Chief Marketing Officer.
            <br />
            <span className="text-slate-500">
              Turn your marketing into your growth engine.
            </span>
          </p>
        </div>

        {/* CARD */}
        <div className="overflow-hidden rounded-[30px] border border-white/[0.09] bg-white/[0.035] p-[1px] shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <div className="rounded-[29px] border border-white/[0.04] bg-[#070c17]/95 p-5 sm:p-8">
            {/* HEADER */}
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-400">
                  {phoneMode
                    ? phoneStep === "otp"
                      ? "Verification"
                      : "Phone sign in"
                    : mode === "login"
                    ? "Secure access"
                    : "Get started"}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  Secure
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                {phoneMode
                  ? phoneStep === "otp"
                    ? "Verify your phone"
                    : "Continue with phone"
                  : mode === "login"
                  ? "Welcome back"
                  : "Create your Apex account"}
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                {phoneMode
                  ? phoneStep === "otp"
                    ? `Enter the 6-digit code sent to ${formatPhoneForDisplay(
                        phone
                      )}.`
                    : "We'll send you a secure verification code."
                  : mode === "login"
                  ? "Sign in to your marketing workspace."
                  : "Start building your business growth system."}
              </p>
            </div>

            {/* SOCIAL LOGIN */}
            {!phoneMode && (
              <>
                <div className="space-y-3">
                  {/* GOOGLE */}
                  <button
                    type="button"
                    onClick={() => signInWithProvider("google")}
                    disabled={loading || providerLoading !== null}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {providerLoading === "google" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          fill="#4285F4"
                          d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.54 13.76A5.85 5.85 0 0 1 6.23 12c0-.61.1-1.2.31-1.76V7.71H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.29l3.24-2.53Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 6.21c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.3 14.63 2.33 12 2.33A9.74 9.74 0 0 0 3.3 7.71l3.24 2.53C7.31 7.93 9.46 6.21 12 6.21Z"
                        />
                      </svg>
                    )}

                    Continue with Google
                  </button>

                  {/* APPLE */}
                  <button
                    type="button"
                    onClick={() => signInWithProvider("apple")}
                    disabled={loading || providerLoading !== null}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.94] px-4 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {providerLoading === "apple" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-black"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.1.8 1.21-.24 2.37-.93 3.66-.84 1.55.13 2.72.74 3.5 1.84-3.2 1.92-2.44 6.14.49 7.32-.59 1.55-1.35 3.06-2.75 3.85ZM12.03 7.25C11.88 4.94 13.75 3.04 15.9 2.86c.3 2.67-2.42 4.66-3.87 4.39Z" />
                      </svg>
                    )}

                    Continue with Apple
                  </button>

                  {/* PHONE */}
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setPhoneMode(true);
                    }}
                    disabled={loading || providerLoading !== null}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-blue-500/[0.05] px-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/20 hover:bg-white/[0.09] hover:shadow-xl hover:shadow-blue-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    Continue with phone
                  </button>
                </div>

                {/* DIVIDER */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>
              </>
            )}

            {/* PHONE FLOW */}
            {phoneMode ? (
              <div className="space-y-5">
                {phoneStep === "phone" ? (
                  <>
                    {/* PHONE INPUT */}
                    <div>
                      <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                        Mobile number
                      </label>

                      <div className="relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-slate-500">
                          <span className="text-base">🇺🇸</span>
                          <span className="text-xs font-bold">+1</span>
                        </div>

                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="(555) 123-4567"
                          value={formatPhoneForDisplay(phone)}
                          onChange={(e) => {
                            const value = e.target.value;

                            setPhone(value);
                            clearMessages();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && phone) {
                              sendPhoneCode();
                            }
                          }}
                          disabled={loading}
                          className="h-16 w-full rounded-2xl border border-white/10 bg-black/30 pl-24 pr-4 text-base font-medium text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      <p className="mt-2.5 text-xs text-slate-600">
                        Use your full number with country code if outside the
                        US.
                      </p>
                    </div>

                    {/* SEND */}
                    <button
                      type="button"
                      onClick={sendPhoneCode}
                      disabled={loading || !phone}
                      className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending code...
                          </>
                        ) : (
                          <>
                            Send verification code
                            <span className="text-blue-200">→</span>
                          </>
                        )}
                      </span>

                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* OTP ICON */}
                    <div className="flex justify-center pb-1">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />

                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-7 w-7 text-blue-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <rect
                              x="5"
                              y="2"
                              width="14"
                              height="20"
                              rx="2"
                            />
                            <path
                              d="M9 18h6"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 6h8M8 10h8M8 14h5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* OTP */}
                    <div>
                      <label className="mb-2.5 block text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                        Verification code
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          clearMessages();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6) {
                            verifyPhoneCode();
                          }
                        }}
                        disabled={loading}
                        className="h-16 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-center text-2xl font-black tracking-[0.45em] text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <p className="mt-3 text-center text-xs text-slate-600">
                        Enter the code exactly as it appears in your message.
                      </p>
                    </div>

                    {/* VERIFY */}
                    <button
                      type="button"
                      onClick={verifyPhoneCode}
                      disabled={loading || otp.length !== 6}
                      className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify & Continue
                            <span className="text-blue-200">→</span>
                          </>
                        )}
                      </span>

                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>

                    {/* RESEND / CHANGE */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={changePhoneNumber}
                        disabled={loading}
                        className="text-xs font-bold text-slate-500 transition hover:text-white disabled:opacity-50"
                      >
                        ← Change number
                      </button>

                      <button
                        type="button"
                        onClick={resendPhoneCode}
                        disabled={loading || resendCooldown > 0}
                        className="text-xs font-bold text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:text-slate-700"
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend code"}
                      </button>
                    </div>
                  </>
                )}

                {/* PHONE ERROR */}
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm leading-5 text-red-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[11px] font-black">
                      !
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                {/* PHONE SUCCESS */}
                {message && (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 text-sm leading-5 text-emerald-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px]">
                      ✓
                    </div>
                    <span>{message}</span>
                  </div>
                )}

                {/* BACK */}
                <button
                  type="button"
                  onClick={resetPhone}
                  disabled={loading}
                  className="w-full py-2 text-xs font-bold text-slate-600 transition hover:text-white disabled:opacity-50"
                >
                  Back to other sign-in options
                </button>
              </div>
            ) : (
              /* EMAIL FORM */
              <div className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Email address
                  </label>

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                    }}
                    disabled={loading || providerLoading !== null}
                    className="h-16 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Password
                    </label>

                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-xs font-bold text-blue-400 transition hover:text-blue-300"
                        onClick={() =>
                          setMessage(
                            "Password reset can be added next."
                          )
                        }
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <input
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                    }}
                    disabled={loading || providerLoading !== null}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        mode === "login" ? signIn() : signUp();
                      }
                    }}
                    className="h-16 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* ERROR */}
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm leading-5 text-red-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[11px] font-black">
                      !
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                {/* SUCCESS */}
                {message && (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 text-sm leading-5 text-emerald-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px]">
                      ✓
                    </div>
                    <span>{message}</span>
                  </div>
                )}

                {/* PRIMARY */}
                <button
                  type="button"
                  onClick={mode === "login" ? signIn : signUp}
                  disabled={
                    loading ||
                    providerLoading !== null ||
                    !email ||
                    !password
                  }
                  className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Please wait...
                      </>
                    ) : mode === "login" ? (
                      <>
                        Sign In
                        <span className="text-blue-200">→</span>
                      </>
                    ) : (
                      <>
                        Create Apex Account
                        <span className="text-blue-200">→</span>
                      </>
                    )}
                  </span>

                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
              </div>
            )}

            {/* ACCOUNT SWITCH */}
            {!phoneMode && (
              <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
                <p className="text-sm text-slate-500">
                  {mode === "login"
                    ? "New to Apex?"
                    : "Already have an Apex account?"}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode(mode === "login" ? "signup" : "login");
                  }}
                  className="mt-2 text-sm font-black text-blue-400 transition hover:text-blue-300"
                >
                  {mode === "login"
                    ? "Create your account →"
                    : "Sign in instead →"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TRUST */}
        <div className="mt-6 flex items-center justify-center gap-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            Secure authentication
          </div>

          <span className="h-3 w-px bg-white/[0.07]" />

          <span>APEX OS</span>
        </div>

        {/* LEGAL */}
        <p className="mx-auto mt-4 max-w-sm text-center text-[10px] leading-5 text-slate-700">
          By continuing, you agree to Apex Marketing&apos;s Terms of Service
          and Privacy Policy.
        </p>
      </div>
    </main>
  );
}