import z from "zod";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("invalid email"),
  password: z.string().min(8, "password must be 8 charactar at least"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
