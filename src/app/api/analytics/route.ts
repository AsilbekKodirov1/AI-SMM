import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30D";

    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    if (!userId) {
      return NextResponse.json({
        account: null,
        hasData: false,
        summary: { followers: 0, followersGrowth: "0", growthPercent: "0%", totalViews: 0, totalLikes: 0, avgEngagement: "0%" },
        chartData: [],
      });
    }

    const igAccount = await prisma.instagramAccount.findFirst({
      where: { userId },
      include: {
        analytics: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!igAccount || !igAccount.isConnected) {
      return NextResponse.json({
        account: null,
        hasData: false,
        summary: { followers: 0, followersGrowth: "0", growthPercent: "0%", totalViews: 0, totalLikes: 0, avgEngagement: "0%" },
        chartData: [],
      });
    }

    const rawList = igAccount.analytics;

    if (!rawList || rawList.length === 0) {
      return NextResponse.json({
        account: {
          username: igAccount.username,
          fullName: igAccount.fullName,
          followersCount: igAccount.followersCount || 0,
        },
        hasData: false,
        summary: {
          followers: igAccount.followersCount || 0,
          followersGrowth: "0",
          growthPercent: "0%",
          totalViews: 0,
          totalLikes: 0,
          avgEngagement: "0%",
        },
        chartData: [],
      });
    }

    const limit = range === "7D" ? 7 : range === "90D" ? 90 : 30;
    const formattedList = rawList.slice(-limit).map((a) => ({
      date: new Date(a.date).toLocaleDateString("ru-RU", { month: "short", day: "numeric" }),
      followers: a.followers,
      views: a.views,
      reach: a.reach,
      likes: a.likes,
      comments: a.comments,
      engagementRate: a.engagementRate,
      reelsPerformance: a.reelsPerformance,
    }));

    const latest = formattedList[formattedList.length - 1];
    const previous = formattedList[0];
    const followersGrowth = latest && previous ? latest.followers - previous.followers : 0;
    const growthPercent = previous && previous.followers > 0
      ? ((followersGrowth / previous.followers) * 100).toFixed(1)
      : "0";
    const totalViews = formattedList.reduce((acc, curr) => acc + curr.views, 0);
    const totalLikes = formattedList.reduce((acc, curr) => acc + curr.likes, 0);
    const avgEngagement = (
      formattedList.reduce((acc, curr) => acc + curr.engagementRate, 0) / (formattedList.length || 1)
    ).toFixed(2);

    return NextResponse.json({
      account: {
        username: igAccount.username,
        fullName: igAccount.fullName,
        followersCount: latest ? latest.followers : igAccount.followersCount,
      },
      hasData: true,
      range,
      summary: {
        followers: latest ? latest.followers : igAccount.followersCount,
        followersGrowth: `+${followersGrowth}`,
        growthPercent: `+${growthPercent}%`,
        totalViews,
        totalLikes,
        avgEngagement: `${avgEngagement}%`,
      },
      chartData: formattedList,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
