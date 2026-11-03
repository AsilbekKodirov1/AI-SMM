"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Instagram,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  Sparkles,
  ExternalLink,
  Check,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"profile" | "accounts" | "subscription">("subscription");

  // Profile form
  const [name, setName] = useState(user?.name || "Sardor Olimov");
  const [email, setEmail] = useState(user?.email || "demo@aismm.uz");

  // Instagram account state
  const [newIgHandle, setNewIgHandle] = useState("");
  const [accountConnectSuccess, setAccountConnectSuccess] = useState(false);

  // Subscription modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState<"PRO" | "MAX">("PRO");
  const [paymentProvider, setPaymentProvider] = useState<"Payme" | "Click" | "Stripe">("Payme");
  const [paying, setPaying] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "profile" || tabParam === "accounts" || tabParam === "subscription") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleConnectInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIgHandle) return;
    try {
      const res = await fetch("/api/instagram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newIgHandle }),
      });
      if (res.ok) {
        await refreshUser();
        // Also run audit
        await fetch("/api/ai/audit", { method: "POST", headers: { "Content-Type": "application/json" } });
        setAccountConnectSuccess(true);
        setTimeout(() => {
          setAccountConnectSuccess(false);
          setNewIgHandle("");
        }, 1200);
      }
    } catch {}
  };

  const handleDemoCheckout = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode: selectedPlanCode,
          paymentMethod: `${paymentProvider} Demo Checkout`,
        }),
      });

      if (res.ok) {
        setUpgradeSuccess(true);
        await refreshUser();
        setTimeout(() => {
          setUpgradeSuccess(false);
          setCheckoutModalOpen(false);
        }, 1500);
      }
    } catch {
    } finally {
      setPaying(false);
    }
  };

  const daysLeft = user?.subscription?.daysLeft ?? 2;
  const isTrial = user?.subscription?.status === "TRIAL";

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sozlamalar va Obuna
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Profil, ulangan Instagram akkauntlari va tarif rejalari
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "subscription"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Obuna va Tariflar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("accounts")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "accounts"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram Akkauntlar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "profile"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Foydalanuvchi Profili</span>
        </button>
      </div>

      {/* TAB 1: SUBSCRIPTION & PAYWALL */}
      {activeTab === "subscription" && (
        <div className="space-y-8">
          
          {/* Current Status Banner */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Joriy holat:
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                    isTrial
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isTrial ? "3 Kunlik Sinov Davri" : user?.subscription?.planCode || "PRO"}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {isTrial
                  ? `Sinov muddati tugashiga ${daysLeft} kun qoldi`
                  : "Obunangiz faol holatda. Barcha cheklovlar olib tashlangan."}
              </p>
            </div>

            {isTrial && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanCode("PRO");
                  setCheckoutModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Cheksiz PRO ga o‘tish
              </button>
            )}
          </div>

          {/* Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            
            {/* PRO */}
            <div className="rounded-2xl border-2 border-brand-600 bg-white p-7 shadow-apple space-y-6 flex flex-col justify-between relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">PRO TARIF</h3>
                    <p className="text-xs text-slate-500">Shaxsiy blogerlar va mutaxassislar uchun</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    Ommabop
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  $19 <span className="text-xs font-semibold text-slate-400">/ oy</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-growth shrink-0" />
                    <span>1 ta Instagram akkaunt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-growth shrink-0" />
                    <span>AI Analytics & Account Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-growth shrink-0" />
                    <span>Daily Content Ideas & Reels Scenarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-growth shrink-0" />
                    <span>Captions & Content Calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-growth shrink-0" />
                    <span>Basic AI Predictions</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanCode("PRO");
                  setCheckoutModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors block text-center"
              >
                PRO tarifga o‘tish ($19)
              </button>
            </div>

            {/* MAX */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-subtle space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">MAX TARIF</h3>
                  <p className="text-xs text-slate-500">Agentliklar va yirik blogerlar uchun</p>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  $39 <span className="text-xs font-semibold text-slate-400">/ oy</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Bir nechta Instagram akkauntlari (5 tagacha)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Advanced Analytics & Competitor Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Cheksiz AI g‘oyalar va ssenariylar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Priority AI Processing (Navbatsiz)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Telegram bot to‘liq integratsiyasi</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanCode("MAX");
                  setCheckoutModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-sm transition-colors block text-center"
              >
                MAX tarifga o‘tish ($39)
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INSTAGRAM ACCOUNTS */}
      {activeTab === "accounts" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Ulangan Instagram akkauntlari</h2>
            
            {user?.instagramAccount?.isConnected ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-sm">
                    IG
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>@{user.instagramAccount.username}</span>
                      <span className="text-[10px] font-bold bg-growth-light text-growth-dark px-1.5 py-0.5 rounded">
                        Faol ulangan
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.instagramAccount.followersCount?.toLocaleString() || 0} kuzatuvchilar
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/instagram/connect", { method: "DELETE" });
                    await refreshUser();
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  Akkauntni uzish
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                <div className="text-sm font-semibold text-slate-700">Hozircha hech qanday akkaunt ulanmagan</div>
                <p className="text-xs text-slate-400">Statistika va AI tavsiyalarini olish uchun pastda o‘z profilingizni ulang</p>
              </div>
            )}
          </div>

          {/* Connect New Instagram Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Yangi Instagram akkaunt ulash</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instagram Graph API OAuth orqali yoki tezkor tahlil uchun istalgan ochiq username kiriting:
            </p>

            <form onSubmit={handleConnectInstagram} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={newIgHandle}
                  onChange={(e) => setNewIgHandle(e.target.value)}
                  placeholder="username"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-brand-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors shrink-0"
              >
                {accountConnectSuccess ? "Ulandi!" : "Akkauntni Ulash"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: USER PROFILE */}
      {activeTab === "profile" && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900">Shaxsiy profil</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">To‘liq ism</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Interfeys tili</label>
              <select
                value={language}
                onChange={(e: any) => setLanguage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="uz">O‘zbek tili</option>
                <option value="ru">Русский язык</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert("Profil ma'lumotlari yangilandi")}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
              >
                O‘zgarishlarni saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO PAYMENT MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Demo To‘lov Interfeysi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Eslatma:</strong> Bu demo to‘lov interfeysi. Haqiqiy to‘lov kartasi talab qilinmaydi va hisobingizdan mablag‘ yechilmaydi.
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanlangan tarif:</span>
                <strong className="text-slate-900">{selectedPlanCode} TARIF</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">To‘lov summasi:</span>
                <strong className="text-brand-600 text-sm">
                  {selectedPlanCode === "PRO" ? "$19 / oy" : "$39 / oy"}
                </strong>
              </div>

              {/* Payment provider selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  To‘lov tizimini tanlang (Demo):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Payme", "Click", "Stripe"] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setPaymentProvider(prov)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentProvider === prov
                          ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleDemoCheckout}
                disabled={paying}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {upgradeSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Faollashtirildi!</span>
                  </>
                ) : (
                  <span>{paying ? "To‘lanmoqda..." : "Demo To‘lovni Tasdiqlash"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
