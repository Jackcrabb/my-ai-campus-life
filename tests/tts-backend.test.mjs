import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { Miniflare } from 'miniflare';
import ts from 'typescript';

// Real isolated D1/R2, wholly mocked speech provider. This suite cannot spend.
const root = path.resolve(import.meta.dirname, '..'), temp = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-tts-test-'));
fs.mkdirSync(path.join(temp, 'lib')); fs.mkdirSync(path.join(temp, 'data'));
const tri = text => ({ zh: text, cn: text, en: text });
const fixture = { id:'tts-maths',grade:2,subjectId:'maths',roomId:'maths',category:'subject',level:'foundation',stars:1,maxScore:1,title:tri('Ratios'),question:tri('Compare three parts to two parts.'),options:[{id:'a',text:tri('Three to two.'),correct:true,feedback:tri('Correct.')},{id:'b',text:tri('Two to three.'),correct:false,feedback:tri('Check the order.')}],takeaway:tri('The order matters.') };
fs.writeFileSync(path.join(temp, 'data/grade-bank.json'), JSON.stringify([fixture]));
for (const file of ['starter-bank-previous-hashes.json', 'tts-script-catalog.json']) fs.copyFileSync(path.join(root, 'data', file), path.join(temp, 'data', file));
for (const file of fs.readdirSync(path.join(root, 'lib')).filter(name => /^campus-.*\.ts$/.test(name))) fs.writeFileSync(path.join(temp, 'lib', file.replace('.ts', '.js')), ts.transpileModule(fs.readFileSync(path.join(root, 'lib', file), 'utf8'), { compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true} }).outputText);
const require = createRequire(path.join(temp, 'test.cjs'));
const { handleCampus } = require(path.join(temp, 'lib/campus-api.js'));
const { handleTts } = require(path.join(temp, 'lib/campus-tts.js'));
const { CampusError } = require(path.join(temp, 'lib/campus-types.js'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/tts-script-catalog.json'), 'utf8'));
const model = 'minimax/speech-2.8-turbo';
const voices = { zh:'fixture-yue',cn:'fixture-mandarin',en:'fixture-english' };
const config = { schemaVersion:1,models:{[model]:{billing:'characters',usdPerMillionCharacters:60,priceReviewedAt:'2026-10-10',voices:Object.fromEntries(Object.entries(voices).map(([locale,voice])=>[locale,[voice]]))}},cast:Object.fromEntries(catalog.lines.map(line=>[line.characterId,Object.fromEntries(Object.entries(voices).map(([locale,voice])=>[locale,{model,voice,reviewed:{locale,gender:line.gender,date:'2026-10-10'}}]))])) };
const worker = new Miniflare({ modules:true,script:"export default {fetch(){return new Response('test')}}",compatibilityDate:'2026-05-01',d1Databases:{DB:'speech-test'},r2Buckets:['BUCKET'] });
const oldFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error('Unmocked network is forbidden in speech tests.'); };
let checks = 0, calls = [];
try {
  const db = await worker.getD1Database('DB'), bucket = await worker.getR2Bucket('BUCKET');
  for (const file of fs.readdirSync(path.join(root,'drizzle')).filter(f=>f.endsWith('.sql')).sort()) for (const statement of fs.readFileSync(path.join(root,'drizzle',file),'utf8').split('--> statement-breakpoint').filter(s=>s.trim())) await db.exec(statement.replace(/\n/g,' '));
  const env = { TEACHER_EMAILS:'teacher@example.invalid,other@example.invalid',TEACHER_PIN:'1234' };
  const base = {db,bucket,env,teacher:null,now:Date.parse('2026-10-11T10:00:00Z'),localDevelopment:false};
  const teacher = {...base,teacher:{userId:'teacher-a',email:'teacher@example.invalid'}};
  const other = {...base,teacher:{userId:'teacher-b',email:'other@example.invalid'}};
  const request = (route, body, cookie='') => new Request('https://campus.test/api/campus/'+route,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json',origin:'https://campus.test',cookie},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const campus = async (route, body, context=teacher, cookie='') => { const response=await handleCampus(request(route,body,cookie),context); assert.ok(response.ok,await response.clone().text()); return {data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]||cookie}; };
  const cookie=(await campus('teacher/unlock',{pin:'1234'})).cookie;
  const otherCookie=(await campus('teacher/unlock',{pin:'1234'},other)).cookie;
  const mp3 = new Uint8Array([73,68,51,4,0,0,0,0,0,1,255,251]);
  const mock = async (url, init) => { assert.equal(url,'https://openrouter.ai/api/v1/audio/speech');assert.equal(init.redirect,'manual');assert.equal(init.headers.authorization,'Bearer test-only-never-valid');calls.push(JSON.parse(init.body));return new Response(mp3,{headers:{'content-type':'audio/mpeg','x-generation-id':'fixture-generation'}}); };
  let provider = mock;
  const call = async (route, {body,context=teacher,auth=cookie,status=200,origin}={}) => {
    const req=request(route,body,auth);if(origin)req.headers.set('origin',origin);
    let response;try{response=await handleTts(req,context,provider);}catch(error){if(!(error instanceof CampusError))throw error;response=Response.json({error:{code:error.code,message:error.message}},{status:error.status});}
    assert.equal(response.status,status,await response.clone().text());checks++;
    return {response,data:response.headers.get('content-type')?.includes('json')?await response.json():new Uint8Array(await response.arrayBuffer())};
  };
  const source=id=>({kind:'script',id:'sample-'+id});
  const payload=(id='staff-chinese',locale='zh',extra={})=>({idempotencyKey:crypto.randomUUID(),locale,source:source(id),confirmNoPersonalData:true,...extra});
  const reset=async()=>{calls=[];provider=mock;await db.batch(['DELETE FROM campus_speech_requests','DELETE FROM campus_speech_clips','DELETE FROM campus_rate_limits'].map(sql=>db.prepare(sql)));};
  const enable=()=>Object.assign(env,{OPENROUTER_API_KEY:'test-only-never-valid',CAMPUS_TTS_ENABLED:'1',CAMPUS_TTS_MODE:'BUDGETED',CAMPUS_TTS_AUDITION_ONLY:'0',CAMPUS_TTS_CONFIG:JSON.stringify(config),CAMPUS_TTS_DAILY_REQUESTS:'100',CAMPUS_TTS_DAILY_CHARACTERS:'100000',CAMPUS_TTS_DAILY_USD:'10'});

  const publicCatalog=(await call('tts/catalog',{context:base,auth:''})).data;
  assert.equal(publicCatalog.scripts.length,20);
  for(const line of publicCatalog.scripts)for(const locale of ['zh','cn','en'])assert.ok(line.text[locale].length>10);
  assert.equal((await call('teacher/tts/status')).data.enabled,false);
  await call('teacher/tts/status',{context:base,auth:'',status:403});
  await call('teacher/tts/generate',{body:payload(),context:base,auth:'',status:403});
  await call('teacher/tts/generate',{body:payload(),auth:'',status:401});
  await call('teacher/tts/generate',{body:payload(),status:503});
  assert.equal(calls.length,0,'no provider request while disabled');
  enable();
  const quote=(await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=zh')).data;
  assert.equal(quote.generationTriggered,false);assert.equal(quote.clip,null);assert.ok(quote.reservedUsdIfGenerated>0);
  assert.equal(calls.length,0,'previewing an estimate never calls the provider');
  for(const invalid of [
    {...config,models:{[model]:{...config.models[model],billing:'seconds'}}},
    {...config,models:{[model]:{...config.models[model],priceReviewedAt:'2020-01-01'}}},
    {...config,cast:{'staff-chinese':{zh:{model,voice:'not-in-locale-allowlist'}}}},
    {...config,cast:{'staff-chinese':{zh:{model,voice:voices.zh}}}},
    {...config,cast:{'staff-chinese':{zh:{model,voice:voices.zh,reviewed:{locale:'zh',gender:'male',date:'2026-10-10'}}}}},
    {...config,cast:{'staff-chinese':{zh:{model,voice:voices.zh,reviewed:{locale:'cn',gender:'female',date:'2026-10-10'}}}}},
  ]){env.CAMPUS_TTS_CONFIG=JSON.stringify(invalid);await call('teacher/tts/generate',{body:payload(),status:503});}
  enable();
  await call('teacher/tts/generate',{body:payload(),origin:'https://evil.invalid',status:403});
  await call('teacher/tts/generate',{body:payload('staff-chinese','zh',{input:'arbitrary student data'}),status:400});
  await call('teacher/tts/generate',{body:payload('staff-chinese','zh',{voice:'client-choice'}),status:400});
  await call('teacher/tts/generate',{body:payload('staff-chinese','zh',{confirmNoPersonalData:false}),status:400});
  await call('teacher/tts/generate',{body:payload('staff-chinese','zh',{source:{kind:'reflection',id:'student-a'}}),status:400});
  assert.equal(calls.length,0);
  const initial=payload(), generated=(await call('teacher/tts/generate',{body:initial,status:201})).data;
  assert.equal(calls.length,1);
  assert.equal(calls[0].provider.options.minimax.language_boost,'Chinese,Yue');
  assert.equal(calls[0].voice,voices.zh);
  assert.equal(calls[0].response_format,'mp3');
  assert.ok(!JSON.stringify(generated).includes(env.OPENROUTER_API_KEY));
  assert.equal(generated.clip.status,'review','budgeted generation also requires exact-clip review');
  assert.equal((await call('teacher/tts/status')).data.reviewRequired,true);
  assert.equal(quote.reviewRequired,true);
  await call('audio/'+generated.clip.hash,{context:base,auth:'',status:404});
  assert.equal((await call('tts/lookup?sourceId=sample-staff-chinese&locale=zh',{context:base,auth:''})).data.clip,null);
  const paidApproval={locale:'zh',gender:'female',languageAndDialect:true,numbers:true,wording:true};
  await call('teacher/tts/'+generated.clip.hash+'/approve',{body:{...paidApproval,numbers:false},status:400});
  await call('teacher/tts/'+generated.clip.hash+'/approve',{body:paidApproval});
  assert.equal(calls.length,1,'review never generates audio');
  assert.equal((await call('teacher/tts/generate',{body:initial})).data.cached,true);
  assert.equal((await call('teacher/tts/generate',{body:payload()})).data.cached,true);
  await call('teacher/tts/generate',{body:{...initial,locale:'cn'},status:409});
  assert.equal(calls.length,1,'cache and idempotency conflict never cause a second paid request');
  const publicAudio=await call('audio/'+generated.clip.hash,{context:base,auth:''});
  assert.deepEqual(publicAudio.data,mp3);
  assert.match(publicAudio.response.headers.get('cache-control'),/^public/);
  assert.equal((await call('tts/lookup?sourceId=sample-staff-chinese&locale=zh',{context:base,auth:''})).data.clip.hash,generated.clip.hash);
  await call('audio/'+'f'.repeat(64),{context:base,auth:'',status:404});
  assert.equal(calls.length,1,'student/guest playback is lookup-only');
  for(const locale of ['cn','en'])await call('teacher/tts/generate',{body:payload('staff-chinese',locale),status:201});
  assert.deepEqual(calls.map(c=>c.provider.options.minimax.language_boost),['Chinese,Yue','Chinese','English']);

  // Separate requests and separate workers share the D1 acquisition, not a
  // process-local Promise map. Hold the first response while a second arrives.
  await reset();let release,entered;const enteredPromise=new Promise(resolve=>entered=resolve);
  provider=async(url,init)=>{calls.push(JSON.parse(init.body));entered();await new Promise(resolve=>release=resolve);return new Response(mp3,{headers:{'content-type':'audio/mpeg'}});};
  const first=call('teacher/tts/generate',{body:payload(),status:201});await enteredPromise;
  const pending=(await call('teacher/tts/generate',{body:payload(),status:202})).data;
  assert.equal(pending.clip.status,'pending');assert.equal(calls.length,1);
  release();await first;
  assert.equal((await call('teacher/tts/status')).data.reserved.requests,1);

  // Simultaneous different clips cannot overshoot any of the three budgets.
  for(const dimension of ['requests','characters','usd']) {
    await reset();enable();
    const a=catalog.lines.find(l=>l.characterId==='staff-chinese').text.zh.length,b=catalog.lines.find(l=>l.characterId==='staff-maths').text.zh.length;
    if(dimension==='requests')env.CAMPUS_TTS_DAILY_REQUESTS='1';
    if(dimension==='characters')env.CAMPUS_TTS_DAILY_CHARACTERS=String(Math.max(a,b));
    if(dimension==='usd')env.CAMPUS_TTS_DAILY_USD=String(Math.max(a,b)*60/1e6);
    const raw=async body=>{try{return await handleTts(request('teacher/tts/generate',body,cookie),teacher,provider);}catch(e){return new Response(e.code,{status:e.status});}};
    const outcomes=await Promise.all([raw(payload()),raw(payload('staff-maths'))]);
    assert.deepEqual(outcomes.map(r=>r.status).sort(),[201,429],dimension+' limit is atomic');checks++;
    assert.equal(calls.length,1);
  }
  await reset();enable();env.CAMPUS_TTS_DAILY_USD='0';await call('teacher/tts/generate',{body:payload(),status:503});assert.equal(calls.length,0);
  enable();
  // A network failure, invalid MP3, rejection or storage failure is never retried
  // implicitly, even with a new idempotency key and even on the next UTC day.
  for(const failure of ['network','mime','bytes','status','redirect','storage']) {
    await reset();
    provider=async()=>{calls.push(failure);if(failure==='network')throw new TypeError('secret upstream detail');return new Response(failure==='bytes'?'not MP3':mp3,{status:failure==='status'?429:failure==='redirect'?307:200,headers:{'content-type':failure==='mime'?'application/json':'audio/mpeg',...(failure==='redirect'?{location:'https://different-provider.invalid/speech'}:{})}});};
    const context=failure==='storage'?{...teacher,bucket:{put:async()=>{throw new Error('private storage detail');}}}:teacher;
    const failed=await call('teacher/tts/generate',{body:payload(),context,status:502});
    assert.ok(!JSON.stringify(failed.data).includes('private')&&!JSON.stringify(failed.data).includes('secret'));
    await call('teacher/tts/generate',{body:payload(),status:409});
    const tomorrow={...teacher,now:teacher.now+86400000};
    const tomorrowCookie=(await campus('teacher/unlock',{pin:'1234'},tomorrow)).cookie;
    await call('teacher/tts/generate',{body:payload(),context:tomorrow,auth:tomorrowCookie,status:409});
    assert.equal(calls.length,1);
    assert.equal((await call('teacher/tts/status')).data.reserved.requests,1,'uncertain charges retain budget');
  }

  await reset();enable();
  const classes=(await campus('teacher/classes',{seedDefault:true,schoolYear:'2026-27'},teacher,cookie)).data.classes;
  const classA=classes.find(c=>c.grade===2&&c.section==='A'),classB=classes.find(c=>c.grade===2&&c.section==='B');
  const studentA=await campus('student/join',{classCode:classA.classCode,studentNumber:'1',name:'Fictional Pupil A'},base);
  const studentB=await campus('student/join',{classCode:classB.classCode,studentNumber:'1',name:'Fictional Pupil B'},base);
  const question=await db.prepare("SELECT id FROM campus_questions WHERE owner_id='teacher-a' AND source_id='tts-maths'").first();
  const questionSource={kind:'question',id:question.id,revision:1,part:'question',classroomId:classA.id};
  const questionBody=()=>payload('staff-maths','en',{source:questionSource});
  const beforeQuestion=calls.length;
  for(const locale of ['zh','cn','en'])for(const part of ['question','option:a','takeaway','feedback:a']){
    const body=payload('staff-maths',locale,{source:{...questionSource,part}});
    const denied=await call('teacher/tts/generate',{body,status:410});assert.equal(denied.data.error.code,'TTS_SUBJECT_AUDIO_DISABLED');
    const quotePath='teacher/tts/quote?'+new URLSearchParams({sourceKind:'question',sourceId:question.id,revision:'1',part,locale});
    assert.equal((await call(quotePath,{status:410})).data.error.code,'TTS_SUBJECT_AUDIO_DISABLED');
  }
  assert.equal(calls.length,beforeQuestion,'no question, option or feedback reaches synthesis');
  assert.equal((await call('teacher/tts/status')).data.reserved.requests,0,'rejected academic sources create no reservations');
  // Teacher question creation and editing remain entirely independent of audio.
  const created=(await campus('teacher/questions',{...fixture,status:'draft'},teacher,cookie)).data.question;
  const patch=new Request('https://campus.test/api/campus/teacher/questions/'+created.id,{method:'PATCH',headers:{'content-type':'application/json',origin:'https://campus.test',cookie},body:JSON.stringify({...created,question:tri('A revised silent teaching question.'),expectedRevision:created.revision})});
  const edited=await handleCampus(patch,teacher);assert.equal(edited.status,200);checks++;
  assert.equal(calls.length,beforeQuestion,'teacher mutations never generate speech');
  // Preserve old ledger and R2 data, but prevent every route from publishing or
  // playing a pre-policy question clip, including one formerly marked ready.
  const legacy=(await call('teacher/tts/generate',{body:payload('staff-maths','en'),status:201})).data.clip;
  await db.prepare("UPDATE campus_speech_clips SET source_kind='question',source_id=?,scope='class',classroom_id=?,part='option:a' WHERE hash=?").bind(question.id,classA.id,legacy.hash).run();
  await call('teacher/tts/'+legacy.hash+'/approve',{body:{...paidApproval,locale:'en',gender:'male'},status:410});
  await call('teacher/tts/lookup?hash='+legacy.hash,{status:410});
  await db.prepare("UPDATE campus_speech_clips SET status='ready' WHERE hash=?").bind(legacy.hash).run();
  for(const viewer of [{},{context:base,auth:studentA.cookie},{context:base,auth:studentB.cookie},{context:base,auth:''}])await call('audio/'+legacy.hash,{...viewer,status:410});
  const lookup='student/tts?questionId='+question.id+'&revision=1&locale=en';
  await call(lookup,{context:base,auth:studentA.cookie,status:410});
  assert.equal((await db.prepare('SELECT status FROM campus_speech_clips WHERE hash=?').bind(legacy.hash).first()).status,'ready','rejection preserves the historical row');
  assert.ok(await bucket.head('speech/'+legacy.hash+'.mp3'),'rejection preserves the stored file');
  assert.equal(calls.length,beforeQuestion+1,'only the fixed-script fixture used the mocked provider');

  // Free-only is a separate fail-closed protocol. Provider-default auditions
  // cannot be promoted, and no claim about dialect follows from a script.
  const freeModel='fish-audio/s2.1-pro-free:free',defaultVoice='__provider_default__';
  const freeConfig=(audition=true)=>({schemaVersion:1,models:{[freeModel]:{billing:'free',usdPerMillionCharacters:0,priceReviewedAt:'2026-10-10',voices:Object.fromEntries(['zh','cn','en'].map(locale=>[locale,[audition?defaultVoice:'fixture-reviewed-'+locale]]))}},cast:Object.fromEntries(catalog.lines.map(line=>[line.characterId,Object.fromEntries(['zh','cn','en'].map(locale=>[locale,{model:freeModel,voice:audition?defaultVoice:'fixture-reviewed-'+locale,...(audition?{}:{reviewed:{locale,gender:line.gender,date:'2026-10-10'}})}]))]))});
  let catalogueCalls=0,catalogueEntry;
  const freeMock=async(url,init)=>{
    if(init.method==='GET'){
      assert.equal(url,'https://openrouter.ai/api/v1/models?output_modalities=speech');
      assert.equal(init.redirect,'manual');assert.equal(init.cache,'no-store');
      assert.equal(init.headers.authorization,undefined,'public catalogue lookup receives no API key');
      catalogueCalls++;return Response.json({data:[catalogueEntry]});
    }
    return mock(url,init);
  };
  const enableFree=(audition=true)=>{
    enable();Object.assign(env,{CAMPUS_TTS_MODE:'FREE_ONLY',CAMPUS_TTS_AUDITION_ONLY:audition?'1':'0',CAMPUS_TTS_CONFIG:JSON.stringify(freeConfig(audition)),CAMPUS_TTS_DAILY_USD:'0'});
    catalogueEntry={id:freeModel,architecture:{output_modalities:['speech']},pricing:{prompt:'0',completion:'0'},supported_voices:null};
    catalogueCalls=0;provider=freeMock;
  };
  await reset();enableFree();
  delete env.CAMPUS_TTS_MODE;
  const freeStatus=(await call('teacher/tts/status')).data;
  assert.equal(freeStatus.mode,'FREE_ONLY');assert.equal(freeStatus.enabled,true);assert.equal(freeStatus.limits.usd,0);assert.equal(freeStatus.livePriceCheckRequired,true);
  const freeQuote=(await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=en')).data;
  assert.equal(freeQuote.reservedUsdIfGenerated,0);assert.equal(freeQuote.auditionOnly,true);assert.equal(freeQuote.expectedGender,'female');assert.equal(catalogueCalls,0,'quotes never generate or fetch live prices');
  const audition=(await call('teacher/tts/generate',{body:payload('staff-chinese','en'),status:201})).data.clip;
  assert.equal(audition.status,'review');assert.equal(audition.scope,'teacher');assert.equal(audition.auditionOnly,true);assert.equal(audition.reviewed,false);
  assert.equal(calls.length,1);assert.equal(catalogueCalls,1);assert.equal(calls[0].model,freeModel);assert.equal(calls[0].voice,undefined);assert.equal(calls[0].input_references,undefined);assert.equal(calls[0].models,undefined);
  assert.equal((await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=en')).data.clip.hash,audition.hash);
  assert.match((await call('audio/'+audition.hash)).response.headers.get('cache-control'),/^private, no-store$/);
  for(const viewer of [{context:base,auth:''},{context:other,auth:otherCookie},{context:base,auth:studentA.cookie}])await call('audio/'+audition.hash,{...viewer,status:404});
  assert.equal((await call('tts/lookup?sourceId=sample-staff-chinese&locale=en',{context:base,auth:''})).data.clip,null);
  assert.equal((await call('teacher/tts/lookup?hash='+audition.hash,{context:other,auth:otherCookie})).data.clip,null);
  await call('teacher/tts/'+audition.hash+'/approve',{body:{},status:409});
  await call('teacher/tts/generate',{body:questionBody(),status:410});
  await call('teacher/tts/generate',{body:payload('staff-chinese','en',{input_references:[{audio:'unlicensed'}]}),status:400});
  await call('teacher/tts/generate',{body:payload('staff-chinese','en')});
  assert.equal(catalogueCalls,1);assert.equal(calls.length,1,'cached private audition never regenerates');
  assert.equal((await call('teacher/tts/status')).data.reserved.usd,0);

  // This exact default Fish voice failed the owner's Cantonese audition.
  // Suspend it by code as well as runtime settings; no provider call is needed.
  delete env.CAMPUS_TTS_BLOCKED_LOCALES;
  const blockedStatus=(await call('teacher/tts/status')).data;
  assert.equal(blockedStatus.enabled,true,'other languages remain enabled');
  assert.deepEqual(blockedStatus.allowedSourceKinds,['script']);assert.equal(blockedStatus.subjectSpeechEnabled,false);
  assert.deepEqual(blockedStatus.blockedLocales,[{locale:'zh',reason:'dialect_unverified'}]);
  const beforeBlockedCalls=calls.length,beforeBlockedCatalogue=catalogueCalls;
  const blockedQuote=await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=zh',{status:503});
  assert.equal(blockedQuote.data.error.code,'TTS_DIALECT_UNVERIFIED');
  await call('teacher/tts/generate',{body:payload(),status:503});
  await call('tts/lookup?sourceId=sample-staff-chinese&locale=zh',{context:base,auth:'',status:503});
  assert.equal(calls.length,beforeBlockedCalls,'suspended Cantonese never reaches synthesis');
  assert.equal(catalogueCalls,beforeBlockedCatalogue,'suspended Cantonese needs no provider request');
  assert.equal((await call('teacher/tts/status')).data.reserved.requests,1,'blocking preserves the existing reservation');
  for(const locale of ['cn','en']){
    await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale='+locale);
    const remaining=(await call('teacher/tts/generate',{body:payload('staff-chinese',locale),status:locale==='en'?200:201})).data.clip;
    await call('audio/'+remaining.hash);
  }
  // Recreate a stored pre-fix zh audition without a provider call. It remains
  // inaccessible even after the current config switches to another model.
  await db.prepare("UPDATE campus_speech_clips SET locale='zh' WHERE hash=?").bind(audition.hash).run();
  enable();
  assert.equal((await call('teacher/tts/lookup?hash='+audition.hash)).data.clip,null);
  await call('audio/'+audition.hash,{status:503});
  await call('teacher/tts/'+audition.hash+'/approve',{body:{},status:503});
  env.CAMPUS_TTS_BLOCKED_LOCALES='zh';
  assert.deepEqual((await call('teacher/tts/status')).data.blockedLocales,[{locale:'zh',reason:'dialect_unverified'}],'explicit operator block also applies to other configured providers');
  await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=zh',{status:503});
  delete env.CAMPUS_TTS_BLOCKED_LOCALES;
  for(const mode of ['FREE_ONLY','BUDGETED']){
    if(mode==='FREE_ONLY')enableFree();else enable();
    for(const locale of ['zh','cn','en'])await call('teacher/tts/generate',{body:payload('staff-maths',locale,{source:questionSource}),status:410});
  }

  // Absent/incorrect server-reviewed locale and gender never reach the provider.
  for(const variation of ['missing','gender','locale','default','paid-model','nonzero-usd','missing-caps']){
    await reset();enableFree(false);const changed=freeConfig(false);
    if(variation==='missing')delete changed.cast['staff-chinese'].zh.reviewed;
    if(variation==='gender')changed.cast['staff-chinese'].zh.reviewed.gender='male';
    if(variation==='locale')changed.cast['staff-chinese'].zh.reviewed.locale='cn';
    if(variation==='default'){changed.models[freeModel].voices.zh.push(defaultVoice);changed.cast['staff-chinese'].zh.voice=defaultVoice;}
    if(variation==='paid-model')changed.models={'fish-audio/s2.1-pro':changed.models[freeModel]};
    if(variation==='nonzero-usd')env.CAMPUS_TTS_DAILY_USD='0.01';
    if(variation==='missing-caps')env.CAMPUS_TTS_DAILY_REQUESTS='0';
    env.CAMPUS_TTS_CONFIG=JSON.stringify(changed);
    await call('teacher/tts/generate',{body:payload(),status:503});assert.equal(calls.length,0,variation);assert.equal(catalogueCalls,0,variation);
  }

  // Review is per actual clip. Correct metadata does not automatically publish
  // provider output; guest/student reads remain impossible before approval.
  await reset();enableFree(false);
  const candidate=(await call('teacher/tts/generate',{body:payload(),status:201})).data.clip;
  assert.equal(candidate.status,'review');assert.equal(candidate.auditionOnly,false);assert.equal(candidate.scope,'public');
  assert.equal(calls[0].voice,'fixture-reviewed-zh');
  await call('audio/'+candidate.hash,{context:base,auth:'',status:404});
  await call('audio/'+candidate.hash,{context:other,auth:otherCookie,status:404});
  assert.match((await call('audio/'+candidate.hash)).response.headers.get('cache-control'),/^private/);
  assert.equal((await call('teacher/tts/lookup?hash='+candidate.hash,{context:other,auth:otherCookie})).data.clip,null);
  assert.equal((await call('teacher/tts/quote?sourceKind=script&sourceId=sample-staff-chinese&locale=zh',{context:other,auth:otherCookie})).data.clip,null);
  await call('teacher/tts/generate',{body:payload(),context:other,auth:otherCookie,status:409});
  const approval={locale:'zh',gender:'female',languageAndDialect:true,numbers:true,wording:true};
  await call('teacher/tts/'+candidate.hash+'/approve',{body:approval,context:other,auth:otherCookie,status:404});
  for(const invalid of [{...approval,locale:'cn'},{...approval,gender:'male'},{...approval,numbers:false},{...approval,wording:false},{...approval,languageAndDialect:false}])await call('teacher/tts/'+candidate.hash+'/approve',{body:invalid,status:400});
  const approved=(await call('teacher/tts/'+candidate.hash+'/approve',{body:approval})).data;
  assert.equal(approved.clip.status,'ready');assert.equal(approved.clip.reviewed,true);assert.equal(approved.generationTriggered,false);
  assert.match((await call('audio/'+candidate.hash,{context:base,auth:''})).response.headers.get('cache-control'),/^public/);
  assert.equal((await call('tts/lookup?sourceId=sample-staff-chinese&locale=zh',{context:base,auth:''})).data.clip.hash,candidate.hash);
  assert.equal(calls.length,1);assert.equal(catalogueCalls,1,'approval and playback never call the provider');

  await call('teacher/tts/generate',{body:questionBody(),status:410});
  assert.equal(calls.length,1,'verified voices do not re-enable academic question speech');

  // Price changes, additional nonzero charges, missing models and lookup failure
  // all stop before POST. A text label or :free suffix alone is insufficient.
  for(const variation of ['prompt','completion','request','missing-price','missing-model','not-speech','network','invalid-json','redirect']){
    await reset();enableFree();
    if(['prompt','completion','request'].includes(variation))catalogueEntry.pricing[variation]='0.000001';
    if(variation==='missing-price')delete catalogueEntry.pricing.completion;
    if(variation==='missing-model')catalogueEntry.id='fish-audio/s2.1-pro';
    if(variation==='not-speech')catalogueEntry.architecture.output_modalities='speech';
    if(variation==='network')provider=async()=>{catalogueCalls++;throw new Error('private network detail');};
    if(variation==='invalid-json')provider=async()=>{catalogueCalls++;return new Response('not json');};
    if(variation==='redirect')provider=async()=>{catalogueCalls++;return new Response(null,{status:307,headers:{location:'https://different-provider.invalid/models'}});};
    const denied=await call('teacher/tts/generate',{body:payload('staff-chinese','en'),status:503});
    assert.match(denied.data.error.code,/TTS_FREE_PRICE/);assert.equal(calls.length,0,variation+' never sends synthesis POST');
    await call('teacher/tts/generate',{body:payload('staff-chinese','en'),status:409});
    assert.equal(catalogueCalls,1,'failed price check never auto-retries');
  }
  for(const dimension of ['requests','characters']){
    await reset();enableFree();
    const lengths=['staff-chinese','staff-maths'].map(id=>catalog.lines.find(line=>line.characterId===id).text.en.length);
    if(dimension==='requests')env.CAMPUS_TTS_DAILY_REQUESTS='1';else env.CAMPUS_TTS_DAILY_CHARACTERS=String(Math.max(...lengths));
    const raw=async body=>{try{return await handleTts(request('teacher/tts/generate',body,cookie),teacher,provider);}catch(e){return new Response(e.code,{status:e.status});}};
    const outcomes=await Promise.all([raw(payload('staff-chinese','en')),raw(payload('staff-maths','en'))]);
    assert.deepEqual(outcomes.map(r=>r.status).sort(),[201,429],dimension+' free limit is atomic');checks++;
    assert.equal(calls.length,1);assert.equal(catalogueCalls,1);assert.equal((await call('teacher/tts/status')).data.reserved.usd,0);
  }
  console.log(`PASS speech backend: ${checks} real D1/R2 route checks; authentication, default-off, scoped MP3, singleflight, atomic caps, fixed-script-only sources, disabled academic speech and preserved legacy data, free-only exact live zero-price checks, private auditions, per-clip language/gender/numbers review and no automatic retries. Upstream is mocked; no audible or live-provider verification.`);
} finally {
  globalThis.fetch=oldFetch;
  await worker.dispose();fs.rmSync(temp,{recursive:true,force:true});
}
