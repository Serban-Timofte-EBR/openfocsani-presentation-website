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
                { "id": "1-1", "s": "Bulevardul Gării", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Gării)", "st": "Finalizat" },
                { "id": "1-2", "s": "Aleea Căminului", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Căminului)", "st": "Finalizat" },
                { "id": "1-3", "s": "Strada Mărășești", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Mărășești - Romeo)", "st": "Finalizat" },
                { "id": "1-4", "s": "Aleea Alexandru Vlahuță", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Vlahuță)", "st": "Finalizat" },
                { "id": "1-5", "s": "Pasarela Odobești", "v": 20534.98, "z": 4, "d": "Reparații decapare și asfalt (Segment Pasarelă)", "st": "Finalizat" },
                { "id": "1-6", "s": "Strada Leon Kalustian", "v": 20534.98, "z": 4, "d": "Reparații decapare și asfalt (Segment Kalustian)", "st": "Finalizat" },
                { "id": "1-7", "s": "Strada Lupeni", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Lupeni OPC)", "st": "Finalizat" },
                { "id": "1-8", "s": "Bulevardul Republicii", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Republicii)", "st": "Finalizat" },
                { "id": "1-9", "s": "DN23", "v": 20534.98, "z": 6, "d": "Reparații decapare și asfalt (Segment Milcovul)", "st": "Finalizat" },
                { "id": "1-10", "s": "Strada Cezar Bolliac", "v": 20534.98, "z": 1, "d": "Reparații decapare și asfalt (Segment Bolliac)", "st": "Finalizat" },
                
                { "id": "2-1", "s": "Strada Cezar Bolliac", "v": 66163.60, "z": 1, "d": "Așternere covor asfaltic 4cm", "st": "Finalizat" },
                { "id": "2-2", "s": "Strada Lupeni", "v": 66163.60, "z": 1, "d": "Așternere covor asfaltic 4cm", "st": "Finalizat" },

                { "id": "3-1", "s": "Strada Fundătura Vâlcele", "v": 6521.53, "z": 4, "d": "Autogreder - balastat și reprofilat", "st": "Finalizat" },
                { "id": "3-2", "s": "Strada Gheorghe Apostoleanu", "v": 6521.53, "z": 3, "d": "Autogreder - balastat și reprofilat", "st": "Finalizat" },

                { "id": "4", "s": "Bulevardul Republicii 97", "v": 98758.30, "z": 1, "d": "Frezat și asfaltare parcare DGPCI", "st": "Finalizat" },

                { "id": "5-1", "s": "Aleea Căminului", "v": 2935.71, "z": 1, "d": "Reparații decapare manuală (Zona Paco)", "st": "Finalizat" },
                { "id": "5-2", "s": "Strada Ion Neculce", "v": 2935.71, "z": 1, "d": "Reparații decapare manuală", "st": "Finalizat" },

                { "id": "6-1", "s": "Fundătura Comisia Centrală", "v": 5804.73, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "6-2", "s": "Calea Moldovei", "v": 5804.73, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "6-3", "s": "Strada Golești", "v": 5804.73, "z": 5, "d": "Reparații prin balastare (Drumul Râmpii)", "st": "Finalizat" },
                { "id": "6-4", "s": "Strada Dorobanți", "v": 5804.73, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "6-5", "s": "Strada Virtuții", "v": 5804.73, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },

                { "id": "7-1", "s": "Piața Moldovei", "v": 7615.84, "z": 1, "d": "Reparații decapare manuală (Zona Piață)", "st": "Finalizat" },
                { "id": "7-2", "s": "Strada Unirea Principatelor", "v": 7615.84, "z": 1, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "7-3", "s": "Fundătura Ana Ipătescu", "v": 7615.84, "z": 1, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "7-4", "s": "Oborul de Vite", "v": 7615.84, "z": 2, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "7-5", "s": "Strada Cotești", "v": 7615.84, "z": 5, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "7-6", "s": "Strada Ion Neculce", "v": 7615.84, "z": 1, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "7-7", "s": "Aleea Sudului", "v": 7615.84, "z": 5, "d": "Reparații decapare manuală", "st": "Finalizat" },

                { "id": "8", "s": "Calea Munteniei", "v": 558600.98, "z": 5, "d": "Intersecție Moldovei-Munteniei-Brăilei (Covor asfaltic)", "st": "Finalizat" },

                { "id": "9-1", "s": "Strada Mugur", "v": 14336.15, "z": 3, "d": "Reparații decapare și trotuar", "st": "Finalizat" },
                { "id": "9-2", "s": "Aleea Florilor", "v": 14336.15, "z": 5, "d": "Reparații decapare și trotuar", "st": "Finalizat" },
                { "id": "9-3", "s": "Strada Antrepozite", "d": "Reparații decapare manuală", "v": 14336.15, "z": 3, "st": "Finalizat" },
                { "id": "9-4", "s": "Strada Dionysos", "v": 14336.15, "z": 3, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "9-5", "s": "Strada Războieni", "v": 14336.15, "z": 3, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "9-6", "s": "Strada Anul Revoluționar 1948", "v": 14336.15, "z": 4, "d": "Reparații decapare manuală", "st": "Finalizat" },
                { "id": "9-7", "s": "Strada Mitropolit Varlaam", "v": 14336.15, "z": 4, "d": "Reparații decapare manuală", "st": "Finalizat" },

                { "id": "10-1", "s": "Strada Autogării", "v": 87939.65, "z": 1, "d": "Reparații mecanice și covor asfaltic (Intrare Autogară)", "st": "Finalizat" },
                { "id": "10-2", "s": "Piața Hala Moldovei", "v": 87939.65, "z": 1, "d": "Reparații mecanice și covor asfaltic", "st": "Finalizat" },
                { "id": "10-3", "s": "Aleea Florilor", "v": 87939.65, "z": 5, "d": "Reparații mecanice și covor asfaltic", "st": "Finalizat" },

                { "id": "11", "s": "Calea Munteniei", "v": 123429.98, "z": 5, "d": "Centură - Parcare Paco - Hyundai (Covor asfaltic)", "st": "Finalizat" },
                { "id": "12", "s": "Calea Munteniei", "v": 6391.75, "z": 5, "d": "Centură - Parcare Tata și Fiul (Balastare)", "st": "Finalizat" },
                { "id": "13", "s": "Strada Dimitrie Cantemir", "v": 13774.76, "z": 1, "d": "Remontat pavele trotuar (CJV - Balada)", "st": "Finalizat" },

                { "id": "14-1", "s": "Strada Verde", "v": 2054.86, "z": 3, "d": "Reparații prin balastare (Parcare Școala 5)", "st": "Finalizat" },
                { "id": "14-2", "s": "Strada Salcâmului", "v": 2054.86, "z": 3, "d": "Reparații prin balastare", "st": "Finalizat" },
                { "id": "14-3", "s": "Strada Caisului", "v": 2054.86, "z": 3, "d": "Reparații prin balastare", "st": "Finalizat" },
                { "id": "14-4", "s": "Strada Șurii", "v": 2054.86, "z": 3, "d": "Reparații prin balastare", "st": "Finalizat" },
                { "id": "14-5", "s": "Strada Prunului", "v": 2054.86, "z": 3, "d": "Reparații prin balastare", "st": "Finalizat" },

                { "id": "15", "s": "Strada Revoluției", "v": 10050.64, "z": 4, "d": "Balastare și reprofilare parcare", "st": "Finalizat" },

                { "id": "16-1", "s": "Oborul de Vite", "v": 3589.47, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "16-2", "s": "Strada Rovine", "v": 3589.47, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "16-3", "s": "Strada Zăbala", "v": 3589.47, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },
                { "id": "16-4", "s": "Strada Drumușor", "v": 3589.47, "z": 2, "d": "Reparații prin balastare și reprofilare", "st": "Finalizat" },

                { "id": "INV-01", "s": "Primaria Municipiului Focsani", "v": 0, "z": 1, "d": "Creșterea eficienței energetice a clădirii Primăriei", "st": "În execuție" },
                { "id": "INV-02-a", "s": "Scoala Gimnaziala Alexandru Vlahuta Focsani", "v": 0, "z": 1, "d": "Renovarea energetică a clădirii Școlii Al. Vlahuță", "st": "În execuție" },
                { "id": "INV-02-b", "s": "Scoala Gimnaziala Nicolae Iorga Focsani", "v": 0, "z": 5, "d": "Renovarea energetică a clădirii Școlii Nicolae Iorga", "st": "În execuție" },
                { "id": "INV-03", "s": "Cinematograful Unirea Focsani", "v": 0, "z": 1, "d": "Creșterea performanței energetice a Cinematografului Unirea", "st": "În execuție" },
                { "id": "INV-04", "s": "Bulevardul Unirii", "v": 0, "z": 1, "d": "Reabilitarea și extinderea Sistemului de iluminat public - nivelul 1", "st": "În execuție" },
                { "id": "INV-05", "s": "Strada Anghel Saligny", "v": 0, "z": 3, "d": "Reabilitarea sistemului de termoficare urbană (etapa a III-a)", "st": "În execuție" },
                { "id": "INV-06", "s": "Bulevardul Brailei", "v": 0, "z": 5, "d": "Resistematizarea infrastructurii de transport (transport public, biciclete, pietonal)", "st": "În execuție" },
                { "id": "INV-07", "s": "Calea Moldovei", "v": 0, "z": 2, "d": "Înființarea de centre de colectare prin aport voluntar", "st": "În execuție" },
                { "id": "INV-08", "s": "Strada Republicii", "v": 0, "z": 1, "d": "Extinderea sistemului de management integrat al traficului", "st": "În execuție" },
                { "id": "INV-09", "s": "Strada Mandresti", "v": 0, "z": 6, "d": "Extindere rețea de distribuție gaze naturale în cartierul Mândrești", "st": "În execuție" },
                
                { "id": "STR-A-1", "s": "Strada Timis", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-A-2", "s": "Strada Nicolae Balcescu", "v": 0, "z": 1, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-A-3", "s": "Strada Predeal", "v": 0, "z": 2, "d": "Refacere infrastructură (tronson I. Creangă - G. Ionescu)", "st": "În execuție" },
                { "id": "STR-A-4", "s": "Strada Magazia Garii", "v": 0, "z": 1, "d": "Reparații și așternere covoare asfaltice carosabil", "st": "În execuție" },

                { "id": "STR-B-1", "s": "Strada Prof. C. Stere", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-2", "s": "Strada Ecaterina Varga", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-3", "s": "Strada Bujor", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-4", "s": "Strada Agriculturii", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-5", "s": "Strada Muresului", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-6", "s": "Strada Cernei", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-7", "s": "Strada Dogariei", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-8", "s": "Strada Crisana", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },
                { "id": "STR-B-9", "s": "Strada Greva de la Grivita", "v": 0, "z": 3, "d": "Refacere infrastructură și sistematizare verticală", "st": "În execuție" },

                { "id": "STR-C-1", "s": "Strada Alecu Sihleanu", "v": 0, "z": 4, "d": "Refacere infrastructură (inclusiv fundătura)", "st": "În execuție" },
                { "id": "STR-C-2", "s": "Strada Maior G. Sontu", "v": 0, "z": 4, "d": "Refacere infrastructură (inclusiv fundătura)", "st": "În execuție" },
                { "id": "STR-C-3", "s": "Strada Aviatorilor", "v": 0, "z": 4, "d": "Refacere infrastructură stradă", "st": "În execuție" },
                { "id": "STR-C-4", "s": "Aleea Cuza Voda", "v": 0, "z": 1, "d": "Refacere infrastructură (inclusiv fundătura)", "st": "În execuție" }
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