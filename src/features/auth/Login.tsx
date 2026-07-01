import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full h-12 rounded-[11px] bg-[#18181b] border border-[#27272a] text-[#fafafa] px-4 text-[15px] outline-none placeholder:text-[#52525b]";

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const ready = email.trim().length > 3 && password.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    // RequireOnboarding will bounce back to /onboarding/type if not yet complete.
    navigate("/app");
  }

  return (
    <form className="min-h-screen p-6" onSubmit={submit}>
      <MaterialIcon name="arrow_back" size={26} color="#a1a1aa" onClick={() => navigate("/")} className="mb-7" />
      <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Log in</h2>
      <p className="text-[15px] text-[#a1a1aa] mt-2 mb-7">Welcome back</p>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
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
        {submitting ? "Logging in…" : "Log In"}
      </button>
      <p className="text-[13px] text-[#71717a] text-center mt-4">
        Don't have an account?{" "}
        <span className="text-[#60a5fa] font-semibold cursor-pointer" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </p>
    </form>
  );
}
