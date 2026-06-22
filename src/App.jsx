import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import SweetScroll from 'sweet-scroll';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Works from './components/Works.jsx';
import Blog from './components/Blog.jsx';
import BlogPost from './components/BlogPost.jsx';
import Contact from './components/Contact.jsx';
import GitHubContributions from './components/GitHubContributions.jsx';
import Footer from './components/Footer.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import SeoHelmet from './components/SeoHelmet.jsx';

const SECTIONS = ['heroHeader', 'services', 'works', 'blog', 'contact'];
const BREAKPOINT = 576;

export default function App() {
  const [activeSection, setActiveSection] = useState('heroHeader');
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(
    window.location.hash === '#admin',
  );
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem('admin_token') || null,
  );
  const [blogSlug, setBlogSlug] = useState(() => {
    const match = window.location.hash.match(/^#blog\/(.+)$/);
    return match ? match[1] : null;
  });
  const [blogTag, setBlogTag] = useState(null);
  const [blogCategory, setBlogCategory] = useState(null);
  const [blogArchive, setBlogArchive] = useState(false);
  const { t } = useTranslation();
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

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const blogPostMatch = hash.match(/^#blog\/post\/(.+)$/);
      const blogTagMatch = hash.match(/^#blog\/tag\/(.+)$/);
      const blogCatMatch = hash.match(/^#blog\/category\/(.+)$/);
      const blogArchiveMatch = hash === '#blog/archive';

      setBlogTag(null);
      setBlogCategory(null);
      setBlogArchive(false);

      if (blogPostMatch) {
        setBlogSlug(blogPostMatch[1]);
        setAdminMode(false);
        window.scrollTo(0, 0);
      } else if (blogTagMatch) {
        setBlogSlug(null);
        setBlogTag(blogTagMatch[1]);
        setAdminMode(false);
        window.scrollTo(0, 0);
      } else if (blogCatMatch) {
        setBlogSlug(null);
        setBlogCategory(blogCatMatch[1]);
        setAdminMode(false);
        window.scrollTo(0, 0);
      } else if (blogArchiveMatch) {
        setBlogSlug(null);
        setBlogArchive(true);
        setAdminMode(false);
        window.scrollTo(0, 0);
      } else if (hash === '#admin') {
        setBlogSlug(null);
        setAdminMode(true);
      } else {
        setBlogSlug(null);
        setAdminMode(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleAdmin = () => {
    const next = !adminMode;
    setAdminMode(next);
    window.location.hash = next ? 'admin' : '';
    if (next) {
      const stored = localStorage.getItem('admin_token');
      if (stored && !adminToken) setAdminToken(stored);
    }
  };

  const handleViewPost = (slug) => {
    window.location.hash = `blog/post/${slug}`;
  };

  const handleBackToBlog = () => {
    window.location.hash = 'blog';
    setBlogSlug(null);
  };

  const isBlogView = blogSlug || blogTag || blogCategory || blogArchive;

  const sectionMeta = {
    heroHeader: { title: null, desc: null },
    services: { title: t('services.title'), desc: t('seo.description') },
    works: { title: t('works.title'), desc: t('seo.description') },
    blog: { title: t('blog.title'), desc: t('seo.description') },
    contact: { title: t('contact.title'), desc: t('seo.description') },
  };
  const currentMeta = sectionMeta[activeSection] || sectionMeta.heroHeader;

  return (
    <HelmetProvider>
      <SeoHelmet title={currentMeta.title} description={currentMeta.desc} />
      {!adminMode && !isBlogView && (
        <Navbar
          ref={navRef}
          activeSection={activeSection}
          menuOpen={menuOpen}
          toggleMenu={handleToggleMenu}
          onNavClick={handleNavClick}
        />
      )}
      <main>
        {adminMode ? (
          adminToken ? (
            <AdminDashboard token={adminToken} onLogout={() => { setAdminToken(null); localStorage.removeItem('admin_token'); }} />
          ) : (
            <AdminLogin onLogin={(token) => setAdminToken(token)} />
          )
        ) : blogSlug ? (
          <BlogPost slug={blogSlug} onBack={handleBackToBlog} />
        ) : blogTag || blogCategory || blogArchive ? (
          <Blog onViewPost={handleViewPost} filterTag={blogTag} filterCategory={blogCategory} />
        ) : (
          <>
            <Hero paddingTop={menuOpen ? 0 : undefined} navRef={navRef} />
            <Services />
            <Works />
            <Blog onViewPost={handleViewPost} />
            <Contact />
            <GitHubContributions />
          </>
        )}
      </main>
      <Footer adminMode={adminMode} toggleAdmin={toggleAdmin} />
    </HelmetProvider>
  );
}
