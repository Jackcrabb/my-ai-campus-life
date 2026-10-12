'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../public/campus/game/campus-audio.js'),'utf8');
function launch({voices,stored,tts=true,audio=true,storageFails=false,gesture=true,cancelRace=false,voiceGenderHints={},fixedVoices,characters,mediaSupported=true}={}){
  let now=0,nextTimer=0,storedText=stored===undefined?null:JSON.stringify(stored);const timers=new Map(),docListeners=new Map(),speechListeners=new Map(),contexts=[],utterances=[],states=[],media=[];
  const document={hidden:false,addEventListener(k,fn){docListeners.set(k,fn);},removeEventListener(k){docListeners.delete(k);}};
  let lastCancelled=-Infinity;const synth={voices:voices||[{name:'Cantonese Local',lang:'zh-HK',localService:true,voiceURI:'hk-local'},{name:'Mandarin Local',lang:'zh-CN',localService:true,voiceURI:'cn-local'},{name:'British Local',lang:'en-GB',localService:true,voiceURI:'gb-local'}],cancels:0,
    getVoices(){return this.voices;},speak(u){utterances.push(u);this.active=u;if(cancelRace&&now-lastCancelled<200)u.onerror?.({error:"canceled"});},cancel(){this.cancels++;lastCancelled=now;const active=this.active;this.active=null;active?.onerror?.({error:'canceled'});},addEventListener(k,fn){speechListeners.set(k,fn);},removeEventListener(k){speechListeners.delete(k);}};
  class Param{constructor(){this.value=0;this.calls=[];}setValueAtTime(v,t){this.value=v;this.calls.push(['set',v,t]);}linearRampToValueAtTime(v,t){this.value=v;this.calls.push(['linear',v,t]);}exponentialRampToValueAtTime(v,t){this.value=v;this.calls.push(['exp',v,t]);}setTargetAtTime(v,t,c){this.value=v;this.calls.push(['target',v,t,c]);}cancelScheduledValues(t){this.calls.push(['cancel',t]);}}
  class Context{constructor(){this.state='suspended';this.offset=0;this.started=0;this.destination={};this.oscs=[];this.gains=[];contexts.push(this);}get currentTime(){return this.offset+(this.state==='running'?(now-this.started)/1000:0);}async resume(){this.started=now;this.state='running';}async suspend(){this.offset=this.currentTime;this.state='suspended';}async close(){this.state='closed';}
    createGain(){const node={gain:new Param(),connect(){},disconnect(){node.disconnected=true;}};this.gains.push(node);return node;}
    createOscillator(){const o={frequency:new Param(),connect(){},disconnect(){o.disconnected=true;},start(t){o.startAt=t;},stop(t){o.stopAt=t??0;}};this.oscs.push(o);return o;}}
  class Media{constructor(){this.pauses=0;this.loads=0;this.plays=0;media.push(this);}play(){this.plays++;return new Promise((resolve,reject)=>{this.resolvePlay=resolve;this.rejectPlay=reject;});}pause(){this.pauses++;}load(){this.loads++;}removeAttribute(name){if(name==='src')this.src='';}}
  const window={navigator:{userActivation:{isActive:gesture}},CAMPUS_FIXED_VOICES:fixedVoices,CAMPUS_CHARACTERS:characters,...(mediaSupported?{Audio:Media}:{}),...(tts?{speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}}:{}),...(audio?{AudioContext:Context}:{})};
  const context=vm.createContext({window,document,localStorage:{getItem(){if(storageFails)throw Error();return storedText;},setItem(k,v){if(storageFails)throw Error();storedText=v;}},setTimeout(fn,delay){const id=++nextTimer;timers.set(id,{fn,at:now+delay});return id;},clearTimeout(id){timers.delete(id);},console});
  vm.runInContext(source,context);const api=window.CampusAudio.create({onState:s=>states.push(s),voiceGenderHints});
  return{api,module:window.CampusAudio,window,document,synth,utterances,media,contexts,states,timers,speechListeners,docListeners,stored:()=>JSON.parse(storedText),async hidden(value){document.hidden=value;await docListeners.get('visibilitychange')();},advance(ms){const end=now+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;}};
}
(async()=>{
  const g=launch();const a=g.api;
  assert.equal(g.contexts.length,0,'module does not autoplay or create context at load');
  assert.equal(a.speak({key:'a',text:'你好',locale:'zh'}).reason,'gesture-required');
  await a.unlock();assert.equal(g.contexts.length,1);assert.equal(a.state.music.status,'playing');assert.ok(g.contexts[0].oscs.length>0);
  assert.equal(a.speak({key:'a',text:'你好',locale:'zh',characterId:'teacher'}).played,true);assert.equal(g.utterances.length,0,'speech start waits for cancellation to settle');g.advance(250);
  assert.equal(g.utterances.at(-1).voice.lang,'zh-HK');const first=g.utterances.at(-1);first.onstart();
  assert.equal(a.state.voice.status,'speaking');const gain=g.contexts[0].gains[0].gain;
  assert.ok(gain.calls.at(-1)[1]<0.06,'music ducks during dialogue');
  assert.equal(a.speak({key:'a',text:'你好',locale:'zh',characterId:'teacher'}).reason,'duplicate','identical rerender must not speak twice');
  assert.equal(a.speak({key:'a',text:'Hello',locale:'en'}).played,true,'a locale change must replace speech even when a caller reuses its key');g.advance(250);
  assert.equal(a.replay().played,true);g.advance(250);assert.equal(g.utterances.at(-1).lang,'en-GB','explicit replay uses currently displayed language');
  first.onend();assert.equal(a.state.voice.status,'queued','stale end callback cannot finish a new utterance');
  g.utterances.at(-1).onstart();g.utterances.at(-1).onend();assert.equal(a.state.voice.status,'ready');assert.ok(gain.calls.at(-1)[1]>0.03);
  const count=g.utterances.length;a.tryVoice('cn');g.advance(250);assert.equal(g.utterances.at(-1).lang,'zh-CN');a.replay();g.advance(250);assert.equal(g.utterances.at(-1).text,'Hello','test voice does not replace last dialogue');assert.equal(g.utterances.length,count+2);
  a.setSettings({voiceVolume:0.35,musicVolume:0.55});assert.equal(a.state.settings.voiceVolume,0.35);assert.equal(g.stored().musicVolume,0.55);
  a.setSettings({muted:true});assert.equal(a.state.music.status,'paused');assert.equal(a.speak({key:'b',text:'later'}).reason,'muted');
  a.setSettings({muted:false});assert.equal(a.state.music.status,'playing');a.speak({key:'b',text:'later'});g.advance(250);assert.equal(g.utterances.at(-1).volume,0.35);
  await g.hidden(true);assert.equal(a.state.voice.status,'paused');assert.equal(a.state.music.status,'paused');assert.equal(g.contexts[0].state,'suspended');assert.equal(g.timers.size,0,'hidden page retains no scheduler/watchdog timer');
  const spoken=g.utterances.length;await g.hidden(false);assert.equal(g.utterances.length,spoken,'returning tab does not unexpectedly replay dialogue');assert.equal(a.state.music.status,'playing');
  g.advance(800);assert.ok(g.contexts[0].oscs.length>2,'lookahead schedules subsequent melody notes');
  a.setMusicPlaying(false);assert.equal(a.state.music.status,'paused');assert.equal(g.timers.size,0);
  await a.dispose();assert.equal(g.contexts[0].state,'closed');assert.equal(g.timers.size,0);assert.equal(g.docListeners.size,0);assert.equal(g.speechListeners.size,0);assert.equal(a.state.disposed,true);await a.dispose();

  const denied=launch({gesture:false});assert.equal(await denied.api.unlock(),false);assert.equal(denied.contexts.length,0);assert.equal(denied.api.state.voice.status,'gesture-required');await denied.api.dispose();
  const missing=launch({tts:false,audio:false});await missing.api.unlock();assert.equal(missing.api.state.voice.status,'unavailable');assert.equal(missing.api.state.music.status,'unavailable');assert.equal(missing.api.speak({key:'x',text:'hi'}).reason,'unavailable');await missing.api.dispose();
  const loading=launch({voices:[]});await loading.api.unlock();assert.equal(loading.api.speak({key:'v',text:'你好'}).reason,'voices-loading');
  loading.synth.voices=[{name:'Mandarin',lang:'zh-CN',voiceURI:'remote-cn',localService:false}];loading.speechListeners.get('voiceschanged')();
  assert.equal(loading.api.speak({key:'v-missing',text:'你好',locale:'zh'}).reason,'voice-unavailable','Traditional Chinese must not silently use Mandarin');
  assert.equal(loading.utterances.length,0);assert.equal(loading.api.state.voice.unavailable,true);assert.equal(loading.api.state.voice.actualLocale,null);
  loading.synth.voices=[{name:'Cantonese',lang:'yue-Hant-HK',voiceURI:'remote-hk',localService:false}];loading.speechListeners.get('voiceschanged')();
  assert.equal(loading.api.speak({key:'cn',text:'你好',locale:'cn'}).reason,'voice-unavailable','Simplified Chinese must not silently use Cantonese');
  assert.equal(loading.utterances.length,0);
  assert.equal(loading.api.speak({key:'v-ready',text:'你好',locale:'zh'}).played,true);loading.advance(250);assert.equal(loading.api.state.voice.fallback,false);assert.equal(loading.api.state.voice.remote,true);assert.equal(loading.api.state.voice.actualLocale,'yue-Hant-HK');
  loading.utterances.at(-1).onerror({error:'not-allowed'});assert.equal(loading.api.state.voice.status,'gesture-required');assert.equal(loading.api.state.voice.errorCode,'not-allowed');await loading.api.dispose();
  for(const tag of ['zh-CN','zh-SG','zh-TW','zh-Hant-TW','cmn-Hans-CN']) {
    const voice={name:'Mandarin',lang:tag,localService:true,voiceURI:tag};
    assert.equal(g.module.selectVoice([voice],{locale:'cn'}).unavailable,false,`${tag} is an explicit Mandarin voice`);
    assert.equal(g.module.selectVoice([voice],{locale:'zh'}).unavailable,true,`${tag} must not be used for Cantonese`);
  }
  for(const tag of ['zh-HK','zh_HK','zh-Hant-HK','yue','yue-Hant-HK','zh-yue']) {
    const voice={name:'Cantonese',lang:tag,localService:true,voiceURI:tag};
    assert.equal(g.module.selectVoice([voice],{locale:'zh'}).unavailable,false,`${tag} is an explicit Cantonese voice`);
    assert.equal(g.module.selectVoice([voice],{locale:'cn'}).unavailable,true,`${tag} must not be used for Mandarin`);
  }
  assert.equal(g.module.selectVoice([{lang:'zh'}],{locale:'zh'}).unavailable,true,'ambiguous Chinese cannot guarantee Cantonese');
  assert.equal(g.module.selectVoice([{lang:'zh'}],{locale:'cn'}).unavailable,true,'ambiguous Chinese cannot guarantee Mandarin');
  assert.equal(g.module.selectVoice([{lang:'en-US',localService:true}],{locale:'en'}).fallback,true,'English regional alternatives remain English');
  assert.equal(g.module.selectVoice([{lang:'en-US'}],{locale:'zh'}).unavailable,true);
  const settings=launch({stored:{voiceVolume:-5,musicVolume:'bad',muted:true}});assert.equal(settings.api.state.settings.voiceVolume,0);assert.equal(settings.api.state.settings.musicVolume,0.25);settings.api.resetSettings();assert.equal(settings.api.state.settings.muted,false);await settings.api.dispose();
  const badStorage=launch({storageFails:true});assert.equal(badStorage.api.state.storageAvailable,false);badStorage.api.setSettings({voiceVolume:Infinity});assert.equal(badStorage.api.state.settings.voiceVolume,0.8);await badStorage.api.dispose();
  const voices=[{name:'One',voiceURI:'one',lang:'en-GB',localService:true},{name:'Two',voiceURI:'two',lang:'en-GB',localService:true},{name:'Remote',voiceURI:'remote',lang:'en-GB',localService:false}];
  const selection=g.module.selectVoice(voices,{locale:'en',characterId:'maths',gender:'male'},{one:'female',two:'male'});assert.equal(selection.voice.name,'Two');
  assert.equal(g.module.selectVoice(voices,{locale:'en',characterId:'same'}).voice.voiceURI,g.module.selectVoice([...voices].reverse(),{locale:'en',characterId:'same'}).voice.voiceURI,'voice assignment independent of browser list order');
  const voice=(name,lang,localService=true,voiceURI=name)=>({name,lang,localService,voiceURI});
  const castVoices=[voice('善怡','zh-HK'),voice('Microsoft WanLung Online (Natural) - Chinese (Hong Kong)','zh-HK',false,'zh-HK-WanLungNeural'),voice('婷婷','zh-CN'),voice('Microsoft Kangkang - Chinese (China)','zh-CN'),voice('Daniel','en-GB'),voice('Samantha','en-US')];
  const pendingLine={key:'loading-mandarin',text:'欢迎来到校园。',locale:'cn',gender:'girl'};
  const inventoryLoading=launch({voices:[]});await inventoryLoading.api.unlock();inventoryLoading.api.setMusicPlaying(false);
  assert.equal(inventoryLoading.api.speak(pendingLine).reason,'voices-loading');assert.equal(inventoryLoading.api.state.voice.loading,true);assert.equal(inventoryLoading.timers.size,1,'empty inventory retains one bounded loading timer');
  inventoryLoading.advance(1000);assert.equal(inventoryLoading.api.speak(pendingLine).reason,'duplicate','rerenders cannot extend the loading window');assert.equal(inventoryLoading.timers.size,1);
  inventoryLoading.synth.voices=[voice('善怡','zh-HK'),voice('Microsoft Kangkang - Chinese (China)','zh-CN')];inventoryLoading.speechListeners.get('voiceschanged')();inventoryLoading.advance(500);
  assert.equal(inventoryLoading.utterances.length,0,'loading never substitutes Cantonese or a male voice for female Mandarin');
  inventoryLoading.synth.voices.push(voice('婷婷','zh-CN'));inventoryLoading.speechListeners.get('voiceschanged')();inventoryLoading.speechListeners.get('voiceschanged')();
  assert.equal(inventoryLoading.api.state.voice.loading,false);assert.equal(inventoryLoading.timers.size,1,'matching inventory replaces the deadline with one native-start timer');
  inventoryLoading.advance(250);assert.equal(inventoryLoading.utterances.length,1);assert.equal(inventoryLoading.utterances[0].voice.name,'婷婷');assert.equal(inventoryLoading.utterances[0].lang,'zh-CN');
  inventoryLoading.utterances[0].onstart();inventoryLoading.utterances[0].onend();inventoryLoading.advance(3000);inventoryLoading.speechListeners.get('voiceschanged')();assert.equal(inventoryLoading.utterances.length,1,'neither the removed deadline nor later voice events repeat a line');await inventoryLoading.api.dispose();
  const deadline=launch({voices:[]});await deadline.api.unlock();deadline.api.setMusicPlaying(false);deadline.api.speak(pendingLine);deadline.advance(2800);deadline.synth.voices=[voice('婷婷','zh-CN')];deadline.advance(200);
  assert.equal(deadline.api.state.voice.loading,false,'deadline rechecks a loaded inventory even without voiceschanged');deadline.advance(250);assert.equal(deadline.utterances.length,1);assert.equal(deadline.utterances[0].lang,'zh-CN');await deadline.api.dispose();
  const expired=launch({voices:[]});await expired.api.unlock();expired.api.setMusicPlaying(false);expired.api.speak(pendingLine);expired.advance(2999);assert.equal(expired.api.state.voice.loading,true);expired.advance(1);
  assert.equal(expired.api.state.voice.status,'unavailable');assert.equal(expired.api.state.voice.loading,false);assert.equal(expired.api.state.voice.errorCode,'voice-language-unavailable');assert.equal(expired.timers.size,0);
  expired.synth.voices=[voice('婷婷','zh-CN')];expired.speechListeners.get('voiceschanged')();expired.advance(1000);assert.equal(expired.utterances.length,0,'late unrelated inventory events do not autoplay an expired request');assert.equal(expired.api.replay().played,true,'explicit replay can retry after timeout');expired.advance(250);assert.equal(expired.utterances.length,1);await expired.api.dispose();
  const populated=launch({voices:[voice('善怡','zh-HK')]});await populated.api.unlock();populated.api.setMusicPlaying(false);assert.equal(populated.api.speak(pendingLine).reason,'voice-unavailable');assert.equal(populated.timers.size,0,'populated inventory missing Mandarin is not falsely treated as loading');populated.synth.voices.push(voice('婷婷','zh-CN'));populated.speechListeners.get('voiceschanged')();populated.advance(4000);assert.equal(populated.utterances.length,0);await populated.api.dispose();
  const changedLanguage=launch({voices:[]});await changedLanguage.api.unlock();changedLanguage.api.setMusicPlaying(false);changedLanguage.api.speak(pendingLine);changedLanguage.advance(500);changedLanguage.api.speak({...pendingLine,locale:'en',text:'Welcome to the campus.'});changedLanguage.synth.voices=[voice('婷婷','zh-CN')];changedLanguage.speechListeners.get('voiceschanged')();changedLanguage.advance(500);assert.equal(changedLanguage.utterances.length,0,'replacing the locale invalidates the older pending Mandarin line');changedLanguage.synth.voices.push(voice('Samantha','en-US'));changedLanguage.speechListeners.get('voiceschanged')();changedLanguage.advance(250);assert.equal(changedLanguage.utterances.length,1);assert.equal(changedLanguage.utterances[0].lang,'en-US');assert.equal(changedLanguage.utterances[0].text,'Welcome to the campus.');await changedLanguage.api.dispose();
  for(const action of ['stop','mute','zero-volume','hidden','dispose']){
    const canceled=launch({voices:[]});await canceled.api.unlock();canceled.api.setMusicPlaying(false);canceled.api.speak(pendingLine);canceled.advance(500);const lateInventory=canceled.speechListeners.get('voiceschanged');
    if(action==='stop')canceled.api.stopVoice();else if(action==='mute')canceled.api.setSettings({muted:true});else if(action==='zero-volume')canceled.api.setSettings({voiceVolume:0});else if(action==='hidden')await canceled.hidden(true);else await canceled.api.dispose();
    assert.equal(canceled.timers.size,0,action+' removes the inventory deadline');assert.equal(canceled.api.state.voice.loading,false);canceled.synth.voices=[voice('婷婷','zh-CN')];lateInventory();canceled.advance(4000);assert.equal(canceled.utterances.length,0,action+' invalidates delayed voice events');
    if(action==='mute')canceled.api.setSettings({muted:false});else if(action==='zero-volume')canceled.api.setSettings({voiceVolume:0.8});else if(action==='hidden')await canceled.hidden(false);
    lateInventory();canceled.advance(1000);assert.equal(canceled.utterances.length,0,action+' recovery does not revive stale speech');await canceled.api.dispose();
  }
  console.log('PASS asynchronous voice inventory: one 3-second deadline, strict gender/locale on voiceschanged, final inventory recheck, no late autoplay, deduplication, replacement and cancellation on stop/mute/hidden/dispose.');
  for(const locale of ['zh','cn','en'])for(const gender of ['boy','male','girl','female']) {
    const selected=g.module.selectVoice(castVoices,{locale,gender,characterId:'principal'});
    assert.equal(selected.unavailable,false,locale+' '+gender+' has a matching voice');
    assert.equal(selected.actualGender,['boy','male'].includes(gender)?'male':'female');
    assert.equal(selected.requestedGender,selected.actualGender);
  }
  const registryWindow={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/campus/game/characters.js'),'utf8'),{window:registryWindow});
  const characters=Object.values(registryWindow.CAMPUS_CHARACTERS.byId);assert.equal(characters.length,20);
  for(const character of characters)for(const locale of ['zh','cn','en']) {
    const selected=g.module.selectVoice(castVoices,{locale,gender:character.gender,characterId:character.id});
    assert.equal(selected.actualGender,character.gender==='boy'?'male':'female',character.id+' registry gender remains consistent in '+locale);
    assert.equal(g.module.selectVoice([...castVoices].reverse(),{locale,gender:character.gender,characterId:character.id}).voice.voiceURI,selected.voice.voiceURI,'voice ordering cannot change a character assignment');
  }
  assert.equal(g.module.selectVoice(castVoices,{locale:'en',gender:registryWindow.CAMPUS_CHARACTERS.resolve('subject:hall').gender,characterId:'subject:hall'}).voice.name,'Daniel','the actual principal alias uses the male English voice');
  const femaleOnly=[voice('善怡','zh-HK'),voice('婷婷','zh-CN'),voice('Samantha','en-US')];
  for(const locale of ['zh','cn','en']) {
    const selected=g.module.selectVoice(femaleOnly,{locale,gender:'boy'});
    assert.equal(selected.voice,null);assert.equal(selected.reason,'voice-gender-unavailable','never substitute a known female for a male NPC');
  }
  assert.equal(g.module.selectVoice([voice('Unclassified','en-GB')],{locale:'en',gender:'girl'}).reason,'voice-gender-unavailable','unknown gender is not a verified match');
  assert.equal(g.module.selectVoice([voice('Eddy','zh-CN')],{locale:'cn',gender:'boy'}).unavailable,true,'native unspecified gender is not guessed from a novelty name');
  assert.equal(g.module.selectVoice([voice('Danielson','en-GB')],{locale:'en',gender:'boy'}).unavailable,true,'registry aliases require token boundaries');
  const regionalMale=g.module.selectVoice([voice('Samantha','en-GB'),voice('Microsoft David - English (United States)','en-US',false)],{locale:'en',gender:'boy'});
  assert.equal(regionalMale.voice.name,'Microsoft David - English (United States)','gender constraint applies before exact-region, local or standard preference');assert.equal(regionalMale.fallback,true);
  const hinted=g.module.selectVoice([voice('Daniel','en-GB'),voice('Studio Reader','en-GB',false,'studio')],{locale:'en',gender:'female'},{studio:'female'});
  assert.equal(hinted.voice.voiceURI,'studio','provided gender hint applies before standard/local preference');
  assert.equal(g.module.selectVoice([voice('Daniel','en-GB')],{locale:'en',gender:'male'},{Daniel:'female'}).unavailable,true,'explicit application hints override built-in names');
  assert.equal(g.module.selectVoice([voice('Daniel','en-GB',true,'apple-daniel')],{locale:'en',gender:'female'},{'apple-daniel':'female',Daniel:'male'}).actualGender,'female','voiceURI hint takes precedence over name hint');
  assert.equal(g.module.selectVoice([voice('善怡','zh-HK')],{locale:'en',gender:'female'},{'善怡':'female'}).reason,'voice-language-unavailable','gender hints never override the requested language');
  const normalized=g.module.selectVoice([voice('Ting-Ting (Enhanced)','zh-CN')],{locale:'cn',gender:'girl'});assert.equal(normalized.actualGender,'female');
  assert.equal(g.module.selectVoice([voice('Localized voice','en-GB',true,'urn:moz-tts:osx:com.apple.speech.synthesis.voice.daniel')],{locale:'en',gender:'boy'}).actualGender,'male','known URI works with a localized display name');
  const hintRuntime=launch({voices:[voice('Reader','en-GB',true,'reader')],voiceGenderHints:{reader:'male'}});await hintRuntime.api.unlock();
  assert.equal(hintRuntime.api.speak({text:'Hello',locale:'en',gender:'boy'}).played,true);hintRuntime.advance(250);assert.equal(hintRuntime.api.state.voice.actualGender,'male');await hintRuntime.api.dispose();
  const speechText=g.module.englishSpeechText;
  for(const [input,expected] of [
    ['Collect 100 stars from 13 rooms.','Collect one hundred stars from thirteen rooms.'],
    ['The total is 103, not 13.','The total is one hundred and three, not thirteen.'],
    ['There are 1,234 students and 2,000,000 books.','There are one thousand two hundred and thirty-four students and two million books.'],
    ['The change is −3.05% or +.5%.','The change is minus three point zero five percent or plus zero point five percent.'],
    ['Keep 0.00, 12.50 and -0.25 exact.','Keep zero point zero zero, twelve point five zero and minus zero point two five exact.'],
    ['Compare 1/2, 3/4 and 2 1/3.','Compare one half, three quarters and two and one third.'],
    ['Use -1/8, 2/3 or 5/24; do not divide 1/0.','Use minus one eighth, two thirds or five over twenty-four; do not divide one over zero.'],
    ['Ages 12-15 use section S-2.','Ages twelve-fifteen use section S-two.'],
    ['Read 2\n1/2 separately.','Read two\none half separately.'],
    ['Student 01 has code 0007.','Student zero one has code zero zero zero seven.'],
    ['ID 12345678901234567890.','ID one two three four five six seven eight nine zero one two three four five six seven eight nine zero.'],
    ['The 1st, 2nd, 3rd, 21st and 100th places.','The first, second, third, twenty-first and one hundredth places.'],
    ['S2 has 5 rooms on 4F.','S two has five rooms on four F.'],
    ['Read https://example.test/v2 and `x2=4`; answer 12.','Read https://example.test/v2 and `x2=4`; answer twelve.'],
    ['No numerical value changes this sentence.','No numerical value changes this sentence.'],
  ])assert.equal(speechText(input),expected,input);
  const precise='999,999,999,999,999';assert.ok(speechText(precise).startsWith('nine hundred and ninety-nine trillion'));assert.ok(!/\d/.test(speechText(precise)),'large supported integer expands without floating-point rounding');
  const natural=launch({voices:castVoices});await natural.api.unlock();natural.api.setMusicPlaying(false);
  const original={key:'english-numbers',text:'Collect 100 stars, then compare 25% and 1/2.',locale:'en',characterId:'staff-principal',gender:'boy'};
  natural.api.speak(original);natural.advance(250);assert.equal(natural.utterances.length,1,'complete sentences stay in one utterance');
  assert.equal(natural.utterances[0].text,'Collect one hundred stars, then compare twenty-five percent and one half.');assert.equal(original.text,'Collect 100 stars, then compare 25% and 1/2.','display/input object remains unchanged');
  assert.equal(natural.utterances[0].voice.name,'Daniel');assert.equal(natural.utterances[0].lang,'en-GB');assert.equal(natural.utterances[0].rate,1);assert.equal(natural.utterances[0].pitch,1);
  natural.api.replay();natural.advance(250);assert.equal(natural.utterances.at(-1).text,natural.utterances[0].text,'replay does not double-convert or lose digits');
  natural.api.speak({key:'mandarin-numbers',text:'共有100顆星。',locale:'cn',gender:'girl'});natural.advance(250);assert.equal(natural.utterances.at(-1).text,'共有100顆星。','English expansion does not alter Chinese');await natural.api.dispose();
  const disappearing=launch({voices:[voice('Daniel','en-GB')]});await disappearing.api.unlock();disappearing.api.setMusicPlaying(false);
  disappearing.api.speak({key:'removed-voice',text:'Hello 100.',locale:'en',gender:'boy'});disappearing.synth.voices=[voice('Samantha','en-US')];disappearing.advance(250);
  assert.equal(disappearing.utterances.length,0,'delayed start rechecks inventory instead of allowing native default fallback');assert.equal(disappearing.api.state.voice.errorCode,'voice-gender-unavailable');assert.equal(disappearing.api.state.voice.status,'unavailable');await disappearing.api.dispose();
  const strict=launch({voices:[voice('善怡','zh-HK'),voice('Daniel','en-GB')]});await strict.api.unlock();strict.api.setMusicPlaying(false);
  assert.equal(strict.api.speak({key:'same',text:'你好',locale:'zh',gender:'girl'}).played,true);strict.advance(250);const femaleUtterance=strict.utterances[0];femaleUtterance.onstart();
  assert.equal(strict.api.speak({key:'same',text:'你好',locale:'zh',gender:'boy'}).reason,'voice-gender-unavailable','changed identity/gender cannot keep earlier speech');assert.equal(strict.synth.cancels,1);assert.equal(strict.api.state.voice.actualGender,null);assert.equal(strict.api.state.music.ducking,false);
  femaleUtterance.onend();assert.equal(strict.api.state.voice.status,'unavailable','stale female completion cannot hide missing male voice');
  strict.api.tryVoice('zh');strict.advance(250);assert.equal(strict.utterances.at(-1).voice.name,'善怡','generic test voice has no character gender restriction');
  strict.api.speak({key:'same',text:'Read 100 in English.',locale:'en',gender:'boy'});strict.advance(250);assert.equal(strict.utterances.at(-1).text,'Read one hundred in English.');assert.equal(strict.utterances.at(-1).voice.name,'Daniel');
  strict.api.replay();strict.advance(50);strict.api.speak({key:'same',text:'新一句',locale:'zh',gender:'girl'});strict.advance(250);assert.equal(strict.utterances.at(-1).lang,'zh-HK','language switch cancels a pending replay');assert.equal(strict.utterances.at(-1).text,'新一句');
  const beforeStop=strict.utterances.length;strict.api.replay();strict.api.stopVoice();strict.advance(1000);assert.equal(strict.utterances.length,beforeStop,'stop cancels pending replay');await strict.api.dispose();
  const race=launch({cancelRace:true});await race.api.unlock();
  race.api.speak({key:'first',text:'Hello',locale:'en'});race.advance(250);assert.equal(race.utterances.length,1);
  race.api.speak({key:'second',text:'你好',locale:'zh'});race.advance(30);
  race.api.speak({key:'third',text:'你好',locale:'cn'});race.advance(30);
  race.api.speak({key:'fourth',text:'Welcome',locale:'en'});race.advance(250);
  assert.equal(race.utterances.length,2,'rapid locale changes start only the final replacement');
  assert.equal(race.utterances.at(-1).lang,'en-GB');assert.equal(race.api.state.voice.status,'queued','replacement survives simulated asynchronous browser cancellation');
  race.utterances.at(-1).onstart();assert.equal(race.api.state.voice.status,'speaking');
  race.api.speak({key:'cancel-before-start',text:'Stop',locale:'en'});race.api.stopVoice();race.advance(250);assert.equal(race.utterances.length,2,'stop cancels pending start timer');
  assert.equal(race.api.state.music.contextState,'running');assert.equal(race.api.state.music.gain,0.25*0.85);await race.api.dispose();
  const retry=launch();await retry.api.unlock();retry.api.setMusicPlaying(false);
  retry.api.speak({key:'one-retry',text:'Hello',locale:'en'});retry.advance(250);const cancelledBeforeStart=retry.utterances.at(-1);
  cancelledBeforeStart.onerror({error:'interrupted'});assert.equal(retry.api.state.voice.status,'queued');assert.equal(retry.api.state.voice.attempt,2);
  retry.advance(300);assert.equal(retry.utterances.length,2);const replacement=retry.utterances.at(-1);
  cancelledBeforeStart.onend();assert.equal(retry.api.state.voice.status,'queued','stale attempt cannot finish its replacement');
  replacement.onstart();replacement.onerror({error:'interrupted'});retry.advance(1000);
  assert.equal(retry.utterances.length,2,'a started line is never automatically repeated');assert.equal(retry.api.state.voice.started,true);assert.equal(retry.api.state.voice.errorCode,'interrupted');
  assert.equal(retry.api.speak({key:'one-retry',text:'Hello',locale:'en'}).reason,'duplicate','rerender cannot reread an interrupted line');
  retry.api.speak({key:'retry-bound',text:'Hello',locale:'en'});retry.advance(250);retry.utterances.at(-1).onerror({error:'canceled'});retry.advance(300);retry.utterances.at(-1).onerror({error:'interrupted'});retry.advance(1000);
  assert.equal(retry.utterances.length,4,'retry is bounded to one attempt');assert.equal(retry.api.state.voice.status,'error');
  retry.api.speak({key:'completed',text:'Hello',locale:'en'});retry.advance(250);const completed=retry.utterances.at(-1);completed.onstart();completed.onend();completed.onerror({error:'interrupted'});
  assert.equal(retry.api.state.voice.status,'ready','late error after completion is ignored');assert.equal(retry.api.state.voice.lastEvent,'end');
  retry.api.speak({key:'timeout',text:'Hello',locale:'en'});retry.advance(250);const timedOut=retry.utterances.at(-1);timedOut.onstart();retry.advance(30000);timedOut.onerror({error:'interrupted'});
  assert.equal(retry.api.state.voice.errorCode,'speech-timeout','late cancellation cannot hide a timeout');assert.equal(retry.api.state.voice.lastEvent,'timeout');
  retry.api.speak({key:'replaced-retry',text:'Hello',locale:'en'});retry.advance(250);retry.utterances.at(-1).onerror({error:'interrupted'});const beforeReplace=retry.utterances.length;
  retry.api.speak({key:'latest-only',text:'你好',locale:'zh'});retry.advance(300);assert.equal(retry.utterances.length,beforeReplace+1);assert.equal(retry.utterances.at(-1).lang,'zh-HK');await retry.api.dispose();
  const delayedStart=launch();await delayedStart.api.unlock();delayedStart.api.setMusicPlaying(false);
  delayedStart.api.speak({key:'slow-provider',text:'Hello',locale:'en'});delayedStart.advance(250);const delayed=delayedStart.utterances.at(-1);delayedStart.advance(20000);assert.equal(delayedStart.api.state.voice.status,'queued');delayed.onstart();delayedStart.advance(29999);assert.equal(delayedStart.api.state.voice.status,'speaking','provider queue delay does not consume speech timeout');delayed.onend();assert.equal(delayedStart.api.state.voice.status,'ready');
  delayedStart.api.speak({key:'never-starts',text:'Hello',locale:'en'});delayedStart.advance(250+30000);assert.equal(delayedStart.api.state.voice.errorCode,'speech-start-timeout','queue has a separate bounded timeout');await delayedStart.api.dispose();
  const noStart=launch();await noStart.api.unlock();noStart.api.speak({key:'native-silent-end',text:'This sentence must actually start.',locale:'en'});noStart.advance(250);noStart.utterances.at(-1).onend();assert.equal(noStart.api.state.voice.status,'error');assert.equal(noStart.api.state.voice.errorCode,'speech-did-not-start','end without any start is not verified playback');await noStart.api.dispose();
  const paused=launch();let resumes=0;paused.synth.paused=true;paused.synth.resume=()=>{resumes++;paused.synth.paused=false;};await paused.api.unlock();paused.api.speak({key:'paused-engine',text:'Hello',locale:'en'});paused.advance(250);assert.equal(resumes,1,'paused native synthesis is resumed before enqueue');await paused.api.dispose();
  const standardVoice=g.module.selectVoice([{name:'Rocko (English UK)',lang:'en-GB',voiceURI:'rocko',localService:true},{name:'Daniel',lang:'en-GB',voiceURI:'daniel',localService:true}],{locale:'en'});assert.equal(standardVoice.voice.name,'Daniel');
  assert.equal(g.module.selectVoice([{name:'Rocko (中文)',lang:'zh-CN',localService:true},{name:'婷婷',lang:'zh-CN',localService:true}],{locale:'cn'}).voice.name,'婷婷');
  assert.equal(g.module.melody[0][0],'E4');assert.equal(g.module.melody.at(-1)[0],null);
  const fixedLine={key:'fixed-welcome',kind:'dialogue',text:'Collect 100 stars.',locale:'en',characterId:'staff-principal',gender:'boy'};
  const fixedClip={characterId:'staff-principal',locale:'en',text:fixedLine.text,gender:'male',src:'audio/voices/principal/en-welcome.mp3',approved:true};
  const fixedManifest={schemaVersion:1,clips:[fixedClip,{...fixedClip,locale:'cn',text:'收集100颗星。',src:'audio/voices/principal/cn-welcome.mp3'}]};
  const fixedOptions={voices:castVoices,fixedVoices:fixedManifest,characters:registryWindow.CAMPUS_CHARACTERS};
  const recorded=launch(fixedOptions);
  assert.equal(recorded.media.length,0,'manifest loading never creates or preloads media');
  assert.equal(recorded.api.speak(fixedLine).reason,'gesture-required');assert.equal(recorded.media.length,0);
  await recorded.api.unlock();recorded.api.speak(fixedLine);
  assert.equal(recorded.media.length,1);assert.equal(recorded.utterances.length,0);assert.equal(recorded.api.state.voice.source,'recorded');
  const clip1=recorded.media[0];assert.equal(clip1.src,fixedClip.src);assert.equal(clip1.volume,0.8);assert.equal(clip1.playbackRate,1);assert.equal(recorded.api.state.voice.actualGender,'male');assert.equal(recorded.api.state.voice.actualLocale,'en');assert.equal(recorded.api.state.voice.remote,false);
  const staleStart=clip1.onplaying,staleEnd=clip1.onended,staleError=clip1.onerror;
  clip1.onplaying();assert.equal(recorded.api.state.voice.status,'speaking');assert.equal(recorded.api.state.music.ducking,true);
  recorded.api.setSettings({voiceVolume:0.35});assert.equal(clip1.volume,0.35,'recording shares the dialogue volume slider');
  assert.equal(recorded.api.speak(fixedLine).reason,'duplicate');assert.equal(recorded.media.length,1);
  clip1.onended();assert.equal(recorded.api.state.voice.status,'ready');assert.equal(recorded.api.state.music.ducking,false);assert.equal(clip1.src,'');assert.equal(clip1.onplaying,null);assert.equal(clip1.onerror,null);assert.equal(clip1.pauses,1);
  recorded.api.replay();assert.equal(recorded.media.length,2);assert.equal(recorded.media[1].volume,0.35);assert.equal(recorded.media[1].src,fixedClip.src);
  staleStart();staleEnd();staleError();assert.equal(recorded.api.state.voice.status,'queued');assert.equal(recorded.utterances.length,0,'stale media callbacks cannot finish or fall back over replay');
  clip1.rejectPlay(Object.assign(new Error('late failure'),{name:'AbortError'}));await Promise.resolve();recorded.advance(500);assert.equal(recorded.utterances.length,0);
  recorded.media[1].onplaying();recorded.api.speak({...fixedLine,key:'cn-line',locale:'cn',text:'收集100颗星。'});assert.equal(recorded.media[1].pauses,1);assert.equal(recorded.media[2].src,'audio/voices/principal/cn-welcome.mp3');assert.equal(recorded.api.state.voice.actualLocale,'cmn');
  recorded.api.speak({...fixedLine,key:'zh-line',locale:'zh',text:'收集100顆星。'});recorded.advance(250);assert.equal(recorded.media[2].pauses,1);assert.equal(recorded.utterances.at(-1).voice.lang,'zh-HK','Cantonese continues through the existing device path');
  recorded.api.speak({...fixedLine,key:'stop-media'});const canceled=recorded.media.at(-1),canceledStart=canceled.onplaying,canceledEnd=canceled.onended,canceledError=canceled.onerror;const beforeCanceled=recorded.utterances.length;
  recorded.api.stopVoice();canceledStart();canceledEnd();canceledError();canceled.rejectPlay(new Error('late'));await Promise.resolve();recorded.advance(1000);
  assert.equal(recorded.utterances.length,beforeCanceled,'stop cancels both events and rejected play promises');assert.equal(recorded.api.state.music.ducking,false);
  recorded.api.speak({...fixedLine,key:'hidden-media'});const hiddenClip=recorded.media.at(-1);hiddenClip.onplaying();await recorded.hidden(true);assert.equal(hiddenClip.pauses,1);assert.equal(recorded.api.state.voice.status,'paused');assert.equal(recorded.timers.size,0);const mediaCount=recorded.media.length;await recorded.hidden(false);assert.equal(recorded.media.length,mediaCount,'returning to tab cannot replay a recording');
  recorded.api.speak({...fixedLine,key:'mute-media'});recorded.api.setSettings({muted:true});assert.equal(recorded.media.at(-1).pauses,1);assert.equal(recorded.api.state.voice.status,'muted');recorded.api.setSettings({muted:false});assert.equal(recorded.media.length,mediaCount+1,'unmute does not replay');
  recorded.api.speak({...fixedLine,key:'dispose-media'});const disposing=recorded.media.at(-1),afterDisposeError=disposing.onerror;await recorded.api.dispose();afterDisposeError();disposing.rejectPlay(new Error('late'));await Promise.resolve();assert.equal(recorded.timers.size,0);assert.equal(disposing.pauses,1);

  const mismatchCases=[
    ['missing opt-in',{...fixedLine,kind:undefined},fixedManifest],
    ['question opt-out',{...fixedLine,kind:'question'},fixedManifest],
    ['full text differs',{...fixedLine,text:fixedLine.text+' Please.'},fixedManifest],
    ['whitespace is not an exact recording',{...fixedLine,text:' '+fixedLine.text},fixedManifest],
    ['wrong character',{...fixedLine,characterId:'staff-maths'},fixedManifest],
    ['wrong requested gender',{...fixedLine,gender:'girl'},fixedManifest],
    ['unknown canonical character',{...fixedLine,characterId:'invented'},fixedManifest],
    ['unapproved recording',fixedLine,{schemaVersion:1,clips:[{...fixedClip,approved:false}]}],
    ['wrong clip gender',fixedLine,{schemaVersion:1,clips:[{...fixedClip,gender:'female'}]}],
    ['wrong clip locale',fixedLine,{schemaVersion:1,clips:[{...fixedClip,locale:'cn'}]}],
    ['wrong speech locale',fixedLine,{schemaVersion:1,clips:[{...fixedClip,speechLocale:'zh-HK'}]}],
    ['ambiguous speech locale',fixedLine,{schemaVersion:1,clips:[{...fixedClip,speechLocale:'zh'}]}],
    ['unknown schema',fixedLine,{schemaVersion:2,clips:[fixedClip]}],
    ['duplicate ambiguous recording',fixedLine,{schemaVersion:1,clips:[fixedClip,{...fixedClip,src:'audio/voices/other.mp3'}]}],
    ...['https://example.test/voice.mp3','//example.test/voice.mp3','audio/voices/../other.mp3','audio/voices/%2e%2e/other.mp3','audio/voices/file.mp3?url=remote','audio/voices/file.wav','audio/voices/x\\evil.mp3'].map(src=>['unsafe source '+src,fixedLine,{schemaVersion:1,clips:[{...fixedClip,src}]}]),
  ];
  for(const [name,line,manifest] of mismatchCases){const test=launch({...fixedOptions,fixedVoices:manifest});await test.api.unlock();test.api.setMusicPlaying(false);test.api.speak(line);test.advance(250);assert.equal(test.media.length,0,name+' must not load a recording');assert.equal(test.api.state.voice.source,'browser',name+' uses strict device selection');await test.api.dispose();}
  const aliasRecording=launch(fixedOptions);await aliasRecording.api.unlock();aliasRecording.api.speak({...fixedLine,characterId:'subject:hall'});assert.equal(aliasRecording.media.length,1,'alias resolves to canonical principal before exact manifest matching');await aliasRecording.api.dispose();
  const previewClips=[{characterId:'staff-mentor',gender:'female',locale:'cn',speechLocale:'zh-CN',text:'欢迎入读明澄书院，新同学！',src:'audio/voices/cn/welcome.mp3',approved:true,preview:true},{characterId:'staff-mentor',gender:'female',locale:'en',speechLocale:'en-US',text:'Welcome to Ming Ching College!',src:'audio/voices/en/welcome.mp3',approved:true,preview:true}];
  const previewRecording=launch({...fixedOptions,fixedVoices:{schemaVersion:1,clips:[fixedClip,...previewClips]}});await previewRecording.api.unlock();previewRecording.api.setMusicPlaying(false);previewRecording.api.speak(fixedLine);
  previewRecording.api.tryVoice('cn');assert.equal(previewRecording.media.at(-1).src,previewClips[0].src);assert.equal(previewRecording.api.state.voice.source,'recorded');assert.equal(previewRecording.api.state.voice.actualLocale,'zh-CN');assert.equal(previewRecording.api.state.voice.actualGender,'female');
  previewRecording.api.tryVoice('en');assert.equal(previewRecording.media.at(-1).src,previewClips[1].src);assert.equal(previewRecording.api.state.voice.actualLocale,'en-US');
  previewRecording.api.replay();assert.equal(previewRecording.media.at(-1).src,fixedClip.src,'recorded preview never replaces the prior dialogue replay target');assert.equal(previewRecording.api.speak(fixedLine).reason,'duplicate','preview preserves prior dialogue deduplication');
  const beforeCantonesePreview=previewRecording.media.length;previewRecording.api.tryVoice('zh');previewRecording.advance(250);assert.equal(previewRecording.media.length,beforeCantonesePreview,'Cantonese preview remains device-only');assert.equal(previewRecording.utterances.at(-1).lang,'zh-HK');await previewRecording.api.dispose();
  for(const rejectedPreview of [{...previewClips[0],approved:false},{...previewClips[0],characterId:'staff-principal'},{...previewClips[0],gender:'male'},{...previewClips[0],speechLocale:'yue-HK'}]){
    const fallbackPreview=launch({...fixedOptions,fixedVoices:{schemaVersion:1,clips:[rejectedPreview]}});await fallbackPreview.api.unlock();fallbackPreview.api.tryVoice('cn');fallbackPreview.advance(250);assert.equal(fallbackPreview.media.length,0,'unverified, wrong identity/gender/language preview cannot enter recordings');assert.equal(fallbackPreview.utterances.at(-1).lang,'zh-CN');await fallbackPreview.api.dispose();
  }
  const failedPreview=launch({...fixedOptions,fixedVoices:{schemaVersion:1,clips:previewClips}});await failedPreview.api.unlock();failedPreview.api.tryVoice('cn');failedPreview.media[0].onerror();failedPreview.advance(250);assert.equal(failedPreview.utterances.at(-1).voice.name,'婷婷','failed recorded preview falls back to the same female Mandarin identity');assert.equal(failedPreview.utterances.at(-1).text,previewClips[0].text);assert.equal(failedPreview.api.replay().reason,'no-line','preview alone does not manufacture a dialogue replay target');await failedPreview.api.dispose();
  const fallbackHistory=launch({...fixedOptions,fixedVoices:{schemaVersion:1,clips:[fixedClip,...previewClips]}});await fallbackHistory.api.unlock();fallbackHistory.api.speak(fixedLine);fallbackHistory.api.tryVoice('cn');fallbackHistory.media.at(-1).onerror();fallbackHistory.advance(250);assert.equal(fallbackHistory.api.speak(fixedLine).reason,'duplicate','asynchronous recorded preview fallback preserves the previous dialogue key');fallbackHistory.api.replay();assert.equal(fallbackHistory.media.at(-1).src,fixedClip.src);await fallbackHistory.api.dispose();
  const loadingPreview=launch({voices:castVoices});await loadingPreview.api.unlock();loadingPreview.api.speak(pendingLine);loadingPreview.advance(250);loadingPreview.synth.voices=[];loadingPreview.api.tryVoice('en');loadingPreview.synth.voices=castVoices;loadingPreview.speechListeners.get('voiceschanged')();loadingPreview.advance(250);assert.equal(loadingPreview.api.speak(pendingLine).reason,'duplicate','late device inventory preview preserves the prior dialogue key');loadingPreview.api.replay();loadingPreview.advance(250);assert.equal(loadingPreview.utterances.at(-1).text,pendingLine.text);await loadingPreview.api.dispose();
  const noRegistry=launch({...fixedOptions,characters:undefined});await noRegistry.api.unlock();noRegistry.api.speak(fixedLine);assert.equal(noRegistry.media.length,0,'unknown canonical registry cannot authorize a recorded identity');await noRegistry.api.dispose();
  const missingMedia=launch({...fixedOptions,mediaSupported:false});await missingMedia.api.unlock();missingMedia.api.speak(fixedLine);missingMedia.advance(250);assert.equal(missingMedia.utterances.at(-1).voice.name,'Daniel');await missingMedia.api.dispose();
  const recordedOnly=launch({...fixedOptions,tts:false,audio:false});await recordedOnly.api.unlock();assert.equal(recordedOnly.api.speak(fixedLine).played,true,'approved clip works when device synthesis is absent');recordedOnly.media[0].onplaying();recordedOnly.media[0].onended();assert.equal(recordedOnly.api.state.voice.status,'ready');recordedOnly.api.replay();const noDeviceReplacement=recordedOnly.media.at(-1);noDeviceReplacement.onplaying();assert.equal(recordedOnly.api.speak({...fixedLine,key:'unsupported-next',locale:'zh',text:'新一句'}).reason,'unavailable');assert.equal(noDeviceReplacement.pauses,1,'an unsupported replacement still stops the old recording');assert.equal(recordedOnly.api.state.music.ducking,false);await recordedOnly.api.dispose();
  const forcedCantonese=launch({...fixedOptions,fixedVoices:{schemaVersion:1,clips:[{...fixedClip,locale:'zh',text:'收集100顆星。'}]}});await forcedCantonese.api.unlock();forcedCantonese.api.speak({...fixedLine,locale:'zh',text:'收集100顆星。'});forcedCantonese.advance(250);assert.equal(forcedCantonese.media.length,0,'even a manifest zh clip cannot override Cantonese');assert.equal(forcedCantonese.utterances.at(-1).voice.lang,'zh-HK');await forcedCantonese.api.dispose();
  for(const mode of ['error','rejection','timeout','silent-end']){
    const fallback=launch(fixedOptions);await fallback.api.unlock();fallback.api.setMusicPlaying(false);fallback.api.speak(fixedLine);const media=fallback.media[0],lateError=media.onerror;
    if(mode==='error')media.onerror();else if(mode==='rejection'){media.rejectPlay(Object.assign(new Error('unavailable'),{name:'NotSupportedError'}));await Promise.resolve();}else if(mode==='timeout')fallback.advance(30000);else media.onended();
    fallback.advance(250);assert.equal(fallback.media.length,1);assert.equal(fallback.utterances.length,1,mode+' falls back only once before audible start');assert.equal(fallback.utterances[0].voice.name,'Daniel');assert.equal(fallback.utterances[0].text,'Collect one hundred stars.');assert.equal(fallback.api.state.voice.source,'browser');assert.ok(fallback.api.state.voice.recordingFallback);lateError();fallback.advance(1000);assert.equal(fallback.utterances.length,1,'late media error cannot double-play fallback');await fallback.api.dispose();
  }
  const interruptedMedia=launch(fixedOptions);await interruptedMedia.api.unlock();interruptedMedia.api.setMusicPlaying(false);interruptedMedia.api.speak(fixedLine);interruptedMedia.media[0].onplaying();interruptedMedia.media[0].onerror();interruptedMedia.advance(1000);assert.equal(interruptedMedia.utterances.length,0,'a partly heard recording never restarts automatically on device');assert.equal(interruptedMedia.api.state.voice.status,'error');assert.equal(interruptedMedia.api.state.music.ducking,false);await interruptedMedia.api.dispose();
  const missingGenderFallback=launch({...fixedOptions,voices:[voice('Samantha','en-US')]});await missingGenderFallback.api.unlock();missingGenderFallback.api.speak(fixedLine);missingGenderFallback.media[0].onerror();missingGenderFallback.advance(1000);assert.equal(missingGenderFallback.utterances.length,0,'recording failure cannot fall back to a female voice for a male NPC');assert.equal(missingGenderFallback.api.state.voice.errorCode,'voice-gender-unavailable');await missingGenderFallback.api.dispose();
  console.log('PASS fixed dialogue recordings: explicit dialogue opt-in, exact full-text/canonical-gender/locale match, approved local-only MP3s, permanent Cantonese device path, strict pre-start fallback, no post-start replay, lifecycle cancellation, volume/ducking, language changes and unavailable-device support.');
  console.log('PASS campus audio: strict gender+locale selection, boy/girl aliases, verified registry/hint precedence, unavailable gender/inventory changes, English number expansion and unchanged display, natural rate/pitch, gesture gating, line deduplication/replay, delayed starts, one bounded pre-start retry, no replay after start, stale completion guards, separate queue/playback timeouts, error/context diagnostics, standard voice preference, ducking, volumes/storage, hidden-page silence, scheduling and disposal.');
})().catch(error=>{console.error(error);process.exitCode=1;});
