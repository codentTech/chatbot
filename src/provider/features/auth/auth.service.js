import api from "@/common/utils/api";
import { removeUser } from "@/common/utils/users.util";

// Login user
const login = async (userData) => {
  const response = await api().post("/api/auth/login", userData);
  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
    localStorage.setItem("isOtpVerify", false);
  }
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await api().get("/api/auth/logout");
  if (response.data.success) {
    removeUser();
  }
  return response.data;
};

// Register user
const signUp = async (userData) => {
  const response = await api().post("/api/auth/register", userData);
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await api().get("/api/auth/me");
  return response.data;
};

const loginAndSignUpWithOAuth = async ({ loginType, email, accessToken }) => {
  const response = await api().post("/api/auth/login-and-sign-up-with-oauth", {
    loginType,
    email,
    accessToken,
  });
  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
    localStorage.setItem("isOtpVerify", false);
  }
  return response.data;
};

const loginAndSignUpWithLinkedin = async (payload) => {
  const response = await api().post(
    "/api/auth/login-and-sign-up-with-linkedin",
    payload
  );
  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
    localStorage.setItem("isOtpVerify", false);
  }
  return response.data;
};

const authService = {
  logout,
  login,
  signUp,
  getCurrentUser,
  loginAndSignUpWithOAuth,
  loginAndSignUpWithLinkedin,
};

export default authService;
