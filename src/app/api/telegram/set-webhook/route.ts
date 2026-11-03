import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN muhit o'zgaruvchisi topilmadi" }, { status: 500 });
  }

  // Detect base URL
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const webhookUrl = `${proto}://${host}/api/telegram/webhook`;

  const API_BASE = `https://api.telegram.org/bot${token}`;

  try {
    const res = await fetch(`${API_BASE}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      message: data.ok
        ? "✅ Webhook muvaffaqiyatli o'rnatildi! Endi Telegram botingiz har bir /start xabariga darhol javob beradi."
        : "❌ Webhook o'rnatishda xatolik yuz berdi.",
      webhookUrl,
      telegramResponse: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

