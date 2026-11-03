import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    if (!token) return NextResponse.json({ ok: false });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false });

    const { language } = await req.json();
    if (language === "uz" || language === "ru") {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { language },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

