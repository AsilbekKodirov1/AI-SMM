"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Calendar,
  Save,
  RotateCw,
  Video,
  Camera,
  Sun,
  Music,
  Mic,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

export default function GeneratorPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [niche, setNiche] = useState("Education / Technology");
  const [topic, setTopic] = useState("5 ta AI tool, siz hali ishlatmayapsiz");
  const [audience, setAudience] = useState("SMM mutaxassislari, frilanserlar va tadbirkorlar");
  const [contentType, setContentType] = useState("Reel");
  const [duration, setDuration] = useState("30s");
  const [contentLang, setContentLang] = useState<"uz" | "ru">("uz");
  const [goal, setGoal] = useState("Reach (Qamrov va yangi obunachilar)");

  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          topic,
          audience,
          contentType,
          duration,
          language: contentLang,
          goal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const sc = data.scenario;
        let scenes = [];
        try {
          scenes = JSON.parse(sc.scenesJson);
        } catch {
          scenes = [];
        }

        setGeneratedResult({
          ...sc,
          scenes,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    const text = `HOOK: ${generatedResult.hook}\n\nSCENARIO:\n${generatedResult.scriptBody}\n\nCAPTION:\n${generatedResult.caption}\n\nCTA: ${generatedResult.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCalendar = async () => {
    if (!generatedResult) return;
    try {
      await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedResult.title,
          contentType: generatedResult.contentType,
          scheduledDate: new Date(),
          scheduledTime: "19:30",
          notes: generatedResult.caption,
        }),
      });
      alert("Kontent kalendarga muvaffaqiyatli qo‘shildi!");
      router.push("/dashboard/calendar");
    } catch {}
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Wand2 className="w-6 h-6 text-brand-600" />
          <span>AI Content Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Nisha, maqsad va parametrlarni belgilang — AI professional virusli video ssenariy tayyorlaydi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Parameters */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Kontent parametrlari</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {/* Niche */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.genNicheLabel}
              </label>
              <input
                type="text"
                required
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Masalan: Ta'lim, Fitness, Real Estate, E-commerce"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:outline-none font-medium"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.genTopicLabel}
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Video mavzusi yoki asosiy g‘oya"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:outline-none font-medium"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.genAudienceLabel}
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Masalan: Yoshlar, Talabalar, Biznes egalari"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:outline-none font-medium"
              />
            </div>

            {/* Content Type & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.genTypeLabel}
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-brand-600 focus:outline-none"
                >
                  <option value="Reel">Reels (9:16)</option>
                  <option value="Carousel">Karusel post</option>
                  <option value="Story">Story</option>
                  <option value="Post">Statik post</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.genDurationLabel}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-brand-600 focus:outline-none"
                >
                  <option value="15s">15 soniya</option>
                  <option value="30s">30 soniya</option>
                  <option value="60s">60 soniya</option>
                  <option value="90s">90 soniya</option>
                </select>
              </div>
            </div>

            {/* Language & Strategic Goal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kontent tili
                </label>
                <select
                  value={contentLang}
                  onChange={(e: any) => setContentLang(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-brand-600 focus:outline-none"
                >
                  <option value="uz">O‘zbek tili</option>
                  <option value="ru">Русский язык</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.genGoalLabel}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-brand-600 focus:outline-none"
                >
                  <option value="Reach">Reach (Qamrov)</option>
                  <option value="Engagement">Engagement (Izohlar)</option>
                  <option value="Sales">Sales (Sotuv / Lidlar)</option>
                  <option value="Saves">Saves (Saqlashlar)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                <span>{generating ? t.genGenerating : t.genSubmitButton}</span>
              </button>
            </div>
          </form>

        </div>

        {/* Right Column: AI Generated Output Display */}
        <div className="lg:col-span-7">
          {generating ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI video ssenariyni tayyorlamoqda...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hook tanlanmoqda, kadrlar ketma-ketligi, ovoz matni va viral caption shakllantirilmoqda.
              </p>
            </div>
          ) : generatedResult ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
              
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded border border-brand-200">
                      {generatedResult.contentType} • {generatedResult.duration}
                    </span>
                    <span className="text-xs font-semibold text-growth">
                      AI Generated
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {generatedResult.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                    title="Nusxalash"
                  >
                    {copied ? <Check className="w-4 h-4 text-growth" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Kalendarga</span>
                  </button>
                </div>
              </div>

              {/* Hook Box */}
              <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200/80 space-y-1">
                <div className="text-xs font-bold text-brand-800">
                  Kuchli Hook (0–3 soniya):
                </div>
                <div className="text-sm font-semibold text-brand-950 leading-relaxed italic">
                  "{generatedResult.hook}"
                </div>
              </div>

              {/* Scene Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400">
                  Sahnalar va kadrlar
                </div>
                <div className="space-y-2">
                  {generatedResult.scenes?.map((sc: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{sc.scene}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{sc.time}</span>
                      </div>
                      <div className="text-slate-600">
                        <strong>Vizual:</strong> {sc.visual}
                      </div>
                      <div className="text-brand-900 font-medium">
                        <strong>Ovoz matni:</strong> "{sc.voiceover}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Camera & Lighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Kamera rakursi:</span>
                  <span className="text-slate-600">{generatedResult.cameraNotes}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Musiqa tavsiyasi:</span>
                  <span className="text-slate-600">{generatedResult.musicSuggestion}</span>
                </div>
              </div>

              {/* Caption & CTA */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">CAPTION (Instagram matni):</span>
                  <div className="whitespace-pre-line text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                    {generatedResult.caption}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">CTA:</span>
                  <span className="font-semibold text-brand-700">{generatedResult.cta}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Ssenariy hali yaratilmadi
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Chap tomondagi maydonlarni to‘ldiring va "AI Ssenariy Yaratish" tugmasini bosing.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
