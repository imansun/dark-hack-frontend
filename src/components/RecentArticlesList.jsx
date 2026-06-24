import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function RecentArticlesList({ onViewPost }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/posts?lang=${i18n.language}&page=1&limit=4`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || data))
      .catch(() => {});
  }, [i18n.language]);

  if (!posts.length) return null;

  return (
    <div style={{ marginTop: '4rem' }}>
      <h2 className="pd-related-title">
        {t('recentArticles.title') || 'مقالات اخیر'}
        <span>({posts.length})</span>
      </h2>
      <div className="pd-related-grid">
        {posts.map((post) => (
          <div key={post.id} className="pd-related-card" onClick={() => onViewPost(post.slug)}>
            <div className="pd-related-info">
              <h3 className="pd-related-card-title">{post.title}</h3>
              {post.excerpt && <p className="pd-related-card-desc">{post.excerpt}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
