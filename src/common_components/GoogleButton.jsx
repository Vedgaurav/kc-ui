import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/auth/AuthContext";
import api from "@/api/axios";

export function GoogleButton({ onClick }) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (credentialResponse) => {
        try {
          setIsLoading(true);

          const res = await api.post(
            "/auth/google",
            { idToken: credentialResponse.credential },
            { withCredentials: true }
          );

          login(res.data.userDto);
        } catch (err) {
          console.error("Google login failed", err);
        } finally {
          setIsLoading(false);
        }
      },
    });
  }, [login]);

  const handleClick = () => {
    if (!window.google) return;
    window.google.accounts.id.prompt();
  };

  return (
    <button
      onClick={handleClick}
      className="
          group relative flex w-full items-center justify-center gap-3
          rounded-xl border border-border
          bg-background px-4 py-2.5
          text-sm font-medium text-foreground
          shadow-sm transition-all
          hover:bg-muted hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-ring
          active:scale-[0.98]
        "
    >
      <GoogleIcon />

      <span className="whitespace-nowrap">Continue with Google</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19-8.5 19-19 0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.4 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-3 5-5.6 6.6l6.3 5.2C39.9 36.1 43 30.6 43 25c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
