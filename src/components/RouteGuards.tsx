import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-9 h-9 rounded-full border-2 border-[#3f3f46] border-t-[#a855f7] animate-spin" />
    </div>
  );
}

/** Blocks access unless signed in. Used for onboarding + the main app. */
export function RequireAuth() {
  const { session, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!session) return <Navigate to="/" replace />;
  return <Outlet />;
}

/** Blocks access to the main app until onboarding is complete. */
export function RequireOnboarding() {
  const { profile, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding/type" replace />;
  return <Outlet />;
}

/** Sends already-onboarded users straight into the app instead of Welcome/signup/login. */
export function RedirectIfOnboarded({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (session && profile?.onboarding_completed) return <Navigate to="/app" replace />;
  return <>{children}</>;
}
