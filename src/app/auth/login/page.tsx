"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  Send,
  ExternalLink,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { language } = useLanguage();

  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 60-second cooldown timer
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const botUsername = "AISMMetaBot";

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length === 0) {
      setError("Iltimos, Telegram bot yuborgan kodni kiriting");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/telegram-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        await refreshUser();
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setError(data.error || "Kod noto‘g‘ri. Qaytadan urinib ko‘ring.");
      }
    } catch {
      setError("Ulanishda xatolik. Qaytadan urinib ko‘ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/telegram-resend", { method: "POST" });
      if (res.ok) {
        setCooldown(60);
      }
    } catch {
      setError("Kodni yangilashda xatolik");
    } finally {
      setResending(false);
    }
  };

  const handleQuickDemo = () => {
    setOtpCode("123456");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            AI SMM Assistant
          </span>
        </Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          Telegram orqali kirish
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Parol eslab qolish shart emas. Kod to‘g‘ridan-to‘g‘ri Telegram botingizga yuboriladi.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">

          {/* Step 1: Open Bot */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-800">
                1-qadam: Telegram botni oching
              </div>
              <div className="text-[11px] text-slate-500">
                Botga <code className="text-[#2563EB] font-bold">/start</code> yozing
              </div>
            </div>
            <a
              href={`https://t.me/${botUsername}?start=login`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Botni ochish</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>Kod tasdiqlandi! Dashboardga yo‘naltirilmoqda...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  2-qadam: Bot yuborgan kodni kiriting
                </label>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="text-[11px] text-[#2563EB] hover:underline font-semibold"
                >
                  Demo kod (123456)
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={8}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setError("");
                  }}
                  placeholder="6 xonali kod"
                  className="w-full py-3.5 px-4 rounded-xl border border-slate-300 text-center font-mono text-2xl font-black tracking-[0.3em] text-[#2563EB] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <span>{loading ? "Tekshirilmoqda..." : "Kirish va Davom etish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 60-Second Cooldown Resend Area */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kod kelmadimi?</span>

            {cooldown > 0 ? (
              <div className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Qayta so‘rash ({cooldown}s)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#2563EB] hover:underline font-bold inline-flex items-center gap-1"
              >
                <RotateCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                <span>Kodni qayta olish</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          <span>3 kunlik bepul sinov • Karta talab qilinmaydi</span>
        </div>
      </div>
    </div>
  );
}
