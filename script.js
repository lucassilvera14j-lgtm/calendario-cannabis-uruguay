// --- script.js (Versión Final) ---

// 🚨🚨 CRÍTICO: REEMPLAZA ESTA URL CON LA DIRECCIÓN WEB REAL QUE TE DIO RENDER 🚨🚨
const SERVER_URL = 'https://PEGA-AQUÍ-TU-URL-DE-RENDER.onrender.com';

// Clave Pública VAPID
const applicationServerKey = 'BEBqIfIg1SsFHeB3RBZBh7FH7tyK7neZjfFjcllpASXBESlubKv5hIR49DHfEZjafdk0g8IO4uf-l1rZDn4lT7k';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el calendario y listeners
    initCalendar();
    document.getElementById('saveNote').addEventListener('click', saveNote);
});

// Función de utilidad para convertir VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// ------------------------------------------
// 1. Lógica de Notificaciones Push (Registro)
// ------------------------------------------

async function subscribeUserToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push not supported by this browser.');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
            console.log('User not subscribed. Subscribing now...');

            const applicationServerKeyUint8Array = urlBase64ToUint8Array(applicationServerKey);

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKeyUint8Array
            });
            console.log('Subscription successful:', subscription);
        } else {
            console.log('User already subscribed.');
        }

        return subscription;

    } catch (error) {
        console.error('Failed to subscribe the user: ', error);
        return null;
    }
}

// ------------------------------------------
// 2. Lógica de Guardar Nota y Enviar Alerta
// ------------------------------------------

async function saveNote() {
    const selectedDateElement = document.querySelector('.calendar-day.selected');
    const noteInput = document.getElementById('noteInput');
    
    if (!selectedDateElement || !noteInput.value.trim()) {
        alert('Por favor, selecciona una fecha y escribe una nota.');
        return;
    }

    const date = selectedDateElement.dataset.fullDate;
    const message = noteInput.value.trim();

    // 1. Obtener la suscripción del usuario
    const subscription = await subscribeUserToPush();

    if (!subscription) {
        alert('No se pudo activar la alerta. Las notificaciones push están bloqueadas o no son compatibles.');
        return;
    }

    // 2. Enviar la alerta programada al servidor de Render
    try {
        const response = await fetch(`${SERVER_URL}/api/guardar-alerta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: date,
                message: message,
                subscription: subscription
            }),
        });

        if (response.ok) {
            alert(`Nota guardada y alerta programada para el día ${date} en el servidor.`);
            // Aquí iría el código para mostrar la nota en el calendario visualmente
        } else {
            const errorData = await response.json();
            alert(`Error al guardar la alerta en el servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
        }

    } catch (error) {
        console.error('Error de conexión con el servidor de alertas:', error);
        alert('Fallo al conectar con el servidor de alertas (Render). Revisa la SERVER_URL.');
    }
}

// ------------------------------------------
// 3. Lógica Visual del Calendario (Placeholder)
// ------------------------------------------

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initCalendar() {
    renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const monthYearDisplay = document.getElementById('monthYear');
    calendarDays.innerHTML = '';

    const date = new Date(year, month);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    monthYearDisplay.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ajustar para Lunes=0

    // Días vacíos al inicio
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        // Formato de fecha YYYY-MM-DD
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.dataset.fullDate = fullDate;

        dayDiv.addEventListener('click', () => selectDay(dayDiv));
        calendarDays.appendChild(dayDiv);
    }
}

function selectDay(dayElement) {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    dayElement.classList.add('selected');
    document.getElementById('selectedDateDisplay').textContent = dayElement.dataset.fullDate;
}

// Botones de navegación (Debes tenerlos en tu index.html)
window.prevMonth = function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
};

window.nextMonth = function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
};