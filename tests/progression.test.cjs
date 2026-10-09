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
  const listeners = {};
  let savedText = saved === undefined ? null : JSON.stringify(saved);
  let engineOptions;
  let talkingId = null;
  const audioLog = { lines:[], stops:0 };
  const audioStub = { state:{unlocked:true,settings:{musicVolume:.25,voiceVolume:.8,muted:false},music:{status:"playing"},voice:{status:"ready"}}, speak(line){ audioLog.lines.push({...line}); }, stopVoice(){ audioLog.stops++; }, unlock(){return Promise.resolve(true);}, dispose(){} };
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
    getElementById(id) { if (!elements.has(id)) elements.set(id, element(id)); return elements.get(id); },
    querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element(selector)); return elements.get(selector); },
    createElement() { return element(); },
    addEventListener(type, callback) { listeners[type] = callback; },
  };
  class CampusEngine {
    constructor(options) { engineOptions = options; }
    static drawAvatar() {}
    static drawPlayerPreview() {}
    setAvatar() {} setPaused() {} setLanguage() {} destroy() {} move() {}
    setTalking(id, talking) { talkingId = talking ? id : null; }
    setLocation(location) { engineOptions.onLocationChange(location); }
  }
  const context = vm.createContext({
    window: { innerHeight: 900, addEventListener() {}, CampusAudio:{create(){return audioStub;}} }, document, CampusEngine,
    localStorage: { getItem() { return savedText; }, setItem(key, text) { savedText = text; } },
    setTimeout() { return 1; }, clearTimeout() {}, console,
  });
  for (const file of ['content.js', 'subjects.js', 'grade-content.js', 'characters.js', 'engine.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'public/campus', file), 'utf8'), context, { filename: file });
  }
  let source = fs.readFileSync(path.join(root, 'public/campus/app.js'), 'utf8');
  source = source.replace(/\}\)\(\);\s*$/, `window.testApp = {
    state: () => state, progress, campusProgress, pstate, subjectState, action,
    missions, subjects, openDialogue, nextDialogue, endDialogue, dialogueModel,
    renderSubject, renderMap, renderJournal, renderSettings, renderEnding, save, showModal, closeModal,
    setSubject: (room, level) => { activeSubject = room; activeLevel = level; },
    setCase: (id) => { activeCase = id; },
    mode: () => ({ dialogueId, modalType, titleOpen, panelOpen }),
  }; })();`);
  vm.runInContext(source, context, { filename: 'app.js', timeout: 2000 });
  return { app: context.window.testApp, elements, listeners, audioLog, body: document.body, talking: () => talkingId, snapshot: () => JSON.parse(savedText) };
}

(async () => {
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
  assert.equal(app.mode().modalType, 'avatar', 'first new game goes directly to appearance selection');
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
  assert.equal((game.elements.get('modal-content').innerHTML.match(/data-case=/g) || []).length, 4);
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
  vm.runInContext(fs.readFileSync(path.join(root, 'public/campus/content.js'), 'utf8'), content);
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
  assert.equal(replacement.app.mode().modalType, 'newgame');
  assert.equal(replacement.app.progress().stars, 103, 'new-game button does not immediately erase progress');
  assert.equal(replacement.app.state().reflection, 'Keep evidence until confirmed.');
  assert.match(replacement.elements.get('modal-content').innerHTML, /data-action="download"/);
  await replacement.app.action('cancel-new-game');
  assert.equal(replacement.app.mode().titleOpen, true);
  assert.equal(replacement.app.progress().stars, 103, 'cancelling replacement keeps the existing game');
  await replacement.app.action('new-game');
  await replacement.app.action('confirm-new-game');
  assert.equal(replacement.app.mode().modalType, 'avatar');
  assert.equal(replacement.app.state().started, false);
  assert.equal(replacement.app.state().prologueSeen, false);
  assert.equal(replacement.app.progress().stars, 0);
  assert.equal(replacement.app.state().reflection, '');
  assert.equal(replacement.app.state().lang, 'cn');
  assert.equal(replacement.app.state().large, true);
  assert.deepEqual(JSON.parse(JSON.stringify(replacement.app.state().avatar)), { gender: 'girl', uniform: 2, hair: 1, skin: 2 });
  assert.equal(replacement.snapshot().started, false, 'confirmed replacement is saved');
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
  console.log('PASS progression: 39 awards, 4 cases, sticky transfer, 103 maximum, 100-star gate, restore, three locales, gender-specific wardrobe migration/selection, intro, ending and reset');
})().catch(error => { console.error(error); process.exitCode = 1; });
