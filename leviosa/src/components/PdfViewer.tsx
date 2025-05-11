"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !containerRef.current) return;

    let pdfDoc: any = null;

    const loadPdf = async () => {
      try {
        setIsLoading(true);

        const pdfjsLib = await import("pdfjs-dist");
        const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

        pdfDoc = await pdfjsLib.getDocument(url).promise;

        containerRef.current!.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = "mb-4 shadow-md";

          containerRef.current!.appendChild(canvas);

          await page.render({
            canvasContext: context!,
            viewport: viewport,
          }).promise;

          // Optional: Save viewport + scale if bounding boxes needed later
        }

        setError(null);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Failed to render PDF.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      pdfDoc?.destroy?.();
    };
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        Loading PDF...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-4 overflow-y-auto min-h-[600px]"
    />
  );
}
