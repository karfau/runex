const childProcess = require('child_process')
/**
 * @type {
 function(string, childProcess.ExecOptionsWithBufferEncoding):
    childProcess.PromiseWithChild<{ stdout: string, stderr: string }>
 }
 */
const exec = require('util').promisify(childProcess.exec)

/**
 * @typedef {childProcess.ExecException & { stdout: string, stderr: string }} CommandResponse
 */

/**
 * Execute a shell command async.
 * The promise is always resolved to simplify writing tests.
 *
 * @param {string} cmd the command to execute
 * @param {childProcess.ExecOptions} [opts={encoding: 'utf8', windowsHide: true}]
 *
 * @return {Promise<CommandResponse>}
 */
export const command = async (cmd, opts) => exec(
  cmd, {encoding: 'utf8', windowsHide: true, ...opts}
).catch(it => it)

/**
 * Creates a function that:
 * Uses `test` to compare `stdout` to `stdoutAssertion`.
 * Also checks values of `it.code` and `it.stderr` to provide more helpful messages
 * in case of test failures.
 *
 * @param {import('tap').Test} t
 * @param {function(string, string|RegExp, string?): Promise<void>} test
 * @param {string | RegExp} stdoutAssertion
 * @param checkStdErr checking empty stderr can be skipped by setting to `false`
 */
export const assertStdout = (
  t, test, stdoutAssertion, checkStdErr = true
) =>
  /** @param {CommandResponse} it */
    ({code, killed, signal, stderr, stdout = 'null'}) => {
    t.assertNot(killed || signal, `command was killed with '${signal}'`);
    t.assertNot(code, `unexpected exit code '${code}'`);
    if (checkStdErr) {
      const stderrSafe = stderr ? stderr.trim() : stderr;
      stderrSafe && t.equals(
        stderrSafe,
        '',
        `unexpected stderr: "${
          stderrSafe.split('\n')[0]
        }${
          stderrSafe.includes('\n') ? '[...]' : ''
        }"`
      );
    }
    test(stdout.trim(), stdoutAssertion, 'expected stdout');
  }
