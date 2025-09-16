"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { updatePasswordSchema, UpdatePasswordValues } from "@/lib/zodSchema";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

export default function UpdatePassword({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      email,
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const handlePasswordUpdate = async (data: UpdatePasswordValues) => {
    try {
      setLoading(true);
      const { data: updatePasswordResponse } = await axios.put(
        "/api/auth/reset-password/update-password",
        data
      );

      if (updatePasswordResponse.success) {
        form.reset();
        showToast({ type: "success", message: updatePasswordResponse.message });
        router.push(WEBSITE_LOGIN);
      } else {
        showToast({ type: "error", message: updatePasswordResponse.message });
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Update password failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mt-2 space-y-1">
        <h1 className="lg:text-3xl text-xl font-medium">Update password</h1>
        <p className="lg:text-base text-sm font-light">
          Update password for your {email}.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePasswordUpdate)}
          className="space-y-6 mt-6"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="*********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-8"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="*********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-8"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonLoading
            loading={loading}
            type="submit"
            text="Update password"
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
}
