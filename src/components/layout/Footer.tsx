"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Send, Instagram, Youtube, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                AI SMM Assistant
              </span>
            </div>
            <p className="max-w-md text-slate-400 text-sm leading-relaxed">
              Instagram blogerlar, kontent yaratuvchilar va bizneslar uchun sun'iy intellekt
              orqali tahlil, virusli Reels ssenariylari va o‘sish strategiyasini taqdim etuvchi SaaS platformasi.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://t.me/aismm_assistant_bot"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs">
              {t.navFeatures}
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Instagram Analytics
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  AI Account Analysis
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Daily Reels Scenarios
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Content Calendar
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  {t.navPricing}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs">
              {t.navAbout}
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  Bizning maqsadimiz
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Maxfiylik siyosati (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Foydalanish shartlari (Terms of Service)
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-white transition-colors">
                  Ma'lumotlarni o‘chirish (Data Deletion)
                </Link>
              </li>
              <li>
                <Link href="/auth/telegram-activation" className="hover:text-white transition-colors">
                  Telegram Bot
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI SMM Assistant. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for creators in Uzbekistan & Worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
}
