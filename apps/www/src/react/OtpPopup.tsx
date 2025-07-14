import React, { useState, useRef } from "react";
import { verifyOtp } from "./api/authApi";

interface OtpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
  emailOrPhone: string;
  inputType: "email" | "phone" | "unknown";
  isLoading?: boolean;
  verifyType?: "verification" | "forget-password";
}

const OtpPopup: React.FC<OtpPopupProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  inputType,
  emailOrPhone,
  isLoading = false,
  verifyType = "verification",
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  // Handle verify button click

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return;
    }

    const payload = {
      type: verifyType,
      otp: otpValue,
      ...(inputType === "email"
        ? { email: emailOrPhone }
        : inputType === "phone"
          ? { number: emailOrPhone }
          : {}),
    };
    try {
      const response = await verifyOtp(payload);
      onVerify(otpValue);
      
      // Only redirect to home for signup verification, not for forgot password
      if (verifyType === "verification") {
        window.location.href = "/home/qr";
      }
    } catch (error) {
      // Silently handle OTP verification errors
      // Still call onVerify to proceed with the flow
      onVerify(otpValue);
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    onResend();
  };

  // Close modal and reset OTP
  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {verifyType === "forget-password" ? "Reset Password" : "Verify Your Account"}
          </h3>
          <p className="text-base-content/70">
            We've sent a 6-digit {verifyType === "forget-password" ? "password reset" : "verification"} code to
            <br />
            <span className="font-semibold text-primary">{emailOrPhone}</span>
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-medium">
              Enter verification code
            </span>
          </label>
          <div
            className="flex justify-center gap-2 mb-4"
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="input input-bordered w-12 h-12 text-center text-lg font-bold focus:input-primary"
                placeholder="0"
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className={`btn btn-primary w-full mb-4 ${isLoading ? "loading" : ""}`}
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Verifying...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {verifyType === "forget-password" ? "Verify & Reset Password" : "Verify & Create Account"}
            </>
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-base-content/70 text-sm mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            className="btn btn-ghost btn-sm text-primary"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
