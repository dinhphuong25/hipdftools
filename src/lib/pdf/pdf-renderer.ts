"use client";

// Dynamic import or check for browser environment
let pdfjsLib: any = null;

export async function getPdfJs() {
  if (typeof window === "undefined") return null;
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Configure worker
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
  }
  return pdfjsLib;
}

export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
}

export interface BoundingBoxTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
}

export interface PageLayoutData {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  items: BoundingBoxTextItem[];
  fullText: string;
}

/**
 * Loads a PDF document and extracts basic document information.
 */
export async function loadPdfDocInfo(arrayBuffer: ArrayBuffer): Promise<{
  numPages: number;
  pageThumbnails: string[];
  firstPageDimensions: { width: number; height: number };
}> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js is not available");

  // Clone buffer to avoid detached ArrayBuffer issues
  const clonedBuffer = arrayBuffer.slice(0);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(clonedBuffer) });
  const pdfDoc = await loadingTask.promise;

  const numPages = pdfDoc.numPages;
  const pageThumbnails: string[] = [];

  // Render thumbnail for up to first 20 pages
  const thumbnailCount = Math.min(numPages, 20);
  for (let i = 1; i <= thumbnailCount; i++) {
    try {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 0.35 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;
        pageThumbnails.push(canvas.toDataURL("image/jpeg", 0.7));
      }
    } catch (e) {
      console.warn(`Failed to render thumbnail for page ${i}`, e);
    }
  }

  const firstPage = await pdfDoc.getPage(1);
  const vp = firstPage.getViewport({ scale: 1.0 });

  return {
    numPages,
    pageThumbnails,
    firstPageDimensions: { width: vp.width, height: vp.height },
  };
}

/**
 * Renders a specific page into a canvas at a given scale.
 */
export async function renderPdfPageToCanvas(
  arrayBuffer: ArrayBuffer,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.2
): Promise<void> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js is not available");

  const clonedBuffer = arrayBuffer.slice(0);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(clonedBuffer) });
  const pdfDoc = await loadingTask.promise;

  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  // Handle high-DPI displays
  const outputScale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context is not available");

  ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;
}

/**
 * Extracts all text items with bounding boxes and layout metrics from a page.
 * Used for high-fidelity layout preservation.
 */
export async function extractPageLayoutData(
  arrayBuffer: ArrayBuffer,
  pageNumber: number
): Promise<PageLayoutData> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js is not available");

  const clonedBuffer = arrayBuffer.slice(0);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(clonedBuffer) });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.0 });

  const textContent = await page.getTextContent();
  const items: BoundingBoxTextItem[] = [];
  let fullText = "";

  for (const item of textContent.items) {
    if (!("str" in item) || !item.str.trim()) continue;

    // Transform matrix: [scaleX, skewY, skewX, scaleY, transX, transY]
    const tx = item.transform[4];
    const ty = item.transform[5];
    const width = item.width || 10;
    const height = item.height || Math.abs(item.transform[3]) || 12;
    const fontSize = Math.abs(item.transform[3]) || 12;

    // PDF coordinate system starts at bottom-left, y goes UP.
    // pdf-lib also starts at bottom-left!
    items.push({
      str: item.str,
      x: tx,
      y: ty,
      width: width,
      height: height,
      fontSize: fontSize,
      fontName: item.fontName || "sans-serif",
    });

    fullText += item.str + " ";
  }

  return {
    pageNumber,
    width: viewport.width,
    height: viewport.height,
    rotation: page.rotate || 0,
    items,
    fullText: fullText.trim(),
  };
}

/**
 * Extracts plain text from all pages in a PDF document.
 */
export async function extractAllPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js is not available");

  const clonedBuffer = arrayBuffer.slice(0);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(clonedBuffer) });
  const pdfDoc = await loadingTask.promise;

  let completeText = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    completeText += `--- Trang ${i} ---\n${pageText.trim()}\n\n`;
  }

  return completeText.trim();
}
