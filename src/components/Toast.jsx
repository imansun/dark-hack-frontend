import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error', 5000), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.8rem', pointerEvents: 'none' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '1.2rem 2rem',
              borderRadius: '10px',
              background: t.type === 'success' ? '#00FF94' : '#ff4757',
              color: '#111',
              fontWeight: 700,
              fontSize: '1.4rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              pointerEvents: 'auto',
              animation: 'toastIn 0.3s ease-out',
              textAlign: 'center',
              minWidth: '280px',
              maxWidth: '500px',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}