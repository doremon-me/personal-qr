import React, { useState, useEffect } from "react";
import { scanQr, verifyProfile } from "./api/authApi";

interface Contact {
  id: string;
  profileId: string;
  contactPersonName: string;
  contactPersonNumber: string;
}

const QrScan = () => {
  const [profileId, setProfileId] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<"input" | "otp" | "profile">("input");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Get profile ID from URL parameters or hash
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");

    // Also check if it's in the hash (for QR code redirects)
    if (!id && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      id = hashParams.get("id");
    }

    // Also check if the entire URL contains the profile ID pattern
    if (!id) {
      const currentUrl = window.location.href;
      const profileIdMatch = currentUrl.match(/[?&]id=([^&]+)/);
      if (profileIdMatch) {
        id = profileIdMatch[1];
      }
    }

    // Check if someone came here by scanning QR code directly
    // QR code might contain just {"profileId": "some-id"}
    if (!id) {
      // Try to get from localStorage if it was stored from QR scan
      const scannedData = localStorage.getItem("scannedQrData");
      if (scannedData) {
        try {
          const parsed = JSON.parse(scannedData);
          if (parsed.profileId) {
            id = parsed.profileId;
            localStorage.removeItem("scannedQrData"); // Clean up
          }
        } catch (e) {
          console.log("Error parsing scanned QR data:", e);
        }
      }
    }

    console.log("Profile ID from URL:", id);
    console.log("Current URL:", window.location.href);

    if (id) {
      setProfileId(id);
    }
  }, []);

  const handleMobileSubmit = async () => {
    if (!mobileNumber) {
      setError("Please enter your mobile number");
      return;
    }

    if (!profileId) {
      setError("Profile ID not found. Please scan the QR code again.");
      return;
    }

    // Basic mobile number validation
    const mobileRegex = /^[+]?[(]?\d{10,15}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setError("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await scanQr(profileId, { number: mobileNumber });
      setStep("otp");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyProfile({ number: mobileNumber, otp });
      console.log("Verify Profile Response:", response);

      // Backend returns array of contacts directly
      if (Array.isArray(response)) {
        setContacts(response);
        setStep("profile");
      } else {
        setError("Invalid response format from server");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setMobileNumber("");
    setOtp("");
    setStep("input");
    setContacts([]);
    setError("");
  };

  if (step === "profile" && contacts.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">Emergency Contacts</span>
            </h1>
            <p className="text-lg text-base-content/70">
              Contact information retrieved successfully
            </p>
          </div>

          {/* Contacts */}
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body p-6 lg:p-8">
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="bg-base-200/50 p-6 rounded-lg border border-base-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        Contact {index + 1}
                      </h3>
                      <div className="badge badge-primary badge-lg">
                        Emergency
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 uppercase tracking-wide">
                          Name
                        </label>
                        <p className="text-2xl font-bold text-base-content mt-1">
                          {contact.contactPersonName}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-base-content/70 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <p className="text-2xl font-bold text-base-content mt-1 font-mono">
                          {contact.contactPersonNumber}
                        </p>
                      </div>
                    </div>

                    {/* Call Button */}
                    <div className="mt-6">
                      <a
                        href={`tel:${contact.contactPersonNumber}`}
                        className="btn btn-primary btn-lg w-full"
                      >
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Call {contact.contactPersonName}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={resetScan}
                  className="btn btn-outline btn-primary"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Scan Another QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl border border-primary/20 w-full max-w-md">
        <div className="card-body p-6">
          {/* Header */}
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
                  d="M3 7H9V3H3V7ZM15 3V7H21V3H15ZM3 21H9V15H3V21ZM12 12H15V9H12V12ZM12 15H15V12H12V15ZM12 21H15V18H12V21ZM18 12H21V9H18V12ZM18 15H21V12H18V15ZM18 21H21V18H18V21Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">
              {step === "input" ? "Access Profile" : "Verify OTP"}
            </h2>
            <p className="text-base-content/70 mt-2">
              {step === "input"
                ? profileId
                  ? "Enter your mobile number to access the profile"
                  : "Scan a QR code or enter the Profile ID to continue"
                : "Enter the OTP sent to your mobile number"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-4">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

        
        
          {/* Mobile Number Input */}
          {step === "input" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Mobile Number *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="input input-bordered w-full pl-12 focus:input-primary"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isLoading}
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleMobileSubmit}
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                disabled={isLoading || !mobileNumber}
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
                        d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Get OTP
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP Input */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    OTP sent to {mobileNumber}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="input input-bordered w-full pl-12 focus:input-primary text-center text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    disabled={isLoading}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("input")}
                  className="btn btn-outline flex-1"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  onClick={handleOtpSubmit}
                  className={`btn btn-primary flex-1 ${isLoading ? "loading" : ""}`}
                  disabled={isLoading || otp.length !== 6}
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
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrScan;
