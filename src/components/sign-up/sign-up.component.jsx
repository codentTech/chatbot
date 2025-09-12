import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import useSignUp from "./use-sign-up.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function SignUp() {
  // hooks
  const {
    onSubmit,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    agreeToTerms,
    setAgreeToTerms,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordStrength,
  } = useSignUp();

  const strength = passwordStrength(password);

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
            Create Account
          </h1>
          <p className="text-purple-300 text-xs">
            Join our AI chatbot platform and start building amazing
            conversations
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-purple-200">
                  First Name
                </label>
                <CustomInput
                  label=""
                  name="firstName"
                  register={register}
                  errors={errors}
                  placeholder="John"
                  isRequired={true}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-purple-200">
                  Last Name
                </label>
                <CustomInput
                  label=""
                  name="lastName"
                  register={register}
                  errors={errors}
                  placeholder="Doe"
                  isRequired={true}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

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
                placeholder="john.doe@example.com"
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
                placeholder="Create a strong password"
                isRequired={true}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-300">
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-purple-200">
                Confirm Password
              </label>
              <CustomInput
                label=""
                name="confirmPassword"
                type="password"
                register={register}
                errors={errors}
                placeholder="Confirm your password"
                isRequired={true}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none transition-all duration-200 text-sm"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAgreeToTerms(!agreeToTerms)}
                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  agreeToTerms
                    ? "bg-purple-600 border-purple-600"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                {agreeToTerms && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <label className="text-purple-200 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-purple-400 hover:text-purple-300 font-medium underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-purple-400 hover:text-purple-300 font-medium underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <CustomButton
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 text-sm"
              text={!loading && "Create Account"}
              startIcon={<Loader loading={loading} />}
              disabled={
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !confirmPassword ||
                !agreeToTerms ||
                loading
              }
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

            {/* Login Link */}
            <div className="text-center text-xs text-purple-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
              >
                Sign in instead
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
