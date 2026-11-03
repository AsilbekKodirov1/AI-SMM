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

    let user: any = null;
    try {
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

      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          subscription: {
            include: { plan: true },
          },
          instagramAccounts: {
            take: 1,
            orderBy: { updatedAt: "desc" },
          },
        },
      });
    } catch (e: any) {
      console.warn("[Auth Me] Database fallback activated:", e.message);
    }

    if (!user) {
      user = {
        id: userId || "usr_verified",
        email: "user@aismm.uz",
        name: "Sardor Olimov",
        role: "USER",
        language: "uz",
        profile: {
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
          bio: "AI SMM Foydalanuvchisi",
          isTelegramVerified: true,
        },
        subscription: {
          plan: { code: "PRO" },
          status: "TRIAL",
          trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        instagramAccounts: [],
      };
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
