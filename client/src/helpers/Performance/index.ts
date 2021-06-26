import {forEach} from 'lodash';

interface benchmarkTimes {
  // the context
  [key: string]: {
    // the function
    [key: string]: {
      averageCallTime: number;
      elapsedMilliseconds: number;
      numberOfCalls: number;
    };
  };
}

const times: benchmarkTimes = {};

/**
 * Utility function to benchmark the emulator.
 */
const logBenchmarks = (): void => {
  forEach(times, (functions: unknown, group: unknown) => {
    console.log(
      `%cPerformance of ${group}:`,
      'color:#8217ab; font-weight: bold'
    );
    console.table(functions);
  });
};

const benchmark = (func: Function, context: object | null = null): any => {
  const className = context ? context.constructor.name : 'Helpers';
  return (...args: Array<unknown>): void | byte => {
    // benchmark random calls
    if (Math.random() * 1000 <= 5) {
      const t1 = performance.now();
      const value = func(...args);
      const t2 = performance.now();
      if (!times[className]) times[className] = {};
      if (!times[className][func.name]) {
        times[className][func.name] = {
          averageCallTime: t2 - t1,
          elapsedMilliseconds: t2 - t1,
          numberOfCalls: 1,
        };
      } else {
        const {elapsedMilliseconds, numberOfCalls} = times[className][
          func.name
        ];
        times[className][func.name].elapsedMilliseconds += t2 - t1;
        times[className][func.name].numberOfCalls += 1;
        times[className][func.name].averageCallTime =
          elapsedMilliseconds / numberOfCalls;
      }
      return value;
    }
    return func(...args);
  };
};

const benchmarksEnabled = true;

export default benchmark;
export {logBenchmarks, benchmarksEnabled};
