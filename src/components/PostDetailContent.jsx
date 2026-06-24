import { useRef, useEffect, useState } from 'react';
import Prism from 'prismjs';

export default function PostDetailContent({ contentHtml, onImageClick }) {
  const ref = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (ref.current) Prism.highlightAllUnder(ref.current);
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll('pre').forEach((pre, i) => {
      if (pre.querySelector('.pd-copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'pd-copy-btn';
      btn.dataset.i = i;
      btn.textContent = 'Copy';
      btn.onclick = async (e) => {
        e.stopPropagation();
        const code = pre.querySelector('code');
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setCopiedId(i);
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
            setCopiedId(null);
          }, 2000);
        } catch {}
      };
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
    el.querySelectorAll('img').forEach((img) => {
      if (img.closest('.pd-image-wrap')) return;
      img.style.cursor = 'zoom-in';
      img.onclick = () => onImageClick?.(img.src);
    });
  }, [contentHtml, onImageClick]);

  if (!contentHtml) return null;

  return (
    <div className="pd-body" ref={ref} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
