# My AI Campus Life

**我的 AI 校園生活** — a pixel-art school adventure about **ethical and inclusive AI practices**, designed for Hong Kong secondary students and an HKU MEd MEDD8934 group assignment.

[繁體中文](README.zh-Hant.md) · [User guide](USER-GUIDE.md) · [Design and teaching guide](DESIGN-AND-TEACHING-GUIDE.md) · [Asset provenance](ASSET-PROVENANCE.md) · [Known limitations](KNOWN-LIMITATIONS.md) · [English conversation archive](Chat%20Recording/README.md)

## Play in your browser

> **Publication status — 11 October 2026:** The latest mobile-map layout and bundled Mandarin/English dialogue fixes are available in this repository and the local build. The public site still serves the earlier version: the hosting source service returned HTTP 403 during upload. The QR code will open that earlier public version until deployment succeeds.

**[Open the public game](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site)** — no download or GitHub account is needed for free exploration. Works through a web browser on Windows, Mac, tablets and phones; an internet connection is required for classroom services.

<a href="https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site"><img src="docs/assets/public-game-qr.png" width="220" alt="Scan to play My AI Campus Life" /></a>

[QR code: PNG](docs/assets/public-game-qr.png) · [Print-ready SVG](docs/assets/public-game-qr.svg) · [Distribution checks and limitations](docs/DISTRIBUTION-AUDIT.md)

1. Open the link or scan the QR code, then choose your language with **A**.
2. Choose **New Game → Student**, set up your character and enter the campus. Choose **Continue** to resume a save on the same browser.
3. For a school activity, use the class code supplied by your teacher. **New Game → Teacher** is restricted to an authorized teacher identity plus the server PIN; knowing `1234` alone does not grant access.

For everyday use, share this game link. The [private GitHub repository](https://github.com/Jackcrabb/my-ai-campus-life) and its source ZIP are for authorized collaborators; see the separate download and development sections below.

![Implemented pixel dialogue in My AI Campus Life](design/qa-life/dialogue-desktop.jpg)

*Actual browser capture of the implemented interface. [More verification screenshots](design/design-qa.md).*

Join the fictional **Ming Ching College** as an ordinary new student. Choose your year, class and appearance, explore five floors, meet classmates and staff, and practise making thoughtful decisions about AI. The learning loop is simple: **listen → examine evidence → decide → repair → reflect**.

This README describes the current repository version. The public entry and selected deployed files were checked on 10 October 2026 (Hong Kong time); the exact scope is recorded in the [distribution audit](docs/DISTRIBUTION-AUDIT.md).

**Source checkpoint — 11 October 2026:** desktop character setup has verified background/full-figure repairs. Purposeful NPC routines are implemented; seven released activity sheets cover 24 identity/outfit variants with 96 drawings. The remaining eight peer variants in uniforms 1–2 and faceless ambient art are not complete. The source now bundles 104 fixed-dialogue MP3s: 52 Mandarin and 52 English lines for 20 canonical characters. Traditional Chinese retains existing Cantonese read-aloud; academic questions are text-only and the teacher Speech Studio has been removed. MP3 integrity and provider voice metadata are verified; full listening review and public deployment are separate checks. See the [UX audit](docs/UX-AUDIT.md), [routine status](docs/NPC-BEHAVIOR-PLAN.md) and [speech service](docs/OPENROUTER-TTS-SERVICE.md).

## What is included

- **Five floors, 18 locations and 13 learning spaces**, covering languages, mathematics, science, humanities, arts, computing, PE and interdisciplinary activities.
- **234 starter questions**: six grades × 13 spaces × three questions. The default activity contains 39 questions for the selected grade. All 234 authored questions have been revised against Education Bureau/HKEAA references, with trilingual generation, structure/mathematics checks and cross-agent review. This is not a complete curriculum or official examination bank; see the [curriculum alignment](docs/CURRICULUM-ALIGNMENT.md).
- **Four AI scenarios** about accent assessment, writing privacy, cultural voice in translation, and inclusive participation, followed by transfer and reflection.
- **Three interface languages**: Traditional Chinese, Simplified Chinese and English. Language-learning examples may retain their target language.
- **48 appearance combinations** from two character categories, four outfits each, two hairstyles and three skin tones. These are combinations of eight source atlases, not 48 separately generated characters.
- **20 named NPCs** with independent identities, different natural heights/builds, detailed dialogue portraits and walking tied to actual distance. Student NPC clothing follows the selected uniform index while keeping their own gender, hairstyle and face. Names appear in dialogue only.
- **Classroom tools** for class codes, cross-device recovery, versioned questions, assignment history, teacher-uploaded PDF worksheets and teacher Excel results. Students open worksheets with **Print in the top-right HUD**, scoped to the current floor; there are no physical printer objects in the campus scenes.
- **A shared cream, deep-teal and gold pixel interface**, including door-mounted room signs, map, dialogue, questions and teacher panels.
- **Optional speech and music**, with independent volumes, replay and mute.

All in-game AI responses and consequences are authored teaching simulations; student answers do not trigger generative AI responses. Internal audio preparation can request external speech only through authorized maintenance; student gameplay does not generate new provider audio. For MEDD8934, pair the simulation with the actual-tool demonstration in the [teaching guide](DESIGN-AND-TEACHING-GUIDE.md); playing it does not satisfy a live AI demonstration requirement by itself.

## Start playing

**New Game opens a Student / Teacher role chooser.** Choose **Student** to begin a new character setup, or **Teacher** to sign in and open the standalone teacher workspace without creating a student avatar or entering the campus. Opening the chooser or the teacher workspace preserves the student save; choosing a new Student starts the replacement student flow. There is no report/download confirmation. **Continue returns directly to the saved campus** and is disabled until a game has started. Student learning-report downloads have been removed; teacher Excel export and worksheet PDF printing/download remain. The **Settings button on the start menu is currently disabled**; settings are available from the in-game toolbar after starting.

The top-right controls appear in this order: **A** for language, then the **music-note button** for sound settings.

| Action | Control |
|---|---|
| Move | WASD or all four arrow keys |
| Talk to a nearby person | E |
| Enter a room or use a nearby entrance | Space or Enter |
| Approach and interact | Click a person, door or staircase |
| View the floor plan | In-game Map, highest level at the top and ground level at the bottom |
| Close a panel | Escape or its close control |

The Cases and Subjects panels are read-only star/completion records. They do not open questions; visit the corresponding NPC or room to answer. The five-level map runs from 4F (fifth level) down to G (first level).

NPCs walk slightly slower than the player (150 versus 170 world units per second), with acceleration, braking and distance-driven footsteps. The current source assigns each named person a school duty, two stations and a partner: preparation, short travel, 20–60-second activity, recovery and paired exchanges replace frequent generic pacing. Player interaction interrupts and resumes the routine. Five ambient pupils appear in each corridor and three in each room; named teachers are not cloned as background extras. Actual duty poses are available only for released artwork; missing poses retain a neutral fallback. Faceless ambient artwork awaits visual approval. See the [routine status](docs/NPC-BEHAVIOR-PLAN.md) for exact coverage and remaining visual checks.

Appearance selection, dialogue, questions and the journal use in-page panels. The teacher workspace uses the same interface and is also accessible directly from the title screen without starting the game. Text remains available when audio is muted or unavailable. See the [user guide](USER-GUIDE.md) for student and teacher workflows.

## Free exploration and class mode

**Free exploration** needs no sign-in and saves progress in the same browser. Its existing scores are not imported into class assessment.

**Class mode** uses a teacher-provided class code. A student joins with their number and name, then receives a private recovery code. The class code, student number and recovery code allow them to continue on another device without a ChatGPT account. Names and numbers are self-reported; this is not school SSO or independent identity verification.

Class records are stored in Cloudflare D1. Student APIs return only the current student's records, and teachers manage only classes they own. The server grades answers, preserves question versions and handles repeated submissions without duplicate rewards. A progress conflict prompts a reload instead of silently overwriting another device. Sign out after using a shared computer and keep recovery codes private.

### Stars and assessment

Stars reward the **first correct completion** of an activity; retrying cannot farm extra stars. Class subject scores retain **first responses**, so a later correct retry can earn progress stars without rewriting the original assessment. Incomplete subjects remain unscored rather than being reported as zero.

The default maximum is **103 stars**: 78 subject stars, 20 scenario stars and 5 transfer stars. The default exit threshold is 100. A custom assignment uses the lower of 100 and its available star total.

These are formative records, not moral ratings or a secure examination system. The public practice bank includes learning answers. Review students' evidence, explanations and repairs alongside numerical results.

## Teacher workspace

From the title screen, choose **New Game → Teacher**. After signing in and unlocking, choose one of **13 learning subjects or AI Ethics and Inclusion**. The subject hub opens question management, worksheets or results; **Change subject** returns to the chooser. Grade, class and activity filters are retained while switching tools. The in-game **Settings → Teacher workspace** entry also remains available. Production access requires a trusted **ChatGPT identity**, membership in the server's teacher allowlist, and the configured **teacher PIN**. The requested shared PIN is **1234**, supplied through `TEACHER_PIN`; it is not sufficient without the authorized identity. Incorrect PIN attempts are rate-limited, and an unlock lasts 30 minutes.

Teachers can create individual classes or explicitly create all 24 classes (S1–S6, sections A–D), copy class codes, author and archive subject questions, and start new class activities. Each activity freezes its question revisions, so subsequent edits do not change previous questions, scores or denominators. The **AI Ethics and Inclusion** hub provides read-only access to the four core AI scenarios and transfer task, plus their results. These core entries cannot be edited, and PDF uploads are provided for the 13 learning subjects.

The Results tab filters by class, subject and activity. **Download subject Excel** exports the selected subject. **Download all subjects** explicitly exports all 14 result categories in separate sheets. Both use these fixed headers:

| 班別 | 學號 | 學生姓名 | 學科得分 |
|---|---|---|---|

Class lists and results exports are available only through authorized teacher access. In the **Worksheets** tab, the selected subject is carried through from the hub; teachers choose a grade and upload a Traditional Chinese PDF, an English PDF, or both, up to **5 MiB per file**. Students see only authorized worksheets for their class grade and the current floor’s subjects. A chosen version opens a preview; **Print PDF** then requests the viewer/browser print flow. **Open PDF** and **Download PDF** are retained as fallbacks. Opening Print or loading a preview does not print automatically. See the [worksheet guide](docs/WORKSHEETS.md) and [user guide](USER-GUIDE.md).

## Sound

**Speech is reserved for fixed NPC dialogue and the introduction. Academic questions, answer options and explanations are text-only.** Teachers can change that content without preparing or refreshing voice files. The teacher workspace has no Speech Studio; audio preparation and verification are maintained behind the scenes.

The required language mapping remains strict:

- Traditional Chinese uses the **existing browser/OS Cantonese read-aloud** (`zh-HK` or `yue`).
- Simplified Chinese uses bundled **Mandarin** recordings.
- English uses bundled **English** recordings, including numbers.

The user accepted the Mandarin and English OpenRouter audition samples as usable. The requested Cantonese sample was heard as Mandarin and rejected; OpenRouter `zh` generation is blocked. The existing Cantonese path is retained at the user's request and does not call OpenRouter or produce an MP3. It depends on a suitable device voice and the character-gender checks. Voice reuse is allowed; missing suitable voices must not be replaced with the wrong language or gender.

The current source includes **104 exact fixed-dialogue MP3s — 52 Mandarin and 52 English — covering all 20 canonical characters**, with four reused voices whose catalog gender and locale match their roles. These files were authored through the free Edge speech service at rate **−8%** and unchanged pitch. Gameplay loads bundled files and does not call a speech provider, use an API key or generate new audio. Every file passed full MP3 decoding and SHA-256 integrity checks; these technical checks are not a human listening review. The two earlier OpenRouter audition samples are not reused as unrelated dialogue.

Recordings play only when the canonical character, locale and complete text match the manifest. Fixed lines refer to the displayed class/progress information instead of including changing student details or star counts. A changed or missing line can use a suitable strict device voice; an empty voice inventory waits up to three seconds before reporting unavailable. No fallback may use the wrong language or known gender. This removes the missing male Mandarin device-voice dependency for the bundled lines, while Cantonese still depends on installed voices. Text remains visible throughout.

The separate internal OpenRouter audition service remains restricted to `fish-audio/s2.1-pro-free:free`, with site-wide daily caps of **6 requests, 3,000 characters and USD 0**, live zero-price checks, no paid fallback and server-only credentials. It is not the source of the bundled MP3s or a gameplay dependency. The free Edge authoring endpoint can change or become unavailable; existing local files need no further generation. See the [internal speech-service guide](docs/OPENROUTER-TTS-SERVICE.md) for reproducible authoring and review limits. The earlier [manual TTSFree audition record](design/voice-auditions-free/README.md) is historical production evidence.

Background *Greensleeves* is newly synthesized with an original Web Audio arrangement based on the [Mutopia public-domain score](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf). No DSE or commercial performance recording is used. Music and voice have separate volumes; playback requires a user gesture, music lowers during dialogue and pauses when the page is hidden. See [asset provenance](ASSET-PROVENANCE.md).

## Optional Windows / Mac shortcut

Open the public game first, then use your browser's website-install command:

- **Windows, Chrome:** open the three-dot menu, then **Cast, save, and share → Install page as app**. [Google instructions](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop).
- **Windows, Edge:** open **Settings and more → More tools → Apps → Install this site as an app**. [Microsoft instructions](https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge).
- **Mac, Safari (macOS Sonoma 14 or later):** choose **File → Add to Dock**. [Apple instructions](https://support.apple.com/en-us/104996).

This opens the hosted game in an app-like window; it does not create an offline copy or include the classroom server. No Windows `.exe` or Mac `.dmg` installer is provided. School-managed devices may restrict installation, and menu labels vary by browser language/version. Keep the ordinary browser link as a fallback.

Safari web apps have separate website data from Safari. Do not assume a free-exploration save will transfer; retain the original browser for that save, or use the class recovery process for server-backed progress. Installing these shortcuts and completing teacher sign-in within them have not yet been tested on target classroom devices.

## Download ZIP source — authorized collaborators

Sign in to GitHub with an account that has access to the **[private source repository](https://github.com/Jackcrabb/my-ai-campus-life)**, then choose **Code → Download ZIP**, or use [Download main as ZIP](https://github.com/Jackcrabb/my-ai-campus-life/archive/refs/heads/main.zip). Unauthenticated visitors receive a 404 because the repository is private. [GitHub archive instructions](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives).

The ZIP contains a source snapshot, not an installer or a double-click game. It does not include production database records, uploaded worksheet files, credentials or installed dependencies. Unzip it, open the extracted folder in a terminal and follow the developer setup below. Students and teachers who only want to use the game should use the public link instead.

## Local development

The application uses **Sites / Vinext, a vanilla JavaScript canvas frontend, Cloudflare D1 and R2 worksheet storage**. Use **Node.js 22.13 or newer** and npm.

```sh
npm run install:ci
npm run dev
```

Open the URL printed by the development command. The application entry redirects to `/campus/index.html`. A static file server cannot provide the class API, trusted teacher identity or D1 persistence.

### Environment and database

The D1 binding is **`DB`** and the R2 worksheet binding is **`BUCKET`**, configured in `.openai/hosting.json`. Production must configure `TEACHER_EMAILS` and `TEACHER_PIN` through the deployment environment; an empty owner allowlist grants no teacher access. Do not commit personal owner addresses, credentials, runtime class/recovery codes or student exports.

An ignored `.dev.vars` file can enable the existing `CAMPUS_LOCAL_TEACHER` development flag for local teacher testing. That exception requires non-production execution and a loopback host; it is not a production sign-in route. Use the real authorized identity flow to verify a production build.

The schema lives in `db/schema.ts`; generated migrations live in `drizzle/`. After changing the schema, run `npm run db:generate` and review the migration. For a **new, empty local database**, generate the Worker configuration and apply all five existing migrations once, in order:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yummy_fat_cobra.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_plain_omega_sentinel.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_lazy_catseye.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0003_peaceful_mister_fear.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0004_mighty_miek.sql
npm run start
```

For an existing database, apply only migrations that have not already been applied. The backend test suite uses isolated Miniflare D1/R2 instances and does not require resetting preview data.

### Project map

| Path | Responsibility |
|---|---|
| `app/page.tsx`, `app/api/campus/[...path]/route.ts` | Application entry, same-origin API and platform identity |
| `lib/campus-*.ts`, `db/schema.ts`, `drizzle/` | Authorization, records, versioned assignments, scoring and persistence |
| `data/grade-bank.json`, `scripts/content-authoring/` | Curated question data and authoring sources |
| `public/campus/app.js`, `campus-cloud.js` | Game state and cloud integration |
| `public/campus/engine.js`, `characters.js`, `campus-art.js` | Exploration, character identity, animation and scenes |
| `public/campus/campus-routines.js`, `assets/activities/` | School duties, stations, timing and released activity drawings |
| `public/campus/teacher-ui.js`, `xlsx-export.js` | Teacher subject hub, workspace and Excel export |
| `public/campus/worksheet-ui.js`, `lib/campus-worksheets.ts` | PDF upload, authorized access, preview and explicit printing |
| `public/campus/campus-audio.js` | Speech synthesis and music |
| `public/campus/fixed-voices.js`, `assets/voices/`, `data/fixed-dialogue-corpus.json` | Exact fixed Mandarin/English dialogue and verified MP3 manifest |
| `scripts/export-fixed-dialogue.mjs`, `scripts/generate-fixed-voices.py` | Internal fixed-dialogue export, authoring and offline integrity validation |
| `lib/campus-tts.ts` | Internal speech preparation, free-price checks, reservations and review |
| `public/campus/assets/`, `design/production-life/` | Runtime art and production provenance |

### Verification

```sh
node tests/backend.test.mjs
node tests/starter-update.test.mjs
node tests/worksheet-backend.test.mjs
node tests/campus-teacher.test.cjs
node tests/backend-client.test.cjs
node tests/campus-integration.test.cjs
node tests/grade-bank.test.cjs
node tests/curriculum-bank.test.cjs
node tests/progression.test.cjs
node tests/campus-audio.test.cjs
node tests/fixed-dialogue.test.mjs
python3 tests/fixed-voice-authoring.test.py
python3 scripts/generate-fixed-voices.py --validate-only
node tests/campus-engine.test.cjs
node tests/worksheet-ui.test.cjs
node tests/tts-backend.test.mjs
node scripts/validate-activity-atlases.mjs
node_modules/.bin/tsc --noEmit
npm run build
```

The current backend run completed **166 assertions/API checks against real isolated D1/R2**, using the authored production question bank. Separate starter-update checks verify that untouched starter questions can be upgraded without changing teacher edits, archives or frozen activities. Worksheet checks cover PDF limits, authorization, Unicode filenames and retryable storage failures. Teacher component checks cover the standalone subject hub, selected-subject worksheets, core-content restrictions and scoped/all-subject exports. The TTS backend passed **180 checks** against isolated D1/R2 with a mocked provider, including HTTP 410 rejection of academic speech. Integration mocks verify that NPC greetings speak and subsequent academic questions, options and feedback stay silent. Fixed-dialogue checks cover all 104 corpus entries; five authoring tests and the complete offline checksum/decode validation passed. Offline audio validation requires `ffmpeg` and `ffprobe`; the Edge package is needed only for authoring. These checks do not establish audible quality on classroom devices. See execution and QA records for other checks rather than assuming every command above has passed on every platform.

The descriptions above refer to the repository version; deployment verification is separate. Component checks cover NPC identities/crops, wardrobe mapping, responsive canvas resolution and movement. Worksheet preview/download screenshots cover desktop and mobile; native printing and physical output remain unverified. They do not establish that every recent source change is already on the public site.

Before a classroom session, verify the deployed URL on the intended devices, test voice availability, join a test class, resume on a second device and inspect an exported workbook. The proposed 20–30-minute core route and 45–75-minute full-campus route have not been timed with target students. Learner effectiveness and full accessibility compliance remain unevaluated.

## Deployment and documentation

### Sharing the game

Use the public link and QR at the top of this README. The QR stores the public root URL and resolves to `/campus/`. The PNG is 1960 × 1960 pixels at 300 dpi; use the SVG when resizing it for handouts or slides and preserve the clear border. See the [distribution audit](docs/DISTRIBUTION-AUDIT.md) for the dated public-access, QR and private-repository checks.

Public student access and private source access are separate. A successful page response does not establish that every classroom workflow, native print dialog or device voice works; complete the classroom checks above before a lesson.

### Deploying an updated release

Deploy the complete Sites project with its API, D1 database and R2 worksheet binding, retaining its existing project identity. Verify production environment settings, database migrations, teacher authorization and the public student flow. Publishing static assets alone does not provide cross-device class records.

- [User guide](USER-GUIDE.md): play, join, recover, manage classes and export.
- [Design and teaching guide](DESIGN-AND-TEACHING-GUIDE.md): learning objectives, rubric, lesson plan, live AI demonstration and evaluation plan.
- [Asset provenance](ASSET-PROVENANCE.md): original art, revision records and audio sources.
- [Traditional Chinese README](README.zh-Hant.md).

The course syllabus, private working notes, credentials and student records must remain outside public assets. This repository records the project; it does not imply endorsement by HKU, the referenced frameworks or any real school.
