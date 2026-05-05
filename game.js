// ═══════════════════════════════════════════════════
//  TYPE RAID — JS Data Types Game
// ═══════════════════════════════════════════════════

// ─── BANCO DE PREGUNTAS ────────────────────────────
const QUESTIONS = [
  // STRING
  { value: '"Hola Mundo"',      type: 'string',    fact: '<strong>string</strong>: Texto entre comillas simples, dobles o backticks. <code>typeof "hola" === "string"</code>' },
  { value: "'JavaScript'",      type: 'string',    fact: '<strong>string</strong>: Las strings son inmutables. No puedes cambiar un carácter directamente.' },
  { value: '`Template ${1+1}`', type: 'string',    fact: '<strong>string</strong>: Los template literals (<code>`backticks`</code>) permiten interpolación y saltos de línea.' },
  { value: '"42"',              type: 'string',    fact: '<strong>string</strong>: <code>"42"</code> es string, no number. Las comillas lo convierten en texto.' },
  { value: '""',                type: 'string',    fact: '<strong>string</strong>: Una cadena vacía <code>""</code> es string y es falsy, pero ¡typeof sigue siendo "string"!' },

  // NUMBER
  { value: '42',                type: 'number',    fact: '<strong>number</strong>: JS tiene un solo tipo numérico (IEEE 754). Cubre enteros y decimales.' },
  { value: '3.14',              type: 'number',    fact: '<strong>number</strong>: Los decimales también son <code>number</code>. No existe "float" o "int" en JS primitivos.' },
  { value: 'NaN',               type: 'number',    fact: '<strong>¡Trampa!</strong> <code>NaN</code> (Not a Number) tiene typeof <code>"number"</code>. La paradoja más famosa de JS.' },
  { value: 'Infinity',          type: 'number',    fact: '<strong>number</strong>: <code>Infinity</code> y <code>-Infinity</code> son valores numéricos válidos en JS.' },
  { value: '-0',                type: 'number',    fact: '<strong>number</strong>: JS tiene un <code>-0</code> distinto de <code>0</code>. <code>-0 === 0</code> es true, pero <code>Object.is(-0, 0)</code> es false.' },

  // BOOLEAN
  { value: 'true',              type: 'boolean',   fact: '<strong>boolean</strong>: Solo hay dos valores: <code>true</code> y <code>false</code>. Son sensibles a mayúsculas.' },
  { value: 'false',             type: 'boolean',   fact: '<strong>boolean</strong>: Valores falsy: <code>false, 0, "", null, undefined, NaN</code>. ¡Todo lo demás es truthy!' },
  { value: '1 === 1',           type: 'boolean',   fact: '<strong>boolean</strong>: Las expresiones de comparación devuelven boolean. <code>===</code> compara valor Y tipo.' },

  // NULL
  { value: 'null',              type: 'null',      fact: '<strong>¡Bug histórico!</strong> <code>typeof null === "object"</code> — un bug del lenguaje desde 1995 que no se puede corregir por compatibilidad.' },

  // UNDEFINED
  { value: 'undefined',         type: 'undefined', fact: '<strong>undefined</strong>: Valor por defecto de variables declaradas sin asignar. <code>let x; // x es undefined</code>' },
  { value: 'void 0',            type: 'undefined', fact: '<strong>undefined</strong>: <code>void 0</code> siempre evalúa a <code>undefined</code>. Se usaba para garantizarlo en JS antiguo.' },

  // OBJECT
  { value: '{ nombre: "Ana" }', type: 'object',    fact: '<strong>object</strong>: Los objetos literales, arrays, null* y funciones son objetos. *(null es un caso especial)' },
  { value: '[1, 2, 3]',         type: 'object',    fact: '<strong>object</strong>: Los arrays son objetos. <code>typeof [] === "object"</code>. Usa <code>Array.isArray()</code> para diferenciarlos.' },
  { value: 'new Date()',        type: 'object',    fact: '<strong>object</strong>: <code>Date</code>, <code>Map</code>, <code>Set</code> y cualquier instancia de clase son objetos.' },
  { value: '/regex/',           type: 'object',    fact: '<strong>object</strong>: Las expresiones regulares (<code>RegExp</code>) también son objetos en JS.' },

  // SYMBOL
  { value: 'Symbol("id")',      type: 'symbol',    fact: '<strong>symbol</strong>: Introducido en ES6. Cada Symbol es único e irrepetible. Ideal para claves de objeto sin colisiones.' },
  { value: 'Symbol()',          type: 'symbol',    fact: '<strong>symbol</strong>: <code>Symbol() !== Symbol()</code> siempre. No se pueden convertir a string sin <code>.toString()</code>.' },

  // BIGINT
  { value: '9007199254740993n', type: 'bigint',    fact: '<strong>bigint</strong>: ES2020. Permite enteros más grandes que <code>Number.MAX_SAFE_INTEGER</code>. La <code>n</code> al final lo define.' },
  { value: 'BigInt(42)',        type: 'bigint',    fact: '<strong>bigint</strong>: No se puede mezclar con <code>number</code> directamente. <code>1n + 1</code> lanza un TypeError.' },
];

const ALL_TYPES = ['string','number','boolean','null','undefined','object','symbol','bigint'];

// ─── ESTADO ────────────────────────────────────────
let state = {};

function initState() {
  state = {
    score: 0,
    lives: 3,
    level: 1,
    questionIndex: 0,
    questions: shuffle([...QUESTIONS]),
    timer: null,
    timeLeft: 0,
    locked: false,
  };
}

// ─── UTILIDADES ────────────────────────────────────
const shuffle = arr => arr.sort(() => Math.random() - .5);

function getOptions(correct) {
  const others = shuffle(ALL_TYPES.filter(t => t !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

function timeLimit() {
  // Disminuye con el nivel
  return Math.max(4000, 10000 - (state.level - 1) * 1000);
}

// ─── UI HELPERS ────────────────────────────────────
const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function renderLives() {
  $('lives').innerHTML = Array.from({length: 3}, (_, i) =>
    `<div class="life-dot ${i >= state.lives ? 'lost' : ''}"></div>`
  ).join('');
}

function renderOptions(options, correct) {
  const grid = $('options-grid');
  grid.innerHTML = '';
  options.forEach(type => {
    const btn = document.createElement('button');
    btn.className = `opt-btn ${type}`;
    btn.textContent = type;
    btn.onclick = () => answer(type, correct);
    grid.appendChild(btn);
  });
}

function showFeedback(kind, msg) {
  const el = $('feedback');
  el.className = `feedback ${kind}`;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function showFact(fact) {
  const el = $('fact-box');
  el.innerHTML = fact;
  el.classList.remove('hidden');
}

function hideFeedback() {
  $('feedback').classList.add('hidden');
  $('fact-box').classList.add('hidden');
}

// ─── TIMER ─────────────────────────────────────────
function startTimer() {
  const limit = timeLimit();
  state.timeLeft = limit;
  const fill = $('progress-fill');

  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.timeLeft -= 100;
    const pct = Math.max(0, state.timeLeft / limit * 100);
    fill.style.width = pct + '%';

    if (pct < 30) fill.style.background = 'linear-gradient(90deg,#ff006e,#a855f7)';
    else          fill.style.background = 'linear-gradient(90deg,var(--neon),var(--neon2))';

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      timeout();
    }
  }, 100);
}

// ─── LÓGICA ────────────────────────────────────────
function loadQuestion() {
  if (state.questionIndex >= state.questions.length) {
    state.questions = shuffle([...QUESTIONS]);
    state.questionIndex = 0;
    state.level++;
    $('level').textContent = state.level;
  }

  state.locked = false;
  hideFeedback();

  const q = state.questions[state.questionIndex];
  $('threat-code').textContent = q.value;
  $('score').textContent = state.score;
  renderOptions(getOptions(q.type), q.type);
  startTimer();
}

function answer(selected, correct) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const btns = document.querySelectorAll('.opt-btn');
  btns.forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
    if (b.textContent === selected && selected !== correct) b.classList.add('wrong');
  });

  const q = state.questions[state.questionIndex];

  if (selected === correct) {
    const bonus = Math.ceil(state.timeLeft / 100);
    state.score += 10 + bonus;
    showFeedback('ok', `✓ CORRECTO  +${10 + bonus} pts`);
    showFact(q.fact);
  } else {
    state.lives--;
    renderLives();
    showFeedback('bad', `✗ ERA "${correct.toUpperCase()}"`);
    showFact(q.fact);
    if (state.lives <= 0) { setTimeout(endGame, 1600); return; }
  }

  state.questionIndex++;
  setTimeout(loadQuestion, 1800);
}

function timeout() {
  if (state.locked) return;
  state.locked = true;

  const correct = state.questions[state.questionIndex].type;
  document.querySelectorAll('.opt-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });

  state.lives--;
  renderLives();
  showFeedback('timeout', '⏱ TIEMPO AGOTADO');
  showFact(state.questions[state.questionIndex].fact);

  state.questionIndex++;
  if (state.lives <= 0) { setTimeout(endGame, 1600); return; }
  setTimeout(loadQuestion, 1800);
}

function endGame() {
  clearInterval(state.timer);
  showScreen('screen-end');
  const win = state.score >= 150;
  $('end-title').textContent = win ? 'MISIÓN CUMPLIDA' : 'GAME OVER';
  $('end-title').className = `end-title ${win ? 'win' : 'lose'}`;
  $('end-score').textContent = `${state.score} puntos`;
  $('end-msg').textContent = win
    ? 'Excelente dominio de los tipos de datos. ¡Eres un verdadero dev!'
    : 'Sigue practicando. Los tipos de datos son la base de JS.';
}

// ─── INICIO ────────────────────────────────────────
function startGame() {
  initState();
  $('score').textContent = '0';
  $('level').textContent = '1';
  renderLives();
  showScreen('screen-game');
  loadQuestion();
}

$('btn-start').onclick   = startGame;
$('btn-restart').onclick = startGame;
