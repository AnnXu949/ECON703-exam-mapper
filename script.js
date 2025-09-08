let data = {};

// Load the JSON mappings file
async function init() {
  const res = await fetch("mappings.json");
  data = await res.json();
}

// Search questions based on lectures completed
function search() {
  const lectureInput = document.getElementById("lectures").value.trim();

  let maxNum = parseInt(lectureInput);
  if (isNaN(maxNum) || maxNum < 1) {
    alert("Please enter a valid lecture number (≥1)");
    return;
  }

  // Build Lecture 1 ... N array
  const lectures = [];
  for (let i = 1; i <= maxNum; i++) {
    lectures.push("Lecture " + i);
  }

  // Find suggestions for these lectures
  let results = findQuestions(lectures, data);

  // Render results
  let list = document.getElementById("results");
  list.innerHTML = "";
  if (results.length === 0) {
    list.innerHTML = "<li>No questions found for these lectures.</li>";
  } else {
    results.forEach((r) => {
      let li = document.createElement("li");
      li.innerHTML = `${r.exam} - ${r.section}` + (r.question ? (" - Q" + r.question) : "");
      li.onclick = () => li.classList.toggle("done");
      list.appendChild(li);
    });
  }
}

// Core logic: match lectures against question mappings
function findQuestions(lectures, dataset) {
  let suggestions = [];
  for (let exam in dataset) {
    for (let section in dataset[exam]) {
      let questions = dataset[exam][section];
      // Case: nested object { "1.1": ["Lecture X"] }
      if (typeof questions === "object" && !Array.isArray(questions)) {
        for (let q in questions) {
          if (questions[q].some(l => lectures.includes(l))) {
            suggestions.push({ exam, section, question: q });
          }
        }
      } 
      // Case: array ["Lecture X", "Lecture Y"]
      else if (Array.isArray(questions)) {
        if (questions.some(l => lectures.includes(l))) {
          suggestions.push({ exam, section });
        }
      }
    }
  }
  return suggestions;
}

init();
