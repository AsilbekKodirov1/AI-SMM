import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { role: "USER" } });
      userId = demoUser ? demoUser.id : null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }

    const { planCode, paymentMethod = "Payme Demo" } = await req.json();

    const targetPlan = await prisma.plan.findUnique({
      where: { code: planCode },
    });

    if (!targetPlan) {
      return NextResponse.json({ error: "Tarif topilmadi" }, { status: 404 });
    }

    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        planId: targetPlan.id,
        status: "ACTIVE",
        currentPeriodEnd,
      },
      create: {
        userId,
        planId: targetPlan.id,
        status: "ACTIVE",
        currentPeriodEnd,
      },
    });

    // Add notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Obuna muvaffaqiyatli faollashtirildi!",
        message: `Siz ${targetPlan.code} tarifiga muvaffaqiyatli obuna bo‘ldingiz (${paymentMethod} orqali to‘landi). Barcha imkoniyatlar ochildi!`,
        type: "SUCCESS",
      },
    });

    return NextResponse.json({
      success: true,
      plan: targetPlan.code,
      message: `${targetPlan.code} tarifi faollashtirildi!`,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

