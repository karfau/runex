import { existsSync } from 'fs'
import { join } from 'path'
import { test } from 'tap'

import { assertStdout, command } from '../test.command'

/**
 * Checking npx integration:
 * Since we want to test the current code (not what npx would install from npm),
 * we install the local project into a sub folder.
 *
 * It tests that npx uses the `runex` binary installed by this package
 * to execute the script that is part of the example.
 *
 * Since I was not able to run `npm i` as part of the test,
 * it is currently configured in `pretest`.
 *
 * @see examples/npx-require
 * @see examples/num-args
 */

test('"npx runex" works as expected', async t => {
  t.ok(
    existsSync(join('examples', 'num-args', 'node_modules')),
    `./examples/num-args/node_modules existing`
  );
  return command(
    'npx runex ./num-args.js a b', {cwd: 'examples/num-args'}
  ).then(assertStdout(t, t.match, '2'));
})

test('"npx runex -r ts-node/register" works when ts-node is installed in local node-modules', async t => {
  t.ok(existsSync('runex.tgz'), 'runex.tgz existing');
  return command(
    'npm run test', {cwd: 'examples/npx-require'}
  ).then(assertStdout(t, t.match, '2'));
})
