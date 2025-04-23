"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session found:", session.user.email);
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          console.log("No session found");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);

        // If user logs in or signs up, redirect to home
        if (event === "SIGNED_IN") {
          console.log("Redirecting to home after auth event:", event);
          router.push("/");
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);

        // If user logs out, redirect to login
        if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        return { error: error.message };
      }

      if (data && data.user) {
        console.log("Login successful for:", data.user.email);

        // Force update the state immediately
        setIsAuthenticated(true);
        setUser(data.user);

        return {};
      } else {
        return { error: "Login failed" };
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      return { error: error.message || "Login failed" };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log("Attempting signup for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error.message);
        return { error: error.message };
      }

      if (data && data.user) {
        console.log("Signup successful for:", data.user.email);

        // Force update the state immediately
        setIsAuthenticated(true);
        setUser(data.user);

        return {};
      } else {
        return { error: "Something went wrong during signup" };
      }
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      return { error: error.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    // You could add a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#633CFF]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout }}
    >
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
