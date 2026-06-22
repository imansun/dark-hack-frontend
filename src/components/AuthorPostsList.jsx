const BookmarkSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const EllipsisHSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
);

const posts = [
  { uid: '1', title: 'Tailwind CSS چیست؟', cover: '/images/objects/object-1.jpg', readTime: '۲ دقیقه مطالعه', created_at: '۱۵ آبان' },
  { uid: '2', title: 'برترین سیستم‌های طراحی', cover: '/images/objects/object-15.jpg', readTime: '۵ دقیقه مطالعه', created_at: '۲۱ مهر' },
  { uid: '3', title: '۱۰ نکته برای بهتر کردن دوربین خوب', cover: '/images/objects/object-17.jpg', readTime: '۷ دقیقه مطالعه', created_at: '۳۰ مهر' },
  { uid: '4', title: '۲۵ حقیقت شگفت‌انگیز درباره صندلی', cover: '/images/objects/object-19.jpg', readTime: '۴ دقیقه مطالعه', created_at: '۱۰ آبان' },
];

export default function AuthorPostsList({ t, authorName = 'تراویس فولر' }) {
  const title = t?.('authorPosts.title', { author: authorName }) || `مطالب بیشتر از ${authorName}`;

  return (
    <div style={{ marginTop: 20 }} className="author-posts">
      <p style={{
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 8,
        fontSize: '1.6rem',
        color: '#1e293b',
        fontWeight: 500,
      }}>
        {title}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, marginTop: 12 }}>
        {posts.map((post) => (
          <div key={post.uid} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, flex: 1 }}>
              <div>
                <p style={{ fontSize: '1.2rem', fontWeight: 500, color: '#1e293b', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.created_at}
                </p>
                <div style={{ marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  <a href="##" style={{
                    fontWeight: 500, color: '#334155', textDecoration: 'none',
                    fontSize: '1.6rem', lineHeight: 1.5, transition: 'color 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
                  >
                    {post.title}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.readTime}
                </p>
                <div style={{ display: 'flex' }}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%', border: 'none',
                    background: 'transparent', cursor: 'pointer', color: '#334155', padding: 0, flexShrink: 0,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  ><EllipsisHSvg /></button>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%', border: 'none',
                    background: 'transparent', cursor: 'pointer', color: '#334155', padding: 0, flexShrink: 0,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  ><BookmarkSvg /></button>
                </div>
              </div>
            </div>
            <img src={post.cover} alt={post.title} style={{
              width: 96, height: 96, borderRadius: 10,
              objectFit: 'cover', objectPosition: 'center', flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
      <style>{`
        .dark .author-posts p { color: #d0d2db !important; }
        .dark .author-posts p[style*="border-bottom"] { border-bottom-color: #232429 !important; }
        .dark .author-posts a { color: #d0d2db !important; }
        .dark .author-posts a:hover { color: #818cf8 !important; }
        .dark .author-posts button { color: #d0d2db !important; }
        .dark .author-posts button:hover { background: rgba(56,58,65,0.1) !important; }
      `}</style>
    </div>
  );
}
