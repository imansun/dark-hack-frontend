import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ERR_TYPE = {
  REQUIRED: 'required',
  SHORT: 'short',
  INVALID: 'invalid',
  NETWORK: 'network',
  SERVER: 'server',
  EXPIRED: 'expired',
};

export default function AdminLogin({ onLogin, expired }) {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  useEffect(() => {
    if (expired) {
      setError(t('login.errorExpired'));
      setErrorType(ERR_TYPE.EXPIRED);
    }
  }, [expired, t]);

  const validate = () => {
    if (!username.trim() || !password.trim()) {
      setError(t('login.errorRequired'));
      setErrorType(ERR_TYPE.REQUIRED);
      return false;
    }
    if (username.trim().length < 3) {
      setError(t('login.errorShort'));
      setErrorType(ERR_TYPE.SHORT);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.status === 401) {
        setError(t('login.errorInvalid'));
        setErrorType(ERR_TYPE.INVALID);
        return;
      }

      if (!res.ok) {
        setError(t('login.errorServer'));
        setErrorType(ERR_TYPE.SERVER);
        return;
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.access_token);
      onLogin(data.access_token);
    } catch {
      setError(t('login.errorNetwork'));
      setErrorType(ERR_TYPE.NETWORK);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay} />
      <div
        style={{
          ...styles.card,
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 style={styles.title}>{t('login.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="loginUser">{t('login.username')}</label>
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: focusedField === 'user' ? '#00FF94' : errorType === ERR_TYPE.REQUIRED || errorType === ERR_TYPE.SHORT || errorType === ERR_TYPE.INVALID ? '#ff6b6b' : '#333',
              }}
            >
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#688277" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="loginUser"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
                onFocus={() => setFocusedField('user')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('login.usernamePlaceholder')}
                autoFocus
                autoComplete="username"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="loginPass">{t('login.password')}</label>
            <div
              style={{
                ...styles.inputWrapper,
                borderColor: focusedField === 'pass' ? '#00FF94' : errorType === ERR_TYPE.REQUIRED || errorType === ERR_TYPE.INVALID ? '#ff6b6b' : '#333',
              }}
            >
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#688277" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="loginPass"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                onFocus={() => setFocusedField('pass')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('login.passwordPlaceholder')}
                autoComplete="current-password"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading && (
              <span style={styles.spinner}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
              </span>
            )}
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
        </form>

        {error && (
          <div
            style={{
              ...styles.errorBox,
              borderColor: errorType === ERR_TYPE.EXPIRED ? '#ffa500' : '#ff6b6b',
            }}
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={errorType === ERR_TYPE.EXPIRED ? '#ffa500' : '#ff6b6b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {errorType === ERR_TYPE.NETWORK ? (
                <>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </>
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
              {errorType !== ERR_TYPE.NETWORK && <line x1="12" y1="8" x2="12" y2="12" />}
              {errorType !== ERR_TYPE.NETWORK && <line x1="12" y1="16" x2="12.01" y2="16" />}
            </svg>
            <span style={{ ...styles.errorText, color: errorType === ERR_TYPE.EXPIRED ? '#ffa500' : '#ff6b6b' }}>{error}</span>
          </div>
        )}

        <div style={styles.footer}>
          <span style={styles.footerText}>Panel v1.0</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    position: 'relative',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #111 70%)',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '3.5rem 3rem 2.5rem',
    boxShadow: '0 0 40px rgba(0, 255, 148, 0.05), 0 8px 32px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  logo: {
    display: 'inline-flex',
    padding: '1rem',
    borderRadius: '12px',
    background: 'rgba(0, 255, 148, 0.08)',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  fieldGroup: {
    marginBottom: '2rem',
  },
  label: {
    display: 'block',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '0.8rem',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '2px solid #333',
    borderRadius: '10px',
    padding: '0 1.4rem',
    transition: 'border-color 0.2s',
    background: '#131313',
  },
  inputIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '1.5rem',
    padding: '1.2rem 0',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    padding: '1.3rem',
    borderRadius: '10px',
    border: 'none',
    background: '#00FF94',
    color: '#111',
    fontFamily: 'inherit',
    fontSize: '1.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    marginTop: '1rem',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  spinner: {
    display: 'inline-flex',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    padding: '1.2rem 1.4rem',
    borderRadius: '10px',
    border: '1px solid',
    background: 'rgba(255, 107, 107, 0.06)',
  },
  errorText: {
    fontSize: '1.3rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: '3rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '1.1rem',
    color: '#444',
    letterSpacing: '0.05em',
  },
};