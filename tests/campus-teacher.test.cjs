'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..','public','campus');
function launch(options = {}) {
  const calls = [], state = { unlocked:false,classes:[] };
  const container = { innerHTML:'', handlers:{}, addEventListener(name,fn){this.handlers[name]=fn;}, removeEventListener(name){delete this.handlers[name];},querySelectorAll(){return[];},querySelector(){return null;},contains(){return true;} };
  const context = vm.createContext({window:{},console,TextEncoder,Uint8Array,DataView,Blob,URL,URLSearchParams,AbortController,
    FormData:class {constructor(form){this.data=form.data;}get(key){return this.data[key];}},
    crypto:require('node:crypto').webcrypto,navigator:{clipboard:{writeText:async()=>{}}},
    fetch:async(url,options)=>{
      const body=options.body?JSON.parse(options.body):null;calls.push({url,method:options.method,body,credentials:options.credentials});
      let data={};
      if(url.endsWith('/teacher/session'))data={signedIn:true,allowed:true,unlocked:state.unlocked};
      if(url.endsWith('/teacher/unlock')){state.unlocked=true;data={unlocked:true};}
      if(url.endsWith('/teacher/lock'))state.unlocked=false;
      if(url.endsWith('/teacher/classes')){
        if(options.method==='POST')state.classes=Array.from({length:body.seedDefault?24:1},(_,i)=>({id:'class-'+i,label:'S'+(i+1),schoolYear:body.schoolYear,classCode:'TEST'+i,assignmentId:'activity'}));
        data={classes:state.classes};
      }
      if(url.includes('/questions?'))data={questions:[]};
      if(url.includes('/assignments'))data={activeAssignmentId:'activity',assignments:[{id:'activity',title:'Test activity'}]};
      if(url.includes('/results?'))data={rows:[],subjects:['chinese'],headers:['班別','學號','學生姓名','學科得分']};
      return {ok:true,status:200,json:async()=>data};
    },
  });
  vm.runInContext(fs.readFileSync(path.join(root,'xlsx-export.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'teacher-ui.js'),'utf8'),context);
  const workspace=context.window.CampusTeacher.open({container,lang:'zh',...options});
  const settle=async()=>{for(let i=0;i<10;i++)await new Promise(resolve=>setImmediate(resolve));};
  const submit=(kind,data)=>workspace.submit({preventDefault(){},target:{closest(){return{dataset:{form:kind},data,elements:{pin:{value:'test-only'}}};}}});
  return {workspace,context,container,calls,settle,submit};
}
(async()=>{
  const printer=launch({subjectId:'maths'});await printer.settle();
  assert.equal(printer.workspace.state.tab,'results','classroom printer opens the Results workspace');
  assert.equal(printer.workspace.state.subjectId,'maths','classroom printer retains its room subject');
  printer.workspace.destroy();
  const game=launch();await game.settle();
  assert.match(game.container.innerHTML,/解鎖教師工作台/);
  assert.equal(game.calls.length,1,'opening performs only a session check before unlocking');
  assert.ok(!game.calls.some(call=>call.method==='POST'),'opening never creates classes automatically');
  await game.submit('unlock',{pin:'test-only'});await game.settle();
  assert.ok(game.workspace.state.session.unlocked);
  assert.match(game.container.innerHTML,/尚未建立班級/);
  assert.ok(game.calls.every(call=>call.credentials==='same-origin'));
  await game.submit('seed',{schoolYear:'2026-27'});
  assert.equal(game.workspace.state.classes.length,24,'the explicit seed action creates24classes');
  const seed=game.calls.find(call=>call.body?.seedDefault);
  assert.deepEqual(seed.body,{seedDefault:true,schoolYear:'2026-27'});
  game.workspace.state.tab='results';await game.workspace.run(()=>game.workspace.loadTab());
  assert.match(game.container.innerHTML,/目前沒有記錄/);
  assert.ok(game.calls.some(call=>call.url.includes('assignmentId=activity')),'results preserve selected assignment scope');
  for(const locale of ['zh','cn','en']){game.workspace.setLanguage(locale);assert.match(game.container.innerHTML,locale==='en'?/Teacher workspace/:locale==='cn'?/教师工作台/:/教師工作台/);}
  const translated={zh:'測試',cn:'测试',en:'Test'};
  const question={id:'stable-question',revision:3,grade:2,subjectId:'maths',roomId:'maths',category:'subject',level:'application',stars:2,maxScore:1,status:'published',title:{...translated},question:{...translated},takeaway:{...translated},options:['a','b','c'].map((id,index)=>({id,text:{...translated},feedback:{...translated},correct:index===1}))};
  game.workspace.state.tab='questions';game.workspace.state.editing=question;
  await game.submit('question',{});
  const patch=game.calls.find(call=>call.method==='PATCH');
  assert.equal(patch.url,'/api/campus/teacher/questions/stable-question');
  assert.equal(patch.body.expectedRevision,3,'editing includes the server revision for conflict detection');
  assert.equal(patch.body.id,'stable-question','editing retains the question ID');
  assert.equal(patch.body.options.filter(option=>option.correct).length,1);
  assert.ok(!game.calls.some(call=>call.url.endsWith('/assignment')&&call.method==='POST'),'editing does not silently publish a new class activity');
  const click=async(action,id)=>game.workspace.click({target:{closest:()=>({dataset:{ct:action,id}})}});
  await click('archive','stable-question');
  assert.equal(game.workspace.state.confirm.type,'archive');
  assert.ok(!game.calls.some(call=>call.method==='DELETE'),'archive requires an in-panel confirmation');
  await click('confirm-archive');
  assert.equal(game.calls.find(call=>call.method==='DELETE').url,'/api/campus/teacher/questions/stable-question');
  await click('assignment','class-0');
  await game.submit('assignment',{title:'Explicit next activity'});
  assert.deepEqual(game.calls.find(call=>call.url.endsWith('/assignment')&&call.method==='POST').body,{title:'Explicit next activity'});
  assert.ok(!game.container.innerHTML.includes('test-only'),'the PIN is never rendered back into the workspace');
  const sheet=game.context.window.CampusTeacher.resultSheets([{subjectId:'maths',rows:[{className:'2B',studentNumber:'01',studentName:'Test-only <name>',percent:null},{className:'2B',studentNumber:'02',studentName:'=1+1',percent:75}]}]);
  assert.deepEqual(JSON.parse(JSON.stringify(sheet[0].rows[0])),['班別','學號','學生姓名','學科得分']);
  assert.equal(sheet[0].rows[1][1],'01');assert.equal(sheet[0].rows[1][3],null);
  const bytes=game.context.window.CampusXlsx.buildWorkbook([...sheet,{name:'Maths/long:name?test',rows:[['班別','學號','學生姓名','學科得分'],['2A','03','Test',0]]}]);
  assert.equal(bytes[0],0x50);assert.equal(bytes[1],0x4b,'export is a real ZIP-based XLSX');
  fs.writeFileSync('/tmp/campus-xlsx-test.xlsx',bytes);
  const xml=Buffer.from(bytes).toString('utf8');
  assert.ok(xml.includes('t="inlineStr"'),'student numbers and names are explicit text');
  assert.ok(xml.includes('&lt;name&gt;'),'XML metacharacters are escaped');
  assert.ok(!xml.includes('<f>'),'a formula-looking student name stays text');
  assert.throws(()=>game.context.window.CampusXlsx.buildWorkbook([]));
  game.workspace.destroy();assert.equal(Object.keys(game.container.handlers).length,0,'destroy removes delegated listeners');
  console.log('Teacher workspace: session authorization, explicit class creation, locale labels, scoped results, empty state, XLSX text safety and lifecycle passed.');
})();
