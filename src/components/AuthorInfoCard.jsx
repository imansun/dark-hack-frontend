const EnvelopeSvg = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const EllipsisHSvg = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
);

export default function AuthorInfoCard({ t, author = 'تراویس فولر', avatar = '/images/avatar/avatar-19.jpg', cover = '/images/objects/object-7.jpg', followers = '۱,۵۹۶', bio = 'طراح محصول حرفه‌ای و دوچرخه‌سوار آماتور ساکن نیویورک، آمریکا.' }) {
  const followLabel = t?.('authorInfo.follow') || 'دنبال کردن';
  const followersLabel = t?.('authorInfo.followers') || 'دنبال‌کننده';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      overflow: 'hidden',
    }} className="author-card">
      <div style={{
        height: 96, background: '#6366f1', overflow: 'hidden',
      }}>
        <img src={cover} alt="نویسنده" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      </div>
      <div className="author-info-body" style={{ padding: '8px 16px 20px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', marginTop: -48,
          border: '2px solid #fff', overflow: 'hidden', background: '#e2e8f0',
        }}>
          <img src={avatar} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
        <h3 style={{ paddingTop: 8, fontSize: '1.8rem', fontWeight: 500, color: '#1e293b' }}>{author}</h3>
        <p style={{ fontSize: '1.3rem', color: '#94a3b8' }}>
          {followers} {followersLabel}
        </p>
        <p style={{ marginTop: 12, fontSize: '1.4rem', color: '#64748b', lineHeight: 1.7 }}>
          {bio}
        </p>
        <div style={{ marginTop: 20, display: 'flex', gap: 4 }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: 28, borderRadius: 999, padding: '0 12px',
            background: '#e9eef5', color: '#0f172a', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            fontSize: '1.3rem', transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e9eef5'; }}
          >
            {followLabel}
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            background: '#e9eef5', color: '#0f172a', border: 'none', padding: 0, flexShrink: 0,
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e9eef5'; }}
            aria-label="ارسال پیام"
          >
            <EnvelopeSvg />
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            background: '#e9eef5', color: '#0f172a', border: 'none', padding: 0, flexShrink: 0,
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e9eef5'; }}
            aria-label="عملیات کاربر"
          >
            <EllipsisHSvg />
          </button>
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) { .author-info-body { padding: 8px 20px 20px !important; } }
        .dark .author-card { background: #1c1d21 !important; border-color: #232429 !important; }
        .dark .author-card h3 { color: #e6e7eb !important; }
        .dark .author-card p { color: #838794 !important; }
        .dark .author-card button { background: #232429 !important; color: #e6e7eb !important; }
        .dark .author-card button:hover { background: #2a2c32 !important; }
      `}</style>
    </div>
  );
}
