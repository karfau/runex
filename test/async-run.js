import {test} from 'tap';
import { assertStdout, command } from '../test.command'
import { ExitCode } from '../index'

test('prints the value from Promise when it has been fulfilled', async t => {
  [
    ['via shebang', `./index.js examples/echo-async top`],
    ['via node', `node ./index.js examples/echo-async top`],
    ['via npx', `npx . examples/echo-async top`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(assertStdout(t, t.equals, '["top"]')))
  })
})

test('catches errors from rejected Promise and exits with code', async t => {
  [
    ['via shebang', './index.js examples/echo-async'],
    ['via node', 'node ./index.js examples/echo-async'],
    ['via npx', 'npx . examples/echo-async'],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.doesNotHave(it.stderr, 'UnhandledPromiseRejection', 'no promise rejection in stderr')
        t.contains(it.stderr, 'empty', 'stderr contains error massage')
        t.contains(it.stderr, 'examples/echo-async.js:', 'stderr contains stack trace')
        t.equals(it.code, ExitCode.ExportThrows, 'exit code')
      });
    });
  })
})
