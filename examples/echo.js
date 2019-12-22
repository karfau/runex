module.exports = {
  /**
   * The "Hello, world" of a `run` method, just that is uses `JSON.stringify`
   * on all passed arguments, so it is more easy to see how many arguments have been passed.
   *
   * THis way it is of course also more easy to parse the output with other shell tools like `jq`.
   *
   * Usage:
   * `npx runex examples/echo` // []
   * `npx runex examples/echo Hello world` // ["Hello", "world"]
   * `npx runex examples/echo 'Hello, world'` // ["Hello, world"]
   */
  run: function (...args) {
    console.log(JSON.stringify(args));
  }
}
