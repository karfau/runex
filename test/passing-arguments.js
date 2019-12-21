import { test } from 'tap'

import { command } from '../command'

test('calls run method and passes single argument', async t => {
  const args = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const argsJoined = args.join(' ');
  [
    ['via shebang', `./index.js ./examples/echo '${argsJoined}'`],
    ['via node', `node ./index.js ./examples/echo '${argsJoined}'`],
    ['via npx', `npx . ./examples/echo '${argsJoined}'`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.stdout.trim(), JSON.stringify([argsJoined]))
      })
    })
  })
})

test('calls run method and passes arguments', async t => {
  const args = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const argsJoined = args.join(' ');
  const strings = args.map(it => it.toString());
  [
    ['via shebang', `./index.js ./examples/echo ${argsJoined}`],
    ['via node', `node ./index.js ./examples/echo ${argsJoined}`],
    ['via npx', `npx . ./examples/echo ${argsJoined}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.stdout.trim(), JSON.stringify(strings))
      })
    })
  })
})
