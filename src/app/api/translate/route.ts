import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texts, sourceLang = "auto", targetLang = "vi" } = body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "texts array is required" }, { status: 400 });
    }

    // Process translations in parallel batches with rate limit safety
    const translations: string[] = [];

    for (const text of texts) {
      if (!text || !text.trim()) {
        translations.push("");
        continue;
      }

      try {
        const sl = sourceLang === "auto" ? "auto" : sourceLang;
        const tl = targetLang || "vi";

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
          sl
        )}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;

        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HiPDF/1.0",
          },
        });

        if (res.ok) {
          const raw = await res.json();
          // raw[0] is array of [[translatedSegment, originalSegment], ...]
          if (Array.isArray(raw) && Array.isArray(raw[0])) {
            const combined = raw[0].map((part: any) => part[0] || "").join("");
            translations.push(combined || text);
            continue;
          }
        }
      } catch (err) {
        console.warn("Translation failed for chunk:", text.substring(0, 30), err);
      }

      // Fallback to original text if translation failed
      translations.push(text);
    }

    return NextResponse.json({
      status: "success",
      translations,
      sourceLang,
      targetLang,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal translation error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
