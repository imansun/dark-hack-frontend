import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WorkManager from './WorkManager';
import AdminProfile from './AdminProfile';
import AdminServices from './AdminServices';
import AdminContacts from './AdminContacts';
import AdminBlog from './AdminBlog';
import AdminCategories from './AdminCategories';
import AdminComments from './AdminComments';
import AdminSubscribers from './AdminSubscribers';
import AdminAuditLog from './AdminAuditLog';

const NAV_ITEMS = [
  { key: 'profile', labelFa: 'پروفایل', labelEn: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'services', labelFa: 'خدمات', labelEn: 'Services', icon: 'M21.5 8.5L18 5l-3.5 3.5M18 5v11M8.5 15.5L5 19l3.5 3.5M5 19h11M15.5 5.5l3.5-3.5 3.5 3.5M19 2v3h-3M5.5 18.5L2 22l3.5 3.5M2 22h3v-3' },
  { key: 'works', labelFa: 'نمونه‌کارها', labelEn: 'Works', icon: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 3v18M3 9h18' },
  { key: 'blog', labelFa: 'مقالات', labelEn: 'Blog', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  { key: 'categories', labelFa: 'دسته‌بندی‌ها', labelEn: 'Categories', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { key: 'comments', labelFa: 'نظرات', labelEn: 'Comments', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' },
  { key: 'subscribers', labelFa: 'مشترکین', labelEn: 'Subscribers', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z' },
  { key: 'auditlog', labelFa: 'لاگ فعالیت‌ها', labelEn: 'Audit Log', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  { key: 'contacts', labelFa: 'پیام‌ها', labelEn: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function AdminDashboard({ token, onLogout }) {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('works');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0d', direction: isRtl ? 'rtl' : 'ltr' }}>
      <aside style={{
        width: sidebarOpen ? '240px' : '0px',
        overflow: 'hidden',
        background: '#141414',
        borderLeft: isRtl ? '1px solid #222' : 'none',
        borderRight: isRtl ? 'none' : '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(0,255,148,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Dark<span style={{ color: '#00FF94' }}>Panel</span></div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '1.2rem',
                padding: '1.2rem 1.5rem', border: 'none', cursor: 'pointer',
                background: activeTab === item.key ? 'rgba(0,255,148,0.08)' : 'transparent',
                borderRight: activeTab === item.key ? `3px solid #00FF94` : '3px solid transparent',
                borderLeft: isRtl && activeTab === item.key ? `3px solid #00FF94` : isRtl ? '3px solid transparent' : 'none',
                fontFamily: 'inherit', fontSize: '1.4rem', fontWeight: activeTab === item.key ? 700 : 500,
                color: activeTab === item.key ? '#00FF94' : '#666',
                transition: 'all 0.15s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span style={{ whiteSpace: 'nowrap' }}>{isRtl ? item.labelFa : item.labelEn}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #222' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
              padding: '1rem', border: '1px solid #ff4757', borderRadius: '8px',
              background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '1.3rem', fontWeight: 700, color: '#ff4757',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {isRtl ? 'خروج' : 'Logout'}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.2rem 2rem', background: '#141414', borderBottom: '1px solid #222',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem', color: '#888',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span style={{ color: '#888', fontSize: '1.3rem' }}>
              {NAV_ITEMS.find((n) => n.key === activeTab) ? (isRtl ? NAV_ITEMS.find((n) => n.key === activeTab).labelFa : NAV_ITEMS.find((n) => n.key === activeTab).labelEn) : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#666', fontSize: '1.2rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          {activeTab === 'profile' && <AdminProfile token={token} onUnauthorized={onLogout} />}
          {activeTab === 'services' && <AdminServices token={token} onUnauthorized={onLogout} />}
          {activeTab === 'works' && <WorkManager token={token} onLogout={onLogout} />}
          {activeTab === 'blog' && <AdminBlog token={token} onUnauthorized={onLogout} />}
          {activeTab === 'categories' && <AdminCategories token={token} onUnauthorized={onLogout} />}
          {activeTab === 'comments' && <AdminComments token={token} onUnauthorized={onLogout} />}
          {activeTab === 'subscribers' && <AdminSubscribers token={token} onUnauthorized={onLogout} />}
          {activeTab === 'auditlog' && <AdminAuditLog token={token} onUnauthorized={onLogout} />}
          {activeTab === 'contacts' && <AdminContacts token={token} onUnauthorized={onLogout} />}
        </main>
      </div>
    </div>
  );
}