import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'terminal_commands';

const DEFAULT_COMMANDS = [
  { id: '1', command: 'help', description: 'نمایش این راهنما', descriptionEn: 'Show this help', response: 'دستورات موجود:\n  help     - نمایش این راهنما\n  about    - درباره من\n  skills   - مهارت‌ها\n  projects - پروژه‌ها\n  contact  - ارتباط\n  social   - شبکه‌های اجتماعی\n  whoami   - اطلاعات کاربر\n  clear    - پاک کردن ترمینال', responseEn: 'Available commands:\n  help     - Show this help\n  about    - About me\n  skills   - Skills\n  projects - Projects\n  contact  - Contact\n  social   - Social media\n  whoami   - User info\n  clear    - Clear terminal' },
  { id: '2', command: 'about', description: 'درباره من', descriptionEn: 'About me', response: 'توسعه‌دهنده فول‌استک با علاقه به طراحی مدرن و تجربه کاربری عالی. متخصص در React, NestJS, و تکنولوژی‌های وب.', responseEn: 'Full-stack developer passionate about modern design and great UX. Expert in React, NestJS, and web technologies.' },
  { id: '3', command: 'skills', description: 'مهارت‌ها', descriptionEn: 'Skills', response: 'مهارت‌ها: React, NestJS, TypeScript, MySQL, Docker, Git, HTML/CSS, JavaScript, REST API, UI/UX Design', responseEn: 'Skills: React, NestJS, TypeScript, MySQL, Docker, Git, HTML/CSS, JavaScript, REST API, UI/UX Design' },
  { id: '4', command: 'projects', description: 'تعداد پروژه‌ها', descriptionEn: 'Projects', response: 'برای مشاهده پروژه‌ها به بخش Works مراجعه کنید.', responseEn: 'Check the Works section to see projects.' },
  { id: '5', command: 'contact', description: 'راه‌های ارتباطی', descriptionEn: 'Contact info', response: 'ایمیل: imannorouzi@example.com\nجهت ارسال پیام، به بخش Contact مراجعه کنید.', responseEn: 'Email: imannorouzi@example.com\nVisit the Contact section to send a message.' },
  { id: '6', command: 'social', description: 'شبکه‌های اجتماعی', descriptionEn: 'Social media', response: 'GitHub: github.com/ImanNorouziEsfajir\nLinkedIn: linkedin.com/in/imannorouzi', responseEn: 'GitHub: github.com/ImanNorouziEsfajir\nLinkedIn: linkedin.com/in/imannorouzi' },
  { id: '7', command: 'whoami', description: 'اطلاعات کاربر', descriptionEn: 'User info', response: 'کاربر: Iman Norouzi Esfajir\nنقش: توسعه‌دهنده فول‌استک\nوضعیت: فعال', responseEn: 'User: Iman Norouzi Esfajir\nRole: Full-stack Developer\nStatus: Active' },
];

function loadCommands() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_COMMANDS;
}

function saveCommands(commands) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(commands));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function AdminTerminal() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  const [mode, setMode] = useState('terminal');
  const [commands, setCommands] = useState(() => loadCommands());
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [filteredHints, setFilteredHints] = useState([]);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ command: '', description: '', descriptionEn: '', response: '', responseEn: '' });

  useEffect(() => {
    saveCommands(commands);
  }, [commands]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (mode === 'terminal' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val.startsWith('/')) {
      const query = val.slice(1).toLowerCase();
      const filtered = commands.filter(
        (c) =>
          c.command.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.descriptionEn.toLowerCase().includes(query)
      );
      setFilteredHints(filtered);
      setShowHints(true);
    } else {
      setShowHints(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (showHints) {
        setShowHints(false);
      }
      handleCommand(input);
    } else if (e.key === 'Escape') {
      setShowHints(false);
      setInput('');
    }
  };

  const handleCommand = async (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines((prev) => [...prev, { type: 'input', text: `$ ${trimmed}` }]);
    setInput('');

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    if (trimmed === 'help') {
      const cmdList = commands
        .filter((c) => c.command !== 'clear')
        .map((c) => {
          const desc = isRtl ? c.description : c.descriptionEn;
          return `  ${c.command.padEnd(12)} ${desc}`;
        })
        .join('\n');
      const header = isRtl ? 'دستورات موجود:\n' : 'Available commands:\n';
      setLines((prev) => [...prev, { type: 'output', text: header + cmdList }]);
      return;
    }

    const found = commands.find((c) => c.command === trimmed);
    if (found) {
      const text = isRtl ? found.response : (found.responseEn || found.response);
      await new Promise((r) => setTimeout(r, 200));
      setLines((prev) => [...prev, { type: 'output', text }]);
    } else {
      const msg = isRtl
        ? `دستور ناشناخته: ${cmd}. برای راهنما / یا help را وارد کنید.`
        : `Unknown command: ${cmd}. Type / or help for available commands.`;
      setLines((prev) => [...prev, { type: 'error', text: msg }]);
    }
  };

  const addCommand = () => {
    if (!form.command.trim()) return;
    const newCmd = {
      id: generateId(),
      command: form.command.trim().toLowerCase(),
      description: form.description.trim() || form.command,
      descriptionEn: form.descriptionEn.trim() || form.command,
      response: form.response.trim() || '',
      responseEn: form.responseEn.trim() || '',
    };
    setCommands((prev) => [...prev, newCmd]);
    resetForm();
  };

  const updateCommand = () => {
    if (!form.command.trim() || !editItem) return;
    setCommands((prev) =>
      prev.map((c) =>
        c.id === editItem.id
          ? {
              ...c,
              command: form.command.trim().toLowerCase(),
              description: form.description.trim() || form.command,
              descriptionEn: form.descriptionEn.trim() || form.command,
              response: form.response.trim() || '',
              responseEn: form.responseEn.trim() || '',
            }
          : c
      )
    );
    resetForm();
  };

  const deleteCommand = (id) => {
    if (window.confirm(isRtl ? 'حذف شود؟' : 'Delete?')) {
      setCommands((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const resetForm = () => {
    setEditItem(null);
    setForm({ command: '', description: '', descriptionEn: '', response: '', responseEn: '' });
  };

  const startEdit = (cmd) => {
    setEditItem(cmd);
    setForm({
      command: cmd.command,
      description: cmd.description,
      descriptionEn: cmd.descriptionEn || '',
      response: cmd.response,
      responseEn: cmd.responseEn || '',
    });
  };

  const hintClick = (cmd) => {
    setShowHints(false);
    handleCommand(cmd.command);
  };

  const terminalView = (
    <div>
      <div
        ref={terminalRef}
        style={{
          background: '#0a0a0a',
          border: '1px solid #2a2a2a',
          borderRadius: '10px',
          overflow: 'hidden',
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          fontSize: '1.3rem',
          direction: 'ltr',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: '#141414', borderBottom: '1px solid #222' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></span>
          <span style={{ marginLeft: 'auto', fontSize: '1rem', color: '#555' }}>admin@panel:~$</span>
        </div>
        <div style={{ padding: '14px', maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
          {lines.length === 0 && (
            <div style={{ color: '#555', marginBottom: '8px' }}>
              {isRtl ? 'برای مشاهده دستورات / را وارد کنید' : 'Type / to see available commands'}
            </div>
          )}
          {lines.map((line, i) => (
            <div key={i} style={{ lineHeight: '1.7', marginBottom: '2px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {line.type === 'input' && <span style={{ color: '#00FF94', marginRight: '8px' }}>$</span>}
              <span style={{
                color: line.type === 'error' ? '#ff5f56' : line.type === 'output' ? '#00FF94' : '#fff',
              }}>{line.text}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{ color: '#00FF94', marginRight: '8px', flexShrink: 0 }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontFamily: 'inherit', fontSize: 'inherit',
                caretColor: '#00FF94', padding: 0, minWidth: 0,
              }}
            />
            <span style={{
              display: 'inline-block', width: '8px', height: '1.2em',
              background: '#00FF94', animation: 'blink 1s step-end infinite',
              marginLeft: '2px', flexShrink: 0,
            }}></span>
          </div>
        </div>
        {showHints && filteredHints.length > 0 && (
          <div className="term-hints" style={{ margin: '0 14px 14px' }}>
            {filteredHints.map((cmd) => (
              <div
                key={cmd.id}
                className="term-hints-item"
                onClick={() => hintClick(cmd)}
              >
                <span className="term-hints-cmd">{cmd.command}</span>
                <span className="term-hints-desc">{isRtl ? cmd.description : cmd.descriptionEn}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const manageView = (
    <div>
      <div style={{
        background: '#141414', border: '1px solid #333', borderRadius: '10px',
        padding: '2rem', marginBottom: '2rem',
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00FF94', marginBottom: '1.5rem' }}>
          {editItem ? (isRtl ? 'ویرایش دستور' : 'Edit Command') : (isRtl ? 'دستور جدید' : 'New Command')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '1.2rem', color: '#888', marginBottom: '0.3rem' }}>Command</label>
            <input
              value={form.command}
              onChange={(e) => setForm({ ...form, command: e.target.value })}
              placeholder="e.g. about"
              style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '6px',
                border: '1px solid #333', background: '#0d0d0d', color: '#fff',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.3rem', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '1.2rem', color: '#888', marginBottom: '0.3rem' }}>
              {isRtl ? 'توضیحات (فارسی)' : 'Description (FA)'}
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={isRtl ? 'درباره من' : 'About me'}
              style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '6px',
                border: '1px solid #333', background: '#0d0d0d', color: '#fff',
                fontFamily: 'inherit', fontSize: '1.3rem', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '1.2rem', color: '#888', marginBottom: '0.3rem' }}>Description (EN)</label>
            <input
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              placeholder="About me"
              style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '6px',
                border: '1px solid #333', background: '#0d0d0d', color: '#fff',
                fontFamily: 'inherit', fontSize: '1.3rem', outline: 'none',
              }}
            />
          </div>
          <div></div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '1.2rem', color: '#888', marginBottom: '0.3rem' }}>
              {isRtl ? 'پاسخ (فارسی)' : 'Response (FA)'}
            </label>
            <textarea
              value={form.response}
              onChange={(e) => setForm({ ...form, response: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '6px',
                border: '1px solid #333', background: '#0d0d0d', color: '#fff',
                fontFamily: 'inherit', fontSize: '1.3rem', outline: 'none', resize: 'vertical',
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '1.2rem', color: '#888', marginBottom: '0.3rem' }}>Response (EN)</label>
            <textarea
              value={form.responseEn}
              onChange={(e) => setForm({ ...form, responseEn: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '6px',
                border: '1px solid #333', background: '#0d0d0d', color: '#fff',
                fontFamily: 'inherit', fontSize: '1.3rem', outline: 'none', resize: 'vertical',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={editItem ? updateCommand : addCommand}
            style={{
              padding: '0.8rem 2rem', borderRadius: '8px', border: 'none',
              background: '#00FF94', color: '#111', fontFamily: 'inherit',
              fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {editItem ? (isRtl ? 'بروزرسانی' : 'Update') : (isRtl ? 'افزودن' : 'Add')}
          </button>
          {editItem && (
            <button
              onClick={resetForm}
              style={{
                padding: '0.8rem 2rem', borderRadius: '8px', border: '1px solid #444',
                background: 'transparent', color: '#999', fontFamily: 'inherit',
                fontSize: '1.3rem', cursor: 'pointer',
              }}
            >
              {isRtl ? 'انصراف' : 'Cancel'}
            </button>
          )}
          <button
            onClick={() => { setCommands(DEFAULT_COMMANDS); resetForm(); }}
            style={{
              padding: '0.8rem 2rem', borderRadius: '8px', border: '1px solid #ff4757',
              background: 'transparent', color: '#ff4757', fontFamily: 'inherit',
              fontSize: '1.3rem', cursor: 'pointer', marginRight: 'auto',
            }}
          >
            {isRtl ? 'بازنشانی به پیش‌فرض' : 'Reset to Default'}
          </button>
        </div>
      </div>

      <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00FF94' }}>
            {isRtl ? 'دستورات' : 'Commands'} ({commands.length})
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.3rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#888', fontWeight: 700 }}>Command</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#888', fontWeight: 700 }}>
                  {isRtl ? 'توضیحات' : 'Description'}
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#888', fontWeight: 700, width: '160px' }}>
                  {isRtl ? 'عملیات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd) => (
                <tr key={cmd.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#00FF94', fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
                    {cmd.command}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#ccc' }}>
                    {isRtl ? cmd.description : cmd.descriptionEn}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => startEdit(cmd)}
                        style={{
                          padding: '0.3rem 0.8rem', borderRadius: '4px', border: '1px solid #00FF94',
                          background: 'transparent', color: '#00FF94', fontFamily: 'inherit',
                          fontSize: '1.1rem', cursor: 'pointer',
                        }}
                      >
                        {isRtl ? 'ویرایش' : 'Edit'}
                      </button>
                      <button
                        onClick={() => deleteCommand(cmd.id)}
                        style={{
                          padding: '0.3rem 0.8rem', borderRadius: '4px', border: '1px solid #ff4757',
                          background: 'transparent', color: '#ff4757', fontFamily: 'inherit',
                          fontSize: '1.1rem', cursor: 'pointer',
                        }}
                      >
                        {isRtl ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setMode('terminal')}
          style={{
            padding: '0.8rem 2rem', borderRadius: '8px', border: 'none',
            background: mode === 'terminal' ? '#00FF94' : '#222',
            color: mode === 'terminal' ? '#111' : '#888',
            fontFamily: 'inherit', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {isRtl ? 'ترمینال' : 'Terminal'}
        </button>
        <button
          onClick={() => setMode('manage')}
          style={{
            padding: '0.8rem 2rem', borderRadius: '8px', border: 'none',
            background: mode === 'manage' ? '#00FF94' : '#222',
            color: mode === 'manage' ? '#111' : '#888',
            fontFamily: 'inherit', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {isRtl ? 'مدیریت دستورات' : 'Manage Commands'}
        </button>
      </div>

      {mode === 'terminal' ? terminalView : manageView}
    </div>
  );
}
