import { forwardRef, useRef } from 'react';

const LINKS = [
  { id: 'heroHeader', label: '<Home />' },
  { id: 'services', label: '<Services />' },
  { id: 'works', label: '<Works />' },
  { id: 'contact', label: '<Contact />' },
];

const Navbar = forwardRef(function Navbar({ activeSection, menuOpen, toggleMenu, onNavClick }, ref) {
  const listRef = useRef(null);

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
        </ul>
      </div>
    </nav>
  );
});

export default Navbar;
