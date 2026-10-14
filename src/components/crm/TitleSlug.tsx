'use client';

import { useState } from 'react';
import { slugify } from '@/lib/slug';

/** Título + slug: el slug se autogenera mientras no lo edites a mano. */
export function TitleSlug({ initialTitle = '', initialSlug = '' }: { initialTitle?: string; initialSlug?: string }) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [touched, setTouched] = useState(!!initialSlug);

  return (
    <>
      <div>
        <label className="l" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          type="text"
          name="title"
          required
          maxLength={160}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!touched) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div>
        <label className="l" htmlFor="slug">
          Slug (parte final de la URL)
        </label>
        <input
          id="slug"
          type="text"
          name="slug"
          maxLength={90}
          value={slug}
          onChange={(e) => {
            setTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
        <p className="help">/blog/{slug || 'titulo-del-articulo'}</p>
      </div>
    </>
  );
}
