import { resolve } from 'path'
import { test } from 'tap'

import { ExitCode } from '../index'

import { command } from '../test.command'

test('exits when no arguments are provided', async t => {
  [
    ['via shebang', './index.js'],
    ['via node', 'node ./index.js'],
    ['via npx', 'npx .'],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(it => {
      t.contains(it.stderr, 'argument', 'should communicate to stderr')
      t.equals(it.code, ExitCode.MissingArgument, 'exit code')
    }))
  })
})

/**
 * possible causes:
 * - file not existing (extensions might added by node/ts-node)
 * - requiring the file throws (e.g. syntax error) => TODO: shortened error message not ideal
 */
test('exits when module can not be required', async t => {
  [
    ['via shebang', './index.js not-existing'],
    ['via node', 'node ./index.js not-existing'],
    ['via npx', 'npx . not-existing'],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(it => {
      t.contains(it.stderr, resolve('not-existing'), 'stderr should contain abs path')
      t.contains(it.stderr, 'node_modules/not-existing\'', 'stderr should contain node module folder')
      t.equals(it.code, ExitCode.ModuleNotFound, 'exit code')
    }))
  })
})

test('exits when module does not export function named run', async t => {
  const script = 'script.js'
  const scriptPath = require('path').join(t.testdir({[script]: 'module.exports = {};'}), script);
  [
    ['via shebang', `./index.js ${scriptPath}`],
    ['via node', `node ./index.js ${scriptPath}`],
    ['via npx', `npx . ${scriptPath}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(it => {
      t.match(it.stderr, 'export')
      t.match(it.stderr, script)
      t.equals(it.code, ExitCode.InvalidModuleExport, 'exit code')
    }))
  })
})

test('exits when exported function throws directly', async t => {
  const script = 'script.js'
  const scriptPath = require('path').join(t.testdir({
    [script]: `module.exports = {
  run: () => {
    throw new Error("ouch");
  }
};`
  }), script);
  [
    ['via shebang', `./index.js ${scriptPath}`],
    ['via node', `node ./index.js ${scriptPath}`],
    ['via npx', `npx . ${scriptPath}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(it => {
      t.contains(it.stderr, 'ouch')
      t.contains(it.stderr, script)
      t.equals(it.code, ExitCode.ExportThrows, 'exit code')
    }))
  })
})
