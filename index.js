#! /usr/bin/env node
const {ExitCode} = require('./constants')
const {resolve} = require('path');

const resolveModule = (moduleNameOrPath) => {
  let _module;
  const modulePathAbs = resolve(moduleNameOrPath)
  try {
    _module = require(modulePathAbs)
  } catch (errAbs) {
    try {
      // try node resolution
      _module = require(moduleNameOrPath)
    } catch (errNode) {
      console.error(errAbs.message)
      console.error(errNode.message)
      process.exit(ExitCode.ModuleNotFound)
    }
  }

  if (typeof _module.run !== 'function') {
    console.error(moduleNameOrPath, 'is not exporting a function named "run"')
    process.exit(ExitCode.InvalidModuleExport)
  }
  return _module
}

/**
 *
 * @param moduleNameOrPath
 * @param args
 * @returns {{args: *, moduleNameOrPath: *}}
 */
const parseArguments = ([moduleNameOrPath, ...args]) => {
  if (moduleNameOrPath === undefined) {
    console.error('stderr')
    process.exit(ExitCode.MissingArgument)
  }
  return {moduleNameOrPath, args}
}

/**
 * The proper way to execute any `run` method including async & error handling.
 *
 * The defaults of argument parsing takes care of slicing `process.argv`,
 * if you pass a your own value, you have to take care of it.
 *
 * @param {NodeModule & {run: Function}} runnable the module to "execute"
 * @param {{args: any[]}} runArgs the arguments to pass to `runnable.run`,
 *        by default they are parsed from `process.argv`
 *
 * @see parseArguments
 */
const run = (runnable, {args} = parseArguments(process.argv.slice(2))) => {
  runnable.run(...args);
}

if (require.main === module) {
  const {moduleNameOrPath, args} = parseArguments(process.argv.slice(2));
  run(resolveModule(moduleNameOrPath), {args});
} else {
  module.exports = {
    parseArguments,
    resolveModule,
    run
  }
}
