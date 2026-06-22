import { useState, useRef, useEffect } from 'react';
import '../styles/post-detail.css';

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
    <div ref={ref} className={`pd-action-menu${open ? ' open' : ''}`}>
      <button onClick={() => setOpen(!open)} className="pd-action-btn" aria-label="Actions">
        <EllipsisVSvg />
      </button>
      <div className="pd-action-menu-items">
        {menuItems.map((label, i) => (
          <button key={i} className="pd-action-menu-item" onClick={() => setOpen(false)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function PostCard({ cover, category, title, description, author, created_at }) {
  return (
    <div className="pd-article-card">
      <img className="pd-article-thumb" src={cover} alt={title} />
      <div className="pd-article-content">
        <div className="pd-article-footer" style={{ marginBottom: 4 }}>
          <a href="##" className="pd-article-category">{category}</a>
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="pd-btn-icon-28"><BookmarkSvg /></button>
            <ActionMenu />
          </div>
        </div>
        <h3 className="pd-article-title"><a href="##">{title}</a></h3>
        <p className="pd-article-description">{description}</p>
        <div className="pd-article-footer" style={{ marginTop: 12 }}>
          <a href="##" className="pd-article-date" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
              <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span>{author.name}</span>
          </a>
          <span className="pd-article-date">{created_at}</span>
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
        <p className="pd-section-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none', textTransform: 'none', letterSpacing: 0, fontSize: '1.8rem', fontWeight: 500, color: '#1e293b' }}>{title}</p>
        <a href="##" className="pd-view-all" style={{ marginTop: 0, borderBottom: '1px dotted currentColor', paddingBottom: 2 }}>{viewAll}</a>
      </div>
      <div className="pd-articles-grid" style={{ marginTop: 12 }}>
        {articles.map((a) => (
          <PostCard key={a.uid} {...a} />
        ))}
      </div>
    </div>
  );
}
