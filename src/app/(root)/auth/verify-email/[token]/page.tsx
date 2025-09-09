"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

export default function EmailVerification() {
  const params = useParams();
  const token = params.token as string;

  const [isVerified, setIsVerified] = React.useState<boolean | null>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const { data: VerificationResponse } = await axios.post(
        "/api/auth/verify-email",
        { token }
      );

      if (VerificationResponse.success) {
        setIsVerified(true);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <>
      <Card className="lg:w-[400px] md:w-[360px] w-[300px] mx-auto my-10 shadow-lg">
        <CardContent>
          {isVerified ? (
            <div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/images/verified.gif"
                  alt="verified"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <h1 className="lg:text-2xl lg:mb-4 mb-2 text-xl font-medium text-green-600">
                  Email Verification success !
                </h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/images/verification-failed.gif"
                  alt="verified"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <h1 className="lg:text-2xl lg:mb-4 mb-2 text-xl font-medium text-red-600">
                  Email Verification Failed !
                </h1>
                <Button asChild >
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
