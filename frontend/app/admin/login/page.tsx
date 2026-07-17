"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (!data.success) {
        setError(data.message);
        return;
      }

      router.push("/admin");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-navy flex items-center justify-center shadow-md shadow-navy/20 mb-4">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-charcoal">
            Stem Innovation Nepal
          </h1>

          <p className="text-slate text-sm mt-1">
            Admin Console
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-black/5 p-8">
          <h2 className="text-lg font-bold text-charcoal">
            Sign In
          </h2>

          <p className="text-slate text-sm mt-1 mb-6">
            Enter your credentials to continue.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@steminnovation.com"
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-blue text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-navy transition"
            >
              {isSubmitting ? (
                "Signing In..."
              ) : (
                <>
                  Log In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate mt-6">
          Restricted access. Authorized administrators only.
        </p>
      </div>
    </div>
  );
}