import apiClient from "./apiClint";

const ENDPOINT = {
  userSignIn: "/auth/signin",
  userSignUp: "/auth/signup",
  verifyOtp: "/auth/verifyOtp",
  forgotPassword: "/auth/forgetPassword",
  resetPassword: "/auth/resetPassword",
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
