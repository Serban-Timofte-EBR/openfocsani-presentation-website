const map = L.map("map-canvas", { zoomControl: false }).setView(
  [45.696, 27.184],
  14,
);
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
).addTo(map);

let markers = [];

const dbDummy = {
  "2025-H2": [
    {
      id: 1,
      s: "Strada Cuza Vodă",
      v: 150000,
      z: 1,
      d: "Asfaltare carosabil",
      c: [45.696, 27.184],
    },
    {
      id: 2,
      s: "Bulevardul București",
      v: 280000,
      z: 5,
      d: "Sistem iluminat LED",
      c: [45.685, 27.178],
    },
    {
      id: 3,
      s: "Strada Mărășești",
      v: 45000,
      z: 1,
      d: "Reparații trotuare",
      c: [45.701, 27.188],
    },
    {
      id: 4,
      s: "Strada Obor",
      v: 92000,
      z: 2,
      d: "Amenajare parcări",
      c: [45.705, 27.195],
    },
  ],
  "2026-H1": [
    {
      id: 5,
      s: "Calea Munteniei",
      v: 520000,
      z: 5,
      d: "Reabilitare sens giratoriu",
      c: [45.678, 27.172],
    },
  ],
};

function render() {
  const period = document.getElementById("time-period").value;
  const zone = document.getElementById("zone-filter").value;
  const list = document.getElementById("investment-list");

  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  list.innerHTML = "";

  let rawData = dbDummy[period] || [];
  let filteredData =
    zone === "toate" ? rawData : rawData.filter((x) => x.z == zone);

  let totalSuma = 0;

  filteredData.forEach((item) => {
    totalSuma += item.v;

    const m = L.circleMarker(item.c, {
      radius: Math.sqrt(item.v) / 12,
      fillColor: getZoneColor(item.z),
      color: "white",
      weight: 2,
      fillOpacity: 0.8,
    }).addTo(map);

    m.bindPopup(
      `<b>${item.s}</b><br>${item.d}<br><b>${item.v.toLocaleString()} RON</b>`,
    );
    markers.push(m);

    const card = document.createElement("div");
    card.className = "investment-card";
    card.innerHTML = `
            <span class="zone-tag zt${item.z}">Zona ${item.z}</span>
            <h4>${item.s}</h4>
            <p>${item.d}</p>
            <span class="amount">${item.v.toLocaleString()} RON</span>
        `;
    card.onclick = () => {
      map.flyTo(item.c, 17);
      m.openPopup();
    };
    list.appendChild(card);
  });

  document.getElementById("total-amount").innerText =
    totalSuma.toLocaleString() + " RON";
  document.getElementById("total-count").innerText = filteredData.length;
  document.getElementById("view-title").innerText =
    zone === "toate" ? "Vedere Generală" : `Zona ${zone}`;
}

function getZoneColor(z) {
  const colors = {
    1: "#ef4444",
    2: "#eab308",
    3: "#22c55e",
    4: "#a855f7",
    5: "#3b82f6",
    6: "#f97316",
  };
  return colors[z] || "#64748b";
}

document.getElementById("time-period").addEventListener("change", render);
document.getElementById("zone-filter").addEventListener("change", render);
window.onload = render;
