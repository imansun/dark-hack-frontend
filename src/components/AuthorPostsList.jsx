import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuthorPostsList({ onViewPost }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/posts?lang=${i18n.language}&page=1&limit=5`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || data))
      .catch(() => {});
  }, [i18n.language]);

  if (!posts.length) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#688277', marginBottom: '1rem' }}>
        {t('authorPosts.title', { author: '' }) || 'مقالات'}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onViewPost(post.slug)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit' }}
          >
            <div style={{ fontSize: '1.3rem', fontWeight: 500, color: '#fff', marginBottom: '0.2rem' }}>{post.title}</div>
            <div style={{ fontSize: '1.1rem', color: '#688277' }}>{post.excerpt?.slice(0, 80)}...</div>
          </button>
        ))}
      </div>
    </div>
  );
}
