"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LogoIcon from "../components/icons/LogoIcon";
import EmailIcon from "../components/icons/EmailIcon";
import PasswordIcon from "../components/icons/PasswordIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      // Here you could add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-16 px-6">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <LogoIcon className="mr-2" />
        <h1 className="text-2xl font-bold text-[#333333]">devlinks</h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[476px] bg-white rounded-xl p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#333333] mb-2">Login</h2>
          <p className="text-[#737373] text-base">
            Add your details below to get back into the app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs text-[#333333]">
              Email address
            </label>
            <div className="flex items-center border border-[#D9D9D9] rounded-lg p-3">
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
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs text-[#333333]">
              Password
            </label>
            <div className="flex items-center border border-[#D9D9D9] rounded-lg p-3">
              <PasswordIcon className="mr-3" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="flex-1 outline-none text-base text-[#333333] placeholder:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#633CFF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-center mt-6 text-[#737373]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#633CFF] font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
