import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const FALLBACK_IMGS = ['support', 'design', 'developing'];

export default function Services() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentServiceBG = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services?lang=${i18n.language}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) setServices(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const moveBG = useCallback((x, y) => {
    if (currentServiceBG.current) {
      currentServiceBG.current.style.left = x + 'px';
      currentServiceBG.current.style.top = y + 'px';
    }
  }, []);

  const handleMouseEnter = useCallback((e) => {
    if (currentServiceBG.current === null) {
      currentServiceBG.current = e.currentTarget.querySelector('.service-card__bg');
    }
    moveBG(e.clientX, e.clientY);
  }, [moveBG]);

  const handleMouseMove = useCallback((e) => {
    const box = e.currentTarget;
    const rect = box.getBoundingClientRect();
    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;
    moveBG(left, top);
  }, [moveBG]);

  const handleMouseLeave = useCallback((e) => {
    const imgPos = e.currentTarget.querySelector('.service-card__illustration');
    const bg = currentServiceBG.current;
    if (imgPos && bg) {
      const left = imgPos.offsetLeft + bg.getBoundingClientRect().width;
      const top = imgPos.offsetTop + bg.getBoundingClientRect().height;
      moveBG(left, top);
    }
    currentServiceBG.current = null;
  }, [moveBG]);

  return (
    <section id="services" className="section container">
      <h2 className="section__title">{t('services.title')}</h2>
      {loading ? (
        <div style={{ display: 'flex', gap: '2rem', marginTop: '5rem', justifyContent: 'center' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, maxWidth: '320px', background: '#141414', border: '1px solid #222', borderRadius: '14px', padding: '3rem 2rem' }}>
              <div className="skeleton-line" style={{ width: '60px', height: '60px', borderRadius: '12px', margin: '0 auto 1.5rem' }} />
              <div className="skeleton-line" style={{ width: '70%', height: '20px', margin: '0 auto 1rem' }} />
              <div className="skeleton-line" style={{ width: '100%', height: '40px' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="service-cards">
          {services.length === 0 && (
            <p style={{ marginTop: '5rem', color: '#688277', textAlign: 'center' }}>{t('services.empty')}</p>
          )}
          {services.map((service, i) => (
            <article
              key={i}
              className="service-card__box"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {service.imageUrl || i < FALLBACK_IMGS.length ? (
                <span className="service-card__illustration">
                  <img
                    src={service.imageUrl || `/assets/services/${FALLBACK_IMGS[i]}.svg`}
                    alt={`${service.title} Illustration`}
                  />
                </span>
              ) : null}
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__msg">{service.description}</p>
              <span className="service-card__bg"></span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
