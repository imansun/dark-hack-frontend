import '../styles/post-detail.css';

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
    <div className="pd-card" style={{ overflow: 'hidden' }}>
      <div className="pd-card-cover">
        <img src={cover} alt="نویسنده" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      </div>
      <div className="pd-author-card-body">
        <div className="pd-avatar-lg" style={{ borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0' }}>
          <img src={avatar} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
        <h3 className="pd-author-name-lg">{author}</h3>
        <p className="pd-author-stats">{followers} {followersLabel}</p>
        <p className="pd-author-bio">{bio}</p>
        <div className="pd-author-social">
          <button className="pd-btn-filled" style={{ borderRadius: 999, height: 28, padding: '0 12px', fontSize: '1.3rem' }}>{followLabel}</button>
          <button className="pd-btn-icon-28" style={{ background: '#e9eef5', color: '#0f172a' }} aria-label="ارسال پیام"><EnvelopeSvg /></button>
          <button className="pd-btn-icon-28" style={{ background: '#e9eef5', color: '#0f172a' }} aria-label="عملیات کاربر"><EllipsisHSvg /></button>
        </div>
      </div>
    </div>
  );
}
