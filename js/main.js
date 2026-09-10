/**
 * DataQuest — Controlador de interfaz
 * Conecta el motor del juego (game.js), la tabla de posiciones (leaderboard.js)
 * y las preguntas (questions.js) con las pantallas de index.html.
 */

(function () {
  const game = new DataQuestGame(CHAPTERS);
  let soundOn = true;
  let audioCtx = null;

  // ---------- Sonido (sin archivos externos) ----------
  function beep(freq, duration, type = "sine", delay = 0) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const t0 = audioCtx.currentTime + delay;
      gain.gain.setValueAtTime(0.08, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + duration);
    } catch (e) { /* audio no disponible */ }
  }
  const sfx = {
    correct: () => beep(880, 0.18, "triangle"),
    incorrect: () => beep(160, 0.25, "sawtooth"),
    tick: () => beep(1200, 0.05, "square"),
    start: () => beep(660, 0.15, "sine"),
    chapterComplete: () => { beep(660, 0.14, "triangle", 0); beep(880, 0.14, "triangle", 0.14); beep(1100, 0.22, "triangle", 0.28); }
  };

  // ---------- Navegación entre pantallas ----------
  const screens = {
    menu: document.getElementById("screen-menu"),
    rules: document.getElementById("screen-rules"),
    map: document.getElementById("screen-map"),
    question: document.getElementById("screen-question"),
    chapterComplete: document.getElementById("screen-chapter-complete"),
    result: document.getElementById("screen-result"),
    leaderboard: document.getElementById("screen-leaderboard")
  };
  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function returnToMenu() {
    game.stopTimer();
    game.reset();
    showScreen("menu");
  }

  const totalQuestionCount = CHAPTERS.reduce((sum, ch) => sum + ch.questions.length, 0);
  document.getElementById("question-count-footer").textContent = totalQuestionCount;
  document.getElementById("chapter-count-footer").textContent = CHAPTERS.length;

  // ---------- Menú ----------
  document.getElementById("btn-start").addEventListener("click", () => {
    const name = document.getElementById("input-name").value;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    sfx.start();
    game.start(name, mode);
    renderMap();
    showScreen("map");
  });

  document.getElementById("btn-view-rules").addEventListener("click", () => showScreen("rules"));
  document.getElementById("btn-rules-back").addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-home").addEventListener("click", returnToMenu);
  document.getElementById("btn-view-leaderboard").addEventListener("click", () => {
    renderLeaderboardTable(latestLeaderboardEntries);
    showScreen("leaderboard");
  });
  document.getElementById("btn-leaderboard-back").addEventListener("click", () => showScreen("menu"));

  document.getElementById("btn-mute").addEventListener("click", (e) => {
    soundOn = !soundOn;
    e.target.textContent = soundOn ? "🔊" : "🔇";
  });

  // ---------- Mapa de expedición ----------
  function renderMap() {
    document.getElementById("map-hud-player").textContent = `👤 ${game.playerName}`;
    document.getElementById("map-hud-score").textContent = `⭐ ${game.score} pts`;
    document.getElementById("map-hud-mode").textContent = game.mode === "estudio" ? "📖 Estudio" : "🏆 Competencia";

    const wrap = document.getElementById("chapters-wrap");
    wrap.innerHTML = "";

    game.chapters.forEach((ch, chapterIndex) => {
      if (chapterIndex > 0) {
        const connector = document.createElement("div");
        connector.className = "chapter-connector";
        connector.textContent = "⬇";
        wrap.appendChild(connector);
      }

      const card = document.createElement("div");
      card.className = "chapter-card" + (!ch.unlocked ? " locked" : "") + (ch.stars !== null ? " complete" : "");

      const header = document.createElement("div");
      header.className = "chapter-card-header";
      header.innerHTML = `
        <span class="chapter-icon">${ch.icon}</span>
        <div class="chapter-card-title">
          <strong>${escapeHTML(ch.title)}</strong>
          <small>${escapeHTML(ch.description)}</small>
        </div>
        ${ch.stars !== null ? `<span class="chapter-stars">${"⭐".repeat(ch.stars)}${"☆".repeat(3 - ch.stars)}</span>` : (!ch.unlocked ? '<span class="chapter-lock">🔒</span>' : "")}
      `;
      card.appendChild(header);

      const path = document.createElement("div");
      path.className = "node-path";
      ch.questions.forEach((q, qIndex) => {
        const node = document.createElement(qIndex === ch.answers.length && ch.unlocked && ch.stars === null ? "button" : "div");
        let stateClass = "locked";
        let content = String(qIndex + 1);

        if (qIndex < ch.answers.length) {
          const a = ch.answers[qIndex];
          stateClass = a.isCorrect ? "correct" : "incorrect";
          content = a.isCorrect ? "✓" : "✕";
        } else if (qIndex === ch.answers.length && ch.unlocked && ch.stars === null) {
          stateClass = "current";
        }

        node.className = `node ${stateClass}`;
        node.textContent = content;
        if (stateClass === "current") {
          node.addEventListener("click", () => {
            game.enterChapter(chapterIndex);
            beginQuestion();
            showScreen("question");
          });
        } else if (stateClass === "locked") {
          node.setAttribute("aria-disabled", "true");
        }
        path.appendChild(node);
      });
      card.appendChild(path);
      wrap.appendChild(card);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Pregunta ----------
  const el = {
    hudChapter: document.getElementById("hud-chapter"),
    progress: document.getElementById("hud-progress"),
    score: document.getElementById("hud-score"),
    streak: document.getElementById("hud-streak"),
    timerBar: document.getElementById("timer-bar"),
    timerTrack: document.querySelector(".timer-track"),
    level: document.getElementById("question-level"),
    text: document.getElementById("question-text"),
    optionsGrid: document.getElementById("options-grid"),
    feedbackBox: document.getElementById("feedback-box"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    btnNext: document.getElementById("btn-next"),
    questionCard: document.querySelector(".question-card")
  };

  game.onTick = (secondsLeft, totalSeconds) => {
    const pct = Math.max(0, (secondsLeft / totalSeconds) * 100);
    el.timerBar.style.width = pct + "%";
    el.timerBar.classList.toggle("warn", pct < 25);
    if (Math.ceil(secondsLeft) !== Math.ceil(secondsLeft + 0.1) && secondsLeft <= 5 && secondsLeft > 0) sfx.tick();
  };
  game.onTimeUp = () => handleAnswer(null);

  function beginQuestion() {
    const q = game.nextQuestion();
    if (!q) return; // no debería pasar: el mapa solo permite entrar si hay pregunta pendiente

    const ch = game.chapters[game.currentChapterIndex];
    el.hudChapter.textContent = `${ch.icon} ${ch.title}`;
    el.progress.textContent = `Pregunta ${game.currentQuestionIndex + 1}/${ch.questions.length}`;
    el.score.textContent = `⭐ ${game.score} pts`;
    el.streak.textContent = `🔥 Racha: ${game.streak}`;
    el.timerTrack.style.display = game.mode === "competencia" ? "block" : "none";

    el.level.textContent = q.level;
    el.text.textContent = q.text;
    el.feedbackBox.hidden = true;
    el.questionCard.classList.remove("shake", "pop");

    el.optionsGrid.innerHTML = "";
    el.optionsGrid.classList.toggle("two-col", q.type === "tf");
    q.shuffledOptions.forEach((optionText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = optionText;
      btn.addEventListener("click", () => handleAnswer(idx));
      el.optionsGrid.appendChild(btn);
    });

    game.startTimer();
  }

  function handleAnswer(selectedIndex) {
    const result = game.submitAnswer(selectedIndex);
    const buttons = Array.from(el.optionsGrid.querySelectorAll(".option-btn"));
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === result.correctIndex) btn.classList.add("correct");
      else if (idx === selectedIndex) btn.classList.add("incorrect");
    });

    el.score.textContent = `⭐ ${game.score} pts`;
    el.streak.textContent = `🔥 Racha: ${game.streak}`;

    if (result.isCorrect) {
      sfx.correct();
      el.questionCard.classList.add("pop");
      el.feedbackTitle.textContent = `✅ ¡Correcto! +${result.pointsEarned} pts`;
    } else {
      sfx.incorrect();
      el.questionCard.classList.add("shake");
      el.feedbackTitle.textContent = selectedIndex === null ? "⏰ ¡Se acabó el tiempo!" : "❌ Incorrecto";
    }
    el.feedbackExplanation.textContent = game.currentQuestion().explanation;
    el.feedbackBox.hidden = false;
    el.btnNext.focus();
    el.btnNext.textContent = game.isLastQuestionOfChapter() ? "Ver estación →" : "Siguiente →";
  }

  el.btnNext.addEventListener("click", () => {
    if (game.isLastQuestionOfChapter()) {
      finishChapter();
    } else {
      beginQuestion();
    }
  });

  // ---------- Capítulo completado ----------
  function finishChapter() {
    game.stopTimer();
    sfx.chapterComplete();
    const ch = game.chapters[game.currentChapterIndex];
    const pointsThisChapter = ch.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const correctThisChapter = ch.answers.filter((a) => a.isCorrect).length;

    document.getElementById("chapter-complete-icon").textContent = ch.icon;
    document.getElementById("chapter-complete-title").textContent = `¡"${ch.title}" completada!`;
    document.getElementById("chapter-complete-stars").textContent = "⭐".repeat(ch.stars) + "☆".repeat(3 - ch.stars);
    document.getElementById("chapter-complete-stats").textContent =
      `${correctThisChapter}/${ch.questions.length} correctas · +${pointsThisChapter} pts en esta estación`;

    const btn = document.getElementById("btn-chapter-continue");
    btn.textContent = game.isExpeditionComplete ? "Ver resultado final →" : "Volver al mapa";
    btn.onclick = () => {
      if (game.isExpeditionComplete) {
        finishGame();
      } else {
        renderMap();
        showScreen("map");
      }
    };

    showScreen("chapterComplete");
  }

  // ---------- Resultados finales ----------
  let lastSummary = null;

  async function finishGame() {
    lastSummary = game.getSummary();

    document.getElementById("result-title").textContent = "¡Expedición completada!";
    document.getElementById("result-score").textContent = `${lastSummary.score} pts`;
    document.getElementById("result-stars").textContent =
      "⭐".repeat(lastSummary.totalStars) + "☆".repeat(lastSummary.maxStars - lastSummary.totalStars);
    document.getElementById("result-correct").textContent = `${lastSummary.correctCount}/${lastSummary.answeredCount}`;
    document.getElementById("result-accuracy").textContent = `${lastSummary.accuracy}%`;
    document.getElementById("result-best-streak").textContent = lastSummary.bestStreak;

    let message = "";
    if (lastSummary.mode === "estudio") {
      message = "Modo estudio: este resultado no se guarda en la tabla de posiciones. ¡Ahora inténtalo en modo Competencia!";
    } else if (lastSummary.totalStars === lastSummary.maxStars) {
      message = "¡Expedición perfecta! Dominas el uso responsable de la IA, las fuentes confiables y el análisis de datos. 🧭";
    } else if (lastSummary.accuracy >= 60) {
      message = "Buen trabajo. Repasa las estaciones con menos estrellas antes del examen.";
    } else {
      message = "Vas por buen camino. Prueba el modo Estudio para repasar con calma antes de competir de nuevo.";
    }
    document.getElementById("result-message").textContent = message;

    if (lastSummary.mode === "competencia") {
      try {
        const updated = await submitScore(lastSummary);
        if (updated) latestLeaderboardEntries = updated;
      } catch (e) {
        console.warn("No se pudo enviar el puntaje:", e);
      }
    }

    showScreen("result");
  }

  document.getElementById("btn-play-again").addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-go-leaderboard").addEventListener("click", () => {
    renderLeaderboardTable(latestLeaderboardEntries);
    showScreen("leaderboard");
  });
  document.getElementById("btn-download-result").addEventListener("click", () => {
    if (!lastSummary) return;
    const safeName = lastSummary.playerName.replace(/[^a-z0-9áéíóúñ]+/gi, "_");
    downloadJSON(`dataquest_${safeName}_${Date.now()}.json`, [lastSummary]);
  });

  // ---------- Tabla de posiciones ----------
  let latestLeaderboardEntries = [];
  const statusBadge = document.getElementById("leaderboard-status");
  const leaderboardSubtitle = document.getElementById("leaderboard-subtitle");

  function updateStatusBadge(meta) {
    statusBadge.classList.remove("is-remote", "is-local");
    if (meta.remote) {
      statusBadge.textContent = "🌐 Tabla global en vivo";
      statusBadge.classList.add("is-remote");
      leaderboardSubtitle.textContent = "Competencia asíncrona: cada estudiante juega cuando puede y su resultado aparece aquí solo, sin recargar. Solo la persona docente puede reiniciarla.";
    } else {
      statusBadge.textContent = meta.error ? "⚠️ Sin conexión — tabla local" : "💾 Tabla local (solo este navegador)";
      statusBadge.classList.add("is-local");
      leaderboardSubtitle.textContent = "Los resultados se guardan en este navegador. Para una tabla de todo el grupo, configura Firebase (ver README.md → \"Tabla de posiciones global\").";
    }
  }

  subscribeToLeaderboard((entries, meta) => {
    latestLeaderboardEntries = entries;
    updateStatusBadge(meta);
    if (screens.leaderboard.classList.contains("active")) {
      renderLeaderboardTable(entries);
    }
  });

  function renderLeaderboardTable(entries) {
    const tbody = document.getElementById("leaderboard-body");
    const empty = document.getElementById("leaderboard-empty");
    tbody.innerHTML = "";

    if (!entries || entries.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    entries.forEach((entry, i) => {
      const tr = document.createElement("tr");
      const date = entry.date ? new Date(entry.date).toLocaleDateString() : "—";
      const starsText = typeof entry.totalStars === "number" ? `${entry.totalStars}⭐` : "—";
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHTML(entry.playerName)}</td>
        <td>${entry.score}</td>
        <td>${entry.accuracy}%</td>
        <td>${starsText}</td>
        <td>${date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("btn-export-leaderboard").addEventListener("click", () => {
    downloadJSON(`dataquest_tabla_${Date.now()}.json`, latestLeaderboardEntries);
  });

  // ---- Reinicio de la tabla: local (confirm simple) o global (login docente) ----
  const teacherModal = document.getElementById("modal-teacher-login");
  const teacherEmailInput = document.getElementById("teacher-email");
  const teacherPasswordInput = document.getElementById("teacher-password");
  const teacherLoginError = document.getElementById("teacher-login-error");
  const btnTeacherConfirm = document.getElementById("btn-teacher-confirm");

  document.getElementById("btn-reset-leaderboard").addEventListener("click", () => {
    if (isRemoteMode()) {
      teacherEmailInput.value = "";
      teacherPasswordInput.value = "";
      teacherLoginError.hidden = true;
      teacherModal.hidden = false;
      teacherEmailInput.focus();
    } else if (confirm("¿Seguro que deseas borrar toda la tabla de posiciones de este navegador? Esta acción no se puede deshacer.")) {
      resetLeaderboard().then(() => {
        latestLeaderboardEntries = [];
        renderLeaderboardTable(latestLeaderboardEntries);
      });
    }
  });

  document.getElementById("btn-teacher-cancel").addEventListener("click", () => { teacherModal.hidden = true; });

  btnTeacherConfirm.addEventListener("click", async () => {
    const email = teacherEmailInput.value.trim();
    const password = teacherPasswordInput.value;
    btnTeacherConfirm.disabled = true;
    btnTeacherConfirm.textContent = "Verificando…";
    const result = await resetLeaderboard({ email, password });
    btnTeacherConfirm.disabled = false;
    btnTeacherConfirm.textContent = "Confirmar reinicio";

    if (result.ok) {
      teacherModal.hidden = true;
    } else {
      teacherLoginError.textContent = result.message;
      teacherLoginError.hidden = false;
    }
  });

  document.getElementById("input-import").addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    let pending = files.length;
    let combined = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const entries = Array.isArray(parsed) ? parsed : [parsed];
          combined = combined.concat(entries);
        } catch (err) {
          console.warn(`No se pudo leer ${file.name}:`, err);
        } finally {
          pending--;
          if (pending === 0) {
            const merged = importEntries(combined);
            if (isRemoteMode()) {
              alert("Nota: la tabla global ya se actualiza sola con Firebase. Este archivo se guardó como respaldo local, pero no se agregó a la tabla global.");
            } else {
              latestLeaderboardEntries = merged;
              renderLeaderboardTable(latestLeaderboardEntries);
            }
            e.target.value = "";
          }
        }
      };
      reader.readAsText(file);
    });
  });
})();
