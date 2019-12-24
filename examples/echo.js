module.exports = {
  /**
   * The "Hello, world" of a `run` method, it uses `JSON.stringify`
   * on all passed arguments, so it is more easy to see how many arguments have been passed.
   * (This way it is more easy to parse the output with other shell tools like `jq`.)
   *
   * Usage:
   * `npx runex examples/echo` // []
   * `npx runex examples/echo Hello world` // ["Hello", "world"]
   * `npx runex examples/echo 'Hello, world'` // ["Hello, world"]
   */
  run: (...args) => {
    console.log(JSON.stringify(args));
  }
}
