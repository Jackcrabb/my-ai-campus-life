/* Teacher-provided PDFs stay scoped to the student's teacher, grade and floor. */
(() => {
  'use strict';
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const subjects = [
    ['playground',0,'體育','体育','Physical education'], ['hall',0,'公民與社會','公民与社会','Citizenship and society'],
    ['chinese',1,'中文','中文','Chinese'], ['english',1,'英文','英文','English'], ['maths',1,'數學','数学','Mathematics'],
    ['chemistry',2,'科學／化學','科学／化学','Science / chemistry'], ['geography',2,'地理','地理','Geography'], ['computer',2,'電腦','电脑','ICT'],
    ['history',3,'歷史','历史','History'], ['art',3,'視覺藝術','视觉艺术','Visual arts'], ['music',3,'音樂','音乐','Music'],
    ['library',4,'圖書館研習','图书馆研习','Library inquiry'], ['rooftop',4,'環境研習','环境研习','Environmental inquiry'],
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  class Worksheets {
    constructor(options) {
      Object.assign(this, { container: options.container, lang: options.lang || 'zh', teacher: options.mode === 'teacher', floor: Number(options.floor || 0), grade: Number(options.grade || 1), subject: options.subjectId || '', onAccount: options.onAccount, onResults: options.onResults, onScopeChange: options.onScopeChange });
      if (!Number.isInteger(this.floor) || this.floor < 0 || this.floor > 4) this.floor = 0;
      if (!Number.isInteger(this.grade) || this.grade < 1 || this.grade > 6) this.grade = 1;
      if (!this.choices().some(s => s[0] === this.subject)) this.subject = '';
      this.fixedSubject = this.teacher && options.fixedSubject === true && subjects.some(s => s[0] === this.subject);
      this.abort = new AbortController(); this.items = []; this.busy = false; this.error = ''; this.notice = ''; this.selected = null; this.confirmId = ''; this.previewReady = false; this.uploadElement = null;
      this.click = this.click.bind(this); this.submit = this.submit.bind(this); this.change = this.change.bind(this);
      this.container.addEventListener('click', this.click); this.container.addEventListener('submit', this.submit); this.container.addEventListener('change', this.change);
      this.load();
    }
    L(zh,cn,en) { return this.lang === 'en' ? en : this.lang === 'cn' ? cn : zh; }
    choices() { return this.teacher ? (this.fixedSubject ? subjects.filter(s => s[0] === this.subject) : subjects) : subjects.filter(s => s[1] === this.floor); }
    name(id) { const s = subjects.find(item => item[0] === id); return s ? s[this.lang === 'en' ? 4 : this.lang === 'cn' ? 3 : 2] : id; }
    languageName(locale) { return locale === 'zh' ? this.L('繁體中文','繁体中文','Traditional Chinese') : 'English'; }
    files(item) { return (item.files || []).filter(file => ['zh','en'].includes(file.locale) && typeof file.url === 'string' && file.url.startsWith('/api/campus/worksheets/')); }
    async api(path, method = 'GET', body) {
      const multipart = body instanceof FormData;
      const response = await fetch('/api/campus/' + path, { method, credentials: 'same-origin', signal: this.abort.signal, headers: method !== 'GET' && !multipart ? {'content-type':'application/json'} : {}, ...(body ? {body: multipart ? body : JSON.stringify(body)} : {}) });
      let data;
      try { data = await response.json(); } catch { throw new Error(this.L('伺服器暫時未能回應，請再試一次。','服务器暂时无法响应，请重试。','The server could not respond. Please try again.')); }
      if (!response.ok) { const error = new Error(data.error?.message || this.L('未能完成操作，請再試一次。','无法完成操作，请重试。','The request failed. Please try again.')); error.code = data.error?.code; throw error; }
      return data;
    }
    async run(work) {
      if (this.busy || this.destroyed) return;
      this.busy = true; this.error = ''; this.notice = ''; this.render();
      try { await work(); }
      catch (error) { if (!this.destroyed && error.name !== 'AbortError') { this.error = this.message(error); this.needsAccount = error.code === 'STUDENT_SESSION_REQUIRED'; } }
      finally {
        this.busy = false;
        if (!this.destroyed) {
          this.render();
          if (this.error) this.container.querySelector('.ws-error')?.scrollIntoView({block:'nearest'});
        }
      }
    }
    message(error) {
      const messages = {
        STUDENT_SESSION_REQUIRED: ['加入老師的班級後，即可取得該班工作紙。','加入老师的班级后，即可获取该班工作纸。','Join your teacher’s class to access its worksheets.'],
        WORKSHEET_SIZE: ['每份 PDF 不可超過 5 MB；請縮小檔案後再試。','每份 PDF 不可超过 5 MB；请缩小文件后重试。','Each PDF must be 5 MB or smaller. Reduce the file size and try again.'],
        WORKSHEET_FILE: ['請選擇有效的繁中或英文 PDF，亦可同時提供兩份。','请选择有效的繁中或英文 PDF，也可同时提供两份。','Choose a valid Traditional Chinese or English PDF, or both.'],
        WORKSHEET_TITLE: ['請填寫工作紙名稱。','请填写工作纸名称。','Enter a worksheet title.'],
        WORKSHEET_STORAGE: ['工作紙儲存暫時未能使用。已保留上傳表單，請稍後再試。','工作纸存储暂时无法使用。已保留上传表单，请稍后重试。','Worksheet storage is temporarily unavailable. Your upload form is preserved; try again later.'],
        WORKSHEET_NOT_FOUND: ['這份工作紙已不再提供，請重新載入清單。','这份工作纸已不再提供，请重新加载列表。','This worksheet is no longer available. Refresh the list.'],
        TEACHER_LOCKED: ['教師權限已鎖定，請重新輸入 PIN。','教师权限已锁定，请重新输入 PIN。','Teacher access is locked. Unlock the workspace again.'],
      };
      return messages[error.code] ? this.L(...messages[error.code]) : error.message || this.L('連線失敗，請稍後再試。','连接失败，请稍后重试。','Connection failed. Please try again.');
    }
    async refresh() {
      const path = this.teacher ? 'teacher/worksheets?' + new URLSearchParams({ grade: this.grade, ...(this.subject ? {subjectId:this.subject} : {}) }) : 'student/worksheets?floor=' + this.floor;
      const data = await this.api(path);
      if (this.destroyed) return;
      if (!this.teacher && Number.isInteger(data.grade) && data.grade >= 1 && data.grade <= 6) this.grade = data.grade;
      const allowed = new Set(this.choices().map(s => s[0]));
      this.items = (data.worksheets || []).filter(item => allowed.has(item.subjectId) && Number(item.grade) === this.grade);
      this.needsAccount = false;
    }
    load() { return this.run(() => this.refresh()); }
    render() {
      if (this.destroyed) return;
      // Reattach the actual node: browsers do not allow restoring FileList values.
      this.uploadElement = this.container.querySelector('[data-ws-form]') || this.uploadElement;
      const choices = this.choices();
      const visible = this.subject ? this.items.filter(item => item.subjectId === this.subject) : this.items;
      this.previewReady = false;
      this.container.innerHTML = `<section class="worksheet-station" aria-busy="${this.busy}"><p class="ws-description">${this.teacher ? this.L('上傳自己編製或已獲授權的工作紙。繁中及英文可擇一提供，或一起上傳。每份 PDF 上限 5 MB。','上传自行编制或已获授权的工作纸。繁中及英文可选一提供，或一起上传。每份 PDF 上限 5 MB。','Upload worksheets you created or have permission to share. Provide either or both languages. Maximum 5 MB per PDF.') : this.L('選擇本樓層科目及老師提供的語言版本。選定後可預覽、下載或自行開啟列印。','选择本楼层科目及老师提供的语言版本。选定后可预览、下载或自行打开打印。','Choose a subject on this floor and an available language, then preview, download or print.')}</p>
      <div class="ws-filters">${this.teacher ? `<label>${this.L('年級','年级','Grade')}<select data-ws-filter="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}"${n===this.grade?' selected':''}>S${n}</option>`).join('')}</select></label>` : `<span class="ws-grade">S${this.grade} · ${this.L('班級工作紙','班级工作纸','Class worksheets')}</span>`}<label>${this.L('學科','学科','Subject')}<select data-ws-filter="subject">${this.fixedSubject ? '' : `<option value="">${this.L('全部科目','全部科目','All subjects')}</option>`}${choices.map(s=>`<option value="${s[0]}"${s[0]===this.subject?' selected':''}>${esc(this.name(s[0]))}</option>`).join('')}</select></label><button data-ws="refresh">${this.L('重新載入','重新加载','Refresh')}</button></div>
      ${this.busy?`<p class="ws-status" role="status">${this.L('處理中…','处理中…','Working…')}</p>`:''}${this.error?`<p class="ws-error" role="alert">${esc(this.error)}</p>`:''}${this.notice?`<p class="ws-status" role="status">${esc(this.notice)}</p>`:''}${this.needsAccount?`<button data-ws="account">${this.L('連接班級','连接班级','Join your class')}</button>`:''}
      <div class="ws-list">${visible.map(item=>`<article class="ws-card${this.selected?.id===item.id?' is-selected':''}"><p class="ws-meta">S${item.grade} · ${esc(this.name(item.subjectId))} · PDF</p><h3>${esc(item.title)}</h3><div class="ws-languages">${this.files(item).map(file=>`<button data-ws="select" data-id="${esc(item.id)}" data-locale="${file.locale}" aria-pressed="${this.selected?.id===item.id&&this.selected?.locale===file.locale}">${this.languageName(file.locale)}</button>`).join('')}</div>${this.teacher?this.confirmId===item.id?`<div class="ws-delete"><p>${this.L('刪除這份工作紙及已提供的語言版本？','删除这份工作纸及已提供的语言版本？','Delete this worksheet and its available language versions?')}</p><button data-ws="cancel">${this.L('取消','取消','Cancel')}</button><button data-ws="delete" data-id="${esc(item.id)}">${this.L('確認刪除','确认删除','Delete worksheet')}</button></div>`:`<button class="ws-quiet" data-ws="confirm" data-id="${esc(item.id)}">${this.L('刪除工作紙','删除工作纸','Delete worksheet')}</button>`:''}</article>`).join('') || (!this.busy&&!this.error?`<p class="ws-empty">${this.L('老師尚未為此年級及科目提供工作紙。','老师尚未为此年级及科目提供工作纸。','No teacher-provided worksheets are available for this grade and subject yet.')}</p>`:'')}</div>
      ${this.preview()}
      ${this.teacher?'<div data-ws-upload-slot></div>':`<div class="ws-footer"><button data-ws="results">${this.L('教師成績及 Excel','教师成绩及 Excel','Teacher results and Excel')}</button></div>`}</section>`;
      if (this.teacher) {
        const slot = this.container.querySelector('[data-ws-upload-slot]');
        if (this.uploadElement) slot?.replaceWith(this.uploadElement);
        else { if (slot) slot.outerHTML = this.uploadForm(); this.uploadElement = this.container.querySelector('[data-ws-form]'); }
      }
      this.container.querySelectorAll('button,input,select').forEach(node => { node.disabled = this.busy || node.dataset.ws === 'print'; });
      const frame = this.container.querySelector('.ws-pdf');
      if (frame) frame.addEventListener('load', () => {
        if (this.destroyed || this.container.querySelector('.ws-pdf') !== frame) return;
        this.previewReady = true;
        const print = this.container.querySelector('[data-ws="print"]'); if (print) print.disabled = this.busy;
      }, { once: true });
    }
    preview() {
      if (!this.selected) return '';
      const item = this.items.find(row=>row.id===this.selected.id), file = item && this.files(item).find(row=>row.locale===this.selected.locale);
      if (!file) { this.selected=null; return ''; }
      const download = file.url + (file.url.includes('?') ? '&' : '?') + 'download=1';
      return `<section class="ws-preview" aria-label="${this.L('工作紙預覽','工作纸预览','Worksheet preview')}"><p class="ws-meta">${this.L('已選語言','已选语言','Selected language')} · ${this.languageName(file.locale)}</p><h3>${esc(item.title)}</h3><div class="ws-actions"><button data-ws="print" disabled>${this.L('開啟列印','打开打印','Print PDF')}</button><a href="${esc(download)}" download>${this.L('下載 PDF','下载 PDF','Download PDF')}</a><a href="${esc(file.url)}" target="_blank" rel="noopener">${this.L('開啟 PDF','打开 PDF','Open PDF')}</a></div><p class="ws-note">${this.L('待預覽載入後，可按「開啟列印」。若裝置未顯示預覽或列印視窗，請開啟或下載 PDF，再用閱讀器列印。','预览加载后，可按「打开打印」。若设备未显示预览或打印窗口，请打开或下载 PDF，再用阅读器打印。','Print becomes available after the preview loads. If the preview or print dialog does not work on your device, open or download the PDF and print from its viewer.')}</p><iframe class="ws-pdf" src="${esc(file.url)}" title="${esc(item.title)} — ${this.languageName(file.locale)}"></iframe></section>`;
    }
    uploadForm() {
      return `<form class="ws-upload" data-ws-form><h3>${this.L('教師上傳','教师上传','Teacher upload')}</h3><label>${this.L('工作紙名稱','工作纸名称','Worksheet title')}<input name="title" maxlength="160" required placeholder="${this.L('例如：比例與百分率','例如：比例与百分率','For example: Ratios and percentages')}"></label><div class="ws-filters"><label>${this.L('年級','年级','Grade')}<select name="grade">${[1,2,3,4,5,6].map(n=>`<option value="${n}"${n===this.grade?' selected':''}>S${n}</option>`).join('')}</select></label><label>${this.L('學科','学科','Subject')}<select name="subjectId">${this.choices().map(s=>`<option value="${s[0]}"${s[0]===this.subject?' selected':''}>${esc(this.name(s[0]))}</option>`).join('')}</select></label></div><div class="ws-file-fields"><label>${this.languageName('zh')} PDF<input type="file" name="zh" accept="application/pdf,.pdf"></label><label>English PDF<input type="file" name="en" accept="application/pdf,.pdf"></label></div><p class="ws-note">${this.L('至少選一份。每種語言各一份 PDF，每份最多 5 MB。失敗時保留已選檔案，成功後清空。','至少选一份。每种语言各一份 PDF，每份最多 5 MB。失败时保留所选文件，成功后清空。','Choose at least one PDF: one per language, up to 5 MB each. Your selections stay after an error and clear after a successful upload.')}</p><button type="submit">${this.L('上傳工作紙','上传工作纸','Upload worksheet')}</button></form>`;
    }
    click(event) {
      const button=event.target.closest('[data-ws]'); if (!button||this.busy||this.destroyed) return;
      const action=button.dataset.ws;
      if(action==='refresh') return this.load();
      if(action==='account') this.onAccount?.();
      if(action==='results') this.onResults?.();
      if(action==='select') {
        const item=this.items.find(row=>row.id===button.dataset.id);
        if (!item || !this.files(item).some(file=>file.locale===button.dataset.locale)) return;
        this.selected={id:item.id,locale:button.dataset.locale}; this.notice=''; this.render(); this.container.querySelector('.ws-preview')?.scrollIntoView({block:'nearest'});
      }
      if(this.teacher&&action==='confirm') { this.confirmId=button.dataset.id; this.render(); }
      if(action==='cancel') { this.confirmId=''; this.render(); }
      if(this.teacher&&action==='delete'&&this.confirmId===button.dataset.id) return this.run(async()=>{await this.api('teacher/worksheets/'+encodeURIComponent(button.dataset.id),'DELETE',{});this.confirmId='';await this.refresh();});
      if(action==='print'&&this.previewReady&&!button.disabled) {
        try { const win=this.container.querySelector('.ws-pdf')?.contentWindow; if(!win) return; win.focus(); win.print(); }
        catch { this.notice=this.L('請選「開啟 PDF」使用閱讀器的列印功能。','请选择「打开 PDF」使用阅读器的打印功能。','Open the PDF to use its viewer’s Print command.'); this.render(); }
      }
    }
    change(event) {
      const filter=event.target.dataset.wsFilter; if(!filter||this.busy||this.destroyed) return;
      if (filter==='grade') { const grade=Number(event.target.value); if(!this.teacher||!Number.isInteger(grade)||grade<1||grade>6)return;this.grade=grade; }
      else if (filter==='subject') { if(this.fixedSubject&&event.target.value!==this.subject)return;if(event.target.value&&!this.choices().some(s=>s[0]===event.target.value))return;this.subject=event.target.value; }
      else return;
      this.selected=null;
      if(this.teacher) this.onScopeChange?.({grade:this.grade,subjectId:this.subject});
      if(this.teacher) return this.load();
      this.render(); // The student endpoint already returns every permitted subject on this floor.
    }
    async validateUpload(data) {
      if (!String(data.get('title') || '').trim()) throw {code:'WORKSHEET_TITLE'};
      const files=['zh','en'].map(lang=>data.get(lang)).filter(file=>file instanceof File && (file.name || file.size));
      if(!files.length || files.some(file=>!file.size)) throw {code:'WORKSHEET_FILE'};
      if(files.some(file=>file.size>MAX_FILE_BYTES)) throw {code:'WORKSHEET_SIZE'};
      for(const file of files) if((file.type&&file.type!=='application/pdf') || await file.slice(0,5).text()!=='%PDF-') throw {code:'WORKSHEET_FILE'};
    }
    submit(event) {
      if(!event.target.matches('[data-ws-form]')) return; event.preventDefault(); if(this.busy||!this.teacher||this.destroyed) return;
      const form=event.target, data=new FormData(form);
      if(this.fixedSubject) data.set('subjectId',this.subject);
      return this.run(async()=>{
        await this.validateUpload(data);
        if(this.destroyed)return;
        await this.api('teacher/worksheets','POST',data);
        if(this.destroyed)return;
        // Clear only once the server accepted the files; a failed refresh must not encourage a duplicate upload.
        form.reset(); this.grade=Number(data.get('grade'));this.subject=String(data.get('subjectId'));
        this.onScopeChange?.({grade:this.grade,subjectId:this.subject});
        form.elements.namedItem('grade').value=String(this.grade);form.elements.namedItem('subjectId').value=this.subject;
        this.notice=this.L('工作紙已提供給對應年級的班級。','工作纸已提供给对应年级的班级。','Worksheet is available to the matching grade.');
        await this.refresh();
      });
    }
    destroy() {
      this.destroyed=true;this.abort.abort();this.container.removeEventListener('click',this.click);this.container.removeEventListener('submit',this.submit);this.container.removeEventListener('change',this.change);this.uploadElement=null;
    }
  }
  window.CampusWorksheets={open:options=>new Worksheets(options),subjects};
})();
