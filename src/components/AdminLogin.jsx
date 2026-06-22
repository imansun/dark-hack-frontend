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
      <div style={{ ...styles.card, direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="title" style={styles.title}>
          {t('login.title')},<br />
          <span style={styles.titleSpan}>{t('login.subtitle')}</span>
        </div>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <input
            type="text"
            placeholder={t('login.usernamePlaceholder')}
            name="email"
            className="input"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
            style={{
              ...styles.input,
              borderColor: errorType === ERR_TYPE.REQUIRED || errorType === ERR_TYPE.SHORT || errorType === ERR_TYPE.INVALID ? '#ff6b6b' : styles.input.borderColor,
            }}
            autoFocus
            autoComplete="username"
            disabled={loading}
          />
          <input
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            name="password"
            className="input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
            style={{
              ...styles.input,
              borderColor: errorType === ERR_TYPE.REQUIRED || errorType === ERR_TYPE.INVALID ? '#ff6b6b' : styles.input.borderColor,
            }}
            autoComplete="current-password"
            disabled={loading}
          />

          <div className="login-with" style={styles.loginWith}>
            <div className="button-log" style={styles.buttonLog}>&#63743;</div>
            <div className="button-log" style={styles.buttonLog}>
              <svg style={styles.icon} height="56.6934px" id="Layer_1" version="1.1" viewBox="0 0 56.6934 56.6934" width="56.6934px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z" /></svg>
            </div>
            <div className="button-log" style={styles.buttonLog}>
              <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="56.693px" viewBox="0 0 56.693 56.693" version="1.1" id="Layer_1" height="56.693px" style={styles.icon}><path d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029  c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77  L40.43,21.739z" /></svg>
            </div>
          </div>

          <button
            type="submit"
            className="button-confirm"
            disabled={loading}
            style={{
              ...styles.buttonConfirm,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? t('login.submitting') : `${t('login.submit')} →`}
          </button>
        </form>

        {error && (
          <div style={styles.errorBox} role="alert">
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
            <span style={{ color: errorType === ERR_TYPE.EXPIRED ? '#ffa500' : '#ff6b6b', fontSize: '1.3rem', fontWeight: 600 }}>{error}</span>
          </div>
        )}
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
    padding: '20px',
    background: 'lightgrey',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '20px',
    borderRadius: '5px',
    border: '2px solid #323232',
    boxShadow: '4px 4px #323232',
  },
  title: {
    color: '#323232',
    fontWeight: 900,
    fontSize: '20px',
    marginBottom: '25px',
  },
  titleSpan: {
    color: '#666',
    fontWeight: 600,
    fontSize: '17px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    width: '100%',
    height: '40px',
    borderRadius: '5px',
    border: '2px solid #323232',
    backgroundColor: '#fff',
    boxShadow: '4px 4px #323232',
    fontSize: '15px',
    fontWeight: 600,
    color: '#323232',
    padding: '5px 10px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  loginWith: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    width: '100%',
  },
  buttonLog: {
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '100%',
    border: '2px solid #323232',
    backgroundColor: '#fff',
    boxShadow: '4px 4px #323232',
    color: '#323232',
    fontSize: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '24px',
    height: '24px',
    fill: '#323232',
  },
  buttonConfirm: {
    width: '120px',
    height: '40px',
    borderRadius: '5px',
    border: '2px solid #323232',
    backgroundColor: '#fff',
    boxShadow: '4px 4px #323232',
    fontSize: '17px',
    fontWeight: 600,
    color: '#323232',
    cursor: 'pointer',
    fontFamily: 'inherit',
    margin: '0 auto',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.2rem 1.4rem',
    borderRadius: '10px',
    border: '1px solid #ff6b6b',
    background: 'rgba(255, 107, 107, 0.06)',
    width: '100%',
    boxSizing: 'border-box',
  },
};
