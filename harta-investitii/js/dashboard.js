const map = L.map('map-canvas', { zoomControl: false }).setView([45.696, 27.184], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

let layers = [];

const db = {
    "all": [
        { id: 1, s: "Strada Mărășești", v: 845000, z: 1, d: "Reparații trotuare și carosabil" },
        { id: 2, s: "Bulevardul București", v: 2800000, z: 5, d: "Iluminat LED" },
        { id: 3, s: "Strada Cuza Vodă 21", v: 1550000, z: 1, d: "Reabilitare totală" },
        { id: 4, s: "Strada Independenței", v: 450000, z: 1, d: "Marcaje rutiere" }
    ]
};

async function getCoordinates(streetName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(streetName + ', Focsani, Romania')}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon, boundingbox: data[0].boundingbox };
        }
    } catch (error) {
        console.error("Eroare la geocoding pentru:", streetName);
    }
    return null;
}

function getZCol(z) {
    const colors = { 1: "#ef4444", 2: "#f59e0b", 3: "#10b981", 4: "#8b5cf6", 5: "#3b82f6", 6: "#f97316" };
    return colors[z] || "#64748b";
}

async function render() {
    const zone = document.getElementById('zone-filter').value;
    const list = document.getElementById('investment-list');
    
    layers.forEach(l => map.removeLayer(l));
    layers = [];
    list.innerHTML = '<p class="p-4 text-xs font-bold text-blue-600 animate-pulse">Se încarcă datele geografice reale...</p>';

    let filtered = zone === 'toate' ? db.all : db.all.filter(x => x.z == zone);
    let total = 0;
    list.innerHTML = '';

    for (const item of filtered) {
        total += item.v;
        const coords = await getCoordinates(item.s);

        if (coords) {
            const marker = L.circleMarker([coords.lat, coords.lon], {
                radius: 12,
                fillColor: getZCol(item.z),
                color: "white",
                weight: 3,
                fillOpacity: 0.9
            }).addTo(map);

            marker.bindPopup(`<b>${item.s}</b><br>${item.d}<br><b>${item.v.toLocaleString()} RON</b>`);
            layers.push(marker);

            const card = document.createElement('div');
            card.className = 'm-2 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-lg cursor-pointer transition-all';
            card.innerHTML = `
                <span class="text-[8px] font-black px-2 py-1 rounded text-white mb-2 inline-block" style="background:${getZCol(item.z)}">ZONA ${item.z}</span>
                <h4 class="text-sm font-bold text-slate-800">${item.s}</h4>
                <p class="text-xs text-blue-600 font-bold">${item.v.toLocaleString()} RON</p>
            `;
            
            card.onclick = () => {
                map.flyTo([coords.lat, coords.lon], 16);
                marker.openPopup();
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