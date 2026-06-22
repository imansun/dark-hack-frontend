import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const POSTS_PER_PAGE = 6;

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const locales = { fa: 'fa-IR', en: 'en-US', ar: 'ar-SA' };
  return d.toLocaleDateString(locales[lang] || 'fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function readingTime(text) {
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

export default function Blog({ onViewPost }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`/api/posts?lang=${i18n.language}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json();
      })
      .then((data) => { setPosts(data); setCurrentPage(1); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  if (loading) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <div className="blog__loading">
          <p>{t('blog.loading')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <div className="blog__loading">
          <p style={{ color: '#ff6b6b' }}>{t('blog.error')}</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="section container">
        <h2 className="section__title">{t('blog.title')}</h2>
        <div className="blog__empty">
          <p>{t('blog.empty')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section container">
      <h2 className="section__title">{t('blog.title')}</h2>
      <div className="blog">
        {paginatedPosts.map((post) => {
          const minRead = readingTime(post.content);
          const pubDate = formatDate(post.createdAt, i18n.language);
          return (
            <article key={post.id} className="blog__card">
              {post.imageUrl && (
                <div className="blog__card-img">
                  <img src={post.imageUrl} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="blog__card-body">
                <div className="blog__card-meta">
                  <span className="blog__card-date">{pubDate}</span>
                  <span className="blog__card-reading">{minRead} {t('blog.readingTime')}</span>
                </div>
                <h3 className="blog__card-title">{post.title}</h3>
                {post.excerpt && <p className="blog__card-excerpt">{post.excerpt}</p>}
                {post.tags && (
                  <div className="blog__card-tags">
                    {post.tags.split(',').map((tag, i) => (
                      <span key={i} className="blog__card-tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <button
                  className="blog__card-btn"
                  onClick={() => {
                    if (onViewPost) onViewPost(post.slug);
                    else window.location.hash = `blog/${post.slug}`;
                  }}
                >
                  {t('blog.readMore')}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="blog__pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="blog__page-btn"
            aria-label="Previous page"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={i18n.language === 'fa' || i18n.language === 'ar' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`blog__page-btn${page === currentPage ? ' blog__page-btn--active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="blog__page-btn"
            aria-label="Next page"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={i18n.language === 'fa' || i18n.language === 'ar' ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
