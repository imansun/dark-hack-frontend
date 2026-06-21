import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/posts?lang=${i18n.language}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json();
      })
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  if (loading) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <p style={{ marginTop: '5rem', color: '#688277' }}>{t('blog.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <p style={{ marginTop: '5rem', color: '#ff6b6b' }}>{t('blog.error')}</p>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <p style={{ marginTop: '5rem', color: '#688277' }}>{t('blog.empty')}</p>
      </section>
    );
  }

  return (
    <section id="blog" className="section container">
      <h2 className="section__title">{t('blog.title')}</h2>
      <div style={{
        marginTop: '8rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        width: '100%',
        maxWidth: '800px',
      }}>
        {posts.map((post) => (
          <article key={post.id} style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #2a2a2a',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00FF94'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
          >
            {post.imageUrl && (
              <div style={{ width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
            <div style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.4 }}>
                {post.title}
              </h3>
              {post.excerpt && (
                <p style={{ color: '#999', fontSize: '1.4rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  {post.excerpt}
                </p>
              )}
              <div style={{ color: '#ccc', fontSize: '1.4rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {post.content?.length > 300 ? `${post.content.slice(0, 300)}...` : post.content}
              </div>
              {post.tags && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {post.tags.split(',').map((tag, i) => (
                    <span key={i} style={{
                      background: 'rgba(0,255,148,0.1)',
                      color: '#00FF94',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '4px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}>{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
