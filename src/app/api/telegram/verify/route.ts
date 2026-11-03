import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Kod kiritilmadi" }, { status: 400 });
    }

    const cleanCode = code.toString().trim();
    const record = await prisma.activationCode.findUnique({
      where: { code: cleanCode },
      include: { user: { include: { profile: true } } },
    });

    if (!record) {
      return NextResponse.json({ error: "Noto‘g‘ri kod yoki kod topilmadi" }, { status: 404 });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ error: "Kod muddati eskirgan" }, { status: 400 });
    }

    // Mark as used
    await prisma.activationCode.update({
      where: { id: record.id },
      data: { isUsed: true, verifiedAt: new Date() },
    });

    // Update user profile using upsert to prevent not found error
    await prisma.profile.upsert({
      where: { userId: record.userId },
      create: {
        userId: record.userId,
        isTelegramVerified: true,
      },
      update: {
        isTelegramVerified: true,
      },
    });

    // Ensure user has valid auth token cookie
    const token = signToken({
      userId: record.user.id,
      email: record.user.email,
      role: record.user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Telegram orqali muvaffaqiyatli faollashtirildi!",
      user: {
        id: record.user.id,
        email: record.user.email,
        name: record.user.name,
      },
    });

    response.cookies.set("aismm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
