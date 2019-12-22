#! /usr/bin/env node
const {ExitCode} = require('./constants')
const {resolve} = require('path');

const [/*node*/, /*self*/, moduleNameOrPath, ...args] = process.argv;
if (moduleNameOrPath === undefined) {
  console.error('stderr')
  process.exit(ExitCode.MissingArgument)
}
let _module;
try {
  _module = require(resolve(moduleNameOrPath));
} catch (e) {
  console.error(e.stack);
  process.exit(ExitCode.ModuleNotFound)
}
if (typeof _module.run !== 'function') {
  console.error(moduleNameOrPath, 'is not exporting a function named "run"');
  process.exit(ExitCode.InvalidModuleExport)
}
_module.run(...args);
