'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const {webcrypto} = require('node:crypto');

// Run the actual application with small DOM/engine adapters. The test-only hook
// is injected into the source in memory; production exposes no state API.
function launch(saved, server) {
  const timers = new Map(); let timerId=0; const windowListeners={};
  const elements = new Map();
  const listeners = {};
  let savedText = saved === undefined ? null : JSON.stringify(saved);
  let engineOptions;
  let talkingId = null;
  function element(id = '') {
    const handlers = {};
    const classes = new Set();
    return {
      id, dataset: {}, style: {}, hidden: false, isConnected: true,
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
    window: { innerHeight: 900, crypto:webcrypto, fetch:server.fetch, addEventListener(type,fn) { (windowListeners[type] ??= []).push(fn); }, dispatchEvent(event) { for(const fn of windowListeners[event.type]||[]) fn(event); } }, document, CampusEngine, URLSearchParams, Uint8Array, Date, CustomEvent: class {constructor(type,{detail}){this.type=type;this.detail=detail;}},
    localStorage: { getItem() { return savedText; }, setItem(key, text) { savedText = text; } },
    setTimeout(fn,delay) {const id=++timerId; timers.set(id,{fn,delay});return id;}, clearTimeout(id) {timers.delete(id);}, console,
  });
  for (const file of ['content.js', 'subjects.js', 'grade-content.js', 'characters.js', 'engine.js', 'campus-cloud.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'public/campus', file), 'utf8'), context, { filename: file });
  }
  let source = fs.readFileSync(path.join(root, 'public/campus/app.js'), 'utf8');
  source = source.replace(/\}\)\(\);\s*$/, `window.testApp = {
    state: () => state, progress, campusProgress, pstate, subjectState, action, applyCloud, refreshClass, updateSaveLabel,
    cloud: () => cloud, subjects: () => subjects,
    missions, openDialogue, nextDialogue, endDialogue, dialogueModel,
    renderSubject, renderMap, renderJournal, renderSettings, renderEnding, save, showModal, closeModal,
    setSubject: (room, level) => { activeSubject = room; activeLevel = level; },
    setCase: (id) => { activeCase = id; },
    mode: () => ({ dialogueId, modalType, titleOpen, panelOpen }),
  }; })();`);
  source = source.replace('  initialiseCloud();', '  window.startup = initialiseCloud();');
  vm.runInContext(source, context, { filename: 'app.js', timeout: 2000 });
  return { context, ready:()=>context.window.startup, async flushSave(){const item=[...timers].find(([,t])=>t.delay===900);if(item){timers.delete(item[0]);await item[1].fn();}}, app: context.window.testApp, elements, listeners, body: document.body, talking: () => talkingId, snapshot: () => JSON.parse(savedText) };
}

function mockServer({joined=true,optionCount=3,roomId='maths'}={}) {
  const tri = text=>({zh:text,cn:text,en:text});
  const profile={studentId:'s1',classId:'class2B',studentNumber:'03',name:'示範學生',grade:2,section:'B',schoolYear:'2026-27',assignmentId:'a1'};
  const bank=JSON.parse(fs.readFileSync(path.join(root,'data/grade-bank.json'),'utf8'));
  const source=bank.find(q=>q.grade===2 && q.subjectId==='maths');
  source.roomId=roomId;
  if(optionCount!==3){source.options=Array.from({length:optionCount},(_,index)=>({id:'custom-option-'+index,text:tri('Option '+index),correct:index===optionCount-1,feedback:tri('Feedback '+index)}));}
  let assignmentId='a1', revision=1, questionId='q1', version=0, metadata={}, records=[], shouldDrop=false, conflicts=false;
  const requests=[];
  const questions=()=>[{...source,id:questionId,sourceId:source.id,revision,options:source.options.map(({id,text})=>({id,text}))}];
  const progress=()=>({profile:{...profile,assignmentId},assignmentId,version,updatedAt:'2026-10-09T01:00:00Z',progress:metadata,attempts:records,
    questionProgress:{[questionId]:{sourceId:source.id,completed:records.some(a=>a.correct),attempts:records.length,score:records[0]?.score||0,stars:records.some(a=>a.correct)?source.stars:0,lastOptionId:records.at(-1)?.optionId||null}},
    results:[],stars:records.some(a=>a.correct)?source.stars:0,maxStars:source.stars,score:records[0]?.score||0,maxScore:source.maxScore});
  const response=(body,status=200)=>({ok:status<400,status,json:async()=>JSON.parse(JSON.stringify(body))});
  const server={requests,questions,progress,profile,source,
    dropNext(){shouldDrop=true;}, conflict(){conflicts=true;},
    nextActivity(){assignmentId='a2';questionId='q2';revision=2;records=[];profile.assignmentId=assignmentId;},
    async fetch(url,options){const route=url.split('/api/campus/')[1].split('?')[0];const body=options.body?JSON.parse(options.body):null;requests.push({route,method:options.method,body});
      if(route==='bootstrap')return response({grades:[1,2,3,4,5,6],sections:['A','B','C','D'],session:joined?{...profile,assignmentId}:null});
      if(route==='questions')return response({assignmentId,grade:2,questions:questions()});
      if(route==='student/join'||route==='student/resume'){joined=true;return response({session:{...profile,assignmentId},progress:progress(),...(route==='student/join'?{recoveryCode:'EXAMPLE-CODE'}:{})});}
      if(route==='student/logout'){joined=false;return response({ok:true});}
      if(route==='student/progress'&&options.method==='GET')return response(progress());
      if(route==='student/progress'&&options.method==='PUT'){
        if(conflicts){conflicts=false;version++;metadata={...metadata,reflection:'remote draft'};return response({error:{code:'PROGRESS_CONFLICT',message:'Other device'}},409);}
        metadata=body.progress;version++;return response(progress());
      }
      if(route==='attempts'){
        let attempt=records.find(a=>a.key===body.idempotencyKey);
        if(!attempt){const correct=source.options.find(o=>o.id===body.optionId).correct;attempt={id:'attempt'+records.length,key:body.idempotencyKey,assignmentId,questionId,revision,optionId:body.optionId,attemptNumber:records.length+1,correct:correct?1:0,score:records.length===0&&correct?source.maxScore:0,createdAt:'2026-10-09T01:00:00Z'};records.push(attempt);}
        if(shouldDrop){shouldDrop=false;throw new TypeError('Simulated response lost after commit');}
        return response({attempt,correct:!!attempt.correct,feedback:tri('feedback'),takeaway:tri('takeaway'),awardedStars:source.stars,progress:progress()});
      }
      throw new Error('Unexpected API '+route+' '+options.method);
    }
  };return server;
}
(async()=>{
  const server=mockServer();const game=launch(undefined,server);await game.ready();const app=game.app;
  assert.equal(app.state().student.grade,2);assert.equal(app.state().student.section,'B');assert.equal(app.state().student.number,'03');
  assert.equal(app.state().cloudStudentId,'s1');assert.equal(app.state().started,true);
  assert.equal(app.subjects().find(r=>r.id==='maths').levels[0].id,'q1');
  assert.equal(app.subjectState('maths','q1').serverVerified,true);
  app.setSubject('maths','q1');app.subjectState('maths','q1').choice=server.source.options.findIndex(o=>o.correct);
  await app.action('subject-submit');
  assert.equal(app.subjectState('maths','q1').completed,true);assert.equal(app.progress().stars,server.source.stars);
  assert.equal(server.requests.find(r=>r.route==='attempts').body.assignmentId,'a1');

  // A newly published class activity replaces both questions and earned progress.
  server.nextActivity();await app.action('refresh-class');
  assert.equal(app.subjects().find(r=>r.id==='maths').levels[0].id,'q2');
  assert.equal(app.subjectState('maths','q1'),undefined);assert.equal(app.progress().stars,0);
  assert.equal(app.subjectState('maths','q2').completed,false);

  // A network failure after a server commit must retry the same logical attempt.
  app.setSubject('maths','q2');app.subjectState('maths','q2').choice=server.source.options.findIndex(o=>o.correct);server.dropNext();
  await assert.rejects(()=>app.action('subject-submit'),e=>e.code==='NETWORK_ERROR');
  await app.action('subject-submit');
  const submits=server.requests.filter(r=>r.route==='attempts').slice(-2);
  assert.equal(submits[0].body.idempotencyKey,submits[1].body.idempotencyKey,'uncertain-outcome retry must reuse original idempotency key');
  assert.equal(server.progress().attempts.length,1,'network retry must not add another real attempt');

  // Keeping server metadata is an explicit reload, never an automatic overwrite.
  app.state().reflection='local draft';app.save();server.conflict();await game.flushSave();
  assert.equal(app.cloud().state.conflict,true);await app.action('refresh-class');
  assert.equal(app.cloud().state.conflict,false);assert.equal(app.state().reflection,'remote draft');
  await app.action('logout-student');assert.equal(app.cloud().session,null);assert.equal(app.state().cloudStudentId,null);assert.equal(app.state().student.name,'');

  // Joining must not import arbitrary free-play completion into class scores.
  const newcomer=mockServer({joined:false}), other=launch({version:2,started:true,student:{grade:2,section:'B',number:'03',name:'local'}},newcomer);await other.ready();
  for(const [id,value] of Object.entries({'class-code':'CLASSCODE','class-number':'03','class-name':'示範學生','class-recovery':''}))other.elements.set(id,{value});
  await other.app.action('join-class');assert.equal(other.app.state().cloudStudentId,'s1');assert.equal(other.app.progress().stars,0);
  assert.match(other.elements.get('modal-content').innerHTML,/EXAMPLE-CODE/,'new join displays the one-time recovery code');
  for(const count of [4,5]){
    const roomId=count===4?'computer':'maths', customServer=mockServer({optionCount:count,roomId}), custom=launch(undefined,customServer);await custom.ready();
    custom.app.setSubject(roomId,'q1');custom.listeners.change({target:{name:'subject-answer',value:String(count-1)}});
    assert.equal(custom.app.subjectState(roomId,'q1').choice,count-1,'all teacher-created options are selectable');
    await custom.app.action('subject-submit');assert.equal(custom.app.subjectState(roomId,'q1').completed,true);
    await custom.app.refreshClass();assert.equal(custom.app.subjectState(roomId,'q1').solvedChoice,count-1,'fourth/fifth option index survives hydration');
    assert.equal(custom.app.subjects().find(r=>r.id===roomId).levels[0].id,'q1','display room agrees with server hydration roomId');
  }
  console.log('PASS campus integration: authenticated hydration, authoritative scores, new activities, uncertain retries, explicit conflict reload, logout, join and4/5-option custom questions in their assigned rooms.');
})().catch(error=>{console.error(error);process.exitCode=1;});
