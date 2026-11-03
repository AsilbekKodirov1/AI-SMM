"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Calendar,
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Copy,
  Clock,
  Eye,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";

export default function LandingPage() {
  const { t, language } = useLanguage();
  const { quickDemoLogin } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeSceneTab, setActiveSceneTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Sample interactive scenes for the live showcase
  const sampleScenes = [
    {
      title: "HOOK (0–3s)",
      badge: "00:00 - 00:03",
      visual: "Kameraga shiddat bilan yaqinlashib telefon ekranini ko‘rsatish, katta matn: 'TO‘XTANG!'",
      voiceover: "Agar siz hali ham har kuni soatlab kontent o‘ylab topayotgan bo‘lsangiz — to‘xtang!",
      camera: "Frontal, 4K, tezkor dinamik zoom-in",
    },
    {
      title: "1-SAHNA (3–8s)",
      badge: "00:03 - 00:08",
      visual: "Noutbukda sun'iy intellekt vositasining interfeysi va matn tez yozilishi",
      voiceover: "Mana bu 5 ta AI vosita butun haftalik video ssenariylaringizni 3 daqiqada tayyorlab beradi.",
      camera: "Yelka ustidan (Over-the-shoulder), 45 gradus",
    },
    {
      title: "2-SAHNA (8–15s)",
      badge: "00:08 - 00:15",
      visual: "Amaliy jarayon: hook generatsiyasi va kadrlar almashinuvi",
      voiceover: "Eng muhimi: har bir videongizning dastlabki 3 soniyasiga kuchli visual intriga qo‘shadi.",
      camera: "Makro plan, yumshoq yorug‘lik",
    },
    {
      title: "3-SAHNA (15–25s)",
      badge: "00:15 - 00:25",
      visual: "O‘sish statistikasi: +18.4% qamrov va ko‘rishlar grafigi",
      voiceover: "Natijada oddiy postlarga qaraganda qamrovingiz kamida 2 barobarga oshadi.",
      camera: "Dinamik harakat, ishonchli imo-ishora",
    },
    {
      title: "YAKUN (25–32s)",
      badge: "00:25 - 00:32",
      visual: "Kameraga to‘g‘ridan-to‘g‘ri qarab ishora qilish, ekranda CTA paydo bo‘ladi",
      voiceover: "Ushbu 5 ta tool ro‘yxatini profilimdagi havola orqali oling. Saqlab qo‘yishni unutmang!",
      camera: "Markazlashtirilgan o‘rta plan, tabassum",
    },
  ];

  const handleCopyHook = () => {
    navigator.clipboard.writeText(sampleScenes[activeSceneTab].voiceover);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ground flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>{t.heroTrust}</span>
              </div>

              {/* Headline (2 lines max at confident scale) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                {language === "ru" ? (
                  <>Развивайте свой Instagram <span className="text-[#2563EB]">с помощью AI</span></>
                ) : (
                  <>Instagramingizni <span className="text-[#2563EB]">AI bilan rivojlantiring</span>.</>
                )}
              </h1>

              {/* Supporting sentence */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroDesc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/auth/telegram-activation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#2563EB] text-white font-semibold text-base hover:bg-[#1D4ED8] shadow-apple hover:shadow-float transition-all active:scale-[0.99]"
                >
                  <span>{t.heroCtaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={quickDemoLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-base hover:border-[#2563EB] hover:text-[#2563EB] transition-colors shadow-subtle"
                >
                  <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
                  <span>Tezkor Demo Ko‘rish</span>
                </button>
              </div>

              {/* Subtle metrics footer */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>Telegram bot orqali 30 soniyada ulanish</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>100% xavfsiz va konfidensial</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Apple-Style Dashboard Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5">
                
                {/* Interactive Instagram Handle Input */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                    <span>O‘z Instagram profilingizni tekshirib ko‘ring:</span>
                    <span className="text-[10px] text-[#2563EB] font-bold bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">Jonli Demo</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 font-bold text-sm">@</span>
                    <input
                      type="text"
                      defaultValue="sizning_profilingiz"
                      placeholder="username (masalan: sardor_tech)"
                      className="w-full pl-8 pr-24 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    />
                    <Link
                      href="/auth/telegram-activation"
                      className="absolute right-1 px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold rounded-md shadow-sm transition-colors"
                    >
                      Tahlil
                    </Link>
                  </div>
                </div>

                {/* Profile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-50 border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-sm">
                      IG
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>@sizning_profilingiz</span>
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      </div>
                      <div className="text-xs text-slate-500">Instagram Creator & Business</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-xs font-bold">
                    +18.4% O‘sish
                  </span>
                </div>

                {/* KPI Grid — Primary Blue, Growth Green, Accent Yellow Top Accents */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 border-t-2 border-t-[#2563EB]">
                    <div className="text-[11px] font-medium text-slate-500">Kuzatuvchilar</div>
                    <div className="text-xl font-bold text-[#2563EB] mt-0.5 tabular-nums">Real-time</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Ulanganda</div>
                  </div>
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 border-t-2 border-t-[#22C55E]">
                    <div className="text-[11px] font-medium text-slate-500">Views</div>
                    <div className="text-xl font-bold text-[#15803D] mt-0.5 tabular-nums">AI Tahlil</div>
                    <div className="text-[10px] text-[#15803D] font-bold mt-0.5">+142% Reels</div>
                  </div>
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 border-t-2 border-t-[#FACC15]">
                    <div className="text-[11px] font-medium text-slate-500">Engagement</div>
                    <div className="text-xl font-bold text-[#B45309] mt-0.5 tabular-nums">Top 5%</div>
                    <div className="text-[10px] text-[#D97706] font-semibold mt-0.5">Nishangizda</div>
                  </div>
                </div>

                {/* AI Insights Card — Accent Yellow Theme */}
                <div className="bg-[#FEF3C7]/80 border border-[#FDE047] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#92400E] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                      AI Strategik Diagnostika
                    </span>
                    <span className="text-xs font-bold text-[#92400E] bg-white px-2 py-0.5 rounded border border-[#FDE047]">
                      Score: 82/100
                    </span>
                  </div>
                  <p className="text-xs text-[#78350F] leading-relaxed font-medium">
                    "Reels videolaringiz statik postlarga qaraganda <strong className="text-[#15803D] bg-[#DCFCE7] px-1 rounded">+142% yuqori qamrov</strong> bermoqda. Dastlabki 3 soniyada matnli hook ishlatishni tavsiya qilamiz."
                  </p>
                </div>

                {/* Today's Generated Scenario Snippet */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Bugungi virusli mavzu:</span>
                    <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">Reel • 32 soniya</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    "5 ta AI tool, siz hali ishlatmayapsiz"
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500">Kutilayotgan Views: <strong className="text-slate-800">8K–15K</strong></span>
                    <Link
                      href="/auth/telegram-activation"
                      className="text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>3 kun bepul sinab ko‘rish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.stepsTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t.stepsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 — Primary Blue */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2563EB] transition-all space-y-4 hover:shadow-card">
              <span className="inline-block text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-lg">
                01 QADAM
              </span>
              <h3 className="text-xl font-bold text-slate-900">{t.step1Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 — Accent Yellow */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#FACC15] transition-all space-y-4 hover:shadow-card">
              <span className="inline-block text-xs font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FDE047] px-2.5 py-1 rounded-lg">
                02 QADAM
              </span>
              <h3 className="text-xl font-bold text-slate-900">{t.step2Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 — Growth Green */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#22C55E] transition-all space-y-4 hover:shadow-card">
              <span className="inline-block text-xs font-bold text-[#15803D] bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-1 rounded-lg">
                03 QADAM
              </span>
              <h3 className="text-xl font-bold text-slate-900">{t.step3Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.step3Desc}</p>
            </div>

            {/* Step 4 — Primary Blue */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2563EB] transition-all space-y-4 hover:shadow-card">
              <span className="inline-block text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-lg">
                04 QADAM
              </span>
              <h3 className="text-xl font-bold text-slate-900">{t.step4Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (6 PREMIUM CARDS) */}
      <section id="features" className="py-20 sm:py-28 bg-ground border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.featuresTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 — Primary Blue */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#2563EB] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat1Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat1Desc}</p>
            </div>

            {/* Card 2 — Accent Yellow */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#FACC15] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE047] flex items-center justify-center text-[#92400E]">
                <Sparkles className="w-5 h-5 text-[#FACC15] fill-[#FACC15]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat2Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat2Desc}</p>
            </div>

            {/* Card 3 — Growth Green */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#22C55E] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat3Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat3Desc}</p>
            </div>

            {/* Card 4 — Primary Blue */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#2563EB] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat4Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat4Desc}</p>
            </div>

            {/* Card 5 — Accent Yellow */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#FACC15] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE047] flex items-center justify-center text-[#92400E]">
                <Calendar className="w-5 h-5 text-[#B45309]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat5Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat5Desc}</p>
            </div>

            {/* Card 6 — Growth Green */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#22C55E] hover:shadow-card transition-all space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.feat6Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.feat6Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE THING: DAILY SCENARIO GENERATOR SHOWCASE */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#BFDBFE]">
              Interaktiv Namunaviy Ssenariy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.dailyScenarioTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t.dailyScenarioSubtitle}
            </p>
          </div>

          {/* Interactive Scene Box */}
          <div className="max-w-4xl mx-auto bg-ground rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            
            {/* Header with Title & Metadata */}
            <div className="p-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    Reel
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Davomiyligi: 32 soniya</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Mavzu: 5 ta AI tool, siz hali ishlatmayapsiz
                </h3>
              </div>

              {/* Prediction Pills */}
              <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Kutilayotgan Views:</span>
                  <strong className="text-slate-900 font-bold">8K–15K</strong>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <span className="text-slate-500 block">Engagement:</span>
                  <strong className="text-[#22C55E] font-bold">4.8%–6.5%</strong>
                </div>
              </div>
            </div>

            {/* Scene Selector Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-100/70 overflow-x-auto text-xs font-semibold">
              {sampleScenes.map((scene, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSceneTab(idx)}
                  className={`px-5 py-3 whitespace-nowrap border-b-2 transition-all ${
                    activeSceneTab === idx
                      ? "bg-white border-[#2563EB] text-[#2563EB] font-bold"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {scene.title}
                </button>
              ))}
            </div>

            {/* Scene Content Details */}
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Action */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">
                    Kadr va Vizual Tasvir
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                    {sampleScenes[activeSceneTab].visual}
                  </div>
                </div>

                {/* Voice-over Script */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Voice-over (Ovoz matni)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyHook}
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-bold inline-flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EFF6FF]/60 border border-[#BFDBFE] text-sm text-slate-900 font-medium leading-relaxed">
                    "{sampleScenes[activeSceneTab].voiceover}"
                  </div>
                </div>

              </div>

              {/* Extra Production Guidance */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Kamera:</span>
                  <span className="font-semibold text-slate-800">{sampleScenes[activeSceneTab].camera}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Musiqa:</span>
                  <span className="font-semibold text-slate-800">Trending Lo-Fi Tech (110 BPM)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Yorug‘lik:</span>
                  <span className="font-semibold text-slate-800">Key light 45°, ko‘k kontur nuri</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/telegram-activation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>O‘z mavzuingizda AI ssenariy olish</span>
                </Link>
                <button
                  type="button"
                  onClick={quickDemoLogin}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB] text-sm font-semibold transition-colors"
                >
                  To‘liq Dashboardni sinab ko‘rish
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3 DAYS TIMELINE PROGRESSION */}
      <section className="py-20 sm:py-28 bg-ground border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.trialTimelineTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Hech qanday to‘lov kartasisiz to‘liq 3 kunlik sinov imkoniyati
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Day 1 — Primary Blue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#2563EB] transition-all space-y-3">
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
                1-KUN
              </span>
              <h3 className="text-base font-bold text-slate-900 pt-2">{t.day1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.day1Desc}</p>
            </div>

            {/* Day 2 — Growth Green */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#22C55E] transition-all space-y-3">
              <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md border border-[#86EFAC]">
                2-KUN
              </span>
              <h3 className="text-base font-bold text-slate-900 pt-2">{t.day2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.day2Desc}</p>
            </div>

            {/* Day 3 — Accent Yellow */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-[#FACC15] transition-all space-y-3">
              <span className="text-xs font-bold text-[#92400E] bg-[#FEF3C7] px-2.5 py-1 rounded-md border border-[#FDE047]">
                3-KUN
              </span>
              <h3 className="text-base font-bold text-slate-900 pt-2">{t.day3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.day3Desc}</p>
            </div>

            {/* Day 4 — Dark Navy */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-400 transition-all space-y-3">
              <span className="text-xs font-bold text-white bg-[#101828] px-2.5 py-1 rounded-md">
                4-KUN
              </span>
              <h3 className="text-base font-bold text-slate-900 pt-2">{t.day4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.day4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t.pricingSubtitle}
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-semibold mt-4">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.monthly}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  billingCycle === "yearly"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.yearly}
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* PRO PLAN */}
            <div className="rounded-2xl border-2 border-[#2563EB] bg-white p-8 flex flex-col justify-between shadow-apple relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{t.proPlan}</h3>
                    <p className="text-xs text-slate-500 mt-1">{t.proDesc}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold border border-[#FDE047]">
                    {t.popularBadge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                    {billingCycle === "monthly" ? "$19" : "$15"}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{t.perMonth}</span>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  {t.proFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  href="/auth/telegram-activation"
                  className="w-full text-center py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors shadow-sm block"
                >
                  {t.upgradeToPro}
                </Link>
              </div>
            </div>

            {/* MAX PLAN */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-subtle hover:border-[#2563EB] transition-all">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{t.maxPlan}</h3>
                    <p className="text-xs text-slate-500 mt-1">{t.maxDesc}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                    {billingCycle === "monthly" ? "$39" : "$31"}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{t.perMonth}</span>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  {t.maxFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  href="/auth/telegram-activation"
                  className="w-full text-center py-3.5 rounded-xl bg-[#101828] text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm block"
                >
                  {t.upgradeToMax}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOUNDER & ABOUT US */}
      <section id="about" className="py-20 sm:py-28 bg-ground border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-subtle">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Founder Avatar */}
              <div className="md:col-span-4 text-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="Founder"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover ring-4 ring-brand-50 shadow-md"
                />
                <div className="mt-3 font-bold text-slate-900 text-base">Alisher Karimov</div>
                <div className="text-xs text-slate-500">Founder & Product Lead</div>
              </div>

              {/* Founder Statement */}
              <div className="md:col-span-8 space-y-4 text-center md:text-left">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                  {t.aboutTitle}
                </span>
                <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  "{t.aboutDesc}"
                </blockquote>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Instagram algoritmlari har oy yangilanadi. Kontent yaratuvchi sifatida vaqtingizni
                  statistikalarni qo‘lda tahlil qilishga emas, o‘z ijodingiz va auditoriyangizga ajratishingiz
                  kerak. AI SMM platformasi ana shu yukni to‘liq o‘z zimmasiga oladi.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 sm:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.reviewsTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              O‘zbekiston va MDH dagi 500+ faol blogerlar va SMM agentliklari ishonchi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2563EB] hover:shadow-card transition-all space-y-4">
              <div className="flex items-center gap-1 text-[#FACC15]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{language === "ru"
                  ? "С помощью AI SMM Assistant охваты моих Reels выросли в 2 раза. Генерация хуков и поминутных сценариев экономит мне до 2 часов ежедневно."
                  : "AI SMM Assistant yordamida Reels videolarim qamrovi 2 barobarga oshdi. Ayniqsa hook va ssenariy generatsiyasi har kuni 2 soat vaqtimni tejaydi."}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">Jasur Bekmirzayev</div>
                  <div className="text-xs text-slate-500">Tech Blogger (120K obunachi)</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#FACC15] hover:shadow-card transition-all space-y-4">
              <div className="flex items-center gap-1 text-[#FACC15]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{language === "ru"
                  ? "Ведем 8 клиентских аккаунтов через эту платформу. Аналитика и еженедельный контент-календарь работают идеально."
                  : "Agentligimizdagi 8 ta mijoz akkauntini ushbu platforma orqali tahlil qilamiz. AI tavsiyalari va kontent kalendar juda aniq va qulay ishlangan."}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-100"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">Dilnoza Rahimova</div>
                  <div className="text-xs text-slate-500">SMM Agentlik rahbari</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#22C55E] hover:shadow-card transition-all space-y-4">
              <div className="flex items-center gap-1 text-[#FACC15]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{language === "ru"
                  ? "Незаменимый инструмент для создания продающих сценариев и призывов к действию. Конверсия выросла в первую же неделю."
                  : "Tovarlarimiz uchun ssenariy va CTA yaratishda tengsiz vosita. Birinchi haftadayoq profilingizdagi konversiya o‘sganini sezasiz."}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">Bobur Mansurov</div>
                  <div className="text-xs text-slate-500">E-commerce asoschisi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-20 sm:py-28 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t.finalCtaTitle}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bugunoq 3 kunlik bepul sinovni boshlang va Instagram profilingiz uchun professional AI strategiyasiga ega bo‘ling.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/telegram-activation"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 text-white font-bold text-base hover:bg-brand-500 transition-all shadow-float active:scale-[0.99]"
            >
              {t.finalCtaButton}
            </Link>
            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-navy-800 border border-slate-700 text-slate-200 font-semibold text-base hover:bg-navy-700 transition-colors"
            >
              Demo hisobga kirish
            </button>
          </div>
          <div className="text-xs text-slate-400 pt-2 font-medium">
            3 DAYS FREE • NO CARD REQUIRED • INSTANT TELEGRAM BOT SETUP
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
