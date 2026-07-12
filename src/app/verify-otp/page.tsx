"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { authApi, getApiErrorMessage } from "@/lib/api";
import { resetFlowStorage } from "@/lib/resetFlowStorage";

export default function VerifyOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = resetFlowStorage.getEmail();
    if (!savedEmail) {
      router.replace("/forgot-password");
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authApi.verifyOtp(email, otp);
      router.push("/reset-password");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid OTP"));
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP</h2>
          <p className="text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to {email || "your email"}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>OTP Code</span>
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

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <Link href="/forgot-password" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
