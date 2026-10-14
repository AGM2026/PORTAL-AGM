// Service worker mínimo: solo sirve para que el navegador deje instalar la app.
// NO guarda nada en caché: todo sigue viniendo siempre de la red, así que la actualización automática (version.txt) funciona igual.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
