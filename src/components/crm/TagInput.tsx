'use client';

import { useState, type KeyboardEvent } from 'react';

/**
 * Entrada de palabras clave: escribís y apretás Enter o coma para agregar; también acepta pegar
 * una lista separada por comas o saltos de línea. Cada etiqueta viaja como un input oculto.
 */
export function TagInput({ name, initial = [], placeholder }: { name: string; initial?: string[]; placeholder?: string }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState('');

  function add(raw: string) {
    const items = raw
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!items.length) return;
    setTags((prev) => {
      const seen = new Set(prev.map((t) => t.toLowerCase()));
      const next = [...prev];
      for (const i of items) if (!seen.has(i.toLowerCase())) (seen.add(i.toLowerCase()), next.push(i));
      return next;
    });
    setDraft('');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      setTags((t) => t.slice(0, -1));
    }
  }

  return (
    <div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 8, border: '1px solid var(--line)', borderRadius: 12, background: '#fff' }}
      >
        {tags.map((t) => (
          <span key={t} className="b" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--p2)', fontSize: '.78rem' }}>
            {t}
            <button
              type="button"
              aria-label={`Quitar ${t}`}
              onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
              style={{ border: 0, background: 'none', cursor: 'pointer', fontWeight: 900, color: 'var(--muted)' }}
            >
              ×
            </button>
            <input type="hidden" name={name} value={t} />
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            if (/[\n,;]/.test(text)) {
              e.preventDefault();
              add(text);
            }
          }}
          placeholder={placeholder ?? 'Escribí una palabra clave y apretá Enter'}
          style={{ flex: 1, minWidth: 180, border: 0, outline: 'none', padding: '6px 4px', fontSize: '.86rem', background: 'transparent' }}
        />
      </div>
    </div>
  );
}
