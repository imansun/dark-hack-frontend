import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

function Fallback({ className, alt }) {
  return <img src="/assets/works/sample.png" alt={alt} className={className} />;
}

export default function PdfPreview({ url, className, alt }) {
  if (!url) return <Fallback className={className} alt={alt} />;

  return (
    <Document
      file={url}
      loading={<Fallback className={className} alt={alt} />}
      error={<Fallback className={className} alt={alt} />}
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
