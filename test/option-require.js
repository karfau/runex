import td from 'testdouble'
import { test } from 'tap'
import { ExitCode, parseArguments, requireRunnable } from '../index'
import { assertStdout, command } from '../test.command'

test('parseArguments provides opts.require', async t => {
  [
    '--require hook', '--require=hook', '-r hook', '-r=hook'
  ].forEach(option => t.test(`when passing "${option}"`, async t =>
    t.matches(
      parseArguments(`${option} runnable`.split(' ')).opts,
      {require: ['hook']}
    )
  ))

  t.test(
    'when --require option is not passed',
    async t => t.matches(parseArguments([`runnable`]).opts, {require: []})
  )

  const modules = ['one', 'two']
  const multiple = modules.map(m => `-r ${m}`).join(' ')
  t.test(`when passing "${multiple}"`, async t => t.matches(
    parseArguments(`${multiple} runnable`.split(' ')).opts,
    {require: modules}
  ))
})

test('requireRunnable requires from opts.require', async t => {

  const _require = td.func('_require')
  _require['resolve'] = td.func('_require.resolve')
  td.when(_require('runnable')).thenReturn({run: () => {}})
  const modules = ['a', 'b']
  modules.forEach((hook) => {
    td.when(_require['resolve'](hook, {paths: ['.']})).thenReturn(`resolved/${hook}`)
  })

  requireRunnable(['runnable'], {require: modules}, /** @type {NodeRequire} */(_require))

  t.matches(td.explain(_require).calls.map(it => it.args[0]), [
    ...modules.map(hook => `resolved/${hook}`), 'runnable'
  ])
})

test('invalid options', async t => {
  [
    ['via shebang', `./index.js -r examples/echo`],
    ['via node', `node ./index.js -r`]
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(it => {
      t.contains(it.stderr, 'argument', 'should communicate to stderr')
      t.equals(it.code, ExitCode.MissingArgument, 'exit code')
    }))
  })
})

test('integration with ts-node', async t => {
  const args = [409, 410, 4111]
  const argsJoined = args.join(' ');
  [
    ['via shebang', `./index.js -r ts-node/register examples/sum ${argsJoined}`],
    ['via node', `node ./index.js -r ts-node/register examples/sum ${argsJoined}`],
    ['via npx', `npx . -r ts-node/register examples/sum ${argsJoined}`],
  ].forEach(([msg, cmd]) => {
    t.test(msg, async t => command(cmd).then(
      assertStdout(t, t.equals, '4930')
    ))
  })
})

