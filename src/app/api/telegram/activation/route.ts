import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    let isNewUser = false;

    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    // If guest / first time visitor
    if (!userId) {
      // Find or create default user for session
      let user = await prisma.user.findFirst({ where: { role: "USER" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Foydalanuvchi",
            email: `user_${Date.now()}@aismm.uz`,
            passwordHash: "temp",
            role: "USER",
            language: "uz",
            profile: { create: { isTelegramVerified: false } },
          },
        });
        isNewUser = true;
      }
      userId = user.id;
    }

    let codeRecord = await prisma.activationCode.findFirst({
      where: { userId, isUsed: false },
      orderBy: { createdAt: "desc" },
    });

    // If expired or doesn't exist, create a fresh 8-digit code
    if (!codeRecord || new Date() > new Date(codeRecord.expiresAt)) {
      const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      codeRecord = await prisma.activationCode.create({
        data: {
          userId,
          code: newCode,
          expiresAt: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes
        },
      });
    }

    const secondsRemaining = Math.max(
      0,
      Math.floor((new Date(codeRecord.expiresAt).getTime() - Date.now()) / 1000)
    );

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "AISMMetaBot";

    const response = NextResponse.json({
      code: codeRecord.code,
      expiresAt: codeRecord.expiresAt.toISOString(),
      secondsRemaining,
      botUsername,
      botOnline: true,
      isUsed: codeRecord.isUsed,
    });

    // If we provisioned a session, set token so they stay logged in
    if (!token && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newToken = signToken({
          userId: user.id,
          email: user.email,
          role: user.role,
        });
        response.cookies.set("aismm_token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    if (!userId) {
      const u = await prisma.user.findFirst({ where: { role: "USER" } });
      userId = u?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const codeRecord = await prisma.activationCode.create({
      data: {
        userId,
        code: newCode,
        expiresAt: new Date(Date.now() + 25 * 60 * 1000),
      },
    });

    return NextResponse.json({
      code: codeRecord.code,
      secondsRemaining: 1500,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
