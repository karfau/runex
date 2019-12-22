import { existsSync } from 'fs'
import { join } from 'path'
import { test } from 'tap'

import { command } from '../test.command'

const cwd = './examples/num-args'

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
 * @see examples/num-args
 */
/*
test(`${cwd} setup`, async t => {
  return command('npm setup', {cwd}).then(it => {
    t.equals(it.stderr.trim(), '', 'stderr should be empty');
    t.assertNot(it.code, 'npm install exit code');
    console.log('1st stdout', it.stdout);
  });
  t.ok(existsSync(join(cwd, 'node_modules')), 'node_modules existing');
});
*/

test('"npx runex" works as expected', async t => {
  t.ok(existsSync(join(cwd, 'node_modules')), `${cwd}/node_modules existing`);
  return command('npx runex ./num-args.js a b', {cwd}).then(it => {
    t.equals(it.stderr.trim(), '', 'stderr should be empty');
    t.assertNot(it.code, 'npx exit code');
    t.match(it.stdout.trim(), '2', 'expected stdout');
  });
})
