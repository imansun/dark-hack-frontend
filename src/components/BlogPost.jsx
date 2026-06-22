import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SeoHelmet from './SeoHelmet';
import 'prismjs/themes/prism-okaidia.css';
import Prism from 'prismjs';

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

const BOOKMARKS_KEY = 'blog_bookmarks';

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); } catch { return []; }
}

function toggleBookmark(slug) {
  const list = getBookmarks();
  const idx = list.indexOf(slug);
  if (idx > -1) list.splice(idx, 1);
  else list.push(slug);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  return list;
}

function ShareButtons({ url, title, lang }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const platforms = [
    { name: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: '#1DA1F2', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { name: 'LinkedIn', href: `https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: '#0A66C2', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, color: '#0088cc', path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
  ];

  return (
    <div className="blog-post__share">
      <span>{'اشتراک‌گذاری'}:</span>
      {platforms.map((p) => (
        <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${p.name}`} className="blog-post__share-link" style={{ '--share-color': p.color }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={p.color}>
            <path d={p.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function Comments({ postId, t, i18n }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/api/comments/post/${postId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setSending(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content, postId }),
      });
      setSent(true);
      setAuthor('');
      setContent('');
    } catch {}
    setSending(false);
  };

  if (sending) {
    return (
      <div className="blog-post__comments">
        <h3>دیدگاه‌ها</h3>
        <p style={{ color: '#688277' }}>در حال ارسال...</p>
      </div>
    );
  }

  return (
    <div className="blog-post__comments">
      <h3>دیدگاه‌ها ({comments.length})</h3>
      {comments.length > 0 ? (
        <div className="blog-post__comments-list">
          {comments.map((c) => (
            <div key={c.id} className="blog-post__comment">
              <strong>{c.author}</strong>
              <span className="blog-post__comment-date">{formatDate(c.createdAt, i18n.language)}</span>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666' }}>هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!</p>
      )}

      {sent ? (
        <p style={{ color: '#00FF94', marginTop: '2rem' }}>دیدگاه شما پس از تأیید نمایش داده خواهد شد.</p>
      ) : (
        <form className="blog-post__comment-form" onSubmit={handleSubmit}>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="نام شما" required className="blog-post__comment-input" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="دیدگاه شما..." required rows={4} className="blog-post__comment-input" />
          <button type="submit" className="blog-post__comment-btn">ارسال دیدگاه</button>
        </form>
      )}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus('success');
      else if (res.status === 409) setStatus('exists');
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="blog-post__newsletter">
      <h3>عضویت در خبرنامه</h3>
      <p>با عضویت در خبرنامه، از آخرین مقالات مطلع شوید.</p>
      {status === 'success' ? (
        <p style={{ color: '#00FF94' }}>با موفقیت عضو شدید!</p>
      ) : status === 'exists' ? (
        <p style={{ color: '#FFA500' }}>این ایمیل قبلاً ثبت شده است.</p>
      ) : (
        <form onSubmit={handleSubmit} className="blog-post__newsletter-form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل شما" required className="blog-post__newsletter-input" />
          <button type="submit" className="blog-post__newsletter-btn">{status === 'sending' ? '...' : 'عضویت'}</button>
        </form>
      )}
      {status === 'error' && <p style={{ color: '#ff6b6b' }}>خطا در ثبت. دوباره تلاش کنید.</p>}
    </div>
  );
}

export default function BlogPost({ slug, onBack }) {
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [codeTheme, setCodeTheme] = useState('dark');
  const contentRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/posts/${slug}?lang=${i18n.language}`)
      .then((r) => {
        if (!r.ok) throw new Error(t('blog.notFound'));
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setBookmarked(getBookmarks().includes(slug));
        fetch(`/api/posts/${data.id}/related?lang=${i18n.language}`)
          .then((r) => r.json())
          .then(setRelated)
          .catch(() => {});
        fetch(`/api/posts/${data.id}/views`, { method: 'POST' }).catch(() => {});
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [slug, i18n.language, t]);

  useEffect(() => {
    if (post && contentRef.current) {
      Prism.highlightAllUnder(contentRef.current);
    }
  }, [post]);

  const handleScroll = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    el.style.width = `${Math.min(progress, 100)}%`;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading) {
    return (
      <section className="section container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#688277', fontSize: '1.6rem' }}>{t('blog.loading')}</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="section container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <p style={{ color: '#ff6b6b', fontSize: '1.6rem' }}>{error || t('blog.notFound')}</p>
        <button onClick={onBack} className="blog-post__back">{t('blog.backToList')}</button>
      </section>
    );
  }

  const minRead = readingTime(post.content);
  const pubDate = formatDate(post.createdAt, i18n.language);
  const updDate = formatDate(post.updatedAt, i18n.language);
  const pageUrl = `https://imannorouzi.ir/#blog/${post.slug}`;

  return (
    <>
      <div className="blog-post__progress" ref={progressRef} />
      <SeoHelmet title={post.title} description={post.excerpt || post.content?.slice(0, 160)} image={post.imageUrl} url={pageUrl} type="article" />
      <article className="blog-post section container">
        <div className="blog-post__top-bar">
          <button onClick={onBack} className="blog-post__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
              <polyline points={i18n.language === 'fa' || i18n.language === 'ar' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
            </svg>
            {t('blog.backToList')}
          </button>
          <button
            onClick={() => { const list = toggleBookmark(post.slug); setBookmarked(list.includes(post.slug)); }}
            className={`blog-post__bookmark${bookmarked ? ' blog-post__bookmark--active' : ''}`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? '#00FF94' : 'none'} stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <header className="blog-post__header">
          {post.tags && (
            <div className="blog-post__tags">
              {post.tags.split(',').map((tag, i) => (
                <span key={i} className="blog-post__tag">{tag.trim()}</span>
              ))}
            </div>
          )}
          <h1 className="blog-post__title">{post.title}</h1>
          <div className="blog-post__meta">
            <span className="blog-post__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {t('blog.publishedOn')} {pubDate}
            </span>
            <span className="blog-post__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {minRead} {t('blog.readingTime')}
            </span>
            {post.views > 0 && (
              <span className="blog-post__meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {post.views} بازدید
              </span>
            )}
            {updDate !== pubDate && (
              <span className="blog-post__meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                {t('blog.updatedOn')} {updDate}
              </span>
            )}
          </div>
        </header>

        {post.imageUrl && (
          <div className="blog-post__cover">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}

        <div className="blog-post__code-theme">
          <button onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')} className="blog-post__code-theme-btn">
            {codeTheme === 'dark' ? '⚪ تم روشن برای کدها' : '⚫ تم تاریک برای کدها'}
          </button>
        </div>

        <div
          ref={contentRef}
          className={`blog-post__content${codeTheme === 'light' ? ' blog-post__content--code-light' : ''}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <ShareButtons url={pageUrl} title={post.title} lang={i18n.language} />

        <Comments postId={post.id} t={t} i18n={i18n} />

        <Newsletter />

        {related.length > 0 && (
          <div className="blog-post__related">
            <h2 className="blog-post__related-title">{t('blog.relatedPosts')}</h2>
            <div className="blog-post__related-grid">
              {related.map((rp) => (
                <button key={rp.id} onClick={() => { window.location.hash = `blog/${rp.slug}`; setPost(null); setLoading(true); }} className="blog-post__related-card">
                  {rp.imageUrl && (
                    <div className="blog-post__related-img">
                      <img src={rp.imageUrl} alt={rp.title} />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 className="blog-post__related-card-title">{rp.title}</h3>
                    {rp.excerpt && <p className="blog-post__related-card-excerpt">{rp.excerpt}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
