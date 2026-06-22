import { useEffect, useState } from 'react';
import { useToast } from './Toast';

export default function AdminContacts({ token, onUnauthorized }) {
  const { success, error } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); }, []);

  const auth = () => ({ Authorization: `Bearer ${token}` });

  const load = () => {
    setLoading(true);
    fetch('/api/contacts', { headers: auth() })
      .then((r) => {
        if (r.status === 401) { onUnauthorized(); return; }
        return r.json();
      })
      .then((data) => data && setContacts(data))
      .catch(() => error('Failed to load messages'))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id, name) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers: auth() });
      if (res.status === 401) { onUnauthorized(); return; }
      if (res.ok) { success(`Message from "${name}" deleted`); load(); if (selected?.id === id) setSelected(null); }
    } catch { error('Failed to delete'); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>Messages</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading...</div>
      ) : contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#141414', borderRadius: '12px', border: '1px dashed #333' }}>
          <p style={{ color: '#666', fontSize: '1.5rem' }}>No messages yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: selected ? '1fr 1fr' : '1fr' }}>
          <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  {['Name', 'Message', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#888', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c.id} style={{
                    borderBottom: i < contacts.length - 1 ? '1px solid #1a1a1a' : 'none',
                    background: selected?.id === c.id ? 'rgba(0,255,148,0.04)' : 'transparent',
                    cursor: 'pointer',
                  }} onClick={() => setSelected(c)}>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#fff', fontWeight: 700, fontSize: '1.4rem' }}>{c.name}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#aaa', fontSize: '1.3rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#888', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleDelete(c.id, c.name)} style={{
                        padding: '0.5rem 1.2rem', borderRadius: '6px', border: '1px solid #ff4757',
                        background: 'transparent', color: '#ff4757', fontFamily: 'inherit',
                        fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer',
                      }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{
              background: '#141414', borderRadius: '12px', border: '1px solid #222',
              padding: '2rem', position: 'sticky', top: '2rem', alignSelf: 'start',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00FF94' }}>{selected.name}</h3>
                <button onClick={() => setSelected(null)} style={{
                  background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.8rem',
                }}>✕</button>
              </div>
              <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
                {new Date(selected.createdAt).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{
                background: '#111', borderRadius: '8px', padding: '1.5rem',
                color: '#ccc', fontSize: '1.4rem', lineHeight: 1.8, whiteSpace: 'pre-wrap',
                minHeight: '100px',
              }}>
                {selected.message}
              </div>
              <button onClick={() => handleDelete(selected.id, selected.name)} style={{
                marginTop: '1.5rem', padding: '0.8rem 2rem', borderRadius: '8px',
                border: '1px solid #ff4757', background: 'transparent',
                color: '#ff4757', fontFamily: 'inherit', fontSize: '1.3rem',
                fontWeight: 700, cursor: 'pointer',
              }}>Delete Message</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}