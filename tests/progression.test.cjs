'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');

// Run the actual application with small DOM/engine adapters. The test-only hook
// is injected into the source in memory; production exposes no state API.
function launch(saved) {
  const elements = new Map();
  const missingElements = new Set();
  let audioOnState = () => {};
  const listeners = {};
  let savedText = saved === undefined ? null : JSON.stringify(saved);
  let engineOptions;
  let talkingId = null;
  const engineLocations = [];
  const createdTags = [];
  const audioLog = { lines:[], stops:0 };
  const teacherMounts = [];
  const audioStub = { state:{unlocked:true,settings:{musicVolume:.25,voiceVolume:.8,muted:false},music:{status:"playing"},voice:{status:"ready"}}, speak(line){ audioLog.lines.push({...line}); this.state.voice = {status:"queued",requestedLocale:{zh:"zh-HK",cn:"zh-CN",en:"en-GB"}[line.locale]}; audioOnState(this.state); }, stopVoice(){ audioLog.stops++; this.state.voice = {...this.state.voice,status:"ready",errorCode:null}; audioOnState(this.state); }, unlock(){return Promise.resolve(true);}, dispose(){} };
  function element(id = '') {
    const handlers = {};
    const classes = new Set();
    return {
      id, handlers, dataset: {}, style: {}, hidden: false, isConnected: true,
      innerHTML: '', textContent: '', classList: {
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
        add(name) { classes.add(name); }, remove(name) { classes.delete(name); },
        contains(name) { return classes.has(name); },
      },
      addEventListener(type, callback) { handlers[type] = callback; },
      focus() {}, before(child) { elements.set(child.id, child); },
      insertAdjacentHTML(where, text) { this.innerHTML = where === 'afterbegin' ? text + this.innerHTML : this.innerHTML + text; },
      querySelector() { return element(); }, querySelectorAll() { return []; },
      getBoundingClientRect() { return { top: 0, bottom: 500 }; }, scrollIntoView() {},
    };
  }
  const document = {
    hidden: false, documentElement: {}, body: element('body'), activeElement: element('focus'),
    getElementById(id) { if (missingElements.has(id)) return null; if (!elements.has(id)) elements.set(id, element(id)); return elements.get(id); },
    querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element(selector)); return elements.get(selector); },
    createElement(tag) { createdTags.push(tag); return element(); },
    addEventListener(type, callback) { listeners[type] = callback; },
  };
  class CampusEngine {
    constructor(options) { engineOptions = options; }
    static drawAvatar() {}
    static drawPlayerPreview() {}
    setAvatar() {} setPaused() {} setLanguage() {} destroy() {} move() {}
    setTalking(id, talking) { talkingId = talking ? id : null; }
    setLocation(location) { engineLocations.push(location); engineOptions.onLocationChange(location); }
  }
  const context = vm.createContext({
    window: { innerHeight: 900, addEventListener() {}, CampusAudio:{create({onState}){audioOnState=onState;return audioStub;}}, CampusTeacher:{open(options){teacherMounts.push(options);return {destroy(){}};}} }, document, CampusEngine,
    localStorage: { getItem() { return savedText; }, setItem(key, text) { savedText = text; } },
    setTimeout() { return 1; }, clearTimeout() {}, console,
  });
  for (const file of ['content.js', 'subjects.js', 'grade-content.js', 'characters.js', 'engine.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'public/campus/game', file), 'utf8'), context, { filename: file });
  }
  let source = fs.readFileSync(path.join(root, 'public/campus/game/app.js'), 'utf8');
  source = source.replace(/\}\)\(\);\s*$/, `window.testApp = {
    state: () => state, progress, campusProgress, pstate, subjectState, action, setGradeQuestions, updateChrome,
    missions, subjects, openDialogue, nextDialogue, endDialogue, dialogueModel,
    renderSubject, renderMap, renderJournal, renderSettings, renderEnding, save, showModal, closeModal,
    setSubject: (room, level) => { activeSubject = room; activeLevel = level; },
    setCase: (id) => { activeCase = id; },
    mode: () => ({ dialogueId, modalType, titleOpen, panelOpen }),
  }; })();`);
  vm.runInContext(source, context, { filename: 'app.js', timeout: 2000 });
  return { app: context.window.testApp, registry: context.window.CAMPUS_CHARACTERS, elements, missingElements, listeners, audioLog,
    emitVoice(voice){ audioStub.state.voice={...voice};audioOnState(audioStub.state); }, stopVoice:()=>audioStub.stopVoice(),
    engineLocations, createdTags, teacherMounts, body: document.body, talking: () => talkingId, snapshot: () => JSON.parse(savedText) };
}

(async () => {
  const custom = launch({version:2,started:true,prologueSeen:true});
  const customRoom = custom.app.subjects.find(room => room.id === 'maths');
  const additional = [7,10].map((stars,index) => ({...customRoom.levels[0],id:'teacher-extra-'+index,stars}));
  custom.app.setGradeQuestions([...custom.app.subjects.flatMap(room => room.levels),...additional]);
  assert.equal(customRoom.levels.length,5,'a classroom can render more than three questions');
  for(const level of additional){
    custom.app.setSubject('maths',level.id);custom.app.renderSubject();
    assert.equal((custom.elements.get('modal-content').innerHTML.match(/data-level=/g)||[]).length,5);
    const answer=custom.app.subjectState('maths',level.id);answer.choice=level.options.findIndex(option=>option.correct);
    const before=custom.app.progress().stars;await custom.app.action('subject-submit');
    assert.equal(custom.app.progress().stars,before+level.stars,'custom question awards the configured amount');
    await custom.app.action('subject-submit');assert.equal(custom.app.progress().stars,before+level.stars,'replay cannot duplicate a custom award');
  }
  assert.equal(custom.app.progress().stars,17);
  for(const lang of ['zh','cn','en']){
    custom.app.state().lang=lang;custom.app.renderJournal();
    const html=custom.elements.get('modal-content').innerHTML;
    assert.match(html,/17 \/ 120/,'journal maximum includes extra configured stars');
    assert.match(html,/2[／/]41/,'journal uses the current question count');
    assert.match(html,lang==='en'?/subjects offer 95/:lang==='cn'?/学科题共 95 星/:/學科題共 95 星/);
  }
  const shortActivity = launch({version:2,started:true,prologueSeen:true});
  const shortQuestion = {...shortActivity.app.subjects.find(room=>room.id==='maths').levels[0],stars:10};
  shortActivity.app.setGradeQuestions([shortQuestion]);
  shortActivity.app.subjectState('maths',shortQuestion.id).completed=true;
  shortActivity.app.updateChrome();
  const partialBar=shortActivity.elements.get('star-summary').innerHTML;
  assert.match(partialBar,/aria-valuemax="35" aria-valuenow="10"/);
  assert.ok(Math.abs(Number(partialBar.match(/width:([\d.]+)%/)[1])-100*10/35)<0.001,'a shorter teacher activity normalises its progress bar to the actual target');
  for(const mission of shortActivity.app.missions)Object.assign(shortActivity.app.pstate(mission.id),{completed:true,choice:0,repairChoice:mission.repair.options.findIndex(option=>option.correct)});
  shortActivity.app.state().transferAwarded=true;shortActivity.app.updateChrome();
  assert.equal(shortActivity.app.progress().exitUnlocked,true);
  assert.match(shortActivity.elements.get('star-summary').innerHTML,/width:100%/,'the bar is full when a shorter activity unlocks its gate');
  for(const lang of ['zh','cn','en']){
    shortActivity.app.state().lang=lang;shortActivity.app.renderMap();
    assert.match(shortActivity.elements.get('modal-content').innerHTML,lang==='en'?/With 35 stars/:/取得 35 星/,'the ground-floor instructions show the assigned target');
    shortActivity.app.openDialogue('prologue');
    assert.doesNotMatch(shortActivity.app.dialogueModel().lines.at(-1),/100/,'fixed introductory audio does not promise a hardcoded target');
    shortActivity.app.endDialogue();
  }
  const teacherEntry = launch({version:2,started:true,prologueSeen:true,location:'library',reflection:'Student work stays here.'});
  const beforeTeacher = JSON.stringify(teacherEntry.app.state());
  const beforeTeacherLocations = teacherEntry.engineLocations.length;
  await teacherEntry.app.action('new-game');
  assert.equal(teacherEntry.app.mode().modalType,'role-choice');
  assert.equal(teacherEntry.body.classList.contains('entry-panel-active'),true);
  await teacherEntry.app.action('teacher-entry');
  assert.equal(teacherEntry.app.mode().modalType,'teacher');
  assert.equal(teacherEntry.teacherMounts.length,1);
  assert.equal(teacherEntry.teacherMounts[0].subjectId,undefined,'teacher chooses a subject after login');
  assert.equal(JSON.stringify(teacherEntry.app.state()),beforeTeacher,'teacher entry preserves saved student progress');
  assert.equal(teacherEntry.engineLocations.length,beforeTeacherLocations,'teacher entry does not move into the game');
  teacherEntry.teacherMounts[0].onExit();
  assert.equal(teacherEntry.app.mode().titleOpen,true,'leaving teacher workspace returns to title');
  assert.equal(teacherEntry.body.classList.contains('entry-panel-active'),false);
  // Continue dismisses a leftover in-game panel without resetting or moving a
  // started save. Opening a panel from the title must not keep its return flag.
  for (const panel of ['avatar','cases','subjects','settings']) {
    const continued = launch({version:2,started:true,prologueSeen:true,location:'music',reflection:'Keep this note.'});
    continued.app.showModal(panel);
    assert.equal(continued.app.mode().panelOpen,true);
    const beforeLocations = continued.engineLocations.length;
    await continued.app.action('continue');
    assert.equal(continued.app.mode().titleOpen,false, panel + ': Continue enters the campus');
    assert.equal(continued.app.mode().panelOpen,false, panel + ': stale panel is closed');
    assert.equal(continued.app.mode().modalType,'');
    assert.equal(continued.elements.get('modal').hidden,true);
    assert.equal(continued.elements.get('.game-frame').dataset.panel,undefined);
    assert.equal(continued.body.classList.contains('in-game-panel'),false);
    assert.equal(continued.app.state().location,'music');
    assert.equal(continued.engineLocations.length,beforeLocations,'Continue must not teleport');
    assert.equal(continued.app.state().reflection,'Keep this note.');
    continued.app.closeModal();
    assert.equal(continued.app.mode().titleOpen,false,'a second close cannot restore an old title-return flag');
  }
  const unfinishedIntro = launch({version:2,started:true,prologueSeen:false});
  unfinishedIntro.app.showModal('settings');
  await unfinishedIntro.app.action('continue');
  assert.equal(unfinishedIntro.app.mode().panelOpen,false);
  assert.equal(unfinishedIntro.app.mode().dialogueId,'prologue','Continue still resumes the unviewed introduction');

  // Progress menus deliberately cannot launch questions or bypass meeting the
  // NPC. Map travel remains tested independently below.
  const directoryGame = launch({version:2,started:true,prologueSeen:true,location:'rooftop'});
  for (const lang of ['zh','cn','en']) {
    directoryGame.app.state().lang = lang;
    for (const [menu,marker,count] of [['cases','case',4],['subjects','subject',13]]) {
      const beforeLocations = directoryGame.engineLocations.length;
      await directoryGame.app.action(menu);
      const html = directoryGame.elements.get('modal-content').innerHTML;
      assert.equal((html.match(new RegExp(`data-${marker}-progress=`, 'g'))||[]).length,count);
      assert.equal((html.match(/<article\b/g)||[]).length,count,'progress records use non-interactive articles');
      assert.doesNotMatch(html,/<button\b|data-(?:case|subject|travel|level)=/,'no question or teleport shortcut is rendered');
      const snapshot = JSON.stringify(directoryGame.app.state());
      for (const dataset of [{case:'voice'},{subject:'maths'},{caseProgress:'voice'},{subjectProgress:'maths'}]) {
        // Even stale button markup from an older render has no active shortcut handler.
        directoryGame.listeners.click({target:{closest:()=>({dataset})}});
      }
      assert.equal(directoryGame.app.mode().modalType,menu);
      assert.equal(directoryGame.app.mode().dialogueId,null);
      assert.equal(directoryGame.engineLocations.length,beforeLocations);
      assert.equal(JSON.stringify(directoryGame.app.state()),snapshot);
      directoryGame.app.closeModal();
    }
  }

  // All special dialogues resolve the same names as their world/portrait
  // identities. This guards against the older fallback surnames reappearing.
  const named = launch({version:2,started:true,prologueSeen:true});
  const speakers = ['prologue','staff:office','staff:vice','finale','exit',
    ...named.app.missions.map(m=>m.id),...named.app.subjects.map(room=>'subject:'+room.id)];
  for (const lang of ['zh','cn','en']) {
    named.app.state().lang = lang;
    for (const id of speakers) {
      named.app.openDialogue(id);
      assert.equal(named.app.dialogueModel().name,named.registry.resolve(id).name[lang],`${id}: canonical ${lang} name`);
      assert.equal(named.registry.resolve(named.app.dialogueModel().portrait).id,named.registry.resolve(id).id,`${id}: portrait identity`);
      named.app.endDialogue();
    }
  }

  // Check the longest authored stems and options in each locale survive HTML
  // rendering in full. This is a DOM-content check, not phone layout evidence.
  const bank = JSON.parse(fs.readFileSync(path.join(root,'data/grade-bank.json'),'utf8'));
  const escapeHtml = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for (const lang of ['zh','cn','en']) {
    const longestStem = bank.reduce((a,b)=>a.question[lang].length>b.question[lang].length?a:b);
    const longestOption = bank.reduce((a,b)=>Math.max(...a.options.map(o=>o.text[lang].length))>Math.max(...b.options.map(o=>o.text[lang].length))?a:b);
    for (const question of [longestStem,longestOption]) {
      const longText = launch({version:2,started:true,prologueSeen:true,lang,student:{grade:question.grade}});
      longText.app.setSubject(question.subjectId,question.id);
      longText.app.showModal('subject');
      const html = longText.elements.get('modal-content').innerHTML;
      assert.ok(html.includes(escapeHtml(question.question[lang])),question.id+': complete question');
      for (const option of question.options) assert.ok(html.includes(escapeHtml(option.text[lang])),question.id+': complete option');
      assert.equal((html.match(/name="subject-answer"/g)||[]).length,3);
    }
  }
  // Switching UI language during a conversation must stop the old utterance,
  // translate its text and provide a new playback key, rather than replay Cantonese.
  const spoken = launch({version:2,started:true,prologueSeen:true});
  spoken.app.openDialogue('voice');
  const traditional = spoken.audioLog.lines.at(-1);
  const stopsBefore = spoken.audioLog.stops;
  spoken.elements.get('language').handlers.change({target:{value:'cn'}});
  const mandarin = spoken.audioLog.lines.at(-1);
  assert.equal(mandarin.locale,'cn'); assert.notEqual(mandarin.key,traditional.key);
  assert.ok(spoken.audioLog.stops > stopsBefore);
  spoken.elements.get('language').handlers.change({target:{value:'en'}});
  const english = spoken.audioLog.lines.at(-1);
  assert.equal(english.locale,'en'); assert.notEqual(english.key,mandarin.key);
  assert.match(english.text,/AI/); assert.notEqual(english.text,traditional.text);
  // A failed line remains understandable without opening Sound settings.
  // Notifications follow the visible dialogue locale and never start speech.
  const voiceHint = launch({version:2,started:true,prologueSeen:true,lang:'en'});
  await voiceHint.app.action('continue');
  voiceHint.missingElements.add('voice-status'); // Sound settings has never opened.
  voiceHint.app.openDialogue('subject:hall');
  const hint=voiceHint.elements.get('dialogue-voice-status');
  assert.match(voiceHint.elements.get('dialogue').innerHTML,/id="dialogue-voice-status"[^>]*role="status"[^>]*aria-live="polite"[^>]*hidden/);
  assert.equal(hint.hidden,true,'normal queued speech adds no status text');
  const initialSpeech=voiceHint.audioLog.lines.length;
  voiceHint.emitVoice({status:'unavailable',requestedLocale:'en-GB',errorCode:'voice-gender-unavailable',unavailable:true});
  assert.equal(hint.hidden,false,'failure is visible even when the audio panel does not exist');
  assert.match(hint.textContent,/language and gender/);
  assert.equal(voiceHint.audioLog.lines.length,initialSpeech,'aria-live status must not create another speech utterance');
  voiceHint.emitVoice({status:'unavailable',requestedLocale:'zh-HK',errorCode:'voice-gender-unavailable'});
  assert.equal(hint.hidden,true,'a stale locale cannot show its failure on English dialogue');assert.equal(hint.textContent,'');
  voiceHint.emitVoice({status:'error',requestedLocale:'en-GB',errorCode:'speech-timeout'});assert.match(hint.textContent,/Speech could not play/);
  voiceHint.stopVoice();assert.equal(hint.hidden,true);assert.equal(hint.textContent,'','stopping clears an error even if old voice metadata remains');
  voiceHint.emitVoice({status:'unavailable',requestedLocale:'en-GB',unavailable:true});assert.match(hint.textContent,/No matching voice/);
  voiceHint.app.nextDialogue();assert.equal(hint.hidden,true,'next line clears the old failure');
  voiceHint.emitVoice({status:'error',requestedLocale:'en-GB'});
  voiceHint.elements.get('language').handlers.change({target:{value:'cn'}});assert.equal(hint.hidden,true,'language change clears prior failure');
  voiceHint.emitVoice({status:'unavailable',requestedLocale:'zh-CN',errorCode:'voice-gender-unavailable'});assert.match(hint.textContent,/此设备/,'current-language error is localized');
  voiceHint.app.endDialogue();assert.equal(hint.hidden,true);assert.equal(hint.textContent,'','closing dialogue clears its live region');
  voiceHint.emitVoice({status:'error',requestedLocale:'zh-CN'});assert.equal(hint.hidden,true,'no message may appear after the conversation closes');
  voiceHint.app.openDialogue('voice');voiceHint.emitVoice({status:'error',requestedLocale:'zh-CN'});assert.equal(hint.hidden,false);
  voiceHint.app.showModal('settings');assert.equal(hint.hidden,true,'covered dialogue clears its status');
  voiceHint.emitVoice({status:'error',requestedLocale:'zh-CN'});assert.equal(hint.hidden,true,'modal-covered dialogue stays silent');
  // The illustrated map must use actual scene IDs, not the mockup's visual grouping.
  const mapGame = launch({version:2,started:true,prologueSeen:true});
  const floors = [
    ['corridor','playground','hall'],
    ['corridor1','chinese','english','maths'],
    ['corridor2','chemistry','geography','computer'],
    ['corridor3','history','art','music'],
    ['corridor4','library','rooftop'],
  ];
  const clickMap = dataset => mapGame.listeners.click({target:{closest:()=>({dataset})}});
  for (const lang of ['zh','cn','en']) {
    mapGame.app.state().lang = lang;
    mapGame.app.showModal('map');
    for (const [floor, destinations] of floors.entries()) {
      clickMap({mapFloor:String(floor)});
      const html = mapGame.elements.get('modal-content').innerHTML;
      assert.deepEqual([...html.matchAll(/data-map-floor="(\d)"/g)].map(m=>Number(m[1])),[4,3,2,1,0],'fifth level is physically above the ground level');
      assert.deepEqual([...html.matchAll(/data-travel="([^"]+)"/g)].map(m=>m[1]).sort(), [...destinations].sort(), `floor ${floor} has exactly its actual locations`);
      assert.match(html,new RegExp(`data-map-floor="${floor}" aria-pressed="true"`));
      for (const destination of destinations) {
        clickMap({travel:destination});
        assert.equal(mapGame.app.state().location,destination,'floorplan reuses actual engine navigation');
        assert.equal(mapGame.app.mode().panelOpen,false,'travel closes the in-game map');
        mapGame.app.showModal('map');
        assert.match(mapGame.elements.get('modal-content').innerHTML,new RegExp(`data-travel="${destination}"[^>]*aria-current="location"`));
      }
    }
  }
  const beforeInvalid = mapGame.elements.get('modal-content').innerHTML;
  clickMap({mapFloor:'99'});
  assert.equal(mapGame.elements.get('modal-content').innerHTML,beforeInvalid,'invalid floors cannot produce broken map art');
  let prevented = false;
  mapGame.listeners.keydown({key:'ArrowUp',target:{closest:()=>({dataset:{mapFloor:'4'}})},preventDefault(){prevented=true;}});
  assert.ok(prevented);
  assert.match(mapGame.elements.get('modal-content').innerHTML,/data-map-floor="0" aria-pressed="true"/,'keyboard floor navigation wraps');
  // Question presentation preserves variable option counts, values and selection.
  const quizGame = launch({version:2,started:true,prologueSeen:true});
  const quizRoom = quizGame.app.subjects.find(room=>room.id==='maths');
  const quizLevel = quizRoom.levels[0];
  const baseOptions = JSON.parse(JSON.stringify(quizLevel.options));
  for (const count of [2,3,4,5]) {
    quizLevel.options = Array.from({length:count},(_,i)=>({...baseOptions[i%baseOptions.length],id:'option-'+i}));
    quizGame.app.setSubject(quizRoom.id,quizLevel.id);
    quizGame.app.subjectState(quizRoom.id,quizLevel.id).choice=count-1;
    quizGame.app.showModal('subject');
    const html = quizGame.elements.get('modal-content').innerHTML;
    assert.equal((html.match(/name="subject-answer"/g)||[]).length,count);
    assert.equal((html.match(/class="quiz-option-letter"/g)||[]).length,count);
    assert.match(html,new RegExp(`value="${count-1}" checked`),'selected answer remains selected after render');
    assert.match(html,new RegExp(`aria-hidden="true">${String.fromCharCode(64+count)}</span>`),'letter labels cover every answer');
  }
  const game = launch();
  const { app } = game;
  assert.equal(app.state().avatar.gender, 'boy', 'new avatars have a safe explicit default');
  const migration = launch({version:1,avatar:{gender:'girl',uniform:3,hair:1,skin:2}}).app.state().avatar;
  assert.deepEqual(JSON.parse(JSON.stringify(migration)),{gender:'girl',uniform:1,hair:1,skin:2});
  const genderGame=launch({version:2,avatar:{gender:'girl',uniform:0,hair:1,skin:2}});
  const chooseAppearance=(key,value)=>genderGame.listeners.click({target:{closest:()=>({dataset:{[key]:String(value)}})}});
  for(const lang of ['zh','cn','en']) {
    genderGame.app.state().lang=lang; genderGame.app.showModal('avatar');
    const markup=genderGame.elements.get('modal-content').innerHTML;
    assert.equal((markup.match(/data-uniform=/g)||[]).length,4,'four approved styles per gender');
    assert.doesNotMatch(markup,/皇仁|聖貞德|Queen.s College|HKCWCC|UNDERCOVER/,'wardrobe does not name schools or detective roles');
    assert.match(markup,/student-grade/); assert.match(markup,/student-section/);
  }
  chooseAppearance('gender','boy'); chooseAppearance('uniform',3); chooseAppearance('hair',1);
  assert.equal(genderGame.app.state().avatar.gender,'boy'); assert.equal(genderGame.app.state().avatar.uniform,3);
  const appearance=genderGame.snapshot();
  for(const [key,value] of [['gender','bad'],['uniform',99],['hair',2],['skin',3]]) chooseAppearance(key,value);
  assert.deepEqual(genderGame.snapshot().avatar,appearance.avatar,'invalid appearance cannot corrupt save');
  assert.deepEqual(launch(appearance).snapshot().avatar,appearance.avatar,'appearance persists');
  for(const grade of [1,2,3,4,5,6]) {
    const graded=launch({version:2,student:{grade,section:'D'}}).app;
    assert.equal(graded.subjects.reduce((n,r)=>n+r.levels.length,0),39);
    assert.ok(graded.subjects.every(r=>r.levels.every(q=>q.grade===grade)),'grade-specific question bank');
  }
  assert.equal(app.progress().stars, 0);
  assert.equal(Object.keys(app.campusProgress()).length, 18, '4 cases + 13 subject markers + gate');
  assert.deepEqual(Array.from(app.missions, m => m.location), ['corridor', 'corridor1', 'corridor2', 'corridor3']);
  const initialTitle = game.elements.get('title-screen').innerHTML;
  assert.equal((initialTitle.match(/<button\b/g) || []).length, 3, 'title has exactly three game-menu buttons');
  assert.match(initialTitle, /data-action="new-game">新開始</);
  assert.match(initialTitle, /data-action="continue" disabled>繼續遊戲</);
  assert.match(initialTitle, /class="title-menu-button title-settings" disabled[^>]*>設定</);
  assert.equal(game.body.classList.contains('title-active'), true);
  await app.action('continue');
  assert.equal(app.mode().titleOpen, true, 'continue cannot start an empty save');
  await app.action('new-game');
  assert.equal(app.mode().modalType, 'role-choice', 'new game first offers student or teacher');
  assert.match(game.elements.get('modal-content').innerHTML, /data-action="student-entry"/);
  assert.match(game.elements.get('modal-content').innerHTML, /data-action="teacher-entry"/);
  await app.action('student-entry');
  assert.equal(app.mode().modalType, 'avatar', 'student role opens appearance selection');
  assert.equal(game.body.classList.contains('title-active'), false);
  app.closeModal();

  // The actual DOM adapter deliberately has no native dialog APIs. Panels must
  // live in the game screen, preserve start state and return to the right view.
  assert.equal(game.elements.get('modal').hidden, true);
  await app.action('settings');
  assert.equal(app.mode().titleOpen, false);
  assert.equal(app.mode().panelOpen, true);
  assert.equal(game.elements.get('modal').dataset.panel, 'settings');
  assert.equal(game.elements.get('.game-frame').dataset.panel, 'settings');
  app.closeModal();
  assert.equal(app.mode().titleOpen, true, 'pre-start settings return to title');
  assert.equal(game.elements.get('modal').hidden, true);
  await app.action('customize');
  assert.equal(app.state().started, false, 'opening outfit panel must not start the game');
  assert.equal(app.mode().titleOpen, false);
  assert.equal(game.elements.get('.workspace').classList.contains('customizing'), true);
  game.listeners.keydown({ key: 'Escape', preventDefault() {} });
  assert.equal(app.mode().titleOpen, true, 'cancelling first outfit selection returns to title');
  assert.equal(app.mode().panelOpen, false);
  assert.equal(game.elements.get('.game-frame').dataset.panel, undefined);

  // The intro follows avatar submission and can be skipped without resetting work.
  await app.action('customize');
  await app.action('start');
  assert.equal(app.mode().panelOpen, false);
  assert.equal(game.elements.get('modal').hidden, true);
  assert.equal(app.mode().dialogueId, 'prologue');
  assert.equal(app.dialogueModel().lines.length, 4);
  app.endDialogue();

  await app.action('cases');
  assert.equal(app.mode().modalType, 'cases');
  assert.equal((game.elements.get('modal-content').innerHTML.match(/data-case-progress=/g) || []).length, 4);
  app.openDialogue('voice');
  assert.equal(app.mode().panelOpen, false, 'case selection replaces its in-game panel with dialogue');
  assert.equal(game.talking(), 'voice');
  await app.action('settings');
  assert.equal(game.talking(), null, 'covered dialogue pauses NPC talking');
  app.closeModal();
  assert.equal(game.talking(), 'voice', 'closing settings resumes the same NPC');
  app.endDialogue();
  assert.equal(game.talking(), null);
  await app.action('customize');
  app.closeModal();
  assert.equal(app.mode().titleOpen, false, 'later outfit edits return to campus');
  for (const route of ['subjects', 'map', 'journal', 'settings']) {
    await app.action(route);
    assert.equal(app.mode().panelOpen, true);
    assert.equal(app.mode().modalType, route);
    app.closeModal();
  }
  assert.match(game.elements.get('hud-stars').textContent, /0 \/ 100/);
  for (const mission of app.missions) {
    app.setCase(mission.id);
    app.showModal('case');
    assert.equal(game.elements.get('panel-portrait').hidden, false);
    assert.match(game.elements.get('panel-portrait').className, /registered-portrait/);
    assert.equal(game.elements.get('panel-portrait').dataset.portrait, mission.id);
  }
  for (const room of ['hall','playground','maths','english']) {
    app.setSubject(room, 'foundation');
    app.showModal('subject');
    assert.equal(game.elements.get('panel-portrait').hidden, false);
    assert.equal(game.elements.get('panel-portrait').dataset.portrait, 'subject:' + room);
    assert.equal(game.elements.get('panel-portrait').className, 'portrait registered-portrait panel-portrait', 'subject panel clears the prior case portrait class');
  }
  app.showModal('settings');
  assert.equal(game.elements.get('panel-portrait').hidden, true);

  app.closeModal();
  assert.equal(app.state().prologueSeen, true);
  await app.action('replay-prologue');
  assert.equal(app.mode().dialogueId, 'prologue');
  app.endDialogue();

  for (const room of app.subjects) {
    for (const level of room.levels) {
      app.setSubject(room.id, level.id);
      const record = app.subjectState(room.id, level.id);
      const before = app.progress().stars;
      record.choice = level.options.findIndex(o => !o.correct);
      await app.action('subject-submit');
      assert.equal(app.progress().stars, before, `${room.id}/${level.id}: wrong answer awards nothing`);
      record.choice = level.options.findIndex(o => o.correct);
      await app.action('subject-submit');
      assert.equal(app.progress().stars, before + level.stars);
      await app.action('subject-submit');
      assert.equal(app.progress().stars, before + level.stars, 'repeat correct answer cannot farm stars');
      await app.action('subject-retry');
      record.choice = level.options.findIndex(o => !o.correct);
      await app.action('subject-submit');
      assert.equal(app.progress().stars, before + level.stars, 'later error must retain earned award');
    }
    assert.equal(app.campusProgress()['subject:' + room.id], true);
  }
  assert.equal(app.progress().stars, 78);
  assert.equal(app.progress().checks, 39);
  assert.equal(app.progress().rooms, 13);
  assert.equal(app.progress().exitUnlocked, false);

  // Preserve the actual evidence -> choice -> repair pathway and first decision.
  for (const mission of app.missions) {
    app.setCase(mission.id);
    const record = app.pstate(mission.id);
    await app.action('evidence-next');
    assert.equal(record.phase, 0, 'evidence gate needs at least two clues');
    record.seen = [0, 1];
    await app.action('evidence-next');
    assert.equal(record.phase, 1);
    record.choice = 0;
    await app.action('decision-submit');
    await app.action('to-repair');
    record.repairChoice = mission.repair.options.findIndex(o => o.correct);
    await app.action('repair-submit');
    assert.equal(record.completed, true);
    const stars = app.progress().stars;
    await app.action('review-case');
    assert.equal(app.pstate(mission.id).phase, 4, 'review preserves completion');
    await app.action('repair-submit');
    assert.equal(app.progress().stars, stars, 'case rewards are one-off');
  }
  assert.equal(app.progress().stars, 98);
  assert.equal(app.progress().exitUnlocked, false);

  app.state().transferChoice = 1; // derive correct answer below from content context
  const content = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'public/campus/game/content.js'), 'utf8'), content);
  const correctTransfer = content.window.TRANSFER_CONTENT.options.findIndex(o => o.correct);
  const wrongTransfer = content.window.TRANSFER_CONTENT.options.findIndex(o => !o.correct);
  app.state().transferChoice = correctTransfer;
  await app.action('check-transfer');
  assert.equal(app.progress().stars, 103);
  assert.equal(app.progress().exitUnlocked, true);
  await app.action('check-transfer');
  assert.equal(app.progress().stars, 103);
  app.state().transferChoice = wrongTransfer;
  await app.action('check-transfer');
  assert.equal(app.state().transferDone, false);
  assert.equal(app.state().transferAwarded, true);
  assert.equal(app.progress().stars, 103, 'transfer award survives later exploration');

  const restored = launch(game.snapshot()).app;
  assert.equal(restored.progress().stars, 103);
  assert.equal(restored.progress().checks, 39);
  assert.equal(restored.state().transferAwarded, true);
  for (const lang of ['zh', 'cn', 'en']) {
    restored.state().lang = lang;
    restored.renderMap(); restored.renderJournal(); restored.renderSettings();
    for (const room of restored.subjects) {
      restored.setSubject(room.id, room.levels[0].id);
      restored.renderSubject();
      restored.openDialogue('subject:' + room.id);
      assert.ok(restored.dialogueModel().name);
      restored.endDialogue();
    }
  }

  // Exactly 100 is sufficient, 99 is not. All required case/transfer awards
  // remain necessary because subjects alone contribute only 78.
  const onePoint = restored.subjects[0].levels[0];
  const threePoints = restored.subjects[0].levels[2];
  restored.subjectState(restored.subjects[0].id, threePoints.id).completed = false;
  assert.equal(restored.progress().stars, 100);
  assert.equal(restored.progress().exitUnlocked, true);
  restored.subjectState(restored.subjects[0].id, onePoint.id).completed = false;
  assert.equal(restored.progress().stars, 99);
  assert.equal(restored.progress().exitUnlocked, false);

  const invalid = launch({ version: 1, subjects: { playground: { foundation: {
    completed: true, solvedChoice: 999, choice: -1, feedbackChoice: '1', attempts: -2,
  } } }, missions: [], transferAwarded: true, transferAwardChoice: correctTransfer, endingSeen: true }).app;
  assert.equal(invalid.progress().stars, 0);
  assert.equal(invalid.subjectState('playground', invalid.subjects[0].levels[0].id).choice, null);
  assert.equal(invalid.subjectState('playground', invalid.subjects[0].levels[0].id).attempts, 0);
  assert.equal(invalid.state().endingSeen, false);
  assert.equal(launch({ version: 1, subjects: [] }).app.progress().stars, 0);

  const legacy = game.snapshot();
  delete legacy.transferAwarded; delete legacy.transferAwardChoice;
  legacy.transferChoice = correctTransfer; legacy.transferDone = true;
  assert.equal(launch(legacy).app.state().transferAwarded, true, 'migrate earned transfer from previous save');

  const replacement = launch({ ...game.snapshot(), lang: 'cn', large: true,
    avatar: { gender: 'girl', uniform: 2, hair: 1, skin: 2 }, reflection: 'Keep evidence until confirmed.' });
  assert.doesNotMatch(replacement.elements.get('title-screen').innerHTML, /data-action="continue" disabled/);
  await replacement.app.action('new-game');
  assert.equal(replacement.app.mode().modalType, 'role-choice');
  assert.equal(replacement.app.state().reflection, 'Keep evidence until confirmed.', 'role selection does not erase an existing student save');
  await replacement.app.action('student-entry');
  assert.doesNotMatch(replacement.elements.get('modal-content').innerHTML, /data-action="(?:download|download-report|confirm-new-game)"/);
  assert.equal(replacement.createdTags.includes('a'),false,'new game does not create or trigger a report download');
  assert.equal(replacement.app.mode().panelOpen,true,'new game immediately opens the in-game avatar panel');
  assert.equal(replacement.app.mode().dialogueId,null,'old conversation is not carried into a new game');
  assert.equal(replacement.app.mode().modalType, 'avatar');
  assert.equal(replacement.app.state().started, false);
  assert.equal(replacement.app.state().prologueSeen, false);
  assert.equal(replacement.app.progress().stars, 0);
  assert.equal(replacement.app.state().reflection, '');
  assert.equal(replacement.app.state().lang, 'cn');
  assert.equal(replacement.app.state().large, true);
  assert.deepEqual(JSON.parse(JSON.stringify(replacement.app.state().avatar)), { gender: 'girl', uniform: 2, hair: 1, skin: 2 });
  assert.equal(replacement.snapshot().started, false, 'direct new-game replacement is saved');
  await replacement.app.action('start');
  assert.equal(replacement.app.mode().dialogueId, 'prologue');

  app.openDialogue('exit');
  assert.equal(app.dialogueModel().next, 'ending');
  app.nextDialogue(); app.nextDialogue();
  assert.equal(app.state().endingSeen, true);
  assert.equal(app.mode().modalType, 'ending');
  await app.action('reset');
  assert.equal(app.progress().stars, 0);
  assert.equal(app.progress().checks, 0);
  assert.equal(app.state().prologueSeen, false);
  assert.equal(app.mode().dialogueId, null);
  console.log('PASS progression: custom five-question room with7/10-star one-off awards and dynamic totals, 39 default awards, 4 cases, sticky transfer, 103 maximum, 100-star gate, restore, three locales, gender-specific wardrobe migration/selection, intro, ending and reset');
})().catch(error => { console.error(error); process.exitCode = 1; });
