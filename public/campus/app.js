(() => {
  "use strict";
  const KEY = "my-ai-campus-life-v2",
    missions = window.GAME_CONTENT.missions.map((m, i) => ({
      ...m,
      name: window.CAMPUS_CHARACTERS?.resolve(m.id)?.name || m.name,
      location: ["corridor", "corridor1", "corridor2", "corridor3"][i],
    })),
    subjects = (window.SUBJECT_CONTENT || []).map(room => ({ ...room, levels: [] })),
    EXIT_STARS = 100,
    $ = (id) => document.getElementById(id);
  const AVATAR_GENDERS = ["boy", "girl"];
  const AVATAR_UNIFORMS = { boy: [0, 1, 2, 3], girl: [0, 1, 2, 3] };
  let accountDraft = {}, cloudSnapshot = null, cloudReady = false, syncTimer = null, answerPending = false, teacherHandle = null, worksheetHandle = null, printerFloor = 0, printerSubject = null, cloudError = "", recoveryCode = "";
  const cloud = window.CampusCloud;
  const pendingSubmissions = new Map();
  const inClass = () => !!cloud?.session;
  const questionCount = () => subjects.reduce((n, room) => n + room.levels.length, 0);
  const roomMax = room => room.levels.reduce((n, level) => n + level.stars, 0);
  const subjectMax = () => subjects.reduce((n, room) => n + roomMax(room), 0);
  const maxStars = () => cloudSnapshot?.maxStars ?? (subjectMax() + 25);
  const exitTarget = () => Math.min(EXIT_STARS, maxStars());
  const fresh = () => ({
    version: 2,
    student: { grade: 1, section: "A", number: "", name: "" },
    cloudStudentId: null,
    lang: "zh",
    started: false,
    large: false,
    avatar: { gender: "boy", uniform: 0, hair: 0, skin: 0 },
    missions: {},
    subjects: {},
    prologueSeen: false,
    endingSeen: false,
    reflection: "",
    transferChoice: null,
    transferFeedbackChoice: null,
    transferDone: false,
    transferAwarded: false,
    transferAwardChoice: null,
  });
  let state = fresh(),
    storageAvailable = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem("ai-detective-club-v1") || "null");
    if ([1, 2].includes(raw?.version) && !Array.isArray(raw)) {
      state = { ...state, ...raw };
      state.started = raw.started === true;
      state.large = raw.large === true;
      state.prologueSeen = raw.prologueSeen === true;
      state.endingSeen = raw.endingSeen === true;
      state.lang = ["zh", "cn", "en"].includes(raw.lang) ? raw.lang : "zh";
      state.avatar = normaliseAvatar(raw.version === 1 && raw.avatar?.gender === "girl" ? { ...raw.avatar, uniform: Math.max(0, raw.avatar.uniform - 2) } : raw.avatar);
      state.version = 2;
      state.student = normaliseStudent(raw.student);
      state.missions =
        raw.missions &&
        typeof raw.missions === "object" &&
        !Array.isArray(raw.missions)
          ? raw.missions
          : {};
      state.reflection =
        typeof raw.reflection === "string" ? raw.reflection.slice(0, 1200) : "";
      state.transferChoice =
        Number.isInteger(raw.transferChoice) &&
        raw.transferChoice >= 0 &&
        raw.transferChoice < 3
          ? raw.transferChoice
          : null;
      state.transferDone =
        raw.transferDone === true &&
        window.TRANSFER_CONTENT.options[state.transferChoice]?.correct === true;
      state.transferFeedbackChoice = validChoice(raw.transferFeedbackChoice);
      if (state.transferFeedbackChoice !== state.transferChoice)
        state.transferFeedbackChoice = null;
      if (state.transferDone)
        state.transferFeedbackChoice = state.transferChoice;
      state.transferAwardChoice = validChoice(raw.transferAwardChoice);
      // Preserve an earned award when the learner later explores another answer.
      state.transferAwarded =
        raw.transferAwarded === true &&
        window.TRANSFER_CONTENT.options[state.transferAwardChoice]?.correct ===
          true;
      if (state.transferDone && !state.transferAwarded) {
        state.transferAwarded = true;
        state.transferAwardChoice = state.transferChoice;
      }
    }
  } catch {
    storageAvailable = false;
  }
  function validInt(v, n) {
    return Number.isInteger(v) && v >= 0 && v < n ? v : 0;
  }
  function normaliseAvatar(raw) {
    const uniform = validInt(raw?.uniform, 4);
    const gender = AVATAR_GENDERS.includes(raw?.gender) ? raw.gender : "boy";
    return {
      gender,
      uniform: AVATAR_UNIFORMS[gender].includes(uniform)
        ? uniform : AVATAR_UNIFORMS[gender][0],
      hair: raw?.hair === 2 ? 1 : validInt(raw?.hair, 2),
      skin: validInt(raw?.skin, 3),
    };
  }
  function normaliseStudent(raw = {}) {
    return { grade: Math.max(1, Math.min(6, Number(raw?.grade) || 1)), section: ["A", "B", "C", "D"].includes(raw?.section) ? raw.section : "A", number: String(raw?.number || "").slice(0, 16), name: String(raw?.name || "").slice(0, 80) };
  }
  function setGradeQuestions(records = null) {
    const bank = records || (window.GRADE_CONTENT || []).filter(q => q.grade === state.student.grade);
    for (const room of subjects) {
      room.levels = bank.filter(q => q.roomId === room.id && q.category === "subject").map(q => ({ ...q, sourceId: q.sourceId || q.id, revision: q.revision || 1 }));
      room.description = { zh: `中${state.student.grade} · 選擇題目，運用證據檢查答案，再閱讀回饋修正想法。`, cn: `中${state.student.grade} · 选择题目，运用证据检查答案，再阅读反馈修正想法。`, en: `Form ${state.student.grade} · Choose a question, check the evidence, and use feedback to refine your reasoning.` };
      const identity = window.CAMPUS_CHARACTERS?.resolve("subject:" + room.id);
      if (identity) { room.npcName = identity.name; room.npcRole = identity.role; }
    }
    state.subjects = normaliseSubjects(state.subjects);
  }
  function validChoice(v, length = 3) {
    return Number.isInteger(v) && v >= 0 && v < length ? v : null;
  }
  function normaliseSubjects(raw) {
    const saved =
      raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    return Object.fromEntries(
      subjects.map((room) => [
        room.id,
        Object.fromEntries(
          room.levels.map((level) => {
            const value = saved[room.id]?.[level.id];
            const p =
              value && typeof value === "object" && !Array.isArray(value)
                ? value
                : {};
            const solvedChoice = validChoice(p.solvedChoice, level.options.length);
            return [
              level.id,
              {
                choice: validChoice(p.choice, level.options.length),
                feedbackChoice: validChoice(p.feedbackChoice, level.options.length),
                solvedChoice,
                completed:
                  p.completed === true &&
                  (level.options[solvedChoice]?.correct === true || (inClass() && p.serverVerified === true)),
                serverVerified: inClass() && p.serverVerified === true,
                feedback: p.feedback || null,
                correct: p.correct === true,
                attempts:
                  Number.isInteger(p.attempts) && p.attempts >= 0
                    ? Math.min(p.attempts, 9999)
                    : 0,
              },
            ];
          }),
        ),
      ]),
    );
  }
  function subjectState(roomId, levelId) {
    return state.subjects[roomId]?.[levelId];
  }
  function progress() {
    const cases = missions.filter((m) => pstate(m.id).completed).length;
    let checks = 0,
      subjectStars = 0,
      rooms = 0;
    for (const room of subjects) {
      for (const level of room.levels) {
        if (subjectState(room.id, level.id)?.completed) {
          checks++;
          subjectStars += level.stars;
        }
      }
      if (
        room.levels.length > 0 && room.levels.every((level) => subjectState(room.id, level.id)?.completed)
      )
        rooms++;
    }
    const stars = inClass() && cloudSnapshot ? cloudSnapshot.stars : cases * 5 + subjectStars + (state.transferAwarded ? 5 : 0);
    return {
      cases,
      checks,
      rooms,
      subjectStars,
      stars,
      exitUnlocked: maxStars() > 0 && stars >= exitTarget(),
    };
  }
  function campusProgress() {
    return {
      ...Object.fromEntries(
        missions.map((m) => [m.id, pstate(m.id).completed]),
      ),
      ...Object.fromEntries(
        subjects.map((room) => [
          "subject:" + room.id,
          room.levels.length > 0 && room.levels.every(
            (level) => subjectState(room.id, level.id)?.completed,
          ),
        ]),
      ),
      exitUnlocked: progress().exitUnlocked,
    };
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      storageAvailable = false;
    }
    updateSaveLabel();
    queueCloudSave();
  }
  async function submitCloud(kind, payload) {
    const fingerprint = JSON.stringify([cloud.assignmentId, kind, payload]);
    let idempotencyKey = pendingSubmissions.get(fingerprint);
    if (!idempotencyKey) { idempotencyKey = cloud.requestId(); pendingSubmissions.set(fingerprint, idempotencyKey); }
    const result = kind === "transfer" ? await cloud.transfer(payload.optionId, { idempotencyKey }) : kind === "case" ? await cloud.submitCase({ ...payload, idempotencyKey }) : await cloud.attempt({ ...payload, idempotencyKey });
    pendingSubmissions.delete(fingerprint);
    return result;
  }
  function queueCloudSave() {
    if (!cloudReady || !inClass() || cloud?.state.conflict) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      try {
        const snapshot = await cloud.saveProgress({ avatar: state.avatar, locale: state.lang, reflection: state.reflection, location: state.location || "corridor", prologueSeen: state.prologueSeen, cases: state.missions });
        cloudSnapshot = snapshot;
        cloudError = "";
      } catch (error) { cloudError = cloud.messageFor(error, state.lang); }
      updateSaveLabel();
    }, 900);
  }
  function applyCloud(snapshot, { metadata = false } = {}) {
    if (!snapshot) return;
    cloudSnapshot = snapshot;
    const h = cloud.hydrate(snapshot);
    if (!h) return;
    const profile = h.profile;
    state.student = normaliseStudent({ grade: profile.grade, section: profile.section, number: profile.studentNumber, name: profile.name });
    state.cloudStudentId = profile.studentId;
    state.started = true;
    state.subjects = h.subjects;
    state.missions = h.cases;
    state.transferAwarded = h.transfer.awarded;
    state.transferDone = h.transfer.awarded;
    state.transferChoice = h.transfer.choice;
    state.transferFeedbackChoice = h.transfer.choice;
    state.transferAwardChoice = h.transfer.awardChoice;
    if (metadata) {
      const saved = h.metadata;
      if (saved.avatar) state.avatar = normaliseAvatar(saved.avatar);
      if (["zh", "cn", "en"].includes(saved.locale)) state.lang = saved.locale;
      state.reflection = saved.reflection || "";
      state.prologueSeen = saved.prologueSeen === true;
      if (saved.location && window.CAMPUS_LOCATIONS[saved.location]) { state.location = saved.location; engine.setLocation(saved.location); }
      engine.setAvatar(); engine.setLanguage(state.lang);
    }
    cloudError = "";
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { storageAvailable = false; }
  }
  async function refreshClass({ metadata = true } = {}) {
    const result = await cloud.loadQuestions();
    setGradeQuestions(result.questions);
    const snapshot = await cloud.loadProgress();
    applyCloud(snapshot, { metadata });
    updateChrome();
  }
  async function initialiseCloud() {
    if (!cloud) { cloudReady = true; return; }
    try {
      await cloud.bootstrap();
      if (inClass()) await refreshClass();
      else if (state.cloudStudentId) cloudError = L("請使用恢復碼繼續班級進度。", "请使用恢复码继续班级进度。", "Resume your class progress with your recovery code.");
    } catch (error) { cloudError = cloud.messageFor(error, state.lang); }
    cloudReady = true;
    updateChrome();
    if (state.cloudStudentId && !inClass()) toast(cloudError);
  }
  function requireLearningSession() {
    if (state.cloudStudentId && !inClass()) { showModal("account"); return false; }
    return true;
  }
  function renderPrinter() {
    worksheetHandle?.destroy();
    heading(floorLabel(printerFloor), L("工作紙打印", "工作纸打印", "PRINT WORKSHEETS"));
    $("modal-content").innerHTML = '<div id="worksheet-station"></div>';
    worksheetHandle = window.CampusWorksheets?.open({ container: $("worksheet-station"), lang: state.lang, floor: printerFloor, grade: state.student.grade,
      onAccount: () => showModal("account"), onResults: () => { printerSubject = window.CampusWorksheets.subjects.find(subject => subject[1] === printerFloor)?.[0] || null; showModal("teacher"); } });
  }
  function renderTeacher() {
    teacherHandle?.destroy();
    heading(L("教師工作台", "教师工作台", "TEACHER WORKSPACE"), printerSubject ? L("學科成績", "学科成绩", "Subject results") : L("我的教學空間", "我的教学空间", "My teaching space"));
    $("modal-content").innerHTML = `<button class="text-button teacher-panel-link" data-action="teacher-guide">${L("教學目標與課堂指引", "教学目标与课堂指引", "Learning goals and lesson guide")} ↗</button><div id="teacher-workspace"></div>`;
    teacherHandle = window.CampusTeacher.open({ container: $("teacher-workspace"), lang: state.lang, subjectId: printerSubject || undefined, initialTab: printerSubject ? "results" : undefined, onExit: () => closeModal(), onClose: () => closeModal(), onChange: () => { if (inClass()) toast(L("教師資料已更新；新活動可在班級連線重新載入。", "教师资料已更新；新活动可在班级连接重新加载。", "Teacher records updated. Reload your class connection to open a new activity.")); } });
  }
  function renderRoleChoice() {
    heading(L("新開始", "新开始", "NEW BEGINNING"), L("選擇你的身分", "选择你的身份", "Choose your role"));
    $("modal-content").innerHTML = `<div class="role-choice-grid"><button class="role-choice-card" data-action="student-entry"><span class="role-choice-number" aria-hidden="true">01</span><strong>${L("學生", "学生", "Student")}</strong><span class="role-choice-copy">${L("填寫學生資料、選擇造型，開始校園生活。", "填写学生资料、选择造型，开始校园生活。", "Add your student details, choose your character and explore campus.")}</span><span class="role-choice-cta">${L("設定我的角色", "设置我的角色", "Create my character")}</span></button><button class="role-choice-card" data-action="teacher-entry"><span class="role-choice-number" aria-hidden="true">02</span><strong>${L("教師", "教师", "Teacher")}</strong><span class="role-choice-copy">${L("登入教學空間，管理學科題目、工作紙及班級成績。", "登录教学空间，管理学科题目、工作纸及班级成绩。", "Open your teaching space for subject questions, worksheets and class results.")}</span><span class="role-choice-cta">${L("教師登入", "教师登录", "Teacher sign in")}</span></button></div>`;
  }
  function renderAccount() {
    heading(L("我的班級", "我的班级", "MY CLASS"), inClass() ? L("學習紀錄，隨身同行", "学习记录，随身同行", "Take your progress with you") : L("加入班級或繼續學習", "加入班级或继续学习", "Join a class or resume"));
    const student = state.student;
    const status = (cloudError || cloud?.state.conflict) ? `<p class="inline-error" role="status">${esc(cloudError || L("另一部裝置有更新，請重新載入班級進度。", "另一台设备有更新，请重新加载班级进度。", "Another device has newer changes. Reload class progress."))}</p>` : "";
    if (inClass()) {
      $("modal-content").innerHTML = `<div class="account-layout">${status}<div class="account-card"><span class="eyebrow">${esc(cloud.session.schoolYear)} · S${student.grade}${student.section}</span><strong>${esc(student.name)} · ${esc(student.number)}</strong><p>${L("答案由伺服器評分，教師可查看你的學科紀錄。完成後獲得星星；學科分數採首次作答，重試仍可學習及取得星星。", "答案由服务器评分，教师可查看你的学科记录。完成后获得星星；学科分数采用首次作答，重试仍可学习及获得星星。", "Your teacher can see subject records. The server grades answers. Subject scores use your first response; retries still support learning and earning stars.")}</p><p class="sync-state">${esc(cloudError ? L("等待同步", "等待同步", "Waiting to sync") : L("已連接班級", "已连接班级", "Connected to class"))} · ★ ${progress().stars}</p></div>${recoveryCode ? `<div class="account-card"><h3>${L("請儲存你的恢復碼", "请保存你的恢复码", "Save your recovery code")}</h3><p class="account-code">${esc(recoveryCode)}</p><p>${L("只在本次登記顯示。換裝置時，輸入班級代碼、學號及此恢復碼。遺失時可請教師重設。", "仅在此次登记显示。更换设备时，输入班级代码、学号及此恢复码。遗失时可请教师重置。", "Shown for this registration only. On another device, enter your class code, student number and this code. Ask your teacher to reset a lost code.")}</p><button class="secondary" data-action="download-recovery">${L("下載恢復資料", "下载恢复资料", "Download recovery details")}</button></div>` : ""}<div class="button-row"><button class="primary" data-action="customize">${L("繼續選擇角色", "继续选择角色", "Continue to your character")} →</button><button class="secondary" data-action="refresh-class">${L("重新載入班級進度", "重新加载班级进度", "Reload class progress")}</button><button class="secondary" data-action="logout-student">${L("登出此裝置", "退出此设备", "Sign out on this device")}</button></div><p class="small-note">${L("登出不會刪除教師保存的成績。共用裝置請在完成後登出。", "退出不会删除教师保存的成绩。共用设备请在完成后退出。", "Signing out does not delete your teacher’s records. Sign out after using a shared device.")}</p></div>`;
    } else {
      $("modal-content").innerHTML = `<div class="account-layout"><p class="modal-intro">${L("向老師取得班級代碼。加入後，姓名、班別、學號及作答紀錄會儲存於班級資料庫，供授權教師查看。請只填課堂需要的資料。自由探索的舊得分不會匯入班級評分。", "向老师取得班级代码。加入后，姓名、班别、学号及作答记录会保存于班级数据库，供授权教师查看。请只填课堂需要的信息。自由探索的旧得分不会导入班级评分。", "Get a class code from your teacher. Joining stores your name, class, number and responses for your authorised teacher. Enter only the details needed for class. Free-exploration scores are not imported into class assessment.")}</p>${status}<div class="account-fields"><label class="full">${L("班級代碼", "班级代码", "Class code")}<input id="class-code" data-account="classCode" value="${esc(accountDraft.classCode || "")}" autocomplete="off" maxlength="32"></label><label>${L("學號", "学号", "Student number")}<input id="class-number" data-account="studentNumber" inputmode="numeric" pattern="[0-9]{1,3}" value="${esc(accountDraft.studentNumber || student.number)}" autocomplete="off" maxlength="3"></label><label>${L("學生姓名", "学生姓名", "Student name")}<input id="class-name" data-account="name" value="${esc(accountDraft.name || student.name)}" autocomplete="off" maxlength="80"></label><label class="full">${L("恢復碼（曾加入班級時使用）", "恢复码（曾加入班级时使用）", "Recovery code (for returning students)")}<input id="class-recovery" data-account="recoveryCode" type="password" autocomplete="off" value="${esc(accountDraft.recoveryCode || "")}" maxlength="100"></label></div><div class="button-row"><button class="primary" data-action="join-class">${L("首次加入", "首次加入", "Join for the first time")}</button><button class="secondary" data-action="resume-class">${L("使用恢復碼繼續", "使用恢复码继续", "Resume with code")}</button><button class="text-button" data-action="customize">${L("返回角色設定", "返回角色设置", "Back to character")}</button></div></div>`;
    }
  }
  function L(zh, cn, en) {
    return state.lang === "en" ? en : state.lang === "cn" ? cn : zh;
  }
  function T(o) {
    return o?.[state.lang] || o?.en || "";
  }
  function esc(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function pstate(id) {
    let p = state.missions[id];
    if (!p || typeof p !== "object" || Array.isArray(p)) p = {};
    p.seen = Array.isArray(p.seen)
      ? [
          ...new Set(
            p.seen.filter((n) => Number.isInteger(n) && n >= 0 && n < 3),
          ),
        ]
      : [];
    p.phase = validInt(p.phase, 5);
    p.choice =
      Number.isInteger(p.choice) && p.choice >= 0 && p.choice < 3
        ? p.choice
        : null;
    p.firstChoice =
      Number.isInteger(p.firstChoice) && p.firstChoice >= 0 && p.firstChoice < 3
        ? p.firstChoice
        : null;
    p.completed = p.completed === true;
    p.repairChoice =
      Number.isInteger(p.repairChoice) &&
      p.repairChoice >= 0 &&
      p.repairChoice < 3
        ? p.repairChoice
        : null;
    if (
      p.completed &&
      (p.choice === null ||
        !missions.find((m) => m.id === id)?.repair.options[p.repairChoice]
          ?.correct)
    )
      p.completed = false;
    p.repairAttempts =
      Number.isInteger(p.repairAttempts) && p.repairAttempts >= 0
        ? p.repairAttempts
        : 0;
    if (p.completed) p.phase = 4;
    else if (p.phase === 4) p.phase = 0;
    if (p.phase >= 2 && p.choice === null) p.phase = 1;
    state.missions[id] = p;
    return p;
  }
  missions.forEach((m) => pstate(m.id));
  setGradeQuestions();
  if (!missions.every((m) => pstate(m.id).completed)) {
    state.transferDone = false;
    state.transferAwarded = false;
    state.transferAwardChoice = null;
  }
  if (!progress().exitUnlocked) state.endingSeen = false;
  const locations = Object.fromEntries(
    Object.entries(window.CAMPUS_LOCATIONS).map(([id, meta]) => [
      id,
      () => T(meta.label),
    ]),
  );
  const compactEnglishLocations = { corridor:"Corridor", corridor1:"Corridor", corridor2:"Corridor", corridor3:"Corridor", corridor4:"Corridor", playground:"Playground", hall:"Hall", chinese:"Chinese", english:"English", maths:"Maths", chemistry:"Science lab", geography:"Geography", computer:"Computer lab", history:"History", art:"Art studio", music:"Music", library:"Library", rooftop:"Rooftop" };
  const uniformTitle = i => T(window.CAMPUS_CHARACTERS.wardrobe[state.avatar.gender][i]);
  let titleOpen = true;
  let modalType = "",
    panelOpen = false,
    panelReturnToTitle = false,
    activeCase = null,
    activeSubject = null,
    activeLevel = "foundation",
    dialogueId = null,
    dialogueLine = 0,
    location = "corridor",
    mapFloor = 0,
    toastTimer,
    returnFocus = null,
    liveDraft = "",
    repairFeedback = "";
  let audioPanelOpen = false, audioReturnFocus = null, dialogueVisit = 0;
  const audio = window.CampusAudio?.create({ onState: updateAudioStatus });
  const engine = new CampusEngine({
    canvas: $("campus"),
    lang: state.lang,
    getAvatar: () => state.avatar,
    getProgress: campusProgress,
    onInteract: id => openDialogue(id),
    onLocationChange: (loc) => {
      location = loc;
      state.location = loc;
      updateChrome();
      save();
    },
  });
  function updateSaveLabel() {
    const el = $("save-label");
    if (el)
      el.textContent = inClass()
        ? (cloudError || cloud?.state.conflict) ? L("尚未同步，請檢查連線", "尚未同步，请检查连接", "Not synced — check your connection") : cloud?.state.pending > 0 ? L("正在同步…", "正在同步…", "Syncing…") : L("班級進度已同步", "班级进度已同步", "Class progress synced")
        : storageAvailable ? L("自由探索 · 進度儲存在這個瀏覽器", "自由探索 · 进度保存在此浏览器", "Free exploration · saved in this browser") : L("本機儲存不可用，離開後可能無法保留進度", "本机保存不可用，离开后可能无法保留进度", "Local saving unavailable; progress may not survive leaving");
  }
  function announce(s) {
    $("announcer").textContent = s;
  }
  function toast(s) {
    $("scene-toast").textContent = s;
    $("scene-toast").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(
      () => $("scene-toast").classList.remove("visible"),
      3000,
    );
    announce(s);
  }
  function syncPause() {
    engine.setPaused(
      titleOpen ||
        audioPanelOpen ||
        !state.started ||
        panelOpen ||
        !!dialogueId ||
        document.hidden,
    );
    const talking =
      !!dialogueId &&
      !panelOpen &&
      !titleOpen &&
      !document.hidden &&
      dialogueId !== "prologue" &&
      dialogueId !== "exit";
    engine.setTalking?.(dialogueId, talking);
  }
  function updateAudioStatus(snapshot) {
    if (!snapshot) return;
    const audioButton = $("audio-button");
    if (audioButton) { audioButton.dataset.musicStatus = snapshot.music.status; audioButton.dataset.voiceStatus = snapshot.voice.status; audioButton.dataset.voiceError = snapshot.voice.errorCode || ""; audioButton.dataset.voiceStarted = String(snapshot.voice.started || false); audioButton.dataset.voiceEvent = snapshot.voice.lastEvent || ""; audioButton.dataset.voiceLocale = snapshot.voice.actualLocale || ""; }
    const voice = snapshot.voice.requestedLocale && snapshot.voice.requestedLocale !== {zh:"zh-HK",cn:"zh-CN",en:"en-GB"}[state.lang] ? {status:"ready"} : snapshot.voice;
    const failure = voice.status === "unavailable"
      ? voice.errorCode === "voice-gender-unavailable"
        ? L("這部裝置暫無符合此角色性別的語種聲線；請閱讀字幕。", "此设备暂无符合此角色性别的语言声线；请阅读字幕。", "This device has no voice matching this character’s language and gender. Please use the subtitles.")
        : L("這部裝置暫無可用聲線，文字對話仍可使用。", "此设备暂无可用语音，文字对话仍可使用。", "No matching voice is available on this device. Text dialogue remains available.")
      : voice.status === "error"
        ? L("語音未能播放，請重試或使用文字對話。", "语音未能播放，请重试或使用文字对话。", "Speech could not play. Try again or continue with text.")
        : "";
    const status = $("voice-status");
    if (status) status.textContent = failure || (voice.status === "gesture-required"
      ? L("請按「試聽語音」啟用聲音。", "请按“试听语音”启用声音。", "Select Test voice to enable speech.")
      : voice.name ? `${voice.name}${voice.fallback ? L(" · 替代語音", " · 替代语音", " · fallback voice") : ""}${voice.remote ? L(" · 裝置語音服務", " · 设备语音服务", " · device speech service") : ""}`
        : L("繁體中文：粵語。聲線視裝置支援。", "简体中文：国语。语音取决于设备支持。", "English dialogue uses an English voice available on your device."));
    const dialogueStatus = $("dialogue-voice-status");
    if (dialogueStatus) {
      const visible = !!(dialogueId && !titleOpen && !panelOpen && !audioPanelOpen && !document.hidden && !$("dialogue").hidden && failure);
      dialogueStatus.hidden = !visible;
      dialogueStatus.textContent = visible ? failure : "";
    }
    const musicStatus = $("music-status");
    if (musicStatus) musicStatus.textContent = snapshot.music.status === "unavailable" ? L("此瀏覽器未能播放音樂。", "此浏览器无法播放音乐。", "Music is unavailable in this browser.") : `Greensleeves · ${snapshot.music.status === "playing" ? L("播放中", "播放中", "Playing") : snapshot.music.status === "locked" || snapshot.music.status === "gesture-required" ? L("按播放啟用", "按播放启用", "Select Play to start") : L("已暫停", "已暂停", "Paused")}`;
    const musicToggle = $("music-toggle");
    if (musicToggle) musicToggle.textContent = snapshot.music.status === "playing" ? L("暫停音樂", "暂停音乐", "Pause music") : L("播放音樂", "播放音乐", "Play music");
    const mute = $("audio-mute");
    if (mute) { mute.ariaPressed = String(snapshot.settings.muted); mute.textContent = snapshot.settings.muted ? L("開啟聲音", "开启声音", "Unmute") : L("全部靜音", "全部静音", "Mute all"); }
  }
  function clearDialogueVoiceStatus() {
    const status = $("dialogue-voice-status");
    if (status) { status.hidden = true; status.textContent = ""; }
  }
  function renderAudioPanel() {
    const panel = $("audio-panel");
    if (!panel) return;
    const settings = audio?.state.settings || { musicVolume:0, voiceVolume:0, muted:true };
    panel.innerHTML = `<div class="audio-heading"><h2 id="audio-title">${L("音量設定", "音量设置", "Sound settings")}</h2><button class="audio-close" data-action="audio-close" aria-label="${esc(L("關閉音量設定", "关闭音量设置", "Close sound settings"))}">×</button></div><div class="audio-control"><label for="music-volume">${L("音樂", "音乐", "Music")}</label><div class="audio-slider"><input id="music-volume" data-volume="musicVolume" type="range" min="0" max="100" value="${Math.round(settings.musicVolume*100)}"><output for="music-volume">${Math.round(settings.musicVolume*100)}%</output></div><small id="music-status">Greensleeves</small><button id="music-toggle" class="music-toggle" data-action="music-toggle"></button></div><div class="audio-control"><label for="voice-volume">${L("角色語音", "角色语音", "Character voice")}</label><div class="audio-slider"><input id="voice-volume" data-volume="voiceVolume" type="range" min="0" max="100" value="${Math.round(settings.voiceVolume*100)}"><output for="voice-volume">${Math.round(settings.voiceVolume*100)}%</output></div><small id="voice-status" role="status"></small></div><div class="audio-buttons"><button data-action="voice-test">${L("試聽語音", "试听语音", "Test voice")}</button><button id="audio-mute" data-action="audio-mute" aria-pressed="${settings.muted}"></button></div><p class="audio-note">${L("對話出現時朗讀一次。語音由裝置即時合成；部分聲線會使用裝置供應商的服務。", "对话出现时朗读一次。语音由设备即时合成；部分语音会使用设备供应商的服务。", "Each dialogue line is read once. Speech is synthesized by your device; some voices use its provider’s service.")}</p>`;
    updateAudioStatus(audio?.state);
  }
  function setAudioPanel(open) {
    if (open) { audioReturnFocus = document.activeElement; audio?.stopVoice(); renderAudioPanel(); }
    audioPanelOpen = open;
    if (open) clearDialogueVoiceStatus();
    $("audio-panel").hidden = !open;
    $("audio-button").setAttribute("aria-expanded", String(open));
    syncPause();
    if (open) $("music-volume").focus({preventScroll:true});
    else { if (dialogueId) renderDialogue(); if (audioReturnFocus?.isConnected) audioReturnFocus.focus({preventScroll:true}); }
  }
  function updateChrome() {
    const workspace = document.querySelector(".workspace");
    const frame = document.querySelector(".game-frame");
    workspace.hidden = titleOpen;
    document.body.classList.toggle("title-active", titleOpen);
    workspace.classList.toggle(
      "customizing",
      panelOpen && modalType === "avatar",
    );
    document.body.classList.toggle("in-game-panel", panelOpen);
    document.body.classList.toggle("entry-panel-active", panelOpen && panelReturnToTitle && ["role-choice", "teacher", "teacher-guide"].includes(modalType));
    $("modal").hidden = !panelOpen;
    if (panelOpen) {
      $("modal").dataset.panel = modalType;
      frame.dataset.panel = modalType;
    } else {
      delete $("modal").dataset.panel;
      delete frame.dataset.panel;
    }
    $("title-screen").hidden = !titleOpen;
    $("skip-link").href = titleOpen
      ? "#title-screen"
      : panelOpen
        ? "#modal-title"
        : "#game-hud";
    $("title-screen").tabIndex = -1;
    $("title-screen").ariaLabel = L(
      "遊戲主選單",
      "游戏主菜单",
      "Game main menu",
    );
    document.documentElement.lang = { zh: "zh-Hant", cn: "zh-Hans", en: "en" }[
      state.lang
    ];
    document.title = L(
      "我的AI校園生活",
      "我的AI校园生活",
      "My AI Campus Life",
    );
    document.body.classList.toggle("large-text", state.large);
    $("language").value = state.lang;
    if ($("audio-button")) $("audio-button").ariaLabel = L("音量設定", "音量设置", "Sound settings");
    if (audioPanelOpen) renderAudioPanel();
    $("brand-title").innerHTML =
      esc(
        L(
          "我的AI校園生活",
          "我的AI校园生活",
          "My AI Campus Life",
        ),
      ) + "<small>MY AI CAMPUS LIFE</small>";
    const texts = {
      "teacher-button": L("教師工作台", "教师工作台", "Teachers"),
      "settings-button": L("設定", "设置", "Settings"),
      "language-label": L("語言", "语言", "Language"),
      "chapter-label": L(
        "明澄書院 · 新生的一天",
        "明澄书院 · 新生的一天",
        "MING CHING COLLEGE · A NEW SCHOOL DAY",
      ),
      "location-title": L(
        "每個聲音，都值得被聽見。",
        "每个声音，都值得被听见。",
        "Every voice deserves to be heard.",
      ),
      "status-text": state.started
        ? L("校園探索中", "校园探索中", "Campus exploration in progress")
        : L("等待新生報到", "等待新生报到", "Awaiting your arrival"),
      "walk-hint": L("移動", "移动", "Move"),
      "talk-label": L("對話 / 進入", "对话 / 进入", "Talk / enter"),
      "mouse-hint": L(
        "也可點擊地面移動",
        "也可点击地面移动",
        "Or click the ground to walk",
      ),
      "map-button": L("校園地圖 ↗", "校园地图 ↗", "Campus map ↗"),
      "hud-cases": L("案件", "案件", "Cases"),
      "hud-subjects": L("學科", "学科", "Subjects"),
      "hud-map": L("地圖", "地图", "Map"),
      "hud-journal": L("手帳", "手帐", "Journal"),
      "hud-printer": L("打印", "打印", "Print"),
      "hud-settings": L("設定", "设置", "Settings"),
      "notebook-label": L(
        "學習記錄 · LEARNING NOTEBOOK",
        "学习记录 · LEARNING NOTEBOOK",
        "LEARNING NOTEBOOK",
      ),
      "notebook-title": L("學習手帳", "学习手帐", "Case notebook"),
      "journal-label": L("我的學習報告", "我的学习报告", "My learning journal"),
      "footer-meta": L(
        "MEDD8934 · 教學遊戲",
        "MEDD8934 · 教学游戏",
        "MEDD8934 · Learning game",
      ),
      "skip-link": panelOpen
        ? L("跳至遊戲介面", "跳至游戏界面", "Skip to game panel")
        : L("跳至遊戲功能", "跳至游戏功能", "Skip to game controls"),
      "ethics-note": L(
        "先聽故事，再查證據。四宗虛構案件，探索公平、私隱、文化與共融。所有 AI 回應均為教學模擬。",
        "先听故事，再查证据。四宗虚构案件，探索公平、隐私、文化与共融。所有 AI 回应均为教学模拟。",
        "Listen first. Look for evidence. Four fictional cases explore fairness, privacy, culture and inclusion. All AI responses in the game are teaching simulations.",
      ),
    };
    for (const [id, text] of Object.entries(texts)) {
      const element = $(id);
      if (element) {
        const label = id.startsWith("hud-") ? element.querySelector(".hud-label") : null;
        (label || element).textContent = text;
        if (id.startsWith("hud-")) element.title = text;
      }
    }
    const sceneLabel = $("scene-tag").querySelector(".scene-location-copy") || $("scene-tag");
    const sceneFloor = window.CAMPUS_LOCATIONS[location]?.floor ?? 0;
    sceneLabel.textContent = state.lang === "en"
      ? `${sceneFloor === 0 ? "G" : sceneFloor + "F"} · ${compactEnglishLocations[location] || locations[location]()}`
      : locations[location]();
    $("scene-tag").ariaLabel = L("明澄書院", "明澄书院", "Ming Ching College") + " · " + locations[location]();
    $("progress-count").textContent =
      missions.filter((m) => pstate(m.id).completed).length + " / 4";
    let starSummary = $("star-summary");
    if (!starSummary) {
      starSummary = document.createElement("div");
      starSummary.id = "star-summary";
      starSummary.className = "star-summary";
      $("case-list").before(starSummary);
    }
    const total = progress();
    if ($("game-hud")) {
      $("game-hud").tabIndex = -1;
      $("game-hud").ariaLabel = L(
        "校園工具列",
        "校园工具栏",
        "Campus controls",
      );
    }
    if ($("hud-stars")) {
      $("hud-stars").textContent = `★ ${total.stars} / ${exitTarget()}`;
      $("hud-stars").ariaLabel = L(
        `已取得 ${total.stars} 星，離校目標 ${exitTarget()} 星`,
        `已取得 ${total.stars} 星，离校目标 ${exitTarget()} 星`,
        `${total.stars} stars earned; exit goal ${exitTarget()} stars`,
      );
    }
    starSummary.innerHTML = `<div class="star-total"><strong>★ ${total.stars}<small> / ${exitTarget()}</small></strong><span>${total.exitUnlocked ? L("校門已解鎖", "校门已解锁", "Gate unlocked") : L("離校目標", "离校目标", "Exit goal")}</span></div><div class="star-track" role="progressbar" aria-label="${esc(L("校園探索進度", "校园探索进度", "Campus progress"))}" aria-valuemin="0" aria-valuemax="${exitTarget()}" aria-valuenow="${Math.min(total.stars, exitTarget())}"><i style="width:${Math.min(total.stars, exitTarget())}%"></i></div><button class="subject-progress-link" data-action="subjects">${L("學科探索", "学科探索", "Subject discoveries")} · ${total.checks} / ${questionCount()} <span>↗</span></button>`;
    if ($("left")) $("left").ariaLabel = L("向左走", "向左走", "Walk left");
    if ($("right")) $("right").ariaLabel = L("向右走", "向右走", "Walk right");
    $("close-modal").ariaLabel = L("關閉", "关闭", "Close");
    $("fullscreen-button").ariaLabel = L(
      "切換全螢幕",
      "切换全屏",
      "Toggle fullscreen",
    );
    $("campus").ariaLabel = L(
      "校園探索。WASD 或四個方向鍵移動，E 與人物對話，空白鍵或 Enter 進入房間。點擊人物、門口或樓梯可自動走近並互動。案件與學科選單只顯示進度，請到場與角色互動；地圖可協助前往。",
      "校园探索。WASD 或四个方向键移动，E 与人物对话，空格键或 Enter 进入房间。点击人物、门口或楼梯可自动走近并互动。案件与学科菜单仅显示进度，请到场与角色互动；地图可帮助前往。",
      "Explore campus. Move with WASD or all four arrow keys; press E to talk and Space or Enter to enter rooms. Click a person, door or staircase to approach and interact automatically. Cases and Subjects show progress only. Meet characters in person to begin; use the map to travel.",
    );
    renderCases();
    renderIntro();
    updateSaveLabel();
  }
  function caseCards() {
    return missions
      .map((m, i) => {
        const p = pstate(m.id);
        return `<article class="case-item ${p.completed ? "completed" : ""}" data-case-progress="${m.id}"><span class="case-number">${L("案件 0", "案件 0", "CASE 0")}${i + 1}<span>${p.completed ? L("✓ 已結案", "✓ 已结案", "✓ RESOLVED") : p.seen.length ? L("調查中", "调查中", "OPEN") : L("待調查", "待调查", "NEW")}</span></span><strong>${esc(T(m.title))}</strong><span class="case-place">${esc(locations[m.location]())}</span><span class="case-stars">★ ${p.completed ? 5 : 0} / 5</span></article>`;
      })
      .join("");
  }
  function renderCases() {
    $("case-list").innerHTML = caseCards();
  }
  function renderCaseDirectory() {
    heading(
      L(
        "我的AI校園生活 · 調查檔案",
        "我的AI校园生活 · 调查档案",
        "AI CAMPUS · CASE FILES",
      ),
      L(
        "四封投訴，四個等待被聽見的聲音。",
        "四封投诉，四个等待被听见的声音。",
        "Four complaints. Four voices to hear.",
      ),
    );
    $("modal-content").innerHTML =
      `<p class="modal-intro">${L("這裡只顯示完成進度。請前往對應走廊，點擊同學或按 E 開始對話；閱讀至少兩項證據，再作判斷和修正。每宗案件只獎勵 5 星一次。", "这里只显示完成进度。请前往对应走廊，点击同学或按 E 开始对话；阅读至少两项证据，再作判断和修正。每宗案件只奖励 5 星一次。", "This is a progress record. Go to the corridor and click the classmate or press E to talk. Read at least two clues before deciding and repairing. Each case awards 5 stars once.")}</p><div class="case-directory">${caseCards()}</div>`;
  }
  function renderIntro() {
    $("intro").hidden = true;
    $("title-screen").innerHTML =
      `<div class="title-art" aria-hidden="true"></div><div class="title-shade" aria-hidden="true"></div><div class="title-content"><h1 class="game-wordmark">${L("我的AI校園生活", "我的AI校园生活", "My AI Campus Life")}<span class="title-subtitle">${L("一起探索・負責任地使用 AI", "一起探索・负责任地使用 AI", "LEARN · EXPLORE · INCLUDE")}</span></h1><nav class="title-menu" aria-label="${esc(L("主選單", "主菜单", "Main menu"))}"><button class="title-menu-button title-start" data-action="new-game">${L("新開始", "新开始", "New Game")}</button><button class="title-menu-button title-continue" data-action="continue" ${state.started ? "" : "disabled"}>${L("繼續遊戲", "继续游戏", "Continue")}</button><button class="title-menu-button title-settings" disabled title="${esc(L("暫時停用", "暂时停用", "Temporarily unavailable"))}">${L("設定", "设置", "Settings")}</button></nav></div>`;
  }
  function showModal(type) {
    audio?.stopVoice();
    clearDialogueVoiceStatus();
    teacherHandle?.destroy(); teacherHandle = null;
    worksheetHandle?.destroy(); worksheetHandle = null;
    if (!panelOpen) {
      returnFocus = document.activeElement;
      panelReturnToTitle = titleOpen;
    }
    // Character selection enters the game screen; completing it starts the story.
    if (type === "avatar") panelReturnToTitle = false;
    if (type === "map") mapFloor = window.CAMPUS_LOCATIONS[location]?.floor ?? 0;
    modalType = type;
    panelOpen = true;
    titleOpen = false;
    updateChrome();
    syncPause();
    renderModal();
    $("modal").scrollTop = 0;
    $("modal-content").scrollTop = 0;
    const frame = document.querySelector(".game-frame");
    const bounds = frame.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight)
      frame.scrollIntoView({ block: "start", behavior: "instant" });
    $("modal-title").tabIndex = -1;
    $("modal-title").focus({ preventScroll: true });
  }
  function closeModal({ resume = false, restoreFocus = true } = {}) {
    if (!panelOpen) return;
    teacherHandle?.destroy(); teacherHandle = null;
    worksheetHandle?.destroy(); worksheetHandle = null;
    panelOpen = false;
    titleOpen = resume ? false : !state.started || panelReturnToTitle;
    panelReturnToTitle = false;
    modalType = "";
    repairFeedback = "";
    updateChrome();
    syncPause();
    if (!restoreFocus) return;
    if (titleOpen) $("title-screen").focus({ preventScroll: true });
    else if (dialogueId) $("dialogue-next")?.focus({ preventScroll: true });
    else if (returnFocus?.isConnected)
      returnFocus.focus({ preventScroll: true });
    else $("campus").focus({ preventScroll: true });
  }
  function heading(eyebrow, title) {
    $("modal-eyebrow").textContent = eyebrow;
    $("modal-title").textContent = title;
  }
  function renderModal() {
    updatePanelPortrait();
    if (modalType === "role-choice") renderRoleChoice();
    else if (modalType === "avatar") renderAvatar();
    else if (modalType === "cases") renderCaseDirectory();
    else if (modalType === "case") renderInvestigation();
    else if (modalType === "review") renderReviewCase();
    else if (modalType === "map") renderMap();
    else if (modalType === "journal") renderJournal();
    else if (modalType === "teacher") renderTeacher();
    else if (modalType === "printer") renderPrinter();
    else if (modalType === "teacher-guide") renderTeacherGuide();
    else if (modalType === "account") renderAccount();
    else if (modalType === "settings") renderSettings();
    else if (modalType === "reset") renderReset();
    else if (modalType === "subject") renderSubject();
    else if (modalType === "subjects") renderSubjectDirectory();
    else if (modalType === "ending") renderEnding();
  }
  function subjectPortrait(room) { return "subject:" + room.id; }
  function applyPortrait(element, id, talking = false) {
    const meta = window.CAMPUS_CHARACTERS?.portrait(id, talking, state.avatar);
    if (!element || !meta) return;
    element.className = "portrait registered-portrait" + (element.id === "panel-portrait" ? " panel-portrait" : "");
    element.dataset.portrait = id;
    element.style.backgroundImage = `url("${meta.src}")`;
    element.style.backgroundSize = `${meta.sheetWidth / meta.w * 100}% ${meta.sheetHeight / meta.h * 100}%`;
    element.style.backgroundPosition = `${meta.x / Math.max(1, meta.sheetWidth - meta.w) * 100}% ${meta.y / Math.max(1, meta.sheetHeight - meta.h) * 100}%`;
    element.style.aspectRatio = `${meta.w} / ${meta.h}`;
    element.hidden = false;
  }
  function updatePanelPortrait() {
    const portrait = $("panel-portrait");
    if (!portrait) return;
    portrait.hidden = true;
    if (modalType === "subject") applyPortrait(portrait, "subject:" + activeSubject);
    else if (modalType === "case" || modalType === "review") applyPortrait(portrait, activeCase);
  }
  function renderAvatar() {
    state.avatar = normaliseAvatar(state.avatar);
    const student = state.student;
    const locked = inClass() || state.started;
    const genderLabels = { boy: L("男生", "男生", "Boy"), girl: L("女生", "女生", "Girl") };
    const hairLabels = state.avatar.gender === "boy" ? [L("自然短髮", "自然短发", "Tousled short hair"), L("極短髮", "极短发", "Buzz cut")] : [L("冬菇頭", "冬菇头", "Short bob"), L("長馬尾", "长马尾", "Long ponytail")];
    heading(L("我的AI校園生活", "我的AI校园生活", "MY AI CAMPUS LIFE"), L("新生入學登記", "新生入学登记", "A new school day"));
    $("modal-content").innerHTML = `<div class="enrol-layout"><div class="enrol-character"><canvas id="avatar-preview" width="480" height="720" aria-label="${esc(L("角色全身預覽", "角色全身预览", "Full character preview"))}"></canvas><p>${esc(student.name || L("這就是你的校園生活", "这就是你的校园生活", "Make this school day yours"))}</p><span class="enrol-badge">S${student.grade}${student.section} · ${esc(L("明澄書院", "明澄书院", "Ming Ching College"))}</span></div><div class="enrol-card"><div class="enrol-options"><div class="enrol-fields"><label>${L("年級", "年级", "Year")}<select id="student-grade" ${locked ? "disabled" : ""}>${[1,2,3,4,5,6].map(g=>`<option value="${g}" ${g===student.grade?"selected":""}>${L("中", "中", "Form ")}${g}</option>`).join("")}</select></label><label>${L("班別", "班别", "Class")}<select id="student-section" ${locked ? "disabled" : ""}>${["A","B","C","D"].map(c=>`<option ${c===student.section?"selected":""}>${c}</option>`).join("")}</select></label><label>${L("學號", "学号", "Student number")}<input id="student-number" inputmode="numeric" maxlength="16" value="${esc(student.number)}" ${inClass()?"disabled":""} placeholder="01"></label><label>${L("學生姓名", "学生姓名", "Student name")}<input id="student-name" autocomplete="off" maxlength="80" value="${esc(student.name)}" ${inClass()?"disabled":""} placeholder="${esc(L("你的名字或暱稱", "你的名字或昵称", "Name or nickname"))}"></label></div><div class="appearance-row"><span class="field-label">${L("角色外觀", "角色外观", "Character")}</span><div class="chip-row">${AVATAR_GENDERS.map(g=>`<button class="choice-chip" data-gender="${g}" aria-pressed="${state.avatar.gender===g}">${genderLabels[g]}</button>`).join("")}</div></div><div class="appearance-row"><span class="field-label">${L("髮型", "发型", "Hair")}</span><div class="chip-row">${hairLabels.map((label,i)=>`<button class="choice-chip" data-hair="${i}" aria-pressed="${state.avatar.hair===i}">${label}</button>`).join("")}</div></div><span class="field-label">${L("校服", "校服", "Uniform")}</span><div class="uniform-grid">${[0,1,2,3].map(i=>`<button class="choice-chip uniform-card" data-uniform="${i}" aria-pressed="${state.avatar.uniform===i}"><canvas id="uniform-preview-${i}" width="128" height="180" aria-hidden="true"></canvas><span>${esc(uniformTitle(i))}</span></button>`).join("")}</div><div class="appearance-row"><span class="field-label">${L("膚色", "肤色", "Skin tone")}</span><div class="chip-row">${["#f3d1ad","#ce9777","#965f49"].map((c,i)=>`<button class="choice-chip skin-chip" data-skin="${i}" aria-pressed="${state.avatar.skin===i}" aria-label="${esc(L("膚色", "肤色", "Skin tone"))} ${i+1}"><i class="swatch" style="background:${c}"></i></button>`).join("")}</div></div></div><button class="primary enrol-start" data-action="start">${state.prologueSeen ? L("儲存造型", "保存造型", "Save appearance") : L("進入校園", "进入校园", "Enter campus")} →</button><button class="text-button enrol-class-link" data-action="account">${inClass() ? L("查看班級連線", "查看班级连接", "View class connection") : L("有老師提供的班級代碼？加入班級", "有老师提供的班级代码？加入班级", "Have a class code? Join your class")}</button><p class="small-note">${L("學科題目依年級而變。自由探索儲存在本機；加入班級後可跨裝置繼續，教師亦可查看得分。", "学科题目依年级而变。自由探索保存在本机；加入班级后可跨设备继续，教师也可查看得分。", "Questions match your year. Free exploration saves locally. Joining a class enables cross-device progress and teacher score reports.")}</p></div></div>`;
    CampusEngine.drawPlayerPreview($("avatar-preview"), state.avatar);
    [0,1,2,3].forEach(uniform=>CampusEngine.drawPlayerPreview($("uniform-preview-"+uniform), { ...state.avatar, uniform }));
  }
  function specialDialogue(id) {
    const principal = L("何校長", "何校长", "Principal Ho");
    const staff = (name, role, portrait, lines, next, button) => ({
      name,
      role,
      portrait,
      lines,
      next,
      button,
    });
    if (id === "prologue")
      return staff(
        principal,
        L("明澄書院校長", "明澄书院校长", "Principal · Ming Ching College"),
        "principal",
        [
          L(
            `歡迎入讀明澄書院，中${state.student.grade}${state.student.section}班的新同學！今天你會認識校園、挑戰學科問題，並幫助同學一起面對使用 AI 的難題。`,
            `欢迎入读明澄书院，中${state.student.grade}${state.student.section}班的新同学！今天你会认识校园、挑战学科问题，并帮助同学一起面对使用 AI 的难题。`,
            `Welcome to Ming Ching College, class S${state.student.grade}${state.student.section}! Get to know your campus, explore subject challenges and help classmates think through AI dilemmas.`,
          ),
          L(
            "由地下走到四樓，與同學、老師和校務處職員交談。調查公平、私隱、文化與共融：先看證據，再作決定，最後修正方案。",
            "由地下走到四楼，与同学、老师和校务处职员交谈。调查公平、隐私、文化与共融：先看证据，再作决定，最后修正方案。",
            "Explore five floors and talk to students, teachers and office staff. Investigate fairness, privacy, culture and inclusion: examine evidence, decide, then repair the approach.",
          ),
          L(
            "13 個學科空間各有基礎、應用和挑戰題，首次完成分別獲 1、2、3 星。每宗案件獲 5 星，手帳的遷移挑戰再獲 5 星。重做可以練習，但不會重複加星。",
            "13 个学科空间各有基础、应用和挑战题，首次完成分别获 1、2、3 星。每宗案件获 5 星，手帐的迁移挑战再获 5 星。重做可以练习，但不会重复加星。",
            "Each of 13 subject spaces has foundation, application and challenge questions worth 1, 2 and 3 stars once. Each ethics case earns 5 stars; the notebook’s transfer challenge earns 5 more. Replays help you practise but do not add duplicate stars.",
          ),
          L(
            "累積 100 星便可到地下校門完成校園旅程，最高 103 星。星星記錄探索進度，並非品格或能力排名。你可隨時休息、寫反思；短課節不必一次走完整間學校。",
            "累积 100 星便可到地下校门完成校园旅程，最高 103 星。星星记录探索进度，并非品格或能力排名。你可随时休息、写反思；短课节不必一次走完整间学校。",
            "Reach 100 stars to finish your mission at the ground-floor gate; 103 are available. Stars track exploration, not character or ability. Pause, reflect whenever you wish; a short lesson need not cover the entire school.",
          ),
        ],
        "prologue-finish",
        L("開始我的校園生活", "开始我的校园生活", "Begin my school day"),
      );
    if (id.startsWith("subject:")) {
      const room = subjects.find((r) => r.id === id.slice(8));
      if (!room) return null;
      return staff(
        T(room.npcName),
        T(room.npcRole),
        subjectPortrait(room),
        [
          T(room.description),
          L(
            `你可以選擇任何一題開始。先讀清楚條件，作答後看看解釋；答錯也可以再試。這裏共有 ${room.levels.length} 題，可取得 ${roomMax(room)} 顆星。`,
            `你可以选择任何一题开始。先读清楚条件，作答后看看解释；答错也可以再试。这里共有 ${room.levels.length} 题，可取得 ${roomMax(room)} 颗星。`,
            `Start with any question. Read its conditions, make a choice and review the explanation. You can retry. This room has ${room.levels.length} questions worth ${roomMax(room)} stars.`,
          ),
        ],
        "subject",
        L("打開學科挑戰", "打开学科挑战", "Open subject challenges"),
      );
    }
    if (id === "staff:office")
      return staff(
        L("林書記", "林书记", "Ms Lam"),
        L("校務處職員", "校务处职员", "School office clerk"),
        "office",
        [
          L(
            "早晨，新同學。地下有操場和禮堂，一樓是語文及數學，二樓有科學、地理和電腦，三樓是歷史與藝術，四樓有圖書館和天台。",
            "早晨，新同学。地下有操场和礼堂，一楼是语文及数学，二楼有科学、地理和电脑，三楼是历史与艺术，四楼有图书馆和天台。",
            "Good morning, new student. Sport and the hall are on the ground floor; languages and maths on 1F; science, geography and computing on 2F; history and arts on 3F; the library and rooftop on 4F.",
          ),
          L(
            "點擊人物、樓梯或課室門，就會自動走近並互動；也可用 WASD 或方向鍵移動，按 E 與人物交談，按空白鍵或 Enter 進門。校園地圖可直接前往地點。自由探索保存在這個瀏覽器；加入班級可同步紀錄。共用裝置請完成後登出。",
            "点击人物、楼梯或课室门，就会自动走近并互动；也可用 WASD 或方向键移动，按 E 与人物交谈，按空格键或 Enter 进门。校园地图可直接前往地点。自由探索保存在这个浏览器；加入班级可同步记录。共用设备请完成后退出。",
            "Click people, stairs or classroom doors to approach and interact automatically. You can also move with WASD or arrow keys, press E to talk, and Space or Enter to enter rooms. The map offers direct travel. Free exploration stays in this browser. Join a class to sync records; sign out after using a shared device.",
          ),
        ],
        "map",
        L("查看校園地圖", "查看校园地图", "See campus map"),
      );
    if (id === "staff:vice")
      return staff(
        L("周副校長", "周副校长", "Vice-principal Chau"),
        L("副校長", "副校长", "Vice-principal"),
        "vice",
        [
          L(
            "調查時不要只問『AI 答得對不對』。也要問：誰被忽略？哪些資料沒有必要收集？受影響的人能否提出異議？",
            "调查时不要只问“AI 答得对不对”。也要问：谁被忽略？哪些信息没有必要收集？受影响的人能否提出异议？",
            "Ask more than whether an AI answer is correct. Who was overlooked? Which data is unnecessary? Can the people affected challenge a decision?",
          ),
          L(
            "星星是探索紀錄，不是道德排名。先完成四宗案件，再到手帳應用新情境；用一項具體證據支持你的下一步行動。",
            "星星是探索记录，不是道德排名。先完成四宗案件，再到手帐应用新情境；用一项具体证据支持你的下一步行动。",
            "Stars record exploration, not moral rank. Resolve the four cases, then try the new situation in your notebook. Support your next action with a specific piece of evidence.",
          ),
        ],
        "journal",
        L("打開學習手帳", "打开学习手帐", "Open the notebook"),
      );
    if (id === "finale")
      return staff(
        L("許老師", "许老师", "Teacher Hui"),
        L("新生導師", "新生导师", "New student mentor"),
        "teacher",
        [
          L(
            "走到四樓了。你可以把今天的發現帶回日常生活：下一次使用 AI，你會作出哪一項具體改變？",
            "走到四楼了。你可以把今天的发现带回日常生活：下一次使用 AI，你会作出哪一项具体改变？",
            "You have reached 4F. Take your discoveries into everyday life. What specific change will you make next time you use AI?",
          ),
          L(
            "完成四宗案件後，手帳會開放遷移挑戰。把證據、受影響的人和修正方法連起來，再寫下你會邀請誰檢查效果。",
            "完成四宗案件后，手帐会开放迁移挑战。把证据、受影响的人和修正方法连起来，再写下你会邀请谁检查效果。",
            "The transfer challenge opens after all four cases. Connect evidence, the people affected and a practical repair. Then record whom you would invite to review the result.",
          ),
        ],
        "journal",
        L("整理學習報告", "整理学习报告", "Prepare the learning journal"),
      );
    if (id === "exit") {
      const total = progress();
      return staff(
        principal,
        L("明澄書院校長", "明澄书院校长", "Principal · Ming Ching College"),
        "principal",
        total.exitUnlocked
          ? [
              L(
                `你已收集 ${total.stars} 顆星，校門現已開啟。謝謝你聆聽四位同學，也認真檢視校園裏的不同問題。`,
                `你已收集 ${total.stars} 颗星，校门现已开启。谢谢你倾听四位同学，也认真检查校园里的不同问题。`,
                `You have collected ${total.stars} stars. The gate is open. Thank you for listening to four classmates and examining different questions across the school.`,
              ),
              L(
                "行動可以結束，負責任的使用習慣仍要繼續。請在手帳寫下：你發現的證據、你會改變的做法，以及誰能幫你檢查改善是否有效。",
                "行动可以结束，负责任的使用习惯仍要继续。请在手帐写下：你发现的证据、你会改变的做法，以及谁能帮你检查改进是否有效。",
                "The school day can end; responsible habits continue. In your notebook, record evidence you found, a change you will make and someone who can help check whether it works.",
              ),
            ]
          : [
              L(
                `目前有 ${total.stars} 星，還需 ${exitTarget() - total.stars} 星才可完成離校目標。五層樓的學科題、四宗案件及遷移挑戰，合共提供 103 星。`,
                `目前有 ${total.stars} 星，还需 ${exitTarget() - total.stars} 星才可完成离校目标。五层楼的学科题、四宗案件及迁移挑战，合共提供 103 星。`,
                `You have ${total.stars} stars and need ${exitTarget() - total.stars} more to finish at the gate. The five floors, four cases and transfer challenge offer 103 stars in total.`,
              ),
              L(
                "不用急着一次完成。你可以到地圖尋找未探索的課室，或隨時打開手帳寫反思，稍後再回來。",
                "不用急着一次完成。你可以到地图寻找未探索的课室，或随时打开手帐写反思，稍后再回来。",
                "There is no need to finish in one sitting. Find an unexplored room on the map, or reflect in the notebook before returning later.",
              ),
            ],
        total.exitUnlocked ? "ending" : "map",
        total.exitUnlocked
          ? L("完成校園旅程", "完成校园旅程", "Complete the campus journey")
          : L("查看探索進度", "查看探索进度", "See exploration progress"),
      );
    }
    return null;
  }
  function dialogueModel() {
    const m = missions.find((mission) => mission.id === dialogueId);
    if (m) {
      const completed = pstate(m.id).completed;
      return {
        name: T(m.name),
        role: T(m.role),
        portrait: m.id,
        portraitIndex: m.portrait,
        lines: (completed ? [m.takeaway] : m.opening).map(T),
        next: completed ? "review" : "case",
        button: completed
          ? L("查看結案紀錄", "查看结案记录", "Review case")
          : L("打開案件檔案", "打开案件档案", "Open case file"),
      };
    }
    const model = specialDialogue(dialogueId || "");
    const identity = window.CAMPUS_CHARACTERS?.resolve(dialogueId);
    return model && identity ? { ...model, name: T(identity.name), role: T(identity.role), portrait: dialogueId } : model;
  }
  function openDialogue(id) {
    const m = missions.find((mission) => mission.id === id);
    if (!m && !specialDialogue(id)) return;
    if (!state.started) {
      if (m) activeCase = id;
      showModal("avatar");
      return;
    }
    if (panelOpen) closeModal({ resume: true, restoreFocus: false });
    if (m) activeCase = id;
    if (id.startsWith("subject:")) {
      activeSubject = id.slice(8);
      const room = subjects.find((r) => r.id === activeSubject);
      activeLevel = (
        room.levels.find(
          (level) => !subjectState(room.id, level.id)?.completed,
        ) || room.levels[0]
      )?.id || "";
    }
    dialogueId = id;
    dialogueVisit++;
    dialogueLine = 0;
    repairFeedback = "";
    renderDialogue();
    updateChrome();
    syncPause();
    const frame = document.querySelector(".game-frame");
    const bounds = frame.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight)
      frame.scrollIntoView({ block: "start", behavior: "instant" });
    $("dialogue-next").focus({ preventScroll: true });
  }
  function renderDialogue() {
    const model = dialogueModel();
    if (!model) {
      $("dialogue").hidden = true;
      return;
    }
    dialogueLine = Math.min(dialogueLine, model.lines.length - 1);
    const isLast = dialogueLine === model.lines.length - 1;
    const art = window.CAMPUS_ART?.[location];
    const backdrop =
      dialogueId === "prologue"
        ? '<div class="dialogue-backdrop" aria-hidden="true"><img src="title-campus.png" alt="" style="height:100%;width:100%;object-fit:cover"></div>'
        : art
          ? `<div class="dialogue-backdrop" aria-hidden="true"><img src="${esc(art.src)}" alt="" style="height:${art.rows * 100}%;width:auto;position:absolute;left:50%;top:${-art.row * 100}%;transform:translateX(-50%)"></div>`
          : "";
    $("dialogue").hidden = false;
    $("dialogue").dataset.scene =
      dialogueId === "prologue"
        ? "prologue"
        : dialogueId === "exit"
          ? "ending"
          : "conversation";
    $("dialogue").innerHTML =
      `${backdrop}<div class="portrait ${model.portraitIndex !== undefined ? "p" + model.portraitIndex : "staff-portrait"}" data-portrait="${model.portrait}" role="img" aria-label="${esc(model.name)}"></div><div class="dialogue-box" role="region" aria-label="${esc(L("角色對話", "角色对话", "Character dialogue"))}"><span class="speaker">${esc(model.name)}</span><button class="dialogue-close" data-action="close-dialogue" aria-label="${esc(dialogueId === "prologue" ? L("略過序章", "跳过序章", "Skip introduction") : L("結束對話", "结束对话", "End conversation"))}">${dialogueId === "prologue" ? L("略過", "跳过", "Skip") : "×"}</button><p class="dialogue-text" aria-live="polite">${esc(model.lines[dialogueLine])}</p><div class="dialogue-actions"><span>${esc(model.role)} · ${dialogueLine + 1}/${model.lines.length}</span><button class="voice-replay" data-action="voice-replay" aria-label="${esc(L("重播這句對話", "重播这句对话", "Replay this line"))}" title="${esc(L("重播語音", "重播语音", "Replay voice"))}">♪</button><button id="dialogue-next" data-action="dialogue-next">${isLast ? model.button : L("繼續聆聽", "继续倾听", "Keep listening")} <span aria-hidden="true">▸</span></button></div><p id="dialogue-voice-status" class="small-note" role="status" aria-live="polite" aria-atomic="true" hidden></p></div>`;
    clearDialogueVoiceStatus();
    applyPortrait($("dialogue").querySelector(".portrait"), dialogueId, dialogueLine > 0);
    if (!audioPanelOpen) audio?.speak({ key:`${dialogueVisit}:${dialogueId}:${dialogueLine}:${state.lang}`, text:model.lines[dialogueLine], locale:state.lang, characterId:dialogueId, gender:window.CAMPUS_CHARACTERS?.resolve(dialogueId)?.gender });
  }
  function endDialogue() {
    audio?.stopVoice();
    if (dialogueId === "prologue") {
      state.prologueSeen = true;
      save();
    }
    dialogueId = null;
    $("dialogue").hidden = true;
    clearDialogueVoiceStatus();
    syncPause();
    $("campus").focus({ preventScroll: true });
  }
  function nextDialogue() {
    const model = dialogueModel();
    if (!model) return;
    if (dialogueLine < model.lines.length - 1) {
      dialogueLine++;
      engine.setTalking?.(dialogueId, true);
      renderDialogue();
      $("dialogue-next").focus({ preventScroll: true });
      return;
    }
    const next = model.next;
    endDialogue();
    if (next === "prologue-finish") {
      toast(
        L(
          "校園生活開始。點擊人物或入口會自動走近；WASD / 方向鍵移動，E 對話，空白鍵 / Enter 進入房間。",
          "校园生活开始。点击人物或入口会自动走近；WASD / 方向键移动，E 对话，空格键 / Enter 进入房间。",
          "Your school day begins. Click people or entrances to approach; move with WASD / arrow keys, talk with E, and enter rooms with Space / Enter.",
        ),
      );
    } else if (next === "ending") {
      state.endingSeen = true;
      save();
      showModal("ending");
    } else showModal(next);
  }
  function caseNumber(m) {
    return L("案件 0", "案件 0", "CASE 0") + (missions.indexOf(m) + 1);
  }
  function renderInvestigation() {
    const m = missions.find((m) => m.id === activeCase);
    if (!m) return;
    const p = pstate(m.id);
    heading(caseNumber(m) + " · " + T(m.tag), T(m.title));
    const steps = [
      L("蒐集證據", "收集证据", "Evidence"),
      L("作出判斷", "作出判断", "Decision"),
      L("觀察後果", "观察后果", "Impact"),
      L("修正方案", "修正方案", "Repair"),
    ];
    let html = `<div class="case-stepper">${steps.map((s, i) => `<span class="${p.phase === i ? "current" : p.phase > i ? "done" : ""}">${i + 1}. ${s}</span>`).join("")}</div>`;
    if (p.phase === 0) {
      html += `<div class="case-brief">${esc(T(m.scene))}</div><p class="modal-intro">${esc(T(m.task))}</p>${m.evidence.map((e, i) => `<details class="evidence-card ${p.seen.includes(i) ? "seen" : ""}" data-evidence="${i}"><summary>${esc(T(e.label))}</summary><p>${esc(T(e.text))}</p></details>`).join("")}<div class="button-row"><button class="primary" id="evidence-next" data-action="evidence-next" ${p.seen.length < 2 ? "disabled" : ""}>${L("比較方案", "比较方案", "Compare responses")} →</button><span class="small-note" id="evidence-count">${evidenceCount(p)}</span></div><p class="small-note">${L("至少閱讀兩項證據，再提出判斷。", "至少阅读两项证据，再提出判断。", "Read at least two clues before making your decision.")}</p>`;
    }
    if (p.phase === 1) {
      html += `<p class="case-question">${esc(T(m.task))}</p><p class="modal-intro">${L("選擇你會採取的行動。下一步會呈現這個選擇的影響。", "选择你会采取的行动。下一步会呈现这个选择的影响。", "Choose an action. You will see its impact before improving the plan.")}</p>${quizOptions("decision", m.options, p.choice, true)}<div class="button-row"><button id="decision-submit" class="primary" data-action="decision-submit" ${p.choice === null ? "disabled" : ""}>${L("查看行動後果", "查看行动后果", "See the impact")} →</button><button class="secondary" data-action="back-evidence">${L("重看證據", "重看证据", "Review evidence")}</button></div>`;
    }
    if (p.phase === 2) {
      const o = m.options[p.choice];
      html += `<div class="case-brief">${L("你的行動：", "你的行动：", "Your action: ")}<strong>${esc(T(o.title))}</strong></div><div class="feedback ${o.quality < 2 ? "consider" : ""}"><h3>${o.quality === 2 ? L("有根據的起點", "有根据的起点", "An evidence-informed start") : L("還有需要照顧的地方", "还有需要照顾的地方", "There is more to consider")}</h3><p>${esc(T(o.feedback))}</p></div><p class="small-note">${L("這是本案情境的教學回饋。真實決策仍需要更多證據、使用者參與和持續覆核。", "这是本案情境的教学反馈。真实决策仍需要更多证据、用户参与和持续复核。", "This feedback applies to this scenario. Real decisions need more evidence, user participation and ongoing review.")}</p><div class="button-row"><button class="primary" data-action="to-repair">${L("把方案修好", "把方案修好", "Improve the plan")} →</button><button class="secondary" data-action="back-decision">${L("比較另一選擇", "比较另一选择", "Try another response")}</button></div>`;
    }
    if (p.phase === 3) {
      html += `<p class="case-question">${esc(T(m.repair.question))}</p>${quizOptions("repair", m.repair.options, p.repairChoice)}<div id="repair-feedback" role="status">${repairFeedback ? `<div class="feedback consider">${esc(T(repairFeedback))}</div>` : ""}</div><div class="button-row"><button class="primary" id="repair-submit" data-action="repair-submit" ${p.repairChoice === null ? "disabled" : ""}>${L("測試修正方案", "测试修正方案", "Test your repair")} →</button><button class="secondary" data-action="back-evidence">${L("重看證據", "重看证据", "Review evidence")}</button></div>`;
    }
    if (p.phase === 4) {
      const r = m.repair.options.find((o) => o.correct);
      html += `<div class="completion"><div class="success-mark">✓</div><h3>${L("案件已修復，調查繼續。", "案件已修复，调查继续。", "Case repaired. Stay curious.")}</h3><p>${esc(T(m.takeaway))}</p></div><div class="feedback"><h3>${L("修正的理由", "修正的理由", "Why this repair helps")}</h3><p>${esc(T(r.feedback))}</p></div><div class="language-move"><strong>${L("用語言說明你的判斷", "用语言说明你的判断", "Explain your reasoning")}</strong><p>${esc(T(m.languageMove))}</p></div><div class="button-row"><button class="primary" data-action="finish-case">${missions.every((m) => pstate(m.id).completed) ? L("完成結案反思", "完成结案反思", "Write your reflection") : L("返回校園", "返回校园", "Return to campus")} →</button><button class="secondary" data-action="review-case">${L("重新檢視本案", "重新审视本案", "Review the case")}</button></div>`;
    }
    $("modal-content").innerHTML = html;
    $("modal").scrollTop = 0;
    $("modal-content").scrollTop = 0;
    $("modal-title").tabIndex = -1;
    $("modal-title").focus({ preventScroll: true });
    $("modal-content")
      .querySelectorAll("[data-evidence]")
      .forEach((el) =>
        el.addEventListener("toggle", () => {
          if (!el.open) return;
          const i = Number(el.dataset.evidence);
          if (!p.seen.includes(i)) {
            p.seen.push(i);
            save();
            el.classList.add("seen");
            $("evidence-count").textContent = evidenceCount(p);
            $("evidence-next").disabled = p.seen.length < 2;
            renderCases();
          }
        }),
      );
  }
  function evidenceCount(p) {
    return L(
      `已閱讀 ${p.seen.length} / 3 項證據`,
      `已阅读 ${p.seen.length} / 3 项证据`,
      `${p.seen.length} / 3 clues reviewed`,
    );
  }
  function renderReviewCase() {
    const m = missions.find((m) => m.id === activeCase);
    heading(caseNumber(m), T(m.title));
    $("modal-content").innerHTML =
      `<p class="modal-intro">${esc(T(m.scene))}</p>${m.evidence.map((e) => `<details class="evidence-card"><summary>${esc(T(e.label))}</summary><p>${esc(T(e.text))}</p></details>`).join("")}${m.options.map((o) => `<div class="report-row"><h3>${esc(T(o.title))}</h3><p>${esc(T(o.feedback))}</p></div>`).join("")}<div class="feedback">${esc(T(m.takeaway))}</div><button class="secondary" data-action="close">${L("返回校園", "返回校园", "Return to campus")}</button>`;
  }
  function roomStars(room) {
    return room.levels.reduce(
      (sum, level) =>
        sum + (subjectState(room.id, level.id)?.completed ? level.stars : 0),
      0,
    );
  }
  function floorLabel(floor) {
    return floor === 0
      ? L("地下", "地下", "Ground floor")
      : L(`${floor} 樓`, `${floor} 楼`, `${floor}F`);
  }
  // Explicit crops preserve the generated floor art without assuming equal gutters.
  const MAP_FLOOR_ART = [
    { y: 0, h: 300 }, { y: 302, h: 286 }, { y: 590, h: 293 },
    { y: 886, h: 294 }, { y: 1184, h: 333 },
  ];
  function mapDestinationNote(id) {
    const room = subjects.find((r) => r.location === id);
    const mission = missions.find((m) => m.location === id);
    if (room) return L(`${roomStars(room)}／${roomMax(room)} 星`, `${roomStars(room)}／${roomMax(room)} 星`, `${roomStars(room)} / ${roomMax(room)} stars`);
    if (mission) return `${T(mission.name)} · ${pstate(mission.id).completed ? L("已結案", "已结案", "Case complete") : L("AI 倫理案件", "AI 伦理案件", "AI ethics case")}`;
    return L("導師與學習手帳", "导师与学习手帐", "Mentor and learning journal");
  }
  function mapFloorLabel(floor) {
    return L(`第 ${floor + 1} 層 · ${floor === 0 ? "地下" : floor + "F"}`, `第 ${floor + 1} 层 · ${floor === 0 ? "地下" : floor + "F"}`, `Floor ${floor + 1} · ${floor === 0 ? "G" : floor + "F"}`);
  }
  function renderMap() {
    const entries = Object.entries(window.CAMPUS_LOCATIONS);
    const floors = [...new Set(entries.map(([, meta]) => meta.floor))].sort((a, b) => b - a);
    if (!floors.includes(mapFloor)) mapFloor = window.CAMPUS_LOCATIONS[location]?.floor ?? floors[0];
    const rooms = entries.filter(([, meta]) => meta.floor === mapFloor && meta.kind === "room");
    const corridor = entries.find(([, meta]) => meta.floor === mapFloor && meta.kind === "corridor");
    const crop = MAP_FLOOR_ART[mapFloor];
    const currentLabel = T(window.CAMPUS_LOCATIONS[location]?.label || { zh: "校園", cn: "校园", en: "Campus" });
    const destination = (id, meta, index) => {
      const isCurrent = location === id;
      const roomPosition = rooms.length === 2 ? [26.5, 73.5][index] : [19, 50, 81][index];
      return `<button class="floorplan-destination ${meta.kind} ${isCurrent ? "current" : ""}" data-travel="${id}" style="--room-x:${roomPosition ?? 50}%" ${isCurrent ? 'aria-current="location"' : ""} aria-label="${esc(`${T(meta.label)} · ${mapDestinationNote(id)}${isCurrent ? " · " + L("你在這裏", "你在这里", "You are here") : ""}`)}"><strong>${esc(meta.kind === "corridor" ? L("走廊", "走廊", "Corridor") : T(meta.label))}</strong><small>${isCurrent ? L("你在這裏", "你在这里", "You are here") : esc(mapDestinationNote(id))}</small></button>`;
    };
    heading(L("明澄書院 · 五層校園", "明澄书院 · 五层校园", "MING CHING COLLEGE · FIVE FLOORS"), L("校園地圖", "校园地图", "Campus map"));
    $("modal-content").innerHTML = `<div class="campus-map"><div class="map-toolbar"><p class="map-location"><span>${L("目前位置", "当前位置", "Your location")}</span><strong>${esc(currentLabel)}</strong></p></div><div class="map-layout"><div class="map-floors" role="group" aria-label="${esc(L("選擇樓層", "选择楼层", "Choose a floor"))}">${floors.map(floor => `<button data-map-floor="${floor}" aria-pressed="${floor === mapFloor}" aria-controls="floorplan-panel" aria-label="${esc(mapFloorLabel(floor))}"><span>${L(`第 ${floor + 1} 層`, `第 ${floor + 1} 层`, `Floor ${floor + 1}`)}</span><strong>${floor === 0 ? L("地下", "地下", "G") : floor + "F"}</strong></button>`).join("")}</div><section id="floorplan-panel" class="floorplan-panel" aria-label="${esc(floorLabel(mapFloor))}"><div class="floorplan-scroll" tabindex="0" aria-label="${esc(L("校園平面圖；窄螢幕可左右捲動", "校园平面图；窄屏幕可左右滚动", "Campus floor plan; scroll horizontally on a narrow screen"))}"><div class="floorplan-stage" style="--floor-ratio:1024 / ${crop.h};--floor-size:${1536 / crop.h * 100}%;--floor-y:${crop.y / (1536 - crop.h) * 100}%"><div class="floorplan-art" aria-hidden="true"></div>${rooms.map(([id, meta], index) => destination(id, meta, index)).join("")}${corridor ? destination(corridor[0], corridor[1], -1) : ""}</div></div><p class="map-caption"><span class="map-pan-hint">${L("左右滑動平面圖，查看所有房間。", "左右滑动平面图，查看所有房间。", "Swipe the floor plan sideways to see every room.")}</span>${L("點選房間或走廊即可前往；樓層由上至下排列，可用上下方向鍵切換。", "点击房间或走廊即可前往；楼层由上至下排列，可用上下方向键切换。", "Select a room or corridor to travel. Floors run from top to bottom; use Up and Down on the floor buttons.")}</p></section></div><div class="map-footer"><p>${mapFloor === 0 ? L("校務處在地下走廊。取得 100 星後，可到走廊左端校門完成旅程。", "校务处在地下走廊。取得 100 星后，可到走廊左端校门完成旅程。", "Find the school office in the ground-floor corridor. With 100 stars, finish at the gate on its left.") : mapFloor === 2 ? L("副校長在二樓走廊，可一起討論 AI 的公平與責任。", "副校长在二楼走廊，可以一起讨论 AI 的公平与责任。", "Meet the vice principal in the 2F corridor to discuss fairness and responsibility in AI.") : mapFloor === 4 ? L("四樓導師會陪你整理發現，並把所學帶到新的情境。", "四楼导师会陪你整理发现，并把所学带到新的情境。", "The mentor on 4F can help you reflect and apply your learning to a new situation.") : L("課室有學科挑戰，走廊有同學等待與你分享 AI 的難題。", "教室有学科挑战，走廊有同学等待与你分享 AI 的难题。", "Explore subject challenges in the rooms and meet a classmate with an AI dilemma in the corridor.")}</p><button class="secondary" data-action="close">${L("返回校園", "返回校园", "Return to campus")}</button></div></div>`;
  }
  function chooseMapFloor(value, focus = false) {
    const floor = Number(value);
    if (!Number.isInteger(floor) || !Object.values(window.CAMPUS_LOCATIONS).some(meta => meta.floor === floor)) return;
    mapFloor = floor;
    renderMap();
    if (focus) $("modal-content").querySelector(`[data-map-floor="${floor}"]`)?.focus({ preventScroll: true });
  }
  function quizOptions(name, options, choice, withTitle = false) {
    return options.map((option, index) => `<label class="option quiz-option"><input type="radio" name="${name}" value="${index}" ${choice === index ? "checked" : ""}><span class="quiz-option-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span class="quiz-option-copy">${withTitle ? `<strong>${esc(T(option.title))}</strong><span>${esc(T(option.text))}</span>` : esc(T(option.text))}</span></label>`).join("");
  }
  function renderSubjectDirectory() {
    heading(
      L("跨科探索紀錄", "跨科探索记录", "SUBJECT DISCOVERIES"),
      L(
        `中${state.student.grade} · 13 個空間，${questionCount()} 次思考`,
        `中${state.student.grade} · 13 个空间，${questionCount()} 次思考`,
        `S${state.student.grade} · 13 spaces, ${questionCount()} questions`,
      ),
    );
    const total = progress();
    $("modal-content").innerHTML =
      `<p class="modal-intro">${L(`已完成 ${total.checks}／${questionCount()} 題，取得 ${total.subjectStars}／${subjectMax()} 顆學科星。每題只獎勵一次，沒有時間限制。基礎、應用和挑戰是題目層次，並非學生能力標籤。`, `已完成 ${total.checks}／${questionCount()} 题，取得 ${total.subjectStars}／${subjectMax()} 颗学科星。每题只奖励一次，没有时间限制。基础、应用和挑战是题目层次，并非学生能力标签。`, `${total.checks}/${questionCount()} questions completed, with ${total.subjectStars}/${subjectMax()} subject stars. Each question awards stars once, with no time limit. Foundation, application and challenge describe tasks, not a learner’s ability.`)}</p><div class="subject-directory">${subjects.map((room) => `<article class="map-room" data-subject-progress="${room.id}"><span class="eyebrow">${floorLabel(room.floor)} · ★ ${roomStars(room)} / ${roomMax(room)}</span><strong>${esc(T(room.subject))}</strong><span>${esc(T(room.title))}</span><span>${room.levels.map((level) => (subjectState(room.id, level.id)?.completed ? "●" : "○")).join(" ")}</span></article>`).join("")}</div><p class="small-note">${L("這裡只顯示學科進度。請前往課室與老師互動，才可開始答題。短課節可由老師選定路線，不必為離校門檻而趕答。", "这里只显示学科进度。请前往教室与老师互动，才可开始答题。短课节可由老师选定路线，不必为离校门槛而赶答。", "This is a progress record. Visit a room and interact with its teacher to begin. For a short lesson, follow a teacher-selected route without rushing to the exit threshold.")}</p>`;
  }
  function renderSubject() {
    const room = subjects.find((r) => r.id === activeSubject);
    if (!room) return renderSubjectDirectory();
    const level =
      room.levels.find((item) => item.id === activeLevel) || room.levels[0];
    if (!level) { heading(T(room.subject), L("本活動未有此科題目", "本活动暂无此科题目", "No questions assigned here")); $("modal-content").innerHTML = `<p class="modal-intro">${L("老師可在工作台新增題目，並為班級開啟新活動。", "老师可在工作台添加题目，并为班级开启新活动。", "Your teacher can add questions and start a new class activity.")}</p><button class="secondary" data-action="subjects">${L("全部學科", "全部学科", "All subjects")}</button>`; return; }
    activeLevel = level.id;
    const p = subjectState(room.id, level.id);
    const feedback = p.feedbackChoice !== null && p.feedback ? { feedback: p.feedback, correct: p.correct } : level.options[p.feedbackChoice];
    heading(
      `${floorLabel(room.floor)} · ${T(room.title)} · ★ ${roomStars(room)} / ${roomMax(room)}`,
      T(room.subject),
    );
    $("modal-content").innerHTML =
      `<div class="subject-tabs" aria-label="${esc(L("選擇題目層次", "选择题目层次", "Choose question level"))}">${room.levels.map((item) => `<button class="subject-tab choice-chip" data-level="${item.id}" aria-pressed="${item.id === level.id}"><span>${esc(T(item.title).split(/[：:]/)[0])}</span><small>★ ${item.stars} ${subjectState(room.id, item.id)?.completed ? "✓" : ""}</small></button>`).join("")}</div><div class="subject-question"><div class="quiz-question-meta"><span class="eyebrow">${esc(T(room.npcName))}</span><h3>${esc(T(level.title))}</h3></div><p class="case-question">${esc(T(level.question))}</p><fieldset class="subject-options"><legend class="sr-only">${esc(T(level.question))}</legend>${quizOptions("subject-answer", level.options, p.choice)}</fieldset><div class="subject-feedback" id="subject-feedback" role="status">${feedback ? `<div class="feedback ${feedback.correct ? "" : "consider"}">${esc(T(feedback.feedback))}${feedback.correct && T(level.takeaway) !== T(feedback.feedback) ? `<p>${esc(T(level.takeaway))}</p>` : ""}</div>` : ""}</div><div class="button-row"><button class="primary" id="subject-submit" data-action="subject-submit" ${p.choice === null ? "disabled" : ""}>${L("檢查我的答案", "检查我的答案", "Check my answer")}</button><button class="secondary" data-action="subject-retry">${L("重新思考", "重新思考", "Try again")}</button><button class="secondary" data-action="subjects">${L("全部學科", "全部学科", "All subjects")}</button></div><p class="small-note subject-earned">${p.completed ? L(`✓ 本題的 ${level.stars} 顆星已取得。可重做練習，不會重複加星。`, `✓ 本题的 ${level.stars} 颗星已取得。可重做练习，不会重复加星。`, `✓ This question’s ${level.stars} stars are earned. Replay for practice; stars are awarded once.`) : L(`首次答對可獲 ${level.stars} 顆星。先讀解釋，再嘗試修正想法。`, `首次答对可获 ${level.stars} 颗星。先读解释，再尝试修正想法。`, `Earn ${level.stars} stars on your first correct response. Read the explanation and revise your thinking.`)}</p></div>`;
  }
  function renderEnding() {
    const total = progress();
    if (!total.exitUnlocked) return renderJournal();
    heading(
      L(
        "我的AI校園生活 · 完成",
        "我的AI校园生活 · 完成",
        "AI CAMPUS · MISSION COMPLETE",
      ),
      L(
        "把好問題，帶出校門。",
        "把好问题，带出校门。",
        "Take better questions beyond the gate.",
      ),
    );
    $("modal-content").innerHTML =
      `<div class="ending-card"><span class="ending-stars">★ ${total.stars} / ${maxStars()}</span><h3>${L("調查完成，學習繼續。", "调查完成，学习继续。", "Mission complete. Learning continues.")}</h3><p>${L("你聆聽同學、檢查證據，並為不公平或不合適的 AI 做法提出修正。現在，把一項具體發現寫進你的下一步行動。", "你倾听同学、检查证据，并为不公平或不合适的 AI 做法提出修正。现在，把一项具体发现写进你的下一步行动。", "You listened to classmates, examined evidence and repaired unfair or unsuitable AI practices. Now connect one specific discovery to your next action.")}</p><p>${L("這是遊戲探索紀錄，並非能力或品格認證。你仍可回校重溫任何活動。", "这是游戏探索记录，并非能力或品格认证。你仍可回校重温任何活动。", "This records game exploration, not a qualification or judgement of character. You can revisit any activity.")}</p><div class="button-row"><button class="primary" data-action="journal">${L("寫下反思", "写下反思", "Reflect")}</button><button class="secondary" data-action="close">${L("返回校園探索", "返回校园探索", "Return to campus")}</button></div></div>`;
  }
  function renderJournal() {
    heading(
      L("我的調查紀錄", "我的调查记录", "YOUR INVESTIGATION RECORD"),
      L(
        "把發現帶到下一次選擇",
        "把发现带到下一次选择",
        "Take your learning forward",
      ),
    );
    const all = missions.every((m) => pstate(m.id).completed);
    $("modal-content").innerHTML =
      `<p class="modal-intro">${L("印章記錄你完成的調查，不代表你的道德分數。更重要的是：你能否用證據說明改善方法？", "印章记录你完成的调查，不代表你的道德分数。更重要的是：你能否用证据说明改进方法？", "Stamps record completed investigations, not a moral score. What matters is explaining a better approach with evidence.")}</p><div class="journal-stamps">${missions.map((m, i) => `<div class="stamp ${pstate(m.id).completed ? "complete" : ""}"><b>${pstate(m.id).completed ? "✓" : "0" + (i + 1)}</b>${esc(T(m.tag))}</div>`).join("")}</div>${missions
        .filter((m) => pstate(m.id).completed)
        .map(
          (m) =>
            `<div class="report-row"><h3>${esc(T(m.title))}</h3><p>${esc(T(m.takeaway))}</p></div>`,
        )
        .join(
          "",
        )}<div class="teacher-section"><h3>${L("遷移挑戰：新的投訴", "迁移挑战：新的投诉", "Transfer challenge: a new complaint")}</h3>${all ? `<p>${esc(T(window.TRANSFER_CONTENT.scene))}</p><p class="case-question">${esc(T(window.TRANSFER_CONTENT.question))}</p>${quizOptions("transfer", window.TRANSFER_CONTENT.options, state.transferChoice)}<div id="transfer-feedback" role="status">${state.transferFeedbackChoice !== null ? `<div class="feedback ${window.TRANSFER_CONTENT.options[state.transferFeedbackChoice].correct ? "" : "consider"}">${esc(T(window.TRANSFER_CONTENT.options[state.transferFeedbackChoice].feedback))}</div>` : ""}</div><button class="secondary" data-action="check-transfer">${L("檢視我的判斷", "检查我的判断", "Check my reasoning")}</button>` : `<p>${L("完成四宗案件後，這裏會出現一個新情境，讓你應用所學。", "完成四宗案件后，这里会出现一个新情境，让你应用所学。", "Complete all four cases to unlock a new situation and apply what you learned.")}</p>`}</div><label class="field-label" for="reflection">${L("我的下一步行動", "我的下一步行动", "My next action")}</label><p class="small-note" style="margin:0 0 10px">${L("「下次使用 AI 時，我會＿＿，因為本案的＿＿證據顯示＿＿。我會邀請＿＿檢查效果。」請勿填寫姓名或私人資料。", "“下次使用 AI 时，我会＿＿，因为本案的＿＿证据显示＿＿。我会邀请＿＿检查效果。”请勿填写姓名或私人信息。", "“Next time I use AI, I will ___ because evidence from ___ shows ___. I will invite ___ to review the result.” Do not include names or private information.")}</p><textarea id="reflection" maxlength="1200" placeholder="${esc(L("寫下你能做到的一個具體行動……", "写下你能做到的一个具体行动……", "Write one specific action you can take…"))}">${esc(state.reflection)}</textarea><div class="button-row"><button class="secondary" data-action="close">${L("繼續探索", "继续探索", "Keep exploring")}</button></div><p class="small-note">${L("自由探索的反思保存在本機；班級模式會同步到班級資料庫，供你跨裝置繼續。內容不會送往 AI 工具。", "自由探索的反思保存在本机；班级模式会同步到班级数据库，供你跨设备继续。内容不会发送到 AI 工具。", "Free-exploration reflections stay locally. Class mode syncs them to the class database so you can resume on another device. They are not sent to AI tools.")}</p>`;
    const total = progress();
    $("modal-content").insertAdjacentHTML(
      "afterbegin",
      `<div class="journal-progress"><strong>★ ${total.stars} / ${maxStars()}</strong><p>${L(`案件 ${total.cases}／4 · 學科 ${total.checks}／39 · 離校目標 ${exitTarget()} 星`, `案件 ${total.cases}／4 · 学科 ${total.checks}／39 · 离校目标 ${exitTarget()} 星`, `Cases ${total.cases}/4 · Subject questions ${total.checks}/39 · Exit goal ${exitTarget()} stars`)}</p><p class="small-note">${state.transferAwarded ? L("✓ 遷移挑戰的 5 星已取得；重試不會重複獎勵或扣星。", "✓ 迁移挑战的 5 星已取得；重试不会重复奖励或扣星。", "✓ The transfer challenge’s 5 stars are earned; replays neither add nor remove them.") : L("完成四案各得 5 星；學科題共 78 星；遷移挑戰另得 5 星。", "完成四案各得 5 星；学科题共 78 星；迁移挑战另得 5 星。", "Four cases earn 5 stars each; subjects offer 78, and the transfer challenge another 5.")}</p><div class="button-row"><button class="secondary" data-action="subjects">${L("查看學科進度", "查看学科进度", "View subject progress")}</button>${total.exitUnlocked ? `<button class="primary" data-action="visit-gate">${L("前往校門完成校園旅程", "前往校门完成校园旅程", "Finish at the school gate")} →</button>` : ""}</div></div>`,
    );
  }
  const sample =
    "At our school’s language festival, I helped run a yum cha stall. My grandma taught me to welcome guests by asking, “Have you eaten yet?” I want visitors to understand why this greeting matters to us.";
  const prompt =
    "Give feedback to a 13-year-old English learner on the paragraph below. Keep the student’s meaning and cultural voice. Do not invent details. Suggest two changes and explain each in simple English. If a phrase is culturally specific, ask the writer before replacing it. Then provide one possible revision.\n\nParagraph: " +
    sample;
  function renderTeacherGuide() {
    heading(
      L("遊戲與教學", "游戏与教学", "TEACHING WITH THE GAME"),
      L("讓調查成為學習", "让调查成为学习", "Turn investigation into learning"),
    );
    $("modal-content").innerHTML =
      `<p class="modal-intro">${L("適用中學生；建議二人一組，共用一部裝置。核心循環：聆聽 → 查證 → 判斷 → 修正 → 反思。", "适用中学生；建议二人一组，共用一台设备。核心循环：倾听 → 查证 → 判断 → 修正 → 反思。", "For secondary students; pairs can share one device. The learning loop: listen → investigate → decide → repair → reflect.")}</p><section class="teacher-section"><h3>${L("可觀察的學習目標", "可观察的学习目标", "Observable learning goals")}</h3><ol><li>${L("找出 AI 語言學習工具的公平、私隱、文化或參與問題。", "找出 AI 语言学习工具的公平、隐私、文化或参与问题。", "Identify a fairness, privacy, cultural or access issue in an AI language tool.")}</li><li>${L("引用至少兩項證據，比較不同做法對人的影響。", "引用至少两项证据，比较不同做法对人的影响。", "Use at least two clues to compare the effects of different actions on people.")}</li><li>${L("提出具體修正和人工覆核方法，並應用於新情境。", "提出具体修正和人工复核方法，并应用于新情境。", "Propose a specific repair and human review process, then apply it to a new scenario.")}</li></ol></section><section class="teacher-section"><h3>${L("25 分鐘課堂流程", "25 分钟课堂流程", "A 25-minute lesson")}</h3><ul><li><b>0–3 min</b> · ${L("提問：「AI 給出的分數是否足以代表能力？」先記下理由。", "提问：“AI 给出的分数是否足以代表能力？”先记下理由。", "Ask: “Is an AI score enough to judge ability?” Record an initial reason.")}</li><li><b>3–18 min</b> · ${L("二人合作調查四案；輪流操作和解釋證據。可按班情延長。", "两人合作调查四案；轮流操作和解释证据。可按班级情况延长。", "Investigate four cases in pairs; alternate navigator and evidence reader. Extend as needed.")}</li><li><b>18–22 min</b> · ${L("完成遷移挑戰與具體行動反思。", "完成迁移挑战与具体行动反思。", "Complete the transfer challenge and an actionable reflection.")}</li><li><b>22–25 min</b> · ${L("重新回答起始問題，引用一項證據和一個仍未解決的疑問。", "重新回答起始问题，引用一项证据和一个仍未解决的疑问。", "Revisit the opening question with evidence and one unresolved question.")}</li></ul></section><section class="teacher-section"><h3>${L("形成性評量，不用道德排名", "形成性评价，不用道德排名", "Assess reasoning, not moral ranking")}</h3><p>${L("按「證據、受影響的人、修正方案、遷移」四向度，各評 0–2：0＝未提及；1＝提及但欠具體；2＝具體、有證據並能說明理由。這是教師觀察規準，不是網站自動評分。通關不等於已證明學習成效。", "按“证据、受影响的人、修正方案、迁移”四维度，各评 0–2：0＝未提及；1＝提及但不具体；2＝具体、有证据并能说明理由。这是教师观察标准，不是网站自动评分。通关不等于已证明学习成效。", "Use four dimensions: evidence, affected people, repair and transfer. For each: 0 = absent; 1 = mentioned but vague; 2 = specific, supported and explained. This is a teacher observation rubric, not an automatic site score. Completion does not establish learning effectiveness.")}</p></section><section class="teacher-section"><h3>${L("MEDD8934：10 分鐘示範安排", "MEDD8934：10 分钟演示安排", "MEDD8934: a 10-minute demonstration")}</h3><p>${L("0–1 分鐘：教學問題；1–4 分鐘：觀眾一起調查一案；4–7 分鐘：在真實 AI 工具中執行以下提示，比較原文與實際輸出；7–9 分鐘：檢查文化聲音、虛構內容和工具限制；9–10 分鐘：修正及反思。另留 2 分鐘問答。", "0–1 分钟：教学问题；1–4 分钟：观众一起调查一案；4–7 分钟：在真实 AI 工具中执行以下提示，比较原文与实际输出；7–9 分钟：检查文化声音、虚构内容和工具限制；9–10 分钟：修正及反思。另留 2 分钟问答。", "0–1 min: learning problem; 1–4: investigate a case with the audience; 4–7: run the prompt below in a real AI tool and compare input/output; 7–9: examine cultural voice, invented details and limits; 9–10: repair and reflect. Allow a separate 2-minute Q&A.")}</p><div class="feedback consider">${L("遊戲內的回應全部是預先編寫的教學模擬。遊戲本身沒有連接生成式 AI，不能代替課程要求的真實工具現場示範。", "游戏内的回应全部是预先编写的教学模拟。游戏本身没有连接生成式 AI，不能代替课程要求的真实工具现场演示。", "All in-game responses are authored simulations. The game does not connect to generative AI and does not replace the course requirement for live, real-tool use.")}</div><span class="demo-label">${L("虛構語言學習文本", "虚构语言学习文本", "Fictional learner paragraph")}</span><div class="demo-text">${esc(sample)}</div><span class="demo-label">${L("教學模擬：值得追問的改寫", "教学模拟：值得追问的改写", "Authored simulation: a revision to question")}</span><div class="demo-text">“At our school’s language festival, I helped run a tea party. My grandma taught me to say, ‘How are you?’ to guests.”<br><br>${L("它改變了「yum cha」與問候語的文化意義，也刪去了作者的寫作目的。", "它改变了“yum cha”与问候语的文化意义，也删去了作者的写作目的。", "It changes the cultural meaning of yum cha and the greeting, and removes the writer’s purpose.")}</div><span class="demo-label">${L("教學模擬：作者覆核後的可能版本", "教学模拟：作者复核后的可能版本", "Authored simulation: a possible reviewed revision")}</span><div class="demo-text">“At our school’s language festival, I helped run a yum cha stall. My grandma taught me to greet guests by asking, ‘Have you eaten yet?’ I want to explain to visitors why this greeting is meaningful to us.”</div><button class="secondary" data-action="copy-prompt">${L("複製真實工具示範提示", "复制真实工具演示提示", "Copy the live-demo prompt")}</button><details class="evidence-card" style="margin-top:12px"><summary>${L("查看完整提示", "查看完整提示", "Read the full prompt")}</summary><p>${esc(prompt)}</p></details><p class="small-note">${L("由教師按學校規定選擇工具及帳戶，將提示貼上並實際執行。記錄工具及日期；輸出可能不同。若沒有觀察到失效，應如實記錄。", "由教师按学校规定选择工具及账户，将提示粘贴并实际执行。记录工具及日期；输出可能不同。若没有观察到失效，应如实记录。", "The teacher selects an appropriate tool/account under school policy, pastes the prompt and runs it. Record the tool and date; output varies. Report honestly if no failure is observed.")}</p><label class="field-label" for="live-output" style="margin-top:16px">${L("貼上實際輸出作比較（選填）", "粘贴实际输出作比较（选填）", "Paste the actual output to compare (optional)")}</label><textarea id="live-output" maxlength="6000" placeholder="${esc(L("這裏不會呼叫 AI，也不會儲存或傳送輸出。", "这里不会调用 AI，也不会保存或发送输出。", "No AI is called here. This text is not saved or transmitted."))}">${esc(liveDraft)}</textarea></section><section class="teacher-section"><h3>${L("可及性、資料與限制", "可访问性、数据与限制", "Access, data and limitations")}</h3><p>${L("三語內容、可放大文字、全視窗校園、WASD／方向鍵移動、E 與人物交談、空白鍵／Enter 進門、點擊人物或門口自動走近，以及案件進度紀錄；不設倒數或聲音必答。自由探索儲存在本機；班級模式會把姓名、學號和作答紀錄儲存在教師的班級資料庫。本網站不會把反思送給 AI；託管服務仍可能處理一般連線紀錄。共享裝置可在設定中清除進度。", "三语内容、可放大文字、全窗口校园、WASD／方向键移动、E 与人物交谈、空格键／Enter 进门、点击人物或门口自动走近，以及案件进度记录；不设倒计时或声音必答。自由探索保存在本机；班级模式会把姓名、学号和作答记录保存在教师的班级数据库。本网站不会把反思发送给 AI；托管服务仍可能处理一般连接记录。共享设备可在设置中清除进度。", "Three languages, larger text, a viewport-filling campus, WASD/arrow movement, E to talk, Space/Enter to enter rooms, click-to-approach people or doors, case progress records, no countdown and no audio-only tasks. Free exploration saves locally. Class mode stores name, student number and responses in the teacher’s class database. Reflections are not sent to AI; hosting may process standard connection logs. Clear progress in Settings on shared devices.")}</p><p style="margin-top:10px">${L("本版本尚未進行學生試行或完整無障礙稽核。人物、學校、投訴與數據皆為虛構。角色立繪使用 AI 協助生成；文字與程式使用 AI 協助製作，提交者需覆核並按課程要求作聲明。", "本版本尚未进行学生试用或完整无障碍审核。人物、学校、投诉与数据皆为虚构。角色立绘使用 AI 协助生成；文字与程序使用 AI 协助制作，提交者需复核并按课程要求作声明。", "This version has not undergone a student pilot or full accessibility audit. Characters, school, complaints and data are fictional. Portraits, content and code were created with AI assistance; presenters should review and disclose this under course requirements.")}</p></section><section class="teacher-section"><h3>${L("校服款式與官方來源", "校服款式与官方来源", "Uniform references")}</h3><p>${L("校服依公開資料重新繪製並作像素簡化；未使用校徽、校章或學校照片。本遊戲並非任何學校的官方作品。", "校服依公开资料重新绘制并作像素简化；未使用校徽、校章或学校照片。本游戏并非任何学校的官方作品。", "Outfits are original pixel interpretations of public uniform information. No crests, badges or school photos are used. This is not an official game of any school.")}</p><ul><li><a href="https://www.qc.edu.hk/en/site/view?name=School+Regulations" target="_blank" rel="noopener">${L("皇仁書院：夏季白恤衫、白長褲、黑皮帶", "皇仁书院：夏季白衬衫、白长裤、黑皮带", "Queen’s College: summer white shirt/trousers, black belt")}</a></li><li><a href="https://www.hkcwcc.edu.hk/en/school-uniform" target="_blank" rel="noopener">${L("香港中國婦女會中學：男生冬季白色長袖恤衫、灰色直腳長褲", "香港中国妇女会中学：男生冬季白色长袖衬衫、灰色直筒长裤", "HKCWCC: boys’ winter white long-sleeved shirt and grey straight-cut long trousers")}</a></li><li><a href="https://www.hkcwcc.edu.hk/en/school-uniform" target="_blank" rel="noopener">${L("香港中國婦女會中學：女生夏季白色恤衫連身裙、紅腰帶", "香港中国妇女会中学：女生夏季白色衬衫连衣裙、红腰带", "HKCWCC: girls’ summer white shirt dress, red belt")}</a></li><li><a href="https://www.sja.edu.hk/download/Resource/fileDoc/%E5%AD%B8%E6%A0%A1%E8%A8%93%E8%BC%94%E5%B0%8E%E6%94%BF%E7%AD%96%E5%8F%8A%E7%A8%8B%E5%BA%8F2025Updated_24_9_2025.pdf" target="_blank" rel="noopener">${L("聖貞德中學：初中夏季淺藍條紋裙、領呔、白襪、深褐色皮鞋（第 36–37、39 頁）", "圣贞德中学：初中夏季浅蓝条纹裙、领带、白袜、深褐色皮鞋（第 36–37、39 页）", "St. Joan of Arc: junior summer light-blue striped dress, tie, white socks, dark-brown shoes (pp. 36–37, 39)")}</a></li></ul></section><section class="teacher-section"><h3>${L("設計參考", "设计参考", "Design references")}</h3><ul><li><a href="https://www.unesco.org/en/articles/ai-competency-framework-students" target="_blank" rel="noopener">UNESCO (2024) · AI competency framework for students</a></li><li><a href="https://www.unicef.org/innocenti/reports/policy-guidance-ai-children" target="_blank" rel="noopener">UNICEF · Guidance on AI and children, version 3.0</a></li></ul><p>${L("這些框架支持以人為本、公平、私隱和共融的設計方向；不代表任何機構認證或代言本遊戲。", "这些框架支持以人为本、公平、隐私和共融的设计方向；不代表任何机构认证或代言本游戏。", "These frameworks inform the human-centred, fair, private and inclusive design direction. They do not certify or endorse this game.")}</p></section>`;
    $("modal-content").insertAdjacentHTML(
      "afterbegin",
      `<div class="teacher-section"><h3>${L("五層校園的課節安排", "五层校园的课节安排", "Planning a five-floor lesson")}</h3><p>${L("四宗 AI 倫理案件仍是語言教育核心。39 題跨科選擇題提供延伸探索及形成性回饋，不代表完整學科掌握。短課節可選 20–30 分鐘核心路線，並在未取得 100 星前反思；完整校園預計 45–75 分鐘，需試玩驗證。星星是進度紀錄，並非品格或能力排名。", "四宗 AI 伦理案件仍是语言教育核心。39 题跨科选择题提供延伸探索及形成性反馈，不代表完整学科掌握。短课节可选 20–30 分钟核心路线，并在未取得 100 星前反思；完整校园预计 45–75 分钟，需要试玩验证。星星是进度记录，并非品格或能力排名。", "The four AI ethics cases remain the language-education core. The 39 subject questions offer extension and formative feedback, not evidence of full subject mastery. A short lesson can use a 20–30 minute core route, with reflection before 100 stars. A full campus run is estimated at 45–75 minutes and needs pilot testing. Stars track progress, not character or ability.")}</p><p>${L("尚未以學生試玩證明普遍學習成效；請在實施前檢視內容、安排支援並收集前後表現與學生意見。", "尚未以学生试玩证明普遍学习成效；请在实施前检查内容、安排支持并收集前后表现与学生意见。", "General learning effectiveness has not been established through learner trials. Review the content, arrange support and collect before-and-after reasoning and learner feedback.")}</p></div>`,
    );
  }
  function renderSettings() {
    heading(
      L("個人偏好", "个人偏好", "YOUR PREFERENCES"),
      L("設定", "设置", "Settings"),
    );
    $("modal-content").innerHTML =
      `<div class="setting-row"><div><strong>${L("較大文字", "较大文字", "Larger text")}</strong><p>${L("放大對話、證據與教學回饋", "放大对话、证据与教学反馈", "Enlarge dialogue, clues and feedback")}</p></div><button class="secondary" data-action="large" aria-pressed="${state.large}">${state.large ? L("已開啟", "已开启", "On") : L("已關閉", "已关闭", "Off")}</button></div><div class="setting-row"><div><strong>${L("我的校園造型", "我的校园造型", "My campus appearance")}</strong><p>${L("隨時更換角色性別、校服、髮型和膚色", "随时更换角色性别、校服、发型和肤色", "Change character gender, uniform, hair and skin tone anytime")}</p></div><button class="secondary" data-action="customize">${L("更換", "更换", "Change")}</button></div><div class="setting-row"><div><strong>${L("本機遊戲進度", "本机游戏进度", "Local game progress")}</strong><p>${L("清除造型、案件和反思；適合共享裝置", "清除造型、案件和反思；适合共享设备", "Clear appearance, cases and reflection on a shared device")}</p></div><button class="secondary danger" data-action="reset-confirm">${L("清除…", "清除…", "Clear…")}</button></div><p class="small-note">${L("語言可使用頁首選單切換。切換不會重設進度。瀏覽器的減少動態效果設定亦會受到尊重。", "语言可使用页首菜单切换。切换不会重置进度。浏览器的减少动态效果设置也会受到尊重。", "Switch language using the header menu without resetting progress. The interface respects the browser’s reduced-motion preference.")}</p>`;
    $("modal-content").insertAdjacentHTML(
      "afterbegin",
      `<div class="setting-row"><div><strong>${L("行動簡報", "行动简报", "Mission briefing")}</strong><p>${L("重溫角色、校園路線及星星規則", "重温角色、校园路线及星星规则", "Revisit your role, campus route and star rules")}</p></div><button class="secondary" data-action="replay-prologue">${L("重播序章", "重播序章", "Replay introduction")}</button></div>`,
    );
    $("modal-content").insertAdjacentHTML("afterbegin", `<div class="setting-row"><div><strong>${L("班級連線", "班级连接", "Class connection")}</strong><p>${inClass() ? `S${state.student.grade}${state.student.section} · ${esc(state.student.name)}` : L("加入班級，跨裝置同步學習", "加入班级，跨设备同步学习", "Join your class for cross-device learning")}</p></div><button class="secondary" data-action="account">${L("管理", "管理", "Manage")}</button></div><div class="setting-row"><div><strong>${L("教師工作台", "教师工作台", "Teacher workspace")}</strong><p>${L("題庫、班級、Excel 成績", "题库、班级、Excel 成绩", "Questions, classes and Excel reports")}</p></div><button class="secondary" data-action="teacher">${L("開啟", "打开", "Open")}</button></div>`);
  }
  function renderReset() {
    heading(
      L("重設本機進度", "重置本机进度", "RESET LOCAL PROGRESS"),
      L(
        "清除這個瀏覽器的進度？",
        "清除这个浏览器的进度？",
        "Clear progress in this browser?",
      ),
    );
    $("modal-content").innerHTML =
      `<p class="modal-intro">${L("本機案件紀錄、造型和反思將會刪除；班級雲端成績仍會保留，可用恢復碼再次登入。", "本机案件记录、造型和反思将会删除；班级云端成绩仍会保留，可用恢复码再次登录。", "Local cases, appearance and reflection will be removed. Cloud class results are retained; sign in again with your recovery code.")}</p><div class="button-row"><button class="secondary" data-action="cancel-reset">${L("保留進度", "保留进度", "Keep progress")}</button><button class="secondary danger" data-action="reset">${L("確認清除", "确认清除", "Clear progress")}</button></div>`;
  }
  function start() {
    if (!requireLearningSession()) return;
    titleOpen = false;
    state.started = true;
    save();
    closeModal({ resume: true, restoreFocus: false });
    updateChrome();
    engine.setAvatar();
    syncPause();
    if (!state.prologueSeen) {
      openDialogue("prologue");
      return;
    }
    if (dialogueId) {
      renderDialogue();
      $("dialogue-next").focus({ preventScroll: true });
      return;
    }
    $("campus").focus({ preventScroll: true });
    toast(
      L(
        "歡迎來到明澄書院。向右探索，與同學或老師交談。",
        "欢迎来到明澄书院。向右探索，与同学或老师交谈。",
        "Welcome to Ming Ching College. Explore to the right and meet a classmate or teacher.",
      ),
    );
  }
  function advanceCasePhase(n) {
    pstate(activeCase).phase = n;
    save();
    repairFeedback = "";
    renderInvestigation();
  }
  async function action(name) {
    const m = missions.find((m) => m.id === activeCase),
      p = m ? pstate(m.id) : null;
    switch (name) {
      case "teacher": printerSubject = null; showModal("teacher"); break;
      case "teacher-guide": showModal("teacher-guide"); break;
      case "account": showModal("account"); break;
      case "join-class":
      case "resume-class": {
        if (answerPending) break;
        const payload = { classCode: $("class-code").value.trim(), studentNumber: $("class-number").value.trim(), name: $("class-name").value.trim(), recoveryCode: $("class-recovery").value.trim() };
        accountDraft = payload;
        if (!/^[0-9]{1,3}$/.test(payload.studentNumber) || Number(payload.studentNumber) < 1) { cloudError = L("學號請填 1 至 999 的數字。", "学号请填 1 至 999 的数字。", "Use a student number from 1 to 999."); renderAccount(); break; }
        if (!payload.classCode || (name === "join-class" && !payload.name) || (name === "resume-class" && !payload.recoveryCode)) { cloudError = L("請填寫班級代碼、學號，以及姓名或恢復碼。", "请填写班级代码、学号，以及姓名或恢复码。", "Enter the class code, number, and name or recovery code."); renderAccount(); break; }
        answerPending = true;
        try {
          const result = name === "join-class" ? await cloud.join({ classCode: payload.classCode, studentNumber: payload.studentNumber, name: payload.name, grade: state.student.grade, section: state.student.section }) : await cloud.resume({ classCode: payload.classCode, studentNumber: payload.studentNumber, recoveryCode: payload.recoveryCode });
          recoveryCode = result.recoveryCode || "";
          await refreshClass();
          accountDraft = { classCode: payload.classCode, studentNumber: payload.studentNumber, name: payload.name };
          cloudReady = true;
          save(); renderAccount();
        } catch (error) { cloudError = cloud.messageFor(error, state.lang); renderAccount(); }
        finally { answerPending = false; }
        break;
      }
      case "refresh-class":
        clearTimeout(syncTimer);
        cloud.keepServerProgress();
        await refreshClass(); renderAccount(); break;
      case "logout-student":
        clearTimeout(syncTimer);
        await cloud.logout();
        cloudSnapshot = null; recoveryCode = ""; accountDraft = {}; cloudError = "";
        state = { ...fresh(), lang: state.lang, avatar: state.avatar };
        setGradeQuestions(); save(); showModal("avatar"); break;
      case "download-recovery": {
        if (!recoveryCode) break;
        const text = `My AI Campus Life\nClass: ${accountDraft.classCode || ""}\nStudent number: ${state.student.number}\nRecovery code: ${recoveryCode}\nKeep this file private. 請妥善保管。`;
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        const a = document.createElement("a"); a.href = url; a.download = "campus-recovery.txt"; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000); break;
      }
      case "continue":
        if (!state.started) break;
        closeModal({ resume: true, restoreFocus: false });
        titleOpen = false;
        updateChrome();
        syncPause();
        if (!state.prologueSeen) openDialogue("prologue");
        else $("campus").focus({ preventScroll: true });
        break;
      case "new-game":
        showModal("role-choice");
        break;
      case "teacher-entry":
        printerSubject = null;
        showModal("teacher");
        break;
      case "student-entry": {
        if (inClass() || state.cloudStudentId) { clearTimeout(syncTimer); await cloud.logout(); cloudSnapshot = null; recoveryCode = ""; }
        const preferences = {
          lang: state.lang,
          large: state.large,
          avatar: { ...state.avatar },
        };
        state = { ...fresh(), ...preferences };
        setGradeQuestions();
        activeCase = null;
        activeSubject = null;
        activeLevel = "foundation";
        dialogueId = null;
        $("dialogue").hidden = true;
        liveDraft = "";
        save();
        engine.setLocation("corridor");
        engine.setAvatar();
        showModal("avatar");
        break;
      }
      case "customize":
        showModal("avatar");
        break;
      case "start":
        start();
        break;
      case "close":
        closeModal();
        break;
      case "close-dialogue":
        endDialogue();
        break;
      case "dialogue-next":
        nextDialogue();
        break;
      case "replay-prologue":
        titleOpen = false;
        if (!state.started) {
          showModal("avatar");
          break;
        }
        closeModal({ resume: true, restoreFocus: false });
        openDialogue("prologue");
        break;
      case "subjects":
        showModal("subjects");
        break;
      case "cases":
        showModal("cases");
        break;
      case "map":
        showModal("map");
        break;
      case "printer":
        printerFloor = window.CAMPUS_LOCATIONS[location]?.floor ?? 0;
        printerSubject = null;
        showModal("printer");
        break;
      case "audio-close":
        setAudioPanel(false); break;
      case "music-toggle": {
        const wasPlaying = audio?.state.music.status === "playing";
        if (!wasPlaying) { await audio?.unlock(); if (audio?.state.settings.musicVolume === 0) audio.setSettings({musicVolume:0.4}); audio?.setSettings({muted:false}); }
        audio?.setMusicPlaying(!wasPlaying);
        renderAudioPanel(); break;
      }
      case "voice-test":
        await audio?.unlock(); audio?.tryVoice(state.lang); break;
      case "voice-replay":
        await audio?.unlock(); audio?.replay(); break;
      case "audio-mute":
        audio?.setSettings({muted:!audio.state.settings.muted}); break;
      case "settings":
        showModal("settings");
        break;
      case "journal":
        showModal("journal");
        break;
      case "visit-gate":
        if (!state.started) break;
        closeModal({ resume: true, restoreFocus: false });
        engine.setLocation("corridor");
        openDialogue("exit");
        break;
      case "subject-submit": {
        const room = subjects.find((r) => r.id === activeSubject);
        const level = room?.levels.find((l) => l.id === activeLevel);
        if (!level) break;
        const answer = subjectState(room.id, level.id);
        if (answer.choice === null) break;
        if (answerPending || !requireLearningSession()) break;
        answerPending = true;
        const before = progress().exitUnlocked;
        let newlyCompleted = false;
        const choice = answer.choice;
        try {
          const response = inClass() ? await submitCloud("subject", { questionId: level.id, revision: level.revision, optionId: level.options[choice].id }) : { correct: level.options[choice].correct, feedback: level.options[choice].feedback };
          newlyCompleted = !answer.completed && response.correct;
          if (response.progress) applyCloud(response.progress);
          const current = subjectState(room.id, level.id);
          current.choice = choice; current.feedbackChoice = choice;
          current.feedback = response.feedback; current.correct = response.correct;
          if (!response.progress) current.attempts = Math.min(current.attempts + 1, 9999);
          if (response.correct) { current.completed = true; current.solvedChoice = choice; }
          cloudError = "";
        } finally { answerPending = false; }
        save();
        updateChrome();
        if (modalType === "subject" && activeLevel === level.id) { renderSubject(); $("subject-feedback").tabIndex = -1; $("subject-feedback").focus(); }
        if (!before && progress().exitUnlocked)
          toast(
            L(
              `${exitTarget()} 星達成！地下校門已解鎖。`,
              `${exitTarget()} 星达成！地下校门已解锁。`,
              `${exitTarget()} stars reached! The ground-floor gate is unlocked.`,
            ),
          );
        else if (newlyCompleted)
          announce(
            L(
              `取得 ${level.stars} 顆星`,
              `取得 ${level.stars} 颗星`,
              `${level.stars} stars earned`,
            ),
          );
        break;
      }
      case "subject-retry": {
        const answer = subjectState(activeSubject, activeLevel);
        if (!answer) break;
        answer.choice = null;
        answer.feedbackChoice = null;
        save();
        renderSubject();
        $("modal-content")
          .querySelector('input[name="subject-answer"]')
          ?.focus();
        break;
      }
      case "evidence-next":
        if (p.seen.length >= 2) advanceCasePhase(1);
        break;
      case "decision-submit":
        if (p.choice !== null) {
          if (p.firstChoice === null) p.firstChoice = p.choice;
          advanceCasePhase(2);
        }
        break;
      case "back-evidence":
        advanceCasePhase(0);
        break;
      case "back-decision":
        advanceCasePhase(1);
        break;
      case "to-repair":
        advanceCasePhase(3);
        break;
      case "repair-submit": {
        if (p.repairChoice === null || answerPending || !requireLearningSession()) break;
        answerPending = true;
        let accepted = false;
        try {
          const response = inClass() ? await submitCloud("case", { caseId: m.id, decisionIndex: p.choice, repairIndex: p.repairChoice, seenEvidence: p.seen }) : { correct: m.repair.options[p.repairChoice].correct };
          accepted = response.correct;
          if (response.progress) applyCloud(response.progress);
          else p.repairAttempts++;
        } finally { answerPending = false; }
        if (accepted) {
          p.completed = true;
          p.phase = 4;
          save();
          renderInvestigation();
          updateChrome();
          engine.setAvatar();
          announce(
            L(
              "方案已修正，案件完成",
              "方案已修正，案件完成",
              "Repair accepted. Case complete.",
            ),
          );
        } else {
          repairFeedback = m.repair.options[p.repairChoice].feedback;
          save();
          $("repair-feedback").innerHTML =
            `<div class="feedback consider">${esc(T(repairFeedback))}</div>`;
        }
        break;
      }
      case "finish-case":
        if (missions.every((m) => pstate(m.id).completed)) showModal("journal");
        else {
          closeModal();
          toast(
            L(
              "新的線索在其他地方等着你。",
              "新的线索在其他地方等着你。",
              "More clues are waiting around campus.",
            ),
          );
        }
        break;
      case "review-case":
        showModal("review");
        break;
      case "check-transfer": {
        if (answerPending || !requireLearningSession()) break;
        if (!missions.every((mission) => pstate(mission.id).completed)) break;
        if (state.transferChoice === null) {
          $("transfer-feedback").textContent = L(
            "請先選擇一個做法。",
            "请先选择一个做法。",
            "Choose a response first.",
          );
          break;
        }
        const o = window.TRANSFER_CONTENT.options[state.transferChoice];
        if (inClass()) {
          answerPending = true;
          try { const result = await submitCloud("transfer", { optionId: String(state.transferChoice) }); applyCloud(result.progress); }
          finally { answerPending = false; }
        }
        state.transferDone = o.correct;
        state.transferFeedbackChoice = state.transferChoice;
        if (o.correct) {
          state.transferAwarded = true;
          state.transferAwardChoice = state.transferChoice;
        }
        save();
        renderJournal();
        updateChrome();
        $("transfer-feedback").innerHTML =
          `<div class="feedback ${o.correct ? "" : "consider"}">${esc(T(o.feedback))}</div>`;
        $("transfer-feedback").tabIndex = -1;
        $("transfer-feedback").focus();
        if (o.correct && progress().exitUnlocked)
          toast(
            L(
              "校門已解鎖！可前往地下完成校園旅程。",
              "校门已解锁！可前往地下完成校园旅程。",
              "The gate is unlocked! Finish your campus journey on the ground floor.",
            ),
          );
        break;
      }
      case "copy-prompt":
        try {
          await navigator.clipboard.writeText(prompt);
          toast(
            L(
              "提示已複製。請在所選 AI 工具中執行。",
              "提示已复制。请在所选 AI 工具中执行。",
              "Prompt copied. Run it in your chosen AI tool.",
            ),
          );
        } catch {
          toast(
            L(
              "請展開完整提示並手動複製。",
              "请展开完整提示并手动复制。",
              "Expand the full prompt and copy it manually.",
            ),
          );
        }
        break;
      case "large":
        state.large = !state.large;
        save();
        updateChrome();
        renderSettings();
        break;
      case "reset-confirm":
        showModal("reset");
        break;
      case "cancel-reset":
        showModal("settings");
        break;
      case "reset":
        if (inClass() || state.cloudStudentId) { clearTimeout(syncTimer); await cloud.logout(); cloudSnapshot = null; recoveryCode = ""; }
        const lang = state.lang;
        titleOpen = true;
        state = fresh();
        setGradeQuestions();
        state.lang = lang;
        activeCase = null;
        activeSubject = null;
        activeLevel = "foundation";
        dialogueId = null;
        $("dialogue").hidden = true;
        liveDraft = "";
        save();
        engine.setLocation("corridor");
        closeModal();
        updateChrome();
        syncPause();
        break;
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.action) {
      if (b.disabled) return;
      const pending = action(b.dataset.action);
      if (pending?.then) {
        b.disabled = true;
        pending.catch(error => { cloudError = cloud?.messageFor(error, state.lang) || L("操作未完成，請再試。", "操作未完成，请重试。", "The action did not complete. Try again."); toast(cloudError); updateSaveLabel(); }).finally(() => { if (b.isConnected) b.disabled = false; });
      }
    }
    if (b.dataset.mapFloor !== undefined) chooseMapFloor(b.dataset.mapFloor, true);
    if (b.dataset.travel) {
      if (!locations[b.dataset.travel]) return;
      if (!state.started) {
        showModal("avatar");
        return;
      }
      if (dialogueId) endDialogue();
      closeModal({ resume: true, restoreFocus: false });
      engine.setLocation(b.dataset.travel);
      $("campus").focus({ preventScroll: true });
      toast(locations[b.dataset.travel]());
    }
    if (b.dataset.level) {
      const room = subjects.find((r) => r.id === activeSubject);
      if (!room?.levels.some((level) => level.id === b.dataset.level)) return;
      activeLevel = b.dataset.level;
      renderSubject();
      $("modal-content").scrollTop = 0;
      $("modal-content")
        .querySelector(`[data-level="${activeLevel}"]`)
        ?.focus();
    }
    if (b.dataset.gender !== undefined) {
      if (!AVATAR_GENDERS.includes(b.dataset.gender)) return;
      state.avatar = normaliseAvatar({ ...state.avatar, gender: b.dataset.gender });
      save();
      renderAvatar();
      engine.setAvatar();
      $("modal-content")
        .querySelector(`[data-gender="${state.avatar.gender}"]`)
        ?.focus({ preventScroll: true });
    }
    for (const k of ["uniform", "hair", "skin"])
      if (b.dataset[k] !== undefined) {
        const value = Number(b.dataset[k]);
        if (!Number.isInteger(value) || value < 0 ||
          (k === "uniform" && !AVATAR_UNIFORMS[state.avatar.gender].includes(value)) ||
          (k === "hair" && value > 1) || (k === "skin" && value > 2)) return;
        state.avatar[k] = value;
        save();
        renderAvatar();
        engine.setAvatar();
        $("modal-content")
          .querySelector(`[data-${k}="${state.avatar[k]}"]`)
          ?.focus({ preventScroll: true });
      }
  });
  document.addEventListener("change", (e) => {
    const n = e.target.name;
    if (e.target.id === "student-grade" && !inClass() && !state.started) { state.student.grade = Number(e.target.value); setGradeQuestions(); save(); renderAvatar(); }
    if (e.target.id === "student-section" && !inClass() && !state.started) { state.student.section = e.target.value; save(); renderAvatar(); }
    if (n === "subject-answer") {
      const answer = subjectState(activeSubject, activeLevel);
      if (!answer) return;
      const level = subjects.find(room => room.id === activeSubject)?.levels.find(item => item.id === activeLevel);
      answer.choice = validChoice(Number(e.target.value), level?.options.length || 0);
      answer.feedbackChoice = null;
      save();
      $("subject-submit").disabled = answer.choice === null;
      $("subject-feedback").textContent = "";
    }
    if (n === "decision") {
      pstate(activeCase).choice = Number(e.target.value);
      save();
      $("decision-submit").disabled = false;
    }
    if (n === "repair") {
      pstate(activeCase).repairChoice = Number(e.target.value);
      save();
      $("repair-submit").disabled = false;
    }
    if (n === "transfer") {
      state.transferChoice = Number(e.target.value);
      state.transferDone = false;
      state.transferFeedbackChoice = null;
      save();
      $("transfer-feedback").textContent = "";
    }
  });
  document.addEventListener("input", (e) => {
    if (["musicVolume", "voiceVolume"].includes(e.target.dataset.volume)) {
      const volume = Math.max(0, Math.min(100, Number(e.target.value)));
      audio?.setSettings({ [e.target.dataset.volume]:volume/100 });
      const output = e.target.parentElement.querySelector("output");
      if (output) output.textContent = `${volume}%`;
    }
    if (e.target.dataset.account) accountDraft[e.target.dataset.account] = e.target.value;
    if (e.target.id === "student-name" && !inClass()) { state.student.name = e.target.value.slice(0,80); save(); }
    if (e.target.id === "student-number" && !inClass()) { state.student.number = e.target.value.slice(0,16); save(); }
    if (e.target.id === "reflection") {
      state.reflection = e.target.value.slice(0, 1200);
      save();
    }
    if (e.target.id === "live-output") liveDraft = e.target.value;
  });
  $("language").addEventListener("change", (e) => {
    audio?.stopVoice();
    state.lang = e.target.value;
    save();
    engine.setLanguage(state.lang);
    updateChrome();
    if (dialogueId) renderDialogue();
    if (panelOpen) renderModal();
    announce(
      L("已切換為繁體中文", "已切换为简体中文", "Language changed to English"),
    );
  });
  // An actual pointer or keyboard action enables browser audio; loading a page stays silent.
  const unlockAudio = () => { if (audio && !audio.state.unlocked) void audio.unlock(); };
  document.addEventListener("pointerdown", unlockAudio, {capture:true});
  document.addEventListener("keydown", unlockAudio, {capture:true});
  if ($("audio-button")) $("audio-button").onclick = () => setAudioPanel(!audioPanelOpen);
  $("settings-button").onclick = () => showModal("settings");
  $("teacher-button").onclick = () => { printerSubject = null; showModal("teacher"); };
  if ($("map-button")) $("map-button").onclick = () =>
    state.started ? showModal("map") : showModal("avatar");
  $("journal-button").onclick = () => showModal("journal");
  $("close-modal").onclick = closeModal;
  $("home-brand").onclick = (e) => {
    e.preventDefault();
    closeModal({ restoreFocus: false });
    endDialogue();
    titleOpen = true;
    updateChrome();
    syncPause();
  };
  if ($("interact")) $("interact").onclick = () => {
    if (!state.started) return showModal("avatar");
    engine.interact();
    if (!dialogueId && !panelOpen) $("campus").focus({ preventScroll: true });
  };
  for (const [id, direction] of [
    ["left", -1],
    ["right", 1],
  ]) {
    const el = $(id);
    if (!el) continue;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!state.started) return;
      el.setPointerCapture(e.pointerId);
      $("campus").focus({ preventScroll: true });
      engine.move(direction);
    });
    el.addEventListener("pointerup", () => engine.move(0));
    el.addEventListener("pointercancel", () => engine.move(0));
    el.addEventListener("lostpointercapture", () => engine.move(0));
    el.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        engine.move(direction);
      }
    });
    el.addEventListener("keyup", () => engine.move(0));
    el.addEventListener("blur", () => engine.move(0));
  }
  $("fullscreen-button").onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.querySelector(".game-frame").requestFullscreen();
    } catch {
      toast(
        L(
          "這個瀏覽器未能切換全螢幕",
          "这个浏览器未能切换全屏",
          "Fullscreen is unavailable in this browser",
        ),
      );
    }
  };
  document.addEventListener("keydown", (e) => {
    const floorButton = e.target?.closest?.("[data-map-floor]");
    if (modalType === "map" && floorButton && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const floors = [...new Set(Object.values(window.CAMPUS_LOCATIONS).map(meta => meta.floor))].sort((a, b) => b - a);
      const current = floors.indexOf(Number(floorButton.dataset.mapFloor));
      const next = e.key === "Home" ? 0 : e.key === "End" ? floors.length - 1 : (current + (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) + floors.length) % floors.length;
      chooseMapFloor(floors[next], true);
      return;
    }
    if (e.key !== "Escape") return;
    if (audioPanelOpen) { e.preventDefault(); setAudioPanel(false); return; }
    if (panelOpen) {
      e.preventDefault();
      closeModal();
    } else if (dialogueId) endDialogue();
  });
  document.addEventListener("visibilitychange", syncPause);
  window.addEventListener("pagehide", (e) => {
    save();
    if (!e.persisted) { engine.destroy(); void audio?.dispose(); }
  });
  window.addEventListener("pageshow", syncPause);
  window.addEventListener("campus-cloud-state", updateSaveLabel);
  window.addEventListener("online", () => { if (inClass() && !cloud.state.conflict) queueCloudSave(); });
  updateChrome();
  syncPause();
  initialiseCloud();
})();
