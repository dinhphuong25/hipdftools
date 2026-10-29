import { NextResponse } from "next/server";

export async function GET() {
  const azureKey = process.env.AZURE_TRANSLATOR_KEY || "";
  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY || "";
  const geminiKey = process.env.GEMINI_API_KEY || "";
  const gotenbergUrl = process.env.GOTENBERG_URL || "";

  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    name: "Hi PDF Engine",
    capabilities: {
      clientSidePdfOperations: {
        status: "available",
        engine: "pdf-lib 1.17.1 + fontkit + PDF.js 4",
        supported: [
          "merge",
          "split",
          "rotate",
          "delete_pages",
          "reorder_pages",
          "page_numbers",
          "watermark",
          "flatten",
          "metadata",
          "images_to_pdf",
          "pdf_to_images",
          "extract_text",
          "layout_preserving_translation",
        ],
      },
      documentTranslation: {
        layoutPreserving: "available",
        azureDocumentTranslation: {
          status: azureKey ? "available" : "not_configured",
          provider: "Microsoft Azure AI Document Translation",
        },
        googleDocumentTranslation: {
          status: googleKey ? "available" : "not_configured",
          provider: "Google Cloud Translation API",
        },
        inBrowserLayoutEngine: {
          status: "available",
          provider: "Hi PDF Semantic Layout Engine",
        },
      },
      documentAI: {
        gemini: {
          status: geminiKey ? "available" : "not_configured",
          provider: "Google Gemini API",
        },
      },
      officeConversion: {
        gotenberg: {
          status: gotenbergUrl ? "available" : "not_configured",
          provider: "Gotenberg / Chromium & LibreOffice",
        },
      },
    },
  });
}
