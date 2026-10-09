'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../public/campus/campus-audio.js'),'utf8');
function launch({voices,stored,tts=true,audio=true,storageFails=false,gesture=true,cancelRace=false}={}){
  let now=0,nextTimer=0,storedText=stored===undefined?null:JSON.stringify(stored);const timers=new Map(),docListeners=new Map(),speechListeners=new Map(),contexts=[],utterances=[],states=[];
  const document={hidden:false,addEventListener(k,fn){docListeners.set(k,fn);},removeEventListener(k){docListeners.delete(k);}};
  let lastCancelled=-Infinity;const synth={voices:voices||[{name:'Cantonese Local',lang:'zh-HK',localService:true,voiceURI:'hk-local'},{name:'Mandarin Local',lang:'zh-CN',localService:true,voiceURI:'cn-local'},{name:'British Local',lang:'en-GB',localService:true,voiceURI:'gb-local'}],cancels:0,
    getVoices(){return this.voices;},speak(u){utterances.push(u);this.active=u;if(cancelRace&&now-lastCancelled<200)u.onerror?.({error:"canceled"});},cancel(){this.cancels++;lastCancelled=now;const active=this.active;this.active=null;active?.onerror?.({error:'canceled'});},addEventListener(k,fn){speechListeners.set(k,fn);},removeEventListener(k){speechListeners.delete(k);}};
  class Param{constructor(){this.value=0;this.calls=[];}setValueAtTime(v,t){this.value=v;this.calls.push(['set',v,t]);}linearRampToValueAtTime(v,t){this.value=v;this.calls.push(['linear',v,t]);}exponentialRampToValueAtTime(v,t){this.value=v;this.calls.push(['exp',v,t]);}setTargetAtTime(v,t,c){this.value=v;this.calls.push(['target',v,t,c]);}cancelScheduledValues(t){this.calls.push(['cancel',t]);}}
  class Context{constructor(){this.state='suspended';this.offset=0;this.started=0;this.destination={};this.oscs=[];this.gains=[];contexts.push(this);}get currentTime(){return this.offset+(this.state==='running'?(now-this.started)/1000:0);}async resume(){this.started=now;this.state='running';}async suspend(){this.offset=this.currentTime;this.state='suspended';}async close(){this.state='closed';}
    createGain(){const node={gain:new Param(),connect(){},disconnect(){node.disconnected=true;}};this.gains.push(node);return node;}
    createOscillator(){const o={frequency:new Param(),connect(){},disconnect(){o.disconnected=true;},start(t){o.startAt=t;},stop(t){o.stopAt=t??0;}};this.oscs.push(o);return o;}}
  const window={navigator:{userActivation:{isActive:gesture}},...(tts?{speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}}:{}),...(audio?{AudioContext:Context}:{})};
  const context=vm.createContext({window,document,localStorage:{getItem(){if(storageFails)throw Error();return storedText;},setItem(k,v){if(storageFails)throw Error();storedText=v;}},setTimeout(fn,delay){const id=++nextTimer;timers.set(id,{fn,at:now+delay});return id;},clearTimeout(id){timers.delete(id);},console});
  vm.runInContext(source,context);const api=window.CampusAudio.create({onState:s=>states.push(s)});
  return{api,module:window.CampusAudio,window,document,synth,utterances,contexts,states,timers,speechListeners,docListeners,stored:()=>JSON.parse(storedText),async hidden(value){document.hidden=value;await docListeners.get('visibilitychange')();},advance(ms){const end=now+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;}};
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
  assert.equal(a.speak({key:'a',text:'Hello',locale:'en'}).reason,'duplicate','language rerender must not speak line twice');
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
  const loading=launch({voices:[]});await loading.api.unlock();assert.equal(loading.api.speak({key:'v',text:'你好'}).reason,'voice-unavailable');
  loading.synth.voices=[{name:'Mandarin',lang:'zh-CN',voiceURI:'remote-cn',localService:false}];loading.speechListeners.get('voiceschanged')();
  assert.equal(loading.api.speak({key:'v',text:'你好',locale:'zh'}).reason,'voice-unavailable','Traditional Chinese must not silently use Mandarin');
  assert.equal(loading.utterances.length,0);assert.equal(loading.api.state.voice.unavailable,true);assert.equal(loading.api.state.voice.actualLocale,null);
  loading.synth.voices=[{name:'Cantonese',lang:'yue-Hant-HK',voiceURI:'remote-hk',localService:false}];loading.speechListeners.get('voiceschanged')();
  assert.equal(loading.api.speak({key:'cn',text:'你好',locale:'cn'}).reason,'voice-unavailable','Simplified Chinese must not silently use Cantonese');
  assert.equal(loading.utterances.length,0);
  assert.equal(loading.api.speak({key:'v',text:'你好',locale:'zh'}).played,true);loading.advance(250);assert.equal(loading.api.state.voice.fallback,false);assert.equal(loading.api.state.voice.remote,true);assert.equal(loading.api.state.voice.actualLocale,'yue-Hant-HK');
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
  console.log('PASS campus audio: gesture gating, strict Cantonese/Mandarin/English selection and within-language fallback, line deduplication/replay, delayed starts, one bounded pre-start retry, no replay after start, stale completion guards, separate queue/playback timeouts, error/context diagnostics, standard voice preference, ducking, volumes/storage, hidden-page silence, scheduling and disposal.');
})().catch(error=>{console.error(error);process.exitCode=1;});
