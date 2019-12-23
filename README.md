# runex

Run module export as a `node` or `npx` script.

(See [Why not ...](#why-not-) for alternative approaches.)

## Goals

- reduce the amount of code that needs to be written to run a module (a javascript file) as a node script
- the module does not (need to) have any special code to make it executable
- convention over configuration
- support for `async` functions/promises

## Usage

TBD

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
