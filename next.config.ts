import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Otimizações de produção
  reactStrictMode: true,
  
  // Compressão de imagens desligada (não usamos next/image dinamicamente)
  images: {
    unoptimized: true,
  },

  // Headers de segurança e cache para assets estáticos
  async headers() {
    return [
      {
        // Service Worker — sem cache (para garantir atualização)
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        // Todos os assets públicos
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
