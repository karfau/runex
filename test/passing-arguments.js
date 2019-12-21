import { test } from 'tap'

import { command } from '../command'

test('calls run method and passes arguments', async t => {
  const runArgs = '1 2 3 4 5 6 7 8 9 0';
  [
    ['via shebang', `./index.js ./examples/echo ${runArgs}`],
    ['via node', `node ./index.js ./examples/echo ${runArgs}`],
    ['via npx', `npx . ./examples/echo ${runArgs}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => {
      return command(cmd).then(it => {
        t.match(it.stdout.trim(), runArgs);
      });
    });
  })
})
