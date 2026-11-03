import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const record = await prisma.activationCode.findUnique({
      where: { code: code.toString().trim() },
      include: { user: { include: { profile: true } } },
    });

    if (!record) {
      return NextResponse.json({ verified: false, error: "Kod topilmadi" });
    }

    const isVerified = record.isUsed || record.user?.profile?.isTelegramVerified || false;

    return NextResponse.json({
      verified: isVerified,
      code: record.code,
      expiresAt: record.expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
  }
}

