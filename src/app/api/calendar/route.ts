import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
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

    const items = await prisma.contentCalendarItem.findMany({
      where: userId ? { userId } : {},
      orderBy: { scheduledDate: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const { title, contentType = "Reel", scheduledDate, scheduledTime = "19:00", notes } = await req.json();

    const created = await prisma.contentCalendarItem.create({
      data: {
        userId,
        title,
        contentType,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        scheduledTime,
        status: "PLANNED",
        isAiGenerated: false,
        notes,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, scheduledTime, notes, title } = await req.json();
    if (!id) return NextResponse.json({ error: "ID kiritilmadi" }, { status: 400 });

    const updated = await prisma.contentCalendarItem.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(scheduledTime && { scheduledTime }),
        ...(notes !== undefined && { notes }),
        ...(title && { title }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID kiritilmadi" }, { status: 400 });

    await prisma.contentCalendarItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

