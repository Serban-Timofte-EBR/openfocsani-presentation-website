const map = L.map("main-map", { zoomControl: false }).setView(
  [45.696, 27.184],
  14,
);
let activeMarkers = [];

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
).addTo(map);

const dbTest = {
  "2025-H2": [
    {
      s: "Strada Cuza Vodă",
      v: 150000,
      z: 1,
      d: "Asfaltare carosabil",
      c: [45.696, 27.184],
    },
    {
      s: "Bulevardul București",
      v: 280000,
      z: 5,
      d: "Sistem iluminat LED",
      c: [45.685, 27.178],
    },
    {
      s: "Strada Mărășești",
      v: 45000,
      z: 1,
      d: "Reparații trotuare",
      c: [45.701, 27.188],
    },
  ],
  "2026-H1": [
    {
      s: "Calea Munteniei",
      v: 520000,
      z: 5,
      d: "Reabilitare sens giratoriu",
      c: [45.678, 27.172],
    },
  ],
};

function renderDashboard() {
  const period = document.getElementById("time-period").value;
  const items = dbTest[period];
  const feed = document.getElementById("investment-feed");

  activeMarkers.forEach((m) => map.removeLayer(m));
  activeMarkers = [];
  feed.innerHTML = "";

  let totalValue = 0;

  items.forEach((item) => {
    totalValue += item.v;

    const marker = L.circleMarker(item.c, {
      radius: Math.sqrt(item.v) / 15,
      fillColor: "#3182ce",
      color: "white",
      weight: 2,
      fillOpacity: 0.7,
    }).addTo(map);

    marker.bindPopup(
      `<b>${item.s}</b><br>${item.d}<br><b>${item.v.toLocaleString()} RON</b>`,
    );
    activeMarkers.push(marker);

    const card = document.createElement("div");
    card.className = "feed-item";
    card.innerHTML = `
            <h4>${item.s}</h4>
            <p>${item.d}</p>
            <span class="price">${item.v.toLocaleString()} RON</span>
        `;
    card.onclick = () => map.flyTo(item.c, 16);
    feed.appendChild(card);
  });

  document.getElementById("stat-total-money").innerText =
    totalValue.toLocaleString() + " RON";
  document.getElementById("stat-project-count").innerText = items.length;
}

document
  .getElementById("time-period")
  .addEventListener("change", renderDashboard);
window.onload = renderDashboard;
