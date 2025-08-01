import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { userSignIn, forgotPassword, verifyOtp } from "./api/authApi";
import type { SignInFormData } from "./api/authApi";
import OtpPopup from "./OtpPopup";
import ResetPassword from "./ResetPassword";

interface SigninFormData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email?: string;
  number?: string;
}

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState<"email" | "phone" | "unknown">(
    "unknown"
  );
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] =
    useState<ForgotPasswordData | null>(null);

  // New states for verification flow
  const [showVerificationOtp, setShowVerificationOtp] = useState(false);
  const [userVerificationData, setUserVerificationData] = useState<any>(null);
  const [verificationEmailOrPhone, setVerificationEmailOrPhone] = useState("");
  const [verificationInputType, setVerificationInputType] = useState<
    "email" | "phone" | "unknown"
  >("unknown");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SigninFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const password = watch("password");
  const emailField = watch("email");

  // Function to detect if input is email or phone
  const detectInputType = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Normalize phone input (remove spaces, dashes, parentheses)
    const normalizedValue = value.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^[+]?[(]?\d{10,15}$/;

    if (emailRegex.test(value)) {
      setInputType("email");
    } else if (phoneRegex.test(normalizedValue)) {
      setInputType("phone");
    } else {
      setInputType("unknown");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!emailField || emailField.trim() === "") {
      return;
    }

    setIsLoading(true);

    // Prepare the data based on input type
    const submitData: ForgotPasswordData = {};

    // Determine if the input is email or phone and assign accordingly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputValue = emailField || "";
    const normalizedValue = inputValue.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^[+]?[(]?\d{10,15}$/;

    if (emailRegex.test(inputValue)) {
      submitData.email = inputValue;
    } else if (phoneRegex.test(normalizedValue)) {
      submitData.number = inputValue;
    } else {
      setIsLoading(false);
      return;
    }

    setForgotPasswordData(submitData);

    try {
      await forgotPassword(submitData);
      setShowOtpModal(true);
    } catch (error) {
      // Silently handle error, still show OTP modal for better UX
      setShowOtpModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP for forgot password
  const handleOtpVerify = async (otpValue: string) => {
    setOtpLoading(true);

    try {
      // The OTP verification is handled by the OtpPopup component
      // This function is called after successful verification
      setOtpLoading(false);
      setShowOtpModal(false);
      setShowResetModal(true);
    } catch (error) {
      setOtpLoading(false);
    }
  };

  // Resend OTP for forgot password
  const handleResendOtp = () => {
    // Silently handle resend
  };

  // Close OTP modal
  const closeOtpModal = () => {
    setShowOtpModal(false);
  };

  // Handle successful password reset
  const handleResetSuccess = () => {
    setShowResetModal(false);
    // Redirect to signin page
    window.location.href = "/auth/signinpage";
  };

  // Handle verification OTP
  const handleVerificationOtpVerify = async (otpValue: string) => {
    setOtpLoading(true);

  
    setTimeout(() => {
      setOtpLoading(false);
      setShowVerificationOtp(false);
      // Redirect to QR page after successful verification
      window.location.href = "/home/qr";
    }, 1000);
  };

  // Resend verification OTP
  const handleVerificationResendOtp = () => {
    // Silently handle resend for verification
  };

  // Close verification OTP modal
  const closeVerificationOtpModal = () => {
    setShowVerificationOtp(false);
  };

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true);

    try {
      const apiData: SignInFormData = { password: data.password };

      // Determine if the input is email or phone and assign accordingly
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const inputValue = data.email || "";
      const normalizedValue = inputValue.replace(/[\s\-\(\)]/g, "");
      const phoneRegex = /^[+]?[(]?\d{10,15}$/;

      if (emailRegex.test(inputValue)) {
        apiData.email = inputValue;
      } else if (phoneRegex.test(normalizedValue)) {
        apiData.number = inputValue;
      }

      const response = await userSignIn(apiData);

      // Check verification status
      const { id, isNumberVerified, isEmailVerified } = response;

      // If both are false, show verification OTP
      if (!isNumberVerified && !isEmailVerified) {
        // Store user data for verification
        setUserVerificationData(response);

        // Determine which field to verify (prefer email if available, otherwise phone)
        if (apiData.email) {
          setVerificationEmailOrPhone(apiData.email);
          setVerificationInputType("email");
        } else if (apiData.number) {
          setVerificationEmailOrPhone(apiData.number);
          setVerificationInputType("phone");
        }

        // Show verification OTP modal
        setShowVerificationOtp(true);
      } else {
        // At least one verification is true, proceed to QR page
        window.location.href = "/home/qr";
      }
    } catch (error) {
      // Silently handle signin errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center gap-8">
        {/* Left Side - Welcome Text (50% width) */}
        <div className="w-1/2 hidden lg:block">
          <div className="text-left">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              Welcome Back to
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Personal QR
              </span>
            </h1>
            <p className="text-lg text-base-content/70 mb-6">
              Sign in to manage your QR codes and create amazing experiences
            </p>
            <div className="space-y-4 text-base-content/60">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure and fast authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Access all your QR codes instantly</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Manage and track your analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form (50% width) */}
        <div className="w-full lg:w-1/2">
          {/* Mobile Header - Only visible on mobile */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold mb-2">
              Welcome Back to
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Personal QR
              </span>
            </h1>
            <p className="text-base-content/70">
              Sign in to manage your QR codes
            </p>
          </div>

          {/* Sign In Card */}
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl font-bold mb-6 justify-center">
                Sign In
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email or Phone Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Email or Phone
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your email or phone number"
                      className={`input input-bordered w-full pl-12 focus:input-primary ${
                        errors.email ? "input-error" : ""
                      }`}
                      {...register("email", {
                        required: "Email or phone number is required",
                        validate: (value) => {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          const phoneRegex = /^[+]?[(]?\d{10,15}$/;
                          const input = value || "";

                          if (
                            emailRegex.test(input) ||
                            phoneRegex.test(input.replace(/[\s\-\(\)]/g, ""))
                          ) {
                            return true;
                          }
                          return "Please enter a valid email address or phone number";
                        },
                        onChange: (e) => {
                          detectInputType(e.target.value);
                        },
                      })}
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {inputType === "email" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      ) : inputType === "phone" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      )}
                    </svg>
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`input input-bordered w-full pl-12 pr-12 focus:input-primary ${
                        errors.password ? "input-error" : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message:
                            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                        },
                      })}
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.password.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className="label-text ml-2">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="link link-primary text-sm"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing In...
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-base-content/70">
                  Don't have an account?
                  <a href="/auth/signuppage" className="link link-primary ml-1">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-base-content/60">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="link">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Popup for Forgot Password */}
      <OtpPopup
        isOpen={showOtpModal}
        onClose={closeOtpModal}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        emailOrPhone={
          forgotPasswordData?.email || forgotPasswordData?.number || ""
        }
        isLoading={otpLoading}
        inputType={inputType}
        verifyType="forget-password"
      />

      {/* Reset Password Modal */}
      <ResetPassword
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onResetSuccess={handleResetSuccess}
      />

      {/* Verification OTP Popup */}
      <OtpPopup
        isOpen={showVerificationOtp}
        onClose={closeVerificationOtpModal}
        onVerify={handleVerificationOtpVerify}
        onResend={handleVerificationResendOtp}
        emailOrPhone={verificationEmailOrPhone}
        isLoading={otpLoading}
        inputType={verificationInputType}
        verifyType="verification"
      />
    </div>
  );
};

export default Signin;
