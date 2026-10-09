# My AI Campus Life

**我的 AI 校園生活** — a pixel-art school adventure about **ethical and inclusive AI practices**, designed for Hong Kong secondary students and an HKU MEd MEDD8934 group assignment.

[繁體中文](README.zh-Hant.md) · [User guide](USER-GUIDE.md) · [Design and teaching guide](DESIGN-AND-TEACHING-GUIDE.md) · [Asset provenance](ASSET-PROVENANCE.md) · [Known limitations](KNOWN-LIMITATIONS.md) · [English conversation archive](Chat%20Recording/README.md)

![Implemented pixel dialogue in My AI Campus Life](design/qa-life/dialogue-desktop.jpg)

*Actual browser capture of the implemented interface. [More verification screenshots](design/design-qa.md).*

Join the fictional **Ming Ching College** as an ordinary new student. Choose your year, class and appearance, explore five floors, meet classmates and staff, and practise making thoughtful decisions about AI. The learning loop is simple: **listen → examine evidence → decide → repair → reflect**.

**Deployment status:** the repository contains the current application. A verified link for this release will be added after deployment; an earlier public prototype should not be assumed to include the current cloud or teacher features.

## What is included

- **Five floors, 18 locations and 13 learning spaces**, covering languages, mathematics, science, humanities, arts, computing, PE and interdisciplinary activities.
- **234 starter questions**: six grades × 13 spaces × three questions. The default activity contains 39 questions for the selected grade. This is a curated starter bank, not a complete curriculum or examination bank.
- **Four AI scenarios** about accent assessment, writing privacy, cultural voice in translation, and inclusive participation, followed by transfer and reflection.
- **Three interface languages**: Traditional Chinese, Simplified Chinese and English. Language-learning examples may retain their target language.
- **48 appearance combinations** from two character categories, four outfits each, two hairstyles and three skin tones. These are combinations of eight source atlases, not 48 separately generated characters.
- **Classroom tools** for class codes, cross-device recovery, versioned questions, assignment history, printable worksheets and Excel results.
- **Optional speech and music**, with independent volumes, replay and mute.

All in-game AI responses and consequences are authored teaching simulations. The game does not call a generative AI service. For MEDD8934, pair it with the actual-tool demonstration in the [teaching guide](DESIGN-AND-TEACHING-GUIDE.md); playing a simulation does not satisfy a live AI demonstration requirement by itself.

## Start playing

Choose **New Game**, enter your student details and customise your character. Continue resumes an existing game and is disabled until one has started. The **Settings button on the start menu is currently disabled**; settings are available from the in-game toolbar after starting.

The top-right controls appear in this order: **A** for language, then the **music-note button** for sound settings.

| Action | Control |
|---|---|
| Move | WASD or all four arrow keys |
| Talk to a nearby person | E |
| Enter a room or use a nearby entrance | Space or Enter |
| Approach and interact | Click a person, door or staircase |
| Navigate directly | In-game Map |
| Close a panel | Escape or its close control |

Appearance selection, dialogue, questions, the journal and teacher tools stay inside the game screen. Text remains available when audio is muted or unavailable. See the [user guide](USER-GUIDE.md) for student and teacher workflows.

## Free exploration and class mode

**Free exploration** needs no sign-in and saves progress in the same browser. Its existing scores are not imported into class assessment.

**Class mode** uses a teacher-provided class code. A student joins with their number and name, then receives a private recovery code. The class code, student number and recovery code allow them to continue on another device without a ChatGPT account. Names and numbers are self-reported; this is not school SSO or independent identity verification.

Class records are stored in Cloudflare D1. Student APIs return only the current student's records, and teachers manage only classes they own. The server grades answers, preserves question versions and handles repeated submissions without duplicate rewards. A progress conflict prompts a reload instead of silently overwriting another device. Sign out after using a shared computer and keep recovery codes private.

### Stars and assessment

Stars reward the **first correct completion** of an activity; retrying cannot farm extra stars. Class subject scores retain **first responses**, so a later correct retry can earn progress stars without rewriting the original assessment. Incomplete subjects remain unscored rather than being reported as zero.

The default maximum is **103 stars**: 78 subject stars, 20 scenario stars and 5 transfer stars. The default exit threshold is 100. A custom assignment uses the lower of 100 and its available star total.

These are formative records, not moral ratings or a secure examination system. The public practice bank includes learning answers. Review students' evidence, explanations and repairs alongside numerical results.

## Teacher workspace

Open the workspace through a classroom printer or the in-game teacher entry. Production access requires a trusted **ChatGPT identity**, membership in the server's teacher allowlist, and the configured **teacher PIN**. The requested shared PIN is **1234**, supplied through `TEACHER_PIN`; it is not sufficient without the authorized identity. Incorrect PIN attempts are rate-limited, and an unlock lasts 30 minutes.

Teachers can create individual classes or explicitly create all 24 classes (S1–S6, sections A–D), copy class codes, author and archive subject questions, and start new class activities. Each activity freezes its question revisions, so subsequent edits do not change previous questions, scores or denominators. The four core AI scenarios and transfer task are not editable subject-bank entries.

The Results tab filters by class, subject and activity. **Download Excel** creates a workbook with a separate sheet for each subject and these fixed headers:

| 班別 | 學號 | 學生姓名 | 學科得分 |
|---|---|---|---|

Class lists and exports are available only through authorized teacher access. The [user guide](USER-GUIDE.md) explains publishing questions, starting a new activity and printing worksheets.

## Sound

Dialogue is synthesized **at playback time by Web Speech**, rather than supplied as recorded actor files. The language mapping is strict:

- Traditional Chinese requires **Cantonese** (`zh-HK` or `yue`).
- Simplified Chinese requires **Mandarin** (`zh-CN` preferred; `zh-SG`/`zh-TW` alternatives).
- English requires **English** (`en-GB` preferred).

Cantonese and Mandarin never substitute for one another. If the required voice is missing, the interface reports it and retains text. Available voices depend on the browser and operating system; some voices use a provider's remote service. A distinct or gender-matched voice for every character is not guaranteed.

Background *Greensleeves* is newly synthesized with an original Web Audio arrangement based on the [Mutopia public-domain score](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf). No DSE or commercial performance recording is used. Audio needs a user gesture, music lowers during dialogue, and playback pauses when the page is hidden. See [asset provenance](ASSET-PROVENANCE.md) for the score, API references and production records.

## Local development

The application uses **Sites / Vinext, a vanilla JavaScript canvas frontend, and Cloudflare D1**. Use **Node.js 22.13 or newer** and npm.

```sh
npm run install:ci
npm run dev
```

Open the URL printed by the development command. The application entry redirects to `/campus/index.html`. A static file server cannot provide the class API, trusted teacher identity or D1 persistence.

### Environment and database

The D1 binding is **`DB`**, configured in `.openai/hosting.json`. Production must configure `TEACHER_EMAILS` and `TEACHER_PIN` through the deployment environment; an empty owner allowlist grants no teacher access. Do not commit personal owner addresses, credentials, runtime class/recovery codes or student exports.

An ignored `.dev.vars` file can enable the existing `CAMPUS_LOCAL_TEACHER` development flag for local teacher testing. That exception requires non-production execution and a loopback host; it is not a production sign-in route. Use the real authorized identity flow to verify a production build.

The schema lives in `db/schema.ts`; generated migrations live in `drizzle/`. After changing the schema, run `npm run db:generate` and review the migration. For a **new, empty local database**, generate the Worker configuration and apply the existing initial migration once:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yummy_fat_cobra.sql
npm run start
```

Do not reapply the initial SQL to a database that already contains these tables. The backend test suite uses an isolated Miniflare D1 instance and does not require resetting preview data.

### Project map

| Path | Responsibility |
|---|---|
| `app/page.tsx`, `app/api/campus/[...path]/route.ts` | Application entry, same-origin API and platform identity |
| `lib/campus-*.ts`, `db/schema.ts`, `drizzle/` | Authorization, records, versioned assignments, scoring and persistence |
| `data/grade-bank.json`, `scripts/content-authoring/` | Curated question data and authoring sources |
| `public/campus/app.js`, `campus-cloud.js` | Game state and cloud integration |
| `public/campus/engine.js`, `characters.js`, `campus-art.js` | Exploration, character identity, animation and scenes |
| `public/campus/teacher-ui.js`, `xlsx-export.js` | Teacher workspace and Excel export |
| `public/campus/campus-audio.js` | Speech synthesis and music |
| `public/campus/assets/`, `design/production-life/` | Runtime art and production provenance |

### Verification

```sh
node tests/backend.test.mjs
node tests/backend-client.test.cjs
node tests/campus-integration.test.cjs
node tests/grade-bank.test.cjs
node tests/progression.test.cjs
node tests/campus-audio.test.cjs
node_modules/.bin/tsc --noEmit
npm run build
```

The latest backend run completed **112 assertions/API checks against real isolated D1**, including ownership isolation, recovery, grading, retries, frozen revisions, history, conflicts, CSRF, expiry and PIN rate limits. Audio tests exercise mocked browser APIs; they do not verify audible quality or voice availability on a particular device. See execution and QA records for other checks rather than assuming every command above has passed on every platform.

Before a classroom session, verify the deployed URL on the intended devices, test voice availability, join a test class, resume on a second device and inspect an exported workbook. The proposed 20–30-minute core route and 45–75-minute full-campus route have not been timed with target students. Learner effectiveness and full accessibility compliance remain unevaluated.

## Deployment and documentation

Deploy the complete Sites project with its API and D1 binding, retaining its existing project identity. Verify production environment settings, database migrations, teacher authorization and the public student flow. Publishing static assets alone does not provide cross-device class records.

- [User guide](USER-GUIDE.md): play, join, recover, manage classes and export.
- [Design and teaching guide](DESIGN-AND-TEACHING-GUIDE.md): learning objectives, rubric, lesson plan, live AI demonstration and evaluation plan.
- [Asset provenance](ASSET-PROVENANCE.md): original art, revision records and audio sources.
- [Traditional Chinese README](README.zh-Hant.md).

The course syllabus, private working notes, credentials and student records must remain outside public assets. This repository records the project; it does not imply endorsement by HKU, the referenced frameworks or any real school.
