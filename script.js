document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const resumeFile = document.getElementById("resume").files[0];
  const jobDescription = document.getElementById("jd").value;
  const resultBox = document.getElementById("result");
  const btn = document.getElementById("analyzeBtn");
  const spinner = document.getElementById("spinner");

  if (!resumeFile || !jobDescription) {
    alert("Please upload a resume and enter a job description.");
    return;
  }

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
      body: formData
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const result = await response.json();

    resultBox.innerHTML = `
      <p><strong>Match Score:</strong> ${result.match_score}%</p>
      <p><strong>Explanation:</strong> ${result.explanation}</p>
      <p><strong>Suggestions:</strong></p>
      <ul>${result.suggestions.map(item => `<li>${item}</li>`).join("")}</ul>
    `;
  } catch (err) {
    resultBox.innerHTML = `<p style="color:red;">Error analyzing resume. Please try again later.</p>`;
    console.error("Error during resume analysis:", err);
  } finally {
    // Reset UI
    spinner.style.display = "none";
    btn.disabled = false;
    btn.innerText = "Analyze";
  }
});
