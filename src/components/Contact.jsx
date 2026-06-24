import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from './Toast';

export default function Contact() {
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, turnstileToken: 'bypass' }),
      });
      if (res.ok) {
        success(t('contact.success'));
        setName('');
        setMessage('');
      } else {
        toastError(t('contact.error'));
      }
    } catch {
      toastError(t('contact.error'));
    }
    setSending(false);
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
          <button type="submit" className="contact__submit-btn" disabled={sending}>
            {sending ? t('contact.sending') : t('contact.submit')}
          </button>
        </form>
        <span className="contact__illustration">
          <img src="/assets/illustrations/connect.svg" alt={t('contact.title')} />
        </span>
      </div>
    </section>
  );
}
