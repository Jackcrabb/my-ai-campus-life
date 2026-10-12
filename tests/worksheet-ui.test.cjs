'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { File } = require('node:buffer');
const source = fs.readFileSync('public/campus/game/worksheet-ui.js','utf8');
const worksheet = (id, subjectId='maths', grade=2, locales=['zh','en']) => ({id,subjectId,grade,title:'Test <worksheet>',files:locales.map(locale=>({locale,url:`/api/campus/worksheets/${id}/${locale}`}))});
const pdf = (name='sample.pdf', size=20, type='application/pdf') => new File(['%PDF-',new Uint8Array(Math.max(0,size-5))],name,{type});
class FormDataFixture {
  constructor(form) { this.values = new Map(Object.entries(form.fields)); }
  get(name) { return this.values.get(name); }
  set(name,value) { this.values.set(name,value); }
}
function formFixture() {
  const form={fields:{title:'',grade:'2',subjectId:'maths',zh:null,en:null},resets:0,matches:selector=>selector==='[data-ws-form]'};
  form.controls=Object.keys(form.fields).map(name=>({name,dataset:{},disabled:false}));
  form.elements={namedItem:name=>({get value(){return form.fields[name];},set value(value){form.fields[name]=value;}})};
  form.reset=()=>{form.resets++;form.fields={title:'',grade:'2',subjectId:'maths',zh:null,en:null};};
  return form;
}
function launch(options={}) {
  const calls=[], prints=[];
  const state={rows:options.rows||[worksheet('both'),worksheet('english','english',2,['en'])],failUpload:false,slow:false};
  const container={html:'',listeners:{},form:null,frame:null,print:null,renders:0,
    addEventListener(name,fn){this.listeners[name]=fn;},removeEventListener(name){delete this.listeners[name];},
    get innerHTML(){return this.html;},set innerHTML(html){
      this.html=html;this.renders++;this.form=null;this.frame=null;this.print=null;
      if(html.includes('class="ws-pdf"')){
        this.frame={events:{},addEventListener(name,fn){this.events[name]=fn;},contentWindow:{focus(){},print(){prints.push('print');}}};
        this.print={dataset:{ws:'print'},disabled:true};
      }
    },
    querySelector(selector){
      if(selector==='[data-ws-form]')return this.form;
      if(selector==='[data-ws-upload-slot]')return{replaceWith:form=>{this.form=form;},set outerHTML(html){container.form=formFixture();container.formHtml=html;}};
      if(selector==='.ws-pdf')return this.frame;
      if(selector==='[data-ws="print"]')return this.print;
      if(selector==='.ws-preview')return{scrollIntoView(){}};
      return null;
    },querySelectorAll(){return[...(this.form?.controls||[]),...(this.print?[this.print]:[])];}
  };
  const context=vm.createContext({window:{},console,File,FormData:FormDataFixture,URLSearchParams,AbortController,Set,
    fetch:async(url,init)=>{
      calls.push({url,...init});
      if(state.slow)return new Promise((resolve,reject)=>{init.signal.addEventListener('abort',()=>{const error=new Error('aborted');error.name='AbortError';reject(error);},{once:true});});
      if(init.method==='POST'&&state.failUpload)return{ok:false,json:async()=>({error:{code:'WORKSHEET_STORAGE',message:'Unavailable'}})};
      return{ok:true,json:async()=>({grade:2,floor:1,worksheets:state.rows})};
    }});
  vm.runInContext(source,context);
  const station=context.window.CampusWorksheets.open({container,floor:1,grade:6,...options});
  const settle=async()=>{for(let i=0;i<8;i++)await new Promise(resolve=>setImmediate(resolve));};
  const click=(action,id,locale)=>station.click({target:{closest:()=>({dataset:{ws:action,id,locale},disabled:action==='print'?!station.previewReady:false})}});
  const change=(filter,value)=>station.change({target:{dataset:{wsFilter:filter},value}});
  const submit=()=>station.submit({preventDefault(){},target:container.form});
  return{station,container,calls,prints,state,context,settle,click,change,submit};
}
(async()=>{
  for(const lang of ['zh','cn','en']){
    const g=launch({lang,rows:[worksheet('both'),worksheet('en-only','english',2,['en']),worksheet('wrong-grade','maths',5),worksheet('wrong-floor','music',2)]});await g.settle();
    assert.equal(g.station.grade,2,'student grade comes from session response');
    assert.equal(g.station.items.length,2,'only server grade and this floor are displayed');
    assert.ok(!g.container.html.includes('data-ws-filter="grade"'),'students have no grade selector');
    assert.ok(g.calls[0].url.endsWith('student/worksheets?floor=1'));
    assert.ok(!g.calls[0].url.includes('grade='),'student cannot request another grade');
    assert.ok(g.container.html.includes('value="chinese"')&&g.container.html.includes('value="maths"'));
    assert.ok(!g.container.html.includes('value="music"'),'dropdown contains this floor only');
    assert.ok(g.container.html.includes('Test &lt;worksheet&gt;'),'titles are escaped');
    g.click('select','en-only','zh');assert.equal(g.station.selected,null,'unavailable file cannot be selected');
    g.click('select','en-only','en');assert.equal(g.station.selected.locale,'en');
    assert.equal(g.prints.length,0,'selection does not print');
    g.click('print');assert.equal(g.prints.length,0,'printing waits for preview load');
    const stale=g.container.frame;g.click('select','both','zh');
    stale.events.load();assert.equal(g.station.previewReady,false,'late previous frame cannot enable a different PDF');
    g.container.frame.events.load();assert.equal(g.station.previewReady,true);
    assert.equal(g.prints.length,0,'loading never prints automatically');
    g.click('print');assert.equal(g.prints.length,1,'only an explicit action calls the iframe print method');
    assert.ok(g.container.html.includes('download=1')&&g.container.html.includes('target="_blank"'));
    const count=g.calls.length;g.change('subject','english');assert.equal(g.calls.length,count,'student subject filter uses the permitted floor response');
    assert.equal(g.station.selected,null);assert.ok(!g.container.html.includes('data-id="both"'));
    g.change('grade','5');assert.equal(g.station.grade,2,'student grade changes are rejected');
    g.change('subject','music');assert.equal(g.station.subject,'english','off-floor subject changes are rejected');
    g.station.destroy();assert.equal(Object.keys(g.container.listeners).length,0);assert.ok(g.station.abort.signal.aborted);
  }
  const scopes=[]; const scoped=launch({mode:'teacher',grade:2,subjectId:'maths',fixedSubject:true,onScopeChange:value=>scopes.push(value)});await scoped.settle();
  assert.ok(!scoped.container.html.includes('value="english"'),'subject hub limits the worksheet dropdown to its chosen subject');
  assert.ok(!scoped.container.html.includes('value=""'),'subject hub has no all-subject escape');
  scoped.change('subject','english');assert.equal(scoped.station.subject,'maths');
  scoped.change('subject','');assert.equal(scoped.station.subject,'maths');
  await scoped.change('grade','4');await scoped.settle();assert.equal(scopes.at(-1).grade,4);
  Object.assign(scoped.container.form.fields,{title:'Scoped upload',grade:'4',subjectId:'english',zh:pdf()});
  await scoped.submit();assert.equal(scoped.calls.find(c=>c.method==='POST').body.get('subjectId'),'maths','upload remains in the selected teaching subject');
  scoped.station.destroy();
  const t=launch({mode:'teacher',grade:2,subjectId:'maths'});await t.settle();
  const form=t.container.form;Object.assign(form.fields,{title:'Retain my draft',zh:pdf(),en:null});
  const selected=form.fields.zh;t.state.failUpload=true;await t.submit();
  assert.equal(t.container.form,form,'failed uploads retain the actual form node');
  assert.equal(form.fields.title,'Retain my draft');assert.equal(form.fields.zh,selected,'browser FileList need not be reconstructed');
  assert.equal(form.resets,0);assert.ok(form.controls.every(c=>!c.disabled),'fields are re-enabled after failure');
  assert.ok(t.container.html.includes('ws-error'));
  const postCount=()=>t.calls.filter(c=>c.method==='POST').length;
  let previous=postCount();form.fields.zh=pdf('too-large.pdf',5*1024*1024+1);await t.submit();assert.equal(postCount(),previous,'oversized PDF is not sent');
  form.fields.zh=null;form.fields.en=null;await t.submit();assert.equal(postCount(),previous,'at least one language file required');
  form.fields.zh=new File(['not a PDF'],'renamed.pdf',{type:'application/pdf'});await t.submit();assert.equal(postCount(),previous,'renamed non-PDF fails signature check');
  form.fields.zh=pdf('wrong-mime.pdf',20,'text/plain');await t.submit();assert.equal(postCount(),previous,'wrong MIME is rejected');
  form.fields.zh=new File([],'empty.pdf',{type:'application/pdf'});await t.submit();assert.equal(postCount(),previous,'selected empty file is rejected');
  t.state.failUpload=false;Object.assign(form.fields,{title:'Two languages',zh:pdf('traditional.pdf',5*1024*1024),en:pdf('english.pdf',5*1024*1024)});
  await t.submit();assert.equal(postCount(),previous+1,'two PDFs at exactly 5 MB each are accepted');
  assert.equal(form.resets,1);assert.equal(form.fields.zh,null);assert.equal(form.fields.title,'','successful POST clears draft');
  assert.equal(t.container.form,form);assert.ok(form.controls.every(c=>!c.disabled));
  Object.assign(form.fields,{title:'English only',zh:null,en:pdf('english.pdf')});await t.submit();assert.equal(postCount(),previous+2,'English-only upload works');
  Object.assign(form.fields,{title:'Traditional only',zh:pdf(),en:null});await t.submit();assert.equal(postCount(),previous+3,'Traditional-only upload works');
  const post=t.calls.find(c=>c.method==='POST');assert.equal(post.credentials,'same-origin');assert.ok(!post.headers['content-type'],'browser creates multipart boundary');
  t.click('delete','both');assert.equal(t.calls.filter(c=>c.method==='DELETE').length,0,'delete requires in-panel confirmation');
  t.click('confirm','both');await t.click('delete','both');assert.equal(t.calls.filter(c=>c.method==='DELETE').length,1);
  t.state.slow=true;const pending=t.station.load();const renders=t.container.renders;t.station.destroy();await pending;
  assert.equal(t.container.renders,renders,'aborted completion cannot render a destroyed station');assert.equal(Object.keys(t.container.listeners).length,0);
  console.log('PASS worksheet UI: 3 locales, server grade/floor scope, available-language selection, explicit load-gated print, download/open fallback, retained draft, PDF signature/size validation, one/both languages, confirmed deletion, request abort and cleanup.');
})().catch(error=>{console.error(error);process.exitCode=1;});
