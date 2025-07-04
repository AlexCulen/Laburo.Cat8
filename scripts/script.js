document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE LOS MENÚS ---
    const menuData = {
        switches: {
            displayText: "Switches",
            options: [
                { text: "Core Huawei", url: "CoreHuawei.html" },
                { text: "Huawei con interfaz grafica", url: "" },
                { text: "Huawei sin interfaz grafica", url: "" },
                { text: "Cisco", url: "" },
                { text: "Mikrotik", url: "" },
                { text: "HPE Office", url: "" },
                { text: "Allied Telesis", url: "" }
            ]
        },
        PFSense: {
            displayText: "PFSense",
            options: [
                { text: "System", url: "" },
                { text: "Interface", url: "" },
                { text: "Firewall", url: "" },
                { text: "Service", url: "" },
                { text: "VPN", url: "" },
                { text: "Status", url: "" },
                { text: "Diagnostics", url: "" }
            ]
        },
        FortiNet: {
            displayText: "FortiNet",
            options: [
                { text: "Network", url: "" },
                { text: "System", url: "" },
                { text: "Policy & Objects", url: "" },
                { text: "Security Profiles", url: "" },
                { text: "VPN", url: "" },
                { text: "User & Device", url: "" },
                { text: "Log & Report", url: "" },
                { text: "Monitor", url: "" }
            ]
        },
        WiFi: {
            displayText: "WiFi",
            options: [
                { text: "EzMaster", url: "" },
                { text: "Huawei WiFi", url: "" }
            ]
        },
        Zabbix: {
            displayText: "Zabbix",
            options: [
                { text: "Monitoring", url: "" },
                { text: "Service", url: "" },
                { text: "Inventory", url: "" },
                { text: "Reports", url: "" },
                { text: "Configuration", url: "" },
                { text: "Administration", url: ""}
            ]
        }
    };

    // --- OBTENER ELEMENTOS DEL HTML ---
    const categoryButton = document.getElementById('boton-categoria');         
    const categoryMenu = document.getElementById('menu-categoria');           
    const optionsButton = document.getElementById('boton-opciones');          
    const optionsMenu = document.getElementById('menu-opciones');             
    const resultContainer = document.getElementById('resultado-contenedor');  
    
    // --- VARIABLES DE ESTADO ---
    let selectedCategoryKey = null;
    let selectedOptionUrl = null;

    // --- FUNCIÓN PARA MANEJAR LA CREACIÓN Y VISIBILIDAD DEL BOTÓN ---
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
        }
    }
    
    // --- FUNCIÓN PARA POBLAR EL PRIMER MENÚ (CATEGORÍAS) ---
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
        if (!e.target.closest('.desplegable-principal') && !e.target.closest('.desplegable-secundario')) {
            categoryMenu.classList.remove('show');
            optionsMenu.classList.remove('show');
            categoryButton.classList.remove('open');
            optionsButton.classList.remove('open');
        }
    });

    // --- INICIALIZACIÓN ---
    populateCategoryMenu();
    optionsButton.disabled = true;

});