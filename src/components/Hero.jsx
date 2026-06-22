import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TerminalHero from './TerminalHero.jsx';

export default function Hero({ navRef }) {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lang = i18n.language;
    fetch(`/api/profile?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [i18n.language]);

  return (
    <header id="heroHeader" className="hero-header">
      <section className="header__container container">
        <div className="header__left">
          {loading ? (
            <div style={{ marginTop: '3rem' }}>
              <div className="skeleton-line" style={{ width: '160px', height: '18px', marginBottom: '1rem' }} />
              <div className="skeleton-line" style={{ width: '280px', height: '42px', marginBottom: '1.2rem' }} />
              <div className="skeleton-line" style={{ width: '100%', maxWidth: '400px', height: '60px' }} />
            </div>
          ) : profile ? (
            <>
              <span className="header__sup-text">{profile.subtitle}</span>
              <h1 className="header__title">
                <span className="header__title-1" data-role={profile.title}>{profile.title}</span>
              </h1>
              <p className="header__msg">{profile.description}</p>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} className="header__resume" target="_blank" rel="noopener noreferrer">
                  {t('hero.downloadResume')}
                </a>
              )}
            </>
          ) : null}
        </div>
        <div className="header__right">
          <TerminalHero profile={profile} />
        </div>
      </section>
      <span className="header__bg"></span>
    </header>
  );
}
