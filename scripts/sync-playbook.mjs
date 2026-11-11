// Copies the rule files of the playbook repository into src/content/playbook-rules.json.
// The repository is the single source of truth for the rules. The site only keeps a
// snapshot at one commit, so builds are reproducible and need no network access.
//
// Usage: node scripts/sync-playbook.mjs [commit]
//   commit: a commit SHA or branch of the playbook repository. Defaults to main.
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const playbook = JSON.parse(readFileSync('src/content/playbook.json', 'utf8'));
const repository = playbook.repository;
const ref = process.argv[2] || 'main';

async function get(url, type) {
  const response = await fetch(url, { headers: { 'User-Agent': 'dotnetdevs-io-sync', Accept: type === 'json' ? 'application/vnd.github+json' : 'text/plain' } });
  assert(response.ok, `${response.status} ${response.statusText} for ${url}`);
  return type === 'json' ? response.json() : response.text();
}

// Resolve the ref to a full commit SHA first, so every file comes from the same commit.
const commit = await get(`https://api.github.com/repos/${repository}/commits/${ref}`, 'json');
const sha = commit.sha;
assert.match(sha, /^[0-9a-f]{40}$/, 'Could not resolve the commit');

const paths = [...new Set(playbook.pages.flatMap(page => page.sources.map(source => source.path)))];
const files = {};
for (const path of paths) {
  const text = (await get(`https://raw.githubusercontent.com/${repository}/${sha}/${path}`, 'text')).replace(/\r\n/g, '\n').trimEnd();
  assert(text.startsWith('# '), `${path} does not start with a level 1 heading`);
  assert(!text.includes('—'), `${path} contains an em-dash`);
  files[path] = text;
}

const snapshot = {
  repository,
  commit: sha,
  committed: commit.commit.committer.date.slice(0, 10),
  files,
};
writeFileSync('src/content/playbook-rules.json', `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Synced ${paths.length} rule files from ${repository} at ${sha.slice(0, 7)} (${snapshot.committed}).`);
