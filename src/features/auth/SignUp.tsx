import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full h-12 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 text-[15px] outline-none placeholder:text-[#52525b]";

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const ready = email.trim().length > 3 && password.length >= 6;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error, needsEmailConfirm } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    if (needsEmailConfirm) {
      setCheckEmail(true);
      return;
    }
    navigate("/onboarding/type");
  }

  if (checkEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <MaterialIcon name="mark_email_read" size={48} color="#60a5fa" />
        <h2 className="text-2xl font-extrabold mt-4">Check your email</h2>
        <p className="text-[15px] text-[#a1a1aa] mt-2 max-w-[300px]">
          We sent a confirmation link to {email}. Confirm it, then log in to continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="gp-grad mt-7 w-full max-w-[280px] h-[54px] border-none rounded-[14px] text-white text-base font-bold cursor-pointer font-sans"
        >
          Go to Log In
        </button>
      </div>
    );
  }

  return (
    <form className="min-h-screen p-6" onSubmit={submit}>
      <MaterialIcon name="arrow_back" size={26} color="#a1a1aa" onClick={() => navigate("/")} className="mb-7" />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Create your account</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-7">Let's get you set up</p>
      <div className="flex flex-col gap-[18px]">
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#d4d4d8] block mb-2">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className={inputClass}
          />
        </div>
      </div>
      {error && <p className="text-[13px] text-[#f87171] mt-4">{error}</p>}
      <button
        type="submit"
        disabled={!ready || submitting}
        className="mt-7 w-full h-[54px] border-none rounded-[14px] text-base font-bold cursor-pointer font-sans"
        style={{
          background: ready && !submitting ? "linear-gradient(135deg,#2563eb,#3b82f6)" : "#27272a",
          color: ready && !submitting ? "#fff" : "#52525b",
        }}
      >
        {submitting ? "Creating account…" : "Continue"}
      </button>
      <p className="text-[13px] text-[#71717a] text-center mt-4">
        Already have an account?{" "}
        <span className="text-[#60a5fa] font-semibold cursor-pointer" onClick={() => navigate("/login")}>
          Log in
        </span>
      </p>
    </form>
  );
}
