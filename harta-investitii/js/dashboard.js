const map = L.map('map-canvas', { zoomControl: false }).setView([45.696, 27.184], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

let markers = [];

const db = {
    "2025-H2": [
        { id: 1, s: "Strada Cuza Vodă", v: 150000, z: 1, d: "Asfaltare carosabil", c: [45.696, 27.184] },
        { id: 2, s: "Bulevardul București", v: 280000, z: 5, d: "Sistem iluminat LED", c: [45.685, 27.178] },
        { id: 3, s: "Strada Mărășești", v: 45000, z: 1, d: "Reparații trotuare", c: [45.701, 27.188] }
    ],
    "2026-H1": [
        { id: 4, s: "Calea Munteniei", v: 520000, z: 5, d: "Reabilitare sens giratoriu", c: [45.678, 27.172] },
        { id: 5, s: "Strada Obor", v: 92000, z: 2, d: "Amenajare parcări", c: [45.705, 27.195] }
    ]
};

function getZCol(z) {
    const colors = { 1: "#ef4444", 2: "#f59e0b", 3: "#10b981", 4: "#8b5cf6", 5: "#3b82f6", 6: "#f97316" };
    return colors[z] || "#64748b";
}

function render() {
    const period = document.getElementById('time-period').value;
    const zone = document.getElementById('zone-filter').value;
    const list = document.getElementById('investment-list');
    
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    list.innerHTML = '';

    let raw = [];
    if (period === 'all') {
        Object.values(db).forEach(p => raw.push(...p));
    } else {
        raw = db[period] || [];
    }

    let filtered = zone === 'toate' ? raw : raw.filter(x => x.z == zone);
    let total = 0;

    filtered.forEach(item => {
        total += item.v;
        const m = L.circleMarker(item.c, {
            radius: Math.sqrt(item.v) / 10,
            fillColor: getZCol(item.z),
            color: "white",
            weight: 2,
            fillOpacity: 0.8
        }).addTo(map);

        m.bindPopup(`<b>${item.s}</b><br>${item.d}<br><b>${item.v.toLocaleString()} RON</b>`);
        markers.push(m);

        const card = document.createElement('div');
        card.className = 'p-4 hover:bg-slate-50 cursor-pointer transition-colors';
        card.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-[8px] font-black px-2 py-0.5 rounded text-white" style="background:${getZCol(item.z)}">ZONA ${item.z}</span>
                <span class="text-xs font-black text-blue-600">${item.v.toLocaleString()} RON</span>
            </div>
            <h4 class="text-sm font-bold text-slate-800">${item.s}</h4>
            <p class="text-[11px] text-slate-500 leading-tight">${item.d}</p>
        `;
        card.onclick = () => {
            map.flyTo(item.c, 16);
            m.openPopup();
            // Pe mobil, facem scroll ușor sus să vedem harta după click pe listă
            if(window.innerWidth < 768) window.scrollTo({top: 0, behavior: 'smooth'});
        };
        list.appendChild(card);
    });

    document.getElementById('total-amount').innerText = total.toLocaleString() + " RON";
    document.getElementById('total-count').innerText = filtered.length;
}

document.getElementById('time-period').addEventListener('change', render);
document.getElementById('zone-filter').addEventListener('change', render);
window.onload = render;