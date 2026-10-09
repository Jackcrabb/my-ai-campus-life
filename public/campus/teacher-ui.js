/* Server-authorized teacher workspace, mounted inside the game's existing panel. */
(() => {
  'use strict';
  const mounted = new WeakMap();
  const locales = ['zh', 'cn', 'en'];
  const localeNames = { zh: '繁體中文', cn: '简体中文', en: 'English' };
  const headers = ['班別', '學號', '學生姓名', '學科得分'];
  const subjects = [
    ['playground', '體育', '体育', 'Physical education'], ['hall', '公民、經濟與社會', '公民、经济与社会', 'Citizenship, economics and society'],
    ['chinese', '中文', '中文', 'Chinese'], ['english', '英文', '英文', 'English'], ['maths', '數學', '数学', 'Mathematics'],
    ['chemistry', '科學（化學主題）', '科学（化学主题）', 'Science (chemistry)'], ['geography', '地理', '地理', 'Geography'],
    ['computer', '電腦與資訊科技', '电脑与信息科技', 'Computer and ICT'], ['history', '中史與歷史', '中史与历史', 'Chinese history and history'],
    ['art', '視覺藝術', '视觉艺术', 'Visual arts'], ['music', '音樂', '音乐', 'Music'], ['library', '圖書館研習', '图书馆研习', 'Library inquiry'],
    ['rooftop', '環境研習', '环境研习', 'Environmental inquiry'],
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const blank = () => ({ zh: '', cn: '', en: '' });
  const copy = value => JSON.parse(JSON.stringify(value));
  function resultSheets(results, lang = 'zh') {
    return results.map(result => {
      const id = result.subjectId || result.rows?.[0]?.subjectId || 'results';
      const label = subjects.find(subject => subject[0] === id);
      return { name: label ? label[lang === 'en' ? 3 : lang === 'cn' ? 2 : 1] : id,
        rows: [headers.slice(), ...(result.rows || []).map(row => [row.className, String(row.studentNumber ?? ''), row.studentName, row.percent === null || row.percent === undefined ? null : Number(row.percent)])] };
    });
  }
  class TeacherWorkspace {
    constructor(options) {
      this.container = options.container;
      this.lang = locales.includes(options.lang) ? options.lang : 'zh';
      this.onClose = options.onClose || (() => {});
      this.onChange = options.onChange || (() => {});
      this.abort = new AbortController();
      this.requestId = 0;
      this.destroyed = false;
      this.state = { session: null, tab: options.subjectId ? 'results' : 'classes', classes: [], classId: '', subjectId: subjects.some(s => s[0] === options.subjectId) ? options.subjectId : 'chinese', grade: 2, assignments: [], assignmentId: '', results: null, questions: [], editing: null, editLocale: this.lang, confirm: null, busy: false, error: '', notice: '' };
      this.clickHandler = event => this.click(event);
      this.submitHandler = event => this.submit(event);
      this.changeHandler = event => this.change(event);
      this.container.addEventListener('click', this.clickHandler);
      this.container.addEventListener('submit', this.submitHandler);
      this.container.addEventListener('change', this.changeHandler);
      this.refresh();
    }
    L(zh, cn, en) { return this.lang === 'en' ? en : this.lang === 'cn' ? cn : zh; }
    text(value) { return typeof value === 'string' ? value : value?.[this.lang] || value?.zh || value?.en || ''; }
    levelName(id) { return id === 'foundation' ? this.L('基礎','基础','Foundation') : id === 'application' ? this.L('應用','应用','Application') : id === 'challenge' ? this.L('挑戰','挑战','Challenge') : id; }
    subjectName(id) { const item = subjects.find(s => s[0] === id); return item ? item[this.lang === 'en' ? 3 : this.lang === 'cn' ? 2 : 1] : id; }
    async api(path, method = 'GET', body) {
      const response = await fetch('/api/campus' + path, { method, credentials: 'same-origin', signal: this.abort.signal,
        headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      let data;
      try { data = await response.json(); } catch { throw new Error(this.L('伺服器暫時未能回應，請稍後再試。', '服务器暂时未能响应，请稍后重试。', 'The server could not respond. Please try again.')); }
      if (!response.ok) {
        const error = new Error(data.error?.message || this.L('操作未完成。', '操作未完成。', 'The action was not completed.'));
        error.code = data.error?.code; error.status = response.status;
        throw error;
      }
      return data;
    }
    async run(work) {
      if (this.state.busy || this.destroyed) return;
      this.state.busy = true; this.state.error = ''; this.state.notice = ''; this.render();
      try { await work(); }
      catch (error) {
        if (error.name !== 'AbortError') {
          this.state.error = error.code === 'QUESTION_CONFLICT'
            ? this.L('題目已被更新。請保留自己的草稿，重新載入最新版本再儲存。', '题目已被更新。请保留自己的草稿，重新加载最新版本再保存。', 'This question changed elsewhere. Keep your draft and reload the latest version before saving.')
            : this.errorMessage(error);
          if (error.status === 401 && this.state.session) this.state.session.unlocked = false;
          if (error.code === 'TEACHER_FORBIDDEN' && this.state.session) { this.state.session.allowed = false; this.state.session.unlocked = false; }
        }
      } finally { this.state.busy = false; if (!this.destroyed) this.render(); }
    }
    errorMessage(error) {
      const messages = {
        INVALID_PIN: ['PIN 不正確，請重新輸入。','PIN 不正确，请重新输入。','The PIN is incorrect. Please try again.'],
        TEACHER_LOCKED: ['請重新解鎖教師工作台。','请重新解锁教师工作台。','Unlock the teacher workspace again.'],
        TEACHER_FORBIDDEN: ['請使用獲授權的教師帳戶登入。','请使用获授权的教师账户登录。','Sign in with an authorized teacher account.'],
        RATE_LIMITED: ['嘗試次數太多，請稍後再試。','尝试次数太多，请稍后重试。','Too many attempts. Please try again later.'],
        EMPTY_QUESTION_BANK: ['請先發佈此年級的題目，再建立新活動。','请先发布此年级的题目，再建立新活动。','Publish questions for this grade before starting a new activity.'],
        TEACHER_PIN_NOT_CONFIGURED: ['教師工作台尚未完成設定。','教师工作台尚未完成设置。','The teacher workspace is not configured yet.'],
        CLASS_NOT_FOUND: ['找不到此班級，請重新載入班級列表。','找不到此班级，请重新加载班级列表。','Class not found. Reload the class list.'],
        QUESTION_TEXT: ['請檢查三種語言的文字欄位及長度。','请检查三种语言的文字字段及长度。','Check text fields and lengths in all three languages.'],
        QUESTION_RANGE: ['請檢查年級及星章數目。','请检查年级及星章数量。','Check the grade and star count.'],
        QUESTION_SUBJECT: ['請選擇有效學科。','请选择有效学科。','Choose a valid subject.'],
        QUESTION_ANSWER: ['請保留一個正確答案。','请保留一个正确答案。','Choose exactly one correct answer.'],
        INVALID_YEAR: ['請使用 2026-27 這類學年格式。','请使用 2026-27 这类学年格式。','Use a school year such as 2026-27.'],
        CORE_EVENT: ['核心 AI 學習事件由課程內容管理。','核心 AI 学习事件由课程内容管理。','Core AI learning events are maintained with the course content.'],
      };
      const values = messages[error.code];
      return values ? this.L(...values) : error.message;
    }
    async refresh() {
      await this.run(async () => {
        this.state.session = await this.api('/teacher/session');
        if (this.state.session.allowed && this.state.session.unlocked) { await this.loadClasses(); await this.loadTab(); }
      });
    }
    async loadClasses() {
      this.state.classes = (await this.api('/teacher/classes')).classes || [];
      if (!this.state.classes.some(item => item.id === this.state.classId)) this.state.classId = this.state.classes[0]?.id || '';
    }
    async loadTab() {
      const stamp = ++this.requestId;
      if (this.state.tab === 'questions') {
        const params = new URLSearchParams({ grade: this.state.grade, subjectId: this.state.subjectId });
        const data = await this.api('/teacher/questions?' + params);
        if (stamp === this.requestId) this.state.questions = data.questions || [];
      } else if (this.state.tab === 'results' && this.state.classId) {
        const classId = this.state.classId;
        const history = await this.api('/teacher/classes/' + encodeURIComponent(classId) + '/assignments');
        if (stamp !== this.requestId) return;
        this.state.assignments = history.assignments || [];
        if (!this.state.assignments.some(item => item.id === this.state.assignmentId)) this.state.assignmentId = history.activeAssignmentId || '';
        const params = new URLSearchParams({ classId, subjectId: this.state.subjectId });
        if (this.state.assignmentId) params.set('assignmentId', this.state.assignmentId);
        const result = await this.api('/teacher/results?' + params);
        if (stamp === this.requestId) this.state.results = result;
      }
    }
    option(value, label, selected) { return `<option value="${esc(value)}"${String(value) === String(selected) ? ' selected' : ''}>${esc(label)}</option>`; }
    selectSubjects(value, name = 'subjectId') { return `<select name="${name}">${subjects.map(item => this.option(item[0], this.subjectName(item[0]), value)).join('')}</select>`; }
    message() {
      return `${this.state.error ? `<p class="ct-message ct-error" role="alert">${esc(this.state.error)}</p>` : ''}${this.state.notice ? `<p class="ct-message" role="status">${esc(this.state.notice)}</p>` : ''}${this.state.busy ? `<p class="ct-loading" role="status">${this.L('處理中…', '处理中…', 'Working…')}</p>` : ''}`;
    }
    render() {
      if (this.destroyed) return;
      const session = this.state.session;
      const unlocked = Boolean(session?.allowed && session?.unlocked);
      this.container.innerHTML = `<section class="campus-teacher" aria-busy="${this.state.busy}"><header class="ct-header"><div><span class="ct-eyebrow">${this.L('我的AI校園生活', '我的AI校园生活', 'My AI Campus Life')}</span><h2>${this.L('教師工作台', '教师工作台', 'Teacher workspace')}</h2></div><div class="ct-actions">${unlocked ? `<button data-ct="lock" class="ct-quiet">${this.L('鎖定', '锁定', 'Lock')}</button>` : ''}<button data-ct="close" class="ct-close" aria-label="${this.L('返回校園', '返回校园', 'Return to campus')}">×</button></div></header>${this.message()}${unlocked ? `<nav class="ct-tabs" aria-label="${this.L('教師工具', '教师工具', 'Teacher tools')}">${[['classes', this.L('班級管理', '班级管理', 'Classes')], ['results', this.L('成績記錄', '成绩记录', 'Results')], ['questions', this.L('題庫及工作紙', '题库及工作纸', 'Questions')]].map(([id, title]) => `<button data-ct="tab" data-tab="${id}" aria-current="${this.state.tab === id ? 'page' : 'false'}">${title}</button>`).join('')}</nav><div class="ct-body">${this.state.confirm ? this.confirmView() : this.state.tab === 'classes' ? this.classesView() : this.state.tab === 'results' ? this.resultsView() : this.questionsView()}</div>` : this.loginView()}</section>`;
      if (this.state.busy) this.container.querySelectorAll('button:not([data-ct="close"]),input,select,textarea').forEach(control => { control.disabled = true; });
    }
    loginView() {
      const session = this.state.session;
      if (!session) return `<div class="ct-empty">${this.L('正在檢查教師權限…', '正在检查教师权限…', 'Checking teacher access…')}${this.state.error ? `<button data-ct="refresh">${this.L('重試','重试','Retry')}</button>` : ''}</div>`;
      if (!session.allowed) {
        const href = typeof session.signInUrl === 'string' && !/^javascript:/i.test(session.signInUrl.trim()) ? session.signInUrl : '/';
        return `<div class="ct-access"><h3>${this.L('以教師身分登入', '以教师身份登录', 'Sign in as a teacher')}</h3><p>${this.L('登入獲授權的教師帳戶後，即可管理班級及題目。', '登录获授权的教师账户后，即可管理班级及题目。', 'Use an authorized teacher account to manage classes and questions.')}</p><a class="ct-primary" href="${esc(href)}">${this.L('教師登入', '教师登录', 'Teacher sign-in')}</a><button data-ct="refresh" class="ct-quiet">${this.L('重新檢查登入狀態', '重新检查登录状态', 'Check access again')}</button></div>`;
      }
      return `<div class="ct-access"><h3>${this.L('解鎖教師工作台', '解锁教师工作台', 'Unlock the teacher workspace')}</h3><p>${this.L('請輸入教師 PIN。工作台會在閒置後重新鎖定。', '请输入教师 PIN。工作台会在闲置后重新锁定。', 'Enter your teacher PIN. The workspace locks again when access expires.')}</p><form data-form="unlock"><label>${this.L('教師 PIN', '教师 PIN', 'Teacher PIN')}<input name="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="32" required></label><button class="ct-primary" type="submit">${this.L('解鎖工作台', '解锁工作台', 'Unlock workspace')}</button></form></div>`;
    }
    classesView() {
      const items = this.state.classes;
      return `<div class="ct-section-heading"><div><h3>${this.L('你的班級', '你的班级', 'Your classes')}</h3><p>${this.L('將加入代碼交給相應班別的學生。', '将加入代码交给相应班别的学生。', 'Share each join code with students in that class.')}</p></div><span class="ct-count">${items.length}</span></div>${items.length ? `<div class="ct-class-grid">${items.map(item => `<article class="ct-class"><div class="ct-class-title"><strong>${esc(item.label)}</strong><span>${esc(item.schoolYear)}</span></div><span class="ct-field-label">${this.L('班級加入代碼', '班级加入代码', 'Class join code')}</span><div class="ct-code"><code>${esc(item.classCode)}</code><button data-ct="copy" data-id="${esc(item.id)}" aria-label="${esc(this.L('複製', '复制', 'Copy') + ' ' + item.label)}">${this.L('複製', '复制', 'Copy')}</button></div><div class="ct-actions"><button data-ct="class-results" data-id="${esc(item.id)}">${this.L('查看成績', '查看成绩', 'Results')}</button><button data-ct="assignment" data-id="${esc(item.id)}">${this.L('發佈新活動', '发布新活动', 'New activity')}</button></div></article>`).join('')}</div>` : `<div class="ct-empty"><h4>${this.L('尚未建立班級', '尚未建立班级', 'No classes yet')}</h4><p>${this.L('建立班級後，學生可用加入代碼開始學習。', '建立班级后，学生可用加入代码开始学习。', 'Create classes so students can join using their class code.')}</p></div>`}<details class="ct-create"><summary>${this.L('建立班級', '建立班级', 'Create classes')}</summary><div class="ct-create-grid"><form data-form="class"><label>${this.L('學年', '学年', 'School year')}<input name="schoolYear" value="2026-27" pattern="20[0-9]{2}-[0-9]{2}" required></label><label>${this.L('年級', '年级', 'Grade')}<select name="grade">${[1,2,3,4,5,6].map(n => this.option(n, 'S' + n, 2)).join('')}</select></label><label>${this.L('班別', '班别', 'Section')}<select name="section">${['A','B','C','D'].map(value => this.option(value, value, 'A')).join('')}</select></label><button class="ct-primary">${this.L('建立這一班', '建立这一班', 'Create class')}</button></form><form data-form="seed"><h4>${this.L('一次建立 24 班', '一次建立 24 班', 'Create all 24 classes')}</h4><p>${this.L('中一至中六，每級 A、B、C、D 班。只在按下按鈕後建立。', '中一至中六，每级 A、B、C、D 班。只在按下按钮后建立。', 'S1–S6, sections A–D. Classes are created only when you press this button.')}</p><label>${this.L('學年', '学年', 'School year')}<input name="schoolYear" value="2026-27" pattern="20[0-9]{2}-[0-9]{2}" required></label><button type="submit">${this.L('建立 24 個班級', '建立 24 个班级', 'Create 24 classes')}</button></form></div></details>`;
    }
    resultsView() {
      const result = this.state.results;
      return `<div class="ct-filters"><label>${this.L('班別', '班别', 'Class')}<select name="classId" data-filter>${this.state.classes.map(item => this.option(item.id, item.label, this.state.classId)).join('')}</select></label><label>${this.L('學科', '学科', 'Subject')}${this.selectSubjects(this.state.subjectId).replace('<select ', '<select data-filter ')}</label><label>${this.L('活動', '活动', 'Activity')}<select name="assignmentId" data-filter>${this.state.assignments.map(item => this.option(item.id, item.title, this.state.assignmentId)).join('')}</select></label><button data-ct="export" class="ct-primary"${!this.state.classId ? ' disabled' : ''}>${this.L('下載 Excel', '下载 Excel', 'Download Excel')}</button></div><p class="ct-note">${this.L('學科得分以首次作答計算（百分制）。完成該科前，分數保留空白。Excel 會把各科分成獨立工作表。', '学科得分以首次作答计算（百分制）。完成该科前，分数保留空白。Excel 会把各科分成独立工作表。', 'Scores use first responses on a 0–100 scale. Scores stay blank until the subject is complete. Excel contains a separate sheet for each subject.')}</p>${result?.rows?.length ? `<div class="ct-table-wrap"><table><thead><tr>${[this.L('班別','班别','Class'),this.L('學號','学号','Student number'),this.L('學生姓名','学生姓名','Student name'),this.L('學科得分','学科得分','Subject score')].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${result.rows.map(row => `<tr><td>${esc(row.className)}</td><td>${esc(row.studentNumber)}</td><td>${esc(row.studentName)}</td><td>${row.percent === null || row.percent === undefined ? '—' : esc(Number(row.percent).toFixed(1))}</td></tr>`).join('')}</tbody></table></div>` : `<div class="ct-empty"><h4>${this.L('這裡會顯示學生的學習記錄', '这里会显示学生的学习记录', 'Student learning records will appear here')}</h4><p>${this.L('目前沒有記錄。學生加入班級並作答後，成績才會出現。', '目前没有记录。学生加入班级并作答后，成绩才会出现。', 'There are no records yet. Results appear after students join the class and answer questions.')}</p></div>`}`;
    }
    questionsView() {
      if (this.state.editing) return this.editorView();
      return `<div class="ct-filters"><label>${this.L('年級','年级','Grade')}<select name="grade" data-filter>${[1,2,3,4,5,6].map(n => this.option(n, 'S' + n, this.state.grade)).join('')}</select></label><label>${this.L('學科','学科','Subject')}${this.selectSubjects(this.state.subjectId).replace('<select ', '<select data-filter ')}</label><button data-ct="new-question" class="ct-primary">${this.L('新增題目','新增题目','New question')}</button><button data-ct="print">${this.L('列印工作紙','打印工作纸','Print worksheet')}</button></div><p class="ct-note">${this.L('修改會保留版本記錄。發佈題目後，請到班級管理明確發佈新活動；已開始的活動與成績不會改變。', '修改会保留版本记录。发布题目后，请到班级管理明确发布新活动；已开始的活动与成绩不会改变。', 'Edits keep revision history. After publishing questions, explicitly start a new class activity. Existing activities and results keep their original questions.')}</p><div class="ct-question-list">${this.state.questions.length ? this.state.questions.map(question => `<article class="ct-question"><div><span class="ct-badge">S${question.grade} · ${esc(this.levelName(question.level))} · ${question.stars} ★</span><h4>${esc(this.text(question.title))}</h4><p>${esc(this.text(question.question))}</p><small>${esc(question.id)} · ${this.L('版本','版本','Revision')} ${question.revision || 1} · ${question.status === 'draft' ? this.L('草稿','草稿','Draft') : question.status === 'archived' ? this.L('已封存','已归档','Archived') : this.L('已發佈','已发布','Published')}</small></div><div class="ct-actions">${question.category === 'subject' && question.status !== 'archived' ? `<button data-ct="edit" data-id="${esc(question.id)}">${this.L('編輯','编辑','Edit')}</button><button data-ct="archive" data-id="${esc(question.id)}" class="ct-danger">${this.L('封存','归档','Archive')}</button>` : `<span class="ct-note">${this.L('唯讀','只读','Read only')}</span>`}</div></article>`).join('') : `<div class="ct-empty">${this.L('此年級及學科暫未有題目。','此年级及学科暂未有题目。','No questions for this grade and subject yet.')}</div>`}</div>`;
    }
    editorView() {
      const q = this.state.editing, locale = this.state.editLocale;
      const field = (name, title, value, rows = 2) => `<label>${title}<textarea name="${name}" rows="${rows}" maxlength="4000">${esc(value)}</textarea></label>`;
      return `<form data-form="question" class="ct-editor"><div class="ct-section-heading"><h3>${q.revision ? this.L('編輯題目','编辑题目','Edit question') : this.L('新增題目','新增题目','New question')}</h3><button type="button" data-ct="cancel-edit">${this.L('返回題庫','返回题库','Back to questions')}</button></div><div class="ct-editor-meta"><label>${this.L('年級','年级','Grade')}<select name="grade">${[1,2,3,4,5,6].map(n => this.option(n, 'S'+n, q.grade)).join('')}</select></label><label>${this.L('學科','学科','Subject')}${this.selectSubjects(q.subjectId)}</label><label>${this.L('程度','程度','Level')}<select name="level">${[['foundation',this.L('基礎','基础','Foundation')],['application',this.L('應用','应用','Application')],['challenge',this.L('挑戰','挑战','Challenge')]].map(([value,label]) => this.option(value,label,q.level)).join('')}</select></label><label>${this.L('星章','星章','Stars')}<select name="stars">${[1,2,3].map(n => this.option(n,n,q.stars)).join('')}</select></label><label>${this.L('狀態','状态','Status')}<select name="status">${this.option('draft',this.L('草稿','草稿','Draft'),q.status)}${this.option('published',this.L('已發佈','已发布','Published'),q.status)}</select></label></div><div class="ct-language-tabs" role="group" aria-label="${this.L('題目語言','题目语言','Question language')}">${locales.map(code => `<button type="button" data-ct="edit-locale" data-locale="${code}" aria-pressed="${locale === code}">${localeNames[code]}</button>`).join('')}</div><p class="ct-note">${this.L('三種語言的題目、選項及解釋均須填寫。','三种语言的题目、选项及解释均须填写。','Complete the question, options and explanations in all three languages.')}</p><label>${this.L('題目標題','题目标题','Question title')}<input name="title" maxlength="200" value="${esc(q.title[locale])}"></label>${field('question',this.L('題目','题目','Question'),q.question[locale],3)}<div class="ct-option-editors">${q.options.map((option,index) => `<fieldset><legend><label class="ct-correct"><input type="radio" name="correct" value="${esc(option.id)}"${option.correct ? ' checked' : ''}>${String.fromCharCode(65+index)} · ${this.L('設為正確答案','设为正确答案','Correct answer')}</label></legend>${field('option-'+index,this.L('選項文字','选项文字','Option text'),option.text[locale])}${field('feedback-'+index,this.L('解釋及回饋','解释及反馈','Explanation and feedback'),option.feedback[locale])}</fieldset>`).join('')}</div>${field('takeaway',this.L('學習重點','学习重点','Learning takeaway'),q.takeaway[locale])}<div class="ct-editor-footer"><span>${esc(q.id)}${q.revision ? ' · r'+q.revision : ''}</span><button class="ct-primary" type="submit">${this.L('儲存題目','保存题目','Save question')}</button></div></form>`;
    }
    confirmView() {
      const item = this.state.confirm;
      if (item.type === 'archive') return `<div class="ct-confirm"><h3>${this.L('封存這道題目？','归档这道题目？','Archive this question?')}</h3><p>${this.L('題目將不會加入下一次活動。已發佈的活動與學生記錄會保留。','题目将不会加入下一次活动。已发布的活动与学生记录会保留。','This question will not be included in future activities. Existing activities and student records are retained.')}</p><div class="ct-actions"><button data-ct="cancel-confirm">${this.L('取消','取消','Cancel')}</button><button data-ct="confirm-archive" class="ct-danger">${this.L('確認封存','确认归档','Archive question')}</button></div></div>`;
      const classroom = this.state.classes.find(value => value.id === item.id);
      return `<form data-form="assignment" class="ct-confirm"><h3>${esc(classroom?.label)} · ${this.L('發佈新活動','发布新活动','Publish a new activity')}</h3><p>${this.L('把本年級最新已發佈題目建立為新的班級活動。舊活動及成績會保留，可在成績記錄選擇查看。','把本年级最新已发布题目建立为新的班级活动。旧活动及成绩会保留，可在成绩记录选择查看。','Create a new class activity from the latest published questions for this grade. Previous activities and scores remain available in Results.')}</p><label>${this.L('活動名稱','活动名称','Activity name')}<input name="title" maxlength="120" required></label><div class="ct-actions"><button type="button" data-ct="cancel-confirm">${this.L('取消','取消','Cancel')}</button><button class="ct-primary">${this.L('發佈新活動','发布新活动','Publish activity')}</button></div></form>`;
    }
    captureEditor() {
      const form = this.container.querySelector('form[data-form="question"]');
      if (!form || !this.state.editing) return;
      const data = new FormData(form), q = this.state.editing, locale = this.state.editLocale;
      q.grade = Number(data.get('grade')); q.subjectId = String(data.get('subjectId')); q.roomId = q.subjectId;
      q.level = String(data.get('level')); q.stars = Number(data.get('stars')); q.status = String(data.get('status'));
      for (const key of ['title','question','takeaway']) q[key][locale] = String(data.get(key) || '').trim();
      q.options.forEach((option,index) => { option.text[locale] = String(data.get('option-'+index) || '').trim(); option.feedback[locale] = String(data.get('feedback-'+index) || '').trim(); option.correct = data.get('correct') === option.id; });
    }
    async click(event) {
      const button = event.target.closest('[data-ct]');
      if (!button || !this.container.contains(button)) return;
      const action = button.dataset.ct;
      if (action === 'close') { this.destroy(); this.onClose(); return; }
      if (this.state.busy) return;
      if (action === 'refresh') return this.refresh();
      if (action === 'tab') { this.state.tab = button.dataset.tab; this.state.confirm = null; this.state.editing = null; return this.run(() => this.loadTab()); }
      if (action === 'lock') return this.run(async () => { await this.api('/teacher/lock','POST',{}); this.state.session.unlocked = false; this.state.editing = null; this.state.results = null; this.state.questions = []; this.onChange(); });
      if (action === 'copy') {
        const code = this.state.classes.find(item => item.id === button.dataset.id)?.classCode;
        return this.run(async () => { if (!navigator.clipboard?.writeText) throw new Error(this.L('請選取加入代碼並手動複製。','请选择加入代码并手动复制。','Select the join code and copy it manually.')); await navigator.clipboard.writeText(code); this.state.notice = this.L('已複製加入代碼。','已复制加入代码。','Join code copied.'); });
      }
      if (action === 'class-results') { this.state.classId = button.dataset.id; this.state.assignmentId = ''; this.state.tab = 'results'; return this.run(() => this.loadTab()); }
      if (action === 'assignment' || action === 'archive') { this.state.confirm = { type: action, id: button.dataset.id }; this.render(); return; }
      if (action === 'cancel-confirm') { this.state.confirm = null; this.render(); return; }
      if (action === 'confirm-archive') return this.run(async () => { await this.api('/teacher/questions/'+encodeURIComponent(this.state.confirm.id),'DELETE',{}); this.state.confirm = null; await this.loadTab(); this.onChange(); });
      if (action === 'edit') { const question = this.state.questions.find(item => item.id === button.dataset.id); if (question?.category !== 'subject') return; this.state.editing = copy(question); this.state.editLocale = this.lang; this.render(); return; }
      if (action === 'new-question') {
        this.state.editing = { id: 'q-' + crypto.randomUUID(), grade: this.state.grade, subjectId: this.state.subjectId, roomId: this.state.subjectId, category: 'subject', level: 'foundation', stars: 1, maxScore: 1, status: 'draft', title: blank(), question: blank(), options: ['a','b','c'].map((id,index) => ({id,correct:index === 0,text:blank(),feedback:blank()})), takeaway: blank() };
        this.state.editLocale = this.lang; this.render(); return;
      }
      if (action === 'edit-locale') { this.captureEditor(); this.state.editLocale = button.dataset.locale; this.render(); return; }
      if (action === 'cancel-edit') { this.state.editing = null; this.render(); return; }
      if (action === 'export') return this.run(() => this.exportResults());
      if (action === 'print') this.printWorksheet();
    }
    async change(event) {
      const control = event.target.closest('[data-filter]');
      if (!control || this.state.busy) return;
      this.state[control.name] = control.name === 'grade' ? Number(control.value) : control.value;
      if (control.name === 'classId') this.state.assignmentId = '';
      await this.run(() => this.loadTab());
    }
    async submit(event) {
      const form = event.target.closest('[data-form]');
      if (!form || !this.container.contains(form)) return;
      event.preventDefault();
      if (this.state.busy) return;
      const data = new FormData(form), kind = form.dataset.form;
      if (kind === 'unlock') {
        const pin = String(data.get('pin') || '');
        form.elements.pin.value = '';
        return this.run(async () => { await this.api('/teacher/unlock','POST',{pin}); this.state.session = await this.api('/teacher/session'); if (this.state.session.unlocked) { await this.loadClasses(); await this.loadTab(); } this.onChange(); });
      }
      if (kind === 'seed' || kind === 'class') {
        const body = kind === 'seed' ? {seedDefault:true,schoolYear:String(data.get('schoolYear'))} : {grade:Number(data.get('grade')),section:String(data.get('section')),schoolYear:String(data.get('schoolYear'))};
        return this.run(async () => { await this.api('/teacher/classes','POST',body); await this.loadClasses(); this.state.notice = this.L('班級已建立。','班级已建立。','Classes created.'); this.onChange(); });
      }
      if (kind === 'assignment') { const id = this.state.confirm.id, title = String(data.get('title') || '').trim(); return this.run(async () => { await this.api('/teacher/classes/'+encodeURIComponent(id)+'/assignment','POST',{title}); this.state.confirm = null; await this.loadClasses(); this.state.notice = this.L('新活動已發佈。','新活动已发布。','New activity published.'); this.onChange(); }); }
      if (kind === 'question') {
        this.captureEditor();
        const q = copy(this.state.editing);
        for (const locale of locales) {
          if (![q.title[locale],q.question[locale],q.takeaway[locale],...q.options.flatMap(option => [option.text[locale],option.feedback[locale]])].every(value => String(value || '').trim())) {
            this.state.error = this.L('請完成所有語言欄位：','请完成所有语言字段：','Complete every field in: ') + localeNames[locale]; this.state.editLocale = locale; this.render(); return;
          }
        }
        if (q.options.filter(option => option.correct).length !== 1) { this.state.error = this.L('請選擇一個正確答案。','请选择一个正确答案。','Choose exactly one correct answer.'); this.render(); return; }
        return this.run(async () => {
          const editing = Boolean(q.revision), body = {...q,...(editing ? {expectedRevision:q.revision} : {})};
          await this.api('/teacher/questions'+(editing ? '/'+encodeURIComponent(q.id) : ''),editing ? 'PATCH' : 'POST',body);
          this.state.editing = null; this.state.grade = q.grade; this.state.subjectId = q.subjectId;
          await this.loadTab(); this.state.notice = this.L('題目已儲存。現有活動保持原來版本。','题目已保存。现有活动保持原来版本。','Question saved. Existing activities retain their original version.'); this.onChange();
        });
      }
    }
    async exportResults() {
      if (!window.CampusXlsx) throw new Error(this.L('Excel 匯出工具尚未載入。','Excel 导出工具尚未加载。','The Excel exporter has not loaded.'));
      const all = [];
      for (const [subjectId] of subjects) {
        const params = new URLSearchParams({classId:this.state.classId,subjectId});
        if (this.state.assignmentId) params.set('assignmentId',this.state.assignmentId);
        const data = await this.api('/teacher/results?'+params); all.push({...data,subjectId});
      }
      const classroom = this.state.classes.find(item => item.id === this.state.classId);
      window.CampusXlsx.download(resultSheets(all,this.lang),'campus-'+(classroom?.label || 'class')+'-results.xlsx');
      this.state.notice = this.L('Excel 已準備下載，各科分開工作表。','Excel 已准备下载，各科分开工作表。','Excel is ready to download, with one sheet per subject.');
    }
    printWorksheet() {
      const questions = this.state.questions.filter(q => q.status !== 'archived');
      const sheet = document.createElement('section'); sheet.className = 'ct-print-sheet';
      sheet.innerHTML = `<h1>${esc(this.subjectName(this.state.subjectId))} · S${this.state.grade}</h1><p>${this.L('班別：________　學號：________　姓名：________','班别：________　学号：________　姓名：________','Class: ________　Number: ________　Name: ________')}</p>${questions.map((q,index) => `<article><h2>${index+1}. ${esc(this.text(q.title))}</h2><p>${esc(this.text(q.question))}</p><ol type="A">${q.options.map(option => `<li>${esc(this.text(option.text))}</li>`).join('')}</ol></article>`).join('')}`;
      document.querySelector('.ct-print-sheet')?.remove(); document.body.append(sheet);
      const clear = () => { sheet.remove(); window.removeEventListener('afterprint',clear); };
      window.addEventListener('afterprint',clear,{once:true}); window.print();
    }
    setLanguage(lang) { if (!locales.includes(lang)) return; this.captureEditor(); this.lang = lang; this.state.error = ''; this.state.notice = ''; this.render(); }
    destroy() { this.destroyed = true; this.abort.abort(); this.container.removeEventListener('click',this.clickHandler); this.container.removeEventListener('submit',this.submitHandler); this.container.removeEventListener('change',this.changeHandler); mounted.delete(this.container); }
  }
  function open(options) {
    if (!options?.container || typeof options.container.addEventListener !== 'function') throw new TypeError('Teacher workspace requires a container element.');
    mounted.get(options.container)?.destroy();
    const workspace = new TeacherWorkspace(options); mounted.set(options.container,workspace); return workspace;
  }
  window.CampusTeacher = { open, resultSheets };
})();
