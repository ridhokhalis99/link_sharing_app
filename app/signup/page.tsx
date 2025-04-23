"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LogoIcon from "../components/icons/LogoIcon";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signup } = useAuth();

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await signup(email, password);
        if (result.error) {
          setAuthError(result.error);
        }
        // No need for else with redirect - AuthContext will handle it
      } catch (error: any) {
        console.error("Signup failed:", error);
        setAuthError(
          error.message || "An unexpected error occurred during signup"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-16 px-6">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <LogoIcon className="mr-2" />
        <h1 className="text-2xl font-bold text-[#333333]">devlinks</h1>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-[476px] bg-white rounded-xl p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#333333] mb-2">
            Create account
          </h2>
          <p className="text-[#737373] text-base">
            Let's get you started sharing your links!
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs text-[#333333]">
              Email address
            </label>
            <div
              className={`flex items-center border rounded-lg p-3 ${
                errors.email ? "border-red-500" : "border-[#D9D9D9]"
              }`}
            >
              <EmailIcon className="mr-3" />
              <input
                type="email"
                id="email"
                placeholder="e.g. alex@email.com"
                className="flex-1 outline-none text-base text-[#333333] placeholder:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs text-[#333333]">
              Create password
            </label>
            <div
              className={`flex items-center border rounded-lg p-3 ${
                errors.password ? "border-red-500" : "border-[#D9D9D9]"
              }`}
            >
              <PasswordIcon className="mr-3" />
              <input
                type="password"
                id="password"
                placeholder="At least 8 characters"
                className="flex-1 outline-none text-base text-[#333333] placeholder:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs text-[#333333]">
              Confirm password
            </label>
            <div
              className={`flex items-center border rounded-lg p-3 ${
                errors.confirmPassword ? "border-red-500" : "border-[#D9D9D9]"
              }`}
            >
              <PasswordIcon className="mr-3" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="At least 8 characters"
                className="flex-1 outline-none text-base text-[#333333] placeholder:opacity-50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password hint */}
          <p className="text-xs text-[#737373]">
            Password must contain at least 8 characters
          </p>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-[#633CFF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create new account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-[#737373]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#633CFF] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
