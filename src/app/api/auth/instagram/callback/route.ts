import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { encryptToken, verifyOAuthState } from "@/lib/crypto";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  fetchInstagramProfile,
  fetchInstagramInsights,
} from "@/lib/meta-instagram";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  // Handle Meta authorization cancellation or errors
  if (error || errorReason) {
    console.warn("[Instagram OAuth Callback] Meta returned error:", error, errorDescription);
    const dest = new URL("/dashboard", origin);
    dest.searchParams.set("error", errorDescription || "Instagram ulanishi bekor qilindi");
    return NextResponse.redirect(dest);
  }

  if (!code) {
    const dest = new URL("/dashboard", origin);
    dest.searchParams.set("error", "Avtorizatsiya kodi (code) qabul qilinmadi");
    return NextResponse.redirect(dest);
  }

  // 1. Verify CSRF State and Signature
  const stateCheck = state ? verifyOAuthState(state) : { valid: false };
  const savedState = req.cookies.get("ig_oauth_state")?.value;

  const isStateValid = stateCheck.valid && (!savedState || state === savedState);
  if (!isStateValid) {
    console.error("[Instagram OAuth Callback] State verification failed:", { state, savedState, stateCheck });
    const dest = new URL("/dashboard", origin);
    dest.searchParams.set("error", "Xavfsizlik tekshiruvi (OAuth CSRF state) mos kelmadi yoki muddati o'tdi.");
    return NextResponse.redirect(dest);
  }

  // 2. Identify Authenticated User (Strict Isolation - No shared fallback)
  let userId: string | null = null;
  const token = req.cookies.get("aismm_token")?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload) userId = payload.userId;
  }

  if (!userId) {
    userId = req.cookies.get("ig_oauth_uid")?.value || null;
  }

  if (!userId && stateCheck.userId) {
    userId = stateCheck.userId;
  }

  if (!userId) {
    console.warn("[Instagram OAuth Callback] Authenticated user not found, redirecting to login.");
    const dest = new URL("/auth/login", origin);
    dest.searchParams.set("redirect", "/dashboard");
    return NextResponse.redirect(dest);
  }

  try {
    // 3. Exchange Code for Short-Lived Access Token
    const { accessToken: shortToken } = await exchangeCodeForToken(code, origin);

    // 4. Exchange for Long-Lived (60-day) Access Token
    const { accessToken: longLivedToken, expiresInSeconds } = await exchangeForLongLivedToken(shortToken);

    // 5. Fetch Profile Data from Meta Graph API
    const profile = await fetchInstagramProfile(longLivedToken);

    // 6. Fetch 30-Day Insights from Meta Graph API
    const insights = await fetchInstagramInsights(longLivedToken, profile.id, profile.followersCount);

    // 7. Encrypt Token before saving to DB
    const encryptedToken = encryptToken(longLivedToken);
    const tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // 8. Save/Upsert InstagramAccount for this specific User
    let igAccount: any = null;
    try {
      const existing = await prisma.instagramAccount.findFirst({
        where: { userId },
      });

      if (existing) {
        igAccount = await prisma.instagramAccount.update({
          where: { id: existing.id },
          data: {
            username: profile.username,
            instagramId: profile.id,
            fullName: profile.fullName,
            followersCount: profile.followersCount,
            followsCount: profile.followsCount,
            mediaCount: profile.mediaCount,
            profilePicUrl: profile.profilePicUrl || existing.profilePicUrl,
            accessToken: encryptedToken,
            tokenExpiresAt,
            isConnected: true,
            isDemo: false,
          },
        });

        // Clear outdated analytics
        await prisma.instagramAnalytics.deleteMany({
          where: { instagramAccountId: existing.id },
        }).catch(() => {});
      } else {
        igAccount = await prisma.instagramAccount.create({
          data: {
            userId,
            username: profile.username,
            instagramId: profile.id,
            fullName: profile.fullName,
            followersCount: profile.followersCount,
            followsCount: profile.followsCount,
            mediaCount: profile.mediaCount,
            profilePicUrl: profile.profilePicUrl,
            accessToken: encryptedToken,
            tokenExpiresAt,
            isConnected: true,
            isDemo: false,
          },
        });
      }

      // Save the fresh daily insights into InstagramAnalytics
      if (igAccount && insights.length > 0) {
        for (const item of insights) {
          await prisma.instagramAnalytics.create({
            data: {
              instagramAccountId: igAccount.id,
              date: item.date,
              followers: item.followers,
              views: item.views,
              reach: item.reach,
              likes: item.likes,
              comments: item.comments,
              engagementRate: item.engagementRate,
              reelsPerformance: item.reelsPerformance,
            },
          }).catch(() => {});
        }
      }
    } catch (dbErr: any) {
      console.warn("[Instagram Callback] Database persist fallback:", dbErr.message);
    }

    // Prepare redirect response
    const dest = new URL("/dashboard", origin);
    dest.searchParams.set("connected", "true");
    dest.searchParams.set("username", profile.username);

    const response = NextResponse.redirect(dest);

    // Clean up one-time OAuth state cookies
    response.cookies.delete("ig_oauth_state");
    response.cookies.delete("ig_oauth_uid");

    return response;
  } catch (err: any) {
    console.error("[Instagram OAuth Callback Execution Error]:", err);
    const dest = new URL("/dashboard", origin);
    dest.searchParams.set("error", encodeURIComponent(err.message || "Meta hisobini ulashda xatolik yuz berdi"));
    return NextResponse.redirect(dest);
  }
}

