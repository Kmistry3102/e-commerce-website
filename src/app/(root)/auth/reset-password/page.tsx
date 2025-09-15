"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
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
import Link from "next/link";
import { useState } from "react";
import {
  resetPasswordSchema,
  ResetPasswordValues,
  VerifyOtpValues,
} from "@/lib/zodSchema";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import OTPVerification from "@/components/Application/OTPVerification";
import axios, { AxiosError } from "axios";
import { showToast } from "@/lib/showToast";

export default function ResetPasswordPage() {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  const handleEmailVerification = (values: ResetPasswordValues) => {
    console.log(values);
  };

  // OTP Verification
  const handleOtpVerification = async (values: VerifyOtpValues) => {
    try {
      setOtpVerificationLoading(true);
      const { data } = await axios.post<VerifyOtpValues>(
        "/api/auth/verify-otp",
        values
      );
        
      if (data.success) {
        setOtpEmail(null); // Reset to show login form again
        showToast({ type: "success", message: data.message });
        // dispatch(login(data));
      } else {
        showToast({ type: "error", message: data.message });
      }
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      showToast({
        type: "error",
        message: e.response?.data?.message ?? e.message ?? "OTP verification failed",
      });
    } finally {
      setOtpVerificationLoading(false);
    }
  };
  return (
    <Card className="lg:w-[400px] md:w-[350px] w-[300px] mx-auto my-10 shadow-lg">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src="/assets/images/logo-black.png"
            alt="Logo"
            width={150}
            height={150}
            className="lg:max-w-[150px] max-w-[100px]"
          />
        </div>

        {!otpEmail ? (
          <>
            <div className="text-center mt-3 space-y-1">
              <h1 className="lg:text-3xl text-xl font-medium">
                Reset Password
              </h1>
              <p className="lg:text-base text-sm font-light">
                Enter your email to reset your password.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEmailVerification)}
                className="space-y-6 mt-6"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="username"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <ButtonLoading
                    loading={emailVerificationLoading}
                    type="submit"
                    text="Send OTP"
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="text-center">
                  <div className="flex gap-1 items-center justify-center text-sm">
                    <p>
                      Already have an account?{" "}
                      <Link
                        href={WEBSITE_LOGIN}
                        className="cursor-pointer hover:underline text-primary"
                      >
                        Back to Login!
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <OTPVerification
            email={otpEmail}
            loading={otpVerificationLoading}
            onSubmit={handleOtpVerification}
          />
        )}
      </CardContent>
    </Card>
  );
}
