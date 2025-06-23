let lastRankedResults = [];

// Handle form submit
document.getElementById("rankerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const zipFile = document.getElementById("zipFile").files[0];
  const jd = document.getElementById("jdInput").value;
  const spinner = document.getElementById("spinner");
  const tableBody = document.getElementById("rankBody");
  const rankResult = document.getElementById("rankResult");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!zipFile || !jd) {
    alert("Please upload a ZIP file and enter the job description.");
    return;
  }

  // Reset UI
  tableBody.innerHTML = "";
  rankResult.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  spinner.style.display = "block";

  const formData = new FormData();
  formData.append("zip_file", zipFile);
  formData.append("job_description", jd);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/rank", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Network error");

    const ranked = await response.json();
    lastRankedResults = ranked.results;  // ✅ Save results for CSV

    // Render rows
    lastRankedResults.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index === 0 ? "🥇" : index + 1}</td>
        <td>${item.filename}</td>
        <td>${item.match_score}</td>
        <td>${item.explanation}</td>
      `;
      tableBody.appendChild(row);
    });

    rankResult.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
  } catch (err) {
    alert("Something went wrong while ranking resumes.");
    console.error(err);
  } finally {
    spinner.style.display = "none";
  }
});

// Handle CSV download (client-side)
document.getElementById("downloadBtn").addEventListener("click", () => {
  const downloadBtn = document.getElementById("downloadBtn");

  if (!lastRankedResults || lastRankedResults.length === 0) {
    alert("No ranked data to download.");
    return;
  }

  // Show loading state
  downloadBtn.disabled = true;
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = "⏳ Downloading...";

  // Prepare CSV data
  const csvHeader = ["Rank", "Filename", "Score", "Explanation"];
  const csvRows = lastRankedResults.map((item, index) => [
    index + 1,
    `"${item.filename}"`,
    item.match_score,
    `"${item.explanation.replace(/"/g, '""')}"`
  ]);

  const csvContent = [csvHeader, ...csvRows]
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ranked_resumes.csv";
  a.click();
  window.URL.revokeObjectURL(url);

  // Restore button
  setTimeout(() => {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = originalText;
  }, 1000);
});

const themeToggle = document.getElementById("themeToggle");

// Apply saved preference on page load
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.checked = true;
}

// Listen for toggle changes
if (themeToggle) {
  themeToggle.addEventListener("change", (e) => {
    const isDark = e.target.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark);
  });
}

