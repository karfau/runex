const exec = require('util').promisify(require('child_process').exec)
/**
 * Execute a shell command async.
 * The promise is always resolved to simplify writing tests.
 */
export const command = async (cmd, opts) => exec(
  cmd, {encoding: 'utf8', windowsHide: true, timeout: 1000, ...opts}
).catch(it => it)
