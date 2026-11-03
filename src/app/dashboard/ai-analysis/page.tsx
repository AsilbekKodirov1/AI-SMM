"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Target,
  Instagram,
  AlertCircle,
} from "lucide-react";

export default function AiAnalysisPage() {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [data, setData] = useState<any>(null);

  const [localIgAccount, setLocalIgAccount] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aismm_active_account");
      if (saved) {
        try { setLocalIgAccount(JSON.parse(saved)); } catch {}
      }
    }
  }, [user]);

  const igAccount = localIgAccount || user?.instagramAccount;
  const isConnected = !!igAccount?.isConnected;

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/audit");
      if (res.ok) {
        const json = await res.json();
        if (json.hasAnalysis) {
          setHasAnalysis(true);
          setData(json);
        } else {
          setHasAnalysis(false);
          setData(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, [user]);

  const scanSteps = [
    `@${igAccount?.username || "akkauntingiz"} tekshirilmoqda...`,
    "Oxirgi Reels va postlar tahlil qilinmoqda...",
    "Nishangizga mos eng kuchli formatlar aniqlanmoqda...",
    "AI o‘sish strategiyasi va tavsiyalari tuzilmoqda...",
  ];

  const handleRunFullAudit = async () => {
    setScanning(true);
    setScanStep(0);

    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: "Ta'lim / Biznes" }),
      });
      if (res.ok) {
        await refreshUser();
        await loadAuditData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Scan Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI Account Analysis</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-bold">
              Diagnostika
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isConnected
              ? `@${igAccount.username} akkauntingizning kuchli va zaif tomonlari hamda o‘sish strategiyasi`
              : "Haqiqiy tahlilni ko‘rish uchun avval o‘z Instagram akkauntingizni ulang"}
          </p>
        </div>

        {isConnected && (
          <button
            type="button"
            onClick={handleRunFullAudit}
            disabled={scanning}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${scanning ? "animate-spin" : ""}`} />
            <span>{scanning ? "Tahlil qilinmoqda..." : "Akkauntni qayta tahlil qilish"}</span>
          </button>
        )}
      </div>

      {/* NOT CONNECTED STATE */}
      {!isConnected && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Instagram className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Instagram akkaunt hali ulanmagan
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sun'iy intellekt o‘z-o‘zidan taxminiy raqam chiqarmaydi. Dashboardga o‘tib, o‘z Instagram profilingizni kiriting va shaxsiy AI auditini oling.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Dashboardga o‘tish va Akkauntni Ulash</span>
          </Link>
        </div>
      )}

      {/* CONNECTED BUT NO AUDIT YET */}
      {isConnected && !hasAnalysis && !scanning && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            @{igAccount.username} akkauntingiz uchun AI tahlilni boshlang
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sun'iy intellekt profilingizning kuchli tomonlari, zaif nuqtalari va eng virusli Reels mavzularini tahlil qilib beradi.
          </p>
          <button
            type="button"
            onClick={handleRunFullAudit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Auditini Boshlash</span>
          </button>
        </div>
      )}

      {/* Scanning Modal / Overlay when active */}
      {scanning && (
        <div className="p-8 rounded-2xl bg-white border border-blue-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Instagram akkauntingiz tahlil qilinmoqda...
          </h3>
          <p className="text-sm font-semibold text-[#2563EB]">
            {scanSteps[scanStep]}
          </p>
          <div className="w-full max-w-md mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-500"
              style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 4 Core Pillars Strip */}
      {isConnected && hasAnalysis && data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Your Niche */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Target className="w-3.5 h-3.5 text-slate-400" />
                <span>Nisha:</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1">
                {data.niche}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Asosiy yo‘nalish</div>
            </div>

            {/* Best Format */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Eng yaxshi format:</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1">
                {data.bestFormat}
              </div>
              <div className="text-[11px] text-[#22C55E] font-semibold">Yuqori qamrov</div>
            </div>

            {/* Best Topic */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Top mavzu:</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {data.bestTopic}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Auditoriya qiziqishi</div>
            </div>

            {/* Growth & Score */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>AI Health Score:</span>
                <span className="text-xs text-[#22C55E] font-bold">+{data.growthRate}%</span>
              </div>
              <div className="text-2xl font-bold text-[#2563EB] mt-1 tabular-nums">
                {data.healthScore} / 100
              </div>
              <div className="text-[11px] text-[#22C55E] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                <span>Optimallashtirilgan</span>
              </div>
            </div>

          </div>

          {/* Deep Strategic Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kuchli tomonlar</h3>
                  <p className="text-[11px] text-slate-500">Sizda yaxshi ishlayotgan omillar</p>
                </div>
              </div>
              <ul className="space-y-3">
                {data.strengths?.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Zaif nuqtalar</h3>
                  <p className="text-[11px] text-slate-500">Tuzatish talab etiladigan joylar</p>
                </div>
              </div>
              <ul className="space-y-3">
                {data.weaknesses?.map((w: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Tavsiyalari</h3>
                  <p className="text-[11px] text-slate-500">Keyingi kontent uchun amaliy qadamlar</p>
                </div>
              </div>
              <ul className="space-y-3">
                {data.recommendations?.map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Quick CTA to Generator */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Ushbu AI tahlil asosida virusli Reels ssenariysi yarating
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                AI tavsiya etgan hook, 3 ta sahna va kuchli CTA bilan 30 soniyalik to‘liq video ssenariy tayyorlang.
              </p>
            </div>
            <Link
              href="/dashboard/generator"
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ssenariy Yaratish</span>
            </Link>
          </div>
        </>
      )}

    </div>
  );
}
