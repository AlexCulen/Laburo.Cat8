document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE LOS MENÚS ---
    // Esta sección no necesita cambios, la lógica de datos sigue siendo la misma.
    const menuData = {
        switches: {
            displayText: "Switches",
            options: [
                { text: "Core Huawei", url: "Switches.html" },
                { text: "Huawei con interfaz grafica", url: "" },
                { text: "Huawei sin interfaz grafica", url: "" },
                { text: "Cisco", url: "" },
                { text: "Mikrotik", url: "" },
                { text: "HPE Office", url: "" },
                { text: "Allied Telesis", url: "" }
            ]
        },
        routers: {
            displayText: "Routers",
            options: [
                { text: "ISR 4000 Series", url: "manual-router-isr4000.html" },
                { text: "ASR 1000 Series", url: "manual-router-asr1000.html" },
                { text: "Meraki MX Series", url: "manual-router-merakimx.html" }
            ]
        },
        firewalls: {
            displayText: "Firewalls",
            options: [
                { text: "ASA 5500-X Series", url: "manual-fw-asa5500.html" },
                { text: "Firepower 1000 Series", url: "manual-fw-fp1000.html" }
            ]
        }
    };

    // --- OBTENER ELEMENTOS DEL HTML ---
    // AQUÍ ES DONDE HACEMOS LOS CAMBIOS PARA QUE COINCIDAN CON EL NUEVO HTML
    const categoryButton = document.getElementById('boton-categoria');         // <-- CAMBIO
    const categoryMenu = document.getElementById('menu-categoria');           // <-- CAMBIO
    const optionsButton = document.getElementById('boton-opciones');          // <-- CAMBIO
    const optionsMenu = document.getElementById('menu-opciones');             // <-- CAMBIO
    const resultContainer = document.getElementById('resultado-contenedor');  // <-- CAMBIO
    
    // --- VARIABLES DE ESTADO ---
    // No necesitan cambios
    let selectedCategoryKey = null;
    let selectedOptionUrl = null;

    // --- FUNCIÓN PARA MANEJAR LA CREACIÓN Y VISIBILIDAD DEL BOTÓN ---
    // No necesita cambios
    function updateActionButton() {
        resultContainer.innerHTML = ''; 

        if (selectedOptionUrl) {
            const actionButton = document.createElement('button');
            actionButton.textContent = `Ver Manual de ${optionsButton.querySelector('span').textContent}`;
            actionButton.className = 'action-button';

            actionButton.addEventListener('click', () => {
                // Deshabilitamos temporalmente el botón para prevenir dobles clics
                actionButton.disabled = true;
                actionButton.textContent = "Cargando...";
                window.location.href = selectedOptionUrl;
            });
            
            resultContainer.appendChild(actionButton);
        } else if (selectedCategoryKey && optionsMenu.childElementCount > 0 && optionsButton.querySelector('span').textContent !== "Seleccione un modelo") {
            // Este `else if` se puede añadir opcionalmente para deshabilitar opciones sin URL
        }
    }
    
    // --- FUNCIÓN PARA POBLAR EL PRIMER MENÚ (CATEGORÍAS) ---
    // No necesita cambios en su lógica interna
    function populateCategoryMenu() {
        categoryMenu.innerHTML = ''; 
        for (const key in menuData) {
            const option = document.createElement('a');
            option.href = '#';
            option.textContent = menuData[key].displayText;
            option.dataset.key = key;

            option.addEventListener('click', (e) => {
                e.preventDefault();
                categoryButton.querySelector('span').textContent = menuData[key].displayText;
                
                selectedCategoryKey = key;
                selectedOptionUrl = null; 

                populateOptionsMenu(key);
                updateActionButton(); 

                categoryMenu.classList.remove('show');
                categoryButton.classList.remove('open');
            });
            categoryMenu.appendChild(option);
        }
    }

    // --- FUNCIÓN PARA POBLAR EL SEGUNDO MENÚ (MODELOS) ---
    function populateOptionsMenu(categoryKey) {
        const items = menuData[categoryKey].options;
        optionsMenu.innerHTML = '';
        optionsButton.querySelector('span').textContent = 'Seleccione un modelo'; 

        if (items.length > 0) {
            optionsButton.disabled = false;
            items.forEach(item => {
                const option = document.createElement('a');
                option.href = '#';
                option.textContent = item.text;

                // Si una opción no tiene URL, la deshabilitamos visualmente
                if (!item.url) {
                    option.classList.add('disabled-option');
                }

                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Evitar la selección si la opción está deshabilitada
                    if (!item.url) return; 

                    optionsButton.querySelector('span').textContent = item.text;
                    selectedOptionUrl = item.url;
                    
                    updateActionButton();
                    
                    optionsMenu.classList.remove('show');
                    optionsButton.classList.remove('open');
                });
                optionsMenu.appendChild(option);
            });
        } else {
            optionsButton.disabled = true;
        }
    }

    // --- LÓGICA PARA ABRIR Y CERRAR LOS MENÚS ---
    // No necesita cambios
    function toggleDropdown(button, menu) {
        menu.classList.toggle('show');
        button.classList.toggle('open');
    }

    categoryButton.addEventListener('click', () => {
        toggleDropdown(categoryButton, categoryMenu);
        optionsMenu.classList.remove('show');
        optionsButton.classList.remove('open');
    });

    optionsButton.addEventListener('click', () => {
        if (!optionsButton.disabled) {
            toggleDropdown(optionsButton, optionsMenu);
            categoryMenu.classList.remove('show');
            categoryButton.classList.remove('open');
        }
    });

    window.addEventListener('click', (e) => {
        // Corrección: Usamos los IDs del HTML nuevo para que no se cierre al hacer click en los menús
        if (!e.target.closest('.desplegable-principal') && !e.target.closest('.desplegable-secundario')) {
            categoryMenu.classList.remove('show');
            optionsMenu.classList.remove('show');
            categoryButton.classList.remove('open');
            optionsButton.classList.remove('open');
        }
    });

    // --- INICIALIZACIÓN ---
    // No necesita cambios
    populateCategoryMenu();
    optionsButton.disabled = true;

});