// src/lib/zodSchema.ts
import { z } from "zod";

const email = z.string().trim().toLowerCase()
  .email("Enter a valid email address")
  .max(254, "Email is too long");

const fullName = z.string().trim()
  .min(2, "Full name is too short")
  .max(80, "Full name is too long")
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Enter a valid full name")
  .transform(v => v.replace(/\s+/g, " "));

const tooCommon = new Set([
  "password","123456","12345678","qwerty","111111",
  "iloveyou","admin","welcome","letmein",
]);

const strongPassword = z.string()
  .min(8, "Use at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/\d/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a symbol")
  .refine(v => !/\s/.test(v), "No spaces allowed")
  .refine(v => !tooCommon.has(v.toLowerCase()), "Password is too common");

const loginPassword = z.string().min(1, "Password is required");

export const loginSchema = z.object({
  email,
  password: loginPassword,
});

export const signupSchema = z.object({
  fullName,
  email,
  password: strongPassword,
  confirmPassword: z.string(),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});

export type LoginValues  = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

/* Optional: typed factory with overloads (useful elsewhere) */
export function makeAuthSchema(kind: "login"): typeof loginSchema;
export function makeAuthSchema(kind: "signup"): typeof signupSchema;
export function makeAuthSchema(kind: "login" | "signup") {
  return kind === "login" ? loginSchema : signupSchema;
}
