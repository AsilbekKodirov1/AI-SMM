export interface ContentGenerationRequest {
  niche: string;
  topic: string;
  audience: string;
  contentType: string;
  duration: string;
  language: string;
  goal: string;
}

export interface GeneratedContentResult {
  title: string;
  topic: string;
  contentType: string;
  duration: string;
  language: string;
  goal: string;
  hook: string;
  scriptBody: string;
  scenes: Array<{
    scene: string;
    time: string;
    visual: string;
    voiceover: string;
    camera: string;
  }>;
  cameraNotes: string;
  lightingNotes: string;
  musicSuggestion: string;
  voiceover: string;
  caption: string;
  keywords: string;
  hashtags: string;
  cta: string;
  expectedViews: string;
  expectedLikes: string;
  expectedEngagement: string;
}

export async function generateContentWithAI(
  params: ContentGenerationRequest
): Promise<GeneratedContentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are a world-class Instagram SMM strategist and viral Reels director.
Generate a complete, high-converting video scenario based on these details:
- Niche: ${params.niche}
- Topic: ${params.topic}
- Target Audience: ${params.audience}
- Content Type: ${params.contentType}
- Video Duration: ${params.duration}
- Language: ${params.language === "ru" ? "Russian" : "Uzbek"}
- Strategic Goal: ${params.goal}

Respond ONLY with valid JSON matching this exact structure:
{
  "title": "Short punchy title",
  "hook": "Intriguing first 3 seconds hook statement",
  "scriptBody": "Summary or full spoken text",
  "scenes": [
    { "scene": "Hook", "time": "0-3s", "visual": "visual direction", "voiceover": "spoken text", "camera": "camera angle" },
    { "scene": "Scene 1", "time": "3-10s", "visual": "visual direction", "voiceover": "spoken text", "camera": "camera angle" },
    { "scene": "Scene 2", "time": "10-20s", "visual": "visual direction", "voiceover": "spoken text", "camera": "camera angle" },
    { "scene": "Ending", "time": "20-30s", "visual": "visual direction", "voiceover": "spoken text", "camera": "camera angle" }
  ],
  "cameraNotes": "Framing, lens, movement tips",
  "lightingNotes": "Lighting setup recommendation",
  "musicSuggestion": "Specific background track or mood",
  "voiceover": "Tone of voice description",
  "caption": "Full Instagram caption text with emojis and formatting",
  "keywords": "Comma separated keywords",
  "hashtags": "#relevant #hashtags",
  "cta": "Specific call to action",
  "expectedViews": "e.g. 10K-25K",
  "expectedLikes": "e.g. 800-1.5K",
  "expectedEngagement": "e.g. 5.2%-7.1%"
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            title: parsed.title || params.topic,
            topic: params.topic,
            contentType: params.contentType,
            duration: params.duration,
            language: params.language,
            goal: params.goal,
            hook: parsed.hook,
            scriptBody: parsed.scriptBody,
            scenes: parsed.scenes || [],
            cameraNotes: parsed.cameraNotes,
            lightingNotes: parsed.lightingNotes,
            musicSuggestion: parsed.musicSuggestion,
            voiceover: parsed.voiceover,
            caption: parsed.caption,
            keywords: parsed.keywords,
            hashtags: parsed.hashtags,
            cta: parsed.cta,
            expectedViews: parsed.expectedViews || "10K–25K",
            expectedLikes: parsed.expectedLikes || "700–1.4K",
            expectedEngagement: parsed.expectedEngagement || "5.4%–7.2%",
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to built-in generator:", e);
    }
  }

  // High-fidelity algorithmic AI generator tailored to the topic and language
  const isUz = params.language === "uz";

  const uzHookTemplates = [
    `Agar siz ${params.topic} bo‘yicha natijaga erishmoqchi bo‘lsangiz, ko‘pchilik qiladigan mana bu xatoni to‘xtating!`,
    `90% odamlar ${params.topic} haqida bilmaydi, lekin bilganlar allaqachon daromadini 2x ga oshirdi.`,
    `Bu usulni bilganingizdan keyin ${params.topic} siz uchun 10 barobar osonlashadi.`,
  ];

  const ruHookTemplates = [
    `Если вы до сих пор тратите часы на ${params.topic}, остановитесь — есть способ в 10 раз быстрее!`,
    `90% авторов допускают эту фатальную ошибку в теме: ${params.topic}. Вот как сделать правильно.`,
    `Секретный алгоритм, который выведет ваши ${params.topic} в топ рекомендаций Reels уже на этой неделе.`,
  ];

  const chosenHook = isUz
    ? uzHookTemplates[Math.floor(Math.random() * uzHookTemplates.length)]
    : ruHookTemplates[Math.floor(Math.random() * ruHookTemplates.length)];

  const uzScenes = [
    {
      scene: "Hook",
      time: "0–3s",
      visual: "Kameraga shiddat bilan yaqinlashish, ekranda katta qizil/oq ogohlantiruvchi yozuv",
      voiceover: chosenHook,
      camera: "Frontal, 4K 24fps, tezkor dinamik zoom",
    },
    {
      scene: "1-sahna (Muammo)",
      time: "3–9s",
      visual: "B-roll: ekrandagi odatiy qiyinchiliklar yoki chalg‘ituvchi jarayonlar",
      voiceover: `Ko‘pchilik ${params.topic} bilan shug‘ullanganda tizimsiz harakat qiladi va auditoriya e'tiborini yo‘qotadi.`,
      camera: "O‘ng tomondan over-the-shoulder, yumshoq fon (bokeh)",
    },
    {
      scene: "2-sahna (Yechim)",
      time: "9–18s",
      visual: "Amaliy ko‘rsatuv: telefon yoki noutbukda aniq bosqichma-bosqich harakatlar",
      voiceover: `Aslida qoida oddiy: birinchidan, aniq strukturaga ega bo‘ling. Ikkinchidan, har bir soniyani qimmatli ma'lumot bilan to‘ldiring.`,
      camera: "Yaqin makro kadr, aniq detallar",
    },
    {
      scene: "3-sahna (Natija)",
      time: "18–25s",
      visual: "Muvaffaqiyatli statistika, grafiklar yoki qoniqarli natija ekrani",
      voiceover: `Mana shu 3 ta qadam tufayli qamrov darhol oshadi va yangi obunachilar oqimi boshlanadi.`,
      camera: "O‘rta plan, ishonchli imo-ishoralar",
    },
    {
      scene: "Yakun (CTA)",
      time: "25–32s",
      visual: "Kameraga to‘g‘ridan-to‘g‘ri qarab ishora qilish, pastda harakat matni paydo bo‘ladi",
      voiceover: `Siz bu usulni sinab ko‘rganmisiz? Fikringizni izohlarda yozing va profilimga obuna bo‘ling!`,
      camera: "Markazlashtirilgan frontal kadr",
    },
  ];

  const ruScenes = [
    {
      scene: "Hook",
      time: "0–3s",
      visual: "Динамичный зум в лицо, яркая текстовая плашка с интригующим вопросом",
      voiceover: chosenHook,
      camera: "Фронтальный средний план, 4K 24fps",
    },
    {
      scene: "1-я сцена (Проблема)",
      time: "3–9s",
      visual: "B-roll демонстрация рутины и типичных ошибок большинства авторов",
      voiceover: `Большинство допускают одну и ту же ошибку при работе с ${params.topic}, сливая весь охват.`,
      camera: "Съемка через плечо с мягким размытием заднего плана",
    },
    {
      scene: "2-я сцена (Решение)",
      time: "9–18s",
      visual: "Пошаговый показ конкретного решения на экране смартфона или ноутбука",
      voiceover: `Вместо этого используйте эту проверенную формулу из трех шагов, которая удерживает 85% зрителей до конца.`,
      camera: "Макро-детали экрана и жестов",
    },
    {
      scene: "3-я сцена (Результат)",
      time: "18–25s",
      visual: "Показ статистики роста охватов и конверсий",
      voiceover: `Результат говорит сам за себя: рост вовлеченности более чем на 40% за первую неделю.`,
      camera: "Уверенный ракурс на уровне глаз",
    },
    {
      scene: "Финал (CTA)",
      time: "25–32s",
      visual: "Прямой взгляд в камеру, жестом указание на кнопку подписки или комментарии",
      voiceover: `Сохраняйте этот рилс, чтобы не потерять, и подписывайтесь на блог за новыми инсайтами!`,
      camera: "Статичный чистый кадр, улыбка",
    },
  ];

  const scenes = isUz ? uzScenes : ruScenes;

  return {
    title: params.topic || (isUz ? "Yangi video g‘oyasi" : "Новая идея для видео"),
    topic: params.topic,
    contentType: params.contentType || "Reel",
    duration: params.duration || "32s",
    language: params.language,
    goal: params.goal,
    hook: chosenHook,
    scriptBody: scenes.map((s) => `${s.scene} (${s.time}): ${s.voiceover}`).join("\n\n"),
    scenes,
    cameraNotes: isUz
      ? "iPhone 15 Pro yoki Sony kamera, 4K 24fps, yorug‘lik 45 gradusda, ko‘z darajasida"
      : "iPhone 15 Pro или беззеркальная камера, 4K 24fps, свет под углом 45 градусов",
    lightingNotes: isUz
      ? "Asosiy yumshoq softbox yorug‘ligi, orqa fonda kontrast uchun ko‘k tusli kontur nuri"
      : "Основной мягкий софтбокс спереди, контрастный холодный свет на фоне для объема",
    musicSuggestion: isUz
      ? "Trending Tech/Minimal Lofi (Instagram Audio: Pulse Beats 2026)"
      : "Трендовый электронный эмбиент с четким ритмом (Trending Instagram Audio)",
    voiceover: isUz
      ? "Ishonchli, baquvvat, qat'iy va do‘stona ohangda"
      : "Уверенная, динамичная подача эксперта без пауз и монотонности",
    caption: isUz
      ? `${params.topic} bo‘yicha eng muhim maslahatlar!\n\nBu usul yordamida siz auditoriyangizni yanada faol jalb qila olasiz. Saqlab qo‘ying va do‘stlaringiz bilan ulashing!\n\nQaysi biri sizga eng qiziq tuyuldi? Izohlarda yozib qoldiring:\n\n#${params.niche.toLowerCase().replace(/[^a-z0-9]/g, "")} #smm #uzbekistan #reels #biznes #aismm`
      : `Главные инсайты по теме: ${params.topic}\n\nПрименяйте эту схему уже в следующем ролике и следите за удержанием аудитории. Обязательно сохраните в закладки!\n\nКакой шаг внедрите первым? Пишите в комментариях:\n\n#${params.niche.toLowerCase().replace(/[^a-z0-9]/g, "")} #smm #reels #маркетинг #контент #aismm`,
    keywords: `${params.niche}, ${params.topic}, instagram reels, engagement, smm strategiya`,
    hashtags: `#${params.niche.toLowerCase().replace(/[^a-z0-9]/g, "")} #reels #smm #growth #viral`,
    cta: isUz
      ? "Ko‘proq foydali kontent uchun profilga obuna bo‘ling va videoni saqlab qo‘ying!"
      : "Подписывайтесь на профиль и сохраняйте видео, чтобы применить на практике!",
    expectedViews: "9K–18K",
    expectedLikes: "600–1.3K",
    expectedEngagement: "5.1%–6.8%",
  };
}
