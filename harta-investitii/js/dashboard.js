const map = L.map('map-canvas', { zoomControl: false }).setView([45.696, 27.184], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

let markers = [];
const geoCache = {};
let db = {};

async function loadData() {
    try {
        const response = await fetch('harta-investitii/data/investitii.json');
        console.log("Response: ", response)
        db = await response.json();
    } catch (e) {
        console.warn('Fetch failed, using embedded data');
        db = {
  "2025-H2": [
    { "id": 101, "s": "Bulevardul Gării", "v": 225884.83, "z": 1, "d": "Reparații decapări manuale și covor asfaltic (include Al. Căminului, Al. Vlahuță, Pasarela Odobești, Republicii)", "st": "Finalizat" },
    { "id": 102, "s": "Strada Cezar Bolliac", "v": 132327.2, "z": 1, "d": "Așternere covor asfaltic 4cm (Cezar Bolliac/Lupeni)", "st": "Finalizat" },
    { "id": 103, "s": "Strada Fundătura Vâlcele", "v": 13043.07, "z": 4, "d": "Autogreder – balastat și reprofilat (Vâlcele și Gh. Apostoleanu)", "st": "Finalizat" },
    { "id": 104, "s": "Bulevardul Republicii", "v": 98758.3, "z": 1, "d": "Frezat și așternere covor asfaltic parcare DGPCI", "st": "Finalizat" },
    { "id": 105, "s": "Aleea Căminului", "v": 5871.43, "z": 1, "d": "Reparații decapări manuale (Zona Paco / Ion Neculce)", "st": "Finalizat" },
    { "id": 106, "s": "Calea Moldovei", "v": 29023.67, "z": 2, "d": "Reparații prin balastare (Fdt. Comisia Centrală, Dorobanți, Virtuții)", "st": "Finalizat" },
    { "id": 107, "s": "Piața Moldovei", "v": 60926.75, "z": 1, "d": "Reparații decapări manuale (include Unirea Principatelor, Cotesti, Ion Neculce, Al. Sudului)", "st": "Finalizat" },
    { "id": 108, "s": "Bulevardul Munteniei", "v": 558600.98, "z": 5, "d": "Frezat și reparații mecanice intersecție Bd. Brăilei - Calea Moldovei", "st": "Finalizat" },
    { "id": 109, "s": "Aleea Florilor", "v": 100353.1, "z": 5, "d": "Reparații decapări manuale trotuare și carosabil (include Mugur, Antrepozite, Războieni)", "st": "Finalizat" },
    { "id": 110, "s": "Strada Autogării", "v": 263818.96, "z": 1, "d": "Reparații mecanice și covor asfaltic (Intrare Autogară, Piața Hală, Al. Florilor)", "st": "Finalizat" },
    { "id": 111, "s": "Calea Munteniei", "v": 123429.98, "z": 5, "d": "Reparații mecanice și covor parcare Hyundai / Paco", "st": "Finalizat" },
    { "id": 112, "s": "Calea Munteniei", "v": 6391.75, "z": 5, "d": "Reparații prin balastare parcare Tata și Fiul", "st": "Finalizat" },
    { "id": 113, "s": "Strada Dimitrie Cantemir", "v": 13774.76, "z": 1, "d": "Scos și remontat pavele trotuar (între CJV și Balada)", "st": "Finalizat" },
    { "id": 114, "s": "Strada Verde", "v": 12329.16, "z": 3, "d": "Reparații prin balastare (Parcare Școala 5, Sălcamului, Caisului, Șurii)", "st": "Finalizat" },
    { "id": 115, "s": "Strada Revoluției", "v": 10050.64, "z": 5, "d": "Balastare și reprofilare parcare (mixtură asfaltică frezată)", "st": "Finalizat" },
    { "id": 116, "s": "Strada Rovine", "v": 14357.89, "z": 2, "d": "Reparații prin balastare (Oborul de Vite, Zăbala, Drumușor)", "st": "Finalizat" },
    { "id": 201, "s": "Strada Victoriei 1", "v": 0, "z": 1, "d": "Eficiență energetică clădire Primăria Focșani", "st": "În execuție" },
    { "id": 202, "s": "Strada Unirea Principatelor", "v": 0, "z": 1, "d": "Performanță energetică Cinematograf Unirea", "st": "În execuție" },
    { "id": 203, "s": "Strada Mândrești", "v": 0, "z": 6, "d": "Extindere rețea distribuție gaze naturale cartier Mândrești", "st": "În execuție" },
    { "id": 204, "s": "Strada Nicolae Bălcescu", "v": 0, "z": 1, "d": "Refacere infrastructură străzi și sistematizare verticală", "st": "În execuție" },
    { "id": 205, "s": "Strada Magazia Gării", "v": 0, "z": 1, "d": "Reparații și așternere covoare asfaltice", "st": "În execuție" },
    { "id": 206, "s": "Strada Prof. C. Stere", "v": 0, "z": 3, "d": "Refacere infrastructură străzi (Ecaterina Varga, Agriculturii, Crișana etc.)", "st": "În execuție" },
    { "id": 207, "s": "Strada Aviatorilor", "v": 0, "z": 4, "d": "Refacere infrastructură (Alecu Sihleanu, Maior Șonțu, Aleea Cuza Vodă)", "st": "În execuție" }
  ]
}
    }
}

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
window.onload = async () => {
    await loadData();
    render();
};