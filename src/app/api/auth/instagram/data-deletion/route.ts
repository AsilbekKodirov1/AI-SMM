import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * Meta User Data Deletion Callback
 * Reference: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
 */
export async function POST(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    let signedRequest = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      signedRequest = (formData.get("signed_request") as string) || "";
    } else if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      signedRequest = body.signed_request || "";
    }

    let metaUserId = "";
    if (signedRequest) {
      try {
        const parts = signedRequest.split(".");
        if (parts.length === 2) {
          const payload = Buffer.from(parts[1], "base64").toString("utf8");
          const data = JSON.parse(payload);
          metaUserId = data.user_id ? String(data.user_id) : "";
        }
      } catch (e) {
        console.warn("[Meta Data Deletion] Parse signed_request warning:", e);
      }
    }

    // If meta user ID found, disconnect and clear data from database
    if (metaUserId) {
      try {
        const matchingAccounts = await prisma.instagramAccount.findMany({
          where: { instagramId: metaUserId },
        });

        for (const acc of matchingAccounts) {
          await prisma.instagramAnalytics.deleteMany({
            where: { instagramAccountId: acc.id },
          }).catch(() => {});
          await prisma.aIAnalysis.deleteMany({
            where: { instagramAccountId: acc.id },
          }).catch(() => {});
          await prisma.instagramAccount.update({
            where: { id: acc.id },
            data: {
              isConnected: false,
              accessToken: null,
            },
          }).catch(() => {});
        }
      } catch (dbErr: any) {
        console.warn("[Meta Data Deletion] DB cleanup notice:", dbErr.message);
      }
    }

    const confirmationCode = `del_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const statusUrl = `${origin}/data-deletion?code=${confirmationCode}`;

    // Meta expects { url: string, confirmation_code: string }
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (error: any) {
    console.error("[Meta Data Deletion Callback Error]:", error);
    const confirmationCode = `del_${Date.now()}_fallback`;
    return NextResponse.json({
      url: `${req.nextUrl.origin}/data-deletion?code=${confirmationCode}`,
      confirmation_code: confirmationCode,
    });
  }
}

export async function GET(req: NextRequest) {
  // If visited via browser, redirect to the Data Deletion instructions page
  const dest = new URL("/data-deletion", req.nextUrl.origin);
  return NextResponse.redirect(dest);
}
