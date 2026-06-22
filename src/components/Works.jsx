import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PdfPreview from './PdfPreview';

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');
const HOVER_DELAY = 1500;

const BENTO_PATTERNS = [
  { className: 'bento--featured', cols: 2, rows: 2 },
  { className: 'bento--wide', cols: 2, rows: 1 },
  { className: 'bento--small', cols: 1, rows: 1 },
  { className: 'bento--small', cols: 1, rows: 1 },
  { className: 'bento--wide', cols: 2, rows: 1 },
  { className: 'bento--small', cols: 1, rows: 1 },
  { className: 'bento--small', cols: 1, rows: 1 },
];

function MediaPreview({ url, title, imageFit, imagePosition }) {
  const imgStyle = {
    width: '100%', display: 'block',
    objectFit: imageFit || 'cover', objectPosition: imagePosition || 'center',
  };
  if (!url) return null;
  if (isPdf(url)) return <PdfPreview url={url} alt={title} />;
  return <img src={url} alt={title} style={imgStyle} />;
}

const lightboxOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 2000, cursor: 'zoom-out',
};
const lightboxImg = {
  maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
  borderRadius: '8px', boxShadow: '0 0 40px rgba(0,255,148,0.2)',
};

function Lightbox({ src, title, onClose }) {
  return (
    <div style={lightboxOverlay} onClick={onClose}>
      <img src={src} alt={title} style={lightboxImg} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

export default function Works() {
  const { t, i18n } = useTranslation();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const timerRef = useRef(null);

  const handleLightboxEnter = useCallback((work) => {
    if (!work.imageUrl || isPdf(work.imageUrl)) return;
    timerRef.current = setTimeout(() => {
      setLightbox({ src: work.imageUrl, title: work.title });
    }, HOVER_DELAY);
  }, []);

  const handleLightboxLeave = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    fetch(`/api/works?lang=${i18n.language}`)
      .then((res) => { if (!res.ok) throw new Error('Failed to fetch works'); return res.json(); })
      .then(setWorks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  if (loading) {
    return (
      <section id="works" className="section container">
        <h2 className="section__title">{t('works.title')}</h2>
        <p style={{ marginTop: '5rem', color: '#688277' }}>{t('works.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="works" className="section container">
        <h2 className="section__title">{t('works.title')}</h2>
        <p style={{ marginTop: '5rem', color: '#ff6b6b' }}>{t('works.error')}</p>
      </section>
    );
  }

  return (
    <section id="works" className="section container">
      <h2 className="section__title">{t('works.title')}</h2>
      <div className="works">
        {works.map((work, index) => {
          const pattern = BENTO_PATTERNS[index % BENTO_PATTERNS.length];
          return (
            <article
              key={work.id}
              className={`work ${pattern.className}`}
              style={{ '--bento-cols': pattern.cols, '--bento-rows': pattern.rows }}
            >
              <div className="work__box" onMouseEnter={() => handleLightboxEnter(work)} onMouseLeave={handleLightboxLeave}>
                <span className="work__img-box">
                  <MediaPreview url={work.imageUrl} title={work.title} imageFit={work.imageFit} imagePosition={work.imagePosition} />
                </span>
                <h3 className="work__title">{work.title}</h3>
                {work.badges?.length > 0 && (
                  <span className="work__badges">
                    {work.badges.map((badge, j) => (
                      <span key={j} className="work__badge">{badge.name}</span>
                    ))}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {lightbox && <Lightbox src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />}
    </section>
  );
}
