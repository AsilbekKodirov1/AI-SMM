import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { generateContentWithAI } from "@/lib/gemini";

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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const single = await prisma.generatedScenario.findUnique({ where: { id } });
      return NextResponse.json({ scenario: single });
    }

    const list = await prisma.generatedScenario.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scenarios: list });
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

    const body = await req.json();
    const {
      niche = "Education / Technology",
      topic = "5 ta AI tool",
      audience = "SMM mutaxassislari va blogerlar",
      contentType = "Reel",
      duration = "30s",
      language = "uz",
      goal = "Reach",
    } = body;

    const startTime = Date.now();
    const result = await generateContentWithAI({
      niche,
      topic,
      audience,
      contentType,
      duration,
      language,
      goal,
    });
    const executionMs = Date.now() - startTime;

    // Save to DB
    const saved = await prisma.generatedScenario.create({
      data: {
        userId,
        title: result.title,
        topic: result.topic,
        contentType: result.contentType,
        duration: result.duration,
        language: result.language,
        goal: result.goal,
        hook: result.hook,
        scriptBody: result.scriptBody,
        scenesJson: JSON.stringify(result.scenes),
        cameraNotes: result.cameraNotes,
        lightingNotes: result.lightingNotes,
        musicSuggestion: result.musicSuggestion,
        voiceover: result.voiceover,
        caption: result.caption,
        keywords: result.keywords,
        hashtags: result.hashtags,
        cta: result.cta,
        expectedViews: result.expectedViews,
        expectedLikes: result.expectedLikes,
        expectedEngagement: result.expectedEngagement,
        status: "AI Generated",
      },
    });

    // Log AI Usage
    await prisma.aIUsageLog.create({
      data: {
        userId,
        actionType: "scenario_generate",
        promptTokens: 450,
        completionTokens: 620,
        executionMs,
        modelName: process.env.GEMINI_API_KEY ? "gemini-1.5-flash" : "aismm-engine-v2",
      },
    });

    return NextResponse.json({
      success: true,
      scenario: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Ssenariy ID si kiritilmadi" }, { status: 400 });
    }

    if (updates.scenes) {
      updates.scenesJson = JSON.stringify(updates.scenes);
      delete updates.scenes;
    }

    const updated = await prisma.generatedScenario.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, scenario: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID kiritilmadi" }, { status: 400 });

    await prisma.generatedScenario.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

