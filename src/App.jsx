import { useState, useEffect, useRef } from 'react';
import SweetScroll from 'sweet-scroll';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Works from './components/Works.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const SECTIONS = ['heroHeader', 'services', 'works', 'contact'];
const BREAKPOINT = 576;

export default function App() {
  const [activeSection, setActiveSection] = useState('heroHeader');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const sweetScrollRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    sweetScrollRef.current = new SweetScroll({
      trigger: '.nav__list-link',
      easing: 'easeOutQuint',
      offset: nav.getBoundingClientRect().height - 80,
    });

    return () => {
      if (sweetScrollRef.current) {
        sweetScrollRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navBarHeight = navRef.current?.getBoundingClientRect().height || 0;
      SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - navBarHeight) {
            setActiveSection(id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resetActiveState = () => {
    setMenuOpen(false);
    document.body.style.overflowY = null;
  };

  const addPaddingToHeroHeader = () => {
    const nav = navRef.current;
    const hero = document.getElementById('heroHeader');
    if (!nav || !hero) return;
    if (menuOpen) return;
    const heightInRem = nav.getBoundingClientRect().height / 10;
    hero.style.paddingTop = heightInRem + 'rem';
  };

  useEffect(() => {
    addPaddingToHeroHeader();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      addPaddingToHeroHeader();
      if (window.innerWidth >= BREAKPOINT) {
        addPaddingToHeroHeader();
        resetActiveState();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  const handleNavClick = (id) => {
    resetActiveState();
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        document.body.style.overflowY = 'hidden';
      } else {
        document.body.style.overflowY = null;
      }
      return next;
    });
  };

  return (
    <>
      <Navbar
        ref={navRef}
        activeSection={activeSection}
        menuOpen={menuOpen}
        toggleMenu={handleToggleMenu}
        onNavClick={handleNavClick}
      />
      <main>
        <Hero paddingTop={menuOpen ? 0 : undefined} navRef={navRef} />
        <Services />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
