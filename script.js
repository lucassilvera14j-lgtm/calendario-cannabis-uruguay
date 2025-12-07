document.addEventListener('DOMContentLoaded', () => {
    
    // ✅ CLAVE PÚBLICA VAPID PEGADA AQUÍ
    const applicationServerKey = 'BEBqIfIg1SsFHeB3RBZBh7FH7tyK7neZjfFjcllpASXBESlubKv5hIR49DHfEZjafdk0g8IO4uf-l1rZDn4lT7k'; 
    
    // --- 0. FUNCIÓN DE TOAST NOTIFICATION ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;

        container.appendChild(toast);

        // Mostrar el toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Ocultar y eliminar el toast después de 4 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            // Eliminar del DOM después de la transición
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }
    
    // --- LÓGICA DE SERVICE WORKER Y PUSH ---

    // Función auxiliar para convertir Base64 a ArrayBuffer (necesario para la API)
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

    // Función principal para suscribir al usuario a Notificaciones Push
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

            // Intenta obtener o crear la suscripción
            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
            const subscriptionData = JSON.stringify(pushSubscription);
            console.log('Suscripción Push Exitosa. Clave de envío:', subscriptionData);
            
            // 🚨 ESTO ES LO QUE DEBE HACER TU SERVIDOR (AQUÍ DEBE ENVIARSE):
            // Necesitas implementar un endpoint para recibir esta suscripción y guardarla.
            /* fetch('/api/save-subscription', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: subscriptionData 
            });
            */
            showToast('Notificaciones Push activadas. ✅ Ahora, el servidor puede enviar mensajes.', 'success');
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

    // Función para registrar el Service Worker al cargar la página
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // El Service Worker debe estar en la raíz para tener alcance completo (scope)
                navigator.serviceWorker.register('/service-worker.js')
                .then(function(reg) {
                    console.log('Service Worker registrado con éxito.');
                    // Una vez que el SW está registrado, intentamos suscribir al usuario
                    subscribeUser(); 
                })
                .catch(function(err) {
                    console.error('Fallo al registrar el Service Worker:', err);
                });
            });
        }
    }
    
    // --- 1. LÓGICA DE NAVEGACIÓN DE SECCIONES ---
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    function switchSection(targetId) {
        menuItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const targetMenu = document.querySelector(`.menu-item[data-target="${targetId}"]`);
        const targetSection = document.getElementById(targetId);

        if (targetMenu) {
            targetMenu.classList.add('active');
        }
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        if (targetId === 'calendario') {
            renderCalendar();
        }
        if (targetId === 'notas') {
            renderNotesSection(); 
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            switchSection(targetId);
        });
    });
    
    // --- 2. DATOS FICTICIOS DE FASES LUNARES ---
    const moonPhasesData = [
        { date: 7, phase: 'Cuarto Menguante', icon: '🌗', activity: 'Ideal para podas, trasplantes y preparación de sustratos.' },
        { date: 11, phase: 'Luna Nueva', icon: '🌑', activity: 'Día de descanso para la planta. No podar ni abonar.' },
        { date: 19, phase: 'Cuarto Creciente', icon: '🌓', activity: 'Favorece el crecimiento de la parte aérea. Ideal para sembrar semillas.' },
        { date: 27, phase: 'Luna Llena', icon: '🌕', activity: 'Máxima savia y energía. No es buen momento para podar.' }
    ];

    // --- 3. LÓGICA DEL CALENDARIO ---
    
    const calendarDaysEl = document.getElementById('calendar-days');
    const monthYearEl = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    let currentDate = new Date();
    
    function getMonthYear(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options).replace('de ', ' ');
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        
        monthYearEl.textContent = getMonthYear(currentDate);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calendarDaysEl.innerHTML = '';
        
        const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 
        
        for (let i = 0; i < startDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty-day');
            calendarDaysEl.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = day;
            
            const noteKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayEl.setAttribute('data-note-key', noteKey);

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            
            if (localStorage.getItem(noteKey)) {
                dayEl.classList.add('has-note');
            }
            
            const moonPhase = moonPhasesData.find(p => p.date === day);
            if (moonPhase) {
                dayEl.title = `Fase Lunar: ${moonPhase.phase}`;
            }

            dayEl.addEventListener('click', () => openNoteModal(noteKey, day));

            calendarDaysEl.appendChild(dayEl);
        }
    }
    
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // --- 4. LÓGICA DE NOTAS (Modal, LocalStorage y FileReader para Imagen) ---
    
    const noteModal = document.getElementById('note-modal');
    const closeButton = noteModal.querySelector('.close-button');
    const noteForm = document.getElementById('note-form');
    const noteTextarea = document.getElementById('note-text');
    const noteDateKeyInput = document.getElementById('note-date-key');
    const modalTitle = document.getElementById('modal-title');
    const noteImageFile = document.getElementById('note-image-file');
    const fileNameSpan = document.getElementById('file-name');
    const deleteNoteButton = document.getElementById('delete-note-button');
    
    let currentImageBase64 = ''; 

    noteImageFile.addEventListener('change', () => {
        fileNameSpan.textContent = noteImageFile.files.length > 0 ? noteImageFile.files[0].name : 'Ningún archivo seleccionado.';
        if (noteImageFile.files.length > 0) {
            currentImageBase64 = '';
        }
    });

    function openNoteModal(key, day) {
        noteForm.reset();
        noteDateKeyInput.value = key;
        fileNameSpan.textContent = 'Ningún archivo seleccionado.';
        deleteNoteButton.style.display = 'none';
        currentImageBase64 = '';

        const existingNote = localStorage.getItem(key);
        if (existingNote) {
            const noteData = JSON.parse(existingNote);
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

    closeButton.addEventListener('click', () => {
        noteModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === noteModal) {
            noteModal.style.display = 'none';
        }
    });

    // Guardar Nota (Usando showToast)
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
                
                document.querySelector(`.day[data-note-key="${key}"]`).classList.add('has-note');
                
                showToast(isNewNote ? `Nota para ${key} Creada con éxito. ✅` : `Nota para ${key} Actualizada. ✏️`, 'success');
            } else {
                localStorage.removeItem(key);
                document.querySelector(`.day[data-note-key="${key}"]`).classList.remove('has-note');
                showToast(`Nota para ${key} Eliminada (Estaba vacía). 🗑️`, 'error');
            }

            noteModal.style.display = 'none';
            renderCalendar(); 
            renderNotesSection(); 
        };

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                saveNote(reader.result); 
            };
            reader.readAsDataURL(file); 
        } else {
            saveNote(imageToSave); 
        }
    });
    
    // Eliminar Nota (Usando showToast)
    deleteNoteButton.addEventListener('click', () => {
        const key = noteDateKeyInput.value;
        if (confirm(`¿Estás seguro de que quieres eliminar la nota para el día ${key}?`)) {
            localStorage.removeItem(key);
            
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
    
    // Función para renderizar la lista de notas en la sección "Notas"
    function renderNotesSection() {
        const listContainer = document.getElementById('notes-list-container');
        listContainer.innerHTML = '';
        let notesFound = false;
        
        const sortedKeys = Object.keys(localStorage)
            .filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/)) 
            .sort((a, b) => {
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
                
                noteItem.addEventListener('click', () => {
                    const day = parseInt(dateParts[2]);
                    openNoteModal(key, day);
                });

                listContainer.appendChild(noteItem);
            }
        });
        
        if (!notesFound) {
            listContainer.innerHTML = '<p>Aún no has creado ninguna nota de cultivo. 📝</p>';
        }
    }
    
    // 5. LÓGICA DE FILTROS DE RAZAS 
    const strainFilters = document.querySelectorAll('.strain-filters .filter-button');
    const strainListDt = document.querySelectorAll('.strain-list dt');

    strainFilters.forEach(button => {
        if (button.closest('#razas')) { 
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                strainFilters.forEach(btn => {
                    if (btn.closest('#razas')) btn.classList.remove('active');
                });
                button.classList.add('active');
                strainListDt.forEach(dt => {
                    const cycle = dt.getAttribute('data-cycle');
                    const dd = dt.nextElementSibling;
                    if (filter === 'all' || cycle === filter) {
                        dt.classList.remove('hidden');
                        if (dd) dd.classList.remove('hidden');
                    } else {
                        dt.classList.add('hidden');
                        if (dd) dd.classList.add('hidden');
                    }
                });
            });
        }
    });

    // 6. LÓGICA DE FILTRO DE NUTRICIÓN 
    const nutriFilters = document.querySelectorAll('#nutricion .filter-button');
    const nutriLists = document.querySelectorAll('#nutricion-content .nutri-list');

    nutriFilters.forEach(button => {
        button.addEventListener('click', () => {
            const filterTarget = button.getAttribute('data-nutri-filter');
            nutriFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            nutriLists.forEach(list => {
                if (list.getAttribute('data-nutri-target') === filterTarget) {
                    list.style.display = 'block';
                } else {
                    list.style.display = 'none';
                }
            });
        });
    });

    // 7. LÓGICA DE LA SECCIÓN LUNAS 
    const moonMonthSelect = document.getElementById('moon-month-select');
    const moonYearSelect = document.getElementById('moon-year-select');
    const searchMoonButton = document.getElementById('search-moon-button');
    const moonResultsEl = document.getElementById('moon-results');

    function initializeMoonSelectors() {
        const currentYear = new Date().getFullYear();
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            moonMonthSelect.appendChild(option);
        });
        for (let i = currentYear - 1; i <= currentYear + 1; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === currentYear) option.selected = true;
            moonYearSelect.appendChild(option);
        }
        moonMonthSelect.value = new Date().getMonth(); 
    }
    
    function searchMoonPhases() {
        moonResultsEl.innerHTML = '';
        if (moonPhasesData.length === 0) {
            moonResultsEl.innerHTML = '<p>No se encontraron fases lunares para el mes seleccionado. 🌑</p>';
            return;
        }
        moonPhasesData.forEach(phase => {
            const resultEl = document.createElement('div');
            resultEl.classList.add('moon-phase-result');
            resultEl.innerHTML = `
                <strong>Día ${phase.date} - ${phase.icon} ${phase.phase}</strong>
                <span>Recomendación: ${phase.activity}</span>
            `;
            moonResultsEl.appendChild(resultEl);
        });
    }

    if (searchMoonButton) {
        searchMoonButton.addEventListener('click', searchMoonPhases);
    }
    
    // --- INICIALIZACIÓN FINAL ---
    renderCalendar();
    initializeMoonSelectors();
    
    // 🚨 LLAMADA PARA REGISTRAR EL SERVICE WORKER Y SUSCRIBIR AL PUSH
    registerServiceWorker(); 
});