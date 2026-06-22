import { useTranslation } from 'react-i18next';

export default function Footer({ adminMode, toggleAdmin }) {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <span className="footer__credit">{t('footer.credit')}</span>{' '}
      <a href="https://github.com/ImanNorouziEsfajir" target="_blank" className="footer__link">ImanNorouziEsfajir</a>
      <span style={{ margin: '0 1rem' }}>|</span>
      <button
        onClick={toggleAdmin}
        className="footer__admin-btn"
      >
        {adminMode ? 'مشاهده سایت' : 'مدیریت نمونه کار'}
      </button>
    </footer>
  );
}
