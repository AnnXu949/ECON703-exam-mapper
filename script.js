let data = {};

// Load the JSON mappings file
async function init() {
  try {
    const res = await fetch("mappings.json");
    data = await res.json();
    console.log("✅ Loaded data:", data);
  } catch (err) {
    console.error("❌ Error loading mappings.json:", err);
  }
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
  console.log("🔎 Searching with lectures:", lectures);

  // Find matches
  let results = findQuestions(lectures, data);
  console.log("📌 Results found:", results);

  // Render results
  let list = document.getElementById("results");
  list.innerHTML = "";
  if (results.length === 0) {
    list.innerHTML = "<li>No questions found for these lectures.</li>";
  } else {
    results.forEach((r) => {
      let li = document.createElement("li");
      // Show exam + section + (optional) question
      li.innerHTML = `${r.exam}` 
                   + (r.section ? " - " + r.section : "") 
                   + (r.question ? " - " + r.question : "");
      li.onclick = () => li.classList.toggle("done");
      list.appendChild(li);
    });
  }
}

// Core logic: recursively match lectures against question mappings
function findQuestions(lectures, dataset) {
  let suggestions = [];

  function checkNode(node, exam, section, question) {
    if (Array.isArray(node)) {
      // At leaf: check if lectures intersect
      if (node.some(l => lectures.includes(l))) {
        suggestions.push({
          exam,
          section: section || null,
          question: question || null
        });
      }
    } else if (typeof node === "object" && node !== null) {
      // Recurse deeper
      for (let key in node) {
        let nextSection = section;
        let nextQuestion = question;

        // If key looks like "Part 1" or "Exercise 1"
        if (key.toLowerCase().includes("part") || key.toLowerCase().includes("exercise")) {
          nextSection = key;
        }
        // If key looks like a question label "Q1", "Q2"
        else if (key.startsWith("Q") || key.match(/^\d+(\.\d+)?$/)) {
          nextQuestion = key;
        }

        checkNode(node[key], exam, nextSection, nextQuestion);
      }
    }
  }

  for (let exam in dataset) {
    checkNode(dataset[exam], exam, null, null);
  }

  return suggestions;
}

// Initialize on page load
init();
