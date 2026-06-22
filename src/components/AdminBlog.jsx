import { useEffect, useState } from 'react';
import { useToast } from './Toast';

const EMPTY_FORM = { title: '', title_en: '', title_ar: '', content: '', content_en: '', content_ar: '', excerpt: '', excerpt_en: '', excerpt_ar: '', slug: '', tags: '', imageUrl: '', published: true, categoryId: null };

const inputSx = {
  width: '100%', padding: '0.8rem 1rem', border: '2px solid #2a2a2a', borderRadius: '6px',
  background: '#111', color: '#fff', fontFamily: 'inherit', fontSize: '1.3rem',
  outline: 'none', transition: 'border-color 0.15s',
};

export default function AdminBlog({ token, onUnauthorized }) {
  const { success, error } = useToast();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => { loadCategories(); load(); }, []);

  const loadCategories = () => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .catch(() => {});
  };

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  const load = () => {
    setLoading(true);
    fetch('/api/posts/admin', { headers: auth() })
      .then((r) => {
        if (r.status === 401) { onUnauthorized(); return; }
        return r.json();
      })
      .then((data) => { if (data) setPosts(data); })
      .catch(() => error('Failed to load posts'))
      .finally(() => setLoading(false));
  };

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); setShowForm(true); };
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title, title_en: p.title_en || '', title_ar: p.title_ar || '',
      content: p.content || '', content_en: p.content_en || '', content_ar: p.content_ar || '',
      excerpt: p.excerpt || '', excerpt_en: p.excerpt_en || '', excerpt_ar: p.excerpt_ar || '',
      slug: p.slug || '', tags: p.tags || '', imageUrl: p.imageUrl || '', published: p.published ?? true,
      categoryId: p.categoryId || null,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { error('Title (Persian) is required'); return; }
    if (!form.slug.trim()) { error('Slug is required'); return; }
    if (!form.content.trim()) { error('Content (Persian) is required'); return; }
    setSending(true);
    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: auth(), body: JSON.stringify(form) });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to save'); return; }
      success(editingId ? 'Post updated' : 'Post created');
      load();
      setShowForm(false);
    } catch { error('Connection error'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id, title) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE', headers: auth() });
      if (res.status === 401) { onUnauthorized(); return; }
      if (res.ok) { success(`"${title}" deleted`); load(); }
    } catch { error('Failed to delete'); }
  };

  const renderForm = () => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }} onClick={() => setShowForm(false)}>
      <div style={{
        background: '#1a1a1a', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '700px',
        maxHeight: '90vh', overflow: 'auto', border: '1px solid #2a2a2a',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00FF94', marginBottom: '2rem' }}>
          {editingId ? 'Edit Post' : 'New Post'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Title (Persian) *', name: 'title' },
                { label: 'Title (English)', name: 'title_en' },
                { label: 'العنوان (العربية)', name: 'title_ar' },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} style={inputSx}
                    onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                    onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="my-post-slug" style={inputSx}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="AI, Security, Architecture" style={inputSx}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Category</label>
              <select name="categoryId" value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : null })}
                style={{ ...inputSx, cursor: 'pointer', appearance: 'auto' }}>
                <option value="">-- No category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.slug})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'Content (Persian) *', name: 'content' },
              { label: 'Content (English)', name: 'content_en' },
              { label: 'المحتوى (العربية)', name: 'content_ar' },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                <textarea name={f.name} value={form[f.name]} onChange={handleChange} rows={4}
                  style={{ ...inputSx, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'Excerpt (Persian)', name: 'excerpt' },
              { label: 'Excerpt (English)', name: 'excerpt_en' },
              { label: 'المقتطف (العربية)', name: 'excerpt_ar' },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} style={inputSx}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={inputSx}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '2rem', fontSize: '1.3rem', color: '#ccc' }}>
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              Published
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={sending} style={{
              flex: 1, padding: '1.2rem', borderRadius: '8px', border: 'none',
              background: '#00FF94', color: '#111', fontFamily: 'inherit',
              fontSize: '1.5rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer',
              opacity: sending ? 0.6 : 1,
            }}>{sending ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              flex: 1, padding: '1.2rem', borderRadius: '8px', border: '1px solid #333',
              background: 'transparent', color: '#ccc', fontFamily: 'inherit',
              fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>Blog</h2>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.8rem 1.6rem', borderRadius: '8px', border: 'none',
          background: '#00FF94', color: '#111', fontFamily: 'inherit',
          fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Post
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#141414', borderRadius: '12px', border: '1px dashed #333' }}>
          <p style={{ color: '#666', fontSize: '1.5rem' }}>No posts yet</p>
        </div>
      ) : (
        <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Title', 'Slug', 'Status', 'Tags', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#888', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: 600, fontSize: '1.4rem' }}>{p.title}</td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#888', fontSize: '1.3rem', fontFamily: 'monospace' }}>/{p.slug}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600,
                      background: p.published ? 'rgba(0,255,148,0.1)' : 'rgba(255,107,107,0.1)',
                      color: p.published ? '#00FF94' : '#ff6b6b',
                    }}>{p.published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {(p.tags || '').split(',').filter(Boolean).map((tag, j) => (
                        <span key={j} style={{
                          background: 'rgba(0,255,148,0.1)', color: '#00FF94',
                          padding: '0.2rem 0.6rem', borderRadius: '3px', fontSize: '1rem', fontWeight: 600,
                        }}>{tag.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} style={btnStyle('#00FF94')}>Edit</button>
                      <button onClick={() => handleDelete(p.id, p.title)} style={btnStyle('#ff4757')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && renderForm()}
    </div>
  );
}

const btnStyle = (color) => ({
  padding: '0.5rem 1.2rem', borderRadius: '6px', border: `1px solid ${color}`,
  background: 'transparent', color, fontFamily: 'inherit', fontSize: '1.2rem',
  fontWeight: 700, cursor: 'pointer',
});
