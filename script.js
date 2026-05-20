// =========================================================
// THE LIVING GALERIE - SISTEMA TEMPORAL UNIFICADO
// =========================================================

// ─── CONFIGURACIÓN ────────────────────────────────────────
const STORY_TIME_SECONDS = 60;
const FINAL_SCREENS = [
  "fin-sin-tiempo",
  "final-sombras",
  "final-error-fatal",
  "final-justicia"
];

// ─── CAPTURA DE ELEMENTOS HTML ────────────────────────────
const timerWidget  = document.getElementById("timer-widget");
const timerCount   = document.getElementById("timer-count");
const progressFill = document.getElementById("story-progress-fill");
const relleno      = document.getElementById("relleno");
const contador     = document.getElementById("contador");

// ─── ESTADO TEMPORAL ──────────────────────────────────────
let secondsLeft   = STORY_TIME_SECONDS;
let timerInterval = null;

// ─── DETECTAR SI ES PANTALLA FINAL ────────────────────────
function isFinalScreen() {
  return FINAL_SCREENS.includes(document.body.id);
}

// ─── FORMATEAR TIEMPO (segundos → MM:SS) ──────────────────
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// ─── ACTUALIZAR TODOS LOS ELEMENTOS VISUALES ──────────────
function updateVisuals(secs) {
  const progreso = ((STORY_TIME_SECONDS - secs) / STORY_TIME_SECONDS) * 100;

  if (timerCount)   timerCount.textContent = formatTime(secs);
  if (contador)     contador.textContent   = secs;
  if (progressFill) progressFill.style.width = progreso + "%";
  if (relleno)      relleno.style.width      = progreso + "%";

  if (secs <= 15) {
    timerWidget.classList.add("is-ending");
    if (progressFill) progressFill.style.filter = "brightness(1.15) saturate(1.3)";
  } else {
    timerWidget.classList.remove("is-ending");
    if (progressFill) progressFill.style.filter = "none";
  }
}

// ─── DETENER TEMPORIZADOR ─────────────────────────────────
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerWidget.hidden = true;
  timerWidget.classList.remove("is-ending");
}

// ─── INICIAR TEMPORIZADOR ─────────────────────────────────
function startTimer() {
  // ── CAMBIO CLAVE ──────────────────────────────────────
  // Recuperar el tiempo guardado de la página anterior.
  // Si no hay nada guardado (primera página), usar el total.
  const saved = sessionStorage.getItem("timerSeconds");
  secondsLeft = saved !== null ? parseInt(saved, 10) : STORY_TIME_SECONDS;
  // ─────────────────────────────────────────────────────

  timerWidget.hidden = false;
  updateVisuals(secondsLeft);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft--;

    // Guardar el tiempo restante antes de cualquier navegación
    sessionStorage.setItem("timerSeconds", secondsLeft);

    updateVisuals(secondsLeft);

    if (secondsLeft <= 0) {
      stopTimer();
      sessionStorage.removeItem("timerSeconds");
      window.location.href = "fin-sin-tiempo.html";
    }
  }, 1000);
}

// ─── CONTROL PRINCIPAL ────────────────────────────────────
function initializeTimer() {
  if (!isFinalScreen()) {
    startTimer();
  } else {
    // En pantalla final limpiar el tiempo guardado
    sessionStorage.removeItem("timerSeconds");
    stopTimer();
  }
}

// ─── ARRANCAR AL CARGAR LA PÁGINA ─────────────────────────
window.addEventListener("load", initializeTimer);