(function(){
const $ = s => document.querySelector(s);
const input = $('#input');
const err = $('#err');
const status = $('#status');
const results = $('#results');
const binWrap = $('#binary');
const binOut = $('#binOut');
const themeBtn = $('#toggleTheme');
const htmlEl = document.documentElement;

// === Tema oscuro / claro ===
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') htmlEl.classList.add('light');
themeBtn.textContent = htmlEl.classList.contains('light') ? '☀️' : '🌗';
themeBtn.addEventListener('click', () => {
    htmlEl.classList.toggle('light');
    const isLight = htmlEl.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeBtn.textContent = isLight ? '☀️' : '🌗';
});

// === Funciones de red ===
function ipToInt(ip){
    const p = ip.split('.'); if(p.length!==4) return null;
    for(const o of p){ if(!/^\d+$/.test(o)) return null; const n=+o; if(n<0||n>255) return null; }
    return p.reduce((acc,oct)=> (acc<<8) + (+oct), 0) >>> 0;
}
function intToIp(int){ return [24,16,8,0].map(shift => (int>>>shift)&255).join('.'); }
function maskFromCidr(c){ if(c<0||c>32) return null; return ((0xFFFFFFFF << (32-c)) >>> 0); }
function cidrFromMask(maskInt){ const inv=(~maskInt)>>>0; if(((inv+1)&inv)!==0)return null; let c=0,m=maskInt; while(m&0x80000000){c++;m=(m<<1)>>>0;} return c; }
function isPrivate(int){ if((int&0xFF000000)===0x0A000000)return true; if((int&0xFFF00000)===0xAC100000)return true; if((int&0xFFFF0000)===0xC0A80000)return true; if((int&0xFFC00000)===0x64400000)return true; return false; }
function klass(int){ const first=(int>>>24)&255; if(first<=126)return 'A'; if(first<=191)return 'B'; if(first<=223)return 'C'; if(first<=239)return 'D (multicast)'; return 'E (experimental)'; }
function toBin(int){ return [24,16,8,0].map(s=>((int>>>s)&255).toString(2).padStart(8,'0')).join('.'); }

function parseInput(raw){ 
    if(!raw)return{err:'Ingresá una IP y máscara.'};
    const t=raw.trim().replace(/\s+/g,' ');
    let ipStr,mStr; 
    if(t.includes('/')){[ipStr,mStr]=t.split('/');mStr=mStr?.trim();} 
    else {[ipStr,mStr]=t.split(' ');} 
    const ipInt=ipToInt(ipStr); if(ipInt===null)return{err:'IP inválida.'}; 
    let cidr=null,maskInt=null; 
    if(/^\d{1,2}$/.test(mStr)){cidr=+mStr;maskInt=maskFromCidr(cidr);} 
    else {maskInt=ipToInt(mStr);cidr=cidrFromMask(maskInt);} 
    if(maskInt===null||cidr===null)return{err:'Máscara inválida.'}; 
    return{ipInt,cidr,maskInt}; 
}

function calc(){ 
    err.hidden=true;results.innerHTML='';binWrap.hidden=true;
    const parsed=parseInput(input.value); 
    if(parsed.err)return showError(parsed.err); 
    const{ipInt,cidr,maskInt}=parsed; 
    const network=(ipInt&maskInt)>>>0; 
    const wildcard=(~maskInt)>>>0; 
    const broadcast=(network|wildcard)>>>0; 
    let total=2**(32-cidr); let usable,firstHost,lastHost; 
    if(cidr===32){usable=1;firstHost=ipInt;lastHost=ipInt;} 
    else if(cidr===31){usable=2;firstHost=network;lastHost=broadcast;} 
    else {usable=Math.max(0,total-2);firstHost=(network+1)>>>0;lastHost=(broadcast-1)>>>0;} 
    const data={ 
        'Dirección ingresada':intToIp(ipInt),
        'Máscara (decimal)':intToIp(maskInt),
        'Máscara (CIDR)':`/${cidr}`,
        'Wildcard':intToIp(wildcard),
        'Red':intToIp(network),
        'Broadcast':intToIp(broadcast),
        'Primer host':intToIp(firstHost),
        'Último host':intToIp(lastHost),
        'Total de direcciones':total,
        'Hosts utilizables':usable,
        'Clase':klass(ipInt),
        'Rango':isPrivate(ipInt)?'Privado':'Público'
    }; 
    status.className=`pill ${isPrivate(ipInt)?'ok':'bad'}`; 
    status.textContent=isPrivate(ipInt)?'Privado':'Público'; 
    for(const[k,v]of Object.entries(data)){
        const dt=document.createElement('dt');dt.textContent=k;
        const dd=document.createElement('dd');dd.textContent=v;
        results.append(dt,dd);
    } 
    binWrap.hidden=false; 
    binOut.textContent=`IP: ${toBin(ipInt)}\nMáscara: ${toBin(maskInt)}\nRed: ${toBin(network)}\nBroadcast: ${toBin(broadcast)}`; 
}

function showError(m){err.hidden=false;err.textContent=m;status.className='pill bad';status.textContent='Error';}

$('#calc').addEventListener('click',calc);
$('#clear').addEventListener('click',()=>{input.value='';results.innerHTML='';err.hidden=true;status.className='pill';status.textContent='Esperando datos…';binWrap.hidden=true;});
$('#demo').addEventListener('click',()=>{const samples=['192.168.1.42/24','10.0.1.37 255.255.252.0'];input.value=samples[Math.floor(Math.random()*samples.length)];calc();});
input.addEventListener('keydown',e=>{if(e.key==='Enter')calc();});
})();
