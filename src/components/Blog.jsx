import { useEffect, useState, useCallback } from 'react';
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

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function SkeletonCard() {
  return (
    <div className="blog__skeleton-card">
      <div className="blog__skeleton-img" />
      <div className="blog__skeleton-body">
        <div className="blog__skeleton-line blog__skeleton-line--short" />
        <div className="blog__skeleton-line blog__skeleton-line--long" />
        <div className="blog__skeleton-line blog__skeleton-line--medium" />
        <div className="blog__skeleton-line blog__skeleton-line--short" />
      </div>
    </div>
  );
}

export default function Blog({ onViewPost, filterTag, filterCategory }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState(filterTag || '');
  const [selectedCategory, setSelectedCategory] = useState(filterCategory || '');

  useEffect(() => {
    fetch(`/api/categories?lang=${i18n.language}`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [i18n.language]);

  useEffect(() => {
    if (filterTag !== undefined) setSelectedTag(filterTag);
    if (filterCategory !== undefined) setSelectedCategory(filterCategory);
  }, [filterTag, filterCategory]);

  const fetchPosts = useCallback((page, searchTerm, tag, category) => {
    setLoading(true);
    const params = new URLSearchParams({
      lang: i18n.language,
      page: String(page),
      limit: String(POSTS_PER_PAGE),
    });
    if (searchTerm) params.set('search', searchTerm);
    if (tag) params.set('tag', tag);
    if (category) params.set('category', category);
    fetch(`/api/posts?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json();
      })
      .then((data) => {
        setPosts(data.posts || data);
        setTotal(data.total ?? (Array.isArray(data) ? data.length : 0));
        setTotalPages(data.totalPages ?? 1);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  useEffect(() => {
    fetchPosts(currentPage, search, selectedTag, selectedCategory);
  }, [currentPage, search, selectedTag, selectedCategory, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      clearSearch();
      return;
    }
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(selectedCategory === slug ? '' : slug);
    setCurrentPage(1);
  };

  const allTags = [...new Set(posts.flatMap((p) => (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean)))];

  const hasFilters = search || selectedTag || selectedCategory;

  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <section id="blog" className="section container">
      <h2 className="section__title">{t('blog.title')}</h2>

      <div className="blog__toolbar">
        <form className="blog__search" onSubmit={handleSearch}>
          <span className="blog__search-icon"><SearchIcon /></span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={isRtl ? 'جستجو در مقالات...' : 'Search articles...'}
            className="blog__search-input"
          />
          {searchInput && (
            <button type="button" className="blog__search-clear" onClick={() => setSearchInput('')} aria-label="Clear search">
              <XIcon />
            </button>
          )}
        </form>

        <a href="/api/posts/rss" target="_blank" rel="noopener noreferrer" className="blog__rss-link" title="RSS Feed">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6600"><circle cx="6" cy="18" r="3" /><path d="M4 11a9 9 0 0 1 9 9" fill="none" stroke="#FF6600" strokeWidth="2" /><path d="M4 4a16 16 0 0 1 16 16" fill="none" stroke="#FF6600" strokeWidth="2" /></svg>
          RSS
        </a>
      </div>

      {categories.length > 0 && (
        <div className="blog__filters">
          <button
            onClick={() => handleCategorySelect('')}
            className={`blog__filter-chip${!selectedCategory ? ' blog__filter-chip--active' : ''}`}
          >
            {isRtl ? 'همه' : 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`blog__filter-chip${selectedCategory === cat.slug ? ' blog__filter-chip--active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="blog__filters blog__filters--tags">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`blog__filter-chip blog__filter-chip--tag${selectedTag === tag ? ' blog__filter-chip--active' : ''}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="blog__skeleton">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="blog__loading">
          <p style={{ color: '#ff6b6b' }}>{t('blog.error')}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="blog__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <p>{t('blog.empty')}</p>
        </div>
      ) : (
        <>
          <div className="blog__results">
            {hasFilters ? (
              <>{total} <strong>{isRtl ? 'نتیجه' : 'result'}{total !== 1 ? 's' : ''}</strong>{search ? <> <em>·</em> &ldquo;{search}&rdquo;</> : ''}</>
            ) : (
              <>{isRtl ? 'آخرین' : 'Latest'} <strong>{total}</strong> {isRtl ? 'مقاله' : 'articles'}</>
            )}
          </div>
          <div className="blog">
            {posts.map((post, index) => {
              const minRead = readingTime(post.content);
              const pubDate = formatDate(post.createdAt, i18n.language);
              const isFeatured = index === 0 && currentPage === 1 && !hasFilters;
              return (
                <article key={post.id} className={`blog__card${isFeatured ? ' blog__card--featured' : ''}`}>
                  {post.imageUrl && (
                    <div className="blog__card-img">
                      <img src={post.imageUrl} alt={post.title} loading="lazy" />
                      {post.category && (
                        <span className="blog__card-category">{post.category.name}</span>
                      )}
                    </div>
                  )}
                  <div className="blog__card-body">
                    <div className="blog__card-meta">
                      <span className="blog__card-date"><CalendarIcon /> {pubDate}</span>
                      <span className="blog__card-reading"><ClockIcon /> {minRead} {t('blog.readingTime')}</span>
                      {post.views > 0 && (
                        <span className="blog__card-views"><EyeIcon /> {post.views.toLocaleString()}</span>
                      )}
                    </div>
                    <h3 className="blog__card-title">{post.title}</h3>
                    {post.excerpt && <p className="blog__card-excerpt">{post.excerpt}</p>}
                    {post.tags && (
                      <div className="blog__card-tags">
                        {post.tags.split(',').map((tag, i) => (
                          <span key={i} className="blog__card-tag">#{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="blog__card-footer">
                      <button className="blog__card-btn" onClick={() => onViewPost(post.slug)}>
                        {t('blog.readMore')} <ArrowIcon />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="blog__pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="blog__page-btn" aria-label="Previous page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points={isRtl ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
                </svg>
              </button>
              {start > 1 && <span className="blog__page-ellipsis">...</span>}
              {pageNumbers.map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`blog__page-btn${page === currentPage ? ' blog__page-btn--active' : ''}`}>{page}</button>
              ))}
              {end < totalPages && <span className="blog__page-ellipsis">...</span>}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="blog__page-btn" aria-label="Next page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points={isRtl ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
