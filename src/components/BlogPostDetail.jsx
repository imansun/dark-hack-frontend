import PostDetailHeader from './PostDetailHeader';
import PostDetailContent from './PostDetailContent';
import PostDetailFooter from './PostDetailFooter';
import RecentArticlesList from './RecentArticlesList';
import AuthorInfoCard from './AuthorInfoCard';
import AuthorPostsList from './AuthorPostsList';

export default function BlogPostDetail({ post, t, i18n }) {
  const isRtl = i18n?.language === 'fa' || i18n?.language === 'ar';
  const readTime = post?.content ? Math.ceil(post.content.trim().split(/\s+/).length / 200) : 0;
  const dateStr = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      width: '100%',
      paddingLeft: 'var(--margin-x, 16px)',
      paddingRight: 'var(--margin-x, 16px)',
    }} className="post-detail-grid">
      <div style={{ gridColumn: 'span 12', paddingTop: 24 }} className="post-detail-main">
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: 16,
        }} className="post-detail-card">
          <PostDetailHeader
            author={post?.author || 'نویسنده'}
            avatar={post?.authorAvatar || '/images/avatar/avatar-19.jpg'}
            username={post?.author || '@author'}
            date={dateStr}
            readTime={`${readTime} ${t?.('blog.readingTime') || 'min read'}`}
          />
          <PostDetailContent contentHtml={post?.content || ''} />
          <PostDetailFooter
            likes={post?.likes ?? 0}
            comments={post?.commentCount ?? 0}
          />
        </div>
        <RecentArticlesList t={t} />
      </div>
      <div style={{ gridColumn: 'span 12', paddingTop: 24, paddingBottom: 24 }} className="post-detail-sidebar">
        <div style={{ position: 'sticky', top: 80 }}>
          <AuthorInfoCard t={t} />
          <AuthorPostsList t={t} authorName={post?.author} />
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .post-detail-grid { gap: 24px; }
          .post-detail-main { grid-column: span 8 !important; padding-bottom: 24px !important; }
          .post-detail-sidebar { grid-column: 9 / 13 !important; align-self: start !important; }
          .post-detail-card { padding: 24px !important; }
        }
        .dark .post-detail-card { background: #1c1d21 !important; border-color: #232429 !important; }
      `}</style>
    </div>
  );
}
