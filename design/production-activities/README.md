# Canonical NPC activity art

These production sheets extend the existing identities after approval of purposeful campus routines. They do not replace walking sprites or dialogue portraits.

- Images are generated with the built-in imagegen tool and requested genuine transparent backgrounds. No paid API or CLI fallback is used.
- Original generated PNGs are copied unchanged into `public/campus/assets/activities/`.
- Every identity has four drawn chronological poses: preparation, main A, main B, recovery. The two main poses are a deliberately slow short animation; these sheets are not continuous motion capture or eight-frame walking cycles.
- `*.md` records preserve prompts, references and source output paths. `*.layout.json` records measured source-global crops, head-centered anchors, foot baselines, alpha statistics and an invariant standing height per identity.
- Layouts also carry `releaseStatus`. The registration script admits only `released`; a measured draft must remain `pending-visual-review` until its visual review is recorded. The four staff sheets and peer uniforms 0 and 3 are released. Uniform 0 uses two two-row sheets to keep sufficient drawing room for natural teen proportions. Peer uniforms 1–2 remain incomplete and use the existing neutral fallback.
- The measurement script reads alpha and geometry only. It does not edit image pixels or remove backgrounds.
- Source heights across the four staff poses vary by no more than 0.8% within any identity. Runtime uses one fixed identity scale rather than stretching each frame to a target box. Body build and physical-height differences remain in the existing character registry.
- Bright red flecks in some raw image-tool previews are mostly almost-transparent RGB residue: the community sheet's red fringe has a maximum alpha of 4/255, and leadership 5/255. Academic A also contains intentionally opaque red spheres on the molecular model. Original alpha is preserved, and measured crops exclude disconnected distant residue; no raster cleanup is claimed.

## Runtime contract

`CAMPUS_CHARACTERS.activity(id, activity, elapsedSeconds, avatar, stage)` returns `{atlas, identity, frame, frameIndex}` or `null`. `stage` is `enter`, `loop`, or `exit`. Elapsed time is local to that stage. Main poses use a configured 0.65 frames per second; enter/exit sequences clamp instead of repeating. The engine owns behavior dwell, transitions, pair coordination and reduced motion.

Activity registration is separate from walking registration and does not change portraits. Every student activity requires its exact uniform index; it must not borrow another outfit when art is missing. Missing duties return `null`, leaving the engine's honest neutral fallback available.

## Repeatable checks

```sh
node scripts/register-activity-atlases.mjs
node scripts/validate-activity-atlases.mjs --complete
node tests/campus-engine.test.cjs
```

`--complete` requires all 16 staff plus all four uniform variants of each of the four peers. Until every peer sheet is released, it intentionally reports the remaining coverage. Current registration is seven sheets, 24 identity/outfit variants and 96 drawings; the remaining eight peer outfit variants are reported rather than silently substituted. Validation covers PNG dimensions, crop/anchor bounds, distinct main frame indices, fixed scale, timing edge cases, interaction aliases, missing poses, and preservation of walking/portrait registrations.

Visual review must additionally confirm recognizable faces, supported props, stable head/body proportions, no foot drift and a plausible enter/main/recovery sequence at the game's displayed size. Source-sheet inspection is completed per sheet. A separate live browser contact-sheet attempt encountered an unavailable browser bridge; that does not count as completed in-game visual QA.
