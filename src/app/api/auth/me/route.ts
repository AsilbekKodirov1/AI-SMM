import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    let shouldSetCookie = false;

    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    // Auto-create or fetch active user so visitors never get blocked by 401
    if (!userId) {
      let defaultUser = await prisma.user.findFirst({
        where: { role: "USER" },
        orderBy: { updatedAt: "desc" },
      });

      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            name: "Foydalanuvchi",
            email: "user@aismm.uz",
            passwordHash: "demo_pass",
            role: "USER",
            language: "uz",
            profile: { create: { isTelegramVerified: true } },
          },
        });
      }
      userId = defaultUser.id;
      shouldSetCookie = true;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscription: {
          include: { plan: true },
        },
        instagramAccounts: {
          take: 1,
          orderBy: { updatedAt: "desc" },
          include: {
            analytics: {
              orderBy: { date: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const ig = user.instagramAccounts[0] || null;
    const latestAnalytics = ig?.analytics[0] || null;

    let daysLeft = 0;
    if (user.subscription?.trialEndsAt) {
      const diff = new Date(user.subscription.trialEndsAt).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        profile: user.profile
          ? {
              avatarUrl: user.profile.avatarUrl,
              bio: user.profile.bio,
              telegramUsername: user.profile.telegramUsername,
              isTelegramVerified: user.profile.isTelegramVerified,
            }
          : undefined,
        subscription: user.subscription
          ? {
              planCode: user.subscription.plan.code,
              status: user.subscription.status,
              trialEndsAt: user.subscription.trialEndsAt?.toISOString(),
              daysLeft,
            }
          : undefined,
        instagramAccount: ig
          ? {
              id: ig.id,
              username: ig.username,
              fullName: ig.fullName,
              followersCount: latestAnalytics?.followers || ig.followersCount || 0,
              viewsCount: latestAnalytics?.views || 0,
              likesCount: latestAnalytics?.likes || 0,
              growth: latestAnalytics ? parseFloat(latestAnalytics.reelsPerformance.toFixed(1)) : 0,
              isConnected: ig.isConnected,
              isDemo: ig.isDemo,
            }
          : null,
      },
    });

    if (shouldSetCookie) {
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

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
