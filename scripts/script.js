document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE LOS MENÚS ---
    const menuData = {
        switches: {
            displayText: "Switches",
            options: [
                { text: "Core Huawei", url: "CoreHuawei.html" },
                { text: "Huawei con interfaz grafica", url: "HuaweiSI.html" },
                { text: "Huawei sin interfaz grafica", url: "HuaweiCI.html" },
                { text: "Cisco", url: "Cisco.html" },
                { text: "Mikrotik", url: "Mikrotik.html" },
                { text: "HPE Office", url: "HPEOffice.html" },
                { text: "Allied Telesis", url: "AlliedTelesis.html" }
            ]
        },
        PFSense: {
            displayText: "PFSense",
            options: [
                { text: "System", url: "PFSystem.html" },
                { text: "Interface", url: "PFInterface.html" },
                { text: "Firewall", url: "PFFirewall.html" },
                { text: "Service", url: "PFService.html" },
                { text: "VPN", url: "PFVpn.html" },
                { text: "Status", url: "PFStatus.html" },
                { text: "Diagnostics", url: "PFDiagnostics.html" }
            ]
        },
        WiFi: {
            displayText: "WiFi",
            options: [
                { text: "EzMaster", url: "EZmaster.html" },
                { text: "Huawei WiFi", url: "HWWiFi.html" }
            ]
        },
        Zabbix: {
            displayText: "Zabbix",
            options: [
                { text: "Monitoring", url: "ZBMonitoring.html" },
                { text: "Service", url: "ZBService.html" },
                { text: "Inventory", url: "ZBInventory.html" },
                { text: "Reports", url: "ZBReports.html" },
                { text: "Configuration", url: "ZBConfiguration.html" },
                { text: "Administration", url: "ZBAdministration.html"}
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