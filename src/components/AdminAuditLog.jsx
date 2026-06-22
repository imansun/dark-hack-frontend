import { useEffect, useState } from 'react';
import { useToast } from './Toast';
import { useTranslation } from 'react-i18next';

const ACTION_COLORS = {
  CREATE: '#00FF94',
  UPDATE: '#FFD93D',
  DELETE: '#ff6b6b',
  APPROVE: '#54a0ff',
};

export default function AdminAuditLog({ token, onUnauthorized }) {
  const { i18n } = useTranslation();
  const { error } = useToast();
  const isRtl = i18n.language === 'fa';
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const limit = 50;

  const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  const load = (p) => {
    setLoading(true);
    fetch(`/api/audit-logs/admin?page=${p}&limit=${limit}`, { headers: auth() })
      .then((r) => { if (r.status === 401) { onUnauthorized(); return; } return r.json(); })
      .then((data) => {
        setLogs(data.data || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
      })
      .catch(() => error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, []);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
          {isRtl ? 'لاگ فعالیت‌ها' : 'Audit Log'}
        </h2>
        <span style={{ color: '#888', fontSize: '1.15rem' }}>{total} {isRtl ? 'ورودی' : 'entries'}</span>
      </div>

      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : logs.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          {isRtl ? 'هیچ فعالیتی ثبت نشده' : 'No activity recorded yet'}
        </p>
      ) : (
        <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  {['Time', 'Admin', 'Action', 'Entity', 'Details'].map((h) => (
                    <th key={h} style={{ padding: '1rem 1.2rem', textAlign: 'left', color: '#888', fontSize: '1.15rem', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                    <td style={{ padding: '1rem 1.2rem', color: '#888', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#fff', fontSize: '1.2rem' }}>{log.adminUsername}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '3px', fontSize: '1.05rem', fontWeight: 600,
                        background: `${ACTION_COLORS[log.action] || '#888'}18`,
                        color: ACTION_COLORS[log.action] || '#888',
                      }}>{log.action}</span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#fff', fontSize: '1.2rem' }}>
                      {log.entityType}{log.entityId ? ` #${log.entityId}` : ''}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <button onClick={() => setSelectedLog(log)} style={{
                        padding: '0.3rem 0.8rem', borderRadius: '4px', border: '1px solid #444',
                        background: 'transparent', color: '#888', fontFamily: 'inherit',
                        fontSize: '1.05rem', cursor: 'pointer',
                      }}>{isRtl ? 'مشاهده' : 'View'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid #222' }}>
              <button
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #333',
                  background: page <= 1 ? 'transparent' : 'rgba(0,255,148,0.1)',
                  color: page <= 1 ? '#444' : '#00FF94',
                  fontFamily: 'inherit', fontSize: '1.2rem', cursor: page <= 1 ? 'default' : 'pointer',
                }}
              >{isRtl ? 'قبلی' : 'Prev'}</button>
              <span style={{ color: '#888', fontSize: '1.15rem' }}>{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #333',
                  background: page >= totalPages ? 'transparent' : 'rgba(0,255,148,0.1)',
                  color: page >= totalPages ? '#444' : '#00FF94',
                  fontFamily: 'inherit', fontSize: '1.2rem', cursor: page >= totalPages ? 'default' : 'pointer',
                }}
              >{isRtl ? 'بعدی' : 'Next'}</button>
            </div>
          )}
        </div>
      )}

      {selectedLog && (
        <div onClick={() => setSelectedLog(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '2rem',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#141414', borderRadius: '12px', border: '1px solid #333',
            maxWidth: '700px', width: '100%', maxHeight: '80vh',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 2rem', borderBottom: '1px solid #222',
            }}>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                {selectedLog.action}{' '}
                <span style={{ color: '#888', fontWeight: 400 }}>on</span>{' '}
                {selectedLog.entityType}{selectedLog.entityId ? ` #${selectedLog.entityId}` : ''}
              </span>
              <button onClick={() => setSelectedLog(null)} style={{
                background: 'none', border: 'none', color: '#666', fontSize: '2rem',
                cursor: 'pointer', lineHeight: 1, padding: '0 0.5rem',
              }}>×</button>
            </div>
            <div style={{ padding: '2rem', overflow: 'auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#555', fontSize: '1.05rem' }}>Admin</span>
                <div style={{ color: '#fff', marginTop: '0.2rem' }}>{selectedLog.adminUsername}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#555', fontSize: '1.05rem' }}>Time</span>
                <div style={{ color: '#fff', marginTop: '0.2rem' }}>{new Date(selectedLog.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#555', fontSize: '1.05rem' }}>Action</span>
                <div style={{ marginTop: '0.3rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '3px', fontSize: '1.1rem', fontWeight: 600,
                    background: `${ACTION_COLORS[selectedLog.action] || '#888'}18`,
                    color: ACTION_COLORS[selectedLog.action] || '#888',
                  }}>{selectedLog.action}</span>
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#555', fontSize: '1.05rem' }}>Entity</span>
                <div style={{ color: '#fff', marginTop: '0.2rem' }}>{selectedLog.entityType}{selectedLog.entityId ? ` #${selectedLog.entityId}` : ''}</div>
              </div>
              {selectedLog.details && (() => {
                const parsed = JSON.parse(selectedLog.details);
                const hasDiff = parsed.diff && Object.keys(parsed.diff).length > 0;
                return (
                  <div>
                    {hasDiff ? (
                      <div>
                        <span style={{ color: '#555', fontSize: '1.05rem' }}>Changes</span>
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {Object.entries(parsed.diff).map(([field, vals]) => (
                            <div key={field} style={{
                              background: '#0d0d0d', borderRadius: '6px', padding: '1rem',
                              border: '1px solid #1a1a1a',
                            }}>
                              <div style={{ color: '#888', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 600 }}>{field}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <div style={{ color: '#ff6b6b', fontSize: '1.05rem' }}>
                                  <span style={{ color: '#555', fontSize: '0.9rem', marginRight: '0.5rem' }}>−</span>
                                  {JSON.stringify(vals.old) === '""' ? <span style={{ color: '#555', fontStyle: 'italic' }}>empty</span> : String(vals.old)}
                                </div>
                                <div style={{ color: '#00FF94', fontSize: '1.05rem' }}>
                                  <span style={{ color: '#555', fontSize: '0.9rem', marginRight: '0.5rem' }}>+</span>
                                  {JSON.stringify(vals.new) === '""' ? <span style={{ color: '#555', fontStyle: 'italic' }}>empty</span> : String(vals.new)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <span style={{ color: '#555', fontSize: '1.05rem' }}>Details</span>
                        <pre style={{
                          background: '#0d0d0d', borderRadius: '6px', padding: '1.2rem',
                          marginTop: '0.5rem', overflow: 'auto', fontSize: '1.05rem',
                          color: '#b4b4b4', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          fontFamily: 'monospace', lineHeight: 1.5, maxHeight: '300px',
                        }}>{JSON.stringify(parsed, null, 2)}</pre>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
