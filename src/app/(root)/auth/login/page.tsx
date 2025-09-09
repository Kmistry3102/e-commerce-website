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
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { loginSchema, VerifyOtpValues, type LoginValues } from "@/lib/zodSchema";
import axios, { AxiosError } from "axios";
import { showToast } from "@/lib/showToast";
import { WEBSITE_HOME, WEBSITE_REGISTER } from "@/routes/WebsiteRoute";
import OTPVerification from "@/components/Application/OTPVerification";
// import OTPVerification from "@/components/auth/OTPVerification"; // if you have it

type LoginApiResponse = {
  success: boolean;
  message: string;
};

type OtpApiResponse = {
  success: boolean;
  message: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      const { data } = await axios.post<LoginApiResponse>(
        "/api/auth/login",
        values
      );

      if (data.success) {
        setOtpEmail(values.email); // switch UI to OTP step
        form.reset();
        showToast({ type: "success", message: data.message });
      } else {
        showToast({ type: "error", message: data.message });
      }
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      showToast({
        type: "error",
        message: e.response?.data?.message ?? e.message ?? "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification
  const handleOtpVerification = async ( values :VerifyOtpValues) => {
    try {
      setOtpVerificationLoading(true);
      const { data } = await axios.post<OtpApiResponse>(
        "/api/auth/verify-otp",
        values
      );

      if (data.success) {
        setOtpEmail(values.email);
        showToast({ type: "success", message: data.message });
      } else {
        showToast({ type: "error", message: data.message });
      }
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      showToast({
        type: "error",
        message: e.response?.data?.message ?? e.message ?? "Login failed",
      });
    } finally {
      setOtpVerificationLoading(false);
    }
  }

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
                Login Into Account
              </h1>
              <p className="lg:text-base text-sm font-light">
                Login into your account by filling out the form below.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPwd ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="*********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-8 cursor-pointer"
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                      >
                        {showPwd ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Login"
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="text-center">
                  <div className="flex gap-1 items-center justify-center text-sm">
                    <p>
                      Don&apos;t have an account?{" "}
                      <Link
                        href={WEBSITE_REGISTER}
                        className="cursor-pointer hover:underline text-primary"
                      >
                        Create account!
                      </Link>
                    </p>
                  </div>
                  <div>
                    <Link
                      href={WEBSITE_HOME}
                      className="cursor-pointer hover:underline text-sm text-primary"
                    >
                      Forgot Password?
                    </Link>
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
