import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { generateOAuthState } from "@/lib/crypto";
import { getMetaOAuthUrl, getMetaConfig } from "@/lib/meta-instagram";

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const { appId } = getMetaConfig(origin);

    // Verify user is logged in
    const token = req.cookies.get("aismm_token")?.value;
    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    if (!userId) {
      // User not authenticated, redirect to login
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("redirect", "/dashboard");
      return NextResponse.redirect(loginUrl);
    }

    // Check if Meta credentials exist
    if (!appId) {
      const errorUrl = new URL("/dashboard", origin);
      errorUrl.searchParams.set(
        "error",
        "Meta App ID sozlanmagan. Iltimos, Vercel yoki .env faylida META_APP_ID va META_APP_SECRET o'zgaruvchilarini belgilang."
      );
      return NextResponse.redirect(errorUrl);
    }

    // Generate secure CSRF state
    const state = generateOAuthState();

    // Check mode: Instagram Login (default) or Facebook Dialog
    const isFacebookMode = req.nextUrl.searchParams.get("mode") === "facebook";
    const authUrl = getMetaOAuthUrl(state, origin, isFacebookMode);

    const response = NextResponse.redirect(authUrl);

    // Set secure HTTP-only cookies for state and userId
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("ig_oauth_state", state, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    response.cookies.set("ig_oauth_uid", userId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Instagram Auth Init Error]:", error);
    const origin = req.nextUrl.origin;
    const errorUrl = new URL("/dashboard", origin);
    errorUrl.searchParams.set("error", encodeURIComponent(error.message || "OAuth boshlashda xatolik"));
    return NextResponse.redirect(errorUrl);
  }
}
