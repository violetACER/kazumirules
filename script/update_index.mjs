#!/usr/bin/env node
/**
 * 扫描仓库根目录下的规则 *.json，生成 index.json，并刷新 README 中的规则表格。
 *
 * 规则约定：
 *   - 一个站点一个文件，文件名（去掉 .json）= 规则里的 name
 *   - 必需字段：name / version / useNativePlayer(bool)
 *   - `"deprecated": true` 的规则不进索引
 *   - lastUpdate 取该文件的最后一次 git 提交时间（毫秒），没有 git 时回退文件 mtime
 *
 * 用法：node script/update_index.mjs
 * 退出码：0 正常；1 有规则校验失败（CI 会因此变红）
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_FILE = 'index.json';
const README_FILE = 'README.md';
const TABLE_START = '<!-- RULES:START -->';
const TABLE_END = '<!-- RULES:END -->';

/** 取文件的最后提交时间（毫秒）；非 git 环境或沙箱限制下回退 mtime。 */
function lastUpdateMs(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%at', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return Number(out) * 1000;
  } catch {
    /* 忽略：没有 git 或不允许 spawn */
  }
  return statSync(join(ROOT, file)).mtimeMs;
}

function formatDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const problems = [];
const entries = [];

const files = readdirSync(ROOT)
  .filter((f) => f.toLowerCase().endsWith('.json') && f !== INDEX_FILE)
  .sort();

for (const file of files) {
  let rule;
  try {
    rule = JSON.parse(readFileSync(join(ROOT, file), 'utf8'));
  } catch (err) {
    problems.push(`${file}: JSON 解析失败 - ${err.message}`);
    continue;
  }

  if (rule.deprecated === true) {
    console.log(`跳过已弃用规则: ${file}`);
    continue;
  }

  const name = typeof rule.name === 'string' ? rule.name.trim() : '';
  const version = rule.version == null ? '' : String(rule.version).trim();

  if (!name) {
    problems.push(`${file}: 缺少 name 字段`);
    continue;
  }
  if (!version) {
    problems.push(`${file}: 缺少 version 字段`);
    continue;
  }
  if (typeof rule.useNativePlayer !== 'boolean') {
    problems.push(`${file}: useNativePlayer 必须是布尔值`);
    continue;
  }
  if (name !== basename(file, '.json')) {
    problems.push(`${file}: 文件名必须与 name 一致（当前 name="${name}"）`);
    continue;
  }

  const antiCrawlerConfig = rule.antiCrawlerConfig;
  entries.push({
    name,
    version,
    useNativePlayer: rule.useNativePlayer,
    antiCrawlerEnabled: Boolean(antiCrawlerConfig && antiCrawlerConfig.enabled === true),
    author: typeof rule.author === 'string' ? rule.author : '',
    lastUpdate: Math.floor(lastUpdateMs(file)),
  });
}

entries.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

if (problems.length > 0) {
  console.error('\n规则校验失败：');
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`\n共 ${problems.length} 个问题，index.json 未更新。`);
  process.exit(1);
}

writeFileSync(join(ROOT, INDEX_FILE), JSON.stringify(entries, null, 2) + '\n');
console.log(`\n已写入 ${INDEX_FILE}，共 ${entries.length} 条规则。`);

// ---- 刷新 README 表格 ----
const readmePath = join(ROOT, README_FILE);
const readme = readFileSync(readmePath, 'utf8');
const start = readme.indexOf(TABLE_START);
const end = readme.indexOf(TABLE_END);

if (start === -1 || end === -1 || end < start) {
  console.error(`README.md 缺少表格标记 ${TABLE_START} / ${TABLE_END}，跳过表格更新。`);
  process.exit(1);
}

const rows = entries.map(
  (e) => `| ${e.name} | ${e.version} | ${formatDate(e.lastUpdate)} |`,
);
const table = [
  TABLE_START,
  '| Name | Version | Last Update |',
  '|------|---------|-------------|',
  ...rows,
  TABLE_END,
].join('\n');

const next = readme.slice(0, start) + table + readme.slice(end + TABLE_END.length);
if (next !== readme) {
  writeFileSync(readmePath, next);
  console.log(`已刷新 ${README_FILE} 的规则表格。`);
}
