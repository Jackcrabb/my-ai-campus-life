# Private GitHub export check

**Repository:** `Jackcrabb/my-ai-campus-life` (private, destination supplied by the project owner).  
**Snapshot:** 2026-10-09T23:14:34+08:00.  
**Scope:** this `lumen-lab/` project only. Read-only inspection except for this report; no staging, commit, push, deployment, database access or secret-file reading was performed.

## Decision

**Current source/assets are suitable candidates for the private export, with the pending items below.** No actual class code, student recovery code, owner personal email, private key, provider token or credential configuration was found in the inspected candidate text files. Local environment and runtime data are excluded. This is a scoped source audit with redacted pattern review, not a guarantee against every possible secret format or information embedded in images.

**Do not treat this as a final upload approval while final source edits are in progress.** The root agent owns final QA, deployment, GitHub staging and upload.

## Pending items / blockers

1. **Archive completed and included.** `Chat Recording/` contains the English conversation, chronological generated-image index and original generated drafts. The archive agent reports 103 translated root messages and 72 chronological image records. The completed text was independently scanned for email, private-key, common provider-token and literal runtime-code patterns, with no matches. Private values use explicit redaction markers. Image hashes and relative links were validated by the archive agent.
2. **Final QA/deployment edits may change the snapshot.** Refresh the inventory and inspect the staged diff before upload; update the README only with the verified release URL. No current deployment URL is certified by this audit.
3. **Seven formerly tracked prototype files in `dist/` are deleted in the working tree.** Record those deletions during the intended export. Do not force-add the new ignored build output: the current frontend source is `public/campus/`.

## Included candidate groups

The snapshot contains **317 existing regular files**, **156,293,243 bytes (149.05 MiB)**, excluding only this report itself. Of these, **6** are already tracked and **311** are untracked. Every listed untracked file is intended for inclusion. No currently ignored file needs to be force-added.

| Group | Files | Bytes | MiB |
|---|---:|---:|---:|
| `(root files)` | 20 | 605,390 | 0.58 |
| `.openai` | 1 | 91 | 0.00 |
| `Chat Recording` | 20 | 32,033,065 | 30.55 |
| `app` | 5 | 8,090 | 0.01 |
| `build` | 5 | 17,332 | 0.02 |
| `components` | 62 | 214,987 | 0.21 |
| `data` | 1 | 671,355 | 0.64 |
| `db` | 2 | 4,828 | 0.00 |
| `design` | 73 | 27,014,458 | 25.76 |
| `drizzle` | 3 | 25,410 | 0.02 |
| `examples` | 2 | 2,070 | 0.00 |
| `hooks` | 1 | 565 | 0.00 |
| `lib` | 11 | 79,001 | 0.08 |
| `public` | 69 | 94,223,270 | 89.86 |
| `scripts` | 15 | 94,864 | 0.09 |
| `tests` | 25 | 1,281,363 | 1.22 |
| `vendor` | 2 | 17,104 | 0.02 |

Include the application/API, D1 schema and migrations, dependency manifest/lockfile, build adapters, generated type declarations, starter components/hooks/examples, vendored libraries with their licence files, question data/authoring sources, all original public assets and retained iterations, design images/provenance/layout metadata, tests/previews, README variants, user/teaching guides and QA records. The completed conversation archive is included; add this report as documentation too.

## Excluded items

| Exclusion | Reason / verification |
|---|---|
| `node_modules/` | Dependency installation; currently a symlink. It was not traversed and must not be committed. |
| `.dev.vars*`, `.env*` except a deliberate example file | Environment/credential settings. `.dev.vars` is ignored and its contents were not read by this audit. No such configuration is a current tracked candidate. |
| `.wrangler/`, `.sites-runtime/` | Local D1/session/runtime data and logs; ignored, not scanned for content, not candidates. |
| `dist/`, `.next/`, `.vinext/`, `*.tsbuildinfo` | Generated build/cache outputs; ignored. Preserve deletion of old tracked `dist/` source files. |
| `.git/` | Repository internals; not part of the file export. |
| `*.tgz`, `*.zip`, `.DS_Store` | Ignored package/archive/OS artifacts. Review any intentionally required archive separately rather than force-adding it. |
| Syllabus PDF, private notes, student exports | No PDF, spreadsheet export, CSV, database, private-key or certificate file was found among the candidates. Files outside this project were not inspected. |

## Safety review

- Candidate text was checked for private-key markers, common GitHub/OpenAI/AWS token patterns, credentials in URLs, email addresses, and literal class/recovery/session/API values. Matches were reviewed without printing values.
- Literal class/recovery values in backend/client/integration/teacher tests and preview HTML are synthetic fixtures, not live student credentials. They belong with the tests.
- Email-shaped strings are reserved/example-domain fixtures or the vendored local mock-auth persona. No project owner personal email was found. Production owner identity remains environment-configured.
- `.npmrc` contains only the non-secret `audit`, `fund`, and `update-notifier` settings; no registry authentication is configured there.
- `.openai/hosting.json` contains the existing project identity and binding names. These are project metadata, not credentials; preserve them for the deployment association.
- The existing repository has one historical commit. A historical path scan found no environment files, local runtime folders, dependency folders, student exports, databases, key/certificate files or syllabus PDFs. The seven historical static prototype paths are the intended deletions noted above.
- This audit did not OCR every binary image. Existing image candidates are project artwork/review/QA material; the conversation archive contains generated artwork rather than captured student records; its own provenance/hash check is documented separately.

## Source completeness

- The question source `data/grade-bank.json` contains **234** entries; it and the grade-bank authoring source, runtime question files, content tests and backend seed consumer are included.
- All **51 distinct explicit static runtime targets** identified from HTML attributes, CSS URLs and quoted asset paths resolved locally. No missing explicit runtime reference was found. Dynamic behavior is covered by the project test/QA workflow rather than inferred from this scan.
- Eight player atlases, four staff atlas families, the four-student atlas, their retained revisions, measured layouts and exact generation records are included. The character registry determines which revision is active.
- Original scene backgrounds, approved review images, generated-image provenance and earlier iterations are retained. Absolute source paths mentioned in provenance are historical lineage references, not external build dependencies.
- `package.json`, `package-lock.json`, the Node requirement, installation/build scripts, D1 migration SQL and Drizzle metadata are present. Referenced development and test commands in the English README resolve to existing files/scripts.
- The largest current candidate is 2.84 MiB. No current individual file exceeds 100 MiB. This is a local size check, not a claim about future archive additions or GitHub quota.

## Full snapshot manifest

The following list includes existing candidate regular files only. `tracked` indicates membership in the current index, not that current edits have been committed. This report itself is additional intended documentation; the completed conversation archive is included below.

| Path | Bytes | Status |
|---|---:|---|
| `.gitignore` | 130 | untracked — include |
| `.npmrc` | 45 | untracked — include |
| `.openai/hosting.json` | 91 | tracked |
| `ASSET-PROVENANCE.md` | 12,845 | tracked |
| `Chat Recording/README.md` | 4,520 | untracked — include |
| `Chat Recording/conversation-en.md` | 90,681 | untracked — include |
| `Chat Recording/generated-images.json` | 47,570 | untracked — include |
| `Chat Recording/generated-images.md` | 11,810 | untracked — include |
| `Chat Recording/generated-images/003-exec-82f0e8b0-625f-4717-91eb-8ca15f6acd12.png` | 2,749,705 | untracked — include |
| `Chat Recording/generated-images/004-exec-ff39f261-56e7-428f-b659-50e924130b9b.png` | 2,121,976 | untracked — include |
| `Chat Recording/generated-images/011-exec-69def568-ed8e-446e-a562-bfa762036065.png` | 2,466,142 | untracked — include |
| `Chat Recording/generated-images/016-exec-367a70f9-9246-4dae-8255-1478bd2d8899.png` | 2,319,521 | untracked — include |
| `Chat Recording/generated-images/036-exec-373a309a-5b6e-4912-9f48-ed56fe67bc7b.png` | 2,242,869 | untracked — include |
| `Chat Recording/generated-images/043-exec-2b3d04f7-96bd-4b00-bbf9-91a9ac31ed8f.png` | 1,971,087 | untracked — include |
| `Chat Recording/generated-images/045-exec-bb339516-c4f8-47ea-835f-3258c6ae78ba.png` | 2,006,584 | untracked — include |
| `Chat Recording/generated-images/051-exec-9cc1b5e1-f31e-43d5-b329-5662edd96414.png` | 1,718,058 | untracked — include |
| `Chat Recording/generated-images/052-exec-c715fd1d-3e47-4095-8993-2b3d4d893adf.png` | 1,654,909 | untracked — include |
| `Chat Recording/generated-images/059-exec-2ddf8184-46a6-4420-8cc1-86aa3733dbd3.png` | 2,093,708 | untracked — include |
| `Chat Recording/generated-images/061-exec-bbf415fc-2d18-457b-b0bd-40f6dc9751de.png` | 2,090,654 | untracked — include |
| `Chat Recording/generated-images/062-exec-9358cb5c-6589-40ce-b565-af0422302b3d.png` | 2,073,935 | untracked — include |
| `Chat Recording/generated-images/063-exec-47ec66aa-a9eb-4654-99a5-38b719fc362b.png` | 1,399,748 | untracked — include |
| `Chat Recording/generated-images/064-exec-6da89a8f-ba9d-4fb6-b7f1-82e31ca9cc58.png` | 2,058,404 | untracked — include |
| `Chat Recording/generated-images/065-exec-910ded4e-3cce-4533-a944-5bf272ce8282.png` | 1,449,084 | untracked — include |
| `Chat Recording/generated-images/071-exec-883053ef-28a7-4c9e-ba7e-e64d4c85cff1.png` | 1,462,100 | untracked — include |
| `DESIGN-AND-TEACHING-GUIDE.md` | 43,738 | tracked |
| `KNOWN-LIMITATIONS.md` | 4,741 | untracked — include |
| `QA.md` | 1,905 | tracked |
| `README.md` | 12,284 | tracked |
| `README.zh-Hant.md` | 10,220 | untracked — include |
| `USER-GUIDE.md` | 7,289 | untracked — include |
| `app/api/campus/[...path]/route.ts` | 998 | untracked — include |
| `app/chatgpt-auth.ts` | 2,550 | untracked — include |
| `app/globals.css` | 3,928 | untracked — include |
| `app/layout.tsx` | 500 | untracked — include |
| `app/page.tsx` | 114 | untracked — include |
| `build/connector-preview-plugin.mjs` | 7,211 | untracked — include |
| `build/connector-preview-worker.mjs` | 594 | untracked — include |
| `build/sites-vite-plugin.LICENSE` | 1,063 | untracked — include |
| `build/sites-vite-plugin.ts` | 7,185 | untracked — include |
| `build/sites-worker.ts` | 1,279 | untracked — include |
| `cloudflare-env.d.ts` | 99 | untracked — include |
| `components.json` | 420 | untracked — include |
| `components/connector-error.tsx` | 1,082 | untracked — include |
| `components/ui/accordion.tsx` | 2,048 | untracked — include |
| `components/ui/alert-dialog.tsx` | 5,439 | untracked — include |
| `components/ui/alert.tsx` | 1,614 | untracked — include |
| `components/ui/aspect-ratio.tsx` | 274 | untracked — include |
| `components/ui/attachment.tsx` | 6,002 | untracked — include |
| `components/ui/avatar.tsx` | 2,916 | untracked — include |
| `components/ui/badge.tsx` | 1,776 | untracked — include |
| `components/ui/breadcrumb.tsx` | 2,350 | untracked — include |
| `components/ui/bubble.tsx` | 4,699 | untracked — include |
| `components/ui/button-group.tsx` | 2,202 | untracked — include |
| `components/ui/button.tsx` | 2,392 | untracked — include |
| `components/ui/calendar.tsx` | 7,832 | untracked — include |
| `components/ui/card.tsx` | 1,987 | untracked — include |
| `components/ui/carousel.tsx` | 5,556 | untracked — include |
| `components/ui/chart.tsx` | 10,614 | untracked — include |
| `components/ui/checkbox.tsx` | 1,214 | untracked — include |
| `components/ui/collapsible.tsx` | 795 | untracked — include |
| `components/ui/combobox.tsx` | 9,158 | untracked — include |
| `components/ui/command.tsx` | 4,818 | untracked — include |
| `components/ui/context-menu.tsx` | 8,268 | untracked — include |
| `components/ui/dialog.tsx` | 4,303 | untracked — include |
| `components/ui/direction.tsx` | 506 | untracked — include |
| `components/ui/drawer.tsx` | 4,255 | untracked — include |
| `components/ui/dropdown-menu.tsx` | 8,418 | untracked — include |
| `components/ui/empty.tsx` | 2,396 | untracked — include |
| `components/ui/field.tsx` | 6,159 | untracked — include |
| `components/ui/form.tsx` | 3,757 | untracked — include |
| `components/ui/hover-card.tsx` | 1,526 | untracked — include |
| `components/ui/input-group.tsx` | 5,065 | untracked — include |
| `components/ui/input-otp.tsx` | 2,254 | untracked — include |
| `components/ui/input.tsx` | 962 | untracked — include |
| `components/ui/item.tsx` | 4,486 | untracked — include |
| `components/ui/kbd.tsx` | 862 | untracked — include |
| `components/ui/label.tsx` | 606 | untracked — include |
| `components/ui/marker.tsx` | 1,864 | untracked — include |
| `components/ui/menubar.tsx` | 8,389 | untracked — include |
| `components/ui/message-scroller.tsx` | 3,992 | untracked — include |
| `components/ui/message.tsx` | 2,232 | untracked — include |
| `components/ui/native-select.tsx` | 1,995 | untracked — include |
| `components/ui/navigation-menu.tsx` | 6,658 | untracked — include |
| `components/ui/pagination.tsx` | 2,717 | untracked — include |
| `components/ui/popover.tsx` | 2,357 | untracked — include |
| `components/ui/progress.tsx` | 755 | untracked — include |
| `components/ui/radio-group.tsx` | 1,460 | untracked — include |
| `components/ui/resizable.tsx` | 1,815 | untracked — include |
| `components/ui/scroll-area.tsx` | 1,639 | untracked — include |
| `components/ui/select.tsx` | 6,353 | untracked — include |
| `components/ui/separator.tsx` | 694 | untracked — include |
| `components/ui/sheet.tsx` | 4,188 | untracked — include |
| `components/ui/sidebar.tsx` | 21,526 | untracked — include |
| `components/ui/skeleton.tsx` | 276 | untracked — include |
| `components/ui/slider.tsx` | 1,991 | untracked — include |
| `components/ui/sonner.tsx` | 1,034 | untracked — include |
| `components/ui/spinner.tsx` | 331 | untracked — include |
| `components/ui/switch.tsx` | 1,408 | untracked — include |
| `components/ui/table.tsx` | 2,478 | untracked — include |
| `components/ui/tabs.tsx` | 3,782 | untracked — include |
| `components/ui/textarea.tsx` | 759 | untracked — include |
| `components/ui/toggle-group.tsx` | 2,308 | untracked — include |
| `components/ui/toggle.tsx` | 1,565 | untracked — include |
| `components/ui/tooltip.tsx` | 1,830 | untracked — include |
| `data/grade-bank.json` | 671,355 | untracked — include |
| `db/index.ts` | 423 | untracked — include |
| `db/schema.ts` | 4,405 | untracked — include |
| `resources/design/art-options/ART-DIRECTION-REVIEW.md` | 18,625 | untracked — include |
| `resources/design/art-options/version-1-crafted-pixel.png` | 2,011,930 | untracked — include |
| `resources/design/art-options/version-2-hd-pixel.png` | 2,136,066 | untracked — include |
| `resources/design/art-options/version-3-hand-drawn.png` | 2,183,508 | untracked — include |
| `resources/design/campus-life-review-v1/01-character-interaction.md` | 6,821 | untracked — include |
| `resources/design/campus-life-review-v1/01-character-interaction.png` | 2,137,519 | untracked — include |
| `resources/design/campus-life-review-v1/02-student-onboarding.md` | 6,956 | untracked — include |
| `resources/design/campus-life-review-v1/02-student-onboarding.png` | 2,439,519 | untracked — include |
| `resources/design/campus-life-review-v1/03-teacher-workspace.md` | 6,058 | untracked — include |
| `resources/design/campus-life-review-v1/03-teacher-workspace.png` | 1,883,529 | untracked — include |
| `resources/design/campus-life-review-v1/04-npc-roster.md` | 9,262 | untracked — include |
| `resources/design/campus-life-review-v1/04-npc-roster.png` | 2,468,977 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion-v2.md` | 3,288 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion-v2.png` | 1,764,176 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion-v3.md` | 3,585 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion-v3.png` | 1,778,902 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion.md` | 7,733 | untracked — include |
| `resources/design/campus-life-review-v1/05-walk-proportion.png` | 1,629,842 | untracked — include |
| `resources/design/campus-life-review-v1/06-pixel-dialogue-audio-proposal.md` | 4,965 | untracked — include |
| `resources/design/campus-life-review-v1/06-pixel-dialogue-audio-proposal.png` | 2,187,205 | untracked — include |
| `resources/design/campus-life-review-v1/REVIEW.md` | 8,865 | untracked — include |
| `resources/design/character-review/BOYS-REVIEW-v1.md` | 7,357 | untracked — include |
| `resources/design/character-review/BOYS-REVIEW-v1.png` | 1,592,334 | untracked — include |
| `resources/design/character-review/GIRLS-REVIEW-v1.md` | 4,966 | untracked — include |
| `resources/design/character-review/GIRLS-REVIEW-v1.png` | 1,827,508 | untracked — include |
| `resources/design/girl-wardrobe-layout.json` | 5,188 | untracked — include |
| `resources/design/production-backgrounds.md` | 11,878 | untracked — include |
| `resources/design/production-boy-wardrobe.md` | 7,101 | untracked — include |
| `resources/design/production-girl-wardrobe.md` | 8,371 | untracked — include |
| `resources/design/production-life/cases-students-v2.layout.json` | 4,275 | untracked — include |
| `resources/design/production-life/cases-students-v2.md` | 5,040 | untracked — include |
| `resources/design/production-life/cases-students.layout.json` | 4,272 | untracked — include |
| `resources/design/production-life/cases-students.md` | 11,340 | untracked — include |
| `resources/design/production-life/staff-academic-a-v2.layout.json` | 5,223 | untracked — include |
| `resources/design/production-life/staff-academic-a-v2.md` | 3,180 | untracked — include |
| `resources/design/production-life/staff-academic-a.layout.json` | 4,303 | untracked — include |
| `resources/design/production-life/staff-academic-a.md` | 4,629 | untracked — include |
| `resources/design/production-life/staff-academic-b-v2.layout.json` | 5,252 | untracked — include |
| `resources/design/production-life/staff-academic-b-v2.md` | 6,131 | untracked — include |
| `resources/design/production-life/staff-academic-b.layout.json` | 4,294 | untracked — include |
| `resources/design/production-life/staff-academic-b.md` | 6,853 | untracked — include |
| `resources/design/production-life/staff-community-v2.layout.json` | 5,238 | untracked — include |
| `resources/design/production-life/staff-community-v2.md` | 2,921 | untracked — include |
| `resources/design/production-life/staff-community.layout.json` | 4,290 | untracked — include |
| `resources/design/production-life/staff-community.md` | 3,817 | untracked — include |
| `resources/design/production-life/staff-leadership-v2.layout.json` | 5,251 | untracked — include |
| `resources/design/production-life/staff-leadership-v2.md` | 3,097 | untracked — include |
| `resources/design/production-life/staff-leadership.layout.json` | 4,305 | untracked — include |
| `resources/design/production-life/staff-leadership.md` | 4,092 | untracked — include |
| `resources/design/production-life/student-boy-blazer.layout.json` | 2,189 | untracked — include |
| `resources/design/production-life/student-boy-blazer.md` | 3,847 | untracked — include |
| `resources/design/production-life/student-boy-grey.layout.json` | 2,187 | untracked — include |
| `resources/design/production-life/student-boy-grey.md` | 4,348 | untracked — include |
| `resources/design/production-life/student-boy-striped.layout.json` | 2,190 | untracked — include |
| `resources/design/production-life/student-boy-striped.md` | 4,031 | untracked — include |
| `resources/design/production-life/student-boy-white.layout.json` | 2,043 | untracked — include |
| `resources/design/production-life/student-boy-white.md` | 9,941 | untracked — include |
| `resources/design/production-life/student-girl-gingham.layout.json` | 2,188 | untracked — include |
| `resources/design/production-life/student-girl-gingham.md` | 2,830 | untracked — include |
| `resources/design/production-life/student-girl-grey.layout.json` | 2,186 | untracked — include |
| `resources/design/production-life/student-girl-grey.md` | 2,820 | untracked — include |
| `resources/design/production-life/student-girl-striped.layout.json` | 2,189 | untracked — include |
| `resources/design/production-life/student-girl-striped.md` | 2,994 | untracked — include |
| `resources/design/production-life/student-girl-white.layout.json` | 2,231 | untracked — include |
| `resources/design/production-life/student-girl-white.md` | 9,614 | untracked — include |
| `resources/design/production-portraits.md` | 5,872 | untracked — include |
| `resources/design/qa-life/dialogue-desktop.jpg` | 134,334 | untracked — include |
| `resources/design/qa/case-mobile-zh.jpg` | 41,212 | untracked — include |
| `resources/design/qa/dialogue-mobile-en.jpg` | 85,454 | untracked — include |
| `resources/design/qa/ending-100.jpg` | 78,500 | untracked — include |
| `resources/design/qa/subject-mobile-en.jpg` | 48,189 | untracked — include |
| `resources/design/qa/title-desktop.jpg` | 263,065 | untracked — include |
| `resources/design/qa/title-mobile.jpg` | 40,167 | untracked — include |
| `drizzle.config.ts` | 148 | untracked — include |
| `drizzle/0000_yummy_fat_cobra.sql` | 4,642 | untracked — include |
| `drizzle/meta/0000_snapshot.json` | 20,563 | untracked — include |
| `drizzle/meta/_journal.json` | 205 | untracked — include |
| `eslint.config.mjs` | 846 | untracked — include |
| `examples/d1/app/api/notes/route.ts` | 1,700 | untracked — include |
| `examples/d1/db/schema.ts` | 370 | untracked — include |
| `hooks/use-mobile.ts` | 565 | untracked — include |
| `lib/campus-api.ts` | 29,811 | untracked — include |
| `lib/campus-cases.ts` | 20,022 | untracked — include |
| `lib/campus-security.ts` | 4,485 | untracked — include |
| `lib/campus-store.ts` | 13,932 | untracked — include |
| `lib/campus-types.ts` | 1,034 | untracked — include |
| `lib/connector-context.ts` | 612 | untracked — include |
| `lib/connector-contract.mts` | 5,362 | untracked — include |
| `lib/connector-errors.mts` | 2,717 | untracked — include |
| `lib/connector-preview.d.ts` | 433 | untracked — include |
| `lib/connectors.ts` | 416 | untracked — include |
| `lib/utils.ts` | 177 | untracked — include |
| `next-env.d.ts` | 284 | untracked — include |
| `next.config.ts` | 133 | untracked — include |
| `package-lock.json` | 504,152 | untracked — include |
| `package.json` | 2,102 | untracked — include |
| `postcss.config.mjs` | 94 | untracked — include |
| `public/campus/game/app.js` | 136,483 | untracked — include |
| `public/campus/images/backgrounds/README-campus-gate.md` | 2,976 | untracked — include |
| `public/campus/images/backgrounds/README-detective-preparation.md` | 2,918 | untracked — include |
| `public/campus/images/backgrounds/campus-gate.png` | 2,891,951 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-01.png` | 2,695,896 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-02.png` | 2,356,108 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-03.png` | 2,393,021 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-04.png` | 2,368,683 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-05.png` | 2,576,721 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-06.png` | 2,389,119 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-07.png` | 2,753,048 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-08.png` | 2,440,336 | untracked — include |
| `public/campus/images/backgrounds/campus-pair-09.png` | 2,893,161 | untracked — include |
| `public/campus/images/backgrounds/detective-preparation.png` | 2,367,006 | untracked — include |
| `public/campus/images/characters/README.md` | 6,214 | untracked — include |
| `public/campus/images/characters/atlas-layout.json` | 13,224 | untracked — include |
| `public/campus/images/characters/npcs-school-community.png` | 2,437,679 | untracked — include |
| `public/campus/images/characters/students-boy-hkcwcc.png` | 2,088,353 | untracked — include |
| `public/campus/images/characters/students-boy-queens-college.png` | 2,107,498 | untracked — include |
| `public/campus/images/characters/students-girl-hkcwcc.png` | 2,227,984 | untracked — include |
| `public/campus/images/characters/students-girl-st-joan.png` | 2,361,424 | untracked — include |
| `public/campus/images/characters/students-hkcwcc.png` | 2,178,960 | untracked — include |
| `public/campus/images/characters/students-pooi-to.png` | 2,116,647 | untracked — include |
| `public/campus/images/characters/students-queens-college.png` | 2,124,864 | untracked — include |
| `public/campus/images/characters/students-st-joan.png` | 2,281,217 | untracked — include |
| `public/campus/images/life/cases-students-v2.png` | 1,256,272 | untracked — include |
| `public/campus/images/life/cases-students.png` | 1,488,509 | untracked — include |
| `public/campus/images/life/staff-academic-a-v2.png` | 1,615,580 | untracked — include |
| `public/campus/images/life/staff-academic-a.png` | 1,648,506 | untracked — include |
| `public/campus/images/life/staff-academic-b-v2.png` | 1,376,037 | untracked — include |
| `public/campus/images/life/staff-academic-b.png` | 1,394,850 | untracked — include |
| `public/campus/images/life/staff-community-v2.png` | 1,501,422 | untracked — include |
| `public/campus/images/life/staff-community.png` | 1,704,654 | untracked — include |
| `public/campus/images/life/staff-leadership-v2.png` | 1,428,546 | untracked — include |
| `public/campus/images/life/staff-leadership.png` | 1,625,948 | untracked — include |
| `public/campus/images/life/staff-roster.png` | 2,468,977 | untracked — include |
| `public/campus/images/life/student-boy-blazer.png` | 1,904,634 | untracked — include |
| `public/campus/images/life/student-boy-grey.png` | 1,936,163 | untracked — include |
| `public/campus/images/life/student-boy-striped.png` | 2,080,199 | untracked — include |
| `public/campus/images/life/student-boy-white.png` | 1,935,064 | untracked — include |
| `public/campus/images/life/student-girl-gingham.png` | 2,291,816 | untracked — include |
| `public/campus/images/life/student-girl-grey.png` | 2,023,952 | untracked — include |
| `public/campus/images/life/student-girl-striped.png` | 2,167,209 | untracked — include |
| `public/campus/images/life/student-girl-white.png` | 1,980,773 | untracked — include |
| `public/campus/images/portraits/staff-a.png` | 2,071,900 | untracked — include |
| `public/campus/images/portraits/staff-b.png` | 1,896,947 | untracked — include |
| `public/campus/images/portraits/students.png` | 2,347,161 | untracked — include |
| `public/campus/game/campus-art.js` | 2,592 | untracked — include |
| `public/campus/game/campus-audio.js` | 19,158 | untracked — include |
| `public/campus/game/campus-cloud.js` | 20,197 | untracked — include |
| `public/campus/game/campus-life.css` | 16,393 | untracked — include |
| `public/campus/game/campus-polish.css` | 23,904 | untracked — include |
| `public/campus/game/characters.js` | 39,357 | untracked — include |
| `public/campus/game/content.js` | 51,410 | untracked — include |
| `public/campus/game/engine.js` | 119,478 | untracked — include |
| `public/campus/game/grade-content.js` | 530,598 | untracked — include |
| `public/campus/index.html` | 7,557 | untracked — include |
| `public/campus/images/portraits.png` | 1,843,353 | untracked — include |
| `public/campus/game/styles.css` | 30,564 | untracked — include |
| `public/campus/game/subjects.js` | 116,045 | untracked — include |
| `public/campus/game/teacher-ui.css` | 9,777 | untracked — include |
| `public/campus/game/teacher-ui.js` | 36,173 | untracked — include |
| `public/campus/images/title-campus.png` | 2,979,122 | untracked — include |
| `public/campus/game/ui-glass.css` | 9,419 | untracked — include |
| `public/campus/game/xlsx-export.js` | 9,037 | untracked — include |
| `public/favicon.svg` | 712 | untracked — include |
| `public/file.svg` | 392 | untracked — include |
| `public/globe.svg` | 1,036 | untracked — include |
| `public/window.svg` | 386 | untracked — include |
| `scripts/build-verified.sh` | 661 | untracked — include |
| `scripts/connector-preview/connector-preview-session.mjs` | 6,855 | untracked — include |
| `scripts/connector-preview/host-binding.mjs` | 7,793 | untracked — include |
| `scripts/connector-preview/protocol.mjs` | 1,781 | untracked — include |
| `scripts/content-authoring/build-grade-bank.py` | 4,478 | untracked — include |
| `scripts/content-authoring/grade-scenarios.json` | 34,102 | untracked — include |
| `scripts/execution-profile.mjs` | 624 | untracked — include |
| `scripts/install-ci.mjs` | 1,685 | untracked — include |
| `scripts/install-ci.sh` | 6,783 | untracked — include |
| `scripts/install-pnpm.sh` | 9,015 | untracked — include |
| `scripts/npm-install.mjs` | 7,025 | untracked — include |
| `scripts/pnpm-install.mjs` | 10,633 | untracked — include |
| `scripts/run-framework.mjs` | 993 | untracked — include |
| `scripts/sites-env.mjs` | 906 | untracked — include |
| `scripts/sites-env.sh` | 1,530 | untracked — include |
| `tests/backend-client.test.cjs` | 9,556 | untracked — include |
| `tests/backend.test.mjs` | 17,589 | untracked — include |
| `tests/campus-audio-diagnostic.html` | 5,251 | untracked — include |
| `tests/campus-audio.test.cjs` | 16,995 | untracked — include |
| `tests/campus-component-qa.md` | 4,746 | untracked — include |
| `tests/campus-engine-preview.html` | 2,236 | untracked — include |
| `tests/campus-engine.test.cjs` | 13,685 | untracked — include |
| `tests/campus-integration.test.cjs` | 12,408 | untracked — include |
| `tests/campus-portraits-preview.html` | 1,842 | untracked — include |
| `tests/campus-skin-preview.html` | 1,647 | untracked — include |
| `tests/campus-teacher-preview.html` | 3,338 | untracked — include |
| `tests/campus-teacher.test.cjs` | 7,521 | untracked — include |
| `tests/content.test.cjs` | 5,907 | tracked |
| `tests/grade-bank.test.cjs` | 1,569 | untracked — include |
| `tests/progression.test.cjs` | 19,489 | untracked — include |
| `tests/qa-artifacts/engine-chinese-desktop.png` | 167,007 | untracked — include |
| `tests/qa-artifacts/engine-talking-desktop.png` | 171,270 | untracked — include |
| `tests/qa-artifacts/npc-portraits-desktop.png` | 159,452 | untracked — include |
| `tests/qa-artifacts/skin-uniform0.png` | 129,917 | untracked — include |
| `tests/qa-artifacts/skin-uniform1.png` | 133,834 | untracked — include |
| `tests/qa-artifacts/skin-uniform2.png` | 136,108 | untracked — include |
| `tests/qa-artifacts/skin-uniform3.png` | 133,633 | untracked — include |
| `tests/qa-artifacts/teacher-desktop.png` | 83,848 | untracked — include |
| `tests/qa-artifacts/teacher-mobile.png` | 38,353 | untracked — include |
| `tests/subjects.test.cjs` | 4,162 | untracked — include |
| `tsconfig.json` | 800 | untracked — include |
| `vendor/shadcn-tailwind-4.13.0.LICENSE.md` | 1,063 | untracked — include |
| `vendor/shadcn-tailwind-4.13.0.css` | 16,041 | untracked — include |
| `vite.config.ts` | 3,115 | untracked — include |
