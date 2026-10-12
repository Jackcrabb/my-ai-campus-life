# Independent Cloudflare hosting

This optional entrypoint serves the game and teacher workspace from an owner-controlled `workers.dev` hostname or custom domain. Students and teachers do not need ChatGPT accounts. Teachers still need a private application access code. The existing Sites deployment is retained separately.

**Published — 13 October 2026:** [open the independent game](https://my-ai-campus-life.hjhlgz.workers.dev/campus/). The owner’s Workers Free plan was verified, the new APAC D1 database was migrated, and the Worker/assets were deployed. Twelve live API checks and six cleanup operations passed; desktop teacher login and the mobile login layout were also checked. See the [release audit](../../docs/DISTRIBUTION-AUDIT.md#13-october-2026-independent-hosting-rollout) for evidence and remaining limits. These checks do not prove access from every Hong Kong network or migrate old browser saves.

## Free setup

Use **Workers Free + D1**. Static game images/audio use Workers Static Assets. Worksheet PDFs use bounded, chunked D1 storage (100 MiB total), so this configuration does **not** subscribe to R2. Audio playback uses the bundled files/device voices; online speech generation is disabled by the standalone Worker.

The Free plan has request, CPU and database limits. Exceeding these can interrupt classroom services; it is not a guarantee of unlimited capacity or uptime. The scripts never subscribe to paid Workers or activate R2. Before any remote mutation, they verify that the configured account belongs to the authenticated user and require confirmation that the dashboard still shows Workers Free. This confirmation is an operator check, not an automated billing audit.

1. Create a Cloudflare account and leave **Workers & Pages → Workers Free** selected. No custom domain purchase is needed for `workers.dev`.
2. Install the existing locked dependencies (`npm run install:ci`) with Node.js 22.13 or newer. Sign in using `npm run cloudflare:login`. All Cloudflare commands share the ignored `.cloudflare/auth/` credential directory (or an explicit `XDG_CONFIG_HOME`). OAuth requests only user/account read, Workers script write, D1 write and background access. Do not put API tokens in this repository or in the game.
3. Create the ignored `.cloudflare/` directory. Copy `deployment/cloudflare/wrangler.example.json` to `.cloudflare/wrangler.json`. Its paths intentionally resolve from `.cloudflare/`.
4. Enter the account ID from the Cloudflare dashboard in `account_id`. Keep the database ID placeholder until the next step. Run `npm run cloudflare:verify-account`.
5. After checking Workers Free, run `npm run cloudflare:create-database -- --confirm-free-plan`. Copy the returned D1 database ID into `.cloudflare/wrangler.json`.
6. **For a new empty database only**, run `npm run cloudflare:migrate -- --confirm-free-plan`. This installs the existing campus schema and standalone worksheet storage. If migrating existing classes, use the migration notes below before running any schema commands.
7. Run `node scripts/provision-teacher-code.mjs --label "Teacher name"` to create a private code file and a separate digest-only SQL file in ignored `.teacher-access/`. Apply that SQL to the selected database using `npm run cloudflare:import-teacher -- --confirm-free-plan --file .teacher-access/GENERATED_ID.sql`; the account is verified again before import. Share only the private code with its intended teacher. Reuse an existing `owner_id` with `--owner-id` only after confirming the correct historical owner. Do not commit either private file.
8. Run `npm run cloudflare:doctor`, `npm run cloudflare:dry-run` and `npm run cloudflare:test`. Then run `npm run cloudflare:deploy -- --confirm-free-plan`.
9. Open the returned HTTPS URL in a signed-out browser on a Hong Kong connection. Check Student exploration and Teacher access-code login, create a test question, upload/download a PDF, and verify a test student's score export. Only then replace the README link and QR code.

`cloudflare:doctor` is offline. `cloudflare:dry-run` builds locally with a dummy database ID and does not upload or provision anything. `cloudflare:verify-account` performs a read-only Cloudflare login/account check; it does not inspect or change subscription billing. Remote commands fail before mutation if the selected account does not match the authenticated account list.

The compatibility date stays pinned to `2026-05-15`, matching the locked local runtime. It does not represent the date of publication. Update it only alongside verified runtime/dependency upgrades.

## Existing records and cutover

Source code uploads do not contain the live database. Keep the current site available until the migration is verified. Export D1 schema/data and separately retrieve existing worksheet objects from the original host through authorized storage access. The Sites table viewer is useful for inspection but is not a complete backup mechanism.

Preserve classroom/student IDs, recovery-code digests, question revisions, assignments, attempts and progress. Preserve or explicitly map teacher `owner_id` values. Do not replace every old teacher with one new shared owner. A SQL-only export of old R2 worksheet metadata does not contain PDFs: importing those rows without copying PDF bytes into the new D1 storage makes worksheet links fail. Do not run fresh-schema migrations over an imported schema without reconciling the migration ledger.

Cookies and browser local storage belong to a hostname. Teachers log in again on the new host. Cloud-class students resume using their class code, student number and recovery code after their records move. Anonymous local-only saves do not automatically follow a domain change. Do not delete the original database or site as part of initial publication.

No automatic production data migration is provided by these scripts; choosing the correct source account and verifying a complete backup must come first.

## Files and boundaries

- `worker.ts`: independent routing; pins code-based teacher authorization, ignores Sites identity headers, disables generation and uses D1 worksheet storage.
- `wrangler.example.json`: safe template, with no real account IDs or secrets; copied config belongs in ignored `.cloudflare/`.
- `0001_worksheet_storage.sql`: standalone PDF storage schema, separate from the Sites R2 setup.
- `../../scripts/cloudflare-cli.mjs`: offline checks, account verification and explicit provision/migrate/deploy commands.
- `../../scripts/cloudflare-smoke.test.mjs`: isolated Miniflare tests of the real standalone bundle and same-origin API.

Official references: [Static Assets configuration](https://developers.cloudflare.com/workers/static-assets/binding/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 Free pricing and limits](https://developers.cloudflare.com/d1/platform/pricing/), [D1 export/import](https://developers.cloudflare.com/d1/best-practices/import-export-data/).
