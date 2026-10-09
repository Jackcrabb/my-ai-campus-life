/* Optional standalone audio; loading this file does not start audio or alter UI.
 * const audio = CampusAudio.create({onState, voiceGenderHints?});
 * await audio.unlock() inside an actual click/key gesture; then
 * audio.speak({key, text, locale:'zh'|'cn'|'en', characterId, gender});
 * replay(), tryVoice(locale), stopVoice(), setMusicPlaying(bool),
 * setSettings({voiceVolume,musicVolume,muted}), resetSettings(), dispose().
 * `.state` exposes settings, voice status/selection/fallback, music status,
 * unlocked, storageAvailable. `key` identifies one displayed-language line;
 * reuse it on rerenders to avoid duplicate speech. Include locale and visit in
 * the key when a translated line or new visit should play. Cancel old speech
 * before changing language. replay() is the explicit opt-in exception.
 * Speech is synthesized when played, not a recorded/generated audio file.
 * Available voices depend on browser/OS. Web Speech exposes no standard gender
 * metadata; optional voiceGenderHints maps voiceURI or name to male/female.
 * Strict language families: zh requires Cantonese (zh-HK/yue), cn requires
 * Mandarin (zh-CN/zh-SG/zh-TW/cmn), and en requires English. Missing voices
 * return unavailable; Cantonese and Mandarin never substitute for each other.
 * Local voices are preferred within the best language match. A remote browser
 * voice may use its provider's service; state.voice.remote makes this visible.
 * Sources: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
 * Greensleeves melody transcribed from Mutopia soprano line, public domain:
 * https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly
 * Typesetter Steve Dunlop, Mutopia-2014/03/30-1247. The oscillator instrument,
 * sparse accompaniment and playback arrangement below are newly authored.
 * No examination/DSE recording, audio sample, microphone or external library.
 */
(() => {
  'use strict';
  const STORAGE_KEY = 'my-ai-campus-audio-v1';
  const DEFAULTS = Object.freeze({voiceVolume:0.8, musicVolume:0.25, muted:false});
  const CONFIG = Object.freeze({eighthSeconds:60/70/2, lookAhead:0.35, schedulerMs:100, fadeSeconds:0.12, duck:0.24, loopRest:1.2, speechStartMs:250, speechRetryMs:300, speechQueueTimeoutMs:30000, speechMinTimeoutMs:30000, speechMaxTimeoutMs:240000, speechMsPerChar:450, musicGain:0.85, melodyGain:0.42});
  const MELODY = [
    ['E4',1],['G4',2],['A4',1],['B4',1.5],['C5',0.5],['B4',1],['A4',2],['F#4',1],['D4',1.5],['E4',0.5],['F#4',1],['G4',2],['E4',1],['E4',1.5],['D#4',0.5],['E4',1],['F#4',3],['B3',2],
    ['E4',1],['G4',2],['A4',1],['B4',1.5],['C5',0.5],['B4',1],['A4',2],['F#4',1],['D4',1.5],['E4',0.5],['F#4',1],['G4',1.5],['F#4',0.5],['E4',1],['D#4',1.5],['C#4',0.5],['D#4',1],['E4',3],['E4',2],[null,1],
    ['D5',3],['D5',1.5],['C#5',0.5],['B4',1],['A4',2],['F#4',1],['D4',1.5],['E4',0.5],['F#4',1],['G4',2],['E4',1],['E4',1.5],['D#4',0.5],['E4',1],['F#4',2],['D#4',1],['B3',2],[null,1],
    ['D5',3],['D5',1.5],['C5',0.5],['B4',1],['A4',2],['F#4',1],['D4',1.5],['E4',0.5],['F#4',1],['G4',1.5],['F#4',0.5],['E4',1],['D#4',1.5],['C#4',0.5],['D#4',1],['E4',3],['E4',2],[null,1],
  ];
  const CHORDS = [['E3','B3'],['G3','D4'],['D3','A3'],['E3','B3'],['C3','G3'],['B2','F#3'],['E3','B3'],['G3','D4'],['D3','A3'],['E3','B3'],['B2','F#3'],['E3','B3'],['G3','D4'],['D3','A3'],['E3','B3'],['B2','F#3']];
  const clamp = (value,fallback) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0,Math.min(1,value)) : fallback;
  const localeTag = value => value === 'cn' ? 'zh-CN' : value === 'en' ? 'en-GB' : 'zh-HK';
  const hash = value => [...String(value)].reduce((n,c)=>(Math.imul(n,31)+c.codePointAt(0))>>>0,0);
  const frequency = note => {
    const match=/^([A-G])(#?)(\d)$/.exec(note), semitone={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1]]+(match[2]?1:0);
    return 440*Math.pow(2,(((Number(match[3])+1)*12+semitone)-69)/12);
  };
  function scoreVoice(voice, tag) {
    const lang=String(voice.lang||'').replaceAll('_','-').toLowerCase();
    const parts=lang.split('-'), cantonese=parts.includes('yue')||(parts[0]==='zh'&&parts.includes('hk'));
    if(tag==='zh-HK')return cantonese?100:0;
    if(tag==='zh-CN') {
      if(cantonese)return 0;
      const mandarin=parts[0]==='cmn'||(parts[0]==='zh'&&parts.some(part=>['cn','sg','tw'].includes(part)));
      return mandarin?(parts.includes('cn')?100:75):0;
    }
    return parts[0]==='en'?(lang==='en-gb'?100:75):0;
  }
  function selectVoice(voices, {locale='zh',characterId='narrator',gender}, hints={}) {
    const tag=localeTag(locale), scored=voices.map(voice=>({voice,score:scoreVoice(voice,tag)}));
    const best=Math.max(0,...scored.map(x=>x.score));
    if(!best)return {voice:null,requestedLocale:tag,fallback:false,unavailable:true};
    let pool=scored.filter(x=>x.score===best).map(x=>x.voice);
    const local=pool.filter(v=>v.localService===true);if(local.length)pool=local;
    // Prefer clear standard reading voices over novelty families when available.
    const standard=pool.filter(v=>/^(?:婷婷|善怡|美佳|ting[ -]?ting|sin[ -]?ji|mei[ -]?jia|daniel|samantha|karen|moira|tessa)(?:\b|$|[ (])/iu.test(v.name||''));
    if(standard.length)pool=standard;
    const preferred=pool.filter(v=>hints[v.voiceURI]===gender||hints[v.name]===gender);
    if(gender&&preferred.length)pool=preferred;
    pool.sort((a,b)=>String(a.voiceURI||a.name).localeCompare(String(b.voiceURI||b.name)));
    const voice=pool[hash(characterId)%pool.length];
    return {voice,requestedLocale:tag,fallback:best<100,unavailable:false};
  }
  function create({onState=()=>{},voiceGenderHints={}}={}) {
    let settings={...DEFAULTS},storageAvailable=true,disposed=false,unlocked=false,hidden=!!document.hidden;
    try {const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(raw&&typeof raw==='object')settings={voiceVolume:clamp(raw.voiceVolume,DEFAULTS.voiceVolume),musicVolume:clamp(raw.musicVolume,DEFAULTS.musicVolume),muted:raw.muted===true};}catch{storageAvailable=false;}
    const synth=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance,Context=window.AudioContext||window.webkitAudioContext;
    let voices=[],voiceStatus=synth&&Utterance?'ready':'unavailable',voiceInfo=null,lastLine=null,lastKey=null,utterance=null,speechGeneration=0,voiceWatchdog=null,voiceStartTimer=null;
    let context=null,musicGain=null,musicStatus=Context?'locked':'unavailable',musicRequested=true,musicTimer=null,eventIndex=0,loopStart=0,ducking=false,musicError=null;
    const nodes=new Set(),timers=new Set();
    const state=()=>({settings:{...settings},voice:{status:voiceStatus,...voiceInfo},music:{status:musicStatus,requested:musicRequested,contextState:context?.state||'uninitialized',gain:musicTarget(),ducking,errorCode:musicError},unlocked,hidden,storageAvailable,disposed});
    const emit=()=>{if(!disposed)onState(state());};
    const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;};
    const clear=id=>{if(id!==null){clearTimeout(id);timers.delete(id);}};
    const musicTarget=()=>settings.muted||hidden||!musicRequested?0:settings.musicVolume*CONFIG.musicGain*(ducking?CONFIG.duck:1);
    function rampMusic(){if(!context||!musicGain)return;const t=context.currentTime;musicGain.gain.cancelScheduledValues(t);musicGain.gain.setTargetAtTime(musicTarget(),t,CONFIG.fadeSeconds/3);}
    function finishVoice(generation,status='ready',errorCode=null) {if(generation!==speechGeneration||disposed)return;clear(voiceWatchdog);voiceWatchdog=null;clear(voiceStartTimer);voiceStartTimer=null;utterance=null;voiceStatus=status;voiceInfo={...voiceInfo,errorCode};ducking=false;rampMusic();emit();}
    function stopVoice(status='ready') {speechGeneration++;clear(voiceWatchdog);voiceWatchdog=null;clear(voiceStartTimer);voiceStartTimer=null;if(utterance&&synth)synth.cancel();utterance=null;voiceStatus=synth&&Utterance?status:'unavailable';if(voiceInfo)voiceInfo={...voiceInfo,errorCode:null};ducking=false;rampMusic();emit();}
    function refreshVoices(){if(disposed)return;voices=synth?.getVoices?.()||[];emit();}
    synth?.addEventListener?.('voiceschanged',refreshVoices);refreshVoices();
    const events=[];let duration=0;
    for(const [note,beats]of MELODY){if(note)events.push({at:duration,note,duration:beats*CONFIG.eighthSeconds,volume:CONFIG.melodyGain});duration+=beats*CONFIG.eighthSeconds;}
    // Sparse, newly arranged two-note broken chords; no borrowed recording.
    for(let beat=1,bar=0;beat*CONFIG.eighthSeconds<duration;beat+=6,bar++){
      const chord=CHORDS[bar%CHORDS.length];
      events.push({at:beat*CONFIG.eighthSeconds,note:chord[0],duration:5*CONFIG.eighthSeconds,volume:0.11});
      events.push({at:(beat+3)*CONFIG.eighthSeconds,note:chord[1],duration:2.8*CONFIG.eighthSeconds,volume:0.07});
    }
    events.sort((a,b)=>a.at-b.at);const loopDuration=duration+CONFIG.loopRest;
    function pluck(event,at){
      const gain=context.createGain();gain.connect(musicGain);
      gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(event.volume,at+0.012);
      const end=at+Math.min(event.duration+0.2,2.7);gain.gain.exponentialRampToValueAtTime(0.014,end);
      gain.gain.exponentialRampToValueAtTime(0.0001,end+0.12);
      const osc=context.createOscillator();osc.type='triangle';osc.frequency.setValueAtTime(frequency(event.note),at);osc.connect(gain);
      const node={osc,gain};nodes.add(node);osc.onended=()=>{nodes.delete(node);osc.disconnect();gain.disconnect();};
      osc.start(at);osc.stop(end+0.15);
    }
    function schedule(){
      musicTimer=null;if(disposed||hidden||!context||context.state!=='running'||!musicRequested||settings.muted||settings.musicVolume===0)return;
      const horizon=context.currentTime+CONFIG.lookAhead;
      while(loopStart+events[eventIndex].at<horizon){
        const event=events[eventIndex],at=loopStart+event.at;
        if(at>=context.currentTime-0.02)pluck(event,Math.max(at,context.currentTime));
        eventIndex++;if(eventIndex===events.length){eventIndex=0;loopStart+=loopDuration;}
      }
      musicTimer=later(schedule,CONFIG.schedulerMs);
    }
    function silenceNodes(){
      if(!context)return;const at=context.currentTime;
      for(const node of nodes){node.gain.gain.cancelScheduledValues(at);node.gain.gain.setTargetAtTime(0.0001,at,0.02);try{node.osc.stop(at+0.08);}catch{/* Already stopped. */}}
    }
    function stopMusic(){clear(musicTimer);musicTimer=null;silenceNodes();musicStatus=Context?(unlocked?'paused':'locked'):'unavailable';rampMusic();emit();}
    function startMusic(){
      if(disposed||!context||context.state!=='running'||hidden||!musicRequested||settings.muted||settings.musicVolume===0){stopMusic();return;}
      if(musicTimer!==null){rampMusic();return;}
      eventIndex=0;loopStart=context.currentTime+0.06;musicStatus='playing';rampMusic();schedule();emit();
    }
    async function unlock(){
      if(disposed)return false;
      if(window.navigator?.userActivation&&window.navigator.userActivation.isActive===false){voiceStatus='gesture-required';musicStatus=Context?'gesture-required':'unavailable';emit();return false;}
      unlocked=true;
      if(Context){
        try{if(!context){context=new Context();musicGain=context.createGain();musicGain.gain.value=0;musicGain.connect(context.destination);context.onstatechange=()=>{if(disposed||hidden)return;if(context.state==='running')startMusic();else{clear(musicTimer);musicTimer=null;musicStatus=context.state==='interrupted'?'interrupted':'gesture-required';emit();}};}if(context.state!=='running')await context.resume();if(disposed)return false;if(context.state==='running')startMusic();else musicStatus='gesture-required';}
        catch(error){musicStatus='unavailable';musicError=error?.name||'audio-context-error';}
      }
      if(voiceStatus==='gesture-required')voiceStatus=synth&&Utterance?'ready':'unavailable';
      refreshVoices();emit();return true;
    }
    function speak(line,{force=false}={}){
      if(disposed||!line||typeof line.text!=='string'||!line.text.trim())return {played:false,reason:'empty'};
      const record={key:String(line.key??`${line.characterId||'narrator'}:${line.text}`),text:line.text.trim().slice(0,5000),locale:['zh','cn','en'].includes(line.locale)?line.locale:'zh',characterId:line.characterId||'narrator',gender:line.gender};
      lastLine=record;
      if(!force&&record.key===lastKey)return {played:false,reason:'duplicate'};
      if(!synth||!Utterance){voiceStatus='unavailable';emit();return {played:false,reason:'unavailable'};}
      if(!unlocked){voiceStatus='gesture-required';emit();return {played:false,reason:'gesture-required'};}
      if(hidden||settings.muted||settings.voiceVolume===0){stopVoice(hidden?'paused':'muted');return {played:false,reason:hidden?'hidden':'muted'};}
      stopVoice();refreshVoices();const selected=selectVoice(voices,record,voiceGenderHints);
      voiceInfo={requestedLocale:selected.requestedLocale,actualLocale:selected.voice?.lang||null,name:selected.voice?.name||null,fallback:selected.fallback,unavailable:selected.unavailable,remote:selected.voice?selected.voice.localService!==true:false,errorCode:null};
      if(selected.unavailable){voiceStatus='unavailable';emit();return {played:false,reason:'voice-unavailable'};}
      const generation=++speechGeneration;lastKey=record.key;let attempt=0;
      function queueAttempt(delay){
        voiceStatus='queued';voiceInfo={...voiceInfo,started:false,attempt:attempt+1,lastEvent:'queued',errorCode:null};ducking=false;rampMusic();
        // Let an earlier native cancellation settle. Pending starts are cancelled
        // by stopVoice; retry callbacks also require this exact generation.
        voiceStartTimer=later(()=>{
          voiceStartTimer=null;if(generation!==speechGeneration||disposed)return;
          attempt++;const u=new Utterance(record.text);utterance=u;let started=false;
          const current=()=>generation===speechGeneration&&!disposed&&utterance===u;
          u.voice=selected.voice;u.lang=selected.voice.lang;u.volume=settings.voiceVolume;u.rate=record.locale==='en'?0.96:0.93;u.pitch=1;
          u.onstart=()=>{if(!current())return;started=true;voiceInfo={...voiceInfo,started:true,lastEvent:'start'};voiceStatus='speaking';armWatchdog(Math.min(CONFIG.speechMaxTimeoutMs,Math.max(CONFIG.speechMinTimeoutMs,record.text.length*CONFIG.speechMsPerChar)),'speech-timeout');ducking=true;rampMusic();emit();};
          u.onend=()=>{if(!current())return;voiceInfo={...voiceInfo,lastEvent:started?'end':'end-before-start'};finishVoice(generation,started?'ready':'error',started?null:'speech-did-not-start');};
          u.onerror=event=>{
            if(!current())return;
            const code=event.error||'speech-error';clear(voiceWatchdog);voiceWatchdog=null;
            // One retry is safe only before the engine reports any speech start.
            // Once a line has started, only explicit Replay may read it again.
            if(!started&&attempt<2&&['interrupted','canceled'].includes(code)){
              utterance=null;voiceInfo={...voiceInfo,retryCause:code};queueAttempt(CONFIG.speechRetryMs);emit();return;
            }
            voiceInfo={...voiceInfo,lastEvent:'error'};finishVoice(generation,code==='not-allowed'?'gesture-required':'error',code);
          };
          function armWatchdog(timeout,errorCode){
            clear(voiceWatchdog);
            voiceWatchdog=later(()=>{
              if(!current())return;
              // Finish first so a late native cancel callback cannot hide the
              // real timeout. Queue delay never consumes the speaking allowance.
              voiceInfo={...voiceInfo,lastEvent:'timeout'};finishVoice(generation,'error',errorCode);synth.cancel();
            },timeout);
          }
          armWatchdog(CONFIG.speechQueueTimeoutMs,'speech-start-timeout');
          try{if(synth.paused)synth.resume?.();synth.speak(u);}catch(error){voiceInfo={...voiceInfo,lastEvent:'error'};finishVoice(generation,'error',error?.name||'speech-error');}
        },delay);
      }
      queueAttempt(CONFIG.speechStartMs);
      emit();return {played:true,voice:voiceInfo};
    }
    function replay(){return lastLine?speak(lastLine,{force:true}):{played:false,reason:'no-line'};}
    function tryVoice(locale='zh') {const previousLine=lastLine,previousKey=lastKey;const text=locale==='en'?'Welcome to your AI campus life.':locale==='cn'?'欢迎来到我的人工智能校园生活。':'歡迎來到我的人工智能校園生活。';const result=speak({key:'voice-preview',text,locale,characterId:'preview'},{force:true});lastLine=previousLine;lastKey=previousKey;return result;}
    function setSettings(patch={}){
      if(disposed)return state();const previous=settings;
      settings={voiceVolume:clamp(patch.voiceVolume,settings.voiceVolume),musicVolume:clamp(patch.musicVolume,settings.musicVolume),muted:typeof patch.muted==='boolean'?patch.muted:settings.muted};
      try{localStorage.setItem(STORAGE_KEY,JSON.stringify(settings));}catch{storageAvailable=false;}
      if(settings.muted||settings.voiceVolume===0)stopVoice('muted');else if(utterance&&previous.voiceVolume!==settings.voiceVolume)utterance.volume=settings.voiceVolume;
      if(settings.muted||settings.musicVolume===0)stopMusic();else if(unlocked)startMusic();rampMusic();emit();return state();
    }
    function setMusicPlaying(value){musicRequested=value===true;if(musicRequested)startMusic();else stopMusic();emit();}
    async function visibility(){
      if(disposed)return;hidden=!!document.hidden;
      if(hidden){stopVoice('paused');clear(musicTimer);musicTimer=null;for(const node of nodes){try{node.osc.stop();}catch{}node.osc.disconnect();node.gain.disconnect();}nodes.clear();musicStatus=context?'paused':musicStatus;rampMusic();try{await context?.suspend();}catch{musicStatus='error';}}
      else if(context&&unlocked){try{await context.resume();if(!disposed)startMusic();}catch{musicStatus='gesture-required';}}
      emit();
    }
    document.addEventListener('visibilitychange',visibility);
    async function dispose(){
      if(disposed)return;stopVoice();disposed=true;clear(musicTimer);musicTimer=null;
      for(const id of timers)clearTimeout(id);timers.clear();
      document.removeEventListener('visibilitychange',visibility);synth?.removeEventListener?.('voiceschanged',refreshVoices);
      for(const node of nodes){try{node.osc.stop();}catch{}node.osc.disconnect();node.gain.disconnect();}nodes.clear();
      musicGain?.disconnect();if(context)context.onstatechange=null;try{await context?.close();}catch{}context=null;musicGain=null;
    }
    return {unlock,speak,replay,tryVoice,stopVoice,setSettings,setMusicPlaying,resetSettings:()=>setSettings(DEFAULTS),dispose,get state(){return state();}};
  }
  window.CampusAudio=Object.freeze({create,defaults:DEFAULTS,selectVoice,melody:MELODY.map(note=>Object.freeze([...note]))});
})();
