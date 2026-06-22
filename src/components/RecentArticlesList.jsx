import { useState, useRef, useEffect } from 'react';

const BookmarkSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const EllipsisVSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);

const articles = [
  { uid: '1', cover: '/images/objects/object-6.jpg', category: 'فریم‌ورک‌ها', title: 'Tailwind CSS چیست؟', description: 'Tailwind CSS یک فریم‌ورک CSS کاربردی است که به شما اجازه می‌دهد به سرعت رابط‌های کاربری مدرن و واکنش‌گرا بسازید.', author: { avatar: '/images/avatar/avatar-10.jpg', name: 'جان دو' }, created_at: '۲ تیر ۱۴۰۰' },
  { uid: '2', cover: '/images/objects/object-3.jpg', category: 'فریم‌ورک‌ها', title: 'نمونه کارت با Tailwind CSS', description: 'در این مقاله با نحوه ساخت کارت‌های زیبا و واکنش‌گرا با استفاده از Tailwind CSS آشنا می‌شوید.', author: { avatar: '/images/avatar/avatar-2.jpg', name: 'کانر گوزمان' }, created_at: '۴ خرداد ۱۴۰۰' },
  { uid: '3', cover: '/images/objects/object-4.jpg', category: 'زبان‌های برنامه‌نویسی', title: 'PHP چیست؟', description: 'PHP یک زبان برنامه‌نویسی سمت سرور است که برای توسعه وب و ساخت سایت‌های پویا استفاده می‌شود.', author: { avatar: '/images/avatar/avatar-1.jpg', name: 'تراویس فولر' }, created_at: '۲۳ اسفند ۱۴۰۰' },
  { uid: '4', cover: '/images/objects/object-7.jpg', category: 'رابط کاربری/تجربه کاربری', title: 'برترین سیستم‌های طراحی', description: 'در این مطلب با بهترین سیستم‌های طراحی و مزایای استفاده از آن‌ها در پروژه‌های بزرگ آشنا می‌شوید.', author: { avatar: '/images/avatar/avatar-20.jpg', name: 'آلفردو الیوت' }, created_at: '۳۰ خرداد ۱۴۰۱' },
];

function ActionMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = ['عملیات', 'عملیات دیگر', 'عملیات جداگانه'];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32, borderRadius: '50%', border: 'none',
        background: 'transparent', cursor: 'pointer', color: '#334155', padding: 0, flexShrink: 0,
        transition: 'background 0.15s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        aria-label="Actions"
      >
        <EllipsisVSvg />
      </button>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 100, marginTop: 6, minWidth: 160,
          borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff',
          padding: '4px 0',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
          right: 0,
        }}>
          {menuItems.map((label, i) => (
            <button key={i} style={{
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
            >{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ cover, category, title, description, author, created_at }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', background: '#fff',
      border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden',
    }} className="recent-card">
      <div style={{ position: 'relative', height: 192, width: '100%', flexShrink: 0 }}>
        <img src={cover} alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          className="recent-card-img"
        />
        <a href="##" style={{ position: 'absolute', inset: 0, opacity: 0 }} aria-hidden="true">{title}</a>
      </div>
      <div style={{ display: 'flex', width: '100%', flex: 1, flexDirection: 'column', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -8, marginRight: -6 }}>
          <a href="##" style={{ fontSize: '1.3rem', color: '#0284c7', textDecoration: 'none', fontWeight: 500 }}>{category}</a>
          <div style={{ display: 'flex', marginRight: -6 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              background: 'transparent', cursor: 'pointer', color: '#334155', padding: 0, flexShrink: 0,
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            ><BookmarkSvg /></button>
            <ActionMenu />
          </div>
        </div>
        <div>
          <a href="##" style={{
            fontWeight: 500, color: '#334155', textDecoration: 'none', fontSize: '1.8rem', lineHeight: 1.4,
            transition: 'color 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
          >
            {title}
          </a>
        </div>
        <p style={{
          marginTop: 4, fontSize: '1.4rem', color: '#64748b', lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {description}
        </p>
        <div style={{ marginTop: 16, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}>
            <a href="##" style={{
              display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', textDecoration: 'none', minWidth: 0,
              transition: 'color 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#1e293b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100, minWidth: 0 }}>{author.name}</span>
            </a>
            <div style={{ margin: '0 12px', width: 1, height: 16, background: '#e2e8f0', flexShrink: 0 }} className="recent-card-sep"></div>
            <span style={{ flexShrink: 0, color: '#94a3b8' }} className="recent-card-date">{created_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentArticlesList({ t }) {
  const title = t?.('recentArticles.title') || 'مقالات اخیر';
  const viewAll = t?.('recentArticles.viewAll') || 'مشاهده همه';

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '1.8rem', fontWeight: 500, color: '#1e293b' }}>{title}</p>
        <a href="##" style={{
          fontSize: '1.3rem', color: '#4f46e5', textDecoration: 'none',
          borderBottom: '1px dotted currentColor', paddingBottom: 2,
          fontWeight: 500, outline: 'none',
          transition: 'color 0.3s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(79,70,229,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
        >{viewAll}</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 12 }} className="recent-grid">
        {articles.map((a) => (
          <PostCard key={a.uid} {...a} />
        ))}
      </div>
      <style>{`
        @media (min-width: 640px) { .recent-grid { grid-template-columns: 1fr 1fr; gap: 20px; } }
        @media (min-width: 1024px) { .recent-grid { grid-template-columns: 1fr; gap: 24px; } }
        @media (min-width: 1024px) {
          .recent-card { flex-direction: row; }
          .recent-card > div:first-child { height: auto !important; width: 192px !important; }
          .recent-card-img { border-radius: 10px 0 0 10px !important; }
        }
        .dark .recent-card { background: #1c1d21 !important; border-color: #232429 !important; }
        .dark .recent-card a { color: #d0d2db !important; }
        .dark .recent-card a:hover { color: #818cf8 !important; }
        .dark .recent-card p { color: #838794 !important; }
        .dark .recent-card [style*="background: #e2e8f0"] { background: #232429 !important; }
        .dark .recent-card [style*="color: #0284c7"] { color: #38bdf8 !important; }
        .dark .recent-card [style*="color: #1e293b"] { color: #e6e7eb !important; }
        .dark .recent-card button { color: #d0d2db !important; }
        .dark .recent-card button:hover { background: rgba(56,58,65,0.1) !important; }
        .dark .recent-card-sep { background: #232429 !important; }
        .dark .recent-card-date { color: #838794 !important; }
      `}</style>
    </div>
  );
}
