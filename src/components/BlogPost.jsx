import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SeoHelmet from './SeoHelmet';
import PostDetailHeader from './PostDetailHeader';
import PostDetailContent from './PostDetailContent';
import PostDetailFooter from './PostDetailFooter';
import RecentArticlesList from './RecentArticlesList';
import { useToast } from './Toast';
import 'prismjs/themes/prism-okaidia.css';
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

function addHeadingIds(html) {
  if (!html) return '';
  let idx = 0;
  return html.replace(/<h([23])(\s[^>]*)?>/gi, (match) => {
    return match.includes('id=') ? match : match.replace('>', ` id="h-${idx++}">`);
  });
}

const AVATAR_COLORS = ['#00FF94', '#ff6b6b', '#5b7fff', '#ffd43b', '#ff922b', '#cc5de8', '#20c997', '#f06595'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function BlogPost({ slug, onBack }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const progressRef = useRef(null);

  const lang = i18n.language;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/posts/${slug}?lang=${lang}`)
      .then((r) => {
        if (!r.ok) throw new Error(t('blog.notFound'));
        return r.json();
      })
      .then((data) => {
        setPost(data);
        fetch(`/api/posts/${data.id}/related?lang=${lang}`)
          .then((r) => r.json())
          .then(setRelated)
          .catch(() => {});
        fetch(`/api/comments/${data.id}`)
          .then((r) => r.json())
          .then(setComments)
          .catch(() => {});
        fetch(`/api/posts/${data.id}/views`, { method: 'POST' }).catch(() => {});
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    fetch(`/api/profile?lang=${lang}`)
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {});
  }, [slug, lang, t]);

  const processedContent = useMemo(() => addHeadingIds(post?.content), [post?.content]);

  const headings = useMemo(() => {
    if (!processedContent) return [];
    const regex = /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
    const results = [];
    let m;
    const idMap = {};
    while ((m = regex.exec(processedContent)) !== null) {
      const level = parseInt(m[1], 10);
      const attrs = m[2] || '';
      const text = m[3].replace(/<[^>]+>/g, '').trim();
      const idMatch = attrs.match(/id="([^"]+)"/);
      const id = idMatch ? idMatch[1] : '';
      if (id) results.push({ level, id, text });
    }
    return results;
  }, [processedContent]);

  const handleScroll = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = `${docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0}%`;
    setShowBackTop(scrollTop > 600);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (lightboxSrc) {
      const handler = (e) => { if (e.key === 'Escape') setLightboxSrc(null); };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [lightboxSrc]);

  const handleViewPost = (postSlug) => {
    window.location.hash = `blog/post/${postSlug}`;
    window.scrollTo(0, 0);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor.trim(),
          content: commentText.trim(),
          postId: post.id,
          turnstileToken: 'bypass',
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit comment');
      }
      toast.success(t('blog.commentSubmitted') || 'Comment submitted for review.');
      setCommentText('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    setNewsletterSubmitting(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstileToken: 'bypass',
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to subscribe');
      }
      toast.success(t('blog.subscribed') || 'Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-container">
          <div className="pd-skeleton" style={{ width: '60%', height: 32 }} />
          <div className="pd-skeleton" style={{ width: '80%', height: 40 }} />
          <div className="pd-skeleton" style={{ width: '40%', height: 16 }} />
          <div className="pd-skeleton" style={{ width: '100%', height: 300 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="pd-skeleton" style={{ width: `${85 - i * 8}%`, height: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pd-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error || t('blog.notFound')}</p>
        <button onClick={onBack} className="pd-error-btn">{t('blog.backToList')}</button>
      </div>
    );
  }

  const pubDate = formatDate(post.createdAt, lang);
  const updDate = formatDate(post.updatedAt, lang);
  const readTime = `${readingTime(post.content)} ${t('blog.readingTime') || 'min read'}`;
  const pageUrl = `https://marmaryshop.com/#blog/post/${post.slug}`;
  const isRtl = lang === 'fa' || lang === 'ar';

  return (
    <>
      <div className="pd-progress"><div className="pd-progress-bar" ref={progressRef} /></div>
      <SeoHelmet
        title={post.title}
        description={post.excerpt || post.content?.slice(0, 160)}
        image={post.imageUrl}
        url={pageUrl}
        type="article"
      />

      <article className="pd-container" dir={isRtl ? 'rtl' : 'ltr'}>
        <PostDetailHeader post={post} onBack={onBack} />

        <div className="pd-meta">
          <span className="pd-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {pubDate}
          </span>
          <span className="pd-meta-divider" />
          <span className="pd-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {readTime}
          </span>
          {post.views > 0 && (
            <>
              <span className="pd-meta-divider" />
              <span className="pd-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {post.views.toLocaleString()}
              </span>
            </>
          )}
          {post.updatedAt !== post.createdAt && (
            <span className="pd-updated-badge">
              ({t('blog.updatedOn') || 'Updated'}: {updDate})
            </span>
          )}
        </div>

        {post.tags && (
          <div className="pd-tags">
            {post.tags.split(',').map((tag, i) => (
              <span key={i} className="pd-tag">#{tag.trim()}</span>
            ))}
          </div>
        )}

        {headings.length > 1 && (
          <nav className="pd-toc">
            <div className="pd-toc-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              {t('blog.tableOfContents') || 'Table of Contents'}
            </div>
            <ul className="pd-toc-list">
              {headings.map((h, i) => (
                <li key={i} className="pd-toc-item">
                  <button
                    className={`pd-toc-link${h.level === 3 ? ' pd-toc-link--h3' : ''}`}
                    onClick={() => scrollToHeading(h.id)}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {post.imageUrl && (
          <div className="pd-image-wrap" onClick={() => setLightboxSrc(post.imageUrl)}>
            <img src={post.imageUrl} alt={post.title} loading="eager" />
          </div>
        )}

        <PostDetailContent contentHtml={processedContent || ''} onImageClick={setLightboxSrc} />
        <PostDetailFooter post={post} pageUrl={pageUrl} t={t} />

        {profile && (
          <div className="pd-author-bio-card">
            {profile.imageUrl ? (
              <img className="pd-author-avatar" src={profile.imageUrl} alt={profile.name} />
            ) : (
              <div className="pd-author-avatar" style={{ background: getAvatarColor(profile.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 800, fontSize: '2.4rem' }}>
                {(profile.name || 'M')[0]}
              </div>
            )}
            <div className="pd-author-info">
              <div className="pd-author-name">{profile.name}</div>
              {profile.title && <div className="pd-author-title">{profile.title}</div>}
              {profile.bio && <p className="pd-author-desc">{profile.bio}</p>}
            </div>
          </div>
        )}

        <hr className="pd-separator" />

        <section className="pd-comments">
          <h2 className="pd-comments-title">
            {t('blog.comments') || 'Comments'}
            <span className="pd-comments-count">{comments.length}</span>
          </h2>

          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="pd-comment">
                <div className="pd-comment-avatar" style={{ background: getAvatarColor(c.author) }}>
                  {c.author[0]}
                </div>
                <div className="pd-comment-body">
                  <div>
                    <span className="pd-comment-author">{c.author}</span>
                    <span className="pd-comment-date">{formatDate(c.createdAt, lang)}</span>
                  </div>
                  <p className="pd-comment-text">{c.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="pd-comments-empty">{t('blog.noComments') || 'No comments yet. Be the first!'}</p>
          )}

          <form className="pd-comments-form" onSubmit={handleSubmitComment}>
            <input
              type="text"
              placeholder={t('blog.commentName') || 'Your name'}
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
              maxLength={100}
            />
            <textarea
              placeholder={t('blog.commentText') || 'Write your comment...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button className="pd-comments-submit" type="submit" disabled={commentSubmitting}>
              {commentSubmitting ? (t('blog.submitting') || 'Submitting...') : (t('blog.submitComment') || 'Submit Comment')}
            </button>
          </form>
        </section>

        <hr className="pd-separator" />

        <div className="pd-newsletter">
          <div className="pd-newsletter-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="pd-newsletter-body">
            <h3 className="pd-newsletter-title">{t('blog.newsletter') || 'Stay Updated'}</h3>
            <p className="pd-newsletter-text">{t('blog.newsletterDesc') || 'Get notified about new articles and insights.'}</p>
            <form className="pd-newsletter-form" onSubmit={handleSubscribe}>
              <input
                className="pd-newsletter-input"
                type="email"
                placeholder={t('blog.newsletterPlaceholder') || 'your@email.com'}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button className="pd-newsletter-submit" type="submit" disabled={newsletterSubmitting}>
                {newsletterSubmitting ? (t('blog.subscribing') || 'Subscribing...') : (t('blog.subscribe') || 'Subscribe')}
              </button>
            </form>
          </div>
        </div>

        <RecentArticlesList onViewPost={handleViewPost} />
      </article>

      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related-title">
            {t('blog.relatedPosts') || 'Related Posts'}
            <span>({related.length})</span>
          </h2>
          <div className="pd-related-grid">
            {related.map((rp) => (
              <button key={rp.id} onClick={() => handleViewPost(rp.slug)} className="pd-related-card">
                {rp.imageUrl && <img className="pd-related-thumb" src={rp.imageUrl} alt={rp.title} loading="lazy" />}
                <div className="pd-related-info">
                  <h3 className="pd-related-card-title">{rp.title}</h3>
                  {rp.excerpt && <p className="pd-related-card-desc">{rp.excerpt}</p>}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <button
        className={`pd-back-top${showBackTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {lightboxSrc && (
        <div className="pd-lightbox" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="" />
        </div>
      )}
    </>
  );
}
