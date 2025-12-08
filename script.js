document.addEventListener('DOMContentLoaded', () => {
    
    // --- script.js (AJUSTE DE CLAVE PÚBLICA) ---
    
// ✅ REEMPLAZA ESTA CLAVE POR LA NUEVA CLAVE PÚBLICA GENERADA
const applicationServerKey = 'PEGA AQUÍ TU NUEVA CLAVE PÚBLICA VAPID'; 
    
// 🚨 URL DEL SERVIDOR (BACKEND) - MANTENLA COMO ESTÁ
const SERVER_URL = 'https://calendario-cannabis-uruguay-q2iu7w3rs-totis-projects-82aa6668.vercel.app'; 
// ... el resto del código ... 
    
    // 🚨 ATENCIÓN: DATOS LUNARES REALES PARA URUGUAY (UTC-3) - TODO EL AÑO 2025 🚨
    // Meses van de 0 (Enero) a 11 (Diciembre).
    const REAL_MOON_PHASES = {
        "2025": {
            // Enero (0)
            "0": [
                { date: 4, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 10, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 18, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 25, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' }
            ],
            // Febrero (1)
            "1": [
                { date: 2, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 9, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 16, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 23, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' }
            ],
            // Marzo (2)
            "2": [
                { date: 4, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 10, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 17, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 25, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' }
            ],
            // Abril (3)
            "3": [
                { date: 2, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 8, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 16, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 24, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' }
            ],
            // Mayo (4)
            "4": [
                { date: 2, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 7, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 15, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 23, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 31, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' }
            ],
            // Junio (5)
            "5": [
                { date: 6, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 14, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 21, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 29, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' }
            ],
            // Julio (6)
            "6": [
                { date: 5, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 13, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 20, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 28, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' }
            ],
            // Agosto (7)
            "7": [
                { date: 3, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 11, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 19, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 27, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' }
            ],
            // Septiembre (8)
            "8": [
                { date: 2, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 10, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 17, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 26, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' }
            ],
            // Octubre (9)
            "9": [
                { date: 2, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 9, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 17, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 25, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 31, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' }
            ],
            // Noviembre (10)
            "10": [
                { date: 8, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 15, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' },
                { date: 24, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 30, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' }
            ],
            // Diciembre (11) - Datos Actuales
            "11": [
                { date: 4, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
                { date: 11, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. Enfocarse en la raíz.' },
                { date: 19, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento aéreo. Ideal para siembra.' },
                { date: 27, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No podar ni cosechar.' }
            ]
        }
    };
    
    // --- 0. LÓGICA DE MENÚ DE ACCESO (NUEVA CARACTERÍSTICA) ---
    const loginMenu = document.getElementById('login-menu');
    const appContainer = document.querySelector('.app-container');
    const accessFreeButton = document.getElementById('access-free');
    const accessPremiumButton = document.getElementById('access-premium');
    
    // Verificar si los elementos existen (deberían si el HTML se modificó correctamente)
    if (loginMenu && appContainer) {
        // La pantalla de login ya tiene la clase 'active' en el HTML para mostrarse por defecto.
    }

    if (accessFreeButton && loginMenu && appContainer) {
        accessFreeButton.addEventListener('click', () => {
            // 1. Inicia la transición de ocultar el menú de login (opacidad)
            loginMenu.classList.remove('active');
            
            // 2. Espera la duración de la transición (400ms en style.css)
            setTimeout(() => {
                // 3. Oculta el menú de login completamente y muestra la aplicación
                loginMenu.classList.add('hidden-screen');
                appContainer.classList.remove('hidden-screen');
                
                // 4. Iniciar la aplicación una vez que se muestra
                renderCalendar();
                initializeMoonSelectors();
                registerServiceWorker();

            }, 400); // Coincide con la duración de la transición CSS
            
            showToast('Acceso Gratuito concedido. ¡A cultivar! 🚀', 'success');
        });
    }

    if (accessPremiumButton) {
        accessPremiumButton.addEventListener('click', () => {
            showToast('Acceso Premium BLOQUEADO. ¡Disponible pronto! 🚧', 'info');
        });
    }
    
    // --- 0. FUNCIÓN DE TOAST NOTIFICATION ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }
    
    // --- LÓGICA DE SERVICE WORKER Y PUSH ---

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

    function subscribeUser() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Las Notificaciones Push no son compatibles con este navegador.');
            return;
        }

        navigator.serviceWorker.ready.then((registration) => {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
            const subscriptionData = JSON.stringify(pushSubscription);
            console.log('Suscripción Push Exitosa. Clave de envío:', subscriptionData);
            
            showToast('Notificaciones Push activadas. ✅', 'success');
        })
        .catch((e) => {
            if (Notification.permission === 'denied') {
                console.warn('Permiso de Notificaciones denegado por el usuario.');
                showToast('Permiso de notificaciones denegado. ❌', 'error');
            } else {
                console.error('Fallo al suscribir al usuario: ', e);
                showToast('Fallo al activar notificaciones. ⚠️', 'error');
            }
        });
    }

    // 💡 FUNCIÓN PARA OBTENER LA SUSCRIPCIÓN ACTIVA DEL NAVEGADOR
    function getPushSubscription() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return Promise.resolve(null);
        }
        
        return navigator.serviceWorker.ready
            .then((registration) => {
                return registration.pushManager.getSubscription();
            })
            .then((subscription) => {
                // Si ya hay una suscripción activa, la devuelve.
                if (subscription) {
                    return subscription;
                }
                
                // Si no hay, se intenta crear una nueva (esto activará la petición de permiso)
                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(applicationServerKey), 
                };
                return registration.pushManager.subscribe(subscribeOptions);
            })
            .catch(e => {
                 console.error('Error al obtener o crear suscripción Push:', e);
                 return null;
            });
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // El Service Worker se registra desde la raíz del sitio (Vercel)
                navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch((error) => {
                    console.log('Fallo en el registro del Service Worker:', error);
                });
            });
        }
    }
    
    // --- 1. LÓGICA DE NAVEGACIÓN ENTRE SECCIONES ---
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    function switchSection(targetId) {
        // Desactivar todos
        menuItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Activar el objetivo
        const targetMenu = document.querySelector(`.menu-item[data-target="${targetId}"]`);
        const targetSection = document.getElementById(targetId);
        
        if (targetMenu) {
            targetMenu.classList.add('active');
        }
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Recargar calendario/notas si se navega a ellas
        if (targetId === 'calendario') {
            renderCalendar();
        }
        if (targetId === 'notas') {
            renderNotesSection();
        }
    }

    // Listener para los items del menú
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            switchSection(targetId);
        });
    });


    // --- 2. LÓGICA DE FILTROS DE RAZAS Y NUTRICIÓN ---
    function setupFilters(filterContainerSelector, listContainerSelector, attributeName) {
        const filterButtons = document.querySelectorAll(`${filterContainerSelector} .filter-button`);
        const listItems = document.querySelectorAll(`${listContainerSelector} dt`);

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Activar/desactivar botón
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                listItems.forEach(dt => {
                    const dd = dt.nextElementSibling;
                    const itemValue = dt.getAttribute(attributeName);

                    if (filterValue === 'all' || itemValue === filterValue) {
                        dt.classList.remove('hidden');
                        if (dd) dd.classList.remove('hidden');
                    } else {
                        dt.classList.add('hidden');
                        if (dd) dd.classList.add('hidden');
                    }
                });
            });
        });
    }
    
    // Inicializar filtros de Razas (dt tiene el atributo data-cycle)
    setupFilters('.strain-filters', '.strain-list', 'data-cycle');
    
    // Inicializar filtros de Nutrición (dt tiene el atributo data-cycle)
    setupFilters('.strain-filters', '.nutri-list', 'data-cycle');
    

    // --- 3. LÓGICA DEL CALENDARIO ---
    const calendarDaysEl = document.getElementById('calendar-days');
    const monthYearEl = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    
    // Sincronizar con la fecha actual del sistema
    let currentDate = new Date();
    
    function getMonthYear(date) {
        const options = { year: 'numeric', month: 'long' };
        // Formatear la fecha a español y quitar el 'de ' (ej: "Diciembre 2025")
        return date.toLocaleDateString('es-ES', options).replace('de ', ' ');
    }

    function renderCalendar() {
        // Solo renderizar si la app está visible (no en pantalla de login)
        if (appContainer && appContainer.classList.contains('hidden-screen')) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-11
        const today = new Date();

        monthYearEl.textContent = getMonthYear(currentDate);
        
        // 1. Días vacíos al inicio (para empezar en el día de la semana correcto)
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calendarDaysEl.innerHTML = '';
        
        // Ajuste para que Lunes sea el día 0 y Domingo el 6 (como en el calendario)
        const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 

        for (let i = 0; i < startDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty-day');
            calendarDaysEl.appendChild(emptyDay);
        }

        // 2. Renderizar días del mes y notas
        const currentMonthPhases = REAL_MOON_PHASES[year] ? REAL_MOON_PHASES[year][month] : null;

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = day;
            
            const noteKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayEl.setAttribute('data-note-key', noteKey);
            
            // Marcar el día actual
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            
            // Marcar si hay nota
            if (localStorage.getItem(noteKey)) {
                dayEl.classList.add('has-note');
            }

            // Añadir Fase Lunar como tooltip si existe
            if (currentMonthPhases) {
                const phaseData = currentMonthPhases.find(p => p.date === day);
                if (phaseData) {
                    dayEl.setAttribute('title', `${phaseData.phase} ${phaseData.icon} - ${phaseData.activity}`);
                    dayEl.innerHTML += `<span class="moon-icon">${phaseData.icon}</span>`; // Opcional: mostrar icono
                }
            }

            // Listener para abrir modal de nota
            dayEl.addEventListener('click', () => {
                openNoteModal(noteKey, day);
            });

            calendarDaysEl.appendChild(dayEl);
        }
    }
    
    // Botones de navegación del calendario
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    
    // --- 4. LÓGICA DE NOTAS (MODAL) ---
    const noteModal = document.getElementById('note-modal');
    const closeButton = document.querySelector('.close-button');
    const noteForm = document.getElementById('note-form');
    const noteTextarea = document.getElementById('note-text');
    const noteDateKeyInput = document.getElementById('note-date-key');
    const modalTitle = document.getElementById('modal-title');
    const deleteNoteButton = document.getElementById('delete-note-button');
    const noteImageFile = document.getElementById('note-image-file');
    const fileNameSpan = document.getElementById('file-name');
    let currentImageBase64 = ''; // Variable para guardar la imagen al editar
    
    // Previsualización del nombre del archivo
    if (noteImageFile) {
        noteImageFile.addEventListener('change', () => {
            if (noteImageFile.files.length > 0) {
                fileNameSpan.textContent = noteImageFile.files[0].name;
            } else {
                fileNameSpan.textContent = 'Ningún archivo seleccionado.';
            }
        });
    }

    function openNoteModal(key, day) {
        // Resetear modal
        noteForm.reset();
        noteDateKeyInput.value = key;
        deleteNoteButton.style.display = 'none';
        modalTitle.textContent = `Añadir Nota para el día ${day}`;
        fileNameSpan.textContent = 'Ningún archivo seleccionado.';
        currentImageBase64 = '';
        
        // Cargar nota existente
        const existingNote = localStorage.getItem(key);
        if (existingNote) {
            let noteData = JSON.parse(existingNote);
            noteTextarea.value = noteData.text;
            modalTitle.textContent = `Editar Nota para el día ${day}`;
            deleteNoteButton.style.display = 'block';
            if (noteData.image) {
                currentImageBase64 = noteData.image;
                fileNameSpan.textContent = '¡Imagen Adjunta!';
            }
        } else {
            modalTitle.textContent = `Añadir Nota para el día ${day}`;
        }

        noteModal.style.display = 'block';
    }
    
    // Cierre del modal
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            noteModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === noteModal) {
            noteModal.style.display = 'none';
        }
    });

    // 💡 LÓGICA DE GUARDADO MODIFICADA PARA ENVIAR LA ALERTA PUSH AL SERVIDOR
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const key = noteDateKeyInput.value;
            const text = noteTextarea.value.trim();
            const file = noteImageFile.files[0];
            let imageToSave = currentImageBase64;
            let isNewNote = !localStorage.getItem(key);

            const saveNote = (base64String) => {
                if (text || base64String) {
                    const noteData = {
                        text: text,
                        image: base64String || '',
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem(key, JSON.stringify(noteData));
                    
                    // Actualizar UI
                    document.querySelector(`.day[data-note-key="${key}"]`).classList.add('has-note');
                    showToast(isNewNote ? `Nota para ${key} Creada con éxito. ✅` : `Nota para ${key} Actualizada. ✏️`, 'success');
                } else {
                    // Si está vacío, se elimina
                    localStorage.removeItem(key);
                    document.querySelector(`.day[data-note-key="${key}"]`).classList.remove('has-note');
                    showToast(`Nota para ${key} Eliminada (Estaba vacía). 🗑️`, 'error');
                }
                
                // --- LÓGICA PUSH AÑADIDA AQUÍ ---
                getPushSubscription().then(subscription => {
                    if (subscription && text.length > 0) { // Solo si hay suscripción y texto
                        const noteDate = key; // La fecha de la nota es la fecha de la alerta
                        const alertData = {
                            date: noteDate,
                            message: text.substring(0, 100) + (text.length > 100 ? '...' : ''), // Máx 100 caracteres
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
                            }
                        };

                        fetch(`${SERVER_URL}/send-alert`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(alertData),
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log('Alerta de nota enviada al servidor.');
                            } else {
                                console.error('Fallo al enviar alerta de nota al servidor.');
                            }
                        })
                        .catch(error => {
                            console.error('Error de red al enviar alerta:', error);
                        });
                    }
                });
                
                noteModal.style.display = 'none';
                renderCalendar(); 
                renderNotesSection();
            };

            if (file) {
                // Si hay un nuevo archivo, lo convierte a Base64
                const reader = new FileReader();
                reader.onload = (e) => {
                    saveNote(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                // Si no hay nuevo archivo, guarda con la imagen existente (o sin ella)
                saveNote(imageToSave);
            }
        });
    }

    // Botón de eliminar nota
    if (deleteNoteButton) {
        deleteNoteButton.addEventListener('click', () => {
            const key = noteDateKeyInput.value;
            if (confirm(`¿Estás seguro de que quieres eliminar la nota para el día ${key}?`)) {
                localStorage.removeItem(key);
                
                // Actualizar UI
                const dayEl = document.querySelector(`.day[data-note-key="${key}"]`);
                if (dayEl) {
                    dayEl.classList.remove('has-note');
                }
                showToast(`Nota para ${key} eliminada correctamente. 🗑️`, 'error');
                noteModal.style.display = 'none';
                renderCalendar(); 
                renderNotesSection();
            }
        });
    }

    // Función para renderizar la sección de notas guardadas
    function renderNotesSection() {
        const listContainer = document.getElementById('notes-list-container');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        let notesFound = false;

        // Obtener todas las claves de notas y ordenarlas por fecha descendente
        const sortedKeys = Object.keys(localStorage)
            .filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/))
            .sort((a, b) => {
                // Orden descendente (más reciente primero)
                return b.localeCompare(a); 
            });

        if (sortedKeys.length === 0) {
            listContainer.innerHTML = '<p>Aún no has creado ninguna nota de cultivo. 📝</p>';
            return;
        }

        sortedKeys.forEach(key => {
            const rawNote = localStorage.getItem(key);
            if (rawNote) {
                notesFound = true;
                const note = JSON.parse(rawNote);
                
                const noteItem = document.createElement('div');
                noteItem.classList.add('note-item');
                noteItem.setAttribute('data-key', key);
                
                const dateParts = key.split('-');
                const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

                let imageHtml = '';
                if (note.image && note.image.startsWith('data:image')) {
                    imageHtml = `<img class="note-image" src="${note.image}" alt="Imagen adjunta a la nota">`;
                }

                noteItem.innerHTML = `
                    <h4>${formattedDate}</h4>
                    <p>${note.text.replace(/\n/g, '<br>')}</p>
                    ${imageHtml}
                `;
                
                // Listener para editar nota al hacer clic
                noteItem.addEventListener('click', () => {
                    const key = noteItem.getAttribute('data-key');
                    const dateParts = key.split('-');
                    const day = parseInt(dateParts[2], 10);
                    openNoteModal(key, day);
                });

                listContainer.appendChild(noteItem);
            }
        });
        
        if (!notesFound) {
            listContainer.innerHTML = '<p>Aún no has creado ninguna nota de cultivo. 📝</p>';
        }
    }


    // --- 5. LÓGICA DE SELECTORES DE FASES LUNARES ---
    const moonMonthSelect = document.getElementById('moon-month-select');
    const moonYearSelect = document.getElementById('moon-year-select');
    const searchMoonButton = document.getElementById('search-moon-button');
    const moonResultsEl = document.getElementById('moon-results-container');
    
    function initializeMoonSelectors() {
        // Inicializar Meses
        if (!moonMonthSelect) return;
        moonMonthSelect.innerHTML = '';
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            moonMonthSelect.appendChild(option);
        });
        // Seleccionar mes actual por defecto
        moonMonthSelect.value = currentDate.getMonth();

        // Inicializar Años
        if (!moonYearSelect) return;
        moonYearSelect.innerHTML = '';
        const currentYear = currentDate.getFullYear();
        
        // Determinar rango de años disponibles en los datos
        const availableYears = Object.keys(REAL_MOON_PHASES).map(y => parseInt(y)).sort((a, b) => a - b);
        let minYear = currentYear;
        let maxYear = currentYear;
        
        if (availableYears.length > 0) {
            minYear = Math.min(...availableYears);
            maxYear = Math.max(...availableYears);
        }

        // Si el año actual no está en la data, se incluye
        if (!availableYears.includes(currentYear)) {
            if (currentYear < minYear) minYear = currentYear;
            if (currentYear > maxYear) maxYear = currentYear;
        }

        for (let i = minYear; i <= maxYear; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            moonYearSelect.appendChild(option);
        }
        // Seleccionar año actual por defecto
        moonYearSelect.value = currentYear;
    }

    function searchMoonPhases() {
        const selectedMonth = parseInt(moonMonthSelect.value, 10);
        const selectedYear = moonYearSelect.value;

        moonResultsEl.innerHTML = '';

        if (!REAL_MOON_PHASES[selectedYear] || !REAL_MOON_PHASES[selectedYear][selectedMonth]) {
            moonResultsEl.innerHTML = `<p>No se encontraron fases lunares en nuestra base de datos para ${moonMonthSelect.options[selectedMonth].text} de ${selectedYear}. 🌑</p>`;
            showToast(`Sin datos lunares para ${moonMonthSelect.options[selectedMonth].text}.`, 'error');
            return;
        }

        const phasesForSelectedMonth = REAL_MOON_PHASES[selectedYear][selectedMonth];

        if (phasesForSelectedMonth.length === 0) {
            moonResultsEl.innerHTML = `<p>No se encontraron fases lunares en nuestra base de datos para ${moonMonthSelect.options[selectedMonth].text} de ${selectedYear}. 🌑</p>`;
            showToast(`Sin datos lunares para ${moonMonthSelect.options[selectedMonth].text}.`, 'error');
            return;
        }
        
        phasesForSelectedMonth.forEach(phase => {
            const resultEl = document.createElement('div');
            resultEl.classList.add('moon-phase-result');
            
            const fullDate = new Date(selectedYear, selectedMonth, phase.date);
            const dateStr = fullDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            
            resultEl.innerHTML = `
                <strong>${dateStr} - ${phase.icon} ${phase.phase}</strong>
                <span>Recomendación: ${phase.activity}</span>
            `;
            moonResultsEl.appendChild(resultEl);
        });

        showToast(`Resultados cargados para ${moonMonthSelect.options[selectedMonth].text} de ${selectedYear}. ✅`, 'success');
    }
    
    // Listener de búsqueda
    if (searchMoonButton) {
        searchMoonButton.addEventListener('click', searchMoonPhases);
    }
    
    // --- INICIALIZACIÓN FINAL ---
    
    // NOTA: La lógica de inicio se ha movido dentro del listener de "Acceso Gratuito" 
    // para asegurar que el calendario solo se renderice una vez que el usuario entre a la app.
    // Aquí solo inicializamos los selectores lunares por si se quiere acceder a esa sección luego.
    
    // Si la aplicación NO está oculta (es decir, si el HTML se modificó y se olvidó la clase hidden-screen)
    // o si los elementos del menú no existen, inicializamos de forma tradicional.
    if (!loginMenu || !appContainer || !loginMenu.classList.contains('active')) {
        renderCalendar();
    }

    // Inicializamos selectores, ya que no dependen de la visibilidad de la app.
    initializeMoonSelectors();
    
    // 🚨 LLAMADA PARA REGISTRAR SERVICE WORKER 🚨
    // registerServiceWorker(); // Esta llamada se movió dentro del click de "Acceso Gratuito" para la mejor UX
});