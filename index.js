#! /usr/bin/env node
const {Command} = require('commander')
const {join, resolve} = require('path')

/**
 * The possible exit codes runex will use to distinguish different causes.
 * Exit code 1 is not used because it can also come from many other sources.
 */
const ExitCode = {
  /** A required argument is missing or parsing options failed. */
  MissingArgument: 2,
  /** The module to run could not be resolved. */
  ModuleNotFound: 4,
  /** The module to run could be resolved, but it doesn't export `run`. */
  InvalidModuleExport: 8,
  /** Executing `runnable.run` threw an exception of the returned Promise was rejected. */
  ExportThrows: 16
}

/**
 * List of path to check for `require`-able modules. Relative path comes first.
 *
 * @param {string} moduleNameOrPath a relative path or node module name
 * @returns {string[]} the absolute paths of module locations
 *
 * @see path.resolve
 * @see require.resolve.paths
 */
const resolveRelativeAndRequirePaths = (moduleNameOrPath) => [
  resolve(moduleNameOrPath),
  ...(require.resolve.paths(moduleNameOrPath) || []).map(dir => join(dir, moduleNameOrPath))
]

/**
 * Attempts to require the items in `possiblePaths` in order
 * and check for the presence of an exported `run` function.
 * The first module found is returned.
 *
 * @param {string[]} possiblePaths
 * @param {Options} opts the options from `parseArguments`
 * @param {NodeRequire} [_require] the require to use for --register option,
 *        by default the regular `require` is used.
 * @returns {RunnableModule}
 *
 * @throws {
 *   ExitCode.ModuleNotFound
 * } (exits) when no item in `possiblePaths` points to a module
 * @throws {
 *   ExitCode.InvalidModuleExport
 * } (exits) when no required module in `possiblePaths` provides `run` export
 *
 * @see resolveRelativeAndRequirePaths
 */
const requireRunnable = (
  possiblePaths, opts, _require = require
) => {
  for (const hook of opts.require) {
    _require(hook)
  }

  const errors = []
  let exitCode = ExitCode.ModuleNotFound
  for (const candidate of possiblePaths) {
    try {
      const required = _require(candidate)
      if (typeof required.run !== 'function') {
        errors.push(`'${candidate}' is a module but has no export named 'run'`)
        exitCode = ExitCode.InvalidModuleExport
        continue
      }
      return required
    } catch (err) {
      errors.push(err.message)
    }
  }
  console.error('No runnable module found:')
  errors.forEach(err => console.error(err))
  process.exit(exitCode)
}

/**
 * Collects all distinct values, order is not persisted
 *
 * @param {string} value
 * @param {string[]} prev
 * @returns {string[]}
 */
const collectDistinct = (value, prev) => [...new Set(prev).add(value).values()]

/**
 * Returns a function that, when called (without any arguments)
 * will print the usage/help and call `process.exit(code)`.
 *
 * @param {Command} commander the commander instance to call `outputHelp` on.
 * @param {number} code the exit code to use
 * @return {function(): never}
 */
const exitWithUsage = (commander, code) => () => {
  commander.outputHelp()
  process.exit(code)
}

/**
 * Parses a list of commend line arguments.
 *
 * If you are invoking it make sure to slice/remove anything that's not relevant for `runex`.
 *
 * @param {string[]} argv the relevant part of `process.argv`
 * @returns {{args: string[], moduleNameOrPath: string, opts: Options}}
 *
 * @throws {ExitCode.MissingArgument} (exits) in case missing argument for module
 */
const parseArguments = (argv) => {
  const commander = new Command('[npx] runex');
  const exitOnMissingArgument = exitWithUsage(commander, ExitCode.MissingArgument)
  commander.usage('[options] runnable [args]')
    .option(
      '-r, --require <module>', '0..n modules for node to require', collectDistinct, []
    )
    .exitOverride(exitOnMissingArgument)
    /** @see https://github.com/tj/commander.js/issues/512 */
    .parse(['', '', ...argv])

  const opts = /** @type {Options} (type cast for tsc aka `as`) */ (commander.opts());
  const [moduleNameOrPath, ...args] = commander.args

  if (moduleNameOrPath === undefined) {
    console.error('Missing argument: You need to specify the module to run.')
    exitOnMissingArgument();
  }
  return {args, moduleNameOrPath, opts}
}

/**
 * The proper way to execute any `run` method including async & error handling.
 *
 * The defaults of argument parsing takes care of slicing `process.argv`,
 * if you pass a your own value, you have to take care of it.
 *
 * @param {RunnableModule} runnable the module to "execute"
 * @param {{args: any[], opts: Options}} [runArgs] the arguments to pass to `runnable.run`,
 *        by default they are parsed from `process.argv`
 *
 * @see parseArguments
 */
const run = (
  runnable, {args} = parseArguments(process.argv.slice(2))
) => {
  return new Promise(resolve => {
    resolve(runnable.run(...args))
  }).catch(err => {
    console.error(err)
    process.exit(ExitCode.ExportThrows)
  })
}

if (module === /** @type {NodeModule | typeof module} */(require.main)) {
  const p = parseArguments(process.argv.slice(2))
  const runnable = requireRunnable(
    resolveRelativeAndRequirePaths(p.moduleNameOrPath),
    p.opts
  )
  run(runnable, p)
    .then(value => {
      if (value !== undefined) console.log(value)
    })
} else {
  module.exports = {
    collectDistinct,
    ExitCode,
    exitWithUsage,
    parseArguments,
    requireRunnable,
    resolveRelativeAndRequirePaths,
    run
  }
}

/**
 * A Module that exports a method named `run`.
 *
 * @typedef {NodeModule & {run: Function}} RunnableModule
 */

/**
 * Available CLI options for runex.
 *
 * Usage information: `npx runex -h|--help`
 *
 * @typedef {{
 *   require: string[]
 * }} Options
 */
