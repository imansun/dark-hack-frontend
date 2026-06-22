import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FALLBACK_FA = {
  name: 'هاکس',
  title: 'توسعه‌دهنده وب',
  subtitle: 'سلام! من یک',
  description: 'به عنوان یک توسعه‌دهنده فرانت‌اند، علاقه من به خلق تجربه‌های کاربری زیبا و بصری با استفاده از کدهای تمیز و کارآمد است.',
};

const FALLBACK_EN = {
  name: 'Hax',
  title: 'Web Developer',
  subtitle: 'Hello! I am a',
  description: 'As a front-end web developer, my passion lies in creating beautiful and intuitive user experiences through the use of clean and efficient code.',
};

const FALLBACK_AR = {
  name: 'هاكس',
  title: 'مطور ويب',
  subtitle: 'مرحباً! أنا',
  description: 'كمطور واجهات أمامية، شغفي هو إنشاء تجارب مستخدم جميلة وبديهية باستخدام كود نظيف وفعال.',
};

const FALLBACKS = { fa: FALLBACK_FA, en: FALLBACK_EN, ar: FALLBACK_AR };

export default function Hero({ navRef }) {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const lang = i18n.language;
    fetch(`/api/profile?lang=${lang}`)
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(FALLBACKS[lang] || FALLBACK_FA));
  }, [i18n.language]);

  const fb = FALLBACKS[i18n.language] || FALLBACK_FA;
  const p = profile || fb;

  return (
    <header id="heroHeader" className="hero-header">
      <section className="header__container container">
        <div className="header__left">
          <span className="header__sup-text">{p.subtitle}</span>
          <h1 className="header__title">
            <span className="header__title-1" data-role={p.title}>{p.title}</span>
          </h1>
          <p className="header__msg">{p.description}</p>
          {p.resumeUrl && (
            <a href={p.resumeUrl} className="header__resume" target="_blank" rel="noopener noreferrer">
              {t('hero.downloadResume')}
            </a>
          )}
        </div>
        <div className="header__right">
          <img src="/assets/illustrations/header.svg" alt={p.name} />
        </div>
      </section>
      <span className="header__bg"></span>
    </header>
  );
}
