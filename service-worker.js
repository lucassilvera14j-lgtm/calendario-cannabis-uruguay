// archivo: service-worker.js 

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    event.waitUntil(self.clients.claim()); 
});

self.addEventListener('push', (event) => {
    
    const payload = event.data ? event.data.json() : { 
        title: '¡Recordatorio de Cultivo!',
        body: 'Es hora de revisar tus plantas.',
        icon: '/favicon.ico'
    };

    const title = payload.title;
    const options = {
        body: payload.body,
        icon: payload.icon,
        badge: '/favicon.ico',
        data: payload.data || {}
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const targetUrl = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.openWindow(targetUrl)
    );
});