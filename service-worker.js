// --- service-worker.js ---

// Este array vacío se llenaría con la clave pública VAPID de tu servidor
const applicationServerKey = 'TU_CLAVE_PUBLICA_VAPID_AQUI'; 

// 1. Escuchar el evento de Instalación
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

// 2. Escuchar el evento de Activación
// Esto es importante para que el SW tome control de la página
self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    // Reclama el control de los clientes de la aplicación
    event.waitUntil(self.clients.claim()); 
});

// 3. Escuchar el evento 'push'
// Este es el corazón de la Notificación Push. Se activa cuando tu servidor envía un mensaje.
self.addEventListener('push', (event) => {
    
    // Si no hay datos en el mensaje, usa un valor por defecto
    const payload = event.data ? event.data.json() : { 
        title: '¡Recordatorio de Cultivo!',
        body: 'Es hora de revisar tus plantas.',
        icon: '/favicon.ico' // Usa un icono real
    };

    // Muestra la notificación al usuario
    const title = payload.title;
    const options = {
        body: payload.body,
        icon: payload.icon,
        badge: '/favicon.ico'
        // Puedes añadir más opciones como vibración, URL de click, etc.
    };

    // Asegura que la notificación se muestre incluso si la tarea toma tiempo
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
    console.log('Notificación Push recibida y mostrada.');
});

// 4. Escuchar el evento 'notificationclick' (opcional, pero útil)
// Se ejecuta cuando el usuario toca la notificación.
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Cierra la notificación al hacer clic

    // Abre la ventana principal de la aplicación
    event.waitUntil(
        clients.openWindow('/') 
    );
});