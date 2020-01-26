/**
 * Helps making things async.
 *
 * @param {number} [ms=100]
 */
const delay = async (ms = 100) => new Promise(resolve => {
  setTimeout(resolve, ms)
});


module.exports = {
  /**
   * The **async** "Hello, world" of a `run` method,
   * it returns all passed arguments as an Array after a short delay.
   * (Runex prints the JSON to stdout by default.)
   *
   * This way tests can check how many arguments have been passed.
   *
   * @returns {Promise<string[]>} The JSON is only provided after a short delay.
   * @throws Rejects with with `Error.message` set to 'empty' if no arguments are passed.
   *
   * Usage:
   * `npx runex examples/echo-async` // throws 'empty'
   * `npx runex examples/echo-async Hello world` // => ["Hello", "world"]
   * `npx runex examples/echo-async 'Hello, world'` // => ["Hello, world"]
   */
  run: async (...args) => delay().then(() => {
    if (args.length === 0) throw new Error('empty');
    return args;
  })
}
