const map = L.map('map-canvas', { zoomControl: false }).setView([45.696, 27.184], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

let markers = [];
const geoCache = {};

const db = {
    "2025-H2": [
        { id: 1, s: "Strada Mărășești 12", v: 145000, z: 1, d: "Reparații trotuare și accesibilitate" },
        { id: 2, s: "Bulevardul București 25", v: 890000, z: 5, d: "Modernizare sistem iluminat public LED" },
        { id: 3, s: "Strada Cuza Vodă 21", v: 1550000, z: 1, d: "Reabilitare totală carosabil" },
        { id: 4, s: "Strada Independenței 4", v: 45000, z: 1, d: "Refacere marcaje rutiere" }
    ],
    "2026-H1": [
        { id: 7, s: "Strada Obor 5", v: 120000, z: 2, d: "Întreținere curentă" },
        { id: 9, s: "Calea Munteniei 50", v: 1250000, z: 5, d: "Construire sens giratoriu nou" },
        { id: 11, s: "Strada Mîndrești", v: 560000, z: 6, d: "Pietruire drumuri" }
    ]
};

async function getCoords(name) {
    if (geoCache[name]) return geoCache[name];
    try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name + ', Focsani, Romania')}`);
        const d = await r.json();
        if (d && d.length > 0) {
            geoCache[name] = [parseFloat(d[0].lat), parseFloat(d[0].lon)];
            return geoCache[name];
        }
    } catch (e) { console.error(e); }
    return null;
}

function getZCol(z) {
    const c = { 1: "#ef4444", 2: "#f59e0b", 3: "#10b981", 4: "#8b5cf6", 5: "#3b82f6", 6: "#f97316" };
    return c[z] || "#64748b";
}

async function render() {
    const period = document.getElementById('time-period').value;
    const zone = document.getElementById('zone-filter').value;
    const list = document.getElementById('investment-list');
    
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    list.innerHTML = '<div class="p-10 text-center text-[10px] font-bold text-blue-600 animate-pulse tracking-widest uppercase">Actualizare date geografice...</div>';

    let raw = [];
    if (period === 'all') {
        Object.values(db).forEach(arr => raw.push(...arr));
    } else { raw = db[period] || []; }

    let filtered = zone === 'toate' ? raw : raw.filter(x => x.z == zone);
    let total = 0;
    list.innerHTML = '';

    for (const item of filtered) {
        total += item.v;
        const c = await getCoords(item.s);

        if (c) {
            // SCALARE CORECTĂ: Min 8px, Max 22px
            const radius = Math.min(Math.max(Math.sqrt(item.v) / 45, 8), 22);

            const m = L.circleMarker(c, {
                radius: radius,
                fillColor: getZCol(item.z),
                color: "white",
                weight: 2,
                fillOpacity: 0.7
            }).addTo(map);

            m.bindPopup(`<div class="text-xs"><b>${item.s}</b><br>${item.d}<br><b class="text-blue-600">${item.v.toLocaleString()} RON</b></div>`);
            markers.push(m);

            const card = document.createElement('div');
            card.className = 'p-4 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-50';
            card.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[8px] font-black px-2 py-0.5 rounded text-white uppercase" style="background:${getZCol(item.z)}">Zona ${item.z}</span>
                    <span class="text-xs font-bold text-blue-600">${item.v.toLocaleString()} RON</span>
                </div>
                <h4 class="text-sm font-bold text-slate-800">${item.s}</h4>
                <p class="text-[11px] text-slate-500 leading-tight">${item.d}</p>
            `;
            card.onclick = () => {
                if (window.innerWidth < 768) window.scrollTo({top: 0, behavior: 'smooth'});
                map.flyTo(c, 16);
                m.openPopup();
            };
            list.appendChild(card);
        }
    }
    document.getElementById('total-amount').innerText = total.toLocaleString() + " RON";
    document.getElementById('total-count').innerText = filtered.length;
}

document.getElementById('time-period').addEventListener('change', render);
document.getElementById('zone-filter').addEventListener('change', render);
window.onload = render;