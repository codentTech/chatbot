"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
// import { verifyEmail } from '@/provider/features/user/user.slice';
import { getEmailForURL, isProfileCreated } from "@/common/utils/users.util";
import { isLoginVerified } from "@/common/utils/access-token.util";

export default function useVerify() {
  const dispatch = useDispatch();
  const router = useRouter(null);
  const apiResponseRef = useRef({
    res: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const email = params.get("email"); // is the string "Jonathan
    const type = params.get("type"); // is the string "Jonathan"
    const token = params.get("token"); // is the string "Jonathan"
    if (!(email && type && token)) {
      router.push("/");
    }
    if (!apiResponseRef.current.res) {
      apiResponseRef.current.res = true;
      verify(email, type, token);
    }
  }, []);

  const moveRouterEmail = (data) => {
    if (isProfileCreated(data)) {
      if (isLoginVerified(data)) {
        router.push("/dashboard");
      } else {
        router.push(`/two-factor-auth?userId=${data.id}&phone=${data.phone}`);
      }
    } else {
      router.push(`/profile?email=${getEmailForURL(data.email)}&userId=${data.id}`);
    }
  };

  const moveRouterPassword = (data) => {
    router.push(`/create-new-password?email=${getEmailForURL(data.email)}&token=${data.token}`);
  };

  const moveRouterError = (email, type) => {
    const _email = getEmailForURL(email);
    const _type = type;
    return () => router.push(`/auth/verification-expire?email=${_email}&type=${_type}`);
  };

  const verify = (email, type, token) => {
    const body = {
      accessToken: token,
      email,
    };
    // if (type === 'email-verification') {
    //   dispatch(
    //     verifyEmail({
    //       payload: body,
    //       successCallBack: moveRouterEmail,
    //       errorCallBack: moveRouterError(email, type)
    //     })
    //   );
    // } else {
    //   moveRouterPassword({ email, token });
    // }
  };
}
