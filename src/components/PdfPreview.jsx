import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export default function PdfPreview({ url, className, alt }) {
  if (!url) return null;

  return (
    <Document
      file={url}
      loading={null}
      error={null}
    >
      <Page
        pageNumber={1}
        className={className}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}
