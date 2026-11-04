import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Maxfiylik Siyosati (Privacy Policy) | AI SMM Assistant",
  description: "AI SMM Assistant platformasining maxfiylik siyosati va foydalanuvchi ma'lumotlarini himoya qilish qoidalari.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026-11-04";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link & Header */}
          <div className="mb-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bosh sahifaga qaytish</span>
            </Link>

            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-700 text-xs font-bold w-fit">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              <span>Maxfiylik va Xavfsizlik</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Maxfiylik Siyosati (Privacy Policy)
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Oxirgi yangilanish sanasi: <span className="font-semibold text-slate-700">{lastUpdated}</span>
            </p>
          </div>

          {/* Policy Content Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>1. Umumiy qoidalar</span>
              </h2>
              <p>
                Ushbu Maxfiylik siyosati <strong>AI SMM Assistant</strong> («biz», «platforma») xizmatlaridan foydalanganingizda, xususan Meta (Facebook & Instagram) API orqali akkauntingizni ulaganingizda, sizning shaxsiy ma'lumotlaringiz qanday to‘planishi, ishlatilishi va himoyalanishini belgilaydi.
              </p>
              <p>
                Platformamiz foydalanuvchilarning maxfiyligini hurmat qiladi hamda xalqaro ma'lumotlarni himoya qilish standartlari (GDPR) va <strong>Meta Platform Policy</strong> talablariga to‘liq rioya etadi.
              </p>
            </section>

            {/* Collected Information */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-600" />
                <span>2. Qanday ma'lumotlarni to‘playmiz?</span>
              </h2>
              <p>
                Biz faqatgina xizmatlarimizni (AI analitika, kontent ssenariylari, o‘sish strategiyalari) sifatli ko‘rsatish uchun zarur bo‘lgan minimal ma'lumotlarni to‘playmiz:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-brand-600">
                <li>
                  <strong>Profil ma'lumotlari:</strong> Foydalanuvchi ismi, elektron pochta manzili yoki Telegram ID (tizimga kirish uchun).
                </li>
                <li>
                  <strong>Instagram ma'lumotlari (Meta OAuth orqali):</strong> Instagram username, Scoped Instagram ID, profil rasmi, obunachilar (followers) soni, kuzatilayotganlar soni va e'lon qilingan postlar/reels soni.
                </li>
                <li>
                  <strong>Instagram Insights:</strong> Postlar va videolarning umumiy ko‘rishlari (views), qamrovi (reach) va faollik (engagement) statistikasi.
                </li>
                <li>
                  <strong>Texnik ma'lumotlar:</strong> Tizim xavfsizligini ta'minlash uchun sessiya identifikatorlari va cookie fayllari.
                </li>
              </ul>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <strong>Muhim eslatma:</strong> Biz sizning Instagram akkauntingiz parolini <u>hech qachon so‘ramaymiz va saqlamaymiz</u>. Barcha ulanishlar Meta kompaniyasining rasmiy, xavfsiz OAuth 2.0 protokoli orqali amalga oshiriladi.
              </div>
            </section>

            {/* Usage */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-600" />
                <span>3. Ma'lumotlardan qanday maqsadda foydalanamiz?</span>
              </h2>
              <p>To‘plangan ma'lumotlar faqat quyidagi maqsadlarda ishlatiladi:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Profil statistikasi va auditoriya o‘sishini monitoring qilish</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Sizning nishangizga mos moslashtirilgan AI Reels ssenariylari yaratish</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Profilingiz faollik darajasi va engagement tahlillarini ko‘rsatish</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-growth shrink-0 mt-0.5" />
                  <span className="text-xs">Haftalik kontent rejasi (Content Calendar) tuzish</span>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-600" />
                <span>4. Ma'lumotlar xavfsizligi va shifrlash</span>
              </h2>
              <p>
                Biz ma'lumotlaringiz xavfsizligini ta'minlash uchun zamonaviy kiberxavfsizlik protokollarini qo‘llaymiz:
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-brand-600">
                <li>
                  Barcha Meta Access Tokenlar ma'lumotlar bazasida <strong>AES-256-GCM</strong> algoritmi orqali qat'iy shifrlangan holatda saqlanadi.
                </li>
                <li>
                  Veb-sayt va server o‘rtasidagi barcha aloqalar 256-bitli <strong>HTTPS/TLS</strong> shifrlangan kanal orqali yuritiladi.
                </li>
                <li>
                  Access Tokenlar hech qachon mijoz (brauzer) frontendiga yuborilmaydi.
                </li>
                <li>
                  Har bir foydalanuvchi faqat o‘ziga tegishli Instagram akkaunt ma'lumotlarini ko‘rish huquqiga ega (Multi-tenant izolyatsiya).
                </li>
              </ul>
            </section>

            {/* Third parties */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Uchinchi shaxslarga ma'lumot berilmasligi
              </h2>
              <p>
                Biz foydalanuvchilarning shaxsiy yoki statistik ma'lumotlarini uchinchi shaxslarga, reklama agentliklariga yoki vositachilarga <strong>sotmaymiz, ijaraga bermaymiz va oshkor qilmaymiz</strong>.
              </p>
            </section>

            {/* Data Deletion */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                6. Ma'lumotlarni o‘chirish (Data Deletion)
              </h2>
              <p>
                Siz istalgan vaqtda o‘z Instagram akkauntingizni platformamizdan uzishingiz va saqlangan barcha ma'lumotlarni butunlay o‘chirib yuborishingiz mumkin.
              </p>
              <p>
                Buning uchun Dashboard yoki Sozlamalar sahifasidagi <strong>«Akkauntni uzish»</strong> tugmasini bosing yoki batafsil ko‘rsatmalarni olish uchun{" "}
                <Link href="/data-deletion" className="text-brand-600 hover:underline font-semibold">
                  Ma'lumotlarni o‘chirish bo‘yicha qo‘llanma (Data Deletion)
                </Link>{" "}
                sahifasiga o‘ting.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                7. Bog‘lanish
              </h2>
              <p>
                Maxfiylik siyosati yoki shaxsiy ma'lumotlaringiz bo‘yicha savollaringiz bo‘lsa, biz bilan bog‘lanishingiz mumkin:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div><strong>Platforma:</strong> AI SMM Assistant</div>
                <div><strong>Email:</strong> support@aismm.uz</div>
                <div><strong>Telegram:</strong> @aismm_assistant_bot</div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
