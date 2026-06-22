import '../styles/post-detail.css';
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
    <div className="pd-grid">
      <div className="pd-main" style={{ paddingTop: 24 }}>
        <div className="pd-card pd-card-body">
          <PostDetailHeader
            author={post?.author || 'نویسنده'}
            avatar={post?.authorAvatar || '/images/avatar/avatar-19.jpg'}
            username={post?.author || '@author'}
            date={dateStr}
            readTime={`${readTime} ${t?.('blog.readingTime') || 'min read'}`}
          />
          <PostDetailContent contentHtml={post?.content || ''} />
          <PostDetailFooter likes={post?.likes ?? 0} comments={post?.commentCount ?? 0} />
        </div>
        <RecentArticlesList t={t} />
      </div>
      <div className="pd-sidebar" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="pd-sticky">
          <AuthorInfoCard t={t} />
          <AuthorPostsList t={t} authorName={post?.author} />
        </div>
      </div>
    </div>
  );
}
