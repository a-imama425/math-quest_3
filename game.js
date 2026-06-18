// ==============================
// 高校入試 数学クエスト game.js
// ==============================

// 現在選んでいる偏差値
let currentLevel = null;

// 現在の問題
let currentQuestion = null;

// スコア
let totalCount = 0;
let correctCount = 0;
let wrongCount = 0;

// HTMLの部品を取得
const levelScreen = document.getElementById("levelScreen");
const gameScreen = document.getElementById("gameScreen");

const levelLabel = document.getElementById("levelLabel");
const totalCountLabel = document.getElementById("totalCount");
const correctCountLabel = document.getElementById("correctCount");
const wrongCountLabel = document.getElementById("wrongCount");
const accuracyLabel = document.getElementById("accuracy");

const genreLabel = document.getElementById("genreLabel");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const answerButton = document.getElementById("answerButton");
const resultBox = document.getElementById("resultBox");
const explanationBox = document.getElementById("explanationBox");
const nextButton = document.getElementById("nextButton");


// ==============================
// 偏差値を選んだとき
// ==============================
function selectLevel(level) {
  currentLevel = level;

  // スコアをリセット
  totalCount = 0;
  correctCount = 0;
  wrongCount = 0;

  levelLabel.textContent = level === 65 ? "65以上" : level;

  // 画面を切り替え
  levelScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  updateScore();
  nextQuestion();
}


// ==============================
// 偏差値選択に戻る
// ==============================
function backToLevelSelect() {
  gameScreen.classList.add("hidden");
  levelScreen.classList.remove("hidden");

  answerInput.value = "";
  resultBox.classList.add("hidden");
  explanationBox.classList.add("hidden");
  nextButton.classList.add("hidden");
}


// ==============================
// 次の問題を出す
// ==============================
function nextQuestion() {
  currentQuestion = generateQuestionByLevel(currentLevel);

  genreLabel.textContent = currentQuestion.genre;
  questionText.textContent = currentQuestion.question;

  answerInput.value = "";
  answerInput.disabled = false;
  answerButton.disabled = false;

  resultBox.className = "result-box hidden";
  resultBox.textContent = "";

  explanationBox.classList.add("hidden");
  explanationBox.textContent = "";

  nextButton.classList.add("hidden");

  // スマホでもすぐ入力できるようにする
  setTimeout(() => {
    answerInput.focus();
  }, 100);
}


// ==============================
// 答え合わせ
// ==============================
function checkAnswer() {
  const userAnswer = normalizeAnswer(answerInput.value);
  const correctAnswer = normalizeAnswer(currentQuestion.answer);

  if (userAnswer === "") {
    alert("答えを入力してください");
    return;
  }

  totalCount++;

  answerInput.disabled = true;
  answerButton.disabled = true;

  resultBox.classList.remove("hidden");

  if (userAnswer === correctAnswer) {
    correctCount++;

    resultBox.classList.add("correct");
    resultBox.textContent = "正解！";

    // 正解時は解説を出さない
    explanationBox.classList.add("hidden");
  } else {
    wrongCount++;

    resultBox.classList.add("wrong");
    resultBox.textContent = "不正解";

    explanationBox.classList.remove("hidden");
    explanationBox.textContent =
      "正しい答え： " + currentQuestion.answer + "\n\n" +
      "解説：\n" + currentQuestion.explanation;
  }

  nextButton.classList.remove("hidden");
  updateScore();
}


// ==============================
// Enterキーでも答えられるようにする
// ==============================
answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !answerButton.disabled) {
    checkAnswer();
  }
});


// ==============================
// スコア更新
// ==============================
function updateScore() {
  totalCountLabel.textContent = totalCount;
  correctCountLabel.textContent = correctCount;
  wrongCountLabel.textContent = wrongCount;

  const accuracy = totalCount === 0
    ? 0
    : Math.round((correctCount / totalCount) * 100);

  accuracyLabel.textContent = accuracy + "%";
}


// ==============================
// 答えの表記ゆれを少し吸収する
// ==============================
function normalizeAnswer(answer) {
  return String(answer)
    .trim()
    .replace(/\s+/g, "")
    .replace(/　/g, "")
    .replace(/＝/g, "=")
    .replace(/，/g, ",")
    .replace(/、/g, ",")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/＋/g, "+")
    .replace(/－/g, "-")
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");
}


// ==============================
// 偏差値ごとに問題を選ぶ
// ==============================
function generateQuestionByLevel(level) {
  let generators = [];

  if (level === 40) {
    generators = [
      generateLinearEquation,
      generateSimpleCalculation
    ];
  } else if (level === 50) {
    generators = [
      generateLinearEquation,
      generateSimultaneousEquation,
      generateFactorization,
      generateProbability
    ];
  } else if (level === 60) {
    generators = [
      generateLinearEquation,
      generateSimultaneousEquation,
      generateFactorization,
      generateQuadraticEquation,
      generateProbability
    ];
  } else {
    generators = [
      generateSimultaneousEquation,
      generateFactorization,
      generateQuadraticEquation,
      generateHardProbability
    ];
  }

  const randomIndex = Math.floor(Math.random() * generators.length);
  return generators[randomIndex]();
}


// ==============================
// ランダム整数を作る
// ==============================
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ==============================
// 最大公約数
// ==============================
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}


// ==============================
// 分数を約分する
// ==============================
function simplifyFraction(numerator, denominator) {
  const g = gcd(numerator, denominator);
  return `${numerator / g}/${denominator / g}`;
}


// ==============================
// 問題1：基礎計算
// ==============================
function generateSimpleCalculation() {
  const a = randomInt(10, 50);
  const b = randomInt(1, 30);
  const c = randomInt(1, 10);

  const answer = a + b - c;

  return {
    genre: "基礎計算",
    question: `${a} + ${b} - ${c} を計算しなさい。`,
    answer: String(answer),
    explanation:
      `${a} + ${b} - ${c}\n` +
      `= ${a + b} - ${c}\n` +
      `= ${answer}`
  };
}


// ==============================
// 問題2：一次方程式
// ax + b = c
// ==============================
function generateLinearEquation() {
  const x = randomInt(1, 12);
  const a = randomInt(2, 9);
  const b = randomInt(1, 20);
  const right = a * x + b;

  return {
    genre: "一次方程式",
    question: `${a}x + ${b} = ${right}\n\nx の値を求めなさい。`,
    answer: String(x),
    explanation:
      `${a}x + ${b} = ${right}\n` +
      `${a}x = ${right} - ${b}\n` +
      `${a}x = ${right - b}\n` +
      `x = ${x}`
  };
}


// ==============================
// 問題3：連立方程式
// x + y = 合計
// x - y = 差
// ==============================
function generateSimultaneousEquation() {
  const x = randomInt(1, 10);
  const y = randomInt(1, 10);

  const sum = x + y;
  const diff = x - y;

  return {
    genre: "連立方程式",
    question:
      `次の連立方程式を解きなさい。\n\n` +
      `x + y = ${sum}\n` +
      `x - y = ${diff}\n\n` +
      `答えは「x=${x},y=${y}」の形で入力してください。`,
    answer: `x=${x},y=${y}`,
    explanation:
      `x + y = ${sum}\n` +
      `x - y = ${diff}\n\n` +
      `2つの式を足すと\n` +
      `2x = ${sum + diff}\n` +
      `x = ${x}\n\n` +
      `x + y = ${sum} に x = ${x} を代入すると\n` +
      `${x} + y = ${sum}\n` +
      `y = ${y}\n\n` +
      `よって x = ${x}, y = ${y}`
  };
}


// ==============================
// 問題4：因数分解
// x² + (a+b)x + ab
// ==============================
function generateFactorization() {
  const a = randomInt(1, 9);
  const b = randomInt(1, 9);

  const middle = a + b;
  const constant = a * b;

  return {
    genre: "因数分解",
    question:
      `次の式を因数分解しなさい。\n\n` +
      `x² + ${middle}x + ${constant}\n\n` +
      `答えは「(x+${a})(x+${b})」の形で入力してください。`,
    answer: `(x+${a})(x+${b})`,
    explanation:
      `x² + ${middle}x + ${constant}\n\n` +
      `足して ${middle}、かけて ${constant} になる2つの数を探します。\n` +
      `${a} + ${b} = ${middle}\n` +
      `${a} × ${b} = ${constant}\n\n` +
      `よって\n` +
      `(x + ${a})(x + ${b})`
  };
}


// ==============================
// 問題5：確率
// ==============================
function generateProbability() {
  const type = randomInt(1, 2);

  if (type === 1) {
    return {
      genre: "確率",
      question:
        `1から6までの数字が書かれたサイコロを1回投げます。\n\n` +
        `偶数が出る確率を求めなさい。`,
      answer: "1/2",
      explanation:
        `偶数は 2, 4, 6 の3通りです。\n` +
        `全体は 1, 2, 3, 4, 5, 6 の6通りです。\n\n` +
        `確率は 3/6 = 1/2`
    };
  } else {
    return {
      genre: "確率",
      question:
        `1から6までの数字が書かれたサイコロを1回投げます。\n\n` +
        `3以上の数が出る確率を求めなさい。`,
      answer: "2/3",
      explanation:
        `3以上の数は 3, 4, 5, 6 の4通りです。\n` +
        `全体は6通りです。\n\n` +
        `確率は 4/6 = 2/3`
    };
  }
}


// ==============================
// 問題6：二次方程式
// (x - a)(x - b) = 0
// ==============================
function generateQuadraticEquation() {
  const a = randomInt(1, 9);
  let b = randomInt(1, 9);

  // aとbが同じにならないようにする
  while (b === a) {
    b = randomInt(1, 9);
  }

  const middle = a + b;
  const constant = a * b;

  return {
    genre: "二次方程式",
    question:
      `次の二次方程式を解きなさい。\n\n` +
      `x² - ${middle}x + ${constant} = 0\n\n` +
      `答えは「x=${a},${b}」の形で入力してください。`,
    answer: `x=${a},${b}`,
    explanation:
      `x² - ${middle}x + ${constant} = 0\n\n` +
      `足して ${middle}、かけて ${constant} になる2つの数は ${a} と ${b} です。\n\n` +
      `(x - ${a})(x - ${b}) = 0\n\n` +
      `よって\n` +
      `x = ${a}, ${b}`
  };
}


// ==============================
// 問題7：少し難しい確率
// ==============================
function generateHardProbability() {
  const red = randomInt(2, 6);
  const white = randomInt(2, 6);
  const total = red + white;

  const fraction = simplifyFraction(red, total);

  return {
    genre: "確率・応用",
    question:
      `袋の中に赤玉が${red}個、白玉が${white}個入っています。\n\n` +
      `この袋から玉を1個取り出すとき、赤玉が出る確率を求めなさい。`,
    answer: fraction,
    explanation:
      `赤玉は ${red} 個です。\n` +
      `玉の合計は ${red} + ${white} = ${total} 個です。\n\n` +
      `赤玉が出る確率は ${red}/${total}\n` +
      `約分すると ${fraction}`
  };
}
