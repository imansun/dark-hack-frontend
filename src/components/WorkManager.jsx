import { useEffect, useState } from 'react';
import { useToast } from './Toast';
import PdfPreview from './PdfPreview';

const EMPTY_FORM = { title: '', title_en: '', title_ar: '', description: '', description_en: '', description_ar: '', projectUrl: '', badges: '', image: null, imageFit: 'cover', imagePosition: 'center' };
const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

function MediaThumb({ url, alt }) {
  if (!url) return <div style={{ width: '60px', height: '60px', background: '#222', borderRadius: '6px' }} />;
  if (isPdf(url)) return <PdfPreview url={url} alt={alt || ''} className="admin__thumb" />;
  return <img src={url} alt={alt} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />;
}

export default function WorkManager({ token, onLogout }) {
  const { success, error } = useToast();
  const [works, setWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWorks(); }, []);

  const headers = () => ({ Authorization: `Bearer ${token}` });

  const loadWorks = () => {
    setLoading(true);
    fetch('/api/works')
      .then((r) => r.json())
      .then(setWorks)
      .catch(() => error('Failed to load works'))
      .finally(() => setLoading(false));
  };

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); setShowForm(true); };
  const openEdit = (work) => {
    setEditingId(work.id);
    setForm({
      title: work.title, title_en: work.title_en || '', title_ar: work.title_ar || '',
      description: work.description || '', description_en: work.description_en || '', description_ar: work.description_ar || '',
      projectUrl: work.projectUrl || '', badges: (work.badges || []).map((b) => b.name).join(', '), image: null,
      imageFit: work.imageFit || 'cover', imagePosition: work.imagePosition || 'center',
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { error('Title (Persian) is required'); return; }
    setSending(true);

    const body = new FormData();
    ['title', 'title_en', 'title_ar', 'description', 'description_en', 'description_ar', 'projectUrl', 'imageFit', 'imagePosition'].forEach((k) => body.append(k, form[k]));
    body.append('badges', JSON.stringify(form.badges.split(',').map((s) => s.trim()).filter(Boolean)));
    if (form.image) body.append('image', form.image);

    try {
      const url = editingId ? `/api/works/${editingId}` : '/api/works';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body, headers: headers() });

      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        error(err.message?.[0] || err.message || 'Failed to save');
        return;
      }
      success(editingId ? 'Work updated' : 'Work created');
      await loadWorks();
      setShowForm(false);
    } catch { error('Connection error'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id, title) => {
    try {
      const res = await fetch(`/api/works/${id}`, { method: 'DELETE', headers: headers() });
      if (res.status === 401) { onLogout(); return; }
      if (res.ok) { success(`"${title}" deleted`); loadWorks(); }
    } catch { error('Failed to delete'); }
  };

  const inputSx = {
    width: '100%', padding: '0.8rem 1rem', border: '2px solid #2a2a2a', borderRadius: '6px',
    background: '#111', color: '#fff', fontFamily: 'inherit', fontSize: '1.3rem',
    outline: 'none', transition: 'border-color 0.15s',
  };

  const renderForm = () => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }} onClick={() => setShowForm(false)}>
      <div style={{
        background: '#1a1a1a', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '600px',
        maxHeight: '90vh', overflow: 'auto', border: '1px solid #2a2a2a',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00FF94', marginBottom: '2rem' }}>
          {editingId ? 'Edit Work' : 'New Work'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Title (Persian) *', name: 'title' },
              { label: 'Title (English)', name: 'title_en' },
              { label: 'العنوان (العربية)', name: 'title_ar' },
            ].map((f) => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange}
                  style={inputSx}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'Description (Persian)', name: 'description' },
              { label: 'Description (English)', name: 'description_en' },
              { label: 'الوصف (العربية)', name: 'description_ar' },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                <textarea name={f.name} value={form[f.name]} onChange={handleChange} rows={2}
                  style={{ ...inputSx, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Project URL</label>
              <input name="projectUrl" value={form.projectUrl} onChange={handleChange} style={inputSx}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Badges (comma separated)</label>
              <input name="badges" value={form.badges} onChange={handleChange} placeholder="HTML, CSS, JS" style={inputSx}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Image / PDF</label>
            <input
              type="file" accept="image/*,.pdf" onChange={handleChange} name="image"
              style={{ color: '#888', fontFamily: 'inherit', fontSize: '1.3rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Image Fit</label>
              <select name="imageFit" value={form.imageFit} onChange={handleChange} style={inputSx}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              >
                <option value="cover">Cover (برش)</option>
                <option value="contain">Contain (درون قاب)</option>
                <option value="fill">Fill (پر کردن)</option>
                <option value="none">None (واقعی)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Image Position</label>
              <select name="imagePosition" value={form.imagePosition} onChange={handleChange} style={inputSx}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top left">Top Left</option>
                <option value="top right">Top Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom right">Bottom Right</option>
              </select>
            </div>
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
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>Works</h2>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.8rem 1.6rem', borderRadius: '8px', border: 'none',
          background: '#00FF94', color: '#111', fontFamily: 'inherit',
          fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Work
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading...</div>
      ) : works.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#141414', borderRadius: '12px', border: '1px dashed #333' }}>
          <p style={{ color: '#666', fontSize: '1.5rem' }}>No works yet</p>
        </div>
      ) : (
        <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Preview', 'Title', 'Badges', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#888', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {works.map((w, i) => (
                <tr key={w.id} style={{ borderBottom: i < works.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <MediaThumb url={w.imageUrl} alt={w.title} />
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: 600, fontSize: '1.4rem' }}>{w.title}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(w.badges || []).map((b) => (
                        <span key={b.id} style={{
                          background: 'rgba(0,255,148,0.1)', color: '#00FF94',
                          padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600,
                        }}>{b.name}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(w)} style={btnStyle('#00FF94')}>Edit</button>
                      <button onClick={() => handleDelete(w.id, w.title)} style={btnStyle('#ff4757')}>Delete</button>
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