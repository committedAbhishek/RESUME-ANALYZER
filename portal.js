// Optional: Future login check logic can be added here if needed

document.getElementById("analyzerCard").addEventListener("click", () => {
  window.location.href = "analyzer.html";  // Analyzer tool
});

document.getElementById("rankerCard").addEventListener("click", () => {
  window.location.href = "ranker.html";  // Ranker tool
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  // You can clear session storage or just redirect
  window.location.href = "index.html";
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
