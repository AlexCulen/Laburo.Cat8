const DATA = [
    { id:7, nombre:"Aplicación", pdu:"Datos", color:"#22c55e", funciones:["Interfaz con el usuario y aplicaciones","Protocolos de alto nivel"], protocolos:["HTTP(S)","FTP","SMTP","DNS","SSH","Telnet","WebSocket"], dispositivos:["Servidor web","Cliente (navegador)","Proxy"], ejemplos:["Navegar un sitio","Enviar correo","Consumo de API"], notas:"Incluye APIs y servicios que usan la red." },
    { id:6, nombre:"Presentación", pdu:"Datos", color:"#84cc16", funciones:["Formateo, compresión y cifrado"], protocolos:["TLS/SSL","JPEG","MPEG","ASCII/UTF-8"], dispositivos:["Servidor de aplicaciones"], ejemplos:["Cifrar una sesión TLS","Convertir formatos"], notas:"Traduce datos para la capa de aplicación." },
    { id:5, nombre:"Sesión", pdu:"Datos", color:"#eab308", funciones:["Administración de sesiones","Control de diálogo"], protocolos:["NetBIOS","RPC","gRPC (sobre HTTP/2)"], dispositivos:["Servidor de apps"], ejemplos:["Sesiones autenticadas","Reintentos de llamada"], notas:"Establece, mantiene y termina sesiones entre extremos." },
    { id:4, nombre:"Transporte", pdu:"Segmento/Datagrama", color:"#22d3ee", funciones:["Transporte extremo a extremo","Control de flujo y errores"], protocolos:["TCP","UDP","QUIC"], dispositivos:["Firewall L4","Balanceador"], ejemplos:["Conexión TCP","Streaming UDP"], notas:"Multiplexa puertos; fiabilidad con TCP; latencia y multiplexación con QUIC." },
    { id:3, nombre:"Red", pdu:"Paquete", color:"#60a5fa", funciones:["Enrutamiento entre redes","Direccionamiento lógico"], protocolos:["IP","ICMP","IPsec","RIP","OSPF","BGP"], dispositivos:["Router"], ejemplos:["Encaminar paquetes","TTL e ICMP"], notas:"Decide la ruta para llegar al destino." },
    { id:2, nombre:"Enlace de datos", pdu:"Trama", color:"#a78bfa", funciones:["Acceso al medio","Direccionamiento físico (MAC)","Detección de errores"], protocolos:["Ethernet","Wi‑Fi (802.11)","PPP","ARP","VLAN (802.1Q)"], dispositivos:["Switch","Bridge","NIC"], ejemplos:["Conmutación por MAC","ARP para resolver IP→MAC"], notas:"Subcapas LLC y MAC; opera dentro de un enlace." },
    { id:1, nombre:"Física", pdu:"Bits", color:"#f472b6", funciones:["Transmisión de señales","Medios y conectores"], protocolos:["UTP/FO","RS‑232","802.11 PHY","5G NR"], dispositivos:["Repeater","Hub","Cables"], ejemplos:["Voltajes, luz, radio"], notas:"Define niveles eléctricos/ópticos, temporización y pines." }
];

const stack = document.getElementById('stack');
const accordion = document.getElementById('accordion');
const q = document.getElementById('q');
const count = document.getElementById('count');
const filterLabel = document.getElementById('filterLabel');

function openDetails(id){
    const el = accordion.querySelector(`details[data-layer="${id}"]`);
    if(el){ el.open = true; el.scrollIntoView({ behavior:'smooth', block:'start' }); }
}

function renderStack(items){
    stack.innerHTML = '';
    items.forEach(layer => {
    const el = document.createElement('div');
    el.className = `layer c${layer.id}`;
    el.innerHTML = `
    <div class="badge" style="color:${layer.color}">${layer.id}</div>
    <div>
        <div class="name">${layer.nombre}</div>
        <div class="pdu">PDU: <span class="kbd">${layer.pdu}</span></div>
    </div>
    <button class="btn" data-jump="${layer.id}" title="Ver detalles de ${layer.nombre}">↗</button>`;
    el.querySelector('button').addEventListener('click', () => openDetails(layer.id));
    stack.appendChild(el);
    });
}

function pill(list){
    return list.map(x=>`<span class="chip">${x}</span>`).join(' ');
}

function renderAccordion(items){
    accordion.innerHTML = '';
    items.forEach(layer => {
    const d = document.createElement('details');
    d.className = 'osi';
    d.dataset.layer = layer.id;
    d.innerHTML = `
    <summary>
        <div class="idx">${layer.id}</div>
        <div class="ttl">${layer.nombre}</div>
        <div class="meta">PDU: <span class="kbd">${layer.pdu}</span></div>
    </summary>
    <div class="content">
        <div class="keyvals"><div class="key">Funciones</div><div class="vals">${pill(layer.funciones)}</div></div>
        <div class="keyvals"><div class="key">Protocolos</div><div class="vals">${pill(layer.protocolos)}</div></div>
        <div class="keyvals"><div class="key">Dispositivos</div><div class="vals">${pill(layer.dispositivos)}</div></div>
        <div class="keyvals"><div class="key">Ejemplos</div><div class="vals">${pill(layer.ejemplos)}</div></div>
        <p style="color:var(--muted)">${layer.notas}</p>
    </div>`;
    accordion.appendChild(d);
    });
}

function applyFilter(term){
    const t = term.trim().toLowerCase();
    if(!t){ count.textContent = `${DATA.length} capas`; filterLabel.textContent = 'ninguno'; renderStack(DATA); renderAccordion(DATA); return; }
    const filtered = DATA.filter(l => {
    const blob = [l.nombre, l.pdu, ...l.funciones, ...l.protocolos, ...l.dispositivos, ...l.ejemplos, l.notas].join(' ').toLowerCase();
    return blob.includes(t);
    });
    count.textContent = `${filtered.length} / ${DATA.length}`;
    filterLabel.textContent = t;
    renderStack(filtered);
    renderAccordion(filtered);
}

// Eventos UI
q.addEventListener('input', e => applyFilter(e.target.value));

document.getElementById('expandAll').addEventListener('click', () => {
    accordion.querySelectorAll('details').forEach(d => d.open = true);
});

document.getElementById('collapseAll').addEventListener('click', () => {
    accordion.querySelectorAll('details').forEach(d => d.open = false);
});

// Tema con persistencia
const toggleBtn = document.getElementById('toggleTheme');
function setTheme(light){
    document.documentElement.classList.toggle('light', light);
    toggleBtn.setAttribute('aria-pressed', String(light));
    try { localStorage.setItem('osi_theme', light ? 'light' : 'dark'); } catch {}
}

toggleBtn.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('light')));

(function init(){
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('osi_theme') : null;
    setTheme(saved === 'light');
    renderStack(DATA);
    renderAccordion(DATA);
})();
