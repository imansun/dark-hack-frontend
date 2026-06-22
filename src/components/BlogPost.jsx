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
import '../styles/post-detail.css';

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
    <section className="pd-comments">
      <h2 className="pd-comments-title">
        {isRtl ? 'دیدگاه‌ها' : 'Comments'}
        <span className="pd-comments-count">{comments.length}</span>
      </h2>

      {comments.length > 0 ? (
        <div>
          {comments.map((c) => (
            <div key={c.id} className="pd-comment">
              <div className="pd-comment-avatar" style={{ background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.4rem' }}>{c.author.charAt(0).toUpperCase()}</div>
              <div className="pd-comment-body">
                <div className="pd-comment-head">
                  <span className="pd-comment-author">{c.author}</span>
                  <span className="pd-comment-date">{formatDate(c.createdAt, i18n.language)}</span>
                </div>
                <p className="pd-comment-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pd-comments-empty">{isRtl ? 'هنوز دیدگاهی ثبت نشده. اولین نفر باشید!' : 'No comments yet. Be the first!'}</p>
      )}

      <form className="pd-comments-form" onSubmit={handleSubmit}>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={isRtl ? 'نام شما' : 'Your name'} required className="pd-newsletter-input" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={isRtl ? 'دیدگاه شما...' : 'Write your comment...'} required rows={4} className="pd-newsletter-input" style={{ resize: 'vertical' }} />
        <TurnstileWidget ref={turnstileRef} />
        <button type="submit" className="pd-error-btn" disabled={sending}>
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
    <section className="pd-newsletter">
      <div className="pd-newsletter-icon"><MailIcon /></div>
      <div className="pd-newsletter-body">
        <h2 className="pd-newsletter-title">{isRtl ? 'عضویت در خبرنامه' : 'Subscribe to Newsletter'}</h2>
        <p className="pd-newsletter-text">{isRtl ? 'با عضویت در خبرنامه، از آخرین مقالات مطلع شوید.' : 'Get notified about new articles straight to your inbox.'}</p>
        <form className="pd-newsletter-form" onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isRtl ? 'ایمیل شما' : 'Your email'} required className="pd-newsletter-input" />
          <TurnstileWidget ref={turnstileRef} />
          <button type="submit" className="pd-newsletter-submit" disabled={sending}>
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
      <div className="pd-loading-card">
        <div className="pd-skeleton" style={{ width: '60%', height: 32, marginBottom: '3rem' }} />
        <div className="pd-skeleton" style={{ width: '80%', height: 40, marginBottom: '2rem' }} />
        <div className="pd-skeleton" style={{ width: '40%', height: 16, marginBottom: '2rem' }} />
        <div className="pd-skeleton" style={{ width: '100%', height: 300, marginBottom: '2rem' }} />
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <div className="pd-skeleton" style={{ width: `${85 - i * 8}%`, height: 14, marginBottom: '0.5rem' }} />
            <div className="pd-skeleton" style={{ width: `${70 - i * 8}%`, height: 14, marginBottom: '0.5rem' }} />
            <div className="pd-skeleton" style={{ width: `${55 - i * 8}%`, height: 14 }} />
          </div>
        ))}
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pd-loading-card pd-error" style={{ minHeight: 0, padding: '48px 24px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p className="pd-error-message" style={{ maxWidth: 'none' }}>{error || t('blog.notFound')}</p>
        <button onClick={onBack} className="pd-error-btn">{t('blog.backToList')}</button>
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
      <div className="pd-progress"><div className="pd-progress-bar" ref={progressRef} /></div>
      <SeoHelmet title={post.title} description={post.excerpt || post.content?.slice(0, 160)} image={post.imageUrl} url={pageUrl} type="article" />

      <article>
        <div className="pd-grid" style={{ paddingTop: 24 }}>
          <div className="pd-main">
            <div className="pd-card pd-card-body" style={{ paddingBottom: 16 }}>
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

            <div style={{ maxWidth: 'none', padding: '0 0 24px' }}>
              <Comments postId={post.id} t={t} i18n={i18n} />
              <Newsletter t={t} i18n={i18n} />
            </div>
          </div>

          <div className="pd-sidebar" style={{ paddingBottom: 24 }}>
            <div className="pd-sticky">
              <AuthorInfoCard t={t} author={post.author} />
              <AuthorPostsList t={t} authorName={post.author} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pd-related" style={{ maxWidth: 1280, margin: '40px auto', padding: '0 16px' }}>
            <h2 className="pd-comments-title">{isRtl ? 'مطالب مرتبط' : 'Related Posts'}</h2>
            <div className="pd-related">
              {related.map((rp) => (
                <button key={rp.id} onClick={() => { window.location.hash = `blog/post/${rp.slug}`; window.scrollTo(0, 0); }} className="pd-related-card">
                  {rp.imageUrl && (
                    <img className="pd-related-thumb" src={rp.imageUrl} alt={rp.title} />
                  )}
                  <div className="pd-related-info">
                    <h3 className="pd-related-card-title">{rp.title}</h3>
                    {rp.excerpt && <p className="pd-article-description" style={{ marginTop: 4 }}>{rp.excerpt}</p>}
                    {rp.tags && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {rp.tags.split(',').slice(0, 3).map((tag, i) => <span key={i} className="pd-related-tag">#{tag.trim()}</span>)}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </article>

      <button className={`pd-back-to-top${showBackTop ? ' visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUpIcon /></button>
    </>
  );
}
