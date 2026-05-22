// =========================================================
// THE LIVING GALERIE - TIEMPO, PISTAS E IMAGENES
// =========================================================

const SLIDE_TIME_SECONDS = 90;
const TOTAL_CLUES = 3;
const TOTAL_AWARDS = 4;
const FINAL_SCREENS = [
  "finsintiempo.html",
  "final1.html",
  "final2.html",
  "final3.html"
];

const CLUES_BY_PAGE = {
  "index.html": 0,
  "entradasecreta.html": 0,
  "encargadodelagaleria.html": 1,
  "nuevazona.html": 0,
  "saladeseguridad.html": 1,
  "camaradeseguridad.html": 1,
  "catalogo.html": 2,
  "archivoovulto.html": 2,
  "pinturaquecambia.html": 3,
  "compradoressospechosos.html": 3,
  "quedateypresionarlo.html": 2,
  "confrontaramarchetti.html": 2,
  "confrontarajaime.html": 3,
  "final1.html": 1,
  "final2.html": 2,
  "final3.html": 3,
  "finsintiempo.html": 0
};

const AWARDS = [
  {
    id: "primer-rastro",
    name: "Primer rastro",
    condition: ({ foundClues }) => foundClues >= 1
  },
  {
    id: "archivo-vivo",
    name: "Archivo vivo",
    condition: ({ page, foundClues }) => foundClues >= 2 || ["archivoovulto.html", "catalogo.html"].includes(page)
  },
  {
    id: "luz-ultravioleta",
    name: "Luz UV",
    condition: ({ foundClues }) => foundClues >= 3
  },
  {
    id: "caso-cerrado",
    name: "Caso cerrado",
    condition: ({ page }) => page === "final3.html"
  }
];

const JAIME_URL = "https://jaimerodriguezgomez.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaARdygJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeqnGpDF0xV2aGvN_LbeaFm4bv8nMzV4wdK4VlrgonRMbzZusRsBS4GKJaZBw_aem_ElKSN2Y_Mgl006NdL849KQ";

const DECISION_PROMPTS = {
  "entradasecreta.html": "La primera decision abre el tono del caso: puedes seguir a la persona que controla la galeria, validar las camaras o buscar una zona que nadie quiere senalar.",
  "encargadodelagaleria.html": "El sobre te da una pista, pero no una respuesta. Decide si la compruebas con seguridad, si buscas otro angulo o si presionas al encargado hasta que se contradiga.",
  "nuevazona.html": "Este pasillo no entrega pruebas por si solo; sirve para escoger que hilo seguir ahora: la tecnologia de seguridad o el archivo que alguien escondio.",
  "saladeseguridad.html": "Los registros reducen el campo de sospechosos. Puedes enfrentar a Jaime con lo que tienes, buscar la firma escondida o revisar si el catalogo conecta las obras robadas.",
  "camaradeseguridad.html": "La camara senala una ausencia calculada. Ahora necesitas decidir si buscas una prueba fisica o si comparas ese salto con el archivo oculto.",
  "catalogo.html": "El catalogo convierte las obras en un mapa. Puedes volver a la camara, cruzar compradores o ir al archivo para comprobar quien firmo la ruta.",
  "archivoovulto.html": "Las firmas falsas cambian el caso. La pintura podria esconder el mensaje final; la camara podria confirmar quien tuvo acceso.",
  "pinturaquecambia.html": "La pintura ya no es decoracion: es una confesion escondida. Decide si vas directo contra Jaime o si blindas la acusacion con seguridad o testimonios.",
  "compradoressospechosos.html": "La lista acerca el caso a Jaime, pero tambien muestra rutas incompletas. Puedes confrontarlo, buscar una pista extra o volver al encargado.",
  "quedateypresionarlo.html": "Marchetti te ofrece una version peligrosa: si le crees, Jaime queda al centro; si lo acusas, cierras el caso rapido; si te vas, salvas la investigacion pero pierdes impulso.",
  "confrontaramarchetti.html": "Todo parece demasiado ordenado contra Marchetti. La pregunta es si detienes la acusacion a tiempo o si apuestas el caso completo por una version que podria ser falsa.",
  "confrontarajaime.html": "Ya estas frente a Jaime. Si reuniste suficientes pistas, puedes cerrar el cerco; si no, retroceder puede ser la unica forma de no regalarle una salida."
};

const timerWidget = document.getElementById("timer-widget");
const timerCount = document.getElementById("timer-count");
const progressFill = document.getElementById("story-progress-fill");

let secondsLeft = SLIDE_TIME_SECONDS;
let timerInterval = null;

function currentPage() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function isFinalPage() {
  return FINAL_SCREENS.includes(currentPage());
}

function isHomePage() {
  return currentPage() === "index.html";
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimerVisuals(secs) {
  const progress = ((SLIDE_TIME_SECONDS - secs) / SLIDE_TIME_SECONDS) * 100;

  if (timerCount) timerCount.textContent = formatTime(secs);
  if (progressFill) progressFill.style.width = `${progress}%`;

  if (!timerWidget) return;
  if (secs <= 15) {
    timerWidget.classList.add("is-ending");
  } else {
    timerWidget.classList.remove("is-ending");
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  if (timerWidget) {
    timerWidget.hidden = true;
    timerWidget.classList.remove("is-ending");
  }
}

function startTimer() {
  if (!timerWidget) return;

  secondsLeft = SLIDE_TIME_SECONDS;
  timerWidget.hidden = false;
  updateTimerVisuals(secondsLeft);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft -= 1;
    updateTimerVisuals(secondsLeft);

    if (secondsLeft <= 0) {
      stopTimer();
      window.location.href = "finsintiempo.html";
    }
  }, 1000);
}

function initializeTimer() {
  if (isHomePage() || isFinalPage()) {
    stopTimer();
    return;
  }

  startTimer();
}

function resetGameOnHome() {
  if (isHomePage()) {
    sessionStorage.removeItem("foundClues");
    sessionStorage.removeItem("earnedAwards");
  }
}

function pageClues() {
  return CLUES_BY_PAGE[currentPage()] ?? 0;
}

function updateClueTracker() {
  const currentClues = pageClues();
  const savedClues = parseInt(sessionStorage.getItem("foundClues") || "0", 10);
  const foundClues = Math.max(savedClues, currentClues);

  if (!isHomePage()) {
    sessionStorage.setItem("foundClues", foundClues);
  }

  document.querySelectorAll(".right-panel").forEach((panel) => {
    const boxes = Array.from(panel.children);
    const clueBox = boxes.find((box) => {
      const label = box.querySelector(".panel-label");
      return label && label.textContent.trim().toLowerCase().includes("pistas");
    });

    if (!clueBox) return;

    const count = clueBox.querySelector(".panel-count");
    if (count) count.textContent = `${foundClues}/${TOTAL_CLUES}`;

    if (!clueBox.querySelector(".clue-meter")) {
      const meter = document.createElement("div");
      meter.className = "clue-meter";
      meter.innerHTML = `
        <div class="clue-meter-bar">
          <span style="width: ${(foundClues / TOTAL_CLUES) * 100}%"></span>
        </div>
        <p>${foundClues === TOTAL_CLUES ? "Expediente completo." : "Sigue buscando: todavia hay piezas sueltas."}</p>
      `;
      clueBox.appendChild(meter);
    } else {
      const meterFill = clueBox.querySelector(".clue-meter-bar span");
      const meterText = clueBox.querySelector(".clue-meter p");
      if (meterFill) meterFill.style.width = `${(foundClues / TOTAL_CLUES) * 100}%`;
      if (meterText) {
        meterText.textContent = foundClues === TOTAL_CLUES
          ? "Expediente completo."
          : "Sigue buscando: todavia hay piezas sueltas.";
      }
    }
  });
}

function savedAwards() {
  try {
    return JSON.parse(sessionStorage.getItem("earnedAwards") || "[]");
  } catch (error) {
    return [];
  }
}

function updateAwardTracker() {
  const page = currentPage();
  const foundClues = parseInt(sessionStorage.getItem("foundClues") || pageClues(), 10);
  const earned = new Set(savedAwards());

  AWARDS.forEach((award) => {
    if (award.condition({ page, foundClues })) earned.add(award.id);
  });

  if (!isHomePage()) {
    sessionStorage.setItem("earnedAwards", JSON.stringify(Array.from(earned)));
  }

  const earnedAwards = AWARDS.filter((award) => earned.has(award.id));
  const nextAward = AWARDS.find((award) => !earned.has(award.id));

  document.querySelectorAll(".right-panel").forEach((panel) => {
    const boxes = Array.from(panel.children);
    const awardBox = boxes.find((box) => {
      const label = box.querySelector(".panel-label");
      return label && label.textContent.trim().toLowerCase().includes("premios");
    });

    if (!awardBox) return;

    const count = awardBox.querySelector(".panel-count");
    if (count) count.textContent = `${earnedAwards.length}/${TOTAL_AWARDS}`;

    let meter = awardBox.querySelector(".award-meter");
    if (!meter) {
      meter = document.createElement("div");
      meter.className = "award-meter";
      awardBox.appendChild(meter);
    }

    const badges = earnedAwards.length
      ? earnedAwards.map((award) => `<span>${award.name}</span>`).join("")
      : "<span class=\"is-locked\">Sin premios aun</span>";

    meter.innerHTML = `
      <div class="award-badges">${badges}</div>
      <p>${nextAward ? `Proximo premio: ${nextAward.name}.` : "Todos los premios desbloqueados."}</p>
    `;
  });
}

function buildImageModal() {
  if (document.querySelector(".image-modal")) return;

  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <button class="image-modal-close" type="button" aria-label="Cerrar imagen ampliada">Cerrar</button>
    <img alt="" />
    <p></p>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.classList.contains("image-modal-close")) {
      modal.hidden = true;
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") modal.hidden = true;
  });
}

function initializeImagePopups() {
  buildImageModal();
  const modal = document.querySelector(".image-modal");
  const modalImg = modal.querySelector("img");
  const modalCaption = modal.querySelector("p");

  document.querySelectorAll(".story-img img, .home-img img").forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.title = "Haz clic para ampliar";

    const openImage = (event) => {
      event.preventDefault();
      modalImg.src = image.currentSrc || image.src;
      modalImg.alt = image.alt || "Imagen ampliada";
      modalCaption.textContent = image.alt || "";
      modal.hidden = false;
    };

    image.addEventListener("click", openImage);
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openImage(event);
    });
  });
}

function initializeLightPainting() {
  if (currentPage() !== "pinturaquecambia.html") return;

  const imageWrap = document.querySelector(".story-img");
  if (!imageWrap || imageWrap.classList.contains("light-painting")) return;

  imageWrap.classList.add("light-painting");

  const cta = document.createElement("div");
  cta.className = "light-cta";
  cta.textContent = "Pasa el cursor por la pintura para revelar la luz oculta";
  imageWrap.appendChild(cta);
}

function initializeJaimeCta() {
  const jaimeImage = document.querySelector('img[src*="JAIME"]');
  if (!jaimeImage) return;

  const imageWrap = jaimeImage.closest(".story-img");
  if (!imageWrap || imageWrap.querySelector(".jaime-cta")) return;

  const linkWrapper = jaimeImage.closest("a");
  if (linkWrapper && linkWrapper.parentElement === imageWrap) {
    imageWrap.appendChild(jaimeImage);
    linkWrapper.remove();
  }

  const cta = document.createElement("a");
  cta.className = "jaime-cta";
  cta.href = JAIME_URL;
  cta.target = "_blank";
  cta.rel = "noopener noreferrer";
  cta.textContent = "Ver el rastro publico de Jaime";
  imageWrap.appendChild(cta);
}

function initializeDecisionPrompt() {
  const promptText = DECISION_PROMPTS[currentPage()];
  const screen = document.querySelector(".story-screen");
  const choices = document.querySelector(".choices");

  if (!promptText || !screen || !choices || screen.querySelector(".decision-note")) return;

  const prompt = document.createElement("p");
  prompt.className = "decision-note";
  prompt.textContent = promptText;
  screen.insertBefore(prompt, choices);
}

function initializeVictoryPopup() {
  if (currentPage() !== "final3.html" || document.querySelector(".victory-modal")) return;

  const modal = document.createElement("div");
  modal.className = "victory-modal";
  modal.innerHTML = `
    <div class="victory-card" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <p class="victory-kicker">Caso resuelto</p>
      <h2 id="victory-title">Ganaste. Eres muy crack.</h2>
      <p>Reuniste las pistas, leiste las sombras de la galeria y cerraste el caso antes de que Jaime escapara.</p>
      <button type="button" class="victory-close">Seguir viendo el final</button>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => {
    modal.hidden = true;
  };

  modal.querySelector(".victory-close").addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

window.addEventListener("load", () => {
  resetGameOnHome();
  initializeTimer();
  updateClueTracker();
  updateAwardTracker();
  initializeLightPainting();
  initializeJaimeCta();
  initializeDecisionPrompt();
  initializeVictoryPopup();
  initializeImagePopups();
});
