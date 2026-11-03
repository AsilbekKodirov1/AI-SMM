"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Video,
  Wand2,
  Calendar,
  Settings,
  Shield,
  Zap,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: t.sidebarOverview, icon: LayoutDashboard },
    { href: "/dashboard/analytics", label: t.sidebarAnalytics, icon: BarChart3 },
    { href: "/dashboard/ai-analysis", label: t.sidebarAiAnalysis, icon: Lightbulb },
    { href: "/dashboard/scenarios", label: t.sidebarScenarios, icon: Video },
    { href: "/dashboard/generator", label: t.sidebarGenerator, icon: Wand2 },
    { href: "/dashboard/calendar", label: t.sidebarCalendar, icon: Calendar },
    { href: "/dashboard/settings", label: t.sidebarSettings, icon: Settings },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ href: "/admin", label: t.sidebarAdmin, icon: Shield });
  }

  const daysLeft = user?.subscription?.daysLeft ?? 2;
  const isTrial = user?.subscription?.status === "TRIAL";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full select-none">
      
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              AI SMM <span className="text-brand-600 font-extrabold text-xs">PRO</span>
            </span>
          </Link>
        </div>

        {/* Navigation Items (Anti-slop: neutral tone step, dark label on active) */}
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 px-3 mb-2">
            Platforma
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-brand-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Subscription Status & Profile */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        
        {/* Trial / Subscription Card */}
        {isTrial ? (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                {t.trialDaysLeft}
              </span>
              <span className="text-xs font-bold text-amber-900 tabular-nums">
                {daysLeft} {t.daysUnit}
              </span>
            </div>
            <Link
              href="/dashboard/settings?tab=subscription"
              onClick={onCloseMobile}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors shadow-sm block text-center"
            >
              PRO tarifga o‘tish
            </Link>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>Tarif: <strong>{user?.subscription?.planCode || "PRO"}</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        )}

        {/* User Profile Mini Bar */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={
                user?.profile?.avatarUrl ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="truncate">
              <div className="font-bold text-slate-800 truncate">{user?.name || "Sardor Olimov"}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || "demo@aismm.uz"}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
}
