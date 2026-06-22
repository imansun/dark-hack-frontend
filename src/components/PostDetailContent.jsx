import '../styles/post-detail.css';

export default function PostDetailContent({ title, subtitle, contentHtml, children }) {
  if (contentHtml) {
    return <div className="pd-body-text" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: contentHtml }} />;
  }

  return (
    <div className="pd-body-text" style={{ marginTop: 24 }}>
      {title && <h1 className="pd-title">{title}</h1>}
      {subtitle && <h3 style={{ marginTop: 4, fontWeight: 400, fontSize: '1.6rem', color: '#475569' }}>{subtitle}</h3>}
      <img style={{ marginTop: 20, height: 320, width: '100%', borderRadius: 10, objectFit: 'cover', objectPosition: 'center' }} src="/images/objects/object-2.jpg" alt="postimage" />
      <p style={{ fontSize: '1.3rem', marginTop: 4, textAlign: 'center', color: '#94a3b8' }}>
        عکس از <a href="##" style={{ textDecoration: 'underline', color: '#94a3b8' }}>Unsplash</a>
      </p>
      <br />
      <p>تغییرات عمده‌ای اخیراً در زندگی من رخ داده است...</p>
      <br />
      <p>یک چیز قطعی است: من دیگر آن فرد سابق نیستم...</p>
      <br />
      <div style={{ borderLeft: '4px solid #cbd5e1', paddingLeft: 16, margin: '16px 0' }}>
        <p style={{ fontStyle: 'italic', fontWeight: 500, color: '#1e293b' }}>چرا Tailwind استایل‌های پیش‌فرض h1 من را حذف می‌کند؟</p>
      </div>
      <br />
      <p>یک چیز قطعی است: من دیگر آن فرد سابق نیستم...</p>
      <br />
      <p>کل این ماجرای وبلاگ‌نویسی به عنوان مستندسازی ایده‌های عجیب و غریب من شروع شد...</p>
      <br />
      <ul>
        <li>حالا این داستانی است درباره اینکه چطور زندگی من کاملاً زیر و رو شد</li>
        <li>و دوست دارم یک دقیقه وقت بگذاری و همین‌جا بنشینی</li>
        <li>تا برایت تعریف کنم چطور شاهزاده شهری به نام بل-ایر شدم</li>
      </ul>
      <br />
      <p>تغییرات عمده‌ای اخیراً در زندگی من رخ داده است...</p>
      {children}
    </div>
  );
}
