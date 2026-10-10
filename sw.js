const CACHE_NAME = 'devstore-v1';
const FILES = ['./', './index.html', './style.css', './script.js'];

// Saat install: simpan semua file ke cache
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(FILES)));
});

// Saat browser minta file: cek cache dulu, baru internet
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
