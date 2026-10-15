'use client';

import dynamic from 'next/dynamic';

// El chat se descarga aparte, después de que la página ya es visible: la carga inicial pesa menos.
const ChatWidget = dynamic(() => import('./ChatWidget').then((m) => m.ChatWidget), { ssr: false });

export function ChatLoader() {
  return <ChatWidget />;
}
