/**
 * Requires ts-node for being runnable which can be added by calling
 *
 * `npx runex -r ts-node/register examples/sum.ts` => 0
 * `npx runex -r ts-node/register examples/sum.ts 1 2.5` => 3.5
 *
 */
export const run = (...args: string[]) => {
  return args.map(parseFloat).reduce((sum, cur) => sum + cur, 0);
};
