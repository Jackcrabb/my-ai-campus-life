# Distribution and access audit

Checked on **10 October 2026 (Hong Kong time)**. This is a dated audit of the public entry, selected deployed files, repository access and distribution architecture. It is not a claim that every device, voice, classroom action or later release has been tested.

**Directory note — 12 October 2026:** The maintained source now groups browser code under `public/campus/game/`, with separate image, audio and font folders. The deployed URLs and hashes below remain the original 10 October observations; they are not evidence of a later deployment.

## 12 October 2026 release verification

Public **version 4** was successfully deployed from source `6aa6badaa59ed1481743c3bcafafcba76abc79c5` to the same game URL. The earlier source-upload failure is resolved. The source transport succeeded with HTTP/1.1 and a buffered upload after an HTTP/2 protocol error. No GitHub Pages site was introduced; Sites serves the full game and classroom API while the GitHub source repository remains private.

Fresh anonymous HTTP requests, without account credentials or stored cookies, verified:

- `/campus/` returns HTTP 200 with the new `game/` paths.
- All **32 entry-linked scripts/styles/icons and two representative revised Mandarin/English clips** match the current source byte for byte.
- Anonymous bootstrap returns HTTP 200 with `session: null`.
- Teacher session remains `allowed: false`, `unlocked: false`; teacher questions return HTTP 403.
- The README PNG QR code was decoded again and points exactly to `https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site`.

The [machine-readable verification](releases/2026-10-12-verification.json) records resource hashes and the checked authorization boundaries. The release also passed the production build, TypeScript, focused source lint, question/reward/history tests, Excel/print component checks, audio matching and local resource-path checks. This update adds more-than-three teacher questions, integer rewards of 1–10 stars, six-column Excel/native-print reports and grouped source/assets.

The local browser tool rejected the requested localhost tab under its URL policy, so this release does **not** claim a new visual browser review or a physical printer test. No real student records were submitted or downloaded during release verification. The earlier dated observations below are retained as history.

## Recommended way to share

**Share the [public game](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site) or its [QR PNG](assets/public-game-qr.png) / [QR SVG](assets/public-game-qr.svg).** Students can use free exploration without a GitHub or ChatGPT account. Optional browser installation gives regular players an app-like window. Keep the GitHub repository private, as requested; it is a source archive for authorized collaborators.

| Option | Practical use | Current limitation |
|---|---|---|
| Public browser link / QR | Recommended for students, teachers and sharing on phones, tablets, Windows and Mac | Internet is needed for initial loading and classroom services; device/browser QA remains necessary |
| Browser-installed website | Optional Dock, Start or desktop entry to the same hosted game | Still uses the online API; no offline guarantee; installation and sign-in in installed windows remain untested |
| GitHub source ZIP | Authorized collaborators who want to inspect, modify or run the project | Private-repository access plus developer setup required; not a playable installer |
| Native Windows / Mac package | A possible separate future product decision | No `.exe`, `.msi`, `.dmg` or packaged `.app` release exists; none was added in this audit |

A native wrapper would not remove the existing authentication, database or storage requirements. Maintaining a single public web release is the most practical current choice. Offline class submission, packaged native delivery and app-store distribution would require separate implementation and verification.

## Public checks performed

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

The production teacher route requires a trusted authenticated identity included in `TEACHER_EMAILS`, then the configured `TEACHER_PIN` and an unexpired unlock. The requested PIN is `1234`; knowing it does not grant access to an unapproved account. The loopback development exception is disabled in production. The anonymous checks confirm denial, not a successful authorized teacher sign-in or the current secret value.

## QR and documentation

The saved PNG and a raster rendering of the SVG's actual module geometry were independently decoded with ZXing-C++ during this audit. Both returned exactly:

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

## Architecture and remaining verification

The application is a **Sites / Vinext web project with same-origin APIs, Cloudflare D1 and R2**. The source tree contains no registered service worker or linked web-app manifest, and no native installer release was found. Browser menu installation is therefore the current optional convenience, not a claim of a completed offline PWA.

A source ZIP, `file://` opening, basic static hosting or a desktop wrapper alone cannot supply the classroom API, trusted teacher identity, persistent class scores or authorized worksheet downloads. Free exploration stores progress locally, but that storage does not itself cache the full game for offline use. The hosted deployment, its migrations and D1/R2 bindings must remain available for classroom services.

Outstanding distribution-specific checks are Windows Chrome/Edge installation, macOS Safari Add to Dock, authorized teacher sign-in inside those windows, PDF viewer/print behavior there, and real-device speech availability. Existing browser component tests and read-only HTTP checks do not replace those checks. No paid API call, installer, dependency change, GitHub visibility change, push or deployment was made by this audit.
