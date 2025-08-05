import { useEffect, useState } from "react";
import { ProfileData, User } from "../_types/UserTypes";
import { useAuth } from "./useAuth";

export default function useUserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: authLoading } = useAuth();
  const userInfo = async (token: string): Promise<ProfileData | null> => {
    try {
      //   const res = await fetch(`${process.env.NEXT_API_BASE_URL}/profile`, {
      const res = await fetch(`http://144.91.75.57:8080/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchprofile = async () => {
      if (!token || authLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        const data = await userInfo(token);

        if (data?.user) {
          setUser(data.user);
        }
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchprofile();
  }, [token, authLoading]);

  return { userInfo, user, isloading, error };
}
