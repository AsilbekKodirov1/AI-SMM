"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Instagram,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [range, setRange] = useState<"7D" | "30D" | "90D">("30D");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activeMetric, setActiveMetric] = useState<"followers" | "views" | "likes" | "engagementRate">("followers");
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

  const fetchAnalytics = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${selectedRange}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, user]);

  const hasData = analyticsData?.hasData;
  const summary = analyticsData?.summary || {
    followers: 0,
    followersGrowth: "+0",
    growthPercent: "+0%",
    totalViews: 0,
    totalLikes: 0,
    avgEngagement: "0%",
  };

  const chartData = analyticsData?.chartData || [];

  return (
    <div className="space-y-8">
      
      {/* Title & Range Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instagram Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isConnected
              ? `@${igAccount.username} akkauntingizning o‘sish sur'ati, qamrovi va auditoriya faolligi`
              : "Haqiqiy statistikani ko‘rish uchun avval o‘z Instagram akkauntingizni ulang"}
          </p>
        </div>

        {/* 7D / 30D / 90D Segmented Buttons */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {(["7D", "30D", "90D"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                range === r
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {!isConnected && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Instagram className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Instagram akkaunt ulanmagan
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Statistika va grafiklar o‘z-o‘zidan paydo bo‘lmaydi. Dashboardga o‘tib, o‘z Instagram username'ingizni ulang va tahlilni boshlang.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Akkauntni Ulash</span>
          </Link>
        </div>
      )}

      {/* Metric Selector Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Followers */}
        <button
          type="button"
          onClick={() => setActiveMetric("followers")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeMetric === "followers"
              ? "bg-white border-[#2563EB] ring-2 ring-blue-500/10 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">Kuzatuvchilar</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {summary.followers?.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-[#22C55E] mt-1">
            {summary.growthPercent} {isConnected ? "o‘sish" : ""}
          </div>
        </button>

        {/* Views */}
        <button
          type="button"
          onClick={() => setActiveMetric("views")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeMetric === "views"
              ? "bg-white border-[#2563EB] ring-2 ring-blue-500/10 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">Jami ko‘rishlar (Views)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {summary.totalViews?.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-[#22C55E] mt-1">
            {isConnected ? "So‘nggi davr" : "—"}
          </div>
        </button>

        {/* Likes */}
        <button
          type="button"
          onClick={() => setActiveMetric("likes")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeMetric === "likes"
              ? "bg-white border-[#2563EB] ring-2 ring-blue-500/10 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">Reaksiyalar (Likes)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {summary.totalLikes?.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-[#22C55E] mt-1">
            {isConnected ? "Faol" : "—"}
          </div>
        </button>

        {/* Engagement Rate */}
        <button
          type="button"
          onClick={() => setActiveMetric("engagementRate")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeMetric === "engagementRate"
              ? "bg-white border-[#2563EB] ring-2 ring-blue-500/10 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">O‘rtacha Engagement</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {summary.avgEngagement}
          </div>
          <div className="text-[11px] font-semibold text-[#2563EB] mt-1">
            {isConnected ? "Auditoriya faolligi" : "—"}
          </div>
        </button>

      </div>

      {/* MAIN INTERACTIVE CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {activeMetric === "followers" && "Kuzatuvchilar o‘sish dinamikasi"}
              {activeMetric === "views" && "Ko‘rishlar va qamrov dinamikasi"}
              {activeMetric === "likes" && "Layklar va reaksiyalar soni"}
              {activeMetric === "engagementRate" && "Haqiqiy Engagement Rate (%)"}
            </h2>
            <span className="text-xs text-slate-500">
              Vaqt oralig‘i: {range} bo‘yicha kunlik ko‘rsatkichlar
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span>
              <span>Asosiy grafik</span>
            </span>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-[340px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Grafik yuklanmoqda...
            </div>
          ) : !hasData || chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
              <span>Hozircha ushbu davr uchun statistika to‘planmagan.</span>
              <Link href="/dashboard" className="text-[#2563EB] font-bold underline">
                Akkauntingizni tahlil qiling →
              </Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === "views" ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101828",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="views" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101828",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#metricGradient)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

      </div>

    </div>
  );
}
