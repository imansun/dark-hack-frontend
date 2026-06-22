const ThumbUpSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const CommentSvg = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function PostDetailFooter({ likes = '236', comments = '641' }) {
  return (
    <div className="post-detail-footer" style={{ marginTop: 20, display: 'flex', gap: 12 }}>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 20px', borderRadius: 10,
        border: '1px solid #cbd5e1', background: 'transparent',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.4rem',
        fontWeight: 500, color: '#0f172a', outline: 'none',
        letterSpacing: '0.025em',
        transition: 'background 0.15s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <ThumbUpSvg style={{ color: '#94a3b8' }} /> <span>{likes}</span>
      </button>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 20px', borderRadius: 10,
        border: '1px solid #cbd5e1', background: 'transparent',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.4rem',
        fontWeight: 500, color: '#0f172a', outline: 'none',
        letterSpacing: '0.025em',
        transition: 'background 0.15s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(203,213,225,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <CommentSvg style={{ color: '#94a3b8' }} /> <span>{comments}</span>
      </button>
      <style>{`
        .dark .post-detail-footer button { color: #e6e7eb !important; border-color: #383a41 !important; }
        .dark .post-detail-footer button:hover { background: rgba(56,58,65,0.2) !important; }
        .dark .post-detail-footer svg { color: #838794 !important; }
      `}</style>
    </div>
  );
}
