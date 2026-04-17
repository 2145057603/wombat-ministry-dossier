(() => {
const { questions, likertOptions, phaseNames, dimensionMeta } = window.WOMBAT;
const { loadStoredState, saveStoredState, clearStoredState } = window.WOMBAT.storage;
const { calculateResult, buildLogicSummary, buildCareerSpecificExplanation } = window.WOMBAT.scoring;
const { renderRadarChart } = window.WOMBAT.charts;

const SITE_PASSWORD = "Ministry2026";
const DEFAULT_CANDIDATE_NAME = "未署名考生";

const defaultState = {
  name: "",
  mode: "formal",
  stage: "entrance",
  currentIndex: 0,
  answers: {},
  selectedCareerId: null,
  isUnlocked: false,
  pendingAction: null
};

const state = normalizeLoadedState(loadStoredState());

const refs = {
  topbarUserLabel: document.getElementById("topbar-user-label"),
  topbarModeLabel: document.getElementById("topbar-mode-label"),
  entranceForm: document.getElementById("entrance-form"),
  candidateName: document.getElementById("candidate-name"),
  resumeButton: document.getElementById("resume-button"),
  clearStorageButton: document.getElementById("clear-storage-button"),
  viewEntrance: document.getElementById("view-entrance"),
  viewTesting: document.getElementById("view-testing"),
  viewResult: document.getElementById("view-result"),
  progressBar: document.getElementById("progress-bar"),
  phaseLabel: document.getElementById("phase-label"),
  questionCounter: document.getElementById("question-counter"),
  phaseCounter: document.getElementById("phase-counter"),
  questionText: document.getElementById("question-text"),
  dimensionHint: document.getElementById("dimension-hint"),
  answerOptions: document.getElementById("answer-options"),
  quitButton: document.getElementById("quit-button"),
  prevButton: document.getElementById("prev-button"),
  nextButton: document.getElementById("next-button"),
  resultNameplate: document.getElementById("result-nameplate"),
  resultCareerTitle: document.getElementById("result-career-title"),
  resultCareerSubtitle: document.getElementById("result-career-subtitle"),
  careerBadge: document.getElementById("career-badge"),
  resultMatchScore: document.getElementById("result-match-score"),
  radarChart: document.getElementById("radar-chart"),
  dimensionSummary: document.getElementById("dimension-summary"),
  topCareersList: document.getElementById("top-careers-list"),
  matchExplanation: document.getElementById("match-explanation"),
  careerDossier: document.getElementById("career-dossier"),
  restartButton: document.getElementById("restart-button"),
  backHomeButton: document.getElementById("back-home-button"),
  logicSummary: document.getElementById("logic-summary"),
  passwordOverlay: document.getElementById("password-overlay"),
  passwordDescription: document.getElementById("password-description"),
  passwordInput: document.getElementById("password-input"),
  passwordError: document.getElementById("password-error"),
  passwordConfirmButton: document.getElementById("password-confirm-button"),
  passwordCancelButton: document.getElementById("password-cancel-button")
};

bindEvents();
renderApp();

function normalizeLoadedState(loaded) {
  if (!loaded) {
    return { ...defaultState };
  }

  return {
    ...defaultState,
    name: loaded.name ?? "",
    mode: loaded.mode ?? "formal",
    stage: "entrance",
    currentIndex: loaded.currentIndex ?? 0,
    answers: loaded.answers ?? {},
    selectedCareerId: loaded.selectedCareerId ?? null,
    isUnlocked: Boolean(loaded.isUnlocked),
    pendingAction: null
  };
}

function bindEvents() {
  refs.entranceForm.addEventListener("submit", handleStart);
  refs.resumeButton.addEventListener("click", handleResume);
  refs.clearStorageButton.addEventListener("click", handleClearStorage);
  refs.quitButton.addEventListener("click", handleBackHome);
  refs.prevButton.addEventListener("click", handlePrev);
  refs.nextButton.addEventListener("click", handleNext);
  refs.restartButton.addEventListener("click", handleRestart);
  refs.backHomeButton.addEventListener("click", handleBackHome);
  refs.passwordConfirmButton.addEventListener("click", handlePasswordConfirm);
  refs.passwordCancelButton.addEventListener("click", closePasswordGate);
  refs.passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePasswordConfirm();
    }

    if (event.key === "Escape") {
      closePasswordGate();
    }
  });
}

function handleStart(event) {
  event.preventDefault();
  const formData = new FormData(refs.entranceForm);
  const enteredName = String(formData.get("candidateName") || refs.candidateName.value || "").trim();
  const selectedMode = String(formData.get("resultMode") || "formal");
  const action = {
    type: "new-test",
    name: enteredName || DEFAULT_CANDIDATE_NAME,
    mode: selectedMode
  };

  if (state.isUnlocked) {
    executeAction(action);
    return;
  }

  state.pendingAction = action;
  persistState();
  openPasswordGate("输入正确的魔法部访问口令后，才能签发你的职业考核准入卷轴。");
}

function handleResume() {
  if (!hasStoredProgress()) {
    return;
  }

  const action = { type: "resume" };
  if (state.isUnlocked) {
    executeAction(action);
    return;
  }

  state.pendingAction = action;
  persistState();
  openPasswordGate("这是一份已存在的档案记录。通过口令验证后，才能继续查看或恢复之前的测试。");
}

function handleClearStorage() {
  clearStoredState();
  Object.assign(state, { ...defaultState });
  renderApp();
}

function handleBackHome() {
  state.stage = "entrance";
  persistState();
  renderApp();
}

function handlePrev() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    persistState();
    renderApp();
  }
}

function handleNext() {
  const question = questions[state.currentIndex];
  const answer = state.answers[question.id];
  if (!answer) {
    return;
  }

  if (state.currentIndex === questions.length - 1) {
    state.stage = "result";
    state.selectedCareerId = null;
    persistState();
    renderApp();
    return;
  }

  state.currentIndex += 1;
  persistState();
  renderApp();
}

function handleRestart() {
  state.stage = "testing";
  state.currentIndex = 0;
  state.answers = {};
  state.selectedCareerId = null;
  persistState();
  renderApp();
}

function commitAnswer(questionId, value) {
  state.answers[questionId] = value;

  if (state.currentIndex === questions.length - 1) {
    state.stage = "result";
    state.selectedCareerId = null;
    persistState();
    renderApp();
    return;
  }

  state.currentIndex += 1;
  persistState();
  renderApp();
}

function persistState() {
  saveStoredState({
    name: state.name,
    mode: state.mode,
    stage: state.stage,
    currentIndex: state.currentIndex,
    answers: state.answers,
    selectedCareerId: state.selectedCareerId,
    isUnlocked: state.isUnlocked
  });
}

function hasStoredProgress() {
  return Object.keys(state.answers).length > 0 || state.selectedCareerId != null;
}

function renderApp() {
  refs.topbarUserLabel.textContent = state.name || "未签名";
  refs.topbarModeLabel.textContent = state.mode === "entertainment" ? "娱乐模式" : "正式模式";
  refs.candidateName.value = state.name && state.name !== DEFAULT_CANDIDATE_NAME ? state.name : "";
  syncModeInputs();
  refs.resumeButton.classList.toggle("is-hidden", !hasStoredProgress());
  refs.clearStorageButton.classList.toggle("is-hidden", !hasStoredProgress());
  refs.resumeButton.textContent = state.selectedCareerId ? "查看上次档案" : "继续上次进度";

  refs.viewEntrance.classList.toggle("is-active", state.stage === "entrance");
  refs.viewTesting.classList.toggle("is-active", state.stage === "testing");
  refs.viewResult.classList.toggle("is-active", state.stage === "result");

  if (state.stage === "testing") {
    renderQuestion();
  } else if (state.stage === "result") {
    renderResult();
  }

  const gateOpen = Boolean(state.pendingAction);
  refs.passwordOverlay.classList.toggle("is-hidden", !gateOpen);
  refs.passwordOverlay.setAttribute("aria-hidden", gateOpen ? "false" : "true");
}

function syncModeInputs() {
  const modeInputs = refs.entranceForm.querySelectorAll('input[name="resultMode"]');
  modeInputs.forEach((input) => {
    input.checked = input.value === state.mode;
  });
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  const answeredValue = state.answers[question.id];
  const progress = ((state.currentIndex + 1) / questions.length) * 100;

  refs.progressBar.style.width = `${progress}%`;
  refs.phaseLabel.textContent = phaseNames[question.phase];
  refs.questionCounter.textContent = `第 ${state.currentIndex + 1} / ${questions.length} 题`;
  refs.phaseCounter.textContent = `阶段 ${question.phase} / 4`;
  refs.questionText.textContent = question.text;
  refs.dimensionHint.textContent = dimensionMeta.find((item) => item.key === question.dimension)?.description ?? "";

  refs.answerOptions.innerHTML = "";
  likertOptions.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `option-button${answeredValue === option.value ? " is-selected" : ""}`;
    button.innerHTML = `
      <span class="option-score">${option.value}</span>
      <span class="option-content">
        <strong>${option.label}</strong>
        <span>${option.hint}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      commitAnswer(question.id, option.value);
    });
    refs.answerOptions.appendChild(button);
  });

  refs.prevButton.disabled = state.currentIndex === 0;
  refs.nextButton.disabled = !answeredValue;
  refs.nextButton.textContent = state.currentIndex === questions.length - 1 ? "提交档案" : "下一题";
}

function renderResult() {
  const result = calculateResult(state.answers, state.mode);
  const topCareer = result.topCareer;
  if (!topCareer) {
    state.stage = "entrance";
    persistState();
    renderApp();
    return;
  }

  if (!state.selectedCareerId || !result.rankedCareers.find((career) => career.id === state.selectedCareerId)) {
    state.selectedCareerId = topCareer.id;
    persistState();
  }

  const selectedCareer = result.rankedCareers.find((career) => career.id === state.selectedCareerId) ?? topCareer;
  const compareCareer = result.rankedCareers.find((career) => career.id !== selectedCareer.id) ?? null;
  const selectedAnalysis = buildCareerSpecificExplanation(result.normalized, selectedCareer, compareCareer);

  refs.resultNameplate.textContent = `${state.name || DEFAULT_CANDIDATE_NAME} / ${selectedCareer.id === topCareer.id ? "主职业档案" : "备选职业档案"}`;
  refs.resultCareerTitle.textContent = `${selectedCareer.name} (${selectedCareer.englishName})`;
  refs.resultCareerSubtitle.textContent = selectedCareer.subtitle;
  refs.careerBadge.textContent = selectedCareer.badge;
  refs.resultMatchScore.textContent = `${selectedCareer.matchScore.toFixed(1)}%`;

  renderRadarChart(refs.radarChart, result.dimensionSummary);
  renderDimensionSummary(result.dimensionSummary);
  renderTopCareers(result.rankedCareers.slice(0, 3));
  renderExplanation(selectedAnalysis.blocks, result.warnings.broadProfile);
  renderDossier(selectedCareer);
  renderLogicSummary(buildLogicSummary(result, state.mode));
}

function renderDimensionSummary(summary) {
  refs.dimensionSummary.innerHTML = summary
    .map(
      (item) => `
        <div class="dimension-pill">
          <strong>${item.name}</strong>
          <span>${item.score} / 100 分 · ${item.level}</span>
        </div>
      `
    )
    .join("");
}

function renderTopCareers(topCareers) {
  refs.topCareersList.innerHTML = "";

  topCareers.forEach((career, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `career-rank${career.id === state.selectedCareerId ? " is-active" : ""}`;
    button.innerHTML = `
      <span class="career-rank-index">${index + 1}</span>
      <span>
        <p class="career-rank-name">${career.name}</p>
        <p class="career-rank-family">${career.family}</p>
      </span>
      <span class="career-rank-score">${career.matchScore.toFixed(1)}%</span>
    `;
    button.addEventListener("click", () => {
      state.selectedCareerId = career.id;
      persistState();
      renderResult();
    });
    refs.topCareersList.appendChild(button);
  });
}

function renderExplanation(blocks, broadProfile) {
  const warningBlock = broadProfile
    ? `
      <div class="explanation-item">
        <strong>作答分布提示</strong>
        <p>你本次选择中间选项的比例偏高，因此画像更适合被理解为“职业家族趋势”，而不是完全单峰的唯一结果。前三职业的横向比较会比单一标签更有参考价值。</p>
      </div>
    `
    : "";

  refs.matchExplanation.innerHTML =
    blocks
      .map(
        (block) => `
          <div class="explanation-item">
            <strong>${block.title}</strong>
            <p>${block.text}</p>
          </div>
        `
      )
      .join("") + warningBlock;
}

function renderDossier(career) {
  refs.careerDossier.innerHTML = `
    <div class="dossier-panel">
      <h4>结果定位</h4>
      <p>${career.resultIdentity}</p>
    </div>
    <div class="dossier-panel">
      <h4>正向反馈</h4>
      <p>${career.positiveFeedback}</p>
    </div>
    <div class="dossier-panel">
      <h4>职业背景</h4>
      <p>${career.background}</p>
    </div>
    <div class="dossier-panel">
      <h4>职业经历</h4>
      <p>${career.experience}</p>
    </div>
  `;
}

function renderLogicSummary(lines) {
  refs.logicSummary.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
}

function openPasswordGate(description) {
  refs.passwordDescription.textContent = description;
  refs.passwordInput.value = "";
  refs.passwordError.classList.add("is-hidden");
  refs.passwordOverlay.classList.remove("is-hidden");
  refs.passwordOverlay.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    refs.passwordInput.focus();
  }, 0);
}

function closePasswordGate() {
  state.pendingAction = null;
  refs.passwordInput.value = "";
  refs.passwordError.classList.add("is-hidden");
  refs.passwordOverlay.classList.add("is-hidden");
  refs.passwordOverlay.setAttribute("aria-hidden", "true");
}

function executeAction(action) {
  if (!action) {
    renderApp();
    return;
  }

  if (action.type === "new-test") {
    state.name = action.name;
    state.mode = action.mode;
    state.stage = "testing";
    state.currentIndex = 0;
    state.answers = {};
    state.selectedCareerId = null;
  } else if (action.type === "resume") {
    state.stage = state.selectedCareerId ? "result" : "testing";
  }

  state.pendingAction = null;
  persistState();
  renderApp();
}

function handlePasswordConfirm() {
  const enteredPassword = refs.passwordInput.value;
  if (enteredPassword !== SITE_PASSWORD) {
    refs.passwordError.classList.remove("is-hidden");
    refs.passwordInput.focus();
    refs.passwordInput.select();
    return;
  }

  const action = state.pendingAction;
  refs.passwordError.classList.add("is-hidden");
  state.isUnlocked = true;
  persistState();
  closePasswordGate();
  executeAction(action);
}
})();
