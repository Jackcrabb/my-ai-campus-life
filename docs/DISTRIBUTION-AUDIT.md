# Distribution and access audit

This document keeps dated deployment and access checks for **My AI Campus Life**. Current independent-hosting work is recorded first; the 10–12 October Sites observations remain historical evidence. No section claims that every device, voice, classroom action or network has been tested.

**Directory note — 12 October 2026:** The maintained source now groups browser code under `public/campus/game/`, with separate image, audio and font folders. The URLs and hashes in the historical 10 October sections retain their original meaning; they are not evidence of later deployments.

## 13 October 2026 independent hosting rollout

**Published:** [independent public game](https://my-ai-campus-life.hjhlgz.workers.dev/campus/), deployed on 13 October 2026 (Hong Kong time). Cloudflare reported version `3d48a39b-baf3-4e68-9c46-d6f4c5b0fc2f`. The live API checks, browser login checks and new PNG QR validation below passed. The account owner explicitly authorized the official Wrangler scopes for account/user reads, Worker deployment, D1 administration and background access. Login succeeded, the selected account was verified, and its dashboard displayed **Workers Free, current plan, USD 0**. A new D1 database was created with an APAC location hint, the campus and worksheet migrations were applied, and the teacher credential digest was provisioned. Account identifiers, OAuth credentials, database identifiers and teacher codes are not published in this audit.

The standalone entrypoint uses the same game assets and campus API on an owner-controlled Cloudflare hostname. It replaces platform-account teacher authentication with a private per-teacher access code, a 30-minute session and owner-scoped records. The code is not a student class code; the historical shared `1234` PIN cannot authenticate this deployment. The original Sites deployment remains separate and available. Source uploads and account setup alone do not prove a working public release.

Worksheets use bounded D1 chunk storage: **5 MiB per PDF, 100 MiB shared across teachers**. Static images, fonts and bundled MP3 files use Workers Static Assets. No R2 subscription, paid Workers upgrade, domain purchase or paid speech generation is part of this setup. The standalone Worker disables online TTS generation; existing fixed Mandarin/English audio and device Cantonese behavior are preserved.

Before cutover, the authorized read-only inspection of the retained Sites database found **0 classes, 0 students and 0 worksheet records**. All **239 question records** had starter source IDs and revision 1; no custom question revisions were identified. These observations justify starting the new classroom service with its seed bank; they do not represent a complete backup of every historical table. The old site/database are retained, and no real student records need to be copied based on this inspection.

Browser local storage and cookies are hostname-specific. Anonymous saves at the old Sites address do not automatically transfer to the independent address, and teachers must sign in again. Class-code recovery at a new address requires the corresponding server records there. A source ZIP never contains those live records.

The [machine-readable live verification](releases/2026-10-13-independent-verification.json) records **12 successful checks and six successful cleanup operations**:

- Anonymous entry/assets and the independent session contract worked; protected routes rejected anonymous access and the public `1234` value.
- A new QA teacher login seeded all **239 questions**. Teacher-authored 1-star and 10-star questions were accepted; an 11-star value was rejected.
- A disposable class/activity and synthetic student completed the assigned questions. Retries did not award duplicate stars. The teacher report returned **11 earned stars, 17 available stars and score 2** for that test activity.
- A **5,242,880-byte PDF** uploaded and downloaded with a matching SHA-256. Anonymous and unrelated-teacher access were denied, and the primary teacher could not read the QA teacher’s class/results.

The QA PDF was deleted, both QA questions were archived and all three test sessions were logged out. The dedicated QA credential was then revoked; the remote update affected one credential row. Isolated synthetic class/student/activity history remains under a dedicated QA owner because the current API has no deletion endpoint for those immutable records. It is separate from the primary teacher’s workspace; no real student data was used.

Browser checks reached the **14-entry subject chooser after a successful desktop teacher login**. The login panel was inspected at **390 × 844** without horizontal overflow. The user-requested removal of the “No ChatGPT required” interface copy was verified. Screenshots: [desktop login](../resources/design/qa-independent/teacher-login-desktop.jpg), [mobile login](../resources/design/qa-independent/teacher-login-mobile.jpg), [teacher workspace](../resources/design/qa-independent/teacher-workspace-desktop.jpg). The [desktop student setup](../resources/design/qa-independent/student-setup-desktop.jpg) also showed the restored school background and complete character. This does not claim a full mobile classroom workflow or physical listening/printing test.

Both READMEs now link to the independent site. A new [PNG QR](assets/public-game-qr.png) and [SVG QR](assets/public-game-qr.svg) were generated for `https://my-ai-campus-life.hjhlgz.workers.dev/campus/`; ZXing decoded the PNG to exactly that address. The new PNG is **820 × 820 pixels**. This release did not independently decode a rasterized copy of the SVG.

Direct use on every Hong Kong ISP or school network and physical printing remain unverified. Free request/CPU/database limits can interrupt classroom services when exhausted; independent hosting is not an uptime or universal network-access guarantee. The GitHub source update is a separate step from this completed website deployment.

The [deployment guide](../deployment/cloudflare/README.md) contains the reproducible setup and separation from the retained Sites project. See [Workers Free limits](https://developers.cloudflare.com/workers/platform/limits/) and [D1 pricing and limits](https://developers.cloudflare.com/d1/platform/pricing/) for provider limits.

## 12 October 2026 release verification

Sites public **version 4** was successfully deployed from source `6aa6badaa59ed1481743c3bcafafcba76abc79c5` to the retained `lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site` game URL. The earlier source-upload failure is resolved. The source transport succeeded with HTTP/1.1 and a buffered upload after an HTTP/2 protocol error. No GitHub Pages site was introduced; Sites serves the full game and classroom API while the GitHub source repository remains private.

Fresh anonymous HTTP requests, without account credentials or stored cookies, verified:

- `/campus/` returns HTTP 200 with the new `game/` paths.
- All **32 entry-linked scripts/styles/icons and two representative revised Mandarin/English clips** match the current source byte for byte.
- Anonymous bootstrap returns HTTP 200 with `session: null`.
- Teacher session remains `allowed: false`, `unlocked: false`; teacher questions return HTTP 403.
- The README PNG QR code was decoded again and points exactly to `https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site`.

The [machine-readable verification](releases/2026-10-12-verification.json) records resource hashes and the checked authorization boundaries. The release also passed the production build, TypeScript, focused source lint, question/reward/history tests, Excel/print component checks, audio matching and local resource-path checks. This update adds more-than-three teacher questions, integer rewards of 1–10 stars, six-column Excel/native-print reports and grouped source/assets.

The local browser tool rejected the requested localhost tab under its URL policy, so this release does **not** claim a new visual browser review or a physical printer test. No real student records were submitted or downloaded during release verification. The earlier dated observations below are retained as history.

## Recommended way to share

**Share the [independent public game](https://my-ai-campus-life.hjhlgz.workers.dev) using the current link and QR in the [README](../README.md).** Students use free exploration directly; teachers enter their private application code. Optional browser installation gives regular players an app-like window. Keep the GitHub repository private, as requested; it is a source archive for authorized collaborators.

| Option | Practical use | Current limitation |
|---|---|---|
| Public browser link / QR | Recommended for students, teachers and sharing on phones, tablets, Windows and Mac | Internet is needed for initial loading and classroom services; device/browser QA remains necessary |
| Browser-installed website | Optional Dock, Start or desktop entry to the same hosted game | Still uses the online API; no offline guarantee; installation and sign-in in installed windows remain untested |
| GitHub source ZIP | Authorized collaborators who want to inspect, modify or run the project | Private-repository access plus developer setup required; not a playable installer |
| Native Windows / Mac package | A possible separate future product decision | No `.exe`, `.msi`, `.dmg` or packaged `.app` release exists; none was added in this audit |

A native wrapper would not remove the existing authentication, database or storage requirements. Maintaining a single public web release is the most practical current choice. Offline class submission, packaged native delivery and app-store distribution would require separate implementation and verification.

## 10 October 2026 public checks

All HTTP checks below used fresh requests without account credentials. No student records were requested, no production classes were created, and no teacher PIN was submitted.

| Resource | Observed result |
|---|---|
| [Public root](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site) | Final URL `/campus/`, HTTP 200, `text/html`, title `我的AI校園生活` |
| [Direct campus entry](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site/campus/) | Reached by the public-root check |
| `/api/campus/teacher/session` | HTTP 200; `signedIn:false`, `allowed:false`, `unlocked:false`, `localDevelopment:false`; sign-in URL returned |
| `/api/campus/teacher/classes` | HTTP 403, `TEACHER_FORBIDDEN`; anonymous access correctly rejected |
| `/campus/app.js` | HTTP 200; byte-for-byte equal to the local file at the time of this check |
| `/campus/campus-audio.js` | HTTP 200; byte-for-byte equal to the local file at the time of this check |
| `/campus/worksheet-ui.js` | HTTP 200; byte-for-byte equal to the local file at the time of this check |

Selected deployed SHA-256 values, recorded to distinguish the checked files from later changes:

```text
app.js           23ab169544f3efb89339facb82779e6a107e966935a4f7ef86fccc68014e2762
campus-audio.js   0a1f84b6cf75774bc05dc4fe2d07e4ad84cce8da784c6df46deffadffcb251bc
worksheet-ui.js  1eec44a9d614a84056cc324e152f0223dbf304d249dff1aaee1cf3246828c51d
```

The retained Sites production teacher route requires a trusted authenticated identity included in `TEACHER_EMAILS`, then the configured `TEACHER_PIN` and an unexpired unlock. The requested PIN is `1234`; knowing it does not grant access to an unapproved account. The loopback development exception is disabled in production. The anonymous checks confirm denial, not a successful authorized teacher sign-in or the current secret value.

## 10 October 2026 QR and documentation checks

The then-current PNG and a raster rendering of the SVG's module geometry were independently decoded with ZXing-C++ during the 10 October audit. This is a historical QR result; current sharing files are maintained for the independent release. Both returned exactly:

```text
https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site
```

The PNG is **1960 × 1960**, approximately **300 dpi**. The SVG retains scalable modules and a clear border. No QR or artwork file was changed. The decoder was installed only in a temporary audit directory; it adds no project or runtime dependency.

Local file links in root Markdown documents and `docs/**/*.md` were checked for existence, including linked QR files and images: **125 links across 18 Markdown files, with none missing** after these README changes. The committed GitHub version was checked separately against its complete 505-entry tree: **115 local file links, with none missing**. The new audit document and revised READMEs require the next source update before appearing on GitHub. These checks do not establish that every historical third-party research link remains available, nor do they test every Markdown heading anchor. Current installation guidance below was checked against official vendor pages.

## GitHub access and ZIP meaning

The authenticated GitHub metadata identifies [Jackcrabb/my-ai-campus-life](https://github.com/Jackcrabb/my-ai-campus-life) as **private**, with default branch `main`. At the time checked, `main` was commit `f911058bba3a7979a08443fb77d62aa4cc330e80`; the repository had **no GitHub Releases**. Repository visibility was not changed.

Anonymous requests to the repository page and [main ZIP endpoint](https://github.com/Jackcrabb/my-ai-campus-life/archive/refs/heads/main.zip) both returned **404**, as expected for private access. A student should receive the public game link, not the repository URL. Authorized collaborators can sign in and choose **Code → Download ZIP**. GitHub describes these downloads as source snapshots, without complete repository history. [GitHub source-archive documentation](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives).

The ZIP is not a Windows/Mac installer. It provides source and committed assets, not production D1 records, R2 worksheet contents, credentials or installed dependencies. An authenticated full ZIP download and unpack/run test were not performed in this audit. See [English setup](../README.md#local-development) or [繁體中文開發步驟](../README.zh-Hant.md#開發與資料庫).

## Optional browser-installed windows

These are official browser features; this audit reviewed the instructions without installing applications or changing the user's machine.

- **Windows / Chrome:** visit the public game, open the menu's **Cast, save, and share** area and choose **Install page as app**. Some sites also show an address-bar install control. [Google Chrome Help](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop).
- **Windows / Edge:** use **Settings and more → More tools → Apps → Install this site as an app**; installed sites are managed from `edge://apps`. [Microsoft Support](https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge).
- **Mac / Safari:** on **macOS Sonoma 14 or later**, open the game and choose **File → Add to Dock**. Safari web apps use separate website data and cookies; do not assume an existing free-exploration save will migrate. [Apple Support](https://support.apple.com/en-us/104996).

School management policies and browser versions can change menu availability. For Safari's separate storage, retain the original browser for existing local progress or use the class recovery process to restore server-backed records. Teacher sign-in redirects and PDF workflows must be tested in any installed window before classroom rollout.

## Retained Sites architecture and earlier remaining verification

The application is a **Sites / Vinext web project with same-origin APIs, Cloudflare D1 and R2**. The source tree contains no registered service worker or linked web-app manifest, and no native installer release was found. Browser menu installation is therefore the current optional convenience, not a claim of a completed offline PWA.

A source ZIP, `file://` opening, basic static hosting or a desktop wrapper alone cannot supply the classroom API, trusted teacher identity, persistent class scores or authorized worksheet downloads. Free exploration stores progress locally, but that storage does not itself cache the full game for offline use. The hosted deployment, its migrations and D1/R2 bindings must remain available for classroom services.

Outstanding distribution-specific checks are Windows Chrome/Edge installation, macOS Safari Add to Dock, authorized teacher sign-in inside those windows, PDF viewer/print behavior there, and real-device speech availability. Existing browser component tests and read-only HTTP checks do not replace those checks. No paid API call, installer, dependency change, GitHub visibility change, push or deployment was made by this audit.
