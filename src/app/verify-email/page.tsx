"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, ShieldCheck, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, getApiErrorMessage } from "@/lib/api";

export default function VerifyEmailPage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsVerifying(true);

    try {
      await authApi.verifyEmail(otp);
      await refreshUser();
      setMessage("Email verified successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err) {
      setError(getApiErrorMessage(err, "Verification failed"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      const { data } = await authApi.resendVerification();
      setMessage(data.message || "Verification code sent to your email");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to resend verification email"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-4">
            <Image src="/LoginLogo.png" alt="PPSC" width={48} height={48} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PPSC</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your email</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to <strong>{user?.email}</strong>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Code</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-2xl tracking-widest"
                placeholder="000000"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">{message}</div>}

            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend code"}
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Check your inbox and spam folder
        </p>
      </div>
    </div>
  );
}
