function searchTechniques() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  const resultsSection = document.getElementById("resultsSection");

  // 🚀 Clear old results immediately when search starts
  resultsDiv.innerHTML = "";
  resultsSection.style.display = "none";

  if (!query) {
    return; // don’t search if input is empty
  }

  // Filter dataset
  const results = mitreTechniques.filter(tech =>
    tech.id.toLowerCase().includes(query) ||
    tech.name.toLowerCase().includes(query) ||
    tech.description.toLowerCase().includes(query)
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

  resultsSection.style.display = "block"; // show results panel
}
