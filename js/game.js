/**
 * DataQuest — Motor del juego
 * Sin "vidas": la expedición siempre se completa. Lo que varía es el
 * puntaje, la racha y las estrellas ganadas por capítulo (según precisión).
 */

const LEVEL_POINTS = {
  Recordar: 100,
  Comprender: 150,
  Aplicar: 200,
  Analizar: 250
};

const LEVEL_TIME_SECONDS = {
  Recordar: 20,
  Comprender: 20,
  Aplicar: 25,
  Analizar: 30
};

const STUDY_TIME_SECONDS = 999; // "sin límite" práctico en modo Estudio

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestion(question) {
  if (question.type === "tf") {
    return { ...question, shuffledOptions: ["Verdadero", "Falso"], shuffledCorrectIndex: question.correctIndex };
  }
  const indices = shuffleArray(question.options.map((_, i) => i));
  const shuffledOptions = indices.map((i) => question.options[i]);
  const shuffledCorrectIndex = indices.indexOf(question.correctIndex);
  return { ...question, shuffledOptions, shuffledCorrectIndex };
}

/** Calcula 0-3 estrellas según el % de aciertos de un capítulo. */
function starsForAccuracy(correct, total) {
  if (total === 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.999) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.4) return 1;
  return 0;
}

class DataQuestGame {
  constructor(chapterDefs) {
    this.chapterDefs = chapterDefs;
    this.onTick = null;
    this.onTimeUp = null;
    this.reset();
  }

  reset() {
    this.playerName = "";
    this.mode = "competencia";
    this.chapters = [];      // copia con preguntas mezcladas + estado por capítulo
    this.currentChapterIndex = -1;
    this.currentQuestionIndex = -1;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.answeredCount = 0;
    this._timerId = null;
    this._secondsLeft = 0;
    this._totalSeconds = 0;
    this._answered = false;
  }

  start(playerName, mode) {
    this.reset();
    this.playerName = (playerName || "Jugador anónimo").trim().slice(0, 24) || "Jugador anónimo";
    this.mode = mode === "estudio" ? "estudio" : "competencia";
    this.chapters = this.chapterDefs.map((ch) => ({
      id: ch.id,
      title: ch.title,
      icon: ch.icon,
      description: ch.description,
      questions: ch.questions.map(prepareQuestion),
      answers: [], // { isCorrect, pointsEarned } por pregunta respondida
      stars: null,
      unlocked: false
    }));
    this.chapters[0].unlocked = true;
  }

  get totalQuestions() {
    return this.chapters.reduce((sum, ch) => sum + ch.questions.length, 0);
  }

  get totalStars() {
    return this.chapters.reduce((sum, ch) => sum + (ch.stars || 0), 0);
  }

  get maxStars() {
    return this.chapters.length * 3;
  }

  chapter(index) {
    return this.chapters[index];
  }

  /** ¿Ya se completaron todos los capítulos? */
  get isExpeditionComplete() {
    return this.chapters.every((ch) => ch.stars !== null);
  }

  /** Encuentra el índice de la primera pregunta sin responder de un capítulo. */
  firstUnansweredIndex(chapterIndex) {
    const ch = this.chapters[chapterIndex];
    return ch.answers.length; // las respuestas se guardan en orden, así que el largo = siguiente índice
  }

  enterChapter(chapterIndex) {
    this.currentChapterIndex = chapterIndex;
    this.currentQuestionIndex = this.firstUnansweredIndex(chapterIndex) - 1; // nextQuestion() sumará 1
  }

  currentQuestion() {
    return this.chapters[this.currentChapterIndex].questions[this.currentQuestionIndex];
  }

  /** Avanza a la siguiente pregunta del capítulo actual. Devuelve la pregunta o null si el capítulo terminó. */
  nextQuestion() {
    this.currentQuestionIndex++;
    this._answered = false;
    const ch = this.chapters[this.currentChapterIndex];
    if (this.currentQuestionIndex >= ch.questions.length) return null;
    return this.currentQuestion();
  }

  startTimer() {
    this.stopTimer();
    const q = this.currentQuestion();
    const seconds = this.mode === "estudio" ? STUDY_TIME_SECONDS : LEVEL_TIME_SECONDS[q.level] || 20;
    this._secondsLeft = seconds;
    this._totalSeconds = seconds;

    if (this.mode === "estudio") return;

    this._timerId = setInterval(() => {
      this._secondsLeft -= 0.1;
      if (this._secondsLeft <= 0) {
        this._secondsLeft = 0;
        this.stopTimer();
        if (this.onTick) this.onTick(this._secondsLeft, this._totalSeconds);
        if (!this._answered && this.onTimeUp) this.onTimeUp();
        return;
      }
      if (this.onTick) this.onTick(this._secondsLeft, this._totalSeconds);
    }, 100);
  }

  stopTimer() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  submitAnswer(selectedIndex) {
    this.stopTimer();
    this._answered = true;
    this.answeredCount++;

    const ch = this.chapters[this.currentChapterIndex];
    const q = this.currentQuestion();
    const isCorrect = selectedIndex !== null && selectedIndex === q.shuffledCorrectIndex;
    let pointsEarned = 0;

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);

      const base = LEVEL_POINTS[q.level] || 100;
      let timeFactor = 1;
      if (this.mode === "competencia" && this._totalSeconds > 0) {
        const ratio = Math.max(0, this._secondsLeft) / this._totalSeconds;
        timeFactor = 1 + 0.5 * ratio;
      }
      let comboFactor = 1;
      if (this.streak >= 6) comboFactor = 1.5;
      else if (this.streak >= 3) comboFactor = 1.2;

      pointsEarned = Math.round(base * timeFactor * comboFactor);
      this.score += pointsEarned;
    } else {
      this.streak = 0;
    }

    ch.answers.push({ isCorrect, pointsEarned });

    // ¿Fue la última pregunta del capítulo? Calculamos las estrellas.
    if (ch.answers.length >= ch.questions.length) {
      const correctInChapter = ch.answers.filter((a) => a.isCorrect).length;
      ch.stars = starsForAccuracy(correctInChapter, ch.questions.length);
      const nextChapter = this.chapters[this.currentChapterIndex + 1];
      if (nextChapter) nextChapter.unlocked = true;
    }

    return { isCorrect, pointsEarned, correctIndex: q.shuffledCorrectIndex };
  }

  isLastQuestionOfChapter() {
    const ch = this.chapters[this.currentChapterIndex];
    return ch.answers.length >= ch.questions.length;
  }

  getSummary() {
    const accuracy = this.answeredCount > 0 ? Math.round((this.correctCount / this.answeredCount) * 100) : 0;
    return {
      playerName: this.playerName,
      mode: this.mode,
      score: this.score,
      correctCount: this.correctCount,
      answeredCount: this.answeredCount,
      totalQuestions: this.totalQuestions,
      accuracy,
      bestStreak: this.bestStreak,
      totalStars: this.totalStars,
      maxStars: this.maxStars,
      date: new Date().toISOString()
    };
  }
}

if (typeof module !== "undefined") module.exports = { DataQuestGame, LEVEL_POINTS, LEVEL_TIME_SECONDS, starsForAccuracy };
