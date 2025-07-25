import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalid Email"),
  password: z.string().min(8, "password must be 8 charactar at least"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
