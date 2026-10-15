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
    icon: 'icon-192.png',
    badge: 'badge-72.png',
    tag: d.tag || 'portalagm',
    renotify: true,
    data: { url: d.url || './' }
  }));
});

// Al tocar el aviso: se abre la app (o se enfoca si ya está abierta) y se va a la pestaña que toca
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
