import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PdfPreview from './PdfPreview';

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');
const HOVER_DELAY = 1500;

function MediaPreview({ url, title }) {
  if (!url) {
    return <img src="/assets/works/sample.png" alt={title} />;
  }
  if (isPdf(url)) {
    return <PdfPreview url={url} alt={title} />;
  }
  return <img src={url} alt={title} />;
}

const lightboxStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    cursor: 'zoom-out',
  },
  img: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 0 40px rgba(0,255,148,0.2)',
  },
};

function Lightbox({ src, title, onClose }) {
  return (
    <div style={lightboxStyles.overlay} onClick={onClose}>
      <img
        src={src}
        alt={title}
        style={lightboxStyles.img}
        onClick={(e) => e.stopPropagation()}
      />
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

  const handleMouseEnter = useCallback((work) => {
    if (work.imageUrl && isPdf(work.imageUrl)) return;
    const src = work.imageUrl || '/assets/works/sample.png';
    timerRef.current = setTimeout(() => {
      setLightbox({ src, title: work.title });
    }, HOVER_DELAY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetch(`/api/works?lang=${i18n.language}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch works');
        return res.json();
      })
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
        {works.map((work) => (
          <article
            key={work.id}
            className="work"
          >
            <div
              className="work__box"
              onMouseEnter={() => handleMouseEnter(work)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="work__img-box">
                <MediaPreview url={work.imageUrl} title={work.title} />
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
        ))}
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
