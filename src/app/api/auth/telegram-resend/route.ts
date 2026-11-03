import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Find any user or demo user
      let user = await prisma.user.findFirst({ where: { role: "USER" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Telegram Foydalanuvchi",
            email: `tg_user_${Date.now()}@aismm.uz`,
            passwordHash: "telegram_pass",
            role: "USER",
            language: "uz",
            profile: { create: { isTelegramVerified: false } },
          },
        });
      }

      await prisma.activationCode.create({
        data: {
          userId: user.id,
          code: newCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } catch (e: any) {
      console.warn("[Resend] DB fallback:", e.message);
    }

    return NextResponse.json({
      success: true,
      code: newCode,
      message: "Yangi kod yaratildi!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

