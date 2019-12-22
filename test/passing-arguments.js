import { test } from 'tap'

import { command } from '../test.command'

/**
 * The following assertions rely on the implementation of `../examples/echo:run`
 * to print the `JSON.stringify`ed arguments to stdout.
 *
 * Passing any argument via shell means they are all received as strings,
 * there is no conversion of arguments (other then type coercion done by JS runtime).
 *
 * @see examples/echo.js
 */
test('calls run method without any argument', async t => {
  [
    ['via shebang', `./index.js examples/echo`],
    ['via node', `node ./index.js examples/echo`],
    ['via npx', `npx . examples/echo`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.equal(it.stdout.trim(), '[]')
      })
    })
  })
})

test('calls run method and passes single argument', async t => {
  const argsJoined = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join(' ');
  [
    ['via shebang', `./index.js examples/echo '${argsJoined}'`],
    ['via node', `node ./index.js examples/echo '${argsJoined}'`],
    ['via npx', `npx . examples/echo '${argsJoined}'`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.stdout.trim(), `["${argsJoined}"]`)
      })
    })
  })
})

test('calls run method and passes arguments', async t => {
  const args = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const argsJoined = args.join(' ');
  [
    ['via shebang', `./index.js examples/echo ${argsJoined}`],
    ['via node', `node ./index.js examples/echo ${argsJoined}`],
    ['via npx', `npx . examples/echo ${argsJoined}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.stdout.trim(), '["0","1","2","3","4","5","6","7","8","9"]')
      })
    })
  })
})
