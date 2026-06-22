import { useEffect, useState } from 'react';
import { useToast } from './Toast';
import { useTranslation } from 'react-i18next';

export default function AdminComments({ token, onUnauthorized }) {
  const { i18n } = useTranslation();
  const { success, error } = useToast();
  const isRtl = i18n.language === 'fa';
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    fetch('/api/comments/admin', { headers: auth() })
      .then((r) => { if (r.status === 401) { onUnauthorized(); return; } return r.json(); })
      .then((data) => setComments(data || []))
      .catch(() => error('Failed to load'))
      .finally(() => setLoading(false));
  };

  const approve = async (id) => {
    try {
      const res = await fetch(`/api/comments/${id}/approve`, { method: 'POST', headers: auth() });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to approve'); return; }
      success('Comment approved');
      load();
    } catch { error('Network error'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE', headers: auth() });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to delete'); return; }
      success('Comment deleted');
      load();
    } catch { error('Network error'); }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        {isRtl ? 'مدیریت نظرات' : 'Comments'}
      </h2>

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          {isRtl ? 'نظری وجود ندارد' : 'No comments yet'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((c) => (
            <div key={c.id} style={{
              background: '#141414', border: `1px solid ${c.approved ? '#1a3a1a' : '#3a1a1a'}`,
              borderRadius: '10px', padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div>
                  <strong style={{ color: '#00FF94', fontSize: '1.35rem', display: 'block' }}>{c.author}</strong>
                  <span style={{ fontSize: '1.1rem', color: '#666' }}>
                    {c.post?.title || `Post #${c.postId}`} &middot; {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span style={{
                  padding: '0.25rem 0.7rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600,
                  background: c.approved ? 'rgba(0,255,148,0.1)' : 'rgba(255,107,107,0.1)',
                  color: c.approved ? '#00FF94' : '#ff6b6b',
                }}>{c.approved ? 'Approved' : 'Pending'}</span>
              </div>
              <p style={{ color: '#ccc', fontSize: '1.35rem', lineHeight: '1.7', marginBottom: '1rem' }}>{c.content}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!c.approved && (
                  <button onClick={() => approve(c.id)} style={{
                    padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #00FF94',
                    background: 'transparent', color: '#00FF94', fontFamily: 'inherit', fontSize: '1.2rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}>{isRtl ? 'تأیید' : 'Approve'}</button>
                )}
                <button onClick={() => remove(c.id)} style={{
                  padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #ff4757',
                  background: 'transparent', color: '#ff4757', fontFamily: 'inherit', fontSize: '1.2rem',
                  fontWeight: 700, cursor: 'pointer',
                }}>{isRtl ? 'حذف' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
