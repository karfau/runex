#! /usr/bin/env node
const {ExitCode} = require('./constants')

const [/*node*/, /*self*/, ...args] = process.argv;
if (args.length === 0) {
  console.error('stderr')
  process.exit(ExitCode.MissingArgument)
}
const moduleNameOrPath = args[0];
let _module;
try {
  _module = require(moduleNameOrPath);
} catch (e) {
  console.error(e.stack);
  process.exit(ExitCode.ModuleNotFound)
}
if (typeof _module.run !== 'function') {
  console.error(moduleNameOrPath, 'is not exporting a function named "run"');
  process.exit(ExitCode.InvalidModuleExport)
}
