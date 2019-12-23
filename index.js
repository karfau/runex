#! /usr/bin/env node
const {join, resolve} = require('path');

const ExitCode = {
  MissingArgument: 1,
  ModuleNotFound: 2,
  InvalidModuleExport: 3
}

/**
 * A Module that exports a method named `run`.
 *
 * @typedef {NodeModule & {run: Function}} RunnableModule
 */

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
  ...require.resolve.paths(moduleNameOrPath).map(dir => join(dir, moduleNameOrPath))
];

/**
 * Attempts to require the items in `possiblePaths` in order
 * and check for the presence of an exported `run` function.
 * The first module found is returned.
 *
 * @param {string[]} possiblePaths
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
const requireRunnable = (possiblePaths) => {
  const errors = [];
  let exitCode = ExitCode.ModuleNotFound;
  for (const candidate of possiblePaths) {
    try {
      const required = require(candidate);
      if (typeof required.run !== 'function') {
        errors.push(`'${candidate}' is a module but has no export named 'run'`);
        exitCode = ExitCode.InvalidModuleExport;
        continue;
      }
      return required;
    } catch (err) {
      errors.push(err.message);
    }
  }
  console.error('No runnable module found:');
  errors.forEach(err => console.error(err));
  process.exit(exitCode);
};

/**
 * Parses a list of commend line arguments.
 *
 * @param {string[]} argv the relevant part of `process.argv`
 * @returns {{args: string[], moduleNameOrPath: string}}
 *
 * @throws {ExitCode.MissingArgument} (exits) in case missing argument for module
 */
const parseArguments = ([moduleNameOrPath, ...args]) => {
  if (moduleNameOrPath === undefined) {
    console.error('You need to specify the module to run');
    process.exit(ExitCode.MissingArgument);
  }
  return {moduleNameOrPath, args};
}

/**
 * The proper way to execute any `run` method including async & error handling.
 *
 * The defaults of argument parsing takes care of slicing `process.argv`,
 * if you pass a your own value, you have to take care of it.
 *
 * @param {RunnableModule} runnable the module to "execute"
 * @param {{args: any[]}} [runArgs] the arguments to pass to `runnable.run`,
 *        by default they are parsed from `process.argv`
 *
 * @see parseArguments
 */
const run = (runnable, {args} = parseArguments(process.argv.slice(2))) => {
  runnable.run(...args);
}

if (require.main === module) {
  const {moduleNameOrPath, args} = parseArguments(process.argv.slice(2));
  run(requireRunnable(resolveRelativeAndRequirePaths(moduleNameOrPath)), {args});
} else {
  module.exports = {
    ExitCode,
    parseArguments,
    resolveModule: requireRunnable,
    run
  }
}
