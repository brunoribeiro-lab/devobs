import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, "Informe o email.")
    .pipe(z.email({ message: "Informe um email válido." })),
  password: z.string().min(1, "Informe a senha."),
});

export type LoginSchema = z.infer<typeof loginSchema>;