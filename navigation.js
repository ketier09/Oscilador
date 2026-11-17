// ================================================================
//  PRESENTACIÓN INTERACTIVA — NAVEGACIÓN
//  Puedes añadir, mover o quitar <article class="slide"> en el HTML.
//  El índice, la numeración y el contador se actualizan solos.
// ================================================================

// PREAJUSTES DEL SIMULADOR
// g: amortiguamiento γ, w0: frecuencia natural ω₀, F: fuerza/m,
// w: frecuencia externa, x0 y v0: condiciones iniciales.
// Para elegir un caso por diapositiva, cambia su data-sim="clave".
const presets = {
  ideal:      {g: 0,    w0: 2,   F: 0,   w: 1,   x0: 1, v0: 0},
  damped:     {g: 0.15, w0: 2,   F: 0,   w: 1,   x0: 2, v0: 0},
  critical:   {g: 2,    w0: 2,   F: 0,   w: 1,   x0: 2, v0: 0},
  over:       {g: 3,    w0: 2,   F: 0,   w: 1,   x0: 2, v0: 0},
  beats:      {g: 0,    w0: 2,   F: 1,   w: 1.8, x0: 0, v0: 0},
  forced:     {g: 0.3,  w0: 2,   F: 1,   w: 1.6, x0: 0, v0: 0},
  overforced: {g: 2.5,  w0: 1.5, F: 1,   w: 1,   x0: 2, v0: 0},
  resonance:  {g: 0.1,  w0: 2,   F: 1,   w: 2,   x0: 0, v0: 0},
  problem:    {g: 0.2,  w0: 2,   F: 0.1, w: 2,   x0: 0, v0: 0}
};

const nombresCasos = {
  ideal: 'Ideal · Hooke', damped: 'Libre amortiguado',
  critical: 'Crítico', over: 'Sobreamortiguado', beats: 'Batidos',
  forced: 'Forzado', overforced: 'Forzado sobreamortiguado',
  resonance: 'Resonancia', problem: 'Modelo equivalente escalado'
};

const slides = Array.from(document.querySelectorAll('.slide'));
const sim = document.getElementById('simFrame');
const dock = document.getElementById('simdock');
const counter = document.getElementById('count');
const pg = document.getElementById('progress');
const indice = document.getElementById('quickIndex');
let index = 0, simReady = false, visible = false, lastPreset = '';

// GENERAR NÚMEROS E ÍNDICE: no los escribas a mano.
slides.forEach((slide, i) => {
  const numero = i + 1;
  const titulo = slide.querySelector('h1')?.textContent?.trim() || `Diapositiva ${numero}`;
  slide.dataset.slideNumber = String(numero);
  const label = document.createElement('div');
  label.className = 'slide-numeral';
  label.textContent = `${String(numero).padStart(2, '0')} / ${slides.length}`;
  label.setAttribute('aria-label', `Diapositiva ${numero} de ${slides.length}`);
  slide.appendChild(label);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'index-item';
  button.dataset.goto = String(i);
  button.textContent = String(numero).padStart(2, '0');
  button.title = `${numero}. ${titulo}`;
  button.setAttribute('aria-label', `Ir a diapositiva ${numero}: ${titulo}`);
  button.addEventListener('click', () => show(i));
  indice.appendChild(button);
});

// El simulador mantiene sus parámetros a través de postMessage.
function sendPreset(key) {
  if (!presets[key]) return;
  lastPreset = key;
  if (simReady) sim.contentWindow.postMessage(
    {kind: 'oscilaciones:setPreset', params: presets[key], running: true}, '*'
  );
  document.getElementById('currentcase').textContent = nombresCasos[key] || key;
}

function setDock(open) {
  visible = open;
  dock.classList.toggle('open', open);
  document.getElementById('toggle').textContent = open ? 'Ocultar simulador' : 'Mostrar simulador';
}

// En diapositivas con data-sim, 'Siguiente' abre la demostración
// primero. Un segundo clic avanza a la siguiente diapositiva.
function nextStep() {
  const caseKey = slides[index].dataset.sim;
  if (caseKey && !visible) { setDock(true); sendPreset(caseKey); }
  else show(index + 1);
}

function show(n) {
  index = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((slide, i) => { slide.style.display = i === index ? 'block' : 'none'; });
  counter.textContent = `${index + 1} / ${slides.length}`;
  indice.querySelectorAll('.index-item').forEach((button, i) => {
    button.classList.toggle('active', i === index);
    if (i === index) {
      button.setAttribute('aria-current', 'page');
      button.scrollIntoView({block: 'nearest'});
    } else button.removeAttribute('aria-current');
  });
  pg.style.width = `${((index + 1) / slides.length) * 100}%`;
  setDock(false); // Nunca abrir automáticamente al entrar en otra diapositiva.
  const caseKey = slides[index].dataset.sim;
  if (caseKey) sendPreset(caseKey);
  history.replaceState(null, '', `#${index + 1}`);
  slides[index].scrollTop = 0;
}

// TECLADO Y BOTONES
window.addEventListener('keydown', event => {
  if (event.target.closest('iframe,button,input,textarea,[contenteditable]')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault(); nextStep();
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault(); show(index - 1);
  }
  if (event.key === 'Escape') setDock(false);
  if (event.key === 's' || event.key === 'S') setDock(!visible);
});

sim.addEventListener('load', () => {
  simReady = true;
  if (lastPreset) sendPreset(lastPreset);
});
document.getElementById('prev').addEventListener('click', () => show(index - 1));
document.getElementById('next').addEventListener('click', nextStep);
document.getElementById('toggle').addEventListener('click', () => setDock(!visible));
document.getElementById('restart').addEventListener('click', () => sendPreset(lastPreset));
document.querySelectorAll('[data-demo]').forEach(button => {
  button.addEventListener('click', () => {
    setDock(true);
    sendPreset(button.dataset.demo);
  });
});
show((parseInt(location.hash.slice(1), 10) || 1) - 1);
