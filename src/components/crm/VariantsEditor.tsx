'use client';

import { useState } from 'react';

/** Lista editable de variantes de redacción (2-3 recomendadas). Cada una viaja como textarea con el mismo name. */
export function VariantsEditor({ name, initial = [], max = 5 }: { name: string; initial?: string[]; max?: number }) {
  const [items, setItems] = useState<{ id: number; text: string }[]>(() =>
    (initial.length ? initial : ['', '']).map((text, id) => ({ id, text })),
  );
  const [nextId, setNextId] = useState(Math.max(initial.length, 2));

  return (
    <div className="listedit">
      {items.map((it, i) => (
        <div key={it.id} className="li">
          <textarea
            name={name}
            value={it.text}
            rows={3}
            placeholder={`Variante ${i + 1}: otra forma de redactar la misma respuesta`}
            onChange={(e) => setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, text: e.target.value } : x)))}
          />
          <button
            type="button"
            className="cbtn s sm"
            disabled={items.length <= 1}
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
            aria-label={`Quitar variante ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      {items.length < max && (
        <div>
          <button
            type="button"
            className="cbtn s sm"
            onClick={() => {
              setItems((prev) => [...prev, { id: nextId, text: '' }]);
              setNextId((n) => n + 1);
            }}
          >
            + Agregar otra variante
          </button>
        </div>
      )}
    </div>
  );
}
