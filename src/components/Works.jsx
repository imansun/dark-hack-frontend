import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PdfPreview from './PdfPreview';

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');
const HOVER_DELAY = 1500;

function MediaPreview({ url, title, imageFit, imagePosition }) {
  const imgStyle = {
    width: '100%', height: '100%', display: 'block',
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

const ITEMS_PER_PAGE = 2;

export default function Works() {
  const { t, i18n } = useTranslation();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const timerRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(works.length / ITEMS_PER_PAGE));
  const paginatedWorks = works.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleLightboxEnter = useCallback((work) => {
    if (!work.imageUrl || isPdf(work.imageUrl)) return;
    timerRef.current = setTimeout(() => {
      setLightbox({ src: work.imageUrl, title: work.title });
    }, HOVER_DELAY);
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: document.getElementById('works').offsetTop - 100, behavior: 'smooth' });
  };

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
      <section id="works" style={styles.section}>
        <h2 className="section__title" style={{ textAlign: 'center', marginBottom: '5rem', color: '#fff', fontSize: '3.2rem', fontWeight: 700 }}>{t('works.title')}</h2>
        <p style={{ textAlign: 'center', color: '#688277' }}>{t('works.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="works" style={styles.section}>
        <h2 className="section__title" style={{ textAlign: 'center', marginBottom: '5rem', color: '#fff', fontSize: '3.2rem', fontWeight: 700 }}>{t('works.title')}</h2>
        <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{t('works.error')}</p>
      </section>
    );
  }

  return (
    <section id="works" style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>{t('works.title')}</h2>
        <p style={styles.headerSub}>{t('works.subtitle')}</p>
      </div>

      <div style={styles.cardList}>
        {paginatedWorks.map((work, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div
              key={work.id}
              className="works__card"
              style={{
                ...styles.card,
                flexDirection: isReversed ? 'row-reverse' : 'row',
              }}
            >
              <div
                className="works__col"
                style={styles.imageCol}
                onMouseEnter={() => handleLightboxEnter(work)}
                onMouseLeave={handleLightboxLeave}
              >
                <div className="works__img-hover" style={styles.imageInner}>
                  {work.imageUrl ? (
                    <MediaPreview url={work.imageUrl} title={work.title} imageFit={work.imageFit} imagePosition={work.imagePosition} />
                  ) : (
                    <div style={styles.imagePlaceholder} />
                  )}
                </div>
              </div>

              <div className="works__text-col" style={styles.textCol}>
                {work.badges?.length > 0 && (
                  <span style={styles.badgeLabel}>{work.badges.map((b) => b.name).join(' / ')}</span>
                )}
                <h3 style={styles.cardTitle}>{work.title}</h3>
                {work.description && (
                  <p style={styles.cardDesc}>{work.description}</p>
                )}
                {work.badges?.length > 0 && (
                  <ul style={styles.badgeList}>
                    {work.badges.map((badge, j) => (
                      <li key={j} style={styles.badgeItem}>
                        <span style={styles.badgeBullet}>•</span>
                        <span>{badge.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {work.projectUrl && (
                  <a
                    href={work.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works__link"
                    style={styles.cardLink}
                  >
                    {t('works.viewProject')}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="works__pagination">
          <button
            className="works__page--nav"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'works__page--active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="works__page--nav"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      {lightbox && <Lightbox src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />}
    </section>
  );
}

const styles = {
  section: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '5rem 1.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  headerTitle: {
    fontSize: '3.2rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1rem',
  },
  headerSub: {
    color: '#688277',
    maxWidth: '640px',
    margin: '0 auto',
    fontSize: '1.6rem',
    lineHeight: 1.6,
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    background: '#1a1a1a',
    borderRadius: '2.5rem',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
  },
  imageCol: {
    width: '50%',
    overflow: 'hidden',
    minHeight: '400px',
    cursor: 'zoom-in',
  },
  imageInner: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: '1.4rem',
    minHeight: '400px',
  },
  textCol: {
    width: '50%',
    padding: '2.5rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#688277',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '2.4rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: 1.3,
  },
  cardDesc: {
    color: '#999',
    lineHeight: 1.8,
    marginBottom: '2rem',
    fontSize: '1.4rem',
  },
  badgeList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 2.5rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '1.4rem',
    lineHeight: 1.6,
    color: '#999',
  },
  badgeBullet: {
    marginRight: '0.8rem',
    color: '#fff',
    fontWeight: 700,
    lineHeight: 1,
  },
  cardLink: {
    color: '#00FF94',
    fontWeight: 700,
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
};
