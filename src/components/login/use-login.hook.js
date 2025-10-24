"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import {
  login,
  loginAndSignUpWithOAuth,
} from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { AES, enc } from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function useLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { email, password } = watch();

  useEffect(() => {
    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // functions
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (typeof window === "object") {
      // Check if the browser supports localStorage
      if (
        localStorage &&
        localStorage.getItem("rememberedUsername") &&
        localStorage.getItem("rememberedPassword")
      ) {
        try {
          const storedUsername = localStorage.getItem("rememberedUsername");
          const storedEncryptedPassword =
            localStorage.getItem("rememberedPassword");

          // Check if encryption key exists
          const encryptionKey = process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY;
          if (!encryptionKey) {
            console.warn(
              "Encryption key not found. Skipping password decryption."
            );
            setValue("email", storedUsername);
            return;
          }

          // Compare the entered password with the stored encrypted password
          const bytes = AES.decrypt(storedEncryptedPassword, encryptionKey);

          if (!bytes) {
            console.warn(
              "Failed to decrypt password. Clearing stored credentials."
            );
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
            return;
          }

          const decryptedPassword = bytes.toString(enc.Utf8);
          setValue("email", storedUsername);
          setValue("password", decryptedPassword);
        } catch (error) {
          console.error("Error decrypting password:", error);
          // Clear invalid stored credentials
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }
      }
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    const response = await dispatch(login({ payload: { ...values } }));

    if (response.type.endsWith("/fulfilled")) {
      // Login successful - store user data in localStorage
      const userData = response.payload;
      if (typeof window === "object" && localStorage) {
        localStorage.setItem("user", JSON.stringify({ user: userData }));
      }
      router.push("/");
    } else {
      // Login failed
      console.log("Login failed:", response.payload);
    }
    setLoading(false);
    // Handle remember me functionality
    if (typeof window === "object" && isChecked) {
      // Check if the browser supports localStorage
      if (localStorage) {
        try {
          const encryptionKey = process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY;
          if (encryptionKey) {
            // Encrypt the password
            const encryptedPassword = AES.encrypt(
              values.password,
              encryptionKey
            ).toString();
            localStorage.setItem("rememberedUsername", values.email);
            localStorage.setItem("rememberedPassword", encryptedPassword);
          } else {
            console.warn(
              "Encryption key not found. Storing credentials without encryption."
            );
            // Store without encryption as fallback (less secure)
            localStorage.setItem("rememberedUsername", values.email);
            localStorage.setItem("rememberedPassword", values.password);
          }
        } catch (error) {
          console.error("Error encrypting password:", error);
        }
      }
    }
    if (isChecked === false) {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
  };

  return {
    onSubmit,
    showPassword,
    isChecked,
    setIsChecked,
    toggleShowPassword,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    password,
    email,
  };
}
