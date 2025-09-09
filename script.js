function search() {
  const lectureInput = document.getElementById("lectures").value.trim();
  let lectures = [];

  if (!lectureInput) {
    alert("Please enter a valid input");
    return;
  }

  // Case 1: onlyX → exactly that lecture
  if (lectureInput.toLowerCase().startsWith("only")) {
    let num = parseInt(lectureInput.replace(/[^0-9]/g, ""));
    if (!isNaN(num)) {
      lectures.push("Lecture " + num);
    }
  }
  // Case 2: range like 4-6
  else if (lectureInput.includes("-")) {
    let parts = lectureInput.split("-");
    let start = parseInt(parts[0]);
    let end = parseInt(parts[1]);
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      for (let i = start; i <= end; i++) {
        lectures.push("Lecture " + i);
      }
    }
  }
  // Case 3: comma-separated list like 2,5,10
  else if (lectureInput.includes(",")) {
    lectureInput.split(",").forEach(num => {
      let n = parseInt(num.trim());
      if (!isNaN(n)) {
        lectures.push("Lecture " + n);
      }
    });
  }
  // Case 4: single number N → Lectures 1...N
  else {
    let maxNum = parseInt(lectureInput);
    if (!isNaN(maxNum) && maxNum >= 1) {
      for (let i = 1; i <= maxNum; i++) {
        lectures.push("Lecture " + i);
      }
    }
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
      li.innerHTML = `${r.exam}`
                   + (r.section ? " - " + r.section : "")
                   + (r.question ? " - " + r.question : "");
      li.onclick = () => li.classList.toggle("done");
      list.appendChild(li);
    });
  }
}
