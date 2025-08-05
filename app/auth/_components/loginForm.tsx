"use client";

import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/app/_schemas/loginSchema";
import { useLogin } from "@/app/_hooks/useLogin";

export default function LoginForm({
  handleCurrentPage,
  currentPage,
}: {
  handleCurrentPage?: (page: string) => void;
  currentPage: string;
}) {
  const { loginUser, serverError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  return (
    <>
      <form
        onSubmit={handleSubmit(loginUser)}
        className="flex justify-center items-center flex-col gap-4 w-full sm:px-10"
      >
        <InputWrap
          label="Email"
          registerType="email"
          register={register}
          errors={errors}
          inputType="email"
        />

        <InputWrap
          label="Password"
          registerType="password"
          register={register}
          errors={errors}
          inputType="password"
        />

        {serverError && <p>{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-main text-white px-6 py-1 rounded-full hover:bg-secondary disabled:opacity-50"
        >
          {isSubmitting ? "Signing..." : "Sign In"}
        </button>
      </form>
      <button
        className="mt-6 underline text-xs text-main"
        onClick={() =>
          handleCurrentPage?.(currentPage === "login" ? "register" : "login")
        }
      >
        {currentPage === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Sign In"}
      </button>
    </>
  );
}

function InputWrap({
  label,
  registerType,
  register,
  errors,
  inputType = "text",
}: {
  label: string;
  registerType: keyof LoginFormData;
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  inputType?: string;
}) {
  return (
    <div className="w-full flex justify-center items-center gap-2">
      <label className="block font-medium w-20">{label}</label>
      <div className="">
        <input
          type={inputType}
          {...register(registerType)}
          className="w-full rounded-md px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main"
          placeholder={label}
        />
        {errors[registerType] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[registerType].message}
          </p>
        )}
      </div>
    </div>
  );
}
