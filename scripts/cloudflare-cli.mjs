import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const local = path.join(root, ".cloudflare");
const configPath = path.join(local, "wrangler.json");
const templatePath = path.join(root, "deployment/cloudflare/wrangler.example.json");
const wrangler = path.join(root, "node_modules/wrangler/bin/wrangler.js");
const action = process.argv[2] || "doctor";
const env = { ...process.env, XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || path.join(local, "auth"), WRANGLER_SEND_METRICS: "false", WRANGLER_LOG_PATH: path.join(local, "logs"), CLOUDFLARE_CF_FETCH_ENABLED: "false" };
function fail(message) { throw new Error(message); }
function readConfig() {
  if (!fs.existsSync(configPath)) fail("No account configuration yet. Copy deployment/cloudflare/wrangler.example.json to .cloudflare/wrangler.json and fill in your account and D1 IDs. This file stays local.");
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}
function validate(config, database = true) {
  if (!/^[a-f0-9]{32}$/i.test(config.account_id || "")) fail("Set your real Cloudflare account_id in .cloudflare/wrangler.json.");
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(config.name || "")) fail("Use a valid lowercase Worker name.");
  if (config.r2_buckets?.length || config.services?.length || config.kv_namespaces?.length || config.durable_objects || config.workflows) fail("This Free deployment supports only Static Assets and D1. Remove other service bindings.");
  if (config.vars?.TEACHER_AUTH_MODE !== "access-code" || config.vars?.CAMPUS_TTS_ENABLED !== "0") fail("Keep access-code teacher login and disabled generation in the standalone configuration.");
  if (Object.keys(config.vars || {}).some(key => /KEY|TOKEN|SECRET|PASSWORD|PIN/.test(key))) fail("Never put secrets in Wrangler vars. Teacher code digests are provisioned separately.");
  const db = config.d1_databases?.find(item => item.binding === "DB");
  if (!db || config.d1_databases.length !== 1) fail("Configure exactly one D1 database using the DB binding.");
  if (database && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(db.database_id || "")) fail("Set the real D1 database_id before migrating or publishing.");
  if (database && /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(db.database_id)) fail("A dry-run database ID cannot be used for deployment.");
  return db;
}
function run(args, options = {}) {
  const result = spawnSync(process.execPath, [wrangler, ...args], { cwd: root, env, encoding: "utf8", stdio: options.capture ? "pipe" : "inherit", timeout: options.timeout ?? 120000 });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) fail(options.capture ? "Cloudflare account verification failed. Run the installed Wrangler login command, then retry." : `Wrangler ${args[0]} failed (${result.status}).`);
  return result.stdout;
}
function verifyAccount(config) {
  validate(config, false);
  const raw = run(["whoami", "--json"], { capture: true, timeout: 60000 });
  let identity;
  try { identity = JSON.parse(raw); } catch { fail("Cloudflare did not return a valid account verification response."); }
  if (!identity.loggedIn || !identity.accounts?.some(account => account.id === config.account_id)) fail("The selected account is not in the authenticated Cloudflare account list. No changes were made.");
  console.log(`Authenticated account matches ${config.account_id}. No ChatGPT identity is needed.`);
}
function requireFreeConfirmation() {
  if (!process.argv.includes("--confirm-free-plan")) fail("Check Cloudflare Dashboard → Workers & Pages shows Workers Free. Then rerun with --confirm-free-plan. This does not switch plans or activate billing.");
}
function inspectAssets() {
  const directory = path.join(root, "public");
  let count = 0, bytes = 0;
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isSymbolicLink()) fail(`Static assets cannot contain symbolic links: ${path.relative(root, file)}`);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) {
        const size = fs.statSync(file).size;
        if (size > 25 * 1024 * 1024) fail(`Static asset exceeds 25 MiB: ${path.relative(root, file)}`);
        count++; bytes += size;
      }
    }
  }
  visit(directory);
  if (count > 20000) fail("Static asset count exceeds the Workers Free limit.");
  console.log(`Static assets: ${count} files, ${(bytes / 1048576).toFixed(1)} MiB; each file fits the Free asset limit.`);
}

try {
  if (Number(process.versions.node.split(".")[0]) < 22) fail("Use Node.js 22.13 or newer.");
  if (!fs.existsSync(wrangler)) fail("Install the locked project dependencies before running Cloudflare tools.");
  fs.mkdirSync(local, { recursive: true });
  if (action === "login") {
    run(["login", "--scopes", "account:read", "user:read", "workers_scripts:write", "d1:write"], { timeout: 300000 });
  } else if (action === "doctor") {
    inspectAssets();
    if (fs.existsSync(configPath)) { validate(readConfig()); console.log("Local deployment configuration is valid. This offline check does not verify account login, plan or deployment."); }
    else console.log("Account configuration is not present yet. Local dry-run and tests work before signup; remote deployment is not ready.");
  } else if (action === "dry-run") {
    inspectAssets();
    const config = JSON.parse(fs.readFileSync(templatePath, "utf8"));
    delete config.account_id;
    config.d1_databases[0].database_id = "00000000-0000-0000-0000-000000000000";
    const dryConfig = path.join(local, "wrangler.dry-run.json");
    fs.writeFileSync(dryConfig, JSON.stringify(config, null, 2) + "\n");
    run(["deploy", "--dry-run", "--config", dryConfig, "--outdir", path.join(local, "dry-run")]);
    console.log("Local bundle ready. Nothing was uploaded and no Cloudflare resources were created.");
  } else if (action === "verify-account") {
    verifyAccount(readConfig());
    console.log("Account verified only. Confirm Workers Free in the dashboard before provisioning; this command does not inspect or change billing.");
  } else if (["create-database", "migrate", "import-teacher", "deploy"].includes(action)) {
    const config = readConfig(), db = validate(config, action !== "create-database");
    verifyAccount(config);
    requireFreeConfirmation();
    if (action === "create-database") run(["d1", "create", db.database_name, "--location", "apac", "--config", configPath]);
    if (action === "migrate") {
      run(["d1", "migrations", "apply", "DB", "--remote", "--config", configPath]);
      run(["d1", "execute", "DB", "--remote", "--file", path.join(root, "deployment/cloudflare/0001_worksheet_storage.sql"), "--config", configPath]);
    }
    if (action === "import-teacher") {
      const index = process.argv.indexOf("--file"), rawPath = index >= 0 ? process.argv[index + 1] : "";
      if (!rawPath || !/^[a-f0-9-]{36}\.sql$/i.test(path.basename(rawPath))) fail("Pass --file .teacher-access/GENERATED_ID.sql from provision-teacher-code.mjs.");
      const file = path.resolve(root, rawPath), privateDirectory = path.join(root, ".teacher-access");
      if (path.dirname(file) !== privateDirectory || !fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink()) fail("Only a generated SQL file in the private .teacher-access directory can be imported.");
      run(["d1", "execute", "DB", "--remote", "--file", file, "--config", configPath]);
    }
    if (action === "deploy") { inspectAssets(); run(["deploy", "--config", configPath], { timeout: 300000 }); }
  } else fail("Use login, doctor, dry-run, verify-account, create-database, migrate, import-teacher or deploy.");
} catch (error) { console.error(error.message); process.exitCode = 1; }
