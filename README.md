[![npm](https://img.shields.io/npm/v/runex)](https://www.npmjs.com/package/runex)
[![dependencies status](https://david-dm.org/karfau/runex.svg)](https://david-dm.org/karfau/runex)

[![codecov](https://codecov.io/gh/karfau/runex/branch/master/graph/badge.svg)](https://codecov.io/gh/karfau/runex)

# runex

Run module export as a `node` or `npx` script.

(See [Why not ...](#why-not-) for alternative approaches.)

## When to use

So you have some code that you want to be able to run from the command line.
You can of course just write it down into a file and run it with `node ./script.js`.
Maybe you go one more step and add a [hashbang](https://en.wikipedia.org/wiki/Hashbang) and make it executable,
so on a linux shell you run it with just `./script.js`.
But this way you can not import the file without executing all the code.
Wrapping all the code into a function and executing it `if (require.main === module)` helps with that.
You also manage to parse those arguments you need, maybe using one of the available libraries.

- Are you able to also call your function from code with those arguments? 
- Do you need to make any async call (like making a request to an API)?
- What about error handling: `try {...} catch (err) {...}` or `.then(...).catch(...)`?
- Do you have/need one script or many scripts?

Don't regret, `runex` was created, because this was just to much time and code 
for something that convenient.

## Goals

1. reduce the amount of code that needs to be written to run a module (a javascript file) as a node script
2. the module does not (need to) have any special code to make it executable,
including support for `async` functions/promises
3. convention over configuration

## How to take advantage

As soon as your module exports a method with the name `run`, it is "runnable":

```
Usage: [npx] runex [options] runnable [args]

Options:
  -r, --require <module>  0..n modules for node to require (default: [])
  -h, --help              output usage information
```

- it receives (just the relevant) arguments (as strings)
- it can be `async` / return a `Promise`
- it can throw (rejected Promises will be treated the same way)
- it is in control of `stdout` (`runex` only communicates over `stderr`), with one exception:
  - if you return a value it will be printed to `stdout` (so you don't have to, see goal)

Go check some [examples](https://github.com/karfau/runex/tree/master/examples).

### But I want my module to be executable

Of course your can make use of `runex` to make your module "executable"
```javascript
if (require.main === module) {
  require('runex').run(module);
}
```
The above code would make the following differences:
- users of your module can write `node [path/to/]module` instead of `node runex [path/to/]module`
- you are able to customize option parsing

## Why not ...

- <https://github.com/DVLP/run-func>:  
This library was my initial inspiration when searching for an existing solution. 
But I think not every function is easy to run as a script
(just think about the type of the arguments, return types, etc.). 
So I decided to rely on a naming convention for the executable function.


- `if (require.main === module) {...}`:  
The "native" way of making a module "executable".  
But the tricky part is what needs to be written instead of `...`, in **every** "executable" module.  
That's why I listed the first [first goal](#goals).  

BTW: `runex` makes use of this mechanism, so you don't need to, [but you can of course have both](#but-i-want-my-module-to-be-executable).

Do you know an alternative that should be listed? Create an issue or PR!
