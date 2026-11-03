"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Copy,
  Check,
  Save,
  RotateCw,
  Calendar,
  Eye,
  Heart,
  Video,
  Camera,
  Sun,
  Music,
  Mic,
  FileText,
  Tag,
  ArrowRight,
  Edit3,
} from "lucide-react";

export default function ScenariosPage() {
  const { t, language } = useLanguage();

  const [scenarioId, setScenarioId] = useState<string>("");
  const [title, setTitle] = useState("5 ta AI tool, siz hali ishlatmayapsiz");
  const [topic, setTopic] = useState("Kundalik ishni 10x tezlashtiruvchi sun'iy intellekt vositalari");
  const [hook, setHook] = useState(
    "Agar siz hali ham hamma narsani qo‘lda qilayotgan bo‘lsangiz, to‘xtang! Bu 32 soniyalik video hayotingizni o‘zgartiradi."
  );
  const [scriptBody, setScriptBody] = useState(
    "1. Gamma App — 1 daqiqada prezentatsiya.\n2. ElevenLabs — inson ovozini klonlaydi.\n3. Claude 3.5 — hisobot va matnlarni xatosiz yozadi.\n4. Perplexity — faktik qidiruv vositasi.\n5. CapCut AI — videoni avtomatik montaj qiladi."
  );

  const [scene1, setScene1] = useState({
    time: "3–8s",
    visual: "Noutbukda Gamma prezentatsiya generatsiyasini tezkor b-roll tarzida ko‘rsatish",
    voiceover: "Birinchisi: Gamma App. 1 daqiqada professional prezentatsiya yaratib beradi.",
  });
  const [scene2, setScene2] = useState({
    time: "8–15s",
    visual: "Audio to‘lqinlar va mikrofon kadrlari",
    voiceover: "Ikkinchisi: ElevenLabs. Shunchaki matn yozasiz, u esa professional studiya ovoziga aylantiradi.",
  });
  const [scene3, setScene3] = useState({
    time: "15–25s",
    visual: "Claude va Perplexity ekran lavhalari, matn yozilish jarayoni",
    voiceover: "Uchinchisi — Perplexity. Google qidiruvini unuting, bu tool faktlarni tahlil qilib beradi.",
  });
  const [ending, setEnding] = useState({
    time: "25–32s",
    visual: "Kameraga to‘g‘ridan-to‘g‘ri qarab ishora qilish, pastda caption matni chiqadi",
    voiceover: "Barcha tool'larning to‘liq havolasi profilim tavsifida. Saqlab qo‘yishni unutmang!",
  });

  const [camera, setCamera] = useState("Sony A7IV yoki iPhone 15 Pro, 24fps 4K, 35mm linza, frontal yorug‘lik");
  const [lighting, setLighting] = useState("Asosiy key-light 45 gradusda, orqa fonda neon ko‘k rim-light");
  const [music, setMusic] = useState("Trending Lo-Fi / Upbeat Tech Synth (Instagram Audio: TechPulse 2026)");
  const [voiceover, setVoiceover] = useState("Energetik, professional, qat'iy va ishonchli ohang");
  const [caption, setCaption] = useState(
    "Sun'iy intellekt sizning o‘rningizni egallamaydi, lekin undan foydalanadigan inson o‘rningizni egallaydi.\n\nQaysi birini allaqachon sinab ko‘rgansiz? Izohlarda yozing!\n\n#ai #texnologiya #smm #uzbekistan #reels #aismm"
  );
  const [keywords, setKeywords] = useState("ai tools, sun'iy intellekt, smm, produktivlik, reels g'oyalari");
  const [cta, setCta] = useState("Keyingi qismni o‘tkazib yubormaslik uchun obuna bo‘ling!");

  const [expectedViews, setExpectedViews] = useState("8K–15K");
  const [expectedLikes, setExpectedLikes] = useState("500–1.2K");
  const [expectedEngagement, setExpectedEngagement] = useState("4.8%–6.5%");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Fetch initial scenario
  useEffect(() => {
    fetch("/api/scenarios")
      .then((res) => res.json())
      .then((data) => {
        if (data.scenarios && data.scenarios.length > 0) {
          const s = data.scenarios[0];
          setScenarioId(s.id);
          setTitle(s.title);
          setTopic(s.topic);
          setHook(s.hook);
          setScriptBody(s.scriptBody);
          if (s.cameraNotes) setCamera(s.cameraNotes);
          if (s.lightingNotes) setLighting(s.lightingNotes);
          if (s.musicSuggestion) setMusic(s.musicSuggestion);
          if (s.voiceover) setVoiceover(s.voiceover);
          if (s.caption) setCaption(s.caption);
          if (s.keywords) setKeywords(s.keywords);
          if (s.cta) setCta(s.cta);
          if (s.expectedViews) setExpectedViews(s.expectedViews);
          if (s.expectedLikes) setExpectedLikes(s.expectedLikes);
          if (s.expectedEngagement) setExpectedEngagement(s.expectedEngagement);
          if (s.scenesJson) {
            try {
              const scs = JSON.parse(s.scenesJson);
              if (scs[1]) setScene1({ time: scs[1].time, visual: scs[1].visual, voiceover: scs[1].voiceover });
              if (scs[2]) setScene2({ time: scs[2].time, visual: scs[2].visual, voiceover: scs[2].voiceover });
              if (scs[3]) setScene3({ time: scs[3].time, visual: scs[3].visual, voiceover: scs[3].voiceover });
              if (scs[4]) setEnding({ time: scs[4].time, visual: scs[4].visual, voiceover: scs[4].voiceover });
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!scenarioId) return;
    try {
      const res = await fetch("/api/scenarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: scenarioId,
          title,
          topic,
          hook,
          scriptBody,
          cameraNotes: camera,
          lightingNotes: lighting,
          musicSuggestion: music,
          voiceover,
          caption,
          keywords,
          cta,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch {}
  };

  const handleCopyFull = () => {
    const fullText = `HOOK: ${hook}\n\nSCENE 1 (${scene1.time}): ${scene1.voiceover}\n\nSCENE 2 (${scene2.time}): ${scene2.voiceover}\n\nSCENE 3 (${scene3.time}): ${scene3.voiceover}\n\nENDING (${ending.time}): ${ending.voiceover}\n\nCAPTION:\n${caption}\n\nCTA: ${cta}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          niche: "Education / Technology",
          contentType: "Reel",
          duration: "32s",
          language: "uz",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const s = data.scenario;
        setScenarioId(s.id);
        setTitle(s.title);
        setHook(s.hook);
        setScriptBody(s.scriptBody);
        if (s.caption) setCaption(s.caption);
        if (s.cta) setCta(s.cta);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch {
    } finally {
      setRegenerating(false);
    }
  };

  const handleAddToCalendar = async () => {
    try {
      await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          contentType: "Reel",
          scheduledDate: new Date(),
          scheduledTime: "19:30",
          notes: caption,
        }),
      });
      alert("Muvaffaqiyatli bugungi kalendarga qo‘shildi!");
    } catch {}
  };

  return (
    <div className="space-y-8">
      
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              Bugungi kontent
            </span>
            <span className="text-xs font-bold text-growth bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AI Generated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Reels Video Ssenariysi
          </h1>
        </div>

        {/* Global Scenario Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyFull}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-subtle inline-flex items-center gap-1.5"
          >
            {copiedSuccess ? <Check className="w-4 h-4 text-growth" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSuccess ? "Nusxalandi!" : "Nusxalash"}</span>
          </button>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-subtle inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
            <span>Qayta yaratish</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? "Saqlandi!" : "Saqlash"}</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kalendarga</span>
          </button>
        </div>
      </div>

      {/* AI Predictions Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="font-bold text-slate-200">
            AI Natijalar Taxmini (Prediction):
          </span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <div>
            <span className="text-slate-400 block text-[10px]">Kutilayotgan Views:</span>
            <span className="text-sm font-bold text-white tabular-nums">{expectedViews}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Kutilayotgan Likes:</span>
            <span className="text-sm font-bold text-white tabular-nums">{expectedLikes}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Kutilayotgan Engagement:</span>
            <span className="text-sm font-bold text-growth tabular-nums">{expectedEngagement}</span>
          </div>
        </div>
      </div>

      {/* Editable Sections Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Script Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HOOK Section (0-3s) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded flex items-center gap-1">
                <span>HOOK (0–3 soniya)</span>
                <span className="text-[10px] text-slate-400 font-normal">• eng muhim qism</span>
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Tahrirlash mumkin</span>
              </span>
            </div>
            <textarea
              rows={2}
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              className="w-full text-sm font-semibold text-slate-900 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* SCRIPT BODY & SCENES BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-sm text-slate-500">
              Sahnalar bo‘yicha to‘liq taqsimot
            </h3>

            {/* Scene 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>1-SAHNA (3–8 soniya)</span>
                <span className="text-slate-400 font-mono text-[11px]">{scene1.time}</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Kadr va vizual:</label>
                <input
                  type="text"
                  value={scene1.visual}
                  onChange={(e) => setScene1({ ...scene1, visual: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Ovoz matni (Voice-over):</label>
                <input
                  type="text"
                  value={scene1.voiceover}
                  onChange={(e) => setScene1({ ...scene1, voiceover: e.target.value })}
                  className="w-full text-xs font-semibold text-brand-900 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
            </div>

            {/* Scene 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>2-SAHNA (8–15 soniya)</span>
                <span className="text-slate-400 font-mono text-[11px]">{scene2.time}</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Kadr va vizual:</label>
                <input
                  type="text"
                  value={scene2.visual}
                  onChange={(e) => setScene2({ ...scene2, visual: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Ovoz matni (Voice-over):</label>
                <input
                  type="text"
                  value={scene2.voiceover}
                  onChange={(e) => setScene2({ ...scene2, voiceover: e.target.value })}
                  className="w-full text-xs font-semibold text-brand-900 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
            </div>

            {/* Scene 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>3-SAHNA (15–25 soniya)</span>
                <span className="text-slate-400 font-mono text-[11px]">{scene3.time}</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Kadr va vizual:</label>
                <input
                  type="text"
                  value={scene3.visual}
                  onChange={(e) => setScene3({ ...scene3, visual: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Ovoz matni (Voice-over):</label>
                <input
                  type="text"
                  value={scene3.voiceover}
                  onChange={(e) => setScene3({ ...scene3, voiceover: e.target.value })}
                  className="w-full text-xs font-semibold text-brand-900 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
            </div>

            {/* Ending */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>YAKUN (25–32 soniya)</span>
                <span className="text-slate-400 font-mono text-[11px]">{ending.time}</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Kadr va vizual:</label>
                <input
                  type="text"
                  value={ending.visual}
                  onChange={(e) => setEnding({ ...ending, visual: e.target.value })}
                  className="w-full text-xs font-medium text-slate-800 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block">Ovoz matni (Voice-over):</label>
                <input
                  type="text"
                  value={ending.voiceover}
                  onChange={(e) => setEnding({ ...ending, voiceover: e.target.value })}
                  className="w-full text-xs font-semibold text-brand-900 p-2 bg-white border border-slate-200 rounded-lg mt-0.5"
                />
              </div>
            </div>

          </div>

          {/* CAPTION & CTA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm text-slate-500">
              Instagram Tavsifi va Harakatga Chaqiruv
            </h3>
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                CAPTION (Post matni)
              </label>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full text-xs text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                CTA (Call to Action)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full text-xs font-bold text-brand-700 p-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right Production Details Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Production Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">
              Texnik va Ovoz Sozlamalari
            </h3>

            {/* Camera */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>KAMERA RAKURSI</span>
              </label>
              <textarea
                rows={2}
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Lighting */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-slate-500" />
                <span>YORUG‘LIK (LIGHTING)</span>
              </label>
              <textarea
                rows={2}
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Music */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-slate-500" />
                <span>MUSIQA TAVSIYASI</span>
              </label>
              <input
                type="text"
                value={music}
                onChange={(e) => setMusic(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Voiceover */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-slate-500" />
                <span>OVOZ USLUBI (VOICE-OVER)</span>
              </label>
              <input
                type="text"
                value={voiceover}
                onChange={(e) => setVoiceover(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>KALIT SO‘ZLAR</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

          </div>

          {/* Save Button Widget */}
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-center space-y-3">
            <div className="text-xs font-bold text-brand-900">
              O‘zgarishlarni saqlamoqchimisiz?
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? "Muvaffaqiyatli saqlandi!" : "Saqlash"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
