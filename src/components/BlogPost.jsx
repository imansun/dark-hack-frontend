import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SeoHelmet from './SeoHelmet';
import TurnstileWidget from './TurnstileWidget';
import { useToast } from './Toast';
import PostDetailHeader from './PostDetailHeader';
import PostDetailContent from './PostDetailContent';
import PostDetailFooter from './PostDetailFooter';
import RecentArticlesList from './RecentArticlesList';
import AuthorInfoCard from './AuthorInfoCard';
import AuthorPostsList from './AuthorPostsList';
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
const MailIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>);
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

export default function BlogPost({ slug, onBack }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
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

  useEffect(() => { if (post && contentRef.current) Prism.highlightAllUnder(contentRef.current); }, [post]);

  const processedContent = useMemo(() => addHeadingIds(post?.content), [post?.content]);

  const handleScroll = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = `${docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0}%`;
    setShowBackTop(scrollTop > 600);
  }, []);

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

  const readTime = readingTime(post.content);
  const words = wordCount(post.content);
  const pubDate = formatDate(post.createdAt, i18n.language);
  const updDate = formatDate(post.updatedAt, i18n.language);
  const pageUrl = `https://imannorouzi.ir/#blog/post/${post.slug}`;
  const minRead = `${readTime} ${t('blog.readingTime')}`;

  return (
    <>
      <div className="article-progress" ref={progressRef} />
      <SeoHelmet title={post.title} description={post.excerpt || post.content?.slice(0, 160)} image={post.imageUrl} url={pageUrl} type="article" />

      <article className="article">
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
                author={post.author || post.authorName || 'نویسنده'}
                avatar={post.authorAvatar || '/images/avatar/avatar-19.jpg'}
                username={post.author || '@author'}
                date={pubDate}
                readTime={minRead}
              />
              <PostDetailContent contentHtml={processedContent || ''} />
              <PostDetailFooter likes={post.likes ?? 0} comments={post.commentCount ?? 0} />
            </div>

            <div ref={contentRef} style={{ display: 'none' }} />

            <RecentArticlesList t={t} />

            <div className="article-body" style={{ maxWidth: 'none', padding: '0 0 24px' }}>
              <Comments postId={post.id} t={t} i18n={i18n} />
              <Newsletter t={t} i18n={i18n} />
            </div>
          </div>

          <div style={{ gridColumn: 'span 12', paddingTop: 24, paddingBottom: 24 }} className="post-detail-sidebar">
            <div style={{ position: 'sticky', top: 80 }}>
              <AuthorInfoCard t={t} author={post.author} />
              <AuthorPostsList t={t} authorName={post.author} />
            </div>
          </div>
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

        <style>{`
        .article-progress { position: fixed; top: 0; left: 0; height: 3px; background: #6366f1; z-index: 9999; transition: width 0.1s; }
        .article-loading { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .skeleton-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #e9eef5 25%, #f1f5f9 50%, #e9eef5 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s infinite; }
        @keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .article-error { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 48px 24px; margin: 24px 0; text-align: center; color: #475569; font-size: 1.6rem; }
        .article-error button { margin-top: 8px; }
        .article-comments { margin-top: 32px; }
        .article-comments__title { display: flex; align-items: center; gap: 8px; font-size: 2rem; font-weight: 600; color: #0f172a; margin-bottom: 24px; }
        .article-comments__count { display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 28px; border-radius: 999px; background: #e9eef5; color: #475569; font-size: 1.2rem; font-weight: 600; padding: 0 8px; }
        .article-comments__empty { color: #94a3b8; font-size: 1.4rem; text-align: center; padding: 32px 0; }
        .article-comment { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid #e2e8f0; }
        .article-comment:first-of-type { padding-top: 0; }
        .article-comment:last-of-type { border-bottom: none; }
        .article-comment__avatar { width: 40px; height: 40px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.4rem; flex-shrink: 0; }
        .article-comment__body { flex: 1; min-width: 0; }
        .article-comment__head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .article-comment__name { font-weight: 600; color: #1e293b; font-size: 1.4rem; }
        .article-comment__date { color: #94a3b8; font-size: 1.2rem; }
        .article-comment__body p { color: #475569; font-size: 1.4rem; line-height: 1.7; }
        .article-comments__form { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
        .article-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: #1e293b; font-family: inherit; font-size: 1.4rem; transition: border-color 0.15s; outline: none; }
        .article-input:focus { border-color: #6366f1; }
        .article-input::placeholder { color: #94a3b8; }
        .article-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 20px; border: none; border-radius: 8px; background: #f1f5f9; color: #475569; font-family: inherit; font-size: 1.4rem; font-weight: 500; cursor: pointer; transition: background 0.15s, opacity 0.15s; }
        .article-btn:hover { background: #e2e8f0; }
        .article-btn--primary { background: #6366f1; color: #fff; }
        .article-btn--primary:hover { background: #4f46e5; }
        .article-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .article-newsletter { margin-top: 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; display: flex; gap: 16px; align-items: flex-start; }
        .article-newsletter__icon { width: 48px; height: 48px; border-radius: 12px; background: #eef2ff; color: #6366f1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .article-newsletter__body { flex: 1; }
        .article-newsletter__title { font-size: 1.8rem; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .article-newsletter__desc { color: #64748b; font-size: 1.4rem; margin-bottom: 16px; }
        .article-newsletter__form { display: flex; flex-direction: column; gap: 12px; }
        .article-related { margin-top: 40px; }
        .article-related__title { font-size: 2rem; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
        .article-related__grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .article-related__card { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; cursor: pointer; text-align: left; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .article-related__card:hover { border-color: #6366f1; }
        .article-related__img { width: 100%; height: 180px; overflow: hidden; }
        .article-related__img img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
        .article-related__body { padding: 16px; }
        .article-related__card-title { font-size: 1.6rem; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        .article-related__excerpt { color: #64748b; font-size: 1.3rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
        .article-related__tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .article-related__tag { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #eef2ff; color: #6366f1; font-size: 1.1rem; font-weight: 500; }
        .article-back-top { position: fixed; bottom: 24px; right: 24px; width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 1px solid #e2e8f0; color: #6366f1; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 100; transition: box-shadow 0.15s; }
        .article-back-top:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
        @media (min-width: 640px) { .article-related__grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) {
          .post-detail-grid { gap: 24px; }
          .post-detail-main { grid-column: span 8 !important; padding-bottom: 24px !important; }
          .post-detail-sidebar { grid-column: 9 / 13 !important; align-self: start !important; }
          .post-detail-card { padding: 24px !important; }
        }
        .dark .post-detail-card { background: #1c1d21 !important; border-color: #232429 !important; }
        .dark .article-loading { background: #1c1d21; border-color: #232429; }
        .dark .skeleton-line { background: linear-gradient(90deg, #2a2c32 25%, #384766 50%, #2a2c32 75%); background-size: 200% 100%; }
        .dark .article-error { background: #1c1d21; border-color: #232429; color: #b7bac4; }
        .dark .article-comments__title { color: #e6e7eb; }
        .dark .article-comments__count { background: #2a2c32; color: #b7bac4; }
        .dark .article-comments__empty { color: #838794; }
        .dark .article-comment { border-bottom-color: #232429; }
        .dark .article-comment__name { color: #d0d2db; }
        .dark .article-comment__date { color: #838794; }
        .dark .article-comment__body p { color: #b7bac4; }
        .dark .article-input { background: #15161a; border-color: #2a2c32; color: #d0d2db; }
        .dark .article-input:focus { border-color: #818cf8; }
        .dark .article-input::placeholder { color: #838794; }
        .dark .article-btn { background: #232429; color: #b7bac4; }
        .dark .article-btn:hover { background: #2a2c32; }
        .dark .article-btn--primary { background: #818cf8; color: #fff; }
        .dark .article-btn--primary:hover { background: #6366f1; }
        .dark .article-newsletter { background: #1c1d21; border-color: #232429; }
        .dark .article-newsletter__icon { background: #232429; color: #818cf8; }
        .dark .article-newsletter__title { color: #e6e7eb; }
        .dark .article-newsletter__desc { color: #838794; }
        .dark .article-related__title { color: #e6e7eb; }
        .dark .article-related__card { background: #1c1d21; border-color: #232429; }
        .dark .article-related__card:hover { border-color: #818cf8; }
        .dark .article-related__card-title { color: #d0d2db; }
        .dark .article-related__excerpt { color: #838794; }
        .dark .article-related__tag { background: #232429; color: #818cf8; }
        .dark .article-back-top { background: #1c1d21; color: #818cf8; border-color: #232429; box-shadow: none; }
        .dark .article-back-top:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
      `}</style>
    </>
  );
}
