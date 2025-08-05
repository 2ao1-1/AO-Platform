"use client";

import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../../_schemas/schemas";
import { useRegister } from "../../_hooks/useRegister";

export default function RegisterForm({
  handleCurrentPage,
  currentPage,
}: {
  handleCurrentPage?: (page: string) => void;
  currentPage: string;
}) {
  const { registerUser, serverError } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  return (
    <>
      <form
        onSubmit={handleSubmit(registerUser)}
        className="flex justify-center items-center flex-col gap-4 w-full sm:px-10"
      >
        <div className="flex w-full md:flex-col flex-row md:gap-4 gap-2">
          <InputWrap
            label="First Name"
            registerType="firstName"
            register={register}
            errors={errors}
          />

          <InputWrap
            label="Last Name"
            registerType="lastName"
            register={register}
            errors={errors}
          />
        </div>

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

        {serverError && <p className="text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-main text-white px-6 py-1 rounded-full hover:bg-secondary disabled:opacity-50"
        >
          {isSubmitting ? "Registering..." : "Register"}
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
  registerType: keyof RegisterFormData;
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  inputType?: string;
}) {
  return (
    <div className="w-full flex justify-center items-center gap-2">
      <label className="block font-medium w-20">{label}</label>
      <div className="">
        <input
          type={inputType}
          {...register(registerType)}
          className="w-full rounded-md px-4  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main"
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
