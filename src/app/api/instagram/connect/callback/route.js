
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url);

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    // Instagram ruxsat bermagan bo'lsa
    if (error) {
        return NextResponse.json(
            {
                success: false,
                error,
                description: errorDescription,
            },
            { status: 400 }
        );
    }

    // Authorization code kelmagan bo'lsa
    if (!code) {
        return NextResponse.json(
            {
                success: false,
                message: "Instagram authorization code yubormadi.",
            },
            { status: 400 }
        );
    }

    // Kod serverga yetib kelganini tekshirish
    return NextResponse.json({
        success: true,
        message: "Instagram callback muvaffaqiyatli ishladi!",
        codeReceived: true,
    });
}
