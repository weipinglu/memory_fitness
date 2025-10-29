// Core interactions for Number Recall Trainer PWA.

// ---------- State ----------
let currentDigits = null;
let t0 = null;            // timestamp (performance.now) when speech ended
let speaking = false;
let voicesCache = [];

// ---------- Elements ----------
const langSelect = document.getElementById('langSelect');
const voiceSelect = document.getElementById('voiceSelect');
const digitsInput = document.getElementById('digitsInput');
const rateInput = document.getElementById('rateInput');
const rateValue = document.getElementById('rateValue');
const allowLeadingZeros = document.getElementById('allowLeadingZeros');
const speakBtn = document.getElementById('speakBtn');
const revealBtn = document.getElementById('revealBtn');
const numberOut = document.getElementById('numberOut');
const elapsedOut = document.getElementById('elapsedOut');

// ---------- Persistence ----------
const SETTINGS_KEY = 'nr_settings_v1';
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.lang) langSelect.value = s.lang;
    if (s.voiceURI) voiceSelect.value = s.voiceURI;
    if (Number.isFinite(s.n)) digitsInput.value = s.n;
    if (Number.isFinite(s.rate)) {
      rateInput.value = s.rate;
      rateValue.textContent = Number(s.rate).toFixed(2);
    }
    if (typeof s.allowZero === 'boolean') allowLeadingZeros.checked = s.allowZero;
  } catch {
    // ignore localStorage errors
  }
}
function saveSettings() {
  const s = {
    lang: langSelect.value,
    voiceURI: voiceSelect.value,
    n: parseInt(digitsInput.value || '6', 10),
    rate: parseFloat(rateInput.value || '1'),
    allowZero: !!allowLeadingZeros.checked
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ---------- Utilities ----------
function randomNDigitString(n, allowZeroLead = false) {
  if (n <= 0) return '';
  let s = '';
  for (let i = 0; i < n; i += 1) s += Math.floor(Math.random() * 10);
  if (!allowZeroLead && s[0] === '0') s = `${1 + Math.floor(Math.random() * 9)}${s.slice(1)}`;
  return s;
}

const zhMap = { '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九' };
function toChineseDigits(digs) {
  return digs.split('').map(d => zhMap[d] ?? d).join('');
}

function spokenForm(digs, lang, perDigitMode) {
  // Per-digit mode: speak each digit distinctly
  if (perDigitMode) {
    if (lang.startsWith('zh')) {
      // Use Chinese numerals with Chinese comma for cadence
      return toChineseDigits(digs).split('').join('、');
    }
    return digs.split('').join(', ');
  }
  // Whole string: let the TTS engine decide how to read it
  if (lang.startsWith('zh')) {
    // In Chinese, to ensure digits aren’t read as a large number name, still convert to Chinese digits without separators
    return toChineseDigits(digs);
  }
  return digs;
}

function resetRound() {
  numberOut.textContent = '—';
  elapsedOut.textContent = '—';
  currentDigits = null;
  t0 = null;
}

// ---------- Speech ----------
function listVoices() {
  voicesCache = speechSynthesis.getVoices() || [];
  populateVoiceSelect();
}

function populateVoiceSelect() {
  const lang = langSelect.value;
  const filtered = voicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  const previous = voiceSelect.value;
  voiceSelect.innerHTML = '<option value=\"\">Auto (best available)</option>';

  filtered.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.voiceURI || v.name || '';
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });

  // Try to keep previous selection if it still exists
  if ([...voiceSelect.options].some(o => o.value === previous)) {
    voiceSelect.value = previous;
  } else {
    voiceSelect.value = '';
  }
}

function chooseVoice(lang, voiceURI) {
  if (!voicesCache.length) return null;
  if (voiceURI) {
    const exact = voicesCache.find(v => (v.voiceURI === voiceURI) || (v.name === voiceURI));
    if (exact) return exact;
  }
  // Fallback: first voice matching language
  const matchLang = voicesCache.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (matchLang) return matchLang;
  // Last resort: default voice
  return speechSynthesis.getVoices()[0] || null;
}

function speakText(text, langCode, rate, voiceURI, onend) {
  try {
    window.speechSynthesis.cancel(); // stop any previous speech

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;

    const chosen = chooseVoice(langCode, voiceURI);
    if (chosen) utter.voice = chosen;

    utter.onend = () => {
      speaking = false;
      t0 = performance.now(); // start timing when speech actually ends
      if (typeof onend === 'function') onend();
    };
    utter.onerror = () => {
      speaking = false;
      t0 = performance.now(); // still start timer for usability
    };

    speaking = true;
    window.speechSynthesis.speak(utter);
  } catch {
    speaking = false;
    t0 = performance.now();
    if (typeof onend === 'function') onend();
  }
}

// ---------- Events ----------
// Keep rate badge in sync
rateInput.addEventListener('input', () => {
  rateValue.textContent = Number(rateInput.value).toFixed(2);
  saveSettings();
});

// Persist on changes
[langSelect, voiceSelect, digitsInput, allowLeadingZeros].forEach(el => {
  el.addEventListener('change', saveSettings);
});

// Refresh voices when language changes
langSelect.addEventListener('change', () => {
  populateVoiceSelect();
});

// Start (Speak)
speakBtn.addEventListener('click', () => {
  resetRound();

  const n = Math.max(1, Math.min(24, parseInt(digitsInput.value || '6', 10)));
  const allowZeros = !!allowLeadingZeros.checked;
  const lang = langSelect.value;
  const rate = parseFloat(rateInput.value || '1.0');
  const voiceURI = voiceSelect.value || '';

  currentDigits = randomNDigitString(n, allowZeros);
  const toSpeak = spokenForm(currentDigits, lang, true);

  speakBtn.disabled = true;
  revealBtn.disabled = true;

  speakText(toSpeak, lang, rate, voiceURI, () => {
    speakBtn.disabled = false;
    revealBtn.disabled = false;
  });
});

// Reveal
revealBtn.addEventListener('click', () => {
  if (!currentDigits) return;

  // If still speaking, stop and mark time if needed
  if (speaking) {
    window.speechSynthesis.cancel();
    speaking = false;
    if (!t0) t0 = performance.now();
  }

  numberOut.textContent = currentDigits;

  const now = performance.now();
  const elapsedSec = t0 ? (now - t0) / 1000 : 0;
  elapsedOut.textContent = `${elapsedSec.toFixed(2)} s`;

  // Optional: keep Reveal enabled if you want to re-check time; here we disable to prevent double-click confusion
  revealBtn.disabled = true;
});

// ---------- Init ----------
loadSettings();
rateValue.textContent = Number(rateInput.value).toFixed(2);

// Voice enumeration is async in some browsers; handle both paths
listVoices();
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {
    listVoices();
    populateVoiceSelect();
  };
}
