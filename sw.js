// Service worker: instalable + notificaciones push. NO guarda nada en caché: todo sigue viniendo siempre de la red,
// así que la actualización automática (version.txt) funciona igual.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

// Llega un aviso del servidor: siempre se enseña algo (si no, Chrome pone uno genérico)
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Portal AGM', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Portal AGM', {
    body: d.body || '',
    icon: 'icon-maskable-192.png',   // el escudo sobre fondo claro: se lee bien en cualquier tema
    badge: 'badge-72.png',           // icono pequeño de la barra de estado (silueta blanca)
    tag: d.tag || 'portalagm',
    renotify: true,
    timestamp: Date.now(),
    vibrate: [120, 60, 120],
    actions: [{ action: 'abrir', title: '📂 Abrir' }],
    data: { url: d.url || './' }
  }));
});

// Al tocar el aviso (o «Abrir»): se abre la app (o se enfoca si ya está abierta) y se va a la pestaña que toca
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(lista => {
    for (const c of lista) {
      if ('focus' in c) { c.postMessage({ tipo: 'ir', url }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
