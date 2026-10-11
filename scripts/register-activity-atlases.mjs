import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'design/production-activities');
const target = path.join(root, 'public/campus/characters.js');
const start = '  // BEGIN measured activity registrations';
const end = '  // END measured activity registrations';
const candidates = fs.readdirSync(directory).filter(name => name.endsWith('.layout.json')).sort()
  .map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
// Geometry can be measured before visual review is finished. Only explicitly
// released sheets may become runtime assets; a layout file alone is not approval.
const layouts = candidates.filter(layout => layout.releaseStatus === 'released');
const pending = candidates.filter(layout => layout.releaseStatus !== 'released');
for (const layout of layouts) {
  if (!fs.existsSync(path.join(root, 'public/campus', layout.src))) throw new Error(`Missing ${layout.src}`);
}
const block = `${start}\n${layouts.map(layout => `  registerActivityAtlas(${JSON.stringify(layout)});`).join('\n')}\n${end}`;
let source = fs.readFileSync(target, 'utf8');
if (source.includes(start)) {
  const from = source.indexOf(start), to = source.indexOf(end, from);
  if (to < 0) throw new Error('Unclosed generated activity block');
  source = source.slice(0, from) + block + source.slice(to + end.length);
} else source = source.replace(/\}\)\(\);\s*$/, `${block}\n})();\n`);
fs.writeFileSync(target, source);
console.log(`Registered ${layouts.length} measured activity sheets.`);
if (pending.length) console.log(`Skipped pending visual review: ${pending.map(layout => layout.id).join(', ')}.`);
