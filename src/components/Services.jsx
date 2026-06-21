import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const FALLBACK_SERVICES_FA = [
  { title: 'استقرار', description: 'همیشه آماده پاسخگویی به هرگونه مشکل یا نگرانی شما هستم.', imageUrl: '/assets/services/support.svg' },
  { title: 'طراحی', description: 'متخصص در خلق وب‌سایت‌های stunning که هم visually appealing و هم user-friendly هستند.', imageUrl: '/assets/services/design.svg' },
  { title: 'توسعه', description: 'خدمات توسعه وب سفارشی متناسب با نیازهای خاص شما به عنوان یک حرفه‌ای solo ارائه می‌دهم.', imageUrl: '/assets/services/developing.svg' },
];

const FALLBACK_SERVICES_EN = [
  { title: 'Deployment', description: 'I am always available to address any issues or concerns you may have.', imageUrl: '/assets/services/support.svg' },
  { title: 'Design', description: 'Specialized in creating stunning websites that are both visually appealing and user-friendly.', imageUrl: '/assets/services/design.svg' },
  { title: 'Developing', description: 'I offer custom web development services tailored to your specific needs as a solo professional.', imageUrl: '/assets/services/developing.svg' },
];

const FALLBACK_SERVICES_AR = [
  { title: 'النشر', description: 'أنا دائمًا متاح لمعالجة أي مشاكل أو استفسارات قد تكون لديك.', imageUrl: '/assets/services/support.svg' },
  { title: 'التصميم', description: 'متخصص في إنشاء مواقع ويب مذهلة وجذابة بصريًا وسهلة الاستخدام.', imageUrl: '/assets/services/design.svg' },
  { title: 'التطوير', description: 'أقدم خدمات تطوير ويب مخصصة تناسب احتياجاتك الخاصة كمحترف مستقل.', imageUrl: '/assets/services/developing.svg' },
];

const FALLBACKS = { fa: FALLBACK_SERVICES_FA, en: FALLBACK_SERVICES_EN, ar: FALLBACK_SERVICES_AR };

export default function Services() {
  const { t, i18n } = useTranslation();
  const fallback = FALLBACKS[i18n.language] || FALLBACK_SERVICES_FA;
  const [services, setServices] = useState(fallback);
  const currentServiceBG = useRef(null);

  useEffect(() => {
    setServices(fallback);
    fetch(`/api/services?lang=${i18n.language}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) setServices(data);
      })
      .catch(() => {});
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

  const imgs = ['support', 'design', 'developing'];

  return (
    <section id="services" className="section container">
      <h2 className="section__title">{t('services.title')}</h2>
      <div className="service-cards">
        {services.map((service, i) => (
          <article
            key={i}
            className="service-card__box"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <span className="service-card__illustration">
              <img
                src={service.imageUrl || `/assets/services/${imgs[i]}.svg`}
                alt={`${service.title} Illustration`}
              />
            </span>
            <h3 className="service-card__title">{service.title}</h3>
            <p className="service-card__msg">{service.description}</p>
            <span className="service-card__bg"></span>
          </article>
        ))}
      </div>
    </section>
  );
}
