import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuthorInfoCard() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/profile?lang=${i18n.language}`)
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {});
  }, [i18n.language]);

  if (!profile) return null;

  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{profile.name}</h3>
      <p style={{ fontSize: '1.3rem', color: '#688277' }}>{profile.title}</p>
    </div>
  );
}
