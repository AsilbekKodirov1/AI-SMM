"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Users,
  CreditCard,
  Sparkles,
  Send,
  ArrowLeft,
  Check,
  Edit2,
  Trash2,
  Search,
  Activity,
  Layers,
  Lock,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"users" | "plans" | "ai" | "telegram">("users");

  // Admin login fallback if accessed directly
  const [adminEmail, setAdminEmail] = useState("admin@aismm.uz");
  const [adminPassword, setAdminPassword] = useState("admin123");

  // Price edit state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPriceMonth, setEditPriceMonth] = useState<string>("");
  const [editPriceYear, setEditPriceYear] = useState<string>("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleAdminQuickLogin = async () => {
    setLoading(true);
    const res = await login("admin@aismm.uz", "admin123");
    if (res.success) {
      await fetchAdminData();
    }
    setLoading(false);
  };

  const handleSavePrice = async (planId: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_price",
          planId,
          priceMonth: editPriceMonth,
          priceYear: editPriceYear,
        }),
      });
      if (res.ok) {
        setEditingPlanId(null);
        fetchAdminData();
      }
    } catch {}
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_user_role",
          userId,
          newRole,
        }),
      });
      fetchAdminData();
    } catch {}
  };

  if (!loading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-ground flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrator Ruxsati Talab Qilinadi</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ushbu panelga faqat tizim administratori kirishi mumkin. Administrator hisobi bilan kiring:
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
            <div>Email: <strong>admin@aismm.uz</strong></div>
            <div>Parol: <strong>admin123</strong></div>
          </div>

          <button
            type="button"
            onClick={handleAdminQuickLogin}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            Admin sifatida tezkor kirish
          </button>

          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 block">
            ← Dashboardga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const stats = adminData?.stats || {
    totalUsers: 1,
    activeSubs: 1,
    trialUsers: 1,
    totalScenarios: 1,
    totalAiLogs: 1,
    estimatedMRR: 39,
    botStatus: "Online (Healthy)",
  };

  return (
    <div className="min-h-screen bg-ground p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Dashboardga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-600" />
              <span>AI SMM — Administrator Paneli</span>
            </h1>
            <p className="text-xs text-slate-500">
              Platforma foydalanuvchilari, obunalar, narxlar va bot monitoringi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Bot Status: Ishlamoqda</span>
          </div>
        </div>
      </div>

      {/* Admin KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-xs font-semibold text-slate-500">Jami Foydalanuvchilar</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{stats.totalUsers}</div>
          <div className="text-[11px] font-semibold text-growth">
            {stats.trialUsers} ta sinov davrida
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-xs font-semibold text-slate-500">Faol Obunalar (Paid)</div>
          <div className="text-2xl font-bold text-brand-600 tabular-nums">{stats.activeSubs}</div>
          <div className="text-[11px] font-semibold text-slate-500">PRO & MAX</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-xs font-semibold text-slate-500">Taxminiy MRR (Oylik daromad)</div>
          <div className="text-2xl font-bold text-growth tabular-nums">${stats.estimatedMRR}</div>
          <div className="text-[11px] font-semibold text-slate-400">USD oylik reja</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-xs font-semibold text-slate-500">AI Ssenariylar Soni</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{stats.totalScenarios}</div>
          <div className="text-[11px] font-semibold text-brand-600">Generatsiya qilingan</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "users"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar ({adminData?.users?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "plans"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tarif Narxlari</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "ai"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Loglari</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("telegram")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "telegram"
              ? "border-brand-600 text-brand-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Telegram Kodlari</span>
        </button>
      </div>

      {/* TAB 1: USERS TABLE */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Ro‘yxatdan o‘tgan foydalanuvchilar</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Instagram</th>
                  <th className="py-3 px-4">Tarif</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {adminData?.users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{u.email}</td>
                    <td className="py-3 px-4 font-semibold text-brand-600">@{u.igHandle}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{u.role}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleRoleChange(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                        className="text-[11px] text-brand-600 hover:underline font-semibold"
                      >
                        {u.role === "ADMIN" ? "User qilish" : "Admin qilish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING MANAGER */}
      {activeTab === "plans" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Tarif narxlarini boshqarish</h2>
          <p className="text-xs text-slate-500">
            Landing page va dashboarddagi narxlarni to‘g‘ridan-to‘g‘ri o‘zgartiring:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {adminData?.plans?.map((pl: any) => (
              <div key={pl.id} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">{pl.code} TARIF</span>
                  <span className="text-xs text-slate-500">{pl.nameUz}</span>
                </div>

                {editingPlanId === pl.id ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Oylik narx ($):</label>
                      <input
                        type="number"
                        value={editPriceMonth}
                        onChange={(e) => setEditPriceMonth(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Yillik narx ($):</label>
                      <input
                        type="number"
                        value={editPriceYear}
                        onChange={(e) => setEditPriceYear(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSavePrice(pl.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold text-xs"
                      >
                        Saqlash
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPlanId(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm font-bold text-slate-900">
                      ${pl.priceMonth} / oy • ${pl.priceYear} / yil
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlanId(pl.id);
                        setEditPriceMonth(pl.priceMonth.toString());
                        setEditPriceYear(pl.priceYear.toString());
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Tahrirlash
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI USAGE LOGS */}
      {activeTab === "ai" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-base">AI Ishlatilish Statistikasi va Tokenlar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Amal turi</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Tokenlar</th>
                  <th className="py-3 px-4">Vaqt (ms)</th>
                  <th className="py-3 px-4">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {adminData?.logs?.map((lg: any) => (
                  <tr key={lg.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{lg.user?.name || "Demo"}</td>
                    <td className="py-3 px-4 font-semibold text-brand-600">{lg.actionType}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{lg.modelName}</td>
                    <td className="py-3 px-4 tabular-nums">{lg.promptTokens + lg.completionTokens}</td>
                    <td className="py-3 px-4 tabular-nums">{lg.executionMs} ms</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(lg.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TELEGRAM CODES */}
      {activeTab === "telegram" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Telegram Aktivatsiya Kodlari</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">8 Xonali Kod</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Yaratilgan</th>
                  <th className="py-3 px-4">Muddati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {adminData?.activationCodes?.map((cd: any) => (
                  <tr key={cd.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{cd.user?.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-700 tracking-wider">
                      {cd.code}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cd.isUsed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {cd.isUsed ? "Ishlatilgan / Faol" : "Kutilmoqda"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(cd.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(cd.expiresAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
