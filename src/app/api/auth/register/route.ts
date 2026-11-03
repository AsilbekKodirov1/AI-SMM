import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Barcha maydonlarni to‘ldiring" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Ushbu email bilan foydalanuvchi allaqachon mavjud" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const trialPlan = await prisma.plan.findFirst({
      where: { code: "FREE_TRIAL" },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: "USER",
        language: "uz",
        profile: {
          create: {
            bio: "Instagram Creator",
            isTelegramVerified: false,
          },
        },
        subscription: trialPlan
          ? {
              create: {
                planId: trialPlan.id,
                status: "TRIAL",
                trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
              },
            }
          : undefined,
      },
    });

    // Create unique 8-digit activation code
    const uniqueCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    await prisma.activationCode.create({
      data: {
        userId: user.id,
        code: uniqueCode,
        expiresAt: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
      },
      activationCode: uniqueCode,
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
