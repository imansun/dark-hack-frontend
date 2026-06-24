import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'terminal_commands';

const DEFAULT_COMMANDS = [
  { id: '1', command: 'help', description: 'نمایش این راهنما', descriptionEn: 'Show this help', response: 'دستورات موجود:\n  help     - نمایش این راهنما\n  about    - درباره من\n  skills   - مهارت‌ها\n  projects - پروژه‌ها\n  contact  - ارتباط\n  social   - شبکه‌های اجتماعی\n  whoami   - اطلاعات کاربر\n  clear    - پاک کردن ترمینال', responseEn: 'Available commands:\n  help     - Show this help\n  about    - About me\n  skills   - Skills\n  projects - Projects\n  contact  - Contact\n  social   - Social media\n  whoami   - User info\n  clear    - Clear terminal' },
  { id: '2', command: 'about', description: 'درباره من', descriptionEn: 'About me', response: 'مهندس نرم‌افزار با تخصص در هوش مصنوعی و یادگیری ماشین. علاقه‌مند به طراحی سیستم‌های هوشمند، پردازش زبان طبیعی و بینایی کامپیوتر.', responseEn: 'Software engineer specializing in AI and Machine Learning. Passionate about intelligent systems, NLP, and computer vision.' },
  { id: '3', command: 'skills', description: 'مهارت‌ها', descriptionEn: 'Skills', response: 'مهارت‌ها: Python, PyTorch, TensorFlow, React, NestJS, TypeScript, Docker, Git, SQL, NLP, Computer Vision', responseEn: 'Skills: Python, PyTorch, TensorFlow, React, NestJS, TypeScript, Docker, Git, SQL, NLP, Computer Vision' },
  { id: '4', command: 'projects', description: 'پروژه‌ها', descriptionEn: 'Projects', response: 'برای مشاهده پروژه‌ها به بخش Projects مراجعه کنید.', responseEn: 'Check the Projects section to see my work.' },
  { id: '5', command: 'contact', description: 'راه‌های ارتباطی', descriptionEn: 'Contact info', response: 'ایمیل: maryam.vatanpour@example.com\nجهت ارسال پیام، به بخش Contact مراجعه کنید.', responseEn: 'Email: maryam.vatanpour@example.com\nVisit the Contact section to send a message.' },
  { id: '6', command: 'social', description: 'شبکه‌های اجتماعی', descriptionEn: 'Social media', response: 'GitHub: github.com/maryamvatanpour\nLinkedIn: linkedin.com/in/maryamvatanpour', responseEn: 'GitHub: github.com/maryamvatanpour\nLinkedIn: linkedin.com/in/maryamvatanpour' },
  { id: '7', command: 'whoami', description: 'اطلاعات کاربر', descriptionEn: 'User info', response: 'کاربر: Maryam Vatanpour Azghandi\nنقش: مهندس نرم‌افزار و هوش مصنوعی\nوضعیت: فعال', responseEn: 'User: Maryam Vatanpour Azghandi\nRole: Software Engineer & AI Specialist\nStatus: Active' },
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
  { text: '> Welcome to Maryam Vatanpour portfolio', delay: 500 },
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

  const copyTerminal = () => {
    const text = lines.map((l) => l.text).join('\n');
    if (text) navigator.clipboard?.writeText(text);
  };

  return (
    <div className="term-card">
      <div className="term-wrap">
        <div className="term-terminal" onClick={() => inputRef.current?.focus()}>
          <hgroup className="term-head">
            <p className="term-title">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
                <path d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" />
              </svg>
              Terminal
            </p>
            <button className="term-copy-btn" tabIndex={-1} type="button" onClick={copyTerminal} title={isRtl ? 'کپی' : 'Copy'}>
              <svg width="16px" height="16px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </hgroup>
          <div className="term-body" ref={terminalRef}>
            {lines.map((line, i) => (
              <div key={i} className={`term-line term-line--${line.type}`}>
                {line.type === 'input' && <span className="term-prompt">{'$'}</span>}
                <span>{line.text}</span>
              </div>
            ))}
            {bootDone && (
              <div className="term-line term-line--input" style={{ position: 'relative' }}>
                <span className="term-prompt">{'$'}</span>
                <input
                  ref={inputRef}
                  className="term-input"
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="term-cursor"></span>
              </div>
            )}
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
    </div>
  );
}
