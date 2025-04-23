"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const signup = async (email: string, password: string) => {
    // In a real app, you would call an API to create the user account
    console.log(`Creating account for ${email}`);

    // Set authentication cookie (expires in 7 days)
    Cookies.set("auth_token", "demo-token", { expires: 7 });
    setIsAuthenticated(true);

    // Navigate to home page
    router.push("/");
  };

  const login = async (email: string, password: string) => {
    // In a real app, you would validate credentials with an API
    // For demo purposes, we'll just set a cookie

    // Simulate API call
    console.log(`Logging in with ${email}`);

    // Set authentication cookie (expires in 7 days)
    Cookies.set("auth_token", "demo-token", { expires: 7 });
    setIsAuthenticated(true);

    // Navigate to home page
    router.push("/");
  };

  const logout = () => {
    // Remove auth cookie
    Cookies.remove("auth_token");
    setIsAuthenticated(false);

    // Navigate to login page
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
