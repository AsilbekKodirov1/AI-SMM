import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Foydalanish Shartlari (Terms of Service) | AI SMM Assistant",
  description: "AI SMM Assistant xizmatlaridan foydalanish shartlari va qoidalari.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "2026-11-04";

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

            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-700 text-xs font-bold w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Foydalanish qoidalari</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Foydalanish Shartlari (Terms of Service)
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Oxirgi yangilanish sanasi: <span className="font-semibold text-slate-700">{lastUpdated}</span>
            </p>
          </div>

          {/* Terms Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>1. Shartlarni qabul qilish</span>
              </h2>
              <p>
                <strong>AI SMM Assistant</strong> veb-platformasi yoki uning xizmatlaridan (shu jumladan Telegram bot va Meta API integratsiyalaridan) foydalanish orqali siz ushbu Foydalanish shartlariga to‘liq rozilik bildirasiz.
              </p>
              <p>
                Agar siz ushbu shartlarning biron bir bandiga rozi bo‘lmasangiz, platformadan foydalanmasligingiz tavsiya etiladi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                2. Xizmatlar tavsifi
              </h2>
              <p>
                AI SMM Assistant kontent yaratuvchilar, blogerlar va SMM mutaxassislari uchun quyidagi xizmatlarni taqdim etuvchi dasturiy ta'minot (SaaS) hisoblanadi:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-brand-600">
                <li>Instagram profilingizning statistik ko‘rsatkichlarini tahlil qilish;</li>
                <li>Sun'iy intellekt (AI) algoritmlari asosida video ssenariylari (Reels/TikTok/Shorts) yaratish;</li>
                <li>Kontent kalendari va nashr vaqtlarini rejalashtirish;</li>
                <li>Auditoriya qamrovi va faolligini oshirish bo‘yicha tahliliy hisobotlar taqdim etish.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                3. Meta va Instagram platformasi talablari
              </h2>
              <p>
                Platformamiz <strong>Meta for Developers</strong> rasmiy qoidalariga muvofiq ishlaydi. Instagram hisobini ulashda foydalanuvchilar quyidagilarga rozi bo‘ladilar:
              </p>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Foydalanuvchi faqat o‘ziga tegishli yoki boshqarish huquqiga ega bo‘lgan Instagram hisoblarini ulashi shart.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Platformadan spam, avtomatlashtirilgan sun'iy layk yoki Instagram qoidalariga zid bo‘lgan noqonuniy maqsadlarda foydalanish taqiqlanadi.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Foydalanuvchi istalgan paytda Meta/Instagram sozlamalari orqali platformaga berilgan ruxsatnomani bekor qilishi mumkin.</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                4. Sun'iy intellekt (AI) tomonidan yaratilgan kontent huquqlari
              </h2>
              <p>
                Platforma orqali yaratilgan barcha ssenariylar, matnlar va kontent g‘oyalariga bo‘lgan mulkiy huquqlar to‘liq foydalanuvchiga tegishli bo‘ladi. Foydalanuvchi ushbu ssenariylarni o‘z ijtimoiy tarmoqlarida erkin nashr etish va tijoriy maqsadlarda ishlatish huquqiga ega.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Obuna va to‘lovlar
              </h2>
              <p>
                Platforma yangi foydalanuvchilar uchun 3 kunlik bepul sinov (Trial) davrini taqdim etadi. Sinov davri yakunlangach, xizmatlardan uzluksiz foydalanish uchun mavjud tarif rejalaridan (PRO yoki MAX) biriga obuna bo‘lish lozim.
              </p>
              <p>
                To‘lovlar O‘zbekiston va xalqaro to‘lov tizimlari orqali qonuniy va xavfsiz qabul qilinadi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>6. Javobgarlikning cheklanishi</span>
              </h2>
              <p>
                AI SMM Assistant tomonidan taqdim etiladigan AI ssenariylar va maslahatlar tavsiyaviy xarakterga ega. Platforma video ko‘rishlari sonining 100% o‘sishini kafolatlamaydi, chunki natijalar kontent sifati, video montaji va auditoriyaning individual xatti-harakatlariga bog‘liq.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                7. Aloqa
              </h2>
              <p>
                Foydalanish shartlari bo‘yicha qo‘shimcha savollar bo‘lsa:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div><strong>Email:</strong> legal@aismm.uz / support@aismm.uz</div>
                <div><strong>Manzil:</strong> Toshkent shahri, O‘zbekiston</div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

