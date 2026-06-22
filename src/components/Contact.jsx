import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section container">
      <h2 className="section__title">{t('contact.title')}</h2>
      <div className="contact">
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field-wrapper">
            <label htmlFor="contactNameTxt">{t('contact.name')}</label>
            <input
              id="contactNameTxt"
              type="text"
              placeholder={t('contact.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="contact__field-wrapper">
            <label htmlFor="contactDescriptionTxt">{t('contact.message')}</label>
            <textarea
              id="contactDescriptionTxt"
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="contact__submit-btn">{t('contact.submit')}</button>
          {status === 'sending' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#00FF94' }}>{t('contact.sending')}</p>}
          {status === 'success' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#00FF94' }}>{t('contact.success')}</p>}
          {status === 'error' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#ff6b6b' }}>{t('contact.error')}</p>}
        </form>
        <span className="contact__illustration">
          <img src="/assets/illustrations/connect.svg" alt={t('contact.title')} />
        </span>
      </div>
    </section>
  );
}
