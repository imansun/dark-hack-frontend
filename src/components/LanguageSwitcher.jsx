import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'fa', label: 'FA', full: 'فارسی', dir: 'rtl' },
  { code: 'en', label: 'EN', full: 'English', dir: 'ltr' },
  { code: 'ar', label: 'AR', full: 'العربية', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    const dir = LANGUAGES.find((l) => l.code === code)?.dir || 'rtl';
    document.documentElement.lang = code;
    document.documentElement.dir = dir;
  };

  return (
    <div className="lang-radio">
      {LANGUAGES.map((l) => (
        <label key={l.code} className="lang-radio__label">
          <div className="lang-radio__back-side" />
          <input
            type="radio"
            name="lang-radio"
            value={l.code}
            checked={i18n.language === l.code}
            onChange={() => handleChange(l.code)}
          />
          <span className="lang-radio__text">{l.label}</span>
          <span className="lang-radio__bottom-line" />
        </label>
      ))}
    </div>
  );
}
