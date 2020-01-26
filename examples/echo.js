module.exports = {
  /**
   * The "Hello, world" of a `run` method,
   * it returns all passed arguments as an Array.
   * (Runex prints the JSON to stdout by default.)
   *
   * This way tests can check how many arguments have been passed.
   *
   * Usage:
   * `npx runex examples/echo` // []
   * `npx runex examples/echo Hello world` // ["Hello", "world"]
   * `npx runex examples/echo 'Hello, world'` // ["Hello, world"]
   */
  run: (...args) => args
}
