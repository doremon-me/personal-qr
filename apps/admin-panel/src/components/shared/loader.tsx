import React from "react";
import { cn } from "@/lib/utils";
import Icon from "./icon";

interface LoaderProps {
  variant?: "fullscreen" | "inline";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  showTrustBadge?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  variant = "inline",
  size = variant === "fullscreen" ? "xl" : "md",
  message = variant === "fullscreen"
    ? "Loading your secure experience..."
    : "Processing securely",
  showTrustBadge = true,
  className,
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
    xl: 72,
  };

  const iconSize = sizeMap[size];
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative">
          <Icon
            name="Loader2"
            size={iconSize}
            className="animate-spin text-primary"
          />
          {showTrustBadge && size !== "sm" && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-2 w-2 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {message && <span className="text-sm font-medium">{message}</span>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="relative">
          <Icon
            name="Loader2"
            size={iconSize}
            className="animate-spin text-primary"
          />
          {showTrustBadge && (
            <div className="absolute -bottom-3 -right-3 rounded-full bg-green-500 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-medium text-foreground">{message}</p>
          <p className="text-base text-muted-foreground">
            Verified secure connection 🔒
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
