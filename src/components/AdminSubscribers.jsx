import { useEffect, useState } from 'react';
import { useToast } from './Toast';
import { useTranslation } from 'react-i18next';

export default function AdminSubscribers({ token, onUnauthorized }) {
  const { i18n } = useTranslation();
  const { success, error } = useToast();
  const isRtl = i18n.language === 'fa';
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    fetch('/api/subscribers/admin', { headers: auth() })
      .then((r) => { if (r.status === 401) { onUnauthorized(); return; } return r.json(); })
      .then((data) => setSubs(data || []))
      .catch(() => error('Failed to load'))
      .finally(() => setLoading(false));
  };

  const copyEmails = () => {
    const emails = subs.filter((s) => s.active).map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails).then(
      () => success('Emails copied'),
      () => error('Failed to copy'),
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
          {isRtl ? 'مشترکین خبرنامه' : 'Subscribers'}
        </h2>
        {subs.length > 0 && (
          <button onClick={copyEmails} style={{
            padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #333',
            background: 'transparent', color: '#00FF94', fontFamily: 'inherit', fontSize: '1.2rem',
            fontWeight: 700, cursor: 'pointer',
          }}>{isRtl ? 'کپی ایمیل‌ها' : 'Copy Emails'}</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : subs.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          {isRtl ? 'مشترکی وجود ندارد' : 'No subscribers yet'}
        </p>
      ) : (
        <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Email', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ padding: '1rem 1.2rem', textAlign: 'left', color: '#888', fontSize: '1.15rem', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < subs.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#fff', fontSize: '1.3rem' }}>{s.email}</td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '3px', fontSize: '1.05rem', fontWeight: 600,
                      background: s.active ? 'rgba(0,255,148,0.1)' : 'rgba(255,107,107,0.1)',
                      color: s.active ? '#00FF94' : '#ff6b6b',
                    }}>{s.active ? 'Active' : 'Unsubscribed'}</span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#888', fontSize: '1.15rem' }}>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid #222', color: '#888', fontSize: '1.15rem' }}>
            {subs.filter((s) => s.active).length} active / {subs.length} total
          </div>
        </div>
      )}
    </div>
  );
}
