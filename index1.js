const ATTACK_JSON_URL = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';

let mitreTechniques = [];

// Fetch and parse MITRE ATT&CK data once on page load
fetch(ATTACK_JSON_URL)
  .then(response => response.json())
  .then(data => {
    mitreTechniques = (data.objects || []).filter(obj => obj.type === 'attack-pattern').map(obj => ({
      id: obj.external_references?.find(ref => ref.source_name === 'mitre-attack')?.external_id || obj.id,
      name: obj.name,
      description: obj.description || ''
    }));
  })
  .catch(err => console.error('Error loading MITRE data:', err));

// Function to perform the search
function searchTechniques() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!query || mitreTechniques.length === 0) {
    resultsDiv.style.display = "none";
    return;
  }

  const results = mitreTechniques.filter(tech =>
    tech.id.toLowerCase().includes(query) ||
    tech.name.toLowerCase().includes(query) ||
    tech.description.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p>No techniques found for "<strong>${query}</strong>"</p>`;
  } else {
    results.forEach(tech => {
      const div = document.createElement("div");
      div.classList.add("result-item");
      div.innerHTML = `<strong>${tech.id} - ${tech.name}</strong><br><small>${tech.description}</small>`;
      resultsDiv.appendChild(div);
    });
  }
  resultsDiv.style.display = "block";
}

// Attach event listeners
document.getElementById("searchInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchTechniques();
  }
});
document.querySelector('.search-bar button').addEventListener('click', searchTechniques);

function searchTechniques() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  const resultsSection = document.getElementById("resultsSection");

  // Clear old results
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsSection.style.display = "none";
    return;
  }

  // Filter dataset (same logic as before)
  const results = mitreTechniques.filter(
    tech =>
      tech.name.toLowerCase().includes(query) ||
      tech.description.toLowerCase().includes(query) ||
      tech.id.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    resultsDiv.innerHTML = `<p>No techniques found for "<strong>${query}</strong>"</p>`;
  } else {
    resultsDiv.innerHTML = `<h2>Search Results</h2>`;
    results.forEach(tech => {
      const div = document.createElement("div");
      div.classList.add("result-item");
      div.innerHTML = `<strong>${tech.id} - ${tech.name}</strong><br><small>${tech.description}</small>`;
      resultsDiv.appendChild(div);
    });
  }

  resultsSection.style.display = "block"; // show the big panel
}
