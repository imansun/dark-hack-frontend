import { useEffect, useState } from 'react';

const FALLBACK_WORKS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: 'My Landing Page',
  imageUrl: '/assets/works/sample.png',
  badges: [{ name: 'HTML' }, { name: 'CSS' }, { name: 'JavaScript' }],
}));

export default function Works() {
  const [works, setWorks] = useState(FALLBACK_WORKS);

  useEffect(() => {
    fetch('/api/works')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) setWorks(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="works" className="section container">
      <h2 className="section__title">My Works</h2>
      <div className="works">
        {works.map((work, i) => (
          <article key={work.id} className="work">
            <div className="work__box">
              <span className="work__img-box">
                <img src={work.imageUrl || '/assets/works/sample.png'} alt={`My Work ${i + 1}`} />
              </span>
              <h3 className="work__title">{work.title}</h3>
              <span className="work__badges">
                {(work.badges || []).map((badge, j) => (
                  <span key={j} className="work__badge">{badge.name}</span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
