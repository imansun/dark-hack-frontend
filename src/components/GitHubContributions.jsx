import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function GitHubContributions() {
  const { t } = useTranslation();
  const [svgContent, setSvgContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github/contributions', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.text();
      })
      .then((svg) => {
        const cleaned = svg
          .replace(/<text[^>]*>[\s\S]*?<\/text>/g, '')
          .replace(/<a[^>]*>[\s\S]*?<\/a>/g, '');
        setSvgContent(cleaned);
        setError(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = svgContent;
    const svgEl = container.querySelector('svg');
    if (svgEl) {
      svgEl.style.width = '100%';
      svgEl.style.height = 'auto';
      svgEl.style.maxWidth = '720px';
      svgEl.style.display = 'block';
      svgEl.style.margin = '0 auto';
      svgEl.style.background = 'transparent';
      svgEl.style.borderRadius = '8px';
      svgEl.style.direction = 'ltr';
      const rects = svgEl.querySelectorAll('rect[fill]');
      rects.forEach((rect) => {
        const fill = rect.getAttribute('fill');
        if (fill && fill !== '#ebedf0' && fill !== '#f0f0f0') {
          rect.setAttribute('fill', fill);
        } else {
          rect.setAttribute('fill', '#1a1a1a');
        }
      });
      const tooltips = svgEl.querySelectorAll('tool-tip');
      tooltips.forEach((t) => t.remove());
    }
  }, [svgContent]);

  return (
    <section className="section container github-contrib">
      <h2 className="section__title">{t('github.title', 'مشارکت‌های گیت‌هاب')}</h2>
      <div className="github-contrib__box">
        {loading && (
          <div className="github-contrib__skeleton" />
        )}
        {error && (
          <p className="github-contrib__error">{t('github.error', 'خطا در دریافت اطلاعات')}</p>
        )}
        <div ref={containerRef} className="github-contrib__svg" />
      </div>
    </section>
  );
}
