"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Menu,
  Check,
  Instagram,
  ChevronDown,
  Sparkles,
  Plus,
} from "lucide-react";

interface TopbarProps {
  onOpenMobile: () => void;
}

export default function Topbar({ onOpenMobile }: TopbarProps) {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [localIgAccount, setLocalIgAccount] = useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aismm_active_account");
      if (saved) {
        try { setLocalIgAccount(JSON.parse(saved)); } catch {}
      }
    }
  }, [user]);

  const igAccount = localIgAccount || user?.instagramAccount;
  const isConnected = !!igAccount?.isConnected;

  const notifications = [
    {
      id: "1",
      title: "Haftalik AI hisoboti tayyor!",
      time: "10 daqiqa oldin",
      unread: true,
    },
    {
      id: "2",
      title: "Bugungi Reels g‘oyasi yangilandi",
      time: "2 soat oldin",
      unread: false,
    },
    {
      id: "3",
      title: "Xush kelibsiz! 3 kunlik sinov faollashtirildi.",
      time: "Kecha",
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20">
      
      {/* Mobile Hamburger & Connected Account Pill */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Connected Instagram Account Selector */}
        <div className="relative">
          {isConnected ? (
            <button
              type="button"
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                <Instagram className="w-3 h-3" />
              </div>
              <span className="font-bold">@{igAccount.username}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <Link
              href="/dashboard/settings?tab=accounts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-amber-600" />
              <span>Instagram ulanmagan (+ Ulash)</span>
            </Link>
          )}

          {/* Account Dropdown */}
          {accountDropdownOpen && isConnected && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-card p-2 text-xs z-30">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1">
                Ulangan Instagram
              </div>
              <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">@{igAccount.username}</div>
                    <div className="text-[10px] text-slate-500">
                      {igAccount.followersCount} obunachi • Faol
                    </div>
                  </div>
                </div>
                <Check className="w-4 h-4 text-[#2563EB]" />
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <Link
                  href="/dashboard/settings?tab=accounts"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="w-full text-center py-1.5 rounded-lg text-[11px] font-semibold text-[#2563EB] hover:bg-slate-50 block"
                >
                  Akkauntni o‘zgartirish yoki uzish
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Language, Notifications, Quick Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLanguage("uz")}
            className={`px-2.5 py-1 rounded-full transition-all ${
              language === "uz" ? "bg-white text-[#2563EB] shadow-sm font-bold" : "text-slate-500"
            }`}
          >
            UZ
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ru")}
            className={`px-2.5 py-1 rounded-full transition-all ${
              language === "ru" ? "bg-white text-[#2563EB] shadow-sm font-bold" : "text-slate-500"
            }`}
          >
            RU
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-card p-3 text-xs z-30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                <span>Bildirishnomalar</span>
                <span className="text-[10px] text-[#2563EB] font-semibold cursor-pointer">
                  O‘qilgan qilish
                </span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      n.unread ? "bg-blue-50/50 border-blue-100" : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="font-semibold text-slate-800">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Scenario CTA Shortcut */}
        <Link
          href="/dashboard/generator"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Kontent Yaratish</span>
        </Link>

      </div>

    </header>
  );
}
