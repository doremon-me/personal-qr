import apiClient from "./apiClint";

const ENDPOINT = {
  userSignIn: "/auth/signin",
  userSignUp: "/auth/signup",
  verifyOtp: "/auth/verifyOtp",
  forgotPassword: "/auth/forgetPassword",
  resetPassword: "/auth/resetPassword",
  crateProfile: "/user/createProfile",
  updateProfile: "/user/updateProfile",
  getProfile: "/user/fetchProfile",
  scanQr: "/qr/scan",
  verifyProfile: "/qr/verify",
};

interface SignupFormData {
  name: string;
  email?: string;
  number?: string;
  password: string;
}

export interface SignInFormData {
  email?: string;
  number?: string;
  password: string;
}

interface VerifyOtpData {
  otp: string;
  type: string;
  email?: string;
  number?: string;
}

interface ForgotPasswordData {
  email?: string;
  number?: string;
}

interface ResetPasswordData {
  password: string;
}

interface Contact {
  id?: string;
  contactPersonName: string;
  contactPersonNumber: string;
}

interface CreateProfileData {
  motherName: string;
  fatherName: string;
  contacts: Contact[];
}

interface UpdateProfileData {
  id: string;
  motherName?: string;
  fatherName?: string;
  contacts?: Contact[];
}

interface ScanQr {
  number: string;
}

interface VerifyProfile {
  number: string;
  otp: string;
}

export const userSignUp = async (data: SignupFormData) => {
  try {
    const response = await apiClient.post(ENDPOINT.userSignUp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userSignIn = async (data: SignInFormData) => {
  try {
    const response = await apiClient.post(ENDPOINT.userSignIn, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (data: VerifyOtpData) => {
  try {
    const response = await apiClient.post(ENDPOINT.verifyOtp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await apiClient.post(ENDPOINT.forgotPassword, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await apiClient.post(ENDPOINT.resetPassword, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crateProfile = async (data: CreateProfileData) => {
  try {
    const response = await apiClient.post(ENDPOINT.crateProfile, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const response = await apiClient.patch(ENDPOINT.updateProfile, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get(ENDPOINT.getProfile);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scanQr = async (id: string, data: ScanQr) => {
  try {
    const response = await apiClient.post(ENDPOINT.scanQr, data, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyProfile = async (data: VerifyProfile) => {
  try {
    const response = await apiClient.post(ENDPOINT.verifyProfile, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
