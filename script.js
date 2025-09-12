let data = {};

// 初始化，加载 mappings.json
async function init() {
  try {
    const res = await fetch("mappings.json");
    data = await res.json();
    console.log("✅ Loaded data:", data);
  } catch (err) {
    console.error("❌ Error loading mappings.json:", err);
  }
}

// 点击按钮后运行
function search() {
  const lectureInput = document.getElementById("lectures").value.trim();
  let lectures = parseInput(lectureInput);

  console.log("🔎 Searching with lectures:", lectures);

  let results = findQuestions(lectures, data);   // 👈 确保此函数定义了
  console.log("📌 Results found:", results);

  // 输出到页面
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

// 🔧 输入解析器，允许多种输入形式
function parseInput(input) {
  let lectures = [];

  if (!input) return lectures;

  // onlyX 模式
  if (input.toLowerCase().startsWith("only")) {
    let num = parseInt(input.replace(/[^0-9]/g, ""));
    if (!isNaN(num)) lectures.push("Lecture " + num);
  }
  // 范围 (4-6)
  else if (input.includes("-")) {
    let [start, end] = input.split("-").map(x => parseInt(x.trim()));
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      for (let i = start; i <= end; i++) {
        lectures.push("Lecture " + i);
      }
    }
  }
  // 列表 (2,5,10)
  else if (input.includes(",")) {
    input.split(",").forEach(num => {
      let n = parseInt(num.trim());
      if (!isNaN(n)) lectures.push("Lecture " + n);
    });
  }
  // 单一数字 (4 → 1到4)
  else {
    let maxNum = parseInt(input);
    if (!isNaN(maxNum) && maxNum >= 1) {
      for (let i = 1; i <= maxNum; i++) {
        lectures.push("Lecture " + i);
      }
    }
  }
  return lectures;
}

// 🔍 递归搜索匹配的题
function findQuestions(lectures, dataset) {
  let suggestions = [];

  function checkNode(node, exam, path = []) {
    if (Array.isArray(node)) {
      if (node.some(l => lectures.includes(l))) {
        suggestions.push({
          exam,
          section: path.find(p => p.toLowerCase().includes("part") || p.toLowerCase().includes("exercise")) || null,
          question: path.find(p => p.startsWith("Q") || p.match(/^\d+(\.\d+)?$/)) || null
        });
      }
    } else if (typeof node === "object" && node !== null) {
      for (let key in node) {
        checkNode(node[key], exam, [...path, key]);
      }
    }
  }

  for (let exam in dataset) {
    checkNode(dataset[exam], exam, []);
  }

  return suggestions;
}

// 加载数据
init();
