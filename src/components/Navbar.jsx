import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const Navbar = forwardRef(function Navbar({ activeSection, menuOpen, toggleMenu, onNavClick }, ref) {
  const { t } = useTranslation();
  const listRef = useRef(null);

  const LINKS = [
    { id: 'heroHeader', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'works', label: t('nav.works') },
    { id: 'blog', label: t('nav.blog') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleLinkClick = (e, id) => {
    onNavClick(id);
    e.currentTarget.blur();
  };

  return (
    <nav id="navBar" ref={ref} className="nav">
      <div className="container">
        <button type="button" id="hamburgerBtn" className="nav__hamburger-btn" onClick={toggleMenu}>
          <span className="nav__hamburger-top"></span>
          <span className="nav__hamburger-center"></span>
          <span className="nav__hamburger-bottom"></span>
        </button>
        <ul
          id="navList"
          ref={listRef}
          className={`nav__list${menuOpen ? ' nav--active' : ''}`}
          style={menuOpen ? { height: '100vh' } : {}}
        >
          {LINKS.map((link) => (
            <li key={link.id} className="nav__list-item">
              <a
                className={`nav__list-link${activeSection === link.id ? ' active' : ''}`}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="nav__list-item nav__list-item--lang">
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
});

export default Navbar;
