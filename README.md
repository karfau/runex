# runex
Run module export as a script

## Goals

- reduce the amount of code that needs to be written to run a module (a javascript file) as a node script
- the module does not have any special code to make it executable
- convention over configuration
- support for `async` functions/promises

## Usage

TBD

## Why not ...

- https://github.com/DVLP/run-func:  
This library was my initial inspiration when searching for an existing solution. 
But I think not every function is easy to run as a script (just think about the type of the arguments, return types, etc.). 
So I decided to rely on a naming convention for the executable function.

Do you know an alternative that should be listed? Create an issue or PR!
