export default function PostDetailContent({ title, subtitle, contentHtml, children }) {
  if (contentHtml) {
    return (
      <div
        style={{ marginTop: 24, fontSize: '1.6rem', color: '#475569', lineHeight: 1.625 }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    );
  }

  return (
    <div style={{ marginTop: 24, fontSize: '1.6rem', color: '#475569', lineHeight: 1.625 }}>
      {title && (
        <h1 style={{
          fontSize: '2rem', fontWeight: 500, color: '#0f172a', marginBottom: 4,
          lineHeight: 1.3,
        }} className="post-content-h1">
          {title}
        </h1>
      )}
      {subtitle && (
        <h3 style={{ marginTop: 4, fontWeight: 400, fontSize: '1.6rem', color: '#475569' }}>
          {subtitle}
        </h3>
      )}

      <img
        style={{ marginTop: 20, height: 320, width: '100%', borderRadius: 10, objectFit: 'cover', objectPosition: 'center' }}
        src="/images/objects/object-2.jpg"
        alt="postimage"
      />
      <p style={{ fontSize: '1.3rem', marginTop: 4, textAlign: 'center', color: '#94a3b8' }}>
        عکس از <a href="##" style={{ textDecoration: 'underline', color: '#94a3b8' }}>Unsplash</a>
      </p>

      <br />
      <p>
        تغییرات عمده‌ای اخیراً در زندگی من رخ داده است، هم از نظر شخصی و هم حرفه‌ای. نزدیک به پنج سال از آغاز این وبلاگ می‌گذرد و بازگشت به پست‌های اردیبهشت ۸۳ تجربه جالبی است. فکر می‌کنم هدف دفترچه خاطرات و ژورنال‌ها هم همین است؛ فرصتی برای بازگشت و مرور افکار و ایده‌های گذشته. نوعی سفر ذهنی در زمان.
      </p>
      <br />
      <p>
        یک چیز قطعی است: من دیگر آن فرد سابق نیستم. در واقع، حتی نسبت به سال گذشته یا سال‌های قبل هم تغییر کرده‌ام. شاید بخشی از ترکیب بدنی آن فرد را داشته باشم (ما مرتباً سلول‌های بدنمان را از دست می‌دهیم و تولید می‌کنیم)، اما قطعاً در فرکانس متفاوتی هستیم.
      </p>

      <br />
      <div style={{ borderLeft: '4px solid #cbd5e1', paddingLeft: 16, margin: '16px 0' }}>
        <p style={{ fontStyle: 'italic', fontWeight: 500, color: '#1e293b' }}>
          چرا Tailwind استایل‌های پیش‌فرض h1 من را حذف می‌کند؟ چطور می‌توانم این را غیرفعال کنم؟ یعنی همه استایل‌های پایه دیگر را هم از دست می‌دهم؟
        </p>
      </div>

      <br />
      <p>
        یک چیز قطعی است: من دیگر آن فرد سابق نیستم. در واقع، حتی نسبت به سال گذشته یا سال‌های قبل هم تغییر کرده‌ام. شاید بخشی از ترکیب بدنی آن فرد را داشته باشم (ما مرتباً سلول‌های بدنمان را از دست می‌دهیم و تولید می‌کنیم)، اما قطعاً در فرکانس متفاوتی هستیم.
      </p>
      <br />
      <p>
        کل این ماجرای وبلاگ‌نویسی به عنوان مستندسازی ایده‌های عجیب و غریب من شروع شد. آن زمان وقت زیادی داشتم و به همین دلیل پست‌ها زیاد بودند. با گذشت زمان، تعداد پست‌ها کمتر شد اما تمرکز آن‌ها کمی بیشتر شد.
      </p>

      <br />
      <ul style={{ paddingLeft: 20, listStylePosition: 'inside', listStyle: 'disc', fontWeight: 500, color: '#1e293b' }}>
        <li>حالا این داستانی است درباره اینکه چطور زندگی من کاملاً زیر و رو شد</li>
        <li>و دوست دارم یک دقیقه وقت بگذاری و همین‌جا بنشینی</li>
        <li>تا برایت تعریف کنم چطور شاهزاده شهری به نام بل-ایر شدم</li>
      </ul>

      <br />
      <p>
        تغییرات عمده‌ای اخیراً در زندگی من رخ داده است، هم از نظر شخصی و هم حرفه‌ای. نزدیک به پنج سال از آغاز این وبلاگ می‌گذرد و بازگشت به پست‌های اردیبهشت ۸۳ تجربه جالبی است.
      </p>
      {children}
      <style>{`
        @media (min-width: 1024px) {
          .post-content-h1 { font-size: 2.4rem !important; }
        }
        .dark .post-content-h1 { color: #e6e7eb !important; }
      `}</style>
    </div>
  );
}
