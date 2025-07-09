import React, { useState } from "react";
import { useForm } from "react-hook-form";
import OtpPopup from "./OtpPopup";

interface SignupFormData {
  name: string;
  emailOrPhone: string;
  password: string;

  agreeToTerms: boolean;
}

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [inputType, setInputType] = useState<"email" | "phone" | "unknown">(
    "unknown"
  );
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      emailOrPhone: "",
      password: "",

      agreeToTerms: false,
    },
  });

  const password = watch("password");

  // Function to detect if input is email or phone
  const detectInputType = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?\d+[)\-\s]?[\d\-\s]*$/;

    if (emailRegex.test(value)) {
      setInputType("email");
    } else if (
      phoneRegex.test(value) &&
      value.replace(/[\s\-\(\)]/g, "").length >= 10
    ) {
      setInputType("phone");
    } else {
      setInputType("unknown");
    }
  };

  // Submit signup form (opens OTP modal)
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSignupData(data);

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpModal(true);
    }, 1000);
  };

  // Verify OTP and complete signup
  const handleOtpVerify = async (otpValue: string) => {
    setOtpLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setOtpLoading(false);

      // Check if OTP is correct (for demo, any 6-digit code works)
      if (otpValue === "123456") {
        alert("Account created successfully!");
        setShowOtpModal(false);
        // Redirect to dashboard or login
      } else {
        alert("Invalid OTP. Try 123456 for demo.");
      }
    }, 1500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    // Simulate resending OTP
    alert(`OTP sent to ${signupData?.emailOrPhone}`);
  };

  // Close OTP modal
  const closeOtpModal = () => {
    setShowOtpModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center gap-8">
        {/* Left Side - Welcome Text (50% width) */}
        <div className="w-1/2 hidden lg:block">
          <div className="text-left">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              Join the Future of
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Personal QR
              </span>
            </h1>
            <p className="text-lg text-base-content/70 mb-6">
              Create your account and start building amazing QR experiences
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
                <span>Create unlimited QR codes</span>
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
                <span>Advanced analytics and tracking</span>
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
                <span>Custom designs and branding</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form (50% width) */}
        <div className="w-full lg:w-1/2">
          {/* Mobile Header - Only visible on mobile */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold mb-2">
              Join the Future of
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Personal QR
              </span>
            </h1>
            <p className="text-base-content/70">
              Create your account and start building amazing QR experiences
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl font-bold mb-6 justify-center">
                Create Account
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* All your existing form fields here... */}
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`input input-bordered w-full pl-12 focus:input-primary ${
                        errors.name ? "input-error" : ""
                      }`}
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Name can only contain letters and spaces",
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name.message}
                      </span>
                    </label>
                  )}
                </div>

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
                        errors.emailOrPhone ? "input-error" : ""
                      }`}
                      {...register("emailOrPhone", {
                        required: "Email or phone number is required",
                        validate: (value) => {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          const phoneRegex = /^[+]?[(]?\d{10,15}$/;

                          if (
                            emailRegex.test(value) ||
                            phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))
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
                  {errors.emailOrPhone && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.emailOrPhone.message}
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
                      placeholder="Create a strong password"
                      className={`input input-bordered w-full pl-12 pr-12 focus:input-primary ${
                        errors.password ? "input-error" : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                          message:
                            "Password must contain uppercase, lowercase, number, and special character",
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

                {/* Terms & Conditions */}
                <div className="form-control">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
                      {...register("agreeToTerms", {
                        required: "You must agree to the terms and conditions",
                      })}
                    />
                    <div className="text-sm leading-relaxed text-base-content/80">
                      I agree to the{" "}
                      <a href="#" className="link link-primary inline-block">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="link link-primary inline-block">
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                  {errors.agreeToTerms && (
                    <div className="mt-2">
                      <span className="text-xs text-error">
                        {errors.agreeToTerms.message}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending OTP...
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-base-content/70">
                  Already have an account?
                  <a href="/auth/signinpage" className="link link-primary ml-1">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use the OTP Popup Component */}
      <OtpPopup
        isOpen={showOtpModal}
        onClose={closeOtpModal}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        emailOrPhone={signupData?.emailOrPhone || ""}
        isLoading={otpLoading}
      />
    </div>
  );
};

export default Signup;
