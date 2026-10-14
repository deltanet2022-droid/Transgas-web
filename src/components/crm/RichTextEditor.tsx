'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useState } from 'react';

/** Editor de texto enriquecido simple (negrita, títulos, listas, citas, enlaces). Guarda HTML en un input oculto. */
export function RichTextEditor({ name, initialHtml = '' }: { name: string; initialHtml?: string }) {
  const [html, setHtml] = useState(initialHtml);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false, code: false, strike: false }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: { attributes: { 'aria-label': 'Cuerpo del artículo' } },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? '' : editor.getHTML()),
  });

  if (!editor) return <div className="tt" style={{ minHeight: 260 }} />;

  const btn = (label: string, active: boolean, run: () => void, title?: string) => (
    <button type="button" className={active ? 'on' : ''} onClick={run} title={title ?? label} aria-pressed={active}>
      {label}
    </button>
  );

  function setLink() {
    const prev = editor!.getAttributes('link').href as string | undefined;
    const url = window.prompt('Dirección del enlace (https://…)', prev ?? 'https://');
    if (url === null) return;
    if (url === '') editor!.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div className="tt">
      <div className="bar">
        {btn('N', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Negrita')}
        {btn('K', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Cursiva')}
        {btn('Título', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {btn('Subtítulo', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        {btn('• Lista', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run())}
        {btn('1. Lista', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run())}
        {btn('Cita', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run())}
        {btn('Enlace', editor.isActive('link'), setLink)}
        {btn('↶', false, () => editor.chain().focus().undo().run(), 'Deshacer')}
        {btn('↷', false, () => editor.chain().focus().redo().run(), 'Rehacer')}
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
