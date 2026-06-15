// ============================================================
// sw.js — Service Worker do QR Code Generator (PWA)
// Estratégia: Cache-First para assets estáticos,
//             Network-First para navegação
// ============================================================

const CACHE_NAME = 'qrgen-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Install: pré-cacheia assets críticos ──────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Falha ao pré-cachear:', err);
      });
    })
  );
  // Ativa imediatamente sem esperar o reload
  self.skipWaiting();
});

// ── Activate: remove caches antigos ───────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Cache-First com fallback à rede ────────────────
self.addEventListener('fetch', (event) => {
  // Ignora requisições de extensões do navegador
  if (!event.request.url.startsWith('http')) return;

  // Network-First para navegação (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/').then((cached) => cached ?? new Response('Offline', { status: 503 }))
      )
    );
    return;
  }

  // Cache-First para assets estáticos
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cacheia apenas respostas válidas
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
