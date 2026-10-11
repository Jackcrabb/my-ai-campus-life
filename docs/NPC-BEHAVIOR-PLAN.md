# Purposeful campus routines — design and implementation status

**Checkpoint: 11 October 2026.** The purposeful campus-routine direction has been approved and its behavior system is implemented in the working source. This document retains the original design rationale and distinguishes released artwork from unfinished production. It does not certify a new public deployment or a completed visual review in every room.

## Current implementation and remaining work

- [campus-routines.js](../public/campus/campus-routines.js) assigns all 20 canonical people a duty, two named stations, bounded dwell and a partner. [engine.js](../public/campus/engine.js) implements `prepare → walk → arrive → activity → recover`, interruption recovery, station reservations, partner facing/turns and paused/reduced-motion behavior. NPC speed remains 150 versus the player's 170 world units/s.
- Duties occupy 20–60 seconds between short purposeful trips. A 180-second simulation in all 18 scenes exercises the routine and paired behavior; this checks state/timing contracts, not the visual quality of every drawn pose or location.
- Corridors now have five noninteractive pupils and rooms three. Canonical staff are not cloned as ambient people. Background pupils have scene-specific duty definitions, but **their proposed faceless activity artwork is awaiting user confirmation**; neutral fallback is not a finished reading/writing animation.
- **Released activity art:** seven sheets cover **24 identity/outfit variants and 96 drawings**: all 16 staff and all four peers in uniforms 0 and 3. Each variant has preparation, main A, main B and recovery drawings. The eight peer variants in uniforms 1–2 remain unfinished; no other outfit is substituted to conceal missing art.
- The [production record](../design/production-activities/README.md) and activity validator separate released sheets from drafts. Missing activities keep the existing neutral pose with a developer diagnostic. Still-sheet inspection and automated geometry checks are recorded; a complete in-game motion review over every actual background remains outstanding.

The original baseline below was observed on 10 October 2026 at base commit `c97c5a4`, before the routine implementation. Its old pacing and decorative-prop findings explain the change; they are not descriptions of the current engine.

The player is a new student getting to know Ming Ching College. The other students and staff have ordinary school-day purposes of their own. A player may join a useful conversation, then leave the characters to continue their work. The aim is a coherent campus, rather than constant walking or a row of people waiting to dispense questions.

## 1. Original audit baseline — before this implementation

| Baseline finding | Source inspected at that checkpoint | Design consequence |
| --- | --- | --- |
| All 20 interactive characters have stable identities, individual heights, and registered world art. | [characters.js](../public/campus/characters.js), `staffRows`, `students`, `identityHeights`, `npc()` | Keep these IDs, names, faces, clothing relationships, and measured proportions. Do not replace them with copies of the player. |
| Actors alternate between two points around their starting x coordinate. | [engine.js](../public/campus/engine.js), `createRuntimeScenes()` and `updateActors()` | Existing movement can be retained, but destinations need a purpose and an explicit station. |
| Rest lasts only 3.8, 4.8, or 5.8 seconds. Most actors then walk again. | `MOTION.npcRest` and `updateActors()` | Introduce 20–60-second activities so observation and work occupy most of the school day. |
| NPC movement is capped at 150 world units/s; the player is capped at 170. Foot phase follows actual distance. | `MOTION`, `updateActors()`, `strideDistance()`; [engine tests](../tests/campus-engine.test.cjs) | Preserve the approved speed difference and acceleration/deceleration. Do not slow frame playback independently of displacement. |
| “Reading” draws three book-shaped rectangles over an otherwise ordinary idle sprite. | `drawAmbient()` | It is a decorative flag, not a reading pose: hands, eyes and posture do not participate. It must not be described as a completed reading animation. |
| “Chat” adds a small ellipsis bubble, without finding or facing a partner. | `drawAmbient()` | It is not a paired conversation. Replace it only when two real actors can occupy a shared station and respond to one another. |
| Each scene receives essentially the same boy/walker, girl/reader and a rotating staff clone. | `createRuntimeScenes()` | Replace this generic recipe with small, scene-specific casts. Do not make reading a gender role. |
| Ambient staff are selected from canonical staff IDs and only checked against the scene’s primary NPC. | `createRuntimeScenes()` | A named teacher can appear outside their assigned room, or duplicate an extra NPC. Never instantiate a second copy of a canonical person as decorative staff. |
| Registered full-body poses are idle, four distinct walking keys, and one conversational gesture. | `registeredFrame()` and atlas registrations in `characters.js` | Four drawn walk keys must not be advertised as eight unique drawings. Reading, writing, typing, watering and instrument-playing poses are absent. |
| Starting and ending a player conversation stops the NPC, then returns to a short idle timer. | `setTalking()` | Store an activity checkpoint and resume it deliberately; do not resume an arbitrary walk or teleport to the old station. |
| Dedicated dialogue portraits take precedence over fallback talk crops. | `portrait()` in `characters.js` | A full-body gesture does not automatically animate the dialogue portrait. Treat these as separate assets sharing one identity. |

Those observations referred to the engine before the new declarative routines. Use the current function names and tests rather than old line numbers to inspect the implementation.

One unrelated performance issue discovered during the audit—door-art anchor initialization inside `registeredFrame()`—has been moved to one-time scene initialization by the maintenance agent and covered by a frozen-door regression test. That fix does not add routines; see [QUALITY-AUDIT.md](QUALITY-AUDIT.md).

## 2. Narrative and learning responsibilities

**The player helps, rather than investigates people.** Retain the underlying evidence → choice → explanation structure of the four AI scenarios. Peers bring expertise and independent goals; accent, culture, disability or access requirements are not defects that the new student repairs. Staff perform a visible duty, with a relevant invitation when approached. Activities are ungraded, and characters need not talk every time a player walks past.

Use “校園情境 / 校园情境 / Campus scenario”, “一起檢視 / 一起检视 / Review together” and “建議已整理 / 建议已整理 / Recommendation recorded” where the present interface suggests criminal investigation. Keep stable mission IDs and scoring contracts; this is a future copy review, not a database rename. Completion stars remain an exploration milestone. They must not represent a student's worth, permission to belong, or literal detention inside school.

**Continuity audit finding — resolved in the current working source.** [content.js](../public/campus/content.js) now uses the canonical peer names 程曉嵐、許晉言、沈樂葵、韓芊澄 and their G/1F/2F/3F corridor meeting locations across all three locales. The library remains the context of 沈樂葵's exhibition draft, while she meets the player in the 2F corridor; 許晉言 shows his unsent upload in the 1F corridor. [app.js](../public/campus/app.js) now gives the introductory welcome to 唐若寧老師, the new-student mentor, and aligns principal, office, vice-principal and finale fallback identities with the registry. Assessment content is unchanged. [Content integrity tests](../tests/content.test.cjs) cover the updated continuity; see also the broader [quality audit](QUALITY-AUDIT.md). These corrections are separate from the still-proposed routines, poses and narrative wording refinements in this document.

Independent story/pedagogy review supports reciprocal peer help, optional ambient routines, accessible interaction, and no claims of learning gains without classroom pilots. A peer may contribute an example, thank the player, or say they will consider a suggestion. A teacher's ordinary work should remain understandable before any quiz opens.

## 3. Complete interactive cast and proposed stations

All x values below are **proposed logical world coordinates**, within the existing 1500-unit scene. A route is a short floor-lane segment between two named activities, not permission to cross furniture. Y is the scene's existing `groundY()` plus a validated floor-depth offset. The current background, doorway hit areas, occlusion and phone view must be checked before finalizing these anchors. No NPC changes rooms in this first version.

Each row uses the common interruption rule in section 5. Partners are anonymous background pupils already addressable through the `ambient-boy-<location>` / `ambient-girl-<location>` pattern; those identifier words do not determine their activity. Only one partner is required in most rooms. Partners do not gain assessment interactions.

### Four peers

| Canonical ID / name / interaction | Location and independent purpose | Anchored activity → bounded transition | Partner and dwell | Additional full-body art needed |
| --- | --- | --- | --- | --- |
| `voice` · 程曉嵐 · `voice` | G `corridor`; prepare a welcome speech that listeners can understand. | Rehearse from a cue card at x380, then check the noticeboard at x480. | `ambient-boy-corridor`: listen and paraphrase; 35–50s rehearsal, 20–30s feedback. | Cue-card reading, listening/acknowledging, card-lowered recovery. Keep her own face and bob. |
| `privacy` · 許晉言 · `privacy` | 1F `corridor1`; prepare class-magazine writing feedback while protecting people's personal details. | Read a paper checklist at x420, then compare a redacted sample at x560. | `ambient-girl-corridor1`: discuss what to remove before upload; 40–60s review, 20–30s exchange. | Checklist reading and pointing to a paper sample. No real pupil data on the prop. |
| `culture` · 沈樂葵 · `culture` | 2F `corridor2`; prepare a bilingual appreciation display that preserves its intended meaning. | Compare two paper versions at x460, then view the display at x620. | `ambient-boy-corridor2`: explain a phrase's context; 35–55s comparison, 20–35s exchange. | Two-page comparison, display-facing/pointing, attentive listening. |
| `access` · 韓芊澄 · `access` | 3F `corridor3`; organize a club practice activity with more than one way to participate. | Check a route/activity card at x230, then meet a trial participant at x330. | `ambient-girl-corridor3`: try a keyboard/paper alternative; 30–50s check, 25–40s discussion. | Checklist pose and collaborative demonstration. Do not assign an impairment or assistive device merely as a visual shorthand. |

Student uniform index continues to follow the player's index using each character's established gender counterpart. New activity drawings therefore need the same four outfit variants, while face, hair, build and skin remain character-specific. Do not substitute the main avatar for any of these peers.

### Sixteen staff

| Canonical ID / name / interaction | Location and ordinary duty | Station A → station B; route bounds | Partner and dwell | Additional full-body art needed |
| --- | --- | --- | --- | --- |
| `staff-chinese` · 岑芷蘅老師 · `subject:chinese` | 1F `chinese`; select a short passage and prepare a discussion prompt. | Read a marked passage x470 → review board prompt x620. | `ambient-boy-chinese`, quietly asks about a phrase; 40–60s reading, 20–30s explanation. | Book reading, board-pointing, book lowered. |
| `staff-english` · 傅映棠老師 · `subject:english` | 1F `english`; prepare a paired listening activity. | Organize prompt cards x660 → check a learner's example x800. | `ambient-girl-english`; 30–50s preparation, 25–40s attentive exchange. | Card sorting and listening, not constant gesturing. |
| `staff-maths` · 陸景澄老師 · `subject:maths` | 1F `maths`; compare two solution methods. | Inspect board workings x480 → annotate a worked example x640. | `ambient-boy-maths`; 35–55s review, 20–35s explanation. | Board-writing/pointing and clipboard annotation. |
| `staff-chemistry` · 莫穎珊老師 · `subject:chemistry` | 2F `chemistry`; prepare a safe model-based demonstration. | Check model pieces x710 → compare a diagram x850. | `ambient-girl-chemistry`; 35–50s checking, 20–30s explanation. | Model inspection, diagram pointing. No hazardous chemical handling animation. |
| `staff-geography` · 杜承嶼老師 · `subject:geography` | 2F `geography`; compare a map with observations. | Read field notes x750 → indicate a map feature x900. | `ambient-boy-geography`; 40–60s notes, 20–35s map discussion. | Notebook reading, map-pointing. |
| `staff-computer` · 嚴卓翹老師 · `subject:computer` | 2F `computer`; prepare a demonstration account with safe sharing settings. | Check screen checklist x550 → help at the neighboring workstation x700. | `ambient-girl-computer`; 35–55s checking, 20–35s explanation. | Screen-facing inspection and pointing. Typing requires a properly aligned workstation pose; it is not assumed. |
| `staff-history` · 范以衡老師 · `subject:history` | 3F `history`; arrange source cards by origin and date. | Read a source card x620 → compare the timeline x780. | `ambient-boy-history`; 40–60s source review, 20–35s discussion. | Card reading/sorting and timeline-pointing. |
| `staff-art` · 梁沐陶老師 · `subject:art` | 3F `art`; prepare a color and attribution discussion beside an easel. | Review sketchbook x390 → inspect an easel x540. | `ambient-girl-art`; 35–55s looking/drawing, 20–30s response. | Sketchbook drawing, easel-facing inspection. Do not move a paintbrush independently of the hand. |
| `staff-music` · 余弦朗老師 · `subject:music` | 3F `music`; prepare a rhythm exercise. | Read a score x810 → set the exercise at a music stand x960. | `ambient-boy-music`; 30–50s score reading, 20–35s quiet demonstration. | Score reading and a modest beat-marking gesture. Actual piano playing remains a later seated-pose task. |
| `staff-library` · 秦素庭老師 · `subject:library` | 4F `library`; check returned books and help select a reliable source. | Inspect a book x1070 → organize a small return stack x1200. | `ambient-girl-library`; 40–60s book checking, 20–35s recommendation. | Book reading, book carrying/placing. A return stack is a proposed prop requiring visual approval. |
| `staff-rooftop` · 葉知森老師 · `subject:rooftop` | 4F `rooftop`; record plant and weather observations. | Inspect planting bed x990 → write an observation x1130. | `ambient-boy-rooftop`; 35–55s inspection, 20–40s note-making. | Plant-facing inspection and writing. Watering requires its own approved hand/container pose. |
| `staff-playground` · 譚皓謙老師 · `subject:playground` | G `playground`; prepare an inclusive warm-up and check the court lane. | Check court markings x780 → brief a pupil at x930. | `ambient-girl-playground`; 25–40s inspection, 25–40s demonstration. | Clipboard check and a gentle warm-up demonstration. Avoid inventing strenuous repeated jumps. |
| `staff-principal` · 鍾允修校長 · `subject:hall` | G `hall`; prepare assembly with a student volunteer. | Review running order x800 → check the lectern approach x960. | `ambient-boy-hall`; 40–60s reading, 20–35s coordination. | Program reading, schedule-pointing. `exit` is a dialogue alias, not a second principal sprite. |
| `staff-vice` · 蘇韻衡副校長 · `staff:vice` | 2F `corridor2`; review a shared-space timetable and listen to a pupil proposal. | Check timetable x1030 → speak to pupil at x1100. | `ambient-girl-corridor2`; 35–55s checking, 20–35s listening. | Clipboard/timetable reading and listening. Keep clear of the computer-room entrance. |
| `staff-office` · 盧世祺書記 · `staff:office` | G `corridor`; help newcomers find rooms and check notices. | Review notices x780 → offer directions x890. | `ambient-girl-corridor`; 35–55s notice review, 20–30s directions. | Notice reading and a restrained directional gesture. No new office counter is assumed. |
| `staff-mentor` · 唐若寧老師 · `finale` | 4F `corridor4`; meet a new pupil and help plan the next part of the day. | Read orientation notes x1070 → meet pupil x1180. | `ambient-boy-corridor4`; 30–50s notes, 25–40s conversation. | Note reading and listening. `prologue` uses the same identity in an introductory overlay, not a duplicate world character. |

Rooms remain on the current five floors: G (corridor, playground, hall); 1F (corridor1, Chinese, English, maths); 2F (corridor2, science, geography, computer); 3F (corridor3, history, art, music); 4F (corridor4, library, rooftop). There is no sixth level or new navigable office.

## 4. Ambient cast without identity duplication

Use the specific partners in the table, with additional independent pupils where the composition has space. The later user request for a livelier campus is implemented as five ambient pupils per corridor and three per room. Classroom teachers already provide an adult presence. The rotating named-staff clone recipe has been removed; a named teacher belongs only to their declared scene. More actors alone do not satisfy the request for a unique visible activity: supported activity art and scene-level review are still required.

| Scene group | Background purpose | Boundary and visual requirement |
| --- | --- | --- |
| G corridor | Welcome-speech listener and a new pupil seeking directions. | Two separate pairs at the voice and office stations; do not create a four-person overlap. |
| 1F/2F/3F corridors | Editorial partner, translation partner, or activity trial participant. | Wait/read at their own reserved station; join their named peer only for a scheduled exchange. |
| 4F corridor | A new pupil planning the next stop with the mentor. | Optional second pupil reads near a bench only after a correct reading pose exists. |
| Language, maths, science, humanities and arts rooms | One pupil with a piece of work relevant to that teacher's duty. | Use the exact partner IDs above. They may hold a paper or look at a board; avoid simultaneous unrelated book overlays. |
| Library | Borrower considers a recommendation; optional independent reader. | Seating, if proposed, needs a seated sprite and correct foreground occlusion. Otherwise use standing reading. |
| Roof, playground, hall | Ecology helper, warm-up participant, assembly volunteer. | Optional passers-by make one purposeful short transit, then dwell. Do not make the whole background pace. |

Ambient pupils remain noninteractive and ungraded, with no floating names or mission markers. Their uniform index follows the player's index. The user requested faceless background pupils to distinguish them from interactive roles; the [separate preview](../design/campus-life-review-v1/14-ambient-pupils-proposal-v1.png) is awaiting confirmation. It has not been applied to runtime art. Reuse a small approved anonymous cast only where it avoids obvious twins in one scene; do not alter skin tone as a shortcut for a different role.

## 5. Small, explicit behavior model

The implementation keeps one update loop and the existing movement code, with a declarative scene routine table rather than a behavior framework, pathfinding service, or one timer per NPC. Definitions reference character IDs and named stations; runtime state belongs to each engine instance. The following is an explanatory design example; exact runtime fields and activities are in `campus-routines.js`.

```js
// Illustrative design contract; consult campus-routines.js for runtime data.
{
  actorId: 'staff-library', scene: 'library',
  stations: {
    inspect: { x: 1070, depth: 0, facing: 1 },
    returns: { x: 1200, depth: 0, facing: -1 }
  },
  steps: [
    { station: 'inspect', activity: 'read-book', dwell: [40, 60] },
    { station: 'returns', activity: 'place-book', dwell: [20, 35] }
  ],
  pair: { actorId: 'ambient-girl-library', activity: 'recommend-book' }
}
```

The state sequence is `prepare → walk → arrive → activity → recover`, with `conversation` as an explicit interruption. `prepare` releases hand props correctly; `walk` owns velocity and foot phase; `arrive` settles at the station; `activity` owns its pose and dwell; `recover` returns hands/body to a transferable pose. Walking and activity poses can never run concurrently.

| Setting | Initial bounded value | Reason |
| --- | --- | --- |
| Main activity dwell | Per-row ranges of 20–60s | Gives work and observation more screen time than travel. |
| Enter/exit pose transition | 0.25–0.45s / 0.2–0.4s, using actual approved frames | Avoid sudden prop appearance or instant posture jumps. A missing transition stays neutral rather than being improvised by stretching. |
| NPC/player speed | Preserve 150 / 170 units/s | Matches the latest approved movement difference. |
| Acceleration/deceleration | Preserve 680 / 900 units/s² initially | Existing distance-based gait stays coupled to movement. |
| Route extent | Normally 70–170 units between the listed anchors; maximum 220 | Short purposeful movement without room-crossing pathfinding. |
| Pair approach wait | At most 2s | An absent/busy partner must not stall the routine. |
| Paired exchange | 20–40s, alternating 3–6s attention/gesture beats | Two actors face one another; one speaks while the other listens. Do not flip gesture frames every render. |
| Repeated paired exchange cooldown | 45–90s | Prevent mechanical repetition; independent work continues between exchanges. |
| After player conversation | 2–4s neutral recovery, then resume checkpoint | Gives a clear end to the interruption without jumping. |
| New scene entrance | Actor-specific 0–8s phase offset | Prevents synchronized starts without changing identity or destination. |

Use a small seeded choice within these bounds and avoid picking the same optional action twice in a row. Do not add expensive world simulations for scenes the player cannot see. Suspend routine time while the engine is paused/hidden; re-entry resumes its checkpoint without a burst of accumulated events.

**Paired activity:** reserve two station slots and one pair token. Both actors arrive and face their partner. The speaker uses an approved gesture; the listener uses an appropriate still/listening pose. A shared pair record supplies turn timing. If either participant is interrupted, release the token and let the other finish into a neutral wait or independent task. No actor remains frozen waiting indefinitely. An ellipsis bubble is optional decoration, never evidence that this behavior exists.

**Player interruption:** a direct NPC click may approach and begin one dialogue; E begins nearby NPC dialogue. Passing proximity and a ground click never start a conversation. Stop and face the player promptly, saving routine step, station, remaining dwell and partner token. Because the current UI pauses the scene during dialogue, suspend both partners rather than running an invisible conversation. On closing, recover, release stale reservations and resume at the nearest valid station. Door interaction remains Space/Enter; routine changes must preserve that separate control contract.

**Reduced motion:** show each actor in a meaningful approved static activity pose; suppress autonomous walking, repetitive gestures and decorative bubbles. Direct player movement, interaction, dialogue and learning content remain available. This is a functional alternative, not removal of the characters' purpose.

## 6. Asset availability and bounded production

| Resource | Available in the current source | Remaining production |
| --- | --- | --- |
| Staff walking sheets in [life assets](../public/campus/assets/life/) and four new sheets in [activities](../public/campus/assets/activities/) | All 16 staff: existing idle, four drawn walk keys, talk gesture, plus four duty-specific drawings each; measured anchors and fixed identity scale. | Complete live scene-level motion review. New activity art does not create additional walking keys. |
| `cases-uniform-0-v2.png` through `cases-uniform-3-v2.png`, plus the released uniform-0 and uniform-3 activity sheets | Four distinct peers × four uniform indices retain idle/walk/gesture. Uniforms 0 and 3 have four activity drawings per peer. | Activity art for uniforms 1–2: eight identity/outfit variants, 32 drawings. |
| Eight player outfit sheets | Two hairstyles, idle and four walk keys per outfit; current ambient fallback retains approved art. | Approved faceless ambient identities and purposeful reading, listening, note-taking or carrying poses. These sheets are not staff replacements. |
| `staff-portraits-v3-a.png`, `staff-portraits-v3-b.png`, `cases-portraits-uniforms-v2.png` | Transparent dedicated dialogue portraits. | They are waist-up art; they cannot stand in for full-body work animations. |

The representative routine direction is approved. Production sheets preserve recognizable identities and genuine preparation/main/recovery poses; generic behavior code does not make faces and costumes generic. Remaining peer outfits must pass the same natural-body and identity review before registration. The faceless ambient proposal is a separate approval, not implied by approval of named-character duties.

Measure every new frame's crop, foot baseline, anchor and standing-height relationship. Preserve aspect ratio and physical-height variation; never stretch torso or legs to fake a pose. Keep head size stable across frames. Props must be held, put down, or remain attached to a real scene anchor. If a required pose fails to load, show the existing neutral pose and skip that activity with a developer diagnostic. Do not claim reading while rendering idle plus a floating book.

If six-to-eight distinct walking drawings are still desired, add real in-between art after a contact-sheet review. Repeating the four current frames, time interpolation, or moving a still sprite does not create new gait drawings. This routine plan can initially retain the verified four-key gait; the asset limitation should remain explicit.

## 7. Acceptance checks before release

1. Verify exactly 20 canonical interactive identities, each in its assigned scene, without cloned named staff among ambient actors. Aliases such as `prologue` and `exit` resolve to existing people.
2. Record each proposed activity in motion at desktop and phone sizes: recognizable purpose, held props, stable anatomy, short travel and 20–60s dwell. Review actual video/contact sheets, not state names alone.
3. Walk every listed route over the actual room background. Check doorway clearances, floor lane, desks, plants, foreground occlusion and mobile camera reach. Adjust anchors before approval; do not move or rescale the background to hide a bad anchor.
4. Click/E each NPC during prepare, travel, activity and paired chat. Exactly one dialogue opens; partner reservation clears; closing resumes naturally. Ground clicks/proximity never trigger it. Space/Enter still operate doors.
5. Hide/show the tab, pause, change room, reload, switch uniform/language, and enable reduced motion. No timer leaks, skipped recovery, sudden catch-up travel, duplicated partner, or change of face/outfit identity.
6. Add focused state-machine tests with a controllable clock: valid transitions, dwell bounds, one reservation per station, partner timeouts, interruptions and missing-art fallback. Retain current movement, scale, navigation and keyboard tests.
7. Review all three language versions for the four canonical peer names, corridor meeting continuity, mentor/principal roles, and non-criminal framing. Preserve question IDs, stars, teacher reports and the four ethical learning objectives.
8. Keep names inside dialogue, printing in the HUD, and the approved cream/teal/gold UI. This proposal adds no new world labels, physical printers, map rooms or interface panels.

**Release boundary:** routine code and released artwork are current-source changes, not a blanket completion or deployment claim. The remaining two peer outfit sets, faceless ambient approval/production, live motion over actual backgrounds and interruption checks at desktop/phone sizes remain explicit follow-ups. The implemented fallback protects playability while these assets are missing; it must not be described as a completed action animation.
