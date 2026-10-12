/* Purposeful, ungraded school-day routines. Coordinates use the 1500-unit world.
 * Activity names request real registered artwork; the engine never invents props.
 */
(() => {
  'use strict';
  const timing = Object.freeze({
    prepare: 0.35, arrive: 0.35, recover: 0.3,
    conversationRecovery: [2, 4], pairWait: 2, pairDwell: [20, 35],
    pairTurn: [3, 6], pairCooldown: [45, 90], initialStagger: 8,
    stationClearance: 34, actorSeparation: 48,
  });
  const rows = [
    // canonical identity, scene, primary duty, two named stations, dwell, partner
    ['voice','corridor','read','speech-cue-card',380,'welcome-feedback',480,[35,50],'boy'],
    ['privacy','corridor1','check','redaction-checklist',420,'magazine-review',560,[40,60],'girl'],
    ['culture','corridor2','read','bilingual-draft',460,'display-discussion',620,[35,55],'boy'],
    ['access','corridor3','check','club-access-plan',230,'participant-feedback',330,[30,50],'girl'],
    ['staff-chinese','chinese','read','marked-passage',470,'discussion-prompt',620,[40,60],'boy'],
    ['staff-english','english','organise','listening-cards',660,'learner-example',800,[30,50],'girl'],
    ['staff-maths','maths','write','solution-methods',480,'worked-example',640,[35,55],'boy'],
    ['staff-chemistry','chemistry','check','model-check',710,'diagram-explanation',850,[35,50],'girl'],
    ['staff-geography','geography','read','field-notes',750,'map-feature',900,[40,60],'boy'],
    ['staff-computer','computer','check','safe-demo-checklist',550,'workstation-help',700,[35,55],'girl'],
    ['staff-history','history','organise','source-cards',620,'timeline-comparison',780,[40,60],'boy'],
    ['staff-art','art','write','sketchbook-review',390,'easel-discussion',540,[35,55],'girl'],
    ['staff-music','music','play-music','rhythm-preparation',810,'rhythm-response',960,[30,50],'boy'],
    ['staff-library','library','read','source-reading',1070,'source-recommendation',1200,[40,60],'girl'],
    ['staff-rooftop','rooftop','write','field-observation-notes',990,'observation-discussion',1130,[35,55],'boy'],
    ['staff-playground','playground','coach','court-lane-check',780,'warmup-briefing',930,[25,40],'girl'],
    ['staff-principal','hall','read','assembly-running-order',800,'volunteer-coordination',960,[40,60],'boy'],
    ['staff-vice','corridor2','check','shared-space-timetable',1030,'pupil-proposal',1100,[35,55],'girl'],
    ['staff-office','corridor','organise','notice-review',780,'newcomer-directions',890,[35,55],'girl'],
    ['staff-mentor','corridor4','read','orientation-notes',1070,'new-pupil-plan',1180,[30,50],'boy'],
  ];
  const definitions = Object.fromEntries(rows.map(([id,scene,activity,a,x,b,y,dwell,partner]) => [id, {
    id, scene, partnerId: `ambient-${partner}-${scene}`,
    steps: [
      { station: a, x, depth: 0, facing: 1, activity, dwell },
      { station: b, x: y, depth: 0, facing: -1, activity: 'explain', dwell: [20,35], pair: true },
    ],
  }]));
  const ambientDuties = Object.freeze({
    corridor:['read','check','organise'], corridor1:['read','write','check'],
    corridor2:['check','read','organise'], corridor3:['check','write','read'], corridor4:['read','organise','check'],
    chinese:['read','write'], english:['read','listen'], maths:['write','check'], chemistry:['check','read'],
    geography:['read','write'], computer:['check','read'], history:['read','organise'], art:['write','check'],
    music:['listen','play-music'], library:['read','organise'], rooftop:['check','write'], playground:['coach','check'], hall:['read','organise'],
  });
  window.CAMPUS_ROUTINES = Object.freeze({ timing, definitions, ambientDuties });
})();
