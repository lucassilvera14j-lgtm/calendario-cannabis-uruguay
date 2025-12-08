// --- script.js (Versión Final y Corregida para tu HTML) ---

// 🚨🚨 CRÍTICO: REEMPLAZA ESTA URL CON LA DIRECCIÓN WEB REAL QUE TE DIO RENDER 🚨🚨
const SERVER_URL = 'https://PEGA-AQUÍ-TU-URL-DE-RENDER.onrender.com';

// Clave Pública VAPID (Tu clave, sacada de la imagen: BEBqIfIg...)
const applicationServerKey = 'BEBqIfIg1SsFHeB3RBZBh7FH7tyK7neZjfFjcllpASXBESlubKv5hIR49DHfEZjafdk0g8IO4uf-l1rZDn4lT7k';

// -------------------------------------------------------------
// 1. REGISTRO DEL SERVICE WORKER (¡CÓDIGO FALTANTE AÑADIDO!)
// -------------------------------------------------------------

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registra el service-worker.js que tienes en la raíz
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.error('Fallo el registro del Service Worker:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el calendario y listeners
    initCalendar();
    
    // Conexión a los botones del HTML (IDs de tu index.html):
    // Botón de guardar nota (ID: save-note-button)
    document.getElementById('save-note-button').addEventListener('click', saveNote); 

    // Botones de navegación (IDs: prev-month y next-month)
    document.getElementById('prev-month').addEventListener('click', window.prevMonth);
    document.getElementById('next-month').addEventListener('click', window.nextMonth);
    
    // Configurar listeners para el menú lateral
    setupSidebarListeners(); 
});


// Función para manejar el cambio de secciones del menú lateral
function setupSidebarListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover 'active' de todos los items del menú
            menuItems.forEach(i => i.classList.remove('active'));
            // Añadir 'active' al item actual
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');

            // Ocultar todas las secciones
            contentSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            // Mostrar la sección objetivo
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
            }

            // Si se vuelve al calendario, re-renderizar
            if (targetId === 'calendario') {
                renderCalendar(currentMonth, currentYear);
            }
        });
    });
}


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
// 2. Lógica de Notificaciones Push (Suscripción)
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
// 3. Lógica de Guardar Nota y Enviar Alerta
// ------------------------------------------

async function saveNote(event) {
    event.preventDefault(); // Evita que el formulario haga un submit

    // El ID correcto de la nota está en el modal (ID: note-text)
    const noteInput = document.getElementById('note-text'); 
    // La fecha seleccionada se guarda en un campo oculto (ID: note-date-key)
    const selectedDateElement = document.getElementById('note-date-key');
    
    if (!selectedDateElement.value || !noteInput.value.trim()) {
        alert('Por favor, selecciona una fecha y escribe una nota.');
        return;
    }

    const date = selectedDateElement.value; // Usamos el valor del input oculto
    const message = noteInput.value.trim();

    // 1. Obtener la suscripción del usuario
    const subscription = await subscribeUserToPush();

    if (!subscription) {
        alert('ADVERTENCIA: No se pudo activar la alerta. Las notificaciones push están bloqueadas o no son compatibles.');
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
            // Cerrar el modal y limpiar el input después de guardar
            document.getElementById('note-modal').style.display = 'none';
            noteInput.value = '';
        } else {
            const errorData = await response.json();
            alert(`Error al guardar la alerta en el servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
        }

    } catch (error) {
        console.error('Error de conexión con el servidor de alertas:', error);
        alert('Fallo al conectar con el servidor de alertas (Render). Revisa la SERVER_URL y asegúrate de que el Servidor esté "Live".');
    }
}

// ------------------------------------------
// 4. Lógica Visual del Calendario
// ------------------------------------------

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initCalendar() {
    renderCalendar(currentMonth, currentYear);
    // Añadir listener para abrir el modal al hacer clic en un día
    document.getElementById('calendar-days').addEventListener('click', (e) => {
        // Los días tienen la clase 'day' en tu CSS y el dataset 'fullDate'
        if(e.target.classList.contains('day') && e.target.dataset.fullDate) { 
            selectDay(e.target);
            openNoteModal(e.target.dataset.fullDate);
        }
    });
}

function renderCalendar(month, year) {
    // El ID correcto es 'calendar-days' (según index.html)
    const calendarDays = document.getElementById('calendar-days');
    // El ID correcto es 'month-year' (según index.html)
    const monthYearDisplay = document.getElementById('month-year'); 
    
    calendarDays.innerHTML = '';

    const date = new Date(year, month);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    monthYearDisplay.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 0=Domingo, 1=Lunes, etc.
    const startDay = firstDayOfMonth; 

    // Días vacíos al inicio (para alinear con el día de la semana)
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        // Usamos 'calendar-day' y 'day' para que coincida con tu CSS
        dayDiv.classList.add('calendar-day', 'day'); 
        dayDiv.textContent = day;

        // Formato de fecha YYYY-MM-DD
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.dataset.fullDate = fullDate;

        // Marcar el día actual
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
             dayDiv.classList.add('today');
        }

        calendarDays.appendChild(dayDiv);
    }
}

function selectDay(dayElement) {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    dayElement.classList.add('selected');
}

function openNoteModal(fullDate) {
    const modal = document.getElementById('note-modal');
    // Títulos del modal (ID: modal-title)
    document.getElementById('modal-title').textContent = `Añadir Nota para el día ${fullDate}`;
    // Campo oculto para guardar la fecha (ID: note-date-key)
    document.getElementById('note-date-key').value = fullDate; 
    
    modal.style.display = 'block';

    // Cerrar el modal con el botón 'x' o haciendo click fuera
    document.querySelector('.close-button').onclick = function() {
        modal.style.display = 'none';
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


// Botones de navegación (conectados en DOMContentLoaded)
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