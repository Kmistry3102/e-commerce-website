import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonLoadingProps {
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const ButtonLoading = ({
  type,
  text,
  loading,
  className,
  onClick,
  ...ButtonProps
}: ButtonLoadingProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading}
      {...ButtonProps}
      className={cn("", className)}
    >
      {loading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};
export default ButtonLoading;
