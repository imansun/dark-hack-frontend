import '../styles/post-detail.css';

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
    <div style={{ marginTop: 20 }}>
      <p className="pd-section-title" style={{ textTransform: 'none', letterSpacing: 0 }}>{title}</p>
      <div className="pd-author-posts">
        {posts.map((post) => (
          <div key={post.uid} className="pd-author-post-item">
            <div className="pd-author-post-content">
              <p className="pd-article-date" style={{ fontWeight: 500, color: '#1e293b', marginBottom: 4 }}>{post.created_at}</p>
              <div className="pd-author-post-title"><a href="##">{post.title}</a></div>
              <div className="pd-article-footer" style={{ marginTop: 8 }}>
                <p className="pd-article-date" style={{ fontWeight: 500 }}>{post.readTime}</p>
                <div className="pd-article-actions">
                  <button className="pd-btn-icon-28"><EllipsisHSvg /></button>
                  <button className="pd-btn-icon-28"><BookmarkSvg /></button>
                </div>
              </div>
            </div>
            <img src={post.cover} alt={post.title} style={{ width: 96, height: 96, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
