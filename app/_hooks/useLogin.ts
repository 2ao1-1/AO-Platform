import { useRouter } from "next/navigation";
import { LoginFormData } from "../_schemas/loginSchema";
import { useState } from "react";

export function useLogin() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");

  const loginUser = async (loginData: LoginFormData) => {
    setServerError("");
    setToken("");

    try {
      //const res = await fetch("https://platform.2ao1.space/api/auth/login", {
      const res = await fetch("http://144.91.75.57:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        throw new Error("faild to sign");
      }

      const json = await res.json();
      setToken(json.token);

      if (json.token) {
        // tempo solution untill i know how to use http-only cookie
        localStorage.setItem("token", json.token);
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

  return { loginUser, serverError, token };
}
