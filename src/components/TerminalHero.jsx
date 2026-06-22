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

const BOOT_LINES = [
  { text: '> Initializing terminal...', delay: 300 },
  { text: '> Loading user profile...', delay: 200 },
  { text: '> Welcome to Iman Norouzi portfolio', delay: 500 },
];

export default function TerminalHero({ profile }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';
  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [commands, setCommands] = useState(() => loadCommands());
  const [input, setInput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [filteredHints, setFilteredHints] = useState([]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => setCommands(loadCommands());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let mounted = true;
    const runBoot = async () => {
      for (const line of BOOT_LINES) {
        if (!mounted) break;
        await new Promise((r) => setTimeout(r, line.delay));
        if (!mounted) break;
        setLines((prev) => [...prev, { type: 'boot', text: line.text }]);
      }
      if (mounted) setBootDone(true);
    };
    runBoot();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (bootDone && inputRef.current) {
      inputRef.current.focus();
    }
  }, [bootDone]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

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

  const handleCommand = async (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => [...prev, { type: 'input', text: `$ ${cmd}` }]);
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
    } else if (trimmed !== '') {
      setLines((prev) => [...prev, { type: 'error', text: `Unknown command: ${cmd}. Type / or help.` }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (showHints) setShowHints(false);
      handleCommand(input);
    } else if (e.key === 'Escape') {
      setShowHints(false);
      setInput('');
    }
  };

  const hintClick = (cmd) => {
    setShowHints(false);
    handleCommand(cmd.command);
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal__header">
        <span className="terminal__dot terminal__dot--red"></span>
        <span className="terminal__dot terminal__dot--yellow"></span>
        <span className="terminal__dot terminal__dot--green"></span>
        <span className="terminal__title">portfolio@imannorouzi:~$</span>
      </div>
      <div className="terminal__body" ref={terminalRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal__line terminal__line--${line.type}`}>
            {line.type === 'input' && <span className="terminal__prompt">{'$'}</span>}
            <span>{line.text}</span>
          </div>
        ))}
        {bootDone && (
          <div className="terminal__line terminal__line--input" style={{ position: 'relative' }}>
            <span className="terminal__prompt">{'$'}</span>
            <input
              ref={inputRef}
              className="terminal__input"
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
            />
            <span className="terminal__cursor"></span>
            {showHints && filteredHints.length > 0 && (
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, right: 0,
                background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px',
                maxHeight: '240px', overflowY: 'auto', zIndex: 10,
              }}>
                {filteredHints.map((cmd) => (
                  <div
                    key={cmd.id}
                    onClick={() => hintClick(cmd)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.6rem 1rem', cursor: 'pointer',
                      borderBottom: '1px solid #222',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#00FF94', fontWeight: 700, fontSize: '1.1rem', minWidth: '100px' }}>{cmd.command}</span>
                    <span style={{ color: '#888', fontSize: '1rem' }}>{isRtl ? cmd.description : cmd.descriptionEn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
