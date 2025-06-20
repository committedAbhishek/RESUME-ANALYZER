document.getElementById("analyzerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const resumeFile = document.getElementById("resumeFile").files[0];
  const jobDescription = document.getElementById("jobDescription").value;

  if (!resumeFile || !jobDescription) {
    alert("Please upload a resume and enter a job description.");
    return;
  }

  const formData = new FormData();
  formData.append("resume_file", resumeFile);
  formData.append("job_description", jobDescription);

  try {
    const res = await fetch("https://resume-analyzer-backend-cdim.onrender.com/api/match", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to analyze resume");
    }

    const data = await res.json();

    // Display results
    // Display results
document.getElementById("score").textContent = `${data.match_score}`;
document.getElementById("scoreBar").style.width = `${data.match_score}%`;
document.getElementById("explanation").textContent = data.explanation;

const suggestionsList = document.getElementById("suggestions");
suggestionsList.innerHTML = "";
data.suggestions.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  suggestionsList.appendChild(li);
});

document.getElementById("result").classList.remove("hidden");


  } catch (err) {
    console.error(err);
    alert("Error analyzing the resume. Check if the backend is running.");
  }
});
