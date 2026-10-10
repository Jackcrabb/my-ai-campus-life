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
 * metadata; verified name/URI aliases and optional voiceGenderHints map voices
 * to male/female. boy/girl character aliases normalize before selection.
 * An explicit gender requires a known match; unknown/opposite voices cannot
 * substitute. Hints override the small verified registry, not the language.
 * English numeral expansion affects speech text only; one utterance retains
 * the complete sentence and the displayed text is never changed.
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
  const CONFIG = Object.freeze({eighthSeconds:60/70/2, lookAhead:0.35, schedulerMs:100, fadeSeconds:0.12, duck:0.24, loopRest:1.2, speechRate:1, speechPitch:1, speechStartMs:250, speechRetryMs:300, speechQueueTimeoutMs:30000, speechMinTimeoutMs:30000, speechMaxTimeoutMs:240000, speechMsPerChar:450, musicGain:0.85, melodyGain:0.42});
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
  const normalizeGender = value => {const name=String(value||'').trim().toLowerCase();return ['male','boy'].includes(name)?'male':['female','girl'].includes(name)?'female':null;};
  // Windows names: https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-a-supported-languages-and-voices
  // Neural names: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
  // Apple names/identifiers were checked read-only with AVSpeechSynthesisVoice.gender
  // on 2026-10-10. Apple voices with unspecified gender (e.g. Eloquence) are
  // deliberately absent. This registry does not install or call any provider.
  const VOICE_GENDERS = Object.freeze([
    ['zh','female',['sinji','sin ji','善怡','hiumaan','hiumaanneural','hiugaai','hiugaaineural','tracy']],
    ['zh','male',['wanlung','wanlungneural','danny']],
    ['cn','female',['tingting','ting ting','婷婷','meijia','mei jia','美佳','huihui','yaoyao','yating','hanhan','xiaoxiao','xiaoxiaoneural','xiaoyi','xiaoyineural','hsiaochen','hsiaochenneural','hsiaoyu','hsiaoyuneural']],
    ['cn','male',['kangkang','zhiwei','yunxi','yunxineural','yunjian','yunjianneural','yunyang','yunyangneural','yunjhe','yunjheneural']],
    ['en','female',['samantha','karen','moira','tessa','catherine','linda','hazel','susan','heera','zira','jenny','jennyneural','aria','arianeural','sonia','sonianeural','libby','libbyneural']],
    ['en','male',['daniel','rishi','fred','james','richard','george','ravi','sean','david','mark','guy','guyneural','ryan','ryanneural']],
  ].map(([locale,gender,names])=>Object.freeze({locale,gender,names:Object.freeze(names)})));
  const voiceTokens = value => ' '+String(value||'').normalize('NFKC').toLowerCase().replace(/[._():/\\-]+/g,' ').replace(/\s+/g,' ').trim()+' ';
  function voiceGender(voice, locale, hints={}) {
    hints=hints&&typeof hints==='object'?hints:{};
    for(const key of [voice.voiceURI,voice.name]) {
      if(key&&Object.prototype.hasOwnProperty.call(hints,key))return normalizeGender(hints[key]);
    }
    const tokens=voiceTokens(voice.name)+voiceTokens(voice.voiceURI);
    return VOICE_GENDERS.find(item=>item.locale===locale&&item.names.some(name=>tokens.includes(' '+name+' ')))?.gender||null;
  }
  function selectVoice(voices, {locale='zh',characterId='narrator',gender}, hints={}) {
    const tag=localeTag(locale),requestedGender=normalizeGender(gender);
    let scored=voices.map(voice=>({voice,score:scoreVoice(voice,tag)})).filter(item=>item.score>0);
    const unavailable=reason=>({voice:null,requestedLocale:tag,requestedGender,actualGender:null,fallback:false,unavailable:true,reason});
    if(!scored.length)return unavailable('voice-language-unavailable');
    // Gender is a constraint, not a preference. Even a remote/regional match
    // takes precedence over a local standard voice of the wrong/unknown gender.
    if(requestedGender)scored=scored.filter(item=>voiceGender(item.voice,locale,hints)===requestedGender);
    if(!scored.length)return unavailable('voice-gender-unavailable');
    const best=Math.max(...scored.map(item=>item.score));
    let pool=scored.filter(item=>item.score===best).map(item=>item.voice);
    const local=pool.filter(v=>v.localService===true);if(local.length)pool=local;
    const standard=pool.filter(v=>/^(?:婷婷|善怡|美佳|ting[ -]?ting|sin[ -]?ji|mei[ -]?jia|daniel|samantha|karen|moira|tessa)(?:\b|$|[ (])/iu.test(v.name||''));
    if(standard.length)pool=standard;
    pool.sort((a,b)=>String(a.voiceURI||a.name).localeCompare(String(b.voiceURI||b.name)));
    const voice=pool[hash(characterId)%pool.length];
    return {voice,requestedLocale:tag,requestedGender,actualGender:voiceGender(voice,locale,hints),fallback:best<100,unavailable:false,reason:null};
  }
  const SMALL_NUMBERS=Object.freeze(['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']);
  const TENS=Object.freeze(['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']);
  const SCALES=Object.freeze(['','thousand','million','billion','trillion']);
  const ORDINALS=Object.freeze({one:'first',two:'second',three:'third',five:'fifth',eight:'eighth',nine:'ninth',twelve:'twelfth'});
  function underThousand(n) {
    if(n<20)return SMALL_NUMBERS[n];
    if(n<100)return TENS[Math.floor(n/10)]+(n%10?'-'+SMALL_NUMBERS[n%10]:'');
    return SMALL_NUMBERS[Math.floor(n/100)]+' hundred'+(n%100?' and '+underThousand(n%100):'');
  }
  function englishNumber(raw) {
    const text=String(raw).replaceAll(',',''),[integer,decimal]=text.split('.');
    let whole=integer||'0';
    if(whole.length>15||/^0\d/.test(whole))whole=[...whole].map(digit=>SMALL_NUMBERS[Number(digit)]).join(' ');
    else {
      const parts=[];let remaining=whole,scale=0;
      while(remaining){const chunk=Number(remaining.slice(-3));if(chunk)parts.unshift(underThousand(chunk)+(SCALES[scale]?' '+SCALES[scale]:''));remaining=remaining.slice(0,-3);scale++;}
      whole=parts.length?parts.join(' '):'zero';
    }
    return whole+(decimal!==undefined?' point '+[...decimal].map(digit=>SMALL_NUMBERS[Number(digit)]).join(' '):'');
  }
  function englishOrdinal(raw) {
    return englishNumber(raw).replace(/[a-z]+$/,word=>ORDINALS[word]||(word.endsWith('y')?word.slice(0,-1)+'ieth':word+'th'));
  }
  function englishFraction(numerator,denominator) {
    const n=Number(numerator),d=Number(denominator),word=d===2?'half':d===4?'quarter':englishOrdinal(denominator);
    if(d>=2&&d<=20&&!/^0\d/.test(denominator))return englishNumber(numerator)+' '+(n===1?word:word==='half'?'halves':word+'s');
    return englishNumber(numerator)+' over '+englishNumber(denominator);
  }
  function englishSpeechText(text) {
    // Preserve URLs/backtick code verbatim. Do not infer dates, units or the
    // meaning of identifiers. Digits outside those spans become English words
    // within a single sentence, not a queue of separately spoken characters.
    return String(text).split(/(https?:\/\/[^\s]+|`[^`]*`)/g).map((part,index)=>{
      if(index%2)return part;
      let spoken=part.replace(/(?<![\w./])([+−-]?)(\d+)[ \t]+(\d+)[ \t]*\/[ \t]*(\d+)(?![\w/])/g,(_,sign,whole,n,d)=>(sign==='-'||sign==='−'?'minus ':sign==='+'?'plus ':'')+englishNumber(whole)+' and '+englishFraction(n,d));
      spoken=spoken.replace(/(?<![\w./])([+−-]?)(\d+)[ \t]*\/[ \t]*(\d+)(?![\w/])/g,(_,sign,n,d)=>(sign==='-'||sign==='−'?'minus ':sign==='+'?'plus ':'')+englishFraction(n,d));
      return spoken.replace(/([+−-]?)(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?|\.\d+)(st|nd|rd|th)?([ \t]*%)?/gi,(match,sign,number,ordinal,percent,offset,source)=>{
        const before=source[offset-1]||'',after=source[offset+match.length]||'';
        // An attached hyphen may be a range or identifier separator. Keep
        // its punctuation rather than inventing a subtraction meaning.
        const hyphen=sign==='-'&&/[\p{L}\p{N}]/u.test(before);
        const prefix=hyphen?'-':sign==='-'||sign==='−'?'minus ':sign==='+'?'plus ':'';
        const left=!hyphen&&/[\p{L}\p{N}]/u.test(before)?' ':'';
        const right=/[\p{L}\p{N}]/u.test(after)?' ':'';
        return left+prefix+(ordinal?englishOrdinal(number):englishNumber(number))+(percent?' percent':'')+right;
      });
    }).join('');
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
    function stopVoice(status='ready') {speechGeneration++;clear(voiceWatchdog);voiceWatchdog=null;clear(voiceStartTimer);voiceStartTimer=null;if(synth&&(utterance||synth.speaking||synth.pending))synth.cancel();utterance=null;voiceStatus=synth&&Utterance?status:'unavailable';if(voiceInfo)voiceInfo={...voiceInfo,errorCode:null};ducking=false;rampMusic();emit();}
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
      const record={key:String(line.key??`${line.characterId||'narrator'}:${line.text}`),text:line.text.trim().slice(0,5000),locale:['zh','cn','en'].includes(line.locale)?line.locale:'zh',characterId:line.characterId||'narrator',gender:normalizeGender(line.gender)};
      lastLine=record;
      const lineIdentity=JSON.stringify([record.key,record.locale,record.characterId,record.gender,record.text]);
      if(!force&&lineIdentity===lastKey)return {played:false,reason:'duplicate'};
      if(!synth||!Utterance){voiceStatus='unavailable';emit();return {played:false,reason:'unavailable'};}
      if(!unlocked){voiceStatus='gesture-required';emit();return {played:false,reason:'gesture-required'};}
      if(hidden||settings.muted||settings.voiceVolume===0){stopVoice(hidden?'paused':'muted');return {played:false,reason:hidden?'hidden':'muted'};}
      stopVoice();refreshVoices();let selected=selectVoice(voices,record,voiceGenderHints);
      const selectionInfo=()=>({requestedLocale:selected.requestedLocale,actualLocale:selected.voice?.lang||null,requestedGender:selected.requestedGender,actualGender:selected.actualGender,name:selected.voice?.name||null,fallback:selected.fallback,unavailable:selected.unavailable,remote:selected.voice?selected.voice.localService!==true:false,errorCode:selected.reason});
      voiceInfo=selectionInfo();
      if(selected.unavailable){voiceStatus='unavailable';emit();return {played:false,reason:selected.reason==='voice-gender-unavailable'?selected.reason:'voice-unavailable'};}
      const generation=++speechGeneration;lastKey=lineIdentity;let attempt=0;
      const speechText=record.locale==='en'?englishSpeechText(record.text):record.text;
      function queueAttempt(delay){
        voiceStatus='queued';voiceInfo={...voiceInfo,started:false,attempt:attempt+1,lastEvent:'queued',errorCode:null};ducking=false;rampMusic();
        // Let an earlier native cancellation settle. Pending starts are cancelled
        // by stopVoice; retry callbacks also require this exact generation.
        voiceStartTimer=later(()=>{
          voiceStartTimer=null;if(generation!==speechGeneration||disposed)return;
          // Revalidate the current browser inventory before each delayed start.
          // A removed voice must not silently become the system default.
          selected=selectVoice(synth.getVoices?.()||voices,record,voiceGenderHints);
          voiceInfo={...voiceInfo,...selectionInfo()};
          if(selected.unavailable){finishVoice(generation,'unavailable',selected.reason);return;}
          attempt++;const u=new Utterance(speechText);utterance=u;let started=false;
          const current=()=>generation===speechGeneration&&!disposed&&utterance===u;
          u.voice=selected.voice;u.lang=selected.voice.lang;u.volume=settings.voiceVolume;u.rate=CONFIG.speechRate;u.pitch=CONFIG.speechPitch;
          u.onstart=()=>{if(!current())return;started=true;voiceInfo={...voiceInfo,started:true,lastEvent:'start'};voiceStatus='speaking';armWatchdog(Math.min(CONFIG.speechMaxTimeoutMs,Math.max(CONFIG.speechMinTimeoutMs,speechText.length*CONFIG.speechMsPerChar)),'speech-timeout');ducking=true;rampMusic();emit();};
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
  window.CampusAudio=Object.freeze({create,defaults:DEFAULTS,selectVoice,englishSpeechText,speechDefaults:Object.freeze({rate:CONFIG.speechRate,pitch:CONFIG.speechPitch}),melody:MELODY.map(note=>Object.freeze([...note]))});
})();
