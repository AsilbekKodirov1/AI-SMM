"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Menu, X, ArrowRight, User as UserIcon, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                AI SMM <span className="text-brand-600 font-semibold text-xs ml-1 px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200">Pro</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1">
                Assistant Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              {t.navHome}
            </Link>
            <Link href="#how-it-works" className="hover:text-brand-600 transition-colors">
              {t.navHowItWorks}
            </Link>
            <Link href="#features" className="hover:text-brand-600 transition-colors">
              {t.navFeatures}
            </Link>
            <Link href="#pricing" className="hover:text-brand-600 transition-colors">
              {t.navPricing}
            </Link>
            <Link href="#about" className="hover:text-brand-600 transition-colors">
              {t.navAbout}
            </Link>
            <Link href="#reviews" className="hover:text-brand-600 transition-colors">
              {t.navReviews}
            </Link>
          </nav>

          {/* Right side: Language + Auth CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("uz")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === "uz"
                    ? "bg-white text-brand-700 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLanguage("ru")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === "ru"
                    ? "bg-white text-brand-700 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                RU
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.navDashboard}
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  {t.navLogout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
                >
                  {t.navLogin}
                </Link>
                <Link
                  href="/auth/telegram-activation"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all hover:shadow"
                >
                  <span>{t.navStartFree}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile language switch */}
            <button
              type="button"
              onClick={() => setLanguage(language === "uz" ? "ru" : "uz")}
              className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-700 border border-slate-200"
            >
              {language.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 px-5 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navHome}
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navHowItWorks}
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navFeatures}
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navPricing}
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navAbout}
            </Link>
            <Link
              href="#reviews"
              onClick={() => setMobileOpen(false)}
              className="hover:text-brand-600"
            >
              {t.navReviews}
            </Link>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm"
              >
                {t.navDashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm"
                >
                  {t.navLogin}
                </Link>
                <Link
                  href="/auth/telegram-activation"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
                >
                  {t.navStartFree}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
