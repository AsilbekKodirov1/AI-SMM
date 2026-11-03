import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN sozlanmagan" }, { status: 500 });
  }

  const API_BASE = `https://api.telegram.org/bot${token}`;

  try {
    const update = await req.json();
    if (!update || !update.message) {
      return NextResponse.json({ ok: true, note: "No message" });
    }

    const msg = update.message;
    const chatId = msg.chat?.id;
    const text = (msg.text || "").trim();
    const senderName = msg.from?.first_name || msg.from?.username || "Foydalanuvchi";
    const tgUsername = msg.from?.username ? `@${msg.from.username}` : undefined;

    if (!chatId) {
      return NextResponse.json({ ok: true, note: "No chat id" });
    }

    // Check if user sent a specific 6 or 8-digit code
    const codeMatch = text.match(/\b\d{6,8}\b/);
    if (codeMatch && !text.startsWith("/start")) {
      const inputCode = codeMatch[0];
      try {
        const record = await prisma.activationCode.findUnique({
          where: { code: inputCode },
          include: { user: { include: { profile: true } } },
        });

        if (record) {
          await prisma.activationCode.update({
            where: { id: record.id },
            data: { isUsed: true, verifiedAt: new Date() },
          });

          await prisma.profile.upsert({
            where: { userId: record.userId },
            create: {
              userId: record.userId,
              isTelegramVerified: true,
              telegramChatId: chatId.toString(),
              telegramUsername: tgUsername,
            },
            update: {
              isTelegramVerified: true,
              telegramChatId: chatId.toString(),
              telegramUsername: tgUsername,
            },
          });

          await fetch(`${API_BASE}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `✅ <b>Tabriklaymiz, ${senderName}!</b>\n\nKodingiz muvaffaqiyatli tasdiqlandi. Veb-saytga qaytib, profilingizdan foydalanishingiz mumkin!`,
              parse_mode: "HTML",
            }),
          });

          return NextResponse.json({ ok: true, verified: true });
        }
      } catch (e) {
        console.error("Code match error:", e);
      }
    }

    // Default action for /start or any message: Generate 6-digit OTP code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      let user = await prisma.user.findFirst({
        where: {
          profile: { telegramChatId: chatId.toString() },
        },
        include: { profile: true },
      });

      if (!user) {
        const trialPlan = await prisma.plan.findFirst({ where: { code: "FREE_TRIAL" } }).catch(() => null);
        user = await prisma.user.create({
          data: {
            name: senderName,
            email: `tg_${chatId}@aismm.uz`,
            passwordHash: "telegram_auth_user",
            role: "USER",
            language: "uz",
            profile: {
              create: {
                bio: "Telegram orqali ulangan",
                telegramChatId: chatId.toString(),
                telegramUsername: tgUsername,
                isTelegramVerified: true,
              },
            },
            subscription: trialPlan
              ? {
                  create: {
                    planId: trialPlan.id,
                    status: "TRIAL",
                    trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                  },
                }
              : undefined,
          },
        }).catch(() => null);
      }

      if (user) {
        await prisma.activationCode.updateMany({
          where: { userId: user.id, isUsed: false },
          data: { isUsed: true },
        }).catch(() => {});

        await prisma.activationCode.create({
          data: {
            userId: user.id,
            code: newCode,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn("DB operation fallback in webhook:", dbErr);
    }

    // Send response back to Telegram
    const responseText =
      `👋 <b>Assalomu alaykum, ${senderName}!</b>\n\n` +
      `🔐 <b>AI SMM Assistant</b> platformasiga kirish uchun tasdiqlash kodingiz:\n\n` +
      `👉 <code>${newCode}</code> 👈\n\n` +
      `<i>Ushbu 6 xonali kodni saytdagi maydonga kiriting. Kod 15 daqiqa davomida amal qiladi.</i>\n\n` +
      `⚡️ <b>3 kunlik bepul sinov</b> davri profilingiz uchun faol!`;

    await fetch(`${API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ ok: true, code: newCode });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

export async function GET() {
  return new Response("AI SMM Telegram Bot Webhook endpoint faol va xabarlar qabul qilishga tayyor!");
}

