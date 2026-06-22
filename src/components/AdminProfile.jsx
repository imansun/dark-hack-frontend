import { useEffect, useState } from 'react';
import { useToast } from './Toast';

export default function AdminProfile({ token, onUnauthorized }) {
  const { success, error } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || '', name_en: data.name_en || '', name_ar: data.name_ar || '',
          title: data.title || '', title_en: data.title_en || '', title_ar: data.title_ar || '',
          subtitle: data.subtitle || '', subtitle_en: data.subtitle_en || '', subtitle_ar: data.subtitle_ar || '',
          description: data.description || '', description_en: data.description_en || '', description_ar: data.description_ar || '',
          resumeUrl: data.resumeUrl || '', avatarUrl: data.avatarUrl || '',
        });
      })
      .catch(() => error('Failed to load profile'));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { onUnauthorized(); return; }
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        success('Profile saved successfully');
      } else {
        const err = await res.json().catch(() => ({}));
        error(err.message || 'Failed to save profile');
      }
    } catch {
      error('Connection error');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ color: '#666', fontSize: '1.4rem' }}>Loading...</div>
      </div>
    );
  }

  const Field = ({ label, name, tag = 'input', rows = 2 }) => {
    const Tag = tag;
    return (
      <div style={{ marginBottom: '1.6rem' }}>
        <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#999', marginBottom: '0.5rem' }}>{label}</label>
        <Tag
          name={name}
          value={form[name] || ''}
          onChange={handleChange}
          rows={rows}
          style={{
            width: '100%', padding: '1rem 1.2rem', border: '2px solid #2a2a2a', borderRadius: '8px',
            background: '#111', color: '#fff', fontFamily: 'inherit', fontSize: '1.4rem',
            outline: 'none', transition: 'border-color 0.15s',
            resize: tag === 'textarea' ? 'vertical' : 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = '#00FF94'}
          onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
        />
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: '2.5rem' }}>Profile Settings</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div style={{ background: '#141414', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00FF94', marginBottom: '1.5rem' }}>Name & Title</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Field label="Name (Persian)" name="name" />
            <Field label="Name (English)" name="name_en" />
            <Field label="الاسم (العربية)" name="name_ar" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Field label="Job Title (Persian)" name="title" />
            <Field label="Job Title (English)" name="title_en" />
            <Field label="المسمى الوظيفي (العربية)" name="title_ar" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Field label="Subtitle (Persian)" name="subtitle" />
            <Field label="Subtitle (English)" name="subtitle_en" />
            <Field label="العنوان الفرعي (العربية)" name="subtitle_ar" />
          </div>
        </div>

        <div style={{ background: '#141414', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00FF94', marginBottom: '1.5rem' }}>Biography</h3>
          <Field label="Biography (Persian)" name="description" tag="textarea" rows={4} />
          <Field label="Biography (English)" name="description_en" tag="textarea" rows={4} />
          <Field label="السيرة الذاتية (العربية)" name="description_ar" tag="textarea" rows={4} />
        </div>

        <div style={{ background: '#141414', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00FF94', marginBottom: '1.5rem' }}>Links</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Field label="Resume URL" name="resumeUrl" />
            <Field label="Avatar URL" name="avatarUrl" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '1.2rem 3rem', borderRadius: '8px', border: 'none',
              background: '#00FF94', color: '#111', fontFamily: 'inherit',
              fontSize: '1.5rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}