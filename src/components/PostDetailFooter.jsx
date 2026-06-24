import { useState } from 'react';

export default function PostDetailFooter({ post, pageUrl, t }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      svg: <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>,
    },
    {
      name: 'LinkedIn',
      href: `https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      svg: <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      svg: <svg viewBox="0 0 24 24"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022-.215 2.173 2.173 0 0 0-1.953 1.118L2.984 15.883l.001-.002a1.203 1.203 0 0 0 .903 1.85l4.762.631 2.341 4.983.075.161a1.2 1.2 0 0 0 2.172-.023l3.695-12.04 5.106-5.016a1.2 1.2 0 0 0 .16-1.569 1.197 1.197 0 0 0-1-1.425z" /></svg>,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="pd-share-section">
      <span className="pd-share-label">{t?.('blog.share') || 'Share'}</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pd-share-btn"
          aria-label={link.name}
        >
          {link.svg}
        </a>
      ))}
      <button
        className={`pd-share-btn pd-share-btn--copy${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        aria-label="Copy link"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? (t?.('blog.copied') || 'Copied!') : (t?.('blog.copyLink') || 'Copy')}
      </button>
    </div>
  );
}
