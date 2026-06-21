import { useEffect, useState, useRef, useCallback } from 'react';

const FALLBACK_SERVICES = [
  { title: 'Deployment', description: 'I am always available to address any issues or concerns you may have.', imageUrl: '/assets/services/support.svg' },
  { title: 'Design', description: 'Specialized in creating stunning websites that are both visually appealing and user-friendly.', imageUrl: '/assets/services/design.svg' },
  { title: 'Developing', description: 'I offer custom web development services tailored to your specific needs as a solo professional.', imageUrl: '/assets/services/developing.svg' },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const currentServiceBG = useRef(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) setServices(data);
      })
      .catch(() => {});
  }, []);

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
      <h2 className="section__title">Services</h2>
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
