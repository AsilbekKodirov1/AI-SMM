"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Layers,
  Sparkles,
  Edit2,
  X,
} from "lucide-react";

interface CalendarItem {
  id: string;
  title: string;
  contentType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "PLANNED" | "READY" | "PUBLISHED";
  isAiGenerated: boolean;
  notes?: string;
}

export default function CalendarPage() {
  const { t, language } = useLanguage();

  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Reel");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTime, setNewTime] = useState("19:00");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          contentType: newType,
          scheduledDate: newDate,
          scheduledTime: newTime,
        }),
      });
      if (res.ok) {
        setAddModalOpen(false);
        setNewTitle("");
        fetchItems();
      }
    } catch {}
  };

  const handleToggleStatus = async (item: CalendarItem) => {
    const nextStatus =
      item.status === "PLANNED" ? "READY" : item.status === "READY" ? "PUBLISHED" : "PLANNED";

    try {
      await fetch("/api/calendar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
      );
    } catch {}
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Ushbu rejalashtirilgan kontentni o‘chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/calendar?id=${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {}
  };

  // Weekday layout (Dushanba - Yakshanba)
  const daysOfWeek = [
    { name: "Dushanba", defaultType: "Reel" },
    { name: "Seshanba", defaultType: "Carousel" },
    { name: "Chorshanba", defaultType: "Reel" },
    { name: "Payshanba", defaultType: "Story" },
    { name: "Juma", defaultType: "Reel" },
    { name: "Shanba", defaultType: "Carousel" },
    { name: "Yakshanba", defaultType: "Rest / Analysis" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-brand-600" />
            <span>Kontent Kalendari</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Haftalik postlar, Reels videolari va storislarni qulay rejalashtirish
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi kontent qo‘shish</span>
        </button>
      </div>

      {/* Recommended Strategy Guideline Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
        <div className="text-xs font-bold text-slate-400 mb-3">
          Tavsiya etilgan haftalik ritm (AI Distribution Matrix)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900">{day.name}</div>
              <div className="text-[11px] font-semibold text-brand-600">{day.defaultType}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Items List / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Rejalashtirilgan kontent ro‘yxati ({items.length} ta)
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Yuklanmoqda...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Hozircha hech qanday kontent rejalashtirilmagan. "Yangi kontent qo‘shish" tugmasini bosing.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((it) => (
              <div
                key={it.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        it.contentType === "Reel"
                          ? "bg-brand-50 text-brand-700 border-brand-200"
                          : it.contentType === "Carousel"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {it.contentType}
                    </span>
                    {it.isAiGenerated && (
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">
                        AI Generated
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{it.scheduledTime}</span>
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{it.title}</div>
                  <div className="text-[11px] text-slate-500">
                    Sana: {new Date(it.scheduledDate).toLocaleDateString("ru-RU", { month: "long", day: "numeric" })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(it)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      it.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : it.status === "READY"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {it.status === "PUBLISHED" ? "Yuklangan" : it.status === "READY" ? "Tayyor" : "Rejada"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(it.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Content Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Yangi kontent qo‘shish</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mavzu yoki sarlavha</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: 5 ta AI tool, siz hali ishlatmayapsiz"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kontent turi</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Reel">Reels</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Story">Story</option>
                    <option value="Post">Post</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vaqti</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rejalashtirilgan sana</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                >
                  Rejaga kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
