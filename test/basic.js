const {test} = require('tap');
const {command: raw} = require('execa');

const command = (cmd, opts) => raw(cmd, opts).catch(it => it);

test('exits when no arguments are provided', async t => {
  t.test('via shebang', async t => {
    return command('./index.js').then(it => {
      t.match(it.exitCode, 2, 'non zero exit code');
      t.ok(it.stderr, 'should communicate to stderr');
    });
  });

  t.test('via node', async t => {
    return command('node ./index.js').then(it => {
      t.match(it.exitCode, 2, 'non zero exit code');
      t.ok(it.stderr, 'should communicate to stderr');
    });
  });

  t.test('via npx', async t => {
    return command('npx .').then(it => {
      t.match(it.exitCode, 2, 'non zero exit code');
      t.ok(it.stderr, 'should communicate to stderr');
    });
  });
});
