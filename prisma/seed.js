const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data if any
  await prisma.aIUsageLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.activationCode.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.contentCalendarItem.deleteMany({});
  await prisma.generatedScenario.deleteMany({});
  await prisma.aIAnalysis.deleteMany({});
  await prisma.instagramAnalytics.deleteMany({});
  await prisma.instagramAccount.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleaned existing database.");

  // 2. Create Plans
  const freeTrialPlan = await prisma.plan.create({
    data: {
      code: "FREE_TRIAL",
      nameUz: "3 Kunlik Bepul Sinov",
      nameRu: "3 Дня Бесплатно",
      priceMonth: 0,
      priceYear: 0,
      currency: "USD",
      maxAccounts: 1,
      featuresUz: JSON.stringify([
        "1 ta Instagram akkaunt",
        "AI Analytics & Account Analysis",
        "AI Feedback & tavsiyalar",
        "Bugungi kontent ssenariysi",
        "Cheklangan AI Predictions"
      ]),
      featuresRu: JSON.stringify([
        "1 Instagram аккаунт",
        "AI Analytics & Аудит профиля",
        "AI Feedback и рекомендации",
        "Сценарий на сегодня",
        "Базовые AI Predictions"
      ]),
      isPopular: false,
      isActive: true,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      code: "PRO",
      nameUz: "PRO",
      nameRu: "PRO",
      priceMonth: 19,
      priceYear: 180,
      currency: "USD",
      maxAccounts: 1,
      featuresUz: JSON.stringify([
        "1 ta Instagram akkaunt",
        "AI Analytics & Account Analysis",
        "AI Feedback & tavsiyalar",
        "Daily Content Ideas",
        "Reels ssenariylari & Captions",
        "Haftalik Content Calendar",
        "Basic AI Predictions"
      ]),
      featuresRu: JSON.stringify([
        "1 Instagram аккаунт",
        "AI Analytics & Аудит профиля",
        "AI Feedback и рекомендации",
        "Ежедневные идеи контента",
        "Сценарии Reels и тексты",
        "Недельный Content Calendar",
        "Базовые AI Predictions"
      ]),
      isPopular: true,
      isActive: true,
    },
  });

  const maxPlan = await prisma.plan.create({
    data: {
      code: "MAX",
      nameUz: "MAX",
      nameRu: "MAX",
      priceMonth: 39,
      priceYear: 370,
      currency: "USD",
      maxAccounts: 5,
      featuresUz: JSON.stringify([
        "Bir nechta Instagram akkauntlari (5 tagacha)",
        "Advanced Analytics & Competitor Analysis",
        "Advanced AI Strategy & Cheksiz g‘oyalar",
        "Advanced Reels Scenarios & Storyboards",
        "Haftalik AI PDF hisobotlar",
        "Priority AI Processing (Tezkor navbat)",
        "Telegram bot to‘liq integratsiyasi"
      ]),
      featuresRu: JSON.stringify([
        "Несколько Instagram аккаунтов (до 5)",
        "Advanced Analytics & Анализ конкурентов",
        "Расширенная AI стратегия и неограниченные идеи",
        "Сложные сценарии Reels и раскадровки",
        "Еженедельные отчеты в PDF",
        "Приоритетная генерация AI без очереди",
        "Полная интеграция с Telegram ботом"
      ]),
      isPopular: false,
      isActive: true,
    },
  });

  // 3. Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aismm.uz",
      name: "Adminstrator",
      passwordHash: adminPassword,
      role: "ADMIN",
      language: "uz",
      profile: {
        create: {
          bio: "Platforma boshqaruvchisi",
          isTelegramVerified: true,
        },
      },
    },
  });

  // 4. Create Demo User
  const demoPassword = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@aismm.uz",
      name: "Sardor Olimov",
      passwordHash: demoPassword,
      role: "USER",
      language: "uz",
      profile: {
        create: {
          bio: "Tech blogger & SMM Creator",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          phone: "+998901234567",
          telegramUsername: "@sardor_tech",
          isTelegramVerified: true,
        },
      },
      subscription: {
        create: {
          planId: proPlan.id,
          status: "TRIAL",
          trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days left
        },
      },
    },
  });

  // 5. Zero mock Instagram accounts - user connects their real account
  console.log("Database initialized without pre-seeded mock Instagram accounts.");

  // 8. Create Sample Daily Scenario
  await prisma.generatedScenario.create({
    data: {
      userId: demoUser.id,
      instagramAccountId: null,
      title: "5 ta AI tool, siz hali ishlatmayapsiz",
      topic: "Kundalik ishni 10x tezlashtiruvchi sun'iy intellekt vositalari",
      contentType: "Reel",
      duration: "32 soniya",
      language: "uz",
      goal: "Reach & Saves",
      hook: "Agar siz hali ham hamma narsani qo‘lda qilayotgan bo‘lsangiz, bu 32 soniyalik video hayotingizni o‘zgartiradi.",
      scriptBody: "1. Gamma App — 1 daqiqada prezentatsiya tayyorlaydi.\n2. ElevenLabs — inson ovozini 100% klonlaydi.\n3. Claude 3.5 — har qanday kod va hisobotni xatosiz yozadi.\n4. Perplexity — Google o‘rniga faktik manbali javob beradi.\n5. CapCut AI — videoni avtomatik montaj qiladi.",
      scenesJson: JSON.stringify([
        {
          scene: "Hook",
          time: "0–3s",
          visual: "Kameraga yaqinlashib telefon ekranini ko‘rsatish, ekranda katta matn: 'TO‘XTANG!'",
          voiceover: "Agar siz hali ham barchasini qo‘lda qilayotgan bo‘lsangiz, to‘xtang!",
          camera: "Frontal, ko‘z darajasida, tezkor zoom-in"
        },
        {
          scene: "1-sahna",
          time: "3–8s",
          visual: "Noutbukda Gamma prezentatsiya generatsiyasini tezkor b-roll tarzida ko‘rsatish",
          voiceover: "Birinchisi: Gamma App. 1 daqiqada professional prezentatsiya yaratib beradi.",
          camera: "45 gradus burchak ostida over-the-shoulder"
        },
        {
          scene: "2-sahna",
          time: "8–15s",
          visual: "Audio to‘lqinlar va mikrofon kadrlari",
          voiceover: "Ikkinchisi: ElevenLabs. Shunchaki matn yozasiz, u esa professional studiya ovoziga aylantiradi.",
          camera: "Makro kadr, yumshoq yorug‘lik"
        },
        {
          scene: "3-sahna",
          time: "15–25s",
          visual: "Claude va Perplexity ekran lavhalari, matn yozilish jarayoni",
          voiceover: "Uchinchisi — Perplexity. Google qidiruvini unuting, bu tool faktlarni tahlil qilib beradi.",
          camera: "O‘ng tomondan dinamik harakat"
        },
        {
          scene: "Yakun",
          time: "25–32s",
          visual: "Kameraga to‘g‘ridan-to‘g‘ri qarab ishora qilish, pastda caption matni chiqadi",
          voiceover: "Barcha tool'larning to‘liq havolasi profilim tavsifida. Saqlab qo‘yishni unutmang!",
          camera: "O‘rta kadr, ishonchli tabassum"
        }
      ]),
      cameraNotes: "Sony A7IV yoki iPhone 15 Pro, 24fps 4K, 35mm linza, frontal yorug‘lik",
      lightingNotes: "Asosiy key-light 45 gradusda, orqa fonda neon ko‘k rim-light",
      musicSuggestion: "Trending Lo-Fi / Upbeat Tech Synth (Instagram Audio: TechPulse 2026)",
      voiceover: "Energetik, professional, qat'iy va ishonchli ohang",
      caption: "Sun'iy intellekt sizning o‘rningizni egallamaydi, lekin undan foydalanadigan inson o‘rningizni egallaydi. 🔥\n\nQaysi birini allaqachon sinab ko‘rgansiz? Izohlarda yozing!\n\n#ai #texnologiya #smm #uzbekistan #reels #aismm",
      keywords: "ai tools, sun'iy intellekt, smm, produktivlik, reels g'oyalari",
      hashtags: "#ai #texnologiya #smm #uzbekistan #reels #foydali",
      cta: "Keyingi qismni o‘tkazib yubormaslik uchun obuna bo‘ling!",
      expectedViews: "8K–15K",
      expectedLikes: "500–1.2K",
      expectedEngagement: "4.8%–6.5%",
      status: "AI Generated",
    },
  });

  // 9. Create Content Calendar items
  const calendarItems = [
    { dayOffset: 0, title: "5 ta AI tool, siz hali ishlatmayapsiz", type: "Reel", time: "19:30", status: "READY" },
    { dayOffset: 1, title: "ChatGPT vs Claude: 2026 yilda qaysi biri kuchliroq?", type: "Carousel", time: "18:00", status: "PLANNED" },
    { dayOffset: 2, title: "Qanday qilib Reels ko‘rishlarini 3x oshirish mumkin?", type: "Reel", time: "20:00", status: "PLANNED" },
    { dayOffset: 3, title: "Mening ish stolim va setupim (SMM ish jarayoni)", type: "Story", time: "14:00", status: "PLANNED" },
    { dayOffset: 4, title: "Top 3 ta bepul video montaj dasturi", type: "Reel", time: "19:00", status: "PLANNED" },
    { dayOffset: 5, title: "SMM mutaxassislari uchun haftalik xulosa", type: "Carousel", time: "17:30", status: "PLANNED" },
    { dayOffset: 6, title: "Haftalik statistika va auditoriya tahlili", type: "Post", time: "12:00", status: "PLANNED" },
  ];

  for (const item of calendarItems) {
    const itemDate = new Date();
    itemDate.setDate(itemDate.getDate() + item.dayOffset);
    await prisma.contentCalendarItem.create({
      data: {
        userId: demoUser.id,
        instagramAccountId: null,
        title: item.title,
        contentType: item.type,
        scheduledDate: itemDate,
        scheduledTime: item.time,
        status: item.status,
        isAiGenerated: true,
      },
    });
  }

  // 10. Create Activation Code
  await prisma.activationCode.create({
    data: {
      userId: demoUser.id,
      code: "84721936",
      expiresAt: new Date(Date.now() + 25 * 60 * 1000), // 25 mins
      isUsed: false,
    },
  });

  // 11. Create Customer Reviews
  const reviews = [
    {
      name: "Jasur Bekmirzayev",
      roleUz: "Tech Blogger (120K obunachi)",
      roleRu: "Техно-блогер (120K подписчиков)",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      commentUz: "AI SMM Assistant yordamida Reels videolarim qamrovi 2 barobarga oshdi. Ayniqsa hook va ssenariy generatsiyasi har kuni 2 soat vaqtimni tejaydi.",
      commentRu: "С помощью AI SMM Assistant охваты моих Reels выросли в 2 раза. Генерация хуков и поминутных сценариев экономит мне до 2 часов ежедневно.",
      order: 1,
    },
    {
      name: "Dilnoza Rahimova",
      roleUz: "SMM Agentlik rahbari",
      roleRu: "Руководитель SMM-агентства",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      commentUz: "Agentligimizdagi 8 ta mijoz akkauntini ushbu platforma orqali tahlil qilamiz. AI tavsiyalari va kontent kalendar juda aniq va qulay ishlangan.",
      commentRu: "Ведем 8 клиентских аккаунтов через эту платформу. Аналитика и еженедельный контент-календарь работают идеально.",
      order: 2,
    },
    {
      name: "Bobur Mansurov",
      roleUz: "E-commerce asoschisi",
      roleRu: "Основатель интернет-магазина",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      commentUz: "Tovarlarimiz uchun ssenariy va CTA yaratishda tengsiz vosita. Birinchi haftadayoq profilingizdagi konversiya o‘sganini sezasiz.",
      commentRu: "Незаменимый инструмент для создания продающих сценариев и призывов к действию. Конверсия выросла в первую же неделю.",
      order: 3,
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  // 12. Create Welcome Notification
  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      title: "Xush kelibsiz!",
      message: "AI SMM Assistant platformasiga xush kelibsiz. 3 kunlik to‘liq sinov muddatingiz faol.",
      type: "SUCCESS",
    },
  });

  console.log("Database seeded successfully!");
  console.log("Admin account: admin@aismm.uz / admin123");
  console.log("Demo account: demo@aismm.uz / demo123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

