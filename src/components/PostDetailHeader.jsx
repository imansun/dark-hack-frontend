import { useTranslation } from 'react-i18next';

export default function PostDetailHeader({ post, onBack }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  return (
    <div className="pd-header-bar">
      <button onClick={onBack} className="pd-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={isRtl ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
        </svg>
        {t('blog.backToList') || 'Back'}
      </button>
      {post.category && (
        <span className="pd-category-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
          {post.category.name || post.category}
        </span>
      )}
    </div>
  );
}
