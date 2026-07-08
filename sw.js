const CACHE_NAME = 'justicetech-v6';
const ASSETS = [
  '/index.html','/jmwhatsapp.html','/misschatra.html','/autosave.html',
  '/pricing.html','/status.html','/changelog.html','/team.html','/docs.html',
  '/showcase.html','/newsletter.html','/referral.html',
  '/css/style.css','/css/features.css','/js/script.js','/js/features.js',
  '/images/logo.jpg','/images/jmwhatsapp.jpg','/images/misschatra.jpg','/images/autosave.jpg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
