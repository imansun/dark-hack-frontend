import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SeoHelmet from './SeoHelmet';
import TurnstileWidget from './TurnstileWidget';
import { useToast } from './Toast';
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

function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
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

const CalIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
const ClockIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const EyeIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
const RefreshIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>);
const ArrowBack = ({ rtl }) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={rtl ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} /></svg>);
const BookmarkIcon = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#00FF94' : 'none'} stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>);
const MailIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>);
const ArrowUpIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>);

function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    headings.push({ level, text, id: `h-${headings.length}` });
  }
  return headings;
}

function addHeadingIds(html) {
  if (!html) return '';
  let idx = 0;
  return html.replace(/<h([23])(\s[^>]*)?>/gi, (match) => {
    return match.includes('id=') ? match : match.replace('>', ` id="h-${idx++}">`);
  });
}

function Comments({ postId, t, i18n }) {
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const { success: toastSuccess, error: toastError } = useToast();
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const turnstileRef = useRef(null);

  useEffect(() => {
    fetch(`/api/comments/post/${postId}`).then((r) => r.json()).then(setComments).catch(() => {});
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || sending) return;
    setSending(true);
    const token = await turnstileRef.current?.execute();
    if (!token) { setSending(false); toastError(isRtl ? 'خطا در تأیید امنیتی. دوباره تلاش کنید.' : 'Security verification failed. Try again.'); return; }
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content, postId, turnstileToken: token }),
      });
      if (res.ok) {
        toastSuccess(isRtl ? 'دیدگاه شما پس از تأیید نمایش داده می‌شود.' : 'Your comment will appear after approval.');
        setAuthor('');
        setContent('');
      } else {
        toastError(isRtl ? 'خطا در ارسال دیدگاه.' : 'Failed to post comment.');
      }
    } catch {
      toastError(isRtl ? 'خطا در ارسال دیدگاه.' : 'Failed to post comment.');
    }
    setSending(false);
  };

  return (
    <section className="article-comments">
      <h2 className="article-comments__title">
        {isRtl ? 'دیدگاه‌ها' : 'Comments'}
        <span className="article-comments__count">{comments.length}</span>
      </h2>

      {comments.length > 0 ? (
        <div className="article-comments__list">
          {comments.map((c) => (
            <div key={c.id} className="article-comment">
              <div className="article-comment__avatar">{c.author.charAt(0).toUpperCase()}</div>
              <div className="article-comment__body">
                <div className="article-comment__head">
                  <span className="article-comment__name">{c.author}</span>
                  <span className="article-comment__date">{formatDate(c.createdAt, i18n.language)}</span>
                </div>
                <p>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="article-comments__empty">{isRtl ? 'هنوز دیدگاهی ثبت نشده. اولین نفر باشید!' : 'No comments yet. Be the first!'}</p>
      )}

      <form className="article-comments__form" onSubmit={handleSubmit}>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={isRtl ? 'نام شما' : 'Your name'} required className="article-input" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={isRtl ? 'دیدگاه شما...' : 'Write your comment...'} required rows={4} className="article-input" />
        <TurnstileWidget ref={turnstileRef} />
        <button type="submit" className="article-btn article-btn--primary" disabled={sending}>
          {sending ? (isRtl ? 'در حال ارسال...' : 'Sending...') : (isRtl ? 'ارسال دیدگاه' : 'Post Comment')}
        </button>
      </form>
    </section>
  );
}

function Newsletter({ t, i18n }) {
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const { success: toastSuccess, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const turnstileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    const token = await turnstileRef.current?.execute();
    if (!token) { setSending(false); toastError(isRtl ? 'خطا در تأیید امنیتی. دوباره تلاش کنید.' : 'Security verification failed. Try again.'); return; }
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: token }),
      });
      if (res.ok) {
        toastSuccess(isRtl ? 'با موفقیت عضو شدید!' : 'Successfully subscribed!');
        setEmail('');
      } else if (res.status === 409) {
        toastError(isRtl ? 'این ایمیل قبلاً ثبت شده است.' : 'This email is already subscribed.');
      } else {
        toastError(isRtl ? 'خطا در ثبت. دوباره تلاش کنید.' : 'Something went wrong. Try again.');
      }
    } catch {
      toastError(isRtl ? 'خطا در ثبت. دوباره تلاش کنید.' : 'Something went wrong. Try again.');
    }
    setSending(false);
  };

  return (
    <section className="article-newsletter">
      <div className="article-newsletter__icon"><MailIcon /></div>
      <div className="article-newsletter__body">
        <h2 className="article-newsletter__title">{isRtl ? 'عضویت در خبرنامه' : 'Subscribe to Newsletter'}</h2>
        <p className="article-newsletter__desc">{isRtl ? 'با عضویت در خبرنامه، از آخرین مقالات مطلع شوید.' : 'Get notified about new articles straight to your inbox.'}</p>
        <form onSubmit={handleSubmit} className="article-newsletter__form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isRtl ? 'ایمیل شما' : 'Your email'} required className="article-input" />
          <TurnstileWidget ref={turnstileRef} />
          <button type="submit" className="article-btn article-btn--primary" disabled={sending}>
            {sending ? '...' : (isRtl ? 'عضویت' : 'Subscribe')}
          </button>
        </form>
      </div>
    </section>
  );
}

function AuthorBox({ t, i18n }) {
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  return (
    <div className="article-author">
      <div className="article-author__avatar">IN</div>
      <div className="article-author__info">
        <strong className="article-author__name">Iman Norouzi Esfajir</strong>
        <p className="article-author__bio">{isRtl ? 'متخصص هوش مصنوعی، معمار نرم‌افزار و امنیت سامانه‌های آنلاین' : 'AI Specialist, Software Architect, Online Systems Security Expert'}</p>
        <a href="https://github.com/ImanNorouziEsfajir" target="_blank" rel="noopener noreferrer" className="article-author__link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#888"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  );
}

function TOC({ headings, activeId, onNav, isRtl }) {
  if (headings.length < 2) return null;
  return (
    <nav className="article-toc">
      <span className="article-toc__title">{isRtl ? 'فهرست مطالب' : 'Table of Contents'}</span>
      <ul className="article-toc__list">
        {headings.map((h) => (
          <li key={h.id} className={`article-toc__item article-toc__item--h${h.level}${activeId === h.id ? ' article-toc__item--active' : ''}`}>
            <a href={`#${h.id}`} onClick={(e) => { e.preventDefault(); const el = document.getElementById(h.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function BlogPost({ slug, onBack }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [codeTheme, setCodeTheme] = useState('dark');
  const [activeHeading, setActiveHeading] = useState(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setError(null);
    fetch(`/api/posts/${slug}?lang=${i18n.language}`)
      .then((r) => { if (!r.ok) throw new Error(t('blog.notFound')); return r.json(); })
      .then((data) => {
        setPost(data);
        setBookmarked(getBookmarks().includes(slug));
        fetch(`/api/posts/${data.id}/related?lang=${i18n.language}`).then((r) => r.json()).then(setRelated).catch(() => {});
        fetch(`/api/posts/${data.id}/views`, { method: 'POST' }).catch(() => {});
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [slug, i18n.language, t]);

  useEffect(() => { if (post && contentRef.current) Prism.highlightAllUnder(contentRef.current); }, [post, codeTheme]);

  const headings = useMemo(() => extractHeadings(post?.content), [post?.content]);
  const processedContent = useMemo(() => addHeadingIds(post?.content), [post?.content]);

  const handleScroll = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = `${docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0}%`;
    setShowBackTop(scrollTop > 600);
    for (let i = headings.length - 1; i >= 0; i--) {
      const el2 = document.getElementById(headings[i].id);
      if (el2 && el2.getBoundingClientRect().top <= 150) { setActiveHeading(headings[i].id); return; }
    }
    setActiveHeading(null);
  }, [headings]);

  useEffect(() => { window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, [handleScroll]);

  if (loading) {
    return (
      <div className="article-loading">
        <div className="skeleton-line" style={{ width: '60%', height: '32px', marginBottom: '3rem' }} />
        <div className="skeleton-line" style={{ width: '80%', height: '40px', marginBottom: '2rem' }} />
        <div className="skeleton-line" style={{ width: '40%', height: '16px', marginBottom: '2rem' }} />
        <div className="skeleton-line" style={{ width: '100%', height: '300px', borderRadius: '12px', marginBottom: '2rem' }} />
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <div className="skeleton-line" style={{ width: `${85 - i * 8}%`, height: '14px', marginBottom: '0.5rem' }} />
            <div className="skeleton-line" style={{ width: `${70 - i * 8}%`, height: '14px', marginBottom: '0.5rem' }} />
            <div className="skeleton-line" style={{ width: `${55 - i * 8}%`, height: '14px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="article-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p>{error || t('blog.notFound')}</p>
        <button onClick={onBack} className="article-btn">{t('blog.backToList')}</button>
      </div>
    );
  }

  const minRead = readingTime(post.content);
  const words = wordCount(post.content);
  const pubDate = formatDate(post.createdAt, i18n.language);
  const updDate = formatDate(post.updatedAt, i18n.language);
  const pageUrl = `https://imannorouzi.ir/#blog/post/${post.slug}`;

  return (
    <>
      <div className="article-progress" ref={progressRef} />
      <SeoHelmet title={post.title} description={post.excerpt || post.content?.slice(0, 160)} image={post.imageUrl} url={pageUrl} type="article" />

      <article className="article">
        <header className="article-hero">
          <div className="article-hero__bg" />
          <div className="article-hero__inner">
            <div className="article-hero__top">
              <button onClick={onBack} className="article-hero__back">
                <ArrowBack rtl={isRtl} /> {t('blog.backToList')}
              </button>
              <button
                onClick={() => { const list = toggleBookmark(post.slug); setBookmarked(list.includes(post.slug)); }}
                className={`article-hero__bookmark${bookmarked ? ' article-hero__bookmark--on' : ''}`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <BookmarkIcon filled={bookmarked} />
              </button>
            </div>
            {post.category && <span className="article-hero__category">{post.category.name}</span>}
            <h1 className="article-hero__title">{post.title}</h1>
            <div className="article-hero__meta">
              <span><CalIcon /> {pubDate}</span>
              <span><ClockIcon /> {minRead} {t('blog.readingTime')}</span>
              <span>{words.toLocaleString()} {isRtl ? 'کلمه' : 'words'}</span>
              {post.views > 0 && <span><EyeIcon /> {post.views.toLocaleString()} {isRtl ? 'بازدید' : 'views'}</span>}
              {updDate !== pubDate && <span><RefreshIcon /> {t('blog.updatedOn')} {updDate}</span>}
            </div>
            {post.tags && (
              <div className="article-hero__tags">
                {post.tags.split(',').map((tag, i) => <span key={i} className="article-hero__tag">#{tag.trim()}</span>)}
              </div>
            )}
          </div>
        </header>

        <div className="article-body">
          {post.imageUrl && (
            <figure className="article-cover">
              <img src={post.imageUrl} alt={post.title} />
            </figure>
          )}

          <div className="article-toolbar">
            <div className="article-toolbar__actions">
              <button
                onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')}
                className="article-toolbar__btn"
                title={codeTheme === 'dark' ? (isRtl ? 'تم روشن' : 'Light theme') : (isRtl ? 'تم تاریک' : 'Dark theme')}
              >
                {codeTheme === 'dark' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                )}
              </button>
              {headings.length >= 2 && (
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className={`article-toolbar__btn${tocOpen ? ' article-toolbar__btn--active' : ''}`}
                  title={isRtl ? 'فهرست مطالب' : 'Table of Contents'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>

          {tocOpen && headings.length >= 2 && (
            <div className="article-toc-panel">
              <TOC headings={headings} activeId={activeHeading} isRtl={isRtl} />
            </div>
          )}

          <div ref={contentRef} className={`article-content${codeTheme === 'light' ? ' article-content--code-light' : ''}`} dangerouslySetInnerHTML={{ __html: processedContent }} />

          <AuthorBox t={t} i18n={i18n} />
          <Comments postId={post.id} t={t} i18n={i18n} />
          <Newsletter t={t} i18n={i18n} />
        </div>

        {related.length > 0 && (
          <section className="article-related">
            <h2 className="article-related__title">{isRtl ? 'مطالب مرتبط' : 'Related Posts'}</h2>
            <div className="article-related__grid">
              {related.map((rp) => (
                <button key={rp.id} onClick={() => { window.location.hash = `blog/post/${rp.slug}`; window.scrollTo(0, 0); }} className="article-related__card">
                  {rp.imageUrl && (
                    <div className="article-related__img"><img src={rp.imageUrl} alt={rp.title} /></div>
                  )}
                  <div className="article-related__body">
                    <h3 className="article-related__card-title">{rp.title}</h3>
                    {rp.excerpt && <p className="article-related__excerpt">{rp.excerpt}</p>}
                    {rp.tags && (
                      <div className="article-related__tags">
                        {rp.tags.split(',').slice(0, 3).map((tag, i) => <span key={i} className="article-related__tag">#{tag.trim()}</span>)}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </article>

      {showBackTop && <button className="article-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUpIcon /></button>}
    </>
  );
}
