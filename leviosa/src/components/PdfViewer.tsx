'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';


interface PdfViewerProps {
  url: string;
}


export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      className="space-y-4"
    >
      {Array.from({ length: numPages }, (_, i) => (
        <Page
          key={`page_${i + 1}`}
          pageNumber={i + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="border rounded-lg shadow-sm"
        />
      ))}
    </Document>
  );
}
