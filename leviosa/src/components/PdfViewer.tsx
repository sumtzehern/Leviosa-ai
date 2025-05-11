"use client";

import { useEffect, useRef, useState } from "react";

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
        console.log("Loading PDF from URL:", url);
        
        // Dynamically import pdf.js to avoid SSR issues
        const pdfjs = await import('pdfjs-dist');
        
        // Configure the worker source - THIS WAS MISSING
        const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        
        // Load the PDF document
        console.log("Loading document...");
        pdfDoc = await pdfjs.getDocument(url).promise;
        console.log("Document loaded with", pdfDoc.numPages, "pages");
        
        // Clear any previous content
        containerRef.current!.innerHTML = '';
        
        // Render all pages
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          
          // Create canvas for this page
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = 'mb-4 shadow-md';
          
          // Append to container
          containerRef.current!.appendChild(canvas);
          
          // Render PDF page to canvas
          await page.render({
            canvasContext: context!,
            viewport: viewport
          }).promise;
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(`Failed to load PDF: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPdf();
    
    return () => {
      // Cleanup
      pdfDoc?.destroy?.();
    };
  }, [url]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-8">Loading PDF...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col items-center gap-4 overflow-y-auto p-4 min-h-[600px]"
    />
  );
}