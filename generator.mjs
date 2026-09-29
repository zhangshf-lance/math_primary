const randomInt = (min, max, random = Math.random) =>
  min + Math.floor(random() * (max - min + 1));

const precedence = { "+": 1, "-": 1, "×": 2, "÷": 2 };

function leaf(digits, random) {
  if (digits === "mixed23") digits = random() < 0.5 ? 2 : 3;
  if (digits === "mixed23") digits = Math.random() < 0.5 ? 2 : 3; const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return { type: "number", value: BigInt(randomInt(min, max, random)) };
}

function combine(left, right, op) {
  if (op === "-" && left.value < right.value) return null;
  if (op === "÷") {
    if (right.value === 0n || left.value % right.value !== 0n) return null;
  }
  const value = op === "+" ? left.value + right.value
    : op === "-" ? left.value - right.value
    : op === "×" ? left.value * right.value
    : left.value / right.value;
  if (value < 0n || value > 1_000_000_000_000_000_000n) return null;
  return { type: "operation", op, left, right, value };
}

function format(node, parentOp = null, side = null) {
  if (node.type === "number") return String(node.value);
  const body = `${format(node.left, node.op, "left")} ${node.op} ${format(node.right, node.op, "right")}`;
  if (!parentOp) return body;
  const lower = precedence[node.op] < precedence[parentOp];
  const sameRight = side === "right" && precedence[node.op] === precedence[parentOp]
    && (parentOp === "-" || parentOp === "÷" || (parentOp === "×" && node.op === "÷"));
  return lower || sameRight ? `(${body})` : body;
}

function makeOne(settings, random) {
  const { digits, operations, operatorCount, parentheses } = settings;
  const ops = Array.from({ length: operatorCount }, () => operations[randomInt(0, operations.length - 1, random)]);
  if (operations.length > 1 && new Set(ops).size < 2) return null;
  const divisionCount = ops.filter(op => op === "÷").length;
  const rest = ops.filter(op => op !== "÷");
  if (!parentheses) rest.sort((a, b) => precedence[b] - precedence[a]);
  let root;
  if (divisionCount) {
    const divisors = Array.from({ length: divisionCount }, () => leaf(digits, random));
    const numerator = divisors.reduce((product, node) => product * node.value, BigInt(randomInt(2, 9, random)));
    if (numerator > 1_000_000_000_000_000_000n) return null;
    root = { type: "number", value: numerator };
    for (const divisor of divisors) root = combine(root, divisor, "÷");
  } else {
    root = combine(leaf(digits, random), leaf(digits, random), rest.shift());
  }
  if (!root) return null;
  for (const op of rest) {
    const operand = leaf(digits, random);
    root = combine(root, operand, op);
    if (!root) return null;
  }
  return { expression: format(root), answer: String(root.value), tree: root };
}

export function generateProblems(input, random = Math.random) {
  const settings = {
    count: Number(input.count), digits: Number(input.digits),
    operatorCount: Number(input.operatorCount),
    operations: [...input.operations], parentheses: Boolean(input.parentheses),
  };
  if (!Number.isInteger(settings.count) || settings.count < 10 || settings.count > 200 || settings.count % 10 !== 0) throw new Error("题量需为 10 的倍数（10 到 200 之间）");
  if (settings.digits !== "mixed23" && (!Number.isInteger(settings.digits) || settings.digits < 2 || settings.digits > 4)) throw new Error("位数需在 2 到 4 之间，或选择混合模式");
  if (!Number.isInteger(settings.operatorCount) || settings.operatorCount < 2 || settings.operatorCount > 4) throw new Error("每题运算符需在 2 到 4 个之间");
  if (!settings.operations.length || settings.operations.some(op => !precedence[op])) throw new Error("请选择至少一种运算");
  const results = [];
  const seen = new Set();
  let attempts = 0;
  while (results.length < settings.count && attempts++ < settings.count * 300) {
    const item = makeOne(settings, random);
    if (!item || seen.has(item.expression)) continue;
    seen.add(item.expression);
    results.push({ expression: item.expression, answer: item.answer });
  }
  if (results.length !== settings.count) throw new Error("当前条件下无法生成足够多的不重复题目，请调整设置");
  return results;
}
