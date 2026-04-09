'use client';

import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
