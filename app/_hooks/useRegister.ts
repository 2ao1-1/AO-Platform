import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "../_schemas/schemas";

export function useRegister() {
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const registerUser = async (
    registerData: RegisterFormData
  ): Promise<void> => {
    setServerError("");
    setToken("");

    try {
      //const res = await fetch("https://platform.2ao1.space/api/auth/register", {
      const res = await fetch("http://144.91.75.57:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!res.ok) throw new Error("faild to create a new accont");

      const data = await res.json();
      setToken(data.token);

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unknown error occurred");
      }
    }
  };

  return { registerUser, serverError, token };
}
