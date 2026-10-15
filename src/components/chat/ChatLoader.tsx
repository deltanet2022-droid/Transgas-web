'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// El chat se descarga aparte y recién cuando el navegador está desocupado (después de mostrar la página),
// así no compite con lo que el visitante viene a ver.
const ChatWidget = dynamic(() => import('./ChatWidget').then((m) => m.ChatWidget), { ssr: false });

export function ChatLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 3500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  return ready ? <ChatWidget /> : null;
}
