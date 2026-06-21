import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'fa', label: 'فارسی', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    const dir = LANGUAGES.find((l) => l.code === lang)?.dir || 'rtl';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="lang-switcher"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
