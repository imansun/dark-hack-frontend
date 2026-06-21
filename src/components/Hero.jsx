import { useEffect, useState } from 'react';

export default function Hero({ navRef }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile({
        name: 'Hax',
        title: 'Web Developer',
        subtitle: 'Hello There! I am a',
        description: 'As a front-end web developer, my passion lies in creating beautiful and intuitive user experiences through the use of clean and efficient code.',
      }));
  }, []);

  return (
    <header id="heroHeader" className="hero-header">
      <section className="header__container container">
        <div className="header__left">
          <span className="header__sup-text">{profile?.subtitle || 'Hello There! I am a'}</span>
          <h1 className="header__title">
            <span className="header__title-1" data-role="WEB">Web</span>
            <span className="header__title-2" data-role="DEVELOPER">Developer</span>
          </h1>
          <p className="header__msg">
            {profile?.description || 'As a front-end web developer, my passion lies in creating beautiful and intuitive user experiences through the use of clean and efficient code.'}
          </p>
          <a href="#" className="header__resume">Resume</a>
        </div>
        <div className="header__right">
          <img src="/assets/illustrations/header.svg" alt="Header section illustration" />
        </div>
      </section>
      <span className="header__bg"></span>
    </header>
  );
}
