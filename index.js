let roadsData = [];


fetch("roads.json")
  .then(res => res.json())
  .then(data => {
    roadsData = data.roads;
    console.log("Road data loaded.");
  });


function showScreen(tabId) {
  document.querySelectorAll('.tabPanel').forEach(panel => {
    panel.hidden = true;
  });

  document.getElementById(tabId).hidden = false;
}


function handleSearch() {
  const name = document.getElementById("roadSearch").value.trim().toLowerCase();
  const road = roadsData.find(r => r.name.toLowerCase() === name);

  if (!road) {
    setStatus("Road not found.");
    return;
  }


  updateCalculations(road);
  updateAboutRoad(road);
  updateCostTab(road);
  updateDecayTab(road);
  updateNumberTab(road);
  updateSummaryTab(road);

  setStatus(`Loaded road: ${road.name}`);
}


function updateCalculations(road) {
  const total = road.potholes.shallow + road.potholes.medium + road.potholes.deep;

  const density = total / road.lengthKm;
  const avgDistance = road.lengthKm / total;

  const shallowPct = (road.potholes.shallow / total) * 100;
  const mediumPct = (road.potholes.medium / total) * 100;
  const deepPct = (road.potholes.deep / total) * 100;

  const repairCost =
    road.potholes.shallow * road.costs.repairPerShallow +
    road.potholes.medium * road.costs.repairPerMedium +
    road.potholes.deep * road.costs.repairPerDeep;

  const resurfaceCost = road.lengthKm * road.costs.resurfacePerKm;
  const decision = repairCost > resurfaceCost ? "Resurface" : "Repair";

  setText("densityOutput", `Density: ${density.toFixed(2)} potholes/km`);
  setText("avgDistanceOutput", `Average distance: ${avgDistance.toFixed(2)} km`);
  setText("depthPercentOutput", `Depth: ${shallowPct.toFixed(1)}% shallow, ${mediumPct.toFixed(1)}% medium, ${deepPct.toFixed(1)}% deep`);
  setText("costDecisionOutput", `Repair: $${repairCost}, Resurface: $${resurfaceCost}. Recommended: ${decision}`);
  const weeks = estimateDecay(road);
    setText("decayOutput", weeks === null ? "Not enough data to estimate decay.": `Estimated ${weeks} weeks until deep potholes exceed 50% of total.`
);
  setText("reportOutput", generateReport(road, density, decision));
}


function updateAboutRoad(road) {
  const about = document.getElementById("aboutRoadContent");
  if (!about) return;

  about.innerHTML = `
    <div class="resultCard">
      <h3>Road Information</h3>
      <p><strong>Name:</strong> ${road.name}</p>
      <p><strong>Type:</strong> ${road.type}</p>
      <p><strong>Length:</strong> ${road.lengthKm} km</p>
    </div>

    <div class="resultCard">
      <h3>Pothole Counts</h3>
      <p>Shallow: ${road.potholes.shallow}</p>
      <p>Medium: ${road.potholes.medium}</p>
      <p>Deep: ${road.potholes.deep}</p>
    </div>
  `;
}


function updateCostTab(road) {
  const costArea = document.getElementById("costTabContent");
  if (!costArea) return;

  const shallow = road.potholes.shallow * road.costs.repairPerShallow;
  const medium = road.potholes.medium * road.costs.repairPerMedium;
  const deep = road.potholes.deep * road.costs.repairPerDeep;

  const repairCost = shallow + medium + deep;
  const resurfaceCost = road.lengthKm * road.costs.resurfacePerKm;
  const decision = repairCost > resurfaceCost ? "Resurface" : "Repair";

  costArea.innerHTML = `
    <div class="resultCard">
      <h3>Cost Breakdown</h3>
      <p>Shallow repairs: $${shallow}</p>
      <p>Medium repairs: $${medium}</p>
      <p>Deep repairs: $${deep}</p>
      <p><strong>Total repair cost:</strong> $${repairCost}</p>
      <p><strong>Resurface cost:</strong> $${resurfaceCost}</p>
      <p><strong>Recommended:</strong> ${decision}</p>
    </div>
  `;
}


function updateDecayTab(road) {
  const decayArea = document.getElementById("decayTabContent");
  if (!decayArea) return;

  const weeks = estimateDecay(road);

  decayArea.innerHTML = `
    <div class="resultCard">
      <h3>Decay Rate</h3>
      <p>${weeks === null 
        ? "Not enough data to estimate decay." 
        : `Estimated ${weeks} weeks until deep potholes exceed 50% of total.`}
      </p>
    </div>
  `;
}


function estimateDecay(road) {
  const total = road.potholes.shallow + road.potholes.medium + road.potholes.deep;

  if (total === 0) return null;

  const deep = road.potholes.deep;
  const target = total * 0.5;

  if (deep >= target) return 0;

  const weeklyGrowth = 1;
  return Math.ceil((target - deep) / weeklyGrowth);
}


function updateNumberTab(road) {
  const numArea = document.getElementById("numberTabContent");
  if (!numArea) return;

  const total = road.potholes.shallow + road.potholes.medium + road.potholes.deep;

  numArea.innerHTML = `
    <div class="resultCard">
      <h3>Pothole Numbers</h3>
      <p><strong>Total:</strong> ${total}</p>
      <p>Shallow: ${road.potholes.shallow}</p>
      <p>Medium: ${road.potholes.medium}</p>
      <p>Deep: ${road.potholes.deep}</p>
    </div>
  `;
}


function updateSummaryTab(road) {
  const summary = document.getElementById("summaryTabContent");
  if (!summary) return;

  const total = road.potholes.shallow + road.potholes.medium + road.potholes.deep;
  const density = (total / road.lengthKm).toFixed(2);

  summary.innerHTML = `
    <div class="resultCard">
      <h3>Road Summary</h3>
      <p><strong>Name:</strong> ${road.name}</p>
      <p><strong>Length:</strong> ${road.lengthKm} km</p>
      <p><strong>Total potholes:</strong> ${total}</p>
      <p><strong>Density:</strong> ${density} potholes/km</p>
      <p>This road requires monitoring and maintenance based on pothole distribution and decay rate.</p>
    </div>
  `;
}


function generateReport(road, density, decision) {
  const total = road.potholes.shallow + road.potholes.medium + road.potholes.deep;

  return `
    Road: ${road.name}
    Length: ${road.lengthKm} km
    Total potholes: ${total}
    Density: ${density.toFixed(2)} potholes/km
    Recommended action: ${decision}
  `;
}


function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}


function loadRoad(name) {
  document.getElementById("roadSearch").value = name;
  handleSearch();
  showScreen('planTab');
}
