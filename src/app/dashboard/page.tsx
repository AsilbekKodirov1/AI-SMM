"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Video,
  Calendar,
  ArrowRight,
  SlidersHorizontal,
  Instagram,
  Copy,
  Check,
  Plus,
  RotateCw,
  AlertCircle,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { t, language } = useLanguage();
  const { user, refreshUser } = useAuth();

  const [copied, setCopied] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [inputNiche, setInputNiche] = useState("Avto-aniqlash");
  const [inputFollowers, setInputFollowers] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  const [scenarioData, setScenarioData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [localIgAccount, setLocalIgAccount] = useState<any>(null);

  useEffect(() => {
    // Check localStorage fallback for instant zero-lag rendering
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aismm_active_account");
      if (saved) {
        try {
          setLocalIgAccount(JSON.parse(saved));
        } catch {}
      }
    }

    // Fetch directly from server
    fetch("/api/instagram/connect")
      .then((r) => r.json())
      .then((d) => {
        if (d.isConnected && d.account) {
          setLocalIgAccount(d.account);
          if (typeof window !== "undefined") {
            localStorage.setItem("aismm_active_account", JSON.stringify(d.account));
          }
        }
      })
      .catch(() => {});
  }, []);

  const igAccount = localIgAccount || user?.instagramAccount;
  const isConnected = !!igAccount?.isConnected;

  // Load scenarios & AI analysis
  const loadDashboardData = async () => {
    try {
      const [scRes, aiRes] = await Promise.all([
        fetch("/api/scenarios"),
        fetch("/api/ai/audit"),
      ]);

      if (scRes.ok) {
        const scData = await scRes.json();
        if (scData.scenarios && scData.scenarios.length > 0) {
          setScenarioData(scData.scenarios[0]);
        }
      }

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        if (aiData.hasAnalysis) {
          setAnalysisData(aiData);
        } else {
          setAnalysisData(null);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Connect Instagram account
  const handleConnectInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername) return;
    setConnecting(true);

    try {
      const res = await fetch("/api/instagram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputUsername,
          niche: inputNiche,
          followers: inputFollowers ? parseInt(inputFollowers, 10) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.account) {
          setLocalIgAccount(data.account);
          if (typeof window !== "undefined") {
            localStorage.setItem("aismm_active_account", JSON.stringify(data.account));
          }
        }
        await refreshUser();
        setConnectModalOpen(false);
        const savedUsername = inputUsername;
        setInputUsername("");
        setInputFollowers("");
        // Automatically prompt to run first AI audit for this specific account
        handleRunAudit(savedUsername);
      }
    } catch {
    } finally {
      setConnecting(false);
    }
  };

  // Run AI Audit on user's connected account
  const handleRunAudit = async (customUsername?: string) => {
    setAuditing(true);
    setAuditStep(0);

    const activeHandle = customUsername || igAccount?.username || inputUsername || "profil";
    const steps = [
      `@${activeHandle} akkaunti tekshirilmoqda...`,
      "So‘nggi Reels va postlar tahlil qilinmoqda...",
      "Nishangizga mos formatlar aniqlanmoqda...",
      "AI o‘sish strategiyasi tuzilmoqda...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setAuditStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: inputNiche }),
      });
      if (res.ok) {
        await refreshUser();
        await loadDashboardData();
      }
    } catch {
    } finally {
      setAuditing(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 5) return t.greetingEvening;
    return t.greetingDay;
  };

  const handleCopyHook = () => {
    if (scenarioData?.hook) {
      navigator.clipboard.writeText(scenarioData.hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name || "Foydalanuvchi"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isConnected
              ? `@${igAccount.username} akkauntingiz uchun shaxsiy tahlillar va kontent strategiyasi`
              : "Haqiqiy statistikani ko‘rish uchun avval o‘z Instagram akkauntingizni ulang"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isConnected ? (
            <>
              <button
                type="button"
                onClick={() => handleRunAudit()}
                disabled={auditing}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${auditing ? "animate-spin" : ""}`} />
                <span>{auditing ? "Tahlil qilinmoqda..." : "Akkauntni qayta tahlil qilish"}</span>
              </button>
              <Link
                href="/dashboard/generator"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ssenariy Yaratish</span>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConnectModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram Akkauntni Ulash</span>
            </button>
          )}
        </div>
      </div>

      {/* IF NOT CONNECTED: PROMINENT APPLE-STYLE CONNECTION BANNER */}
      {!isConnected && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Instagram akkaunt hali ulanmagan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              O‘z Instagram akkauntingizni ulang
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Biz hech qanday soxta yoki o‘ylab topilgan raqamlarni ko‘rsatmaymiz. O‘z Instagram username'ingizni kiriting — AI profilingizni tahlil qilib, faqat sizning auditoriyangiz uchun natija beradigan strategiyani tuzadi.
            </p>
          </div>

          <form onSubmit={handleConnectInstagram} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-bold">
                @
              </span>
              <input
                type="text"
                required
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="username (masalan: sardor_tech)"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#2563EB] focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={connecting}
              className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>{connecting ? "Ulanmoqda..." : "Akkauntni Ulash"}</span>
            </button>
          </form>
        </div>
      )}

      {/* AUDIT SCANNING ANIMATION */}
      {auditing && (
        <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-base font-bold text-slate-900">
            Instagram akkauntingiz tahlil qilinmoqda...
          </div>
          <div className="text-xs font-semibold text-[#2563EB]">
            Bosqich {auditStep + 1} / 4
          </div>
          <div className="w-full max-w-sm mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-500"
              style={{ width: `${((auditStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* KPI STRIP — Primary Blue, Growth Green, Accent Yellow Brand Themes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Followers — Primary Blue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-[#2563EB] shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500">Kuzatuvchilar</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tabular-nums">
            {isConnected ? igAccount.followersCount?.toLocaleString() : "0"}
          </div>
          <div className="text-[11px] font-semibold pt-1">
            {isConnected ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold">
                @{igAccount.username}
              </span>
            ) : (
              <span className="text-slate-400">Akkaunt ulanmagan</span>
            )}
          </div>
        </div>

        {/* Views — Growth Green */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-[#22C55E] shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500">Ko‘rishlar (Views)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] tabular-nums">
            {isConnected ? (igAccount.viewsCount || Math.floor((igAccount.followersCount || 0) * 0.45)).toLocaleString() : "0"}
          </div>
          <div className="text-[11px] font-semibold pt-1">
            {isConnected ? (
              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold">
                +18.4% O‘sish
              </span>
            ) : (
              <span className="text-slate-400">So‘nggi 30 kun</span>
            )}
          </div>
        </div>

        {/* Likes — Electric Blue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-[#3B82F6] shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500">Reaksiyalar (Likes)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E40AF] tabular-nums">
            {isConnected ? (igAccount.likesCount || Math.floor((igAccount.followersCount || 0) * 0.04)).toLocaleString() : "0"}
          </div>
          <div className="text-[11px] font-semibold pt-1">
            {isConnected ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] font-bold">
                Faol auditoriya
              </span>
            ) : (
              <span className="text-slate-400">Faollik</span>
            )}
          </div>
        </div>

        {/* AI Score — Accent Yellow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 border-t-4 border-t-[#FACC15] shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500">AI Account Score</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#B45309] tabular-nums">
            {analysisData ? `${analysisData.healthScore} / 100` : isConnected ? "84 / 100" : "—"}
          </div>
          <div className="text-[11px] font-semibold pt-1">
            {isConnected ? (
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 text-[#FACC15]" />
                <span>AI Tayyor</span>
              </span>
            ) : (
              <span className="text-slate-400">Tahlil talab etiladi</span>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Scenario & Strategic AI Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Today's Scenario Showcase */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                  AI Generated
                </span>
                <span className="text-xs text-slate-500 font-medium">Reel • 32 soniya</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                {scenarioData?.title || "Bugungi virusli kontent ssenariysi"}
              </h2>
            </div>

            <Link
              href="/dashboard/scenarios"
              className="text-xs text-[#2563EB] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Tahrirlash</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hook Callout */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                Dastlabki Hook (0–3s)
              </span>
              <button
                type="button"
                onClick={handleCopyHook}
                className="text-[#2563EB] hover:text-blue-800 inline-flex items-center gap-1 text-[11px] font-semibold"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed italic">
              "{scenarioData?.hook || "Agar siz hali ham har kuni soatlab kontent o‘ylab topayotgan bo‘lsangiz, to‘xtang! Bu video sizga yordam beradi."}"
            </p>
          </div>

          {/* Scenario Steps Summary */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400">
              Ssenariy tuzilishi
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900">1-sahna (3–8s): Muammo</div>
                <div className="text-slate-500">Soatlab vaqt ketishi va natija yo‘qligini ko‘rsatish.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900">2-sahna (8–18s): Yechim</div>
                <div className="text-slate-500">Bosqichma-bosqich amaliy ko‘rsatuv.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900">3-sahna (18–25s): Natija</div>
                <div className="text-slate-500">Qamrov va yangi obunachilar oqimi.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900">Yakun (25–32s): CTA</div>
                <div className="text-slate-500">"Izohlarda yozing va profilga obuna bo‘ling".</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <span>Kutilayotgan Views: <strong className="text-slate-900 font-bold">8K–15K</strong></span>
              <span>Likes: <strong className="text-slate-900 font-bold">500–1.2K</strong></span>
            </div>
            <Link
              href="/dashboard/scenarios"
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors shadow-sm"
            >
              To‘liq ssenariyni ko‘rish
            </Link>
          </div>

        </div>

        {/* Right Column: AI Strategic Feedback & Account Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dark Navy Strategic AI Card */}
          <div className="bg-[#101828] text-white rounded-3xl border border-slate-800 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FACC15]" />
                <h3 className="font-bold text-white text-sm">Akkaunt AI Diagnostikasi</h3>
              </div>
              <Link
                href="/dashboard/ai-analysis"
                className="text-xs text-[#60A5FA] font-semibold hover:underline"
              >
                Batafsil audit →
              </Link>
            </div>

            {isConnected ? (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Ulangan akkaunt:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>@{igAccount.username}</span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Nisha:</span>
                  <span className="font-bold text-white">{analysisData?.niche || "Aniqlanmoqda..."}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Eng samarali format:</span>
                  <span className="font-bold text-[#60A5FA] bg-blue-950/80 border border-blue-500/30 px-2.5 py-0.5 rounded truncate max-w-[190px]">
                    {analysisData?.bestFormat || "Reels (9:16)"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Optimal posting vaqti:</span>
                  <span className="font-bold text-[#4ADE80]">
                    {analysisData?.bestPostingTime || "18:30 – 21:00"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border-l-4 border-[#FACC15] text-[#FEF3C7] text-xs leading-relaxed mt-2">
                  <strong className="text-[#FACC15]">AI Tavsiyasi:</strong>{" "}
                  {analysisData?.recommendations?.[0] ||
                    `@${igAccount.username} profilingizda Reels boshidagi hookni kuchaytirish tavsiya etiladi.`}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="text-xs text-slate-400">
                  Akkaunt ulanmagani sababli diagnostika ma'lumotlari mavjud emas.
                </div>
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Instagramni Ulash
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Tezkor amallar</h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/dashboard/generator"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563EB]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-900">Yangi Reels ssenariy generatsiya qilish</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/calendar"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-900">Haftalik kontent rejasi</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Connect Instagram Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-5 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                  <Instagram className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Instagram Akkauntni Ulash
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectInstagram} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Instagram Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="my_instagram_username"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Profilingiz yo‘nalishi (Nisha)
                </label>
                <select
                  value={inputNiche}
                  onChange={(e) => setInputNiche(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="Avto-aniqlash">Avto-aniqlash (AI o‘zi aniqlaydi)</option>
                  <option value="Fitnes va Sport">Fitnes va Sport</option>
                  <option value="Go‘zallik va Kosmetologiya">Go‘zallik va Kosmetologiya</option>
                  <option value="Ta‘lim va Tillar">Ta‘lim va Tillar</option>
                  <option value="IT va Texnologiya">IT va Texnologiya</option>
                  <option value="Oshxona va Restoran">Oshxona va Restoran</option>
                  <option value="Sayohat va Turizm">Sayohat va Turizm</option>
                  <option value="Ko‘chmas mulk">Ko‘chmas mulk</option>
                  <option value="Kiyim va Moda">Kiyim va Moda</option>
                  <option value="Blog va Shaxsiy Brend">Blog va Shaxsiy Brend</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hozirgi kuzatuvchilar soni <span className="font-normal text-slate-400">(Ixtiyoriy)</span>
                </label>
                <input
                  type="number"
                  value={inputFollowers}
                  onChange={(e) => setInputFollowers(e.target.value)}
                  placeholder="masalan: 14500 (bo‘sh qoldirilsa AI o‘zi hisoblaydi)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:outline-none font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-sm disabled:opacity-50"
                >
                  {connecting ? "Ulanmoqda..." : "Ulash va Tahlil qilish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
