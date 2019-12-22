import {resolve} from 'path';
import { test } from 'tap'

import { ExitCode } from '../constants'

import { command } from '../test.command'

test('exits when no arguments are provided', async t => {
  [
    ['via shebang', './index.js'],
    ['via node', 'node ./index.js'],
    ['via npx', 'npx .'],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.code, ExitCode.MissingArgument, 'exit code')
        t.ok(it.stderr, 'should communicate to stderr')
      });
    });
  })
})

test('exits when module can not be resolved', async t => {
  [
    ['via shebang', './index.js not-existing'],
    ['via node', 'node ./index.js not-existing'],
    ['via npx', 'npx . not-existing'],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.code, ExitCode.ModuleNotFound, 'exit code')
        t.match(it.stderr, resolve('not-existing'), 'should list abs path to stderr');
        t.match(it.stderr, "'not-existing'", 'should list package name to stderr')
      });
    });
  })
})

test('exits when module does not export function named run', async t => {
  const script = 'script.js';
  const scriptPath = require('path').join(t.testdir({[script]: 'module.exports = {};'}), script);
  [
    ['via shebang', `./index.js ${scriptPath}`],
    ['via node', `node ./index.js ${scriptPath}`],
    ['via npx', `npx . ${scriptPath}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.code, ExitCode.InvalidModuleExport, 'exit code')
        t.match(it.stderr, 'export')
        t.match(it.stderr, script)
      });
    });
  })
})
