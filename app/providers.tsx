'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from 'next-themes';

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'd') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const tagName = target.tagName.toLowerCase();
      const isTypingField =
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target.isContentEditable;

      if (isTypingField) return;

      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [resolvedTheme, setTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark">
      <ThemeHotkey />
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #27272a',
            borderRadius: '0.75rem',
            padding: '16px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#ffffff',
              border: '1px solid #059669',
            },
            icon: '✓',
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#ffffff',
              border: '1px solid #dc2626',
            },
            icon: '✕',
          },
        }}
      />
    </ThemeProvider>
  );
}
