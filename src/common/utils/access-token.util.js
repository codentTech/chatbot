"use client";

import { isJwtExpired } from "jwt-check-expiration";
import authService from "@/provider/features/auth/auth.service";
import { getUser } from "./users.util";

/**
 * Retrieve access token from local storage
 * @returns string | undefined
 */
export const getAccessToken = (data) => {
  if (
    (typeof window === "object" && window?.localStorage?.getItem("user")) ||
    data
  ) {
    const user = data ?? getUser();
    return user?.access_token;
  }
  return undefined;
};

/**
 * Retrive isLoginVerified Status
 * @returns bool
 */
export const isLoginVerified = (data) => {
  if (
    (typeof window === "object" && window?.localStorage?.getItem("user")) ||
    data
  ) {
    const user = data ?? getUser();
    return user ? true : false;
  }
  return false;
};

/**
 * Retrive access token expiry date from local storage
 * @returns date | undefined
 */
export const getAccessTokenExpiry = () => {
  if (typeof window === "object") {
    const accessTokenExpiry = JSON.parse(
      window.localStorage.getItem("accessTokenExpiry")
    );
    return accessTokenExpiry;
  }
  return null;
};

/**
 * Delete token for old users
 * @returns false | true
 */
export const checkForOldToken = async () => {
  if (typeof window === "object" && window?.localStorage?.getItem("user")) {
    if (getUser()?.loginVerifiedToken?.[0].token) {
      const response = await authService.logout();
      return response.Succeeded;
    }
    return false;
  }
  return false;
};

/**
 * Retrieve access token from local storage and check if it has expired
 * @returns string | null
 */
export const checkExpiryDateOfToken = () => {
  if (typeof window === "object" && window?.localStorage?.getItem("user")) {
    if (getUser()?.loginVerifiedToken?.[0].token) {
      if (isJwtExpired(getUser()?.loginVerifiedToken?.[0].token) === false) {
        return true;
      }
      return false;
    }
    return null;
  }
  return null;
};
