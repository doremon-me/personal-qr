import apiClient from "./apiClint";

const ENDPOINT = {
  userSignIn: "/auth/signin",
  userSignUp: "/auth/signup",
};

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

export const userSignUp = async (data: SignupFormData) => {
  try {
    const response = await apiClient.post(ENDPOINT.userSignUp, data);
    return response.data;
  } catch (error) {
    console.log("Error in userSignUp:", error);
    throw error;
  }
};

export const userSignIn = async (data: SignInFormData) => {
  try {
    const response = await apiClient.post(ENDPOINT.userSignIn, data);
    return response.data;
  } catch (error) {
    console.log("Error in userSignIn:", error);
    throw error;
  }
};
