import { useState, useRef, useEffect } from 'react';

const BookmarkSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const TwitterSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z" />
  </svg>
);

const LinkedinSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const FacebookSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const EllipsisHSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
);

function ActionMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = ['عملیات', 'عملیات دیگر', 'سایر عملیات', 'عملیات جداگانه'];
  const lastSeparator = 2;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', marginRight: -6 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: 'pointer', color: '#334155', padding: 0, flexShrink: 0,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        aria-label="Actions"
      >
        <EllipsisHSvg />
      </button>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 100, marginTop: 6, minWidth: 160,
          borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff',
          padding: '4px 0',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
          right: 0,
          opacity: 1, transform: 'translateY(0)',
          transition: 'opacity 0.15s, transform 0.15s',
        }}>
          {menuItems.map((label, i) => (
            <div key={i}>
              {i === lastSeparator + 1 && (
                <div style={{ margin: '6px 12px', height: 1, background: '#e9eef5' }} />
              )}
              <button
                style={{
                  display: 'flex', alignItems: 'center', width: '100%', height: 36,
                  padding: '0 12px', background: 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '1.3rem', textAlign: 'left', color: '#1e293b',
                  letterSpacing: '0.025em', outline: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                onClick={() => setOpen(false)}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Flat neutral button style
const flatBtn = (hover) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: 'none',
  background: hover ? 'rgba(203,213,225,0.2)' : 'transparent',
  cursor: 'pointer',
  color: '#334155',
  padding: 0,
  flexShrink: 0,
  transition: 'background 0.15s',
});

export default function PostDetailHeader({ author = 'تراویس فولر', avatar = '/images/avatar/avatar-19.jpg', username = '@travisfuller', date = '۵ تیر ۱۴۰۱', readTime = '۸ دقیقه مطالعه' }) {
  const [avatarHover, setAvatarHover] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    const node = avatarRef.current;
    if (!node) return;
    const onEnter = () => setAvatarHover(true);
    const onLeave = () => setAvatarHover(false);
    node.addEventListener('mouseenter', onEnter);
    node.addEventListener('mouseleave', onLeave);
    return () => { node.removeEventListener('mouseenter', onEnter); node.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div ref={avatarRef} style={{ position: 'relative' }}>
            <div style={{
              width: 48, height: 48,
              background: '#cbd5e1',
              maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none' viewbox='0 0 200 200'%3E%3Cpath fill='%23000' d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3E%3C/svg%3E\")",
              maskPosition: 'center', maskRepeat: 'no-repeat', maskSize: 'contain',
              WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none' viewbox='0 0 200 200'%3E%3Cpath fill='%23000' d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3E%3C/svg%3E\")",
              WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', WebkitMaskSize: 'contain',
            }}>
              <img src={avatar} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>

            <div style={{
              position: 'absolute', zIndex: 100, paddingTop: 6,
              left: '50%', transform: avatarHover ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
              top: '100%',
              opacity: avatarHover ? 1 : 0,
              pointerEvents: avatarHover ? 'auto' : 'none',
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            }}>
              <div style={{
                width: 192, display: 'flex', flexDirection: 'column', alignItems: 'center',
                borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff',
                padding: 12, textAlign: 'center',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
              }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: '#cbd5e1' }}>
                  <img src={avatar} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                </div>
                <p style={{ marginTop: 8, fontWeight: 500, color: '#1e293b', fontSize: '1.4rem', letterSpacing: '0.025em' }}>{author}</p>
                <a
                  href="##"
                  style={{
                    fontSize: '1.2rem', color: '#334155', textDecoration: 'none', marginTop: 2,
                    letterSpacing: '0.025em', transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
                >{username}</a>
                <div style={{ marginTop: 16 }}>
                  <button style={{
                    height: 24, borderRadius: 999, padding: '0 12px', border: 'none',
                    background: '#6366f1', color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600,
                  }}>دنبال کردن</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <a href="##" style={{
              fontWeight: 500, fontSize: '1.6rem',
              color: '#334155', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
            >{author}</a>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', fontSize: '1.2rem', color: '#94a3b8' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{date}</span>
              <div style={{ margin: '0 8px', marginTop: 2, marginBottom: 2, width: 1, height: 14, background: '#e2e8f0', flexShrink: 0 }}></div>
              <span style={{ flexShrink: 0 }}>{readTime}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div className="post-social-desktop" style={{ display: 'flex' }}>
            <button style={flatBtn(false)}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
            ><BookmarkSvg /></button>
            <button style={flatBtn(false)}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
            ><TwitterSvg /></button>
            <button style={flatBtn(false)}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
            ><LinkedinSvg /></button>
            <button style={flatBtn(false)}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
            ><InstagramSvg /></button>
            <button style={flatBtn(false)}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
            ><FacebookSvg /></button>
          </div>
          <ActionMenu />
        </div>
      </div>

      <div className="post-social-mobile" style={{ marginTop: 24, display: 'none', alignItems: 'center', gap: 12 }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 16px',
          borderRadius: 999, border: '1px solid #cbd5e1', background: 'transparent',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.2rem',
          color: '#0f172a', transition: 'background 0.15s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <BookmarkSvg /> <span>ذخیره</span>
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <button style={flatBtn(false)}
            onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
            onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
          ><BookmarkSvg /></button>
          <button style={flatBtn(false)}
            onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
            onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
          ><TwitterSvg /></button>
          <button style={flatBtn(false)}
            onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
            onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
          ><LinkedinSvg /></button>
          <button style={flatBtn(false)}
            onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
            onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
          ><InstagramSvg /></button>
          <button style={flatBtn(false)}
            onMouseEnter={(e) => { Object.assign(e.currentTarget.style, flatBtn(true)); }}
            onMouseLeave={(e) => { Object.assign(e.currentTarget.style, flatBtn(false)); }}
          ><FacebookSvg /></button>
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .post-social-desktop { display: none !important; }
          .post-social-mobile { display: flex !important; }
        }
        .dark .post-social-desktop button { color: #d0d2db !important; }
        .dark .post-social-desktop button:hover { background: rgba(56,58,65,0.1) !important; }
        .dark .post-social-mobile button { border-color: #383a41 !important; color: #e6e7eb !important; }
        .dark .post-social-mobile button:hover { background: rgba(56,58,65,0.2) !important; }
        .dark [style*="background: #6366f1"] { background: #818cf8 !important; }
      `}</style>
    </div>
  );
}
