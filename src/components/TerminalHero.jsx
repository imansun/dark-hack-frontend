import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const COMMANDS = {
  help: () => ({
    text: `دستورات موجود:
  help     - نمایش این راهنما
  about    - درباره من
  skills   - مهارت‌ها و تخصص‌ها
  projects - تعداد پروژه‌ها
  contact  - راه‌های ارتباطی
  social   - شبکه‌های اجتماعی
  whoami   - اطلاعات کاربر
  clear    - پاک کردن ترمینال`,
    delay: 200,
  }),
  about: (t) => ({
    text: t('terminal.about', 'توسعه‌دهنده فول‌استک با علاقه به طراحی مدرن و تجربه کاربری عالی. متخصص در React, NestJS, و تکنولوژی‌های وب.'),
    delay: 400,
  }),
  skills: (t) => ({
    text: t('terminal.skills', 'مهارت‌ها: React, NestJS, TypeScript, MySQL, Docker, Git, HTML/CSS, JavaScript, REST API, UI/UX Design'),
    delay: 500,
  }),
  projects: (t) => ({
    text: t('terminal.projects', 'برای مشاهده پروژه‌ها به بخش Works مراجعه کنید یا دستور help را وارد کنید.'),
    delay: 300,
  }),
  contact: (t) => ({
    text: t('terminal.contact', 'ایمیل: imannorouzi@example.com\nجهت ارسال پیام، به بخش Contact در پایین صفحه مراجعه کنید.'),
    delay: 400,
  }),
  social: (t) => ({
    text: t('terminal.social', 'GitHub: github.com/ImanNorouziEsfajir\nLinkedIn: linkedin.com/in/imannorouzi'),
    delay: 400,
  }),
  whoami: (t) => ({
    text: t('terminal.whoami', 'کاربر: Iman Norouzi Esfajir\nنقش: توسعه‌دهنده فول‌استک\nوضعیت: فعال'),
    delay: 300,
  }),
};

const BOOT_LINES = [
  { text: '> Initializing terminal...', delay: 300 },
  { text: '> Loading user profile...', delay: 200 },
  { text: '> Welcome to Iman Norouzi portfolio', delay: 500 },
];

export default function TerminalHero({ profile }) {
  const { t } = useTranslation();
  const [lines, setLines] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

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

  const handleCommand = async (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => [...prev, { type: 'input', text: `$ ${cmd}` }]);
    setInput('');

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    const commandFn = COMMANDS[trimmed];
    if (commandFn) {
      const result = commandFn(t);
      await new Promise((r) => setTimeout(r, result.delay));
      setLines((prev) => [...prev, { type: 'output', text: result.text }]);
    } else if (trimmed === '') {
      // noop
    } else {
      setLines((prev) => [...prev, { type: 'error', text: `دستور ناشناخته: ${cmd}. برای راهنما help را وارد کنید.` }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
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
          <div className="terminal__line terminal__line--input">
            <span className="terminal__prompt">{'$'}</span>
            <input
              ref={inputRef}
              className="terminal__input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
            />
            <span className="terminal__cursor"></span>
          </div>
        )}
      </div>
    </div>
  );
}
