import { useEffect, useState } from 'react';
import { useToast } from './Toast';

const EMPTY = { title: '', title_en: '', title_ar: '', description: '', description_en: '', description_ar: '', imageUrl: '', order: 0 };

export default function AdminServices({ token, onUnauthorized }) {
  const { success, error } = useToast();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  const load = () => {
    setLoading(true);
    fetch('/api/services')
      .then((r) => r.json())
      .then(setServices)
      .catch(() => error('Failed to load services'))
      .finally(() => setLoading(false));
  };

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title, title_en: s.title_en || '', title_ar: s.title_ar || '',
      description: s.description || '', description_en: s.description_en || '', description_ar: s.description_ar || '',
      imageUrl: s.imageUrl || '', order: s.order ?? 0,
    });
    setShowForm(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { error('Title (Persian) is required'); return; }
    setSending(true);
    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: auth(), body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to save'); return; }
      success(editingId ? 'Service updated' : 'Service created');
      load();
      setShowForm(false);
    } catch { error('Connection error'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id, title) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE', headers: auth() });
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
        background: '#1a1a1a', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '520px',
        maxHeight: '90vh', overflow: 'auto', border: '1px solid #2a2a2a',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#00FF94', marginBottom: '2rem' }}>
          {editingId ? 'Edit Service' : 'New Service'}
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
                <input
                  name={f.name} value={form[f.name]} onChange={handleChange}
                  style={inputStyle}
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
              <div key={f.name} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>{f.label}</label>
                <textarea
                  name={f.name} value={form[f.name]} onChange={handleChange} rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 600, color: '#999', marginBottom: '0.4rem' }}>Order</label>
              <input name="order" type="number" value={form.order} onChange={handleChange} style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#00FF94'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={sending} style={{
              flex: 1, padding: '1.2rem', borderRadius: '8px', border: 'none',
              background: '#00FF94', color: '#111', fontFamily: 'inherit',
              fontSize: '1.5rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer',
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
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>Services</h2>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.8rem 1.6rem', borderRadius: '8px', border: 'none',
          background: '#00FF94', color: '#111', fontFamily: 'inherit',
          fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Service
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#141414', borderRadius: '12px', border: '1px dashed #333' }}>
          <p style={{ color: '#666', fontSize: '1.5rem' }}>No services yet</p>
        </div>
      ) : (
        <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Title', 'Order', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#888', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < services.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: 600, fontSize: '1.4rem' }}>{s.title}</td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#888', fontSize: '1.3rem' }}>{s.order}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(s)} style={btnStyle('#00FF94')}>Edit</button>
                      <button onClick={() => handleDelete(s.id, s.title)} style={btnStyle('#ff4757')}>Delete</button>
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

const inputStyle = {
  width: '100%', padding: '0.8rem 1rem', border: '2px solid #2a2a2a', borderRadius: '6px',
  background: '#111', color: '#fff', fontFamily: 'inherit', fontSize: '1.3rem',
  outline: 'none', transition: 'border-color 0.15s',
};

const btnStyle = (color) => ({
  padding: '0.5rem 1.2rem', borderRadius: '6px', border: `1px solid ${color}`,
  background: 'transparent', color, fontFamily: 'inherit', fontSize: '1.2rem',
  fontWeight: 700, cursor: 'pointer',
  transition: 'all 0.15s',
});