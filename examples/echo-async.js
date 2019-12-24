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
   * The **async** "Hello, world" of a `run` method, it uses `JSON.stringify`
   * on all passed arguments, so it is more easy to see how many arguments have been passed.
   * (This way it is more easy to parse the output with other shell tools like `jq`.)
   *
   * @returns {Promise<string>} The JSON is only provided after a short delay.
   *          Rejects with with `Error.message` set to 'empty' if no arguments are passed.
   *
   * Usage:
   * `npx runex examples/echo-async` // => []
   * `npx runex examples/echo-async Hello world` // => ["Hello", "world"]
   * `npx runex examples/echo-async 'Hello, world'` // => ["Hello, world"]
   */
  run: async (...args) => delay().then(() => {
    if (args.length === 0) throw new Error('empty');
    return JSON.stringify(args);
  })
}
