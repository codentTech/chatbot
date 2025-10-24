"use client";

import { getEmailForURL } from "@/common/utils/users.util";
import { signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Use Special Character like @ # etc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function useSignUp() {
  const dispatch = useDispatch();
  const router = useRouter(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const { firstName, lastName, email, password, confirmPassword } = watch();

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-red-400" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[Math.min(strength, 5)];
  };

  useEffect(() => {
    setIsChecked(false);
  }, [router]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await dispatch(
        signUp({
          payload: {
            email: values.email,
            username: values.email, // Using email as username for now
            password: values.password,
            full_name: `${values.firstName} ${values.lastName}`,
            phone_number: null, // Optional field
          },
        })
      );

      if (response.type.endsWith("/fulfilled")) {
        // Registration successful - store user data in localStorage
        const userData = response.payload;
        if (typeof window === "object" && localStorage) {
          localStorage.setItem("user", JSON.stringify({ user: userData }));
        }
        console.log("Registration successful:", response.payload);
        router.push("/login");
      } else {
        // Registration failed
        console.log("Registration failed:", response.payload);
      }
    } finally {
      setLoading(false);
    }
  };

  const moveRouterSignup = (data) => {
    const _email = getEmailForURL(data.email);
    if (data.isPhoneVerified && data.isProfileCompleted) {
      router.push(`/two-factor-auth?userId=${data.id}&phone=${data.phone}`);
    } else {
      router.push(`/profile?email=${_email}&userId=${data.id}`);
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    handleSubmit,
    onSubmit,
    register,
    errors,
    loading,
    router,
    agreeToTerms,
    setAgreeToTerms,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordStrength,
    moveRouterSignup,
  };
}
