document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analyzeBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const resumeInput = document.getElementById("resumeFile");
    const jobDescription = document.getElementById("jobDescription").value;
    const resultBox = document.getElementById("result");
    const btn = document.getElementById("analyzeBtn");
    const spinner = document.getElementById("spinner");
    const scoreSpan = document.getElementById("score");
    const scoreBar = document.getElementById("scoreBar");
    const explanation = document.getElementById("explanation");
    const suggestionsList = document.getElementById("suggestions");

    if (!resumeInput || !resumeInput.files.length || !jobDescription.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const resumeFile = resumeInput.files[0];

    // Show loading UI
    btn.disabled = true;
    btn.innerText = "Analyzing...";
    spinner.style.display = "block";

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("https://resume-analyzer-backend-cdim.onrender.com/api/match", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze resume.");

      const result = await response.json();

      // Display result
      document.getElementById("result").classList.remove("hidden");
      scoreSpan.textContent = result.match_score;
      scoreBar.style.width = `${result.match_score}%`;
      explanation.textContent = result.explanation;
      suggestionsList.innerHTML = result.suggestions.map(s => `<li>${s}</li>`).join("");

    } catch (error) {
      console.error("Error during analysis:", error);
      resultBox.innerHTML = `<p style="color:red;">Error analyzing resume. Please try again later.</p>`;
    } finally {
      spinner.style.display = "none";
      btn.disabled = false;
      btn.innerText = "Analyze";
    }
  });
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

