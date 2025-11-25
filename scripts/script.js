document.addEventListener('DOMContentLoaded', () => {

    // === Tema claro / oscuro ===
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const htmlEl = document.documentElement;

    // Aplicar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') htmlEl.classList.add('light');

    toggleThemeBtn.addEventListener('click', () => {
        htmlEl.classList.toggle('light');
        const isLight = htmlEl.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        toggleThemeBtn.textContent = isLight ? '☀️' : '🌗';
    });

    // Inicializa ícono
    toggleThemeBtn.textContent = htmlEl.classList.contains('light') ? '☀️' : '🌗';

    // === DATOS DE LOS MENÚS ===
    const menuData = {
        Networking: { displayText: "Networking", options: [{ text: "Modelo OSI", url:"ModeloOsi.html"}] },
        IPv4: { displayText: "IPv4", options: [{ text: "Calculador IP", url: "Calculadora.html"}] },
        switches: { displayText: "Switches", options: [
            { text: "Core Huawei", url: "CoreHuawei.html" },
            { text: "Huawei con interfaz grafica", url: "HuaweiIG.html" },
            { text: "Huawei sin interfaz grafica", url: "" },
            { text: "Cisco", url: "" },
            { text: "Mikrotik", url: "" },
            { text: "HPE Office", url: "" },
            { text: "Allied Telesis", url: "" }
        ]},
        PFSense: { displayText: "PFSense", options: [
            { text: "System", url: "" }, { text: "Interface", url: "" },
            { text: "Firewall", url: "" }, { text: "Service", url: "" },
            { text: "VPN", url: "" }, { text: "Status", url: "" }, { text: "Diagnostics", url: "" }
        ]},
        FortiNet: { displayText: "FortiNet", options: [
            { text: "Network", url: "" }, { text: "System", url: "" },
            { text: "Policy & Objects", url: "" }, { text: "Security Profiles", url: "" },
            { text: "VPN", url: "" }, { text: "User & Device", url: "" },
            { text: "Log & Report", url: "" }, { text: "Monitor", url: "" }
        ]},
        WiFi: { displayText: "WiFi", options: [{ text: "EzMaster", url: "" }, { text: "Huawei WiFi", url: "" }] },
        Zabbix: { displayText: "Zabbix", options: [
            { text: "Monitoring", url: "" }, { text: "Service", url: "" },
            { text: "Inventory", url: "" }, { text: "Reports", url: "" },
            { text: "Configuration", url: "" }, { text: "Administration", url: "" }
        ]}
    };

    // === Menú principal ===
    const categoryButton = document.getElementById('boton-categoria');
    const categoryMenu = document.getElementById('menu-categoria');
    const optionsButton = document.getElementById('boton-opciones');
    const optionsMenu = document.getElementById('menu-opciones');
    const resultContainer = document.getElementById('resultado-contenedor');

    let selectedCategoryKey = null;
    let selectedOptionUrl = null;

    function updateActionButton() {
        resultContainer.innerHTML = '';
        if (selectedOptionUrl) {
            const actionButton = document.createElement('button');
            actionButton.textContent = `Ver Manual de ${optionsButton.querySelector('span').textContent}`;
            actionButton.className = 'action-button';
            actionButton.addEventListener('click', () => {
                actionButton.disabled = true;
                actionButton.textContent = "Cargando...";
                window.location.href = selectedOptionUrl;
            });
            resultContainer.appendChild(actionButton);
        }
    }

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
                if (!item.url) option.classList.add('disabled-option');
                option.addEventListener('click', (e) => {
                    e.preventDefault();
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

    populateCategoryMenu();
    optionsButton.disabled = true;
});
