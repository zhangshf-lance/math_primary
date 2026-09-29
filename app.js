const $ = (id) => document.getElementById(id);
let current = [];

function render(items) {
  const pages = [];
  for (let start = 0; start < items.length; start += 10) {
    const group = items.slice(start, start + 10);
    pages.push(`<div class="problem-page">${group.map((item, offset) => `<div class="problem"><div><span class="num">${start + offset + 1}.</span>${item.expression} = <span class="blank">____________</span></div><div class="work-space"></div></div>`).join("")}</div>`);
  }
  $("problems").innerHTML = pages.join("");
  $("answers").innerHTML = `<strong>参考答案</strong><br>${items.map((item, i) => `${i + 1}. ${item.answer}`).join("　　")}`;
}

function readSettings() {
  return { count: $("count").value, digits: $("digits").value, operatorCount: $("operatorCount").value, parentheses: $("parentheses").checked, operations: [...document.querySelectorAll("input[name=op]:checked")].map((node) => node.value) };
}

function generate() {
  try { current = generateProblems(readSettings()); render(current); $("message").textContent = `已生成 ${current.length} 道题目`; $("answers").classList.remove("visible"); }
  catch (error) { $("message").textContent = error.message; }
}

$("generate").addEventListener("click", generate);
$("print").addEventListener("click", () => {
  if (!current.length) generate();
  if (current.length) {
    document.body.classList.add("printing");
    setTimeout(() => window.print(), 50);
  }
});
window.addEventListener("afterprint", () => document.body.classList.remove("printing"));
$("showAnswers").addEventListener("click", () => $("answers").classList.toggle("visible"));
generate();
