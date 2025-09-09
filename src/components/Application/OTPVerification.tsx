import { verifyOtpSchema, VerifyOtpValues } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import ButtonLoading from "./ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface OTPProps {
  email: string;
  loading: boolean;
  onSubmit: (values: VerifyOtpValues) => void; // email + otp
  onResend?: () => void;
}

export default function OTPVerification({
  email,
  onSubmit,
  loading,
}: OTPProps) {
  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema), // <- uses 6-digit OTP schema
    defaultValues: { email, otp: "" },
    mode: "onSubmit",
  });

  const handleOTPSubmit = async (data: VerifyOtpValues) => {
    onSubmit(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOTPSubmit)}
          className="space-y-6 mt-2 "
        >
          <div className="text-center">
            <h1 className="lg:text-2xl text-xl font-normal">
              Please Complete Verification
            </h1>
            <p className="lg:text-sm text-sm font-light">
              We have sent an One-time password (OTP) to your registered email
              address.The OTP is valid for 10 minutes only.
            </p>
          </div>

          {/* OTP */}
          <div className="">
            <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-10 lg:ml-22">One-time Password (OTP)</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={0} />
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={1} />
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={2} />
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={3} />
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={4} />
                        <InputOTPSlot className="text-lg lg:text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          </div>

          <div className="mb-3">
            <ButtonLoading
              loading={loading}
              type="submit"
              text="Verify"
              className="w-full cursor-pointer"
            />
            <div className="text-center mt-3">
                <button type="button" className="text-blue-600 hover:underline cursor-pointer">Resend OTP</button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
