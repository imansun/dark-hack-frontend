import { useEffect, useState } from 'react';
import { useToast } from './Toast';
import { useTranslation } from 'react-i18next';

const EMPTY_FORM = { name: '', name_en: '', name_ar: '', slug: '' };

const inputSx = {
  width: '100%', padding: '0.8rem 1rem', border: '2px solid #2a2a2a', borderRadius: '6px',
  background: '#111', color: '#fff', fontFamily: 'inherit', fontSize: '1.3rem',
  outline: 'none', transition: 'border-color 0.15s',
};

export default function AdminCategories({ token, onUnauthorized }) {
  const { i18n } = useTranslation();
  const { success, error } = useToast();
  const isRtl = i18n.language === 'fa';

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    fetch('/api/categories', { headers: auth() })
      .then((r) => {
        if (r.status === 401) { onUnauthorized(); return; }
        return r.json();
      })
      .then((data) => { setCategories(data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSending(true);
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: auth(), body: JSON.stringify(form) });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to save category'); return; }
      success(editingId ? 'Category updated' : 'Category created');
      setForm({ ...EMPTY_FORM });
      setEditingId(null);
      setShowForm(false);
      load();
    } catch { error('Network error'); }
    finally { setSending(false); }
  };

  const remove = async (id) => {
    if (editingId === id) return;
    if (!confirm('Delete category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: auth() });
      if (res.status === 401) { onUnauthorized(); return; }
      if (!res.ok) { error('Failed to delete'); return; }
      success('Category deleted');
      load();
    } catch { error('Network error'); }
  };

  const edit = (cat) => {
    setForm({ name: cat.name || '', name_en: cat.name_en || '', name_ar: cat.name_ar || '', slug: cat.slug || '' });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const addNew = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  };

  const gridSx = { display: 'grid', gridTemplateColumns: isRtl ? '1fr 1fr 1fr 1fr auto' : '1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #222' };
  const headerSx = { ...gridSx, borderBottom: '2px solid #00FF94', color: '#00FF94', fontWeight: 700, paddingBottom: '0.8rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
          {isRtl ? 'دسته‌بندی‌ها' : 'Categories'}
        </h2>
        <button
          onClick={addNew}
          style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', background: '#00FF94', color: '#111', fontFamily: 'inherit', fontSize: '1.35rem', fontWeight: 700, cursor: 'pointer' }}
        >
          {isRtl ? 'جدید' : '+ New'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          {['name', 'name_en', 'name_ar', 'slug'].map((f) => (
            <div key={f} style={{ flex: '1 0 180px' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{f}</label>
              <input
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                style={inputSx}
              />
            </div>
          ))}
          <button
            onClick={save}
            disabled={sending}
            style={{ padding: '0.8rem 1.6rem', borderRadius: '8px', border: 'none', background: '#00FF94', color: '#111', fontFamily: 'inherit', fontSize: '1.3rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.6 : 1 }}
          >
            {sending ? '...' : (editingId ? (isRtl ? 'به‌روزرسانی' : 'Update') : (isRtl ? 'ایجاد' : 'Create'))}
          </button>
          <button
            onClick={() => { setShowForm(false); setForm({ ...EMPTY_FORM }); setEditingId(null); }}
            style={{ padding: '0.8rem 1.6rem', borderRadius: '8px', border: '1px solid #444', background: 'transparent', color: '#999', fontFamily: 'inherit', fontSize: '1.3rem', cursor: 'pointer' }}
          >
            {isRtl ? 'لغو' : 'Cancel'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : categories.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          {isRtl ? 'دسته‌بندی‌ای وجود ندارد' : 'No categories yet'}
        </p>
      ) : (
        <div>
          <div style={headerSx}>
            <span>fa</span>
            <span>en</span>
            <span>ar</span>
            <span>slug</span>
            <span style={{ textAlign: 'center' }}>{isRtl ? 'عملیات' : 'Actions'}</span>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} style={gridSx}>
              <span style={{ color: '#fff' }}>{cat.name}</span>
              <span style={{ color: '#999' }}>{cat.name_en || '-'}</span>
              <span style={{ color: '#999' }}>{cat.name_ar || '-'}</span>
              <span style={{ color: '#666', fontSize: '1.15rem' }}>{cat.slug}</span>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => edit(cat)}
                  style={{ padding: '0.3rem 0.8rem', border: '1px solid #333', borderRadius: '4px', background: 'transparent', color: '#00FF94', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.15rem' }}
                >
                  {isRtl ? 'ویرایش' : 'Edit'}
                </button>
                <button
                  onClick={() => remove(cat.id)}
                  style={{ padding: '0.3rem 0.8rem', border: '1px solid #ff4444', borderRadius: '4px', background: 'transparent', color: '#ff4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.15rem' }}
                >
                  {isRtl ? 'حذف' : 'Del'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
