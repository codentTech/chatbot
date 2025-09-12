import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import useLogin from "./use-login.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function Login() {
  // hooks
  const {
    onSubmit,
    isChecked,
    setIsChecked,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    password,
    email,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/40 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-600/20 to-purple-800/30 rounded-xl flex items-center justify-center border border-purple-600/30 backdrop-blur-sm shadow-lg">
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-purple-300 text-xs">
            Sign in to continue your AI conversations
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-purple-200">
                Email Address
              </label>
              <CustomInput
                label=""
                name="email"
                register={register}
                errors={errors}
                placeholder="Enter your email"
                isRequired={true}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-purple-200">
                Password
              </label>
              <CustomInput
                label=""
                name="password"
                type="password"
                register={register}
                errors={errors}
                placeholder="Enter your password"
                isRequired={true}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-3.5 h-3.5 text-purple-600 bg-white/5 border-white/20 rounded focus:outline-none"
                />
                <span className="text-purple-200">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <CustomButton
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 text-sm"
              text={!loading && "Sign In"}
              startIcon={<Loader loading={loading} />}
              disabled={!email || !password || loading}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-slate-950 rounded-lg text-purple-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] text-sm"
              >
                <img
                  src="/assets/images/google-icon.svg"
                  alt="login with Google"
                  className="h-4 w-4"
                />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] text-sm"
              >
                <img
                  src="/assets/images/facebook-icon.svg"
                  alt="login with Facebook"
                  className="h-4 w-4"
                />
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-purple-300">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
              >
                Create one now
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-purple-400">
          <p>© 2024 AI Chatbot Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
