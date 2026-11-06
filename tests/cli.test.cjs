const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const archive = path.join(__dirname, '..', 'FMLT.zip');
const readEntry = name => execFileSync('unzip', ['-p', archive, name], { encoding: 'utf8' });
const manifest = JSON.parse(readEntry('package.json'));
let prompts;
const chalk = Object.assign(() => '', { green: value => value });

// Capture prompts without authenticating or performing any Instagram actions.
new vm.Script(readEntry('flmauto.js')).runInNewContext({
  console: { log() {} },
  require(name) {
    if (name === 'inquirer') return { prompt(questions) { prompts = questions; return { then() {} }; } };
    if (name === 'chalk') return chalk;
    if (name === 'instagram-private-api') return { V1: {} };
    return {};
  },
});

const delayPrompt = prompts.find(prompt => prompt.name === 'sleep');

test('npm start launches the script shipped in the archive', () => {
  assert.equal(manifest.scripts?.start, 'node flmauto.js');
  assert.equal(manifest.main, 'flmauto.js');
  assert.ok(readEntry(manifest.main));
});

test('every imported runtime package is declared directly', () => {
  const imports = [...readEntry('flmauto.js').matchAll(/require\('([^']+)'\)/g)];
  for (const [, name] of imports) assert.ok(manifest.dependencies[name], name);
});

test('delay accepts only positive whole milliseconds supported by Node timers', () => {
  for (const value of ['1', '1000', '2147483647']) {
    assert.equal(delayPrompt.validate(value), true, value);
  }
  for (const value of ['', ' ', 'abc', 'abc1', '1abc', '1.5', '-1', '0', '1e3', 'Infinity', '2147483648']) {
    assert.equal(typeof delayPrompt.validate(value), 'string', JSON.stringify(value));
  }
});
