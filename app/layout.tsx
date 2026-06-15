// ============================================================
// app/layout.tsx — layout raiz com metadata, PWA e fonte
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QR Generator — Texto, Wi-Fi, PIX e mais',
  description:
    'Gerador de QR Code profissional: URL, texto, Wi-Fi, PIX. Personalize cores, adicione logo e baixe em PNG ou SVG. PWA instalável.',
  keywords: ['qr code', 'gerador qr', 'pix qr', 'wifi qr', 'qr scanner'],
  authors: [{ name: 'ei-Gih', url: 'https://github.com/ei-Gih' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QR Generator',
  },
  openGraph: {
    title: 'QR Generator',
    description: 'Gere QR Codes para qualquer coisa — grátis e sem cadastro.',
    type: 'website',
    url: 'https://qr-code-generator-base.netlify.app',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Service Worker registrado via script inline para compatibilidade */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
