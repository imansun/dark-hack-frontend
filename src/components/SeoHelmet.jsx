import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function SeoHelmet({ title, description, image, url, type }) {
  const { t, i18n } = useTranslation();
  const siteTitle = t('seo.title');
  const siteDesc = t('seo.description');
  const siteKeywords = t('seo.keywords');
  const ogImageAlt = t('seo.ogImageAlt');
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDesc = description || siteDesc;
  const pageUrl = url || 'https://imannorouzi.ir';
  const ogImage = image || '/assets/icons/apple-touch-icon-180x180.png';
  const langMap = { fa: 'fa-IR', en: 'en-US', ar: 'ar-SA' };
  const currentLang = langMap[i18n.language] || 'fa-IR';

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Iman Norouzi Esfajir',
    url: 'https://imannorouzi.ir',
    image: 'https://imannorouzi.ir/assets/icons/apple-touch-icon-180x180.png',
    jobTitle: 'AI Specialist, Software Architect, Online Systems Security Expert',
    knowsAbout: ['Artificial Intelligence', 'Software Architecture', 'Cybersecurity', 'Web Development'],
    sameAs: ['https://github.com/ImanNorouziEsfajir'],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: 'https://imannorouzi.ir',
    description: siteDesc,
    inLanguage: currentLang,
  };

  const jsonLd = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: pageDesc,
    image: ogImage,
    author: { '@type': 'Person', name: 'Iman Norouzi Esfajir' },
  } : null;

  return (
    <Helmet>
      <html lang={i18n.language} dir={i18n.language === 'fa' || i18n.language === 'ar' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Iman Norouzi Esfajir" />

      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={currentLang} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      <link rel="alternate" hrefLang="fa" href="https://imannorouzi.ir" />
      <link rel="alternate" hrefLang="en" href="https://imannorouzi.ir/en" />
      <link rel="alternate" hrefLang="ar" href="https://imannorouzi.ir/ar" />
      <link rel="alternate" hrefLang="x-default" href="https://imannorouzi.ir" />

      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
