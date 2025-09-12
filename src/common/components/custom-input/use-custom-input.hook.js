"use client";

import { useCallback, useState } from "react";

export default function useCustomInput(onChange, type) {
  const [showPassword, setShowPassword] = useState(false);

  const inputChangeHandler = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    inputChangeHandler,
    togglePasswordVisibility,
  };
}
