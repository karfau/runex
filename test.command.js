const exec = require('util').promisify(require('child_process').exec)
/**
 * Execute a shell command async.
 * The promise is always resolved to simplify writing tests.
 */
export const command = async (cmd, opts) => exec(
  cmd, {encoding: 'utf8', windowsHide: true, timeout: 1000, ...opts}
).catch(it => it)

/**
 * Creates a function that:
 * Uses `test` to compare `stdout` to `stdoutAssertion`.
 * Also checks values of `it.code` and `it.stderr` to provide more helpful messages
 * in case of test failures.
 *
 * @param {ReturnType<typeof require('tap').test>} t
 * @param {Function} test
 * @param {string | RegExp} stdoutAssertion
 * @param checkStdErr checking empty stderr can be skipped by setting to `false`
 */
export const assertStdout = (
  t, test, stdoutAssertion, checkStdErr = true
) =>
  /** @param {{code?: number, stdout: string, stderr: string}} it */
    ({code, stderr, stdout}) => {
    code && t.assertNot(code, `unexpected exit code '${code}'`);
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
