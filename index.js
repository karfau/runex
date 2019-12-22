#! /usr/bin/env node
const {ExitCode} = require('./constants')
const {resolve} = require('path');

const [/*node*/, /*self*/, moduleNameOrPath, ...args] = process.argv;
if (moduleNameOrPath === undefined) {
  console.error('stderr')
  process.exit(ExitCode.MissingArgument)
}
let _module;
const modulePathAbs = resolve(moduleNameOrPath);
try {
  _module = require(modulePathAbs);
} catch (errAbs) {
  try {
    // try node resolution
    _module = require(moduleNameOrPath);
  } catch (errNode) {
    console.error(errAbs.message);
    console.error(errNode.message);
    process.exit(ExitCode.ModuleNotFound)
  }
}

if (typeof _module.run !== 'function') {
  console.error(moduleNameOrPath, 'is not exporting a function named "run"');
  process.exit(ExitCode.InvalidModuleExport)
}
_module.run(...args);
