// useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token validation utility
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Token validation error:", error);
      return false;
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
      router.push("/auth");
      setIsLoading(false);
    } else {
      if (!isTokenValid(jwtToken)) {
        localStorage.removeItem("token");
        router.push("/auth");
        setIsLoading(false);
        return;
      }

      setToken(jwtToken);
      setIsLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/auth");
  };

  // Handle unauthorized errors
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/auth");
  };

  return {
    token,
    isLoading,
    logout,
    handleUnauthorized,
    isAuthenticated: !!token,
  };
};
