/* Cloud transport for the campus client. Tokens stay in HttpOnly cookies.
 * bootstrap/join/resume session:
 * {studentId,classId,studentNumber,name,grade,section,schoolYear,assignmentId}
 * Server progress:
 * {profile,assignmentId,version,updatedAt,progress:{avatar,locale,reflection,
 *  location,prologueSeen,cases},attempts,questionProgress,results,stars,maxStars,
 *  score,maxScore}. questionProgress is keyed by SERVER question id and holds
 * {sourceId,completed,attempts,score,stars,lastOptionId}. A question's sourceId
 * matches GRADE_CONTENT.id; its server id + revision + assignmentId must be
 * used when submitting an answer. Case sourceIds are case-voice etc.; transfer
 * has sourceId 'transfer'. Scores/stars/completion are always server values.
 *
 * saveProgress sends metadata only. Saves from this adapter are serialized.
 * A 409 fetches the current server snapshot and rejects with latestProgress;
 * it never silently merges or overwrites another device's work. Queued saves
 * remain blocked until keepServerProgress() or a deliberate saveProgress(draft,
 * {resolveConflict:true}). onConflict(latestProgress,error) is optional.
 *
 * hydrate() returns {profile,assignmentId,version,metadata,subjects,cases,
 * transfer,sourceProgress,results,stars,maxStars,score,maxScore,exitTarget}.
 * subjects[roomId][serverQuestionId] is the record for a rendered question;
 * it includes serverVerified:true and preserves arbitrary teacher additions.
 * Feedback is not invented: feedbackChoice is null until feedback is known.
 * state/status getters and campus-cloud-state events expose transport status.
 * CloudError has code/status; failed submissions also retain request.body with
 * the same idempotencyKey for an explicit retry. No automatic answer retries.
 */
(() => {
  "use strict";
  const BASE = "/api/campus/";
  const state = {
    session: null, assignmentId: null, version: 0, questions: [],
    questionGrade: null, lastProgress: null, status: "idle", error: null,
    lastContactAt: null, lastSavedAt: null, pending: 0,
    conflict: false,
  };
  let saveQueue = Promise.resolve();
  let authGeneration = 0;
  let authPending = false;
  class CloudError extends Error {
    constructor(code, message, status = 0, cause = null) {
      super(message);
      this.name = "CloudError";
      this.code = code;
      this.status = status;
      this.cause = cause;
      this.latestProgress = null;
      this.refreshError = null;
    }
  }
  const snapshot = () => ({
    session: state.session, assignmentId: state.assignmentId,
    version: state.version, questions: state.questions.slice(),
    lastProgress: state.lastProgress, status: state.status, error: state.error,
    lastContactAt: state.lastContactAt, lastSavedAt: state.lastSavedAt,
    pending: state.pending,
    conflict: state.conflict,
  });
  function emit(type = "campus-cloud-state", detail = snapshot()) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
  function failure(error) {
    state.error = error;
    state.status = error.code === "ABORTED" ? "cancelled"
      : error.code === "NETWORK_ERROR" ? "offline"
      : error.status === 401 ? "unauthorized"
      : error.status === 409 ? "conflict" : "error";
    if (["STUDENT_SESSION_REQUIRED", "STUDENT_SESSION_EXPIRED"].includes(error.code)) { state.session = null; authGeneration++; }
    emit(); emit("campus-cloud-error", error);
  }
  async function request(path, { method = "GET", body, signal } = {}) {
    if (typeof path !== "string" || /^[a-z]+:/i.test(path) || path.startsWith("//") || path.includes("..")) {
      throw new CloudError("INVALID_PATH", "Use a campus API relative path.");
    }
    const target = BASE + path.replace(/^\/+/, "");
    state.pending++; state.status = "loading"; emit();
    try {
      const response = await window.fetch(target, {
        method, credentials: "same-origin", cache: "no-store", signal,
        headers: { Accept: "application/json", ...(method !== "GET" ? { "Content-Type": "application/json" } : {}) },
        ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}),
      });
      let data;
      try { data = await response.json(); }
      catch { throw new CloudError("BAD_RESPONSE", "The server returned an unreadable response.", response.status); }
      if (!response.ok) throw new CloudError(data?.error?.code || "HTTP_ERROR", data?.error?.message || "The server request failed.", response.status);
      if (!data || typeof data !== "object") throw new CloudError("BAD_RESPONSE", "The server returned an invalid response.", response.status);
      state.lastContactAt = new Date().toISOString(); state.error = null; state.status = "ready";
      return data;
    } catch (cause) {
      const error = cause instanceof CloudError ? cause : cause?.name === "AbortError"
        ? new CloudError("ABORTED", "The request was cancelled.", 0, cause)
        : new CloudError("NETWORK_ERROR", "Cannot reach the learning server. Your local work has not been confirmed as saved.", 0, cause);
      failure(error); throw error;
    } finally { state.pending--; emit(); }
  }
  function acceptProgress(progress) {
    if (!progress || typeof progress !== "object" || !progress.profile || !Number.isInteger(progress.version)) {
      const error = new CloudError("BAD_RESPONSE", "The server returned invalid learning progress."); failure(error); throw error;
    }
    if (state.session && state.session.studentId !== progress.profile.studentId) {
      const error = new CloudError("SESSION_CHANGED", "The student changed while this request was in progress.", 409); failure(error); throw error;
    }
    if (state.assignmentId !== progress.assignmentId) state.questions = [];
    state.session = progress.profile;
    state.assignmentId = progress.assignmentId;
    state.version = progress.version;
    state.lastProgress = progress;
    emit();
    return progress;
  }
  function acceptSession(data) {
    if (state.session?.studentId !== data.session?.studentId) {
      state.lastProgress = null; state.lastSavedAt = null; state.version = 0;
    }
    state.session = data.session;
    state.conflict = false;
    if (data.progress) acceptProgress(data.progress);
    else { state.session = data.session; state.assignmentId = data.session?.assignmentId ?? null; emit(); }
    return data;
  }
  function requireGeneration(generation) {
    if (generation !== authGeneration) {
      const error = new CloudError("SESSION_CHANGED", "The student changed while this request was in progress.", 409); failure(error); throw error;
    }
  }
  async function bootstrap(options) {
    const generation = authGeneration;
    const data = await request("bootstrap", options);
    if (generation !== authGeneration) return { ...data, stale: true };
    if (state.session?.studentId !== data.session?.studentId) {
      state.version = 0; state.lastProgress = null; state.questions = [];
      authGeneration++;
    }
    state.session = data.session; state.assignmentId = data.session?.assignmentId ?? null; emit();
    return data;
  }
  async function authenticate(path, body, options) {
    if (authPending) { const error = new CloudError("AUTH_BUSY", "Wait for the current sign-in action to finish.", 409); failure(error); throw error; }
    authPending = true; authGeneration++;
    try { return acceptSession(await request(path, { ...options, method: "POST", body })); }
    finally { authPending = false; }
  }
  async function join(body, options = {}) { return authenticate("student/join", body, options); }
  async function resume(body, options = {}) { return authenticate("student/resume", body, options); }
  async function logout(options = {}) {
    if (authPending) throw new CloudError("AUTH_BUSY", "Wait for sign-in to finish.", 409);
    authGeneration++; authPending = true;
    try {
      const result = await request("student/logout", { ...options, method: "POST", body: {} });
      Object.assign(state, { session: null, assignmentId: null, version: 0, questions: [], questionGrade: null, lastProgress: null, lastSavedAt: null, conflict: false });
      emit(); return result;
    } finally { authPending = false; }
  }
  async function loadQuestions({ subjectId, grade, signal } = {}) {
    const generation = authGeneration;
    const query = new URLSearchParams();
    if (subjectId) query.set("subjectId", subjectId);
    if (grade !== undefined) query.set("grade", String(grade));
    const result = await request("questions" + (query.size ? "?" + query : ""), { signal });
    requireGeneration(generation);
    if (!Array.isArray(result.questions)) { const error = new CloudError("BAD_RESPONSE", "The question list is invalid."); failure(error); throw error; }
    if (state.assignmentId !== result.assignmentId || state.questionGrade !== result.grade) state.questions = [];
    const byId = new Map(state.questions.map(q => [q.id, q]));
    for (const q of result.questions) byId.set(q.id, q);
    state.questions = [...byId.values()]; state.assignmentId = result.assignmentId; state.questionGrade = result.grade; emit();
    return result;
  }
  async function loadProgress(options) {
    const generation = authGeneration, result = await request("student/progress", options);
    requireGeneration(generation); return acceptProgress(result);
  }
  function requestId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    const bytes = new Uint8Array(24); window.crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  }
  function assignedBody(body) {
    const assignmentId = body.assignmentId ?? state.assignmentId;
    if (!state.session || !assignmentId) throw new CloudError("STUDENT_SESSION_REQUIRED", "Join or resume your class before recording answers.", 401);
    return { ...body, assignmentId, idempotencyKey: body.idempotencyKey ?? requestId() };
  }
  async function submit(path, body, options = {}) {
    const generation = authGeneration;
    let payload;
    try { payload = assignedBody(body); } catch (error) { failure(error); throw error; }
    try {
      const result = await request(path, { ...options, method: "POST", body: payload });
      requireGeneration(generation);
      acceptProgress(result.progress); state.lastSavedAt = new Date().toISOString(); emit();
      return result;
    } catch (error) {
      // Retain this exact key if the caller explicitly retries after an unknown
      // network outcome. A new key would represent another real attempt.
      error.request = { path, body: payload }; throw error;
    }
  }
  async function attempt(body, options) { return submit("attempts", body, options); }
  async function submitCase(body, options) { return submit("cases", body, options); }
  async function transfer(optionId, options = {}) {
    let q = state.questions.find(item => item.sourceId === "transfer" || item.category === "transfer");
    if (!q) { await loadQuestions({ subjectId: "ai-ethics", signal: options.signal }); q = state.questions.find(item => item.sourceId === "transfer" || item.category === "transfer"); }
    if (!q) { const error = new CloudError("QUESTION_NOT_ASSIGNED", "No transfer question is assigned.", 404); failure(error); throw error; }
    return attempt({ questionId: q.id, revision: q.revision, optionId: String(optionId), ...(options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : {}) }, options);
  }
  async function practiceCheck(body, options = {}) { return request("practice/check", { ...options, method: "POST", body }); }
  function saveProgress(metadata, options = {}) {
    const capturedStudentId = state.session?.studentId;
    // Capture values now, not when a queued write eventually begins.
    const captured = JSON.parse(JSON.stringify(metadata ?? {}));
    const run = async () => {
      const generation = authGeneration;
      if (!capturedStudentId || capturedStudentId !== state.session?.studentId) {
        const error = new CloudError("STUDENT_SESSION_REQUIRED", "The student session changed before this save.", 401); failure(error); throw error;
      }
      if (state.conflict && options.resolveConflict !== true) {
        const error = new CloudError("PROGRESS_CONFLICT", "Resolve the other device's update before saving another draft.", 409);
        error.latestProgress = state.lastProgress; failure(error); throw error;
      }
      if (options.resolveConflict === true) state.conflict = false;
      try {
        const result = await request("student/progress", { method: "PUT", signal: options.signal, body: { version: state.version, progress: captured } });
        requireGeneration(generation);
        acceptProgress(result); state.lastSavedAt = new Date().toISOString(); emit();
        return result;
      } catch (error) {
        if (error.code === "PROGRESS_CONFLICT") {
          state.conflict = true;
          try { error.latestProgress = await loadProgress({ signal: options.signal }); }
          catch (refreshError) { error.refreshError = refreshError; }
          // A successful read is not a successful save. Keep the conflict
          // visible and make the caller explicitly resolve which draft to keep.
          failure(error);
          if (typeof options.onConflict === "function") options.onConflict(error.latestProgress, error);
        }
        throw error;
      }
    };
    const promise = saveQueue.then(run, run);
    saveQueue = promise.catch(() => {});
    return promise;
  }
  function hydrate(progress = state.lastProgress, questions = state.questions) {
    if (!progress) return null;
    const subjects = {}, cases = {}, sourceProgress = {}, attempts = progress.attempts || [];
    let transferState = { awarded: false, choice: null, awardChoice: null, questionId: null, revision: null };
    const byId = new Map(questions.map(q => [q.id, q]));
    for (const [id, record] of Object.entries(progress.questionProgress || {})) {
      const q = byId.get(id) || (window.GRADE_CONTENT || []).find(item => item.id === record.sourceId);
      const answers = attempts.filter(a => a.questionId === id).sort((a, b) => a.attemptNumber - b.attemptNumber);
      const last = answers.at(-1), solved = answers.find(a => a.correct === 1 || a.correct === true);
      const optionIndex = optionId => q ? q.options.findIndex(o => o.id === optionId) : Number.isInteger(Number(optionId)) ? Number(optionId) : -1;
      const nullableIndex = value => value >= 0 ? value : null;
      sourceProgress[record.sourceId || id] = { ...record, questionId: id, revision: q?.revision ?? answers[0]?.revision ?? null };
      if (record.sourceId?.startsWith("case-")) {
        const caseId = record.sourceId.slice(5), saved = progress.progress?.cases?.[caseId] || {};
        let seen = []; try { seen = JSON.parse(solved?.evidence || last?.evidence || "[]"); } catch { /* Invalid presentation metadata does not earn completion. */ }
        cases[caseId] = {
          completed: record.completed === true, serverVerified: true, seen: seen.length ? seen : saved.seen || [],
          choice: last?.decisionIndex ?? saved.choice ?? null, firstChoice: answers[0]?.decisionIndex ?? saved.firstChoice ?? null,
          repairChoice: solved ? Number(solved.optionId) : last ? Number(last.optionId) : saved.repairChoice ?? null,
          repairAttempts: record.attempts, phase: record.completed ? 4 : Math.min(3, saved.phase || 0),
        };
      } else if (record.sourceId === "transfer" || q?.category === "transfer") {
        transferState = { awarded: record.completed === true, serverVerified: true, choice: last ? Number(last.optionId) : null, awardChoice: solved ? Number(solved.optionId) : null, questionId: id, revision: q?.revision ?? answers[0]?.revision ?? null };
      } else if (q) {
        subjects[q.roomId] ??= {};
        subjects[q.roomId][id] = {
          choice: last ? nullableIndex(optionIndex(last.optionId)) : null,
          feedbackChoice: last && q.options[optionIndex(last.optionId)]?.feedback ? nullableIndex(optionIndex(last.optionId)) : null,
          solvedChoice: solved ? nullableIndex(optionIndex(solved.optionId)) : null,
          completed: record.completed === true, serverVerified: true, attempts: record.attempts,
          questionId: id, revision: q.revision ?? answers[0]?.revision ?? null,
        };
      }
    }
    return {
      profile: progress.profile, assignmentId: progress.assignmentId,
      serverVerified: true,
      version: progress.version, metadata: progress.progress || {}, subjects, cases,
      transfer: transferState, sourceProgress, results: progress.results || [],
      stars: progress.stars, maxStars: progress.maxStars,
      score: progress.score, maxScore: progress.maxScore,
      exitTarget: Math.min(100, progress.maxStars || 0),
    };
  }
  function keepServerProgress() {
    state.conflict = false; state.error = null; state.status = "ready"; emit();
    return state.lastProgress;
  }
  function messageFor(error, lang = "zh") {
    const index = lang === "en" ? 2 : lang === "cn" ? 1 : 0;
    const copy = {
      NETWORK_ERROR: ["未能連接伺服器，這次操作尚未確認儲存。請檢查網絡後重試。", "未能连接服务器，这次操作尚未确认保存。请检查网络后重试。", "Cannot reach the server. This action has not been confirmed as saved. Check your connection and retry."],
      PROGRESS_CONFLICT: ["另一部裝置更新了紀錄。請先檢查最新進度，再決定保留哪份草稿。", "另一台设备更新了记录。请先检查最新进度，再决定保留哪份草稿。", "Another device updated this record. Review the latest progress before choosing which draft to keep."],
      ASSIGNMENT_CHANGED: ["老師已開始新活動，請重新載入題目。", "老师已开始新活动，请重新加载题目。", "Your teacher started a new activity. Reload the questions."],
      STUDENT_EXISTS: ["這個學號已有紀錄，請使用恢復碼繼續。", "这个学号已有记录，请使用恢复码继续。", "This student number already has a record. Resume with the recovery code."],
      INVALID_RECOVERY: ["班級代碼或恢復碼不正確。", "班级代码或恢复码不正确。", "The class code or recovery details are not correct."],
      INVALID_CLASS_CODE: ["請檢查老師提供的班級代碼。", "请检查老师提供的班级代码。", "Check the class code provided by your teacher."],
      CLASS_MISMATCH: ["所選班別與班級代碼不一致。", "所选班级与班级代码不一致。", "The selected class does not match the class code."],
      RATE_LIMITED: ["嘗試次數較多，請稍後再試。", "尝试次数较多，请稍后再试。", "Too many attempts. Please try again later."],
      ABORTED: ["操作已取消，未確認儲存。", "操作已取消，未确认保存。", "The action was cancelled; saving was not confirmed."],
    };
    if (copy[error?.code]) return copy[error.code][index];
    if (error?.status === 401) return ["登入已到期，請重新登入或使用恢復碼。", "登录已到期，请重新登录或使用恢复码。", "Your session expired. Sign in or resume with your recovery code."][index];
    if (error?.status === 403) return ["這個帳戶沒有操作權限。", "这个账户没有操作权限。", "This account is not authorised for that action."][index];
    return ["操作未完成，請稍後重試。", "操作未完成，请稍后重试。", "The action did not complete. Please try again."][index];
  }
  window.CampusCloud = {
    CloudError, request, fetchJson: request, bootstrap, join, resume, logout,
    questions: loadQuestions, loadQuestions, practiceCheck, attempt,
    case: submitCase, submitCase, transfer, loadProgress, saveProgress,
    hydrate, messageFor, requestId, keepServerProgress,
    get state() { return snapshot(); },
    get session() { return state.session; },
    get assignmentId() { return state.assignmentId; },
    get version() { return state.version; },
    get status() { return state.status; },
    get error() { return state.error; },
    get lastProgress() { return state.lastProgress; },
  };
})();
