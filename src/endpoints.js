export const ENDPOINT = {
  auth: {
    register: { method: "POST", path: "/api/auth/register" },
    login: { method: "POST", path: "/api/auth/login" },
    logout: { method: "GET", path: "/api/auth/logout" },
    me: { method: "GET", path: "/api/auth/me" },
  },
};
