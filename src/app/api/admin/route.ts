import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    if (!token) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      // For demo testing, allow admin lookup if specifically needed or if user is admin
      // Check user
      const user = payload ? await prisma.user.findUnique({ where: { id: payload.userId } }) : null;
      if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Admin ruxsati kerak" }, { status: 403 });
      }
    }

    const totalUsers = await prisma.user.count();
    const activeSubs = await prisma.subscription.count({ where: { status: "ACTIVE" } });
    const trialUsers = await prisma.subscription.count({ where: { status: "TRIAL" } });
    const totalScenarios = await prisma.generatedScenario.count();
    const totalAiLogs = await prisma.aIUsageLog.count();

    const users = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        subscription: { include: { plan: true } },
        instagramAccounts: { take: 1 },
      },
    });

    const plans = await prisma.plan.findMany({
      orderBy: { priceMonth: "asc" },
    });

    const recentLogs = await prisma.aIUsageLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    const codes = await prisma.activationCode.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeSubs,
        trialUsers,
        totalScenarios,
        totalAiLogs,
        estimatedMRR: activeSubs * 29,
        botStatus: "Online (Healthy)",
      },
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.subscription?.plan?.code || "NONE",
        status: u.subscription?.status || "INACTIVE",
        createdAt: u.createdAt.toISOString(),
        igHandle: u.instagramAccounts[0]?.username || "-",
        isTgVerified: u.profile?.isTelegramVerified || false,
      })),
      plans,
      logs: recentLogs,
      activationCodes: codes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 403 });
    }

    const { action, planId, priceMonth, priceYear, userId, newRole, newPlanCode } = await req.json();

    if (action === "update_price") {
      await prisma.plan.update({
        where: { id: planId },
        data: {
          priceMonth: parseFloat(priceMonth),
          priceYear: parseFloat(priceYear),
        },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "update_user_role") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "change_user_plan") {
      const targetPlan = await prisma.plan.findUnique({ where: { code: newPlanCode } });
      if (targetPlan) {
        await prisma.subscription.upsert({
          where: { userId },
          update: { planId: targetPlan.id, status: "ACTIVE" },
          create: { userId, planId: targetPlan.id, status: "ACTIVE" },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Noma'lum harakat" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

