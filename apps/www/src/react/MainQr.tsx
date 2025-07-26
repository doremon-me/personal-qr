import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useAuth from "./hooks/useAuth";
import { crateProfile, getProfile, updateProfile } from "./api/authApi";
import * as QRCode from "qrcode";

interface Contact {
  id?: string;
  contactPersonName: string;
  contactPersonNumber: string;
}

interface QrFormData {
  name?: string;
  email?: string;
  phone?: string;
  motherName: string;
  fatherName: string;
  contacts: Contact[];
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  number: string | null;
  userId: string;
  type?: string;
  motherName: string;
  fatherName: string;
  createdAt: string;
  updatedAt: string;
  Contacts: Contact[];
}

const MainQr = () => {
  const { isLoaded, isAuthenticated, id } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<ProfileData | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<QrFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      motherName: "",
      fatherName: "",
      contacts: [{ contactPersonName: "", contactPersonNumber: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const watchedContacts = watch("contacts");
  const watchedMotherName = watch("motherName");
  const watchedFatherName = watch("fatherName");
  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedPhone = watch("phone");

  const hasDataChanged = useCallback(
    (formData: QrFormData) => {
      if (!existingProfile) return true;

      // Compare personal information
      if (formData.name !== existingProfile.name) return true;
      if (formData.email !== existingProfile.email) return true;
      if (formData.phone !== existingProfile.number) return true;
      if (formData.motherName !== existingProfile.motherName) return true;
      if (formData.fatherName !== existingProfile.fatherName) return true;

      // Compare contacts
      const existingContacts = existingProfile.Contacts || [];
      const newContacts = formData.contacts.filter(
        (contact) =>
          contact.contactPersonName.trim() !== "" ||
          contact.contactPersonNumber.trim() !== ""
      );

      if (existingContacts.length !== newContacts.length) return true;

      for (let i = 0; i < existingContacts.length; i++) {
        const existing = existingContacts[i];
        const updated = newContacts[i];

        if (!updated) return true;

        if (existing.contactPersonName !== updated.contactPersonName)
          return true;
        if (existing.contactPersonNumber !== updated.contactPersonNumber)
          return true;
      }

      return false;
    },
    [existingProfile]
  );

  const currentDataChanged = useMemo(() => {
    if (!existingProfile) return false;

    const currentData: QrFormData = {
      name: watchedName || "",
      email: watchedEmail || "",
      phone: watchedPhone || "",
      motherName: watchedMotherName || "",
      fatherName: watchedFatherName || "",
      contacts: watchedContacts || [],
    };

    return hasDataChanged(currentData);
  }, [
    existingProfile,
    watchedName,
    watchedEmail,
    watchedPhone,
    watchedMotherName,
    watchedFatherName,
    watchedContacts,
    hasDataChanged,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      loadExistingProfile();
    }
  }, [isAuthenticated]);

  const loadExistingProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const profileData = await getProfile();
      console.log("Existing profile data:", profileData);

      if (profileData) {
        setExistingProfile(profileData);

        // Populate personal information fields
        setValue("name", profileData.name || "");
        setValue("email", profileData.email || "");
        setValue("phone", profileData.number || "");
        setValue("motherName", profileData.motherName || "");
        setValue("fatherName", profileData.fatherName || "");

        if (profileData.Contacts && profileData.Contacts.length > 0) {
          const formattedContacts = profileData.Contacts.map(
            (contact: any) => ({
              id: contact.id,
              contactPersonName: contact.contactPersonName || "",
              contactPersonNumber: contact.contactPersonNumber || "",
            })
          );
          setValue("contacts", formattedContacts);
        }
      }
    } catch (error) {
      console.log("No existing profile found or error loading profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const refreshProfile = async () => {
    await loadExistingProfile();
  };

  if (!isLoaded || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/auth/signinpage";
    return null;
  }

  let userData = sessionStorage.getItem("userData");
  console.log("User Data:", userData);

  const addContact = () => {
    append({ contactPersonName: "", contactPersonNumber: "" });
  };

  const removeContact = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = async (formData: QrFormData) => {
    try {
      // Use only the profile ID in QR code if profile exists - make it a URL
      const qrData = existingProfile
        ? `https://prqr.in/qr/scan?id=${existingProfile.id}`
        : JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            motherName: formData.motherName,
            fatherName: formData.fatherName,
            contacts: formData.contacts.filter(
              (contact) =>
                contact.contactPersonName.trim() !== "" ||
                contact.contactPersonNumber.trim() !== ""
            ),
          });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  const onSubmit = async (data: QrFormData) => {
    // Only validate required fields (mother and father name)
    if (!data.motherName?.trim()) {
      alert("Please enter your mother's name");
      return;
    }
    
    if (!data.fatherName?.trim()) {
      alert("Please enter your father's name");
      return;
    }

    setIsLoading(true);

    const filteredContacts = data.contacts.filter(
      (contact) =>
        contact.contactPersonName.trim() !== "" ||
        contact.contactPersonNumber.trim() !== ""
    );

    const formData = {
      ...data,
      contacts: filteredContacts,
    };

    console.log("QR Form Data:", formData);    try {
      let profileResponse: ProfileData | null = null;
      const dataChanged = hasDataChanged(formData);

      if (existingProfile && !dataChanged) {
        console.log("No changes detected, regenerating QR code only");
        await generateQRCode(formData);
        setIsLoading(false);
        return;
      }

      if (existingProfile && dataChanged) {
        const updateData = {
          id: existingProfile.id,
          ...(data.name?.trim() && { name: data.name.trim() }),
          ...(data.email?.trim() && { email: data.email.trim() }),
          ...(data.phone?.trim() && { number: data.phone.trim() }),
          motherName: data.motherName,
          fatherName: data.fatherName,
          contacts: filteredContacts,
        };

        console.log("Data changed, updating profile:", updateData);
        profileResponse = await updateProfile(updateData);
        console.log("Profile updated successfully:", profileResponse);

        setExistingProfile((prev) =>
          prev ? { ...prev, ...profileResponse } : profileResponse
        );
      } else if (!existingProfile) {
        const profileData = {
          ...(data.name?.trim() && { name: data.name.trim() }),
          ...(data.email?.trim() && { email: data.email.trim() }),
          ...(data.phone?.trim() && { number: data.phone.trim() }),
          motherName: data.motherName,
          fatherName: data.fatherName,
          contacts: filteredContacts,
        };

        console.log("Creating new profile data:", profileData);
        profileResponse = await crateProfile(profileData);
        console.log("Profile created successfully:", profileResponse);

        setExistingProfile(profileResponse);
      }

      await generateQRCode(formData);

      // After QR generation, fetch the latest profile data
      if (profileResponse) {
        console.log("Fetching latest profile data after QR generation...");
        await refreshProfile();
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error:", error);

      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        const action = existingProfile ? "update" : "create";
        alert(
          `Failed to ${action} profile and generate QR code. Please try again.`
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {existingProfile ? "Update Your" : "Create Your"}
            <br />
            <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Personal QR Code
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            {existingProfile
              ? "Update your information to regenerate your personalized QR code"
              : "Fill in your information to generate a personalized QR code"}
          </p>
          {existingProfile && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-success"
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
              <span className="text-sm text-success font-medium">
                Profile loaded • Created:{" "}
                {new Date(existingProfile.createdAt).toLocaleDateString()}
              </span>
              {currentDataChanged && (
                <span className="badge badge-warning badge-sm ml-2">
                  <svg
                    className="w-3 h-3 mr-1"
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
                  Changes detected
                </span>
              )}
              <button
                type="button"
                onClick={refreshProfile}
                className="btn btn-ghost btn-xs"
                title="Refresh Profile"
              >
                <svg
                  className="w-3 h-3"
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
              </button>
            </div>
          )}
        </div>

        {/* Main Form Card */}
        <div className="card bg-base-100 shadow-xl border border-primary/20">
          <div className="card-body p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="divider divider-primary">
                  <span className="text-lg font-semibold text-primary">
                    Personal Information
                  </span>
                </div>

                {/* Photo Upload Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Profile Photo
                    </span>
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    {/* Photo Preview */}
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-full border-2 border-primary/20">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <img
                            src="https://avatar.iran.liara.run/public"
                            alt="Default Avatar"
                            className="w-full h-full object-cover rounded-full opacity-50"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name and Email Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Full Name
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your full name (optional)"
                        className={`input input-bordered w-full pl-12 focus:input-primary ${
                          errors.name ? "input-error" : ""
                        }`}
                        {...register("name", {
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
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

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email address (optional)"
                        className={`input input-bordered w-full pl-12 focus:input-primary ${
                          errors.email ? "input-error" : ""
                        }`}
                        {...register("email", {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email address",
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
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
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Phone Number
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      className={`input input-bordered w-full pl-12 focus:input-primary ${
                        errors.phone ? "input-error" : ""
                      }`}
                      {...register("phone", {
                        pattern: {
                          value: /^[+]?[(]?\d{10,15}$/,
                          message: "Please enter a valid phone number",
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  {errors.phone && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.phone.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Parents Information Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mother's Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Mother's Name *
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter mother's name"
                        className={`input input-bordered w-full pl-12 focus:input-primary ${
                          errors.motherName ? "input-error" : ""
                        }`}
                        {...register("motherName", {
                          required: "Mother's name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    {errors.motherName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.motherName.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Father's Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Father's Name *
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter father's name"
                        className={`input input-bordered w-full pl-12 focus:input-primary ${
                          errors.fatherName ? "input-error" : ""
                        }`}
                        {...register("fatherName", {
                          required: "Father's name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    {errors.fatherName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.fatherName.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact List Section */}
              <div className="space-y-6">
                <div className="divider divider-secondary">
                  <span className="text-lg font-semibold text-secondary">
                    Emergency Contacts
                  </span>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-base-200/50 p-4 rounded-lg border border-base-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-base-content">
                          Contact {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContact(index)}
                            className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contact Name */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Contact Name
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter contact name"
                              className={`input input-bordered w-full pl-10 focus:input-primary ${
                                errors.contacts?.[index]?.contactPersonName
                                  ? "input-error"
                                  : ""
                              }`}
                              {...register(
                                `contacts.${index}.contactPersonName` as const,
                                {
                                  required: "Contact name is required",
                                  minLength: {
                                    value: 2,
                                    message:
                                      "Name must be at least 2 characters",
                                  },
                                }
                              )}
                            />
                            <svg
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
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
                          {errors.contacts?.[index]?.contactPersonName && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {
                                  errors.contacts[index]?.contactPersonName
                                    ?.message
                                }
                              </span>
                            </label>
                          )}
                        </div>

                        {/* Contact Number */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Phone Number
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder="Enter phone number"
                              className={`input input-bordered w-full pl-10 focus:input-primary ${
                                errors.contacts?.[index]?.contactPersonNumber
                                  ? "input-error"
                                  : ""
                              }`}
                              {...register(
                                `contacts.${index}.contactPersonNumber` as const,
                                {
                                  pattern: {
                                    value: /^[+]?[(]?\d{10,15}$/,
                                    message:
                                      "Please enter a valid phone number",
                                  },
                                }
                              )}
                            />
                            <svg
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
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
                          {errors.contacts?.[index]?.contactPersonNumber && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {
                                  errors.contacts[index]?.contactPersonNumber
                                    ?.message
                                }
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Contact Button */}
                  <button
                    type="button"
                    onClick={addContact}
                    className="btn btn-outline btn-primary w-full"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Another Contact
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview QR Code
                </button>

                <button
                  type="submit"
                  className={`btn btn-primary flex-1 order-1 sm:order-2 ${
                    isLoading ? "loading" : ""
                  }`}
                  disabled={
                    isLoading || 
                    !watchedMotherName?.trim() || 
                    !watchedFatherName?.trim()
                  }
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {existingProfile && currentDataChanged
                        ? "Updating Profile..."
                        : existingProfile
                          ? "Generating QR Code..."
                          : "Creating Profile..."}
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
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {existingProfile && currentDataChanged
                        ? "Update & Generate QR Code"
                        : existingProfile
                          ? "Generate QR Code"
                          : "Create Profile & Generate QR Code"}
                    </>
                  )}
                </button>
              </div>

              {/* QR Code Display */}
              {qrCodeImage && (
                <div className="mt-8 p-6 bg-base-200/50 rounded-lg border border-base-300">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      Your Personal QR Code
                    </h3>
                    <div className="flex justify-center mb-4">
                      <img
                        src={qrCodeImage}
                        alt="Generated QR Code"
                        className="border border-base-300 rounded-lg shadow-lg"
                      />
                    </div>
                    <p className="text-sm text-base-content/70 mb-4">
                      This QR code contains all your personal information and
                      emergency contacts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <a
                        href={qrCodeImage}
                        download="my-qr-code.png"
                        className="btn btn-outline btn-primary btn-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download QR Code
                      </a>
                      <button
                        type="button"
                        onClick={() => setQrCodeImage(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        Generate New QR
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
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
              <h3 className="font-semibold text-lg mb-2">Secure Data</h3>
              <p className="text-base-content/70 text-sm">
                Your information is encrypted and stored securely
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">High Quality</h3>
              <p className="text-base-content/70 text-sm">
                Generate high-resolution QR codes for any purpose
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Friendly</h3>
              <p className="text-base-content/70 text-sm">
                QR codes work perfectly on all mobile devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainQr;
