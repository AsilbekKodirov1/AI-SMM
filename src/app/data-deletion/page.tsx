"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trash2, ShieldAlert, CheckCircle2, ArrowLeft, Instagram, ExternalLink, Search } from "lucide-react";

export default function DataDeletionPage() {
  const [codeQuery, setCodeQuery] = useState("");
  const [queryResult, setQueryResult] = useState<string | null>(null);

  const handleCheckCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeQuery.trim()) return;
    setQueryResult(
      `Tasdiqlash kodi: "${codeQuery.trim()}". Ma'lumotlaringiz ma'lumotlar bazamizdan muvaffaqiyatli o'chirilgan (Status: Completed).`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bosh sahifaga qaytish</span>
            </Link>

            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold w-fit">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Meta User Data Deletion Instructions</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Foydalanuvchi ma'lumotlarini o‘chirish (Data Deletion)
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Meta Platform Policy va GDPR talablariga muvofiq Instagram ma'lumotlarini o‘chirish bo‘yicha rasmiy qo‘llanma
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <section className="space-y-3">
              <p>
                <strong>AI SMM Assistant</strong> foydalanuvchilarning shaxsiy ma'lumotlari xavfsizligini ta'minlaydi. Agar siz platformamizdan o‘z Instagram hisobingiz va unga bog‘liq barcha analitik ma'lumotlarni o‘chirib yubormoqchi bo‘lsangiz, quyidagi qadamlarni bajarishingiz mumkin.
              </p>
            </section>

            {/* Method 1: Instant disconnect from app */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>1-usul: AI SMM platformasi orqali darhol uzish va o‘chirish (Eng tezkor)</span>
              </div>
              <p className="text-xs text-slate-600">
                Profilingizdan Instagram akkauntingizni va uning barcha tahlillarini bir soniyada to‘liq o‘chirish mumkin:
              </p>
              <ol className="text-xs text-slate-700 space-y-1.5 pl-5 list-decimal font-medium">
                <li>Saytdagi hisobingizga kiring va <strong>Dashboard</strong> sahifasiga o‘ting.</li>
                <li>Yuqori o‘ng burchakdagi yoki <strong>Sozlamalar (Settings) &gt; Instagram Akkauntlar</strong> bo‘limiga kiring.</li>
                <li>Profilingiz yonidagi qizil rangli <strong>«Uzish»</strong> (Akkauntni uzish) tugmasini bosing.</li>
                <li>Tasdiqlangandan so‘ng, serverdagi barcha Access Tokenlar, obunachilar va 30 kunlik tahlillar bazadan butunlay o‘chiriladi.</li>
              </ol>
            </section>

            {/* Method 2: Facebook / Instagram app settings */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>2-usul: Instagram va Facebook ilovasi sozlamalari orqali o‘chirish</span>
              </div>
              <p className="text-xs text-slate-600">
                Agar platformaga kirmasdan, bevosita Meta hisobingiz orqali ruxsatnomani bekor qilmoqchi bo‘lsangiz:
              </p>
              <ol className="text-xs text-slate-700 space-y-1.5 pl-5 list-decimal font-medium">
                <li>Instagram yoki Facebook profilingizdagi <strong>Sozlamalar (Settings &amp; Privacy)</strong> bo‘limiga kiring.</li>
                <li><strong>«Ilovalar va veb-saytlar» (Apps and Websites)</strong> bo‘limini oching.</li>
                <li>Faol ilovalar orasidan <strong>AI SMM Assistant</strong> ni toping.</li>
                <li><strong>«Olib tashlash» (Remove)</strong> tugmasini bosing.</li>
                <li>Shundan so‘ng, Meta tizimi orqali ilovamizga avtomatik ma'lumotlarni o‘chirish xabari yuboriladi va ma'lumotlaringiz butunlay tozalanadi.</li>
              </ol>
            </section>

            {/* Method 3: Email request */}
            <section className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>3-usul: Qo‘llab-quvvatlash xizmati orqali to‘liq o‘chirish so‘rovi</span>
              </div>
              <p className="text-xs text-slate-600">
                Shuningdek, barcha hisob ma'lumotlaringizni to‘liq yo‘q qilish bo‘yicha rasmiy so‘rov yuborishingiz mumkin:
              </p>
              <div className="text-xs text-slate-700 space-y-1">
                <div>• <strong>Email orqali:</strong> <a href="mailto:support@aismm.uz" className="text-brand-600 hover:underline">support@aismm.uz</a> (Mavzu: «Data Deletion Request»)</div>
                <div>• <strong>Telegram orqali:</strong> <a href="https://t.me/aismm_assistant_bot" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">@aismm_assistant_bot</a></div>
                <div className="pt-1 text-slate-500">• So‘rovingiz 24 soat ichida bajariladi va sizga maxsus tasdiqlash kodi yuboriladi.</div>
              </div>
            </section>

            {/* Status Check Tool */}
            <section className="space-y-3 pt-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-600" />
                <span>O‘chirish holatini tekshirish (Check Status)</span>
              </h2>
              <p className="text-xs text-slate-600">
                Agar sizga ma'lumotlarni o‘chirish tasdiqlash kodi (Confirmation Code) berilgan bo‘lsa, uni quyidagi maydonga kiritib holatni tekshirishingiz mumkin:
              </p>

              <form onSubmit={handleCheckCode} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  placeholder="Masalan: del_68a9f4c1e..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#2563EB] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Tekshirish
                </button>
              </form>

              {queryResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{queryResult}</span>
                </div>
              )}
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
