// Checks the bundle: every skill and agent has valid frontmatter, skill names match their folders, local links
// resolve, and the plugin, marketplace, MCP and Gemini manifests are valid and agree on the version.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return fail(`${file}: no frontmatter`), {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { ...out, body: text.slice(m[0].length) };
}

function checkLinks(file, body) {
  for (const [, href] of body.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    if (!existsSync(resolve(dirname(file), href.split('#')[0]))) fail(`${file}: broken link ${href}`);
  }
}

const skillsDir = join(root, 'skills');
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory());
for (const dir of skills) {
  const file = join(skillsDir, dir, 'SKILL.md');
  if (!existsSync(file)) {
    fail(`skills/${dir}: no SKILL.md`);
    continue;
  }
  const fm = frontmatter(file);
  if (fm.name !== dir) fail(`${file}: name "${fm.name}" should be "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? '') || fm.name.length > 64) fail(`${file}: name must be lowercase-hyphenated, at most 64 characters`);
  if (!fm.description || fm.description.length > 1024) fail(`${file}: description is required, at most 1024 characters`);
  if (fm.body.split('\n').length > 500) fail(`${file}: keep SKILL.md under 500 lines; move detail to references/`);
  checkLinks(file, fm.body);
  const refs = join(skillsDir, dir, 'references');
  if (existsSync(refs)) for (const r of readdirSync(refs)) checkLinks(join(refs, r), readFileSync(join(refs, r), 'utf8'));
}

for (const a of readdirSync(join(root, 'agents'))) {
  const fm = frontmatter(join(root, 'agents', a));
  if (!fm.name || !fm.description) fail(`agents/${a}: name and description are required`);
  if (`${fm.name}.md` !== a) fail(`agents/${a}: name "${fm.name}" should match the file name`);
}

const json = (p) => {
  try {
    return JSON.parse(readFileSync(join(root, p), 'utf8'));
  } catch (e) {
    fail(`${p}: ${e.message}`);
    return {};
  }
};
const plugin = json('.claude-plugin/plugin.json');
const market = json('.claude-plugin/marketplace.json');
const mcp = json('.mcp.json');
const gemini = json('gemini-extension.json');
if (plugin.name !== 'reelspan') fail('plugin.json: name should be reelspan');
if (!/^\d+\.\d+\.\d+$/.test(plugin.version ?? '')) fail('plugin.json: version must be semver');
if (!market.plugins?.some((p) => p.name === plugin.name && p.source === './')) fail('marketplace.json: must list the reelspan plugin with source ./');
if (market.plugins?.find((p) => p.name === plugin.name)?.version !== plugin.version) fail('marketplace.json: version must match plugin.json');
if (gemini.version !== plugin.version) fail('gemini-extension.json: version must match plugin.json');
if (mcp.mcpServers?.reelspan?.url !== 'https://api.reelspan.com/mcp') fail('.mcp.json: reelspan must point at https://api.reelspan.com/mcp');

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${skills.length} skills, ${readdirSync(join(root, 'agents')).length} agents, manifests valid (v${plugin.version})`);
